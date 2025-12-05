/*
** EPITECH PROJECT, 2025
** EPI BOOKING
** File description:
** Campus/Rooms management page
*/

"use client";

import { Room } from "@/lib/data";
import { useEffect, useState } from 'react';
import Board, { Column, Action } from '@/components/sections/Board';
import { deleteRoom, setRoomState } from '@/api/rooms';
import { getUserRights } from '@/lib/handleUser';
import { useRouter } from 'next/navigation';
import styles from "../../../page.module.css";
import {
    fetchRooms as fetchRoomsAPI,
    fetchCampus as fetchCampusAPI,
    handleSubmitCreateRoom as submitCreateRoom
} from './campus';

export default function CampusPage() {
    const router = useRouter();
    const [rooms, setRooms] = useState<Room[]>([]);
    const [campus, setCampus] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [createFormData, setCreateFormData] = useState({
        name: '',
        floor: '',
        capacity: '',
        description: '',
    });

    useEffect(() => {
        const rights = getUserRights();
        if (!rights.includes('EDIT_ROOM')) {
            router.push('/');
        }
    }, [router]);

    useEffect(() => {
        fetchRooms();
        fetchCampus();
    }, []);

    const fetchRooms = async () => {
        await fetchRoomsAPI(setRooms, setLoading, setError);
    };

    const fetchCampus = async () => {
        await fetchCampusAPI(setCampus);
    };

    const handleDelete = async (room: Room) => {
        if (!confirm(`Êtes-vous sûr de vouloir supprimer la salle ${room.name} ?`))
            return;
        try {
            const token = localStorage.getItem('token');
            await deleteRoom(room.id, token || '');
            setRooms(rooms.filter(r => r.id !== room.id));
        } catch (err: any) {
            console.error('Error deleting room:', err);
            alert('Erreur lors de la suppression de la salle');
        }
    };

    const handleEdit = (room: Room) => {
        // TODO: Ouvrir un modal d'édition
        console.log('Edit room:', room);
        alert('Fonctionnalité d\'édition à implémenter');
    };

    const handleToggleState = async (room: Room) => {
        try {
            const token = localStorage.getItem('token');
            const newState = room.state === 'RESERVABLE' ? 'NON_RESERVABLE' : 'RESERVABLE';

            await setRoomState(room.id, { state: newState }, token || '');
            setRooms(rooms.map(r => 
                r.id === room.id ? { ...r, state: newState } : r
            ));
        } catch (err: any) {
            console.error('Error updating room state:', err);
            alert('Erreur lors de la mise à jour de l\'état de la salle');
        }
    };

    const handleAdd = () => {
        setCreateFormData({
            name: '',
            floor: '',
            capacity: '',
            description: '',
        });
        setIsCreateModalOpen(true);
    };

    const handleSubmitCreate = async (e: React.FormEvent) => {
        await submitCreateRoom(e, createFormData, fetchRooms, setIsCreateModalOpen, setCreateFormData);
    };

    const handleCloseCreateModal = () => {
        setIsCreateModalOpen(false);
        setCreateFormData({
            name: '',
            floor: '',
            capacity: '',
            description: '',
        });
    };

    const getStateLabel = (state: string) => {
        switch (state) {
            case 'RESERVABLE':
                return { label: 'Réservable', color: 'bg-green-100 text-green-700' };
            case 'NON_RESERVABLE':
                return { label: 'Non réservable', color: 'bg-red-100 text-red-700' };
            case 'UNDER_MAINTENANCE':
                return { label: 'Maintenance', color: 'bg-orange-100 text-orange-700' };
            default:
                return { label: state, color: 'bg-gray-100 text-gray-700' };
        }
    };

    const columns: Column<Room>[] = [
        {
            key: 'name',
            label: 'Nom',
            width: '20%',
        },
        {
            key: 'floor',
            label: 'Étage',
            width: '10%',
        },
        {
            key: 'capacity',
            label: 'Capacité',
            width: '10%',
            render: (room: Room) => (
                <span className="flex items-center gap-1">
                    <i className="fi fi-br-users-alt text-gray-600"></i>
                    {room.capacity}
                </span>
            ),
        },
        {
            key: 'description',
            label: 'Description',
            width: '30%',
            sortable: false,
            render: (room: Room) => room.description || '-',
        },
        {
            key: 'state',
            label: 'État',
            width: '15%',
            sortable: false, 
            render: (room: Room) => {
                const isReservable = room.state === 'RESERVABLE';
                return (
                    <button
                        onClick={() => handleToggleState(room)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                            isReservable  ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'
                        }`}
                    >
                        {isReservable ? 'Réservable' : 'Non réservable'}
                    </button>
                );
            },
        },
        {
            key: 'createdAt',
            label: 'Créé le',
            width: '15%',
            render: (room: Room) => new Date(room.createdAt).toLocaleDateString('fr-FR'),
        },
    ];

    const actions: Action<Room>[] = [
        {
            label: 'Modifier',
            icon: 'fi fi-br-edit',
            onClick: handleEdit,
            variant: 'primary',
        },
        {
            label: 'Supprimer',
            icon: 'fi fi-br-trash',
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
                    title="Campus"
                    data={rooms}
                    columns={columns}
                    actions={actions}
                    onAdd={handleAdd}
                    addButtonLabel="Ajouter une salle"
                    loading={loading}
                    emptyMessage="Aucune salle trouvée"
                    searchPlaceholder="Rechercher une salle..."
                />

                {/* Modal de création */}
                {isCreateModalOpen && (
                    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-gray-900">
                                    Créer une salle
                                </h3>
                                <button
                                    onClick={handleCloseCreateModal}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <i className="fi fi-br-cross text-xl"></i>
                                </button>
                            </div>

                            <form onSubmit={handleSubmitCreate} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-800 mb-1">
                                        Nom de la salle
                                    </label>
                                    <input
                                        type="text"
                                        value={createFormData.name}
                                        onChange={(e) => setCreateFormData({ ...createFormData, name: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                                        required
                                        placeholder="Ex: Salle A101"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-800 mb-1">
                                        Étage
                                    </label>
                                    <input
                                        type="text"
                                        value={createFormData.floor}
                                        onChange={(e) => setCreateFormData({ ...createFormData, floor: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                                        required
                                        placeholder="Ex: 1"
                                        maxLength={10}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-800 mb-1">
                                        Capacité
                                    </label>
                                    <input
                                        type="number"
                                        value={createFormData.capacity}
                                        onChange={(e) => setCreateFormData({ ...createFormData, capacity: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                                        required
                                        placeholder="Ex: 20"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-800 mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        value={createFormData.description}
                                        onChange={(e) => setCreateFormData({ ...createFormData, description: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-500"
                                        rows={3}
                                        placeholder="Description de la salle..."
                                    />
                                </div>

                                <div className="flex gap-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={handleCloseCreateModal}
                                        className="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-semibold shadow-sm hover:shadow"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                    >
                                        Créer
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
