/*
** EPITECH PROJECT, 2025
** EPI BOOKING
** File description:
** My Bookings Page
*/

"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Board, { Column, Action } from '@/components/sections/Board';
import styles from "../../page.module.css";
import { getMyBookings, deleteBooking } from '@/api/backend/bookings';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const TYPE_LABELS: Record<string, string> = {
    MEETING: 'Meeting',
    WORK: 'Work',
    KICK_OFF: 'Kick-off',
    BOOTHING: 'Boothing',
    WORKSHOP: 'Workshop',
    TALK: 'Talk',
    UNEXPECTED: 'Autre'
};

const TYPE_COLORS: Record<string, string> = {
    MEETING: 'bg-green-100 text-green-700',
    WORK: 'bg-blue-100 text-blue-700',
    KICK_OFF: 'bg-sky-100 text-sky-700',
    BOOTHING: 'bg-purple-100 text-purple-700',
    WORKSHOP: 'bg-yellow-100 text-yellow-700',
    TALK: 'bg-cyan-100 text-cyan-700',
    UNEXPECTED: 'bg-red-100 text-red-700',
};

export default function BookingsPage() {
    const router = useRouter();
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<any | null>(null);

    useEffect(() => {
        fetchMyBookings();
    }, []);

    const fetchMyBookings = async () => {
        try {
            setLoading(true);
            const data = await getMyBookings();
            const mappedData = Array.isArray(data) ? data.map((b: any) => ({
                id: b.id,
                title: b.title,
                description: b.description,
                type: b.type,
                startDate: new Date(b.startDate),
                endDate: new Date(b.endDate),
                room: {
                    id: b.room?.id,
                    name: b.room?.name,
                    floor: b.room?.floor,
                    capacity: b.room?.capacity,
                },
                createdAt: b.createdAt,
            })) : [];

            setBookings(mappedData);
            setError(null);
        } catch (err: any) {
            console.error('Error fetching bookings:', err);
            setError('Impossible de charger vos réservations');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (booking: any) => {
        setSelectedBooking(booking);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!selectedBooking)
            return;

        try {
            const token = localStorage.getItem('token');
            await deleteBooking(selectedBooking.id);
            setBookings(bookings.filter(b => b.id !== selectedBooking.id));
            setIsDeleteModalOpen(false);
            setSelectedBooking(null);
        } catch (err: any) {
            console.error('Error deleting booking:', err);
            alert("Erreur: Vous ne pouvez pas supprimer cette réservation.");
        }
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setSelectedBooking(null);
    };

    const handleView = (booking: any) => {
        router.push(`/bookings/${booking.id}`);
    };

    const columns: Column<any>[] = [
        {
            key: 'title',
            label: 'Titre',
            width: '20%',
        },
        {
            key: 'type',
            label: 'Type',
            width: '12%',
            render: (booking: any) => {
                const typeLabel = TYPE_LABELS[booking.type] || booking.type;
                const typeColor = TYPE_COLORS[booking.type] || TYPE_COLORS.OTHER;
                return (
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${typeColor}`}>
                        {typeLabel}
                    </span>
                );
            },
        },
        {
            key: 'room.name',
            label: 'Salle',
            width: '15%',
            render: (booking: any) => (
                <div className="flex flex-col">
                    <span className="font-semibold text-gray-900">{booking.room?.name || '-'}</span>
                    <span className="text-xs text-gray-500">Étage {booking.room?.floor || '-'}</span>
                </div>
            ),
        },
        {
            key: 'startDate',
            label: 'Début',
            width: '18%',
            render: (booking: any) => (
                <div className="flex flex-col">
                    <span className="font-semibold text-gray-900">
                        {format(new Date(booking.startDate), 'dd MMM yyyy', { locale: fr })}
                    </span>
                    <span className="text-xs text-gray-500">
                        {format(new Date(booking.startDate), 'HH:mm', { locale: fr })}
                    </span>
                </div>
            ),
        },
        {
            key: 'endDate',
            label: 'Fin',
            width: '18%',
            render: (booking: any) => (
                <div className="flex flex-col">
                    <span className="font-semibold text-gray-900">
                        {format(new Date(booking.endDate), 'dd MMM yyyy', { locale: fr })}
                    </span>
                    <span className="text-xs text-gray-500">
                        {format(new Date(booking.endDate), 'HH:mm', { locale: fr })}
                    </span>
                </div>
            ),
        },
        {
            key: 'description',
            label: 'Description',
            width: '17%',
            sortable: false,
            render: (booking: any) => (
                <span className="text-sm text-gray-600 line-clamp-2">
                    {booking.description || '-'}
                </span>
            ),
        },
    ];

    const actions: Action<any>[] = [
        {
            label: 'Voir',
            icon: 'fi fi-br-eye',
            onClick: handleView,
            variant: 'primary',
        },
        {
            label: 'Annuler',
            icon: 'fi fi-br-cross-circle',
            onClick: handleDelete,
            variant: 'danger',
        },
    ];

    if (error) {
        return (
            <div className={styles.pageWrapper}>
                <div className={styles.canvas}>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                        {error}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.canvas}>
                <Board
                    title="Mes Réservations"
                    data={bookings}
                    columns={columns}
                    actions={actions}
                    loading={loading}
                    emptyMessage="Vous n'avez aucune réservation"
                    searchPlaceholder="Rechercher une réservation..."
                />

                {/* Modal de confirmation d'annulation */}
                {isDeleteModalOpen && selectedBooking && (
                    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-gray-900">
                                    Annuler la réservation
                                </h3>
                                <button
                                    onClick={closeDeleteModal}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <i className="fi fi-br-cross text-xl"></i>
                                </button>
                            </div>

                            <div className="mb-6">
                                <p className="text-gray-700 mb-4">
                                    Êtes-vous sûr de vouloir annuler cette réservation ?
                                </p>
                                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                                    <div className="flex items-start gap-2">
                                        <i className="fi fi-br-document text-blue-600 mt-0.5"></i>
                                        <div>
                                            <span className="text-sm font-semibold text-gray-800">Titre:</span>
                                            <p className="text-sm text-gray-700">{selectedBooking.title}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <i className="fi fi-br-room-service text-blue-600 mt-0.5"></i>
                                        <div>
                                            <span className="text-sm font-semibold text-gray-800">Salle:</span>
                                            <p className="text-sm text-gray-700">{selectedBooking.room?.name || '-'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <i className="fi fi-br-calendar text-blue-600 mt-0.5"></i>
                                        <div>
                                            <span className="text-sm font-semibold text-gray-800">Date:</span>
                                            <p className="text-sm text-gray-700">
                                                {format(new Date(selectedBooking.startDate), 'dd MMM yyyy à HH:mm', { locale: fr })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={closeDeleteModal}
                                    className="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-semibold shadow-sm hover:shadow"
                                >
                                    Retour
                                </button>
                                <button
                                    type="button"
                                    onClick={confirmDelete}
                                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                >
                                    Annuler la réservation
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
