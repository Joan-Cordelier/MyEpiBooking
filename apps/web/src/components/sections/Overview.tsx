/*
** EPITECH PROJECT, 2025
** EPI BOOKING
** File description:
** Overview component
*/

/*
** EPITECH PROJECT, 2025
** EPI BOOKING
** File description:
** Overview component
*/

'use client';

import { useEffect, useState } from 'react';
import { getAllUsers } from '@/api/backend/user';
import { getAllBookings } from '@/api/backend/bookings';
import { getAllRooms } from '@/api/backend/rooms';
import { getUserCampusId } from '@/lib/handleUser';
import { Anton } from "next/font/google";

const anton = Anton({ subsets: ["latin"], weight: "400" });

interface Stats {
    totalUsers: number;
    totalReservations: number;
    reservableRooms: number;
    nonReservableRooms: number;
    totalRooms: number;
}

interface RoomStats {
    roomName: string;
    bookingCount: number;
    roomId: string;
}

interface KPICardProps {
    title: string;
    value: number;
    icon: string;
    color: string;
}

function KPICard({ title, value, icon, color }: KPICardProps) {    
    return (
        <div className="bg-white rounded-lg shadow-md p-6 flex items-center justify-between hover:shadow-lg transition-shadow">
            <div className="flex-1">
                <p className="text-gray-600 text-sm font-medium mb-1">{title}</p>
                <p className="text-3xl font-bold text-gray-900">{value}</p>
            </div>
            <div className={`w-14 h-14 rounded-full flex items-center justify-center ${color}`}>
                  <i className={`${icon} text-black text-2xl flex items-center justify-center`}></i>
            </div>
        </div>
    );
}

export default function OverviewKPI() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [topRooms, setTopRooms] = useState<RoomStats[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchStats() {
            try {
                setLoading(true);

                const userCampusId = getUserCampusId();

                const [users, bookings, rooms] = await Promise.all([
                    getAllUsers(userCampusId || undefined),
                    getAllBookings(),
                    getAllRooms(userCampusId || undefined)
                ]);

                // Filtrer les utilisateurs par campus côté frontend
                const filteredUsers = userCampusId 
                    ? users.filter((user: any) => user.campusId === userCampusId)
                    : users;

                // Filtrer les salles par campus côté frontend
                const filteredRooms = userCampusId
                    ? rooms.filter((room: any) => room.campusId === userCampusId)
                    : rooms;

                // Filtrer les réservations par les salles du campus
                const roomIds = new Set(filteredRooms.map((room: any) => room.id));
                const filteredBookings = bookings.filter((booking: any) => roomIds.has(booking.roomId));

                const reservableRooms = filteredRooms.filter((room: any) => room.state === 'RESERVABLE').length;
                const nonReservableRooms = filteredRooms.filter((room: any) => room.state !== 'RESERVABLE').length;
                const roomBookingCount: {[key: string]: {name: string; count: number}} = {};

                filteredBookings.forEach((booking: any) => {
                    const roomId = booking.roomId;
                    const room = filteredRooms.find((r: any) => r.id === roomId);

                    if (room) {
                        if (!roomBookingCount[roomId])
                            roomBookingCount[roomId] = {name: room.name, count: 0};
                        roomBookingCount[roomId].count++;
                    }
                });

                const sortedRooms = Object.entries(roomBookingCount)
                    .map(([roomId, data]) => ({
                        roomId,
                        roomName: data.name,
                        bookingCount: data.count
                    }))
                    .sort((a, b) => b.bookingCount - a.bookingCount)
                    .slice(0, 5);

                setTopRooms(sortedRooms);
                setStats({
                    totalUsers: filteredUsers.length,
                    totalReservations: filteredBookings.length,
                    reservableRooms,
                    nonReservableRooms,
                    totalRooms: filteredRooms.length
                });
                setError(null);
            } catch (err: any) {
                console.error('Error fetching stats:', err);
                setError('Impossible de charger les statistiques');
            } finally {
                setLoading(false);
            }
        }

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }
    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                {error}
            </div>
        );
    }

    return (
        <div className="space-y-6 px-6 py-4">
            <div className={`mb-4 ml-2 mt-4 ${anton.className}`}>
                <span className="text-blue-700 text-3xl">OVERVIEW</span>
                <span className="text-orange-400 text-3xl">_</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard
                    title="Utilisateurs"
                    value={stats?.totalUsers || 0}
                    icon="fi fi-br-users-alt"
                    color="bg-blue-100"
                />
                
                <KPICard
                    title="Réservations"
                    value={stats?.totalReservations || 0}
                    icon="fi fi-sr-calendar-check"
                    color="bg-green-100"
                />
                
                <KPICard
                    title="Salles réservables"
                    value={stats?.reservableRooms || 0}
                    icon="fi fi-br-check-circle"
                    color="bg-purple-100"
                />
                
                <KPICard
                    title="Salles non réservables"
                    value={stats?.nonReservableRooms || 0}
                    icon='fi fi-br-do-not-enter'
                    color="bg-orange-100"
                />
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                    Salles les plus réservées
                </h3>
                {topRooms.length > 0 ? (
                    <div className="space-y-4">
                        {topRooms.map((room, index) => {
                            const maxCount = topRooms[0]?.bookingCount || 1;
                            const percentage = (room.bookingCount / maxCount) * 100;
                            const colors = [
                                'bg-blue-500',
                                'bg-green-500',
                                'bg-purple-500',
                                'bg-orange-500',
                                'bg-pink-500'
                            ];
                            
                            return (
                                <div key={room.roomId} className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-3">
                                            <span className="font-semibold text-gray-700 w-6">#{index + 1}</span>
                                            <span className="font-medium text-gray-900">{room.roomName}</span>
                                        </div>
                                        <span className="font-bold text-gray-900">{room.bookingCount} réservation{room.bookingCount > 1 ? 's' : ''}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                        <div 
                                            className={`h-full ${colors[index]} transition-all duration-500 rounded-full`}
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center text-gray-500 py-8">
                        Aucune réservation pour le moment
                    </div>
                )}
            </div>
        </div>
    );
}

