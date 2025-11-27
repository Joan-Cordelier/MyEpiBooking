/*
** EPITECH PROJECT, 2025
** EPI BOOKING
** File description:
** Students (Admin Dashboard) page
*/

"use client";

import { useEffect, useState } from 'react';
import { AVAILABLE_RIGHTS, User } from '@/lib/data';
import Board, { Column, Action } from '@/components/sections/Board';
import { getUserRights } from '@/lib/handleUser';
import { useRouter } from 'next/navigation';
import styles from "../../../page.module.css";
import {
    fetchUsers as fetchUsersAPI,
    fetchCampus as fetchCampusAPI,
    handleDeleteUser,
    handleSubmitEdit as submitEdit,
    handleSubmitRights as submitRights,
    handleSubmitCreate as submitCreate
} from './students';

export default function StudentsPage() {
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [campus, setCampus] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isRightsModalOpen, setIsRightsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [selectedRights, setSelectedRights] = useState<string[]>([]);
    const [userRights, setUserRights] = useState<string[]>([]);
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        firstName: '',
        actual_promotion: '',
        campusId: '',
    });
    const [createFormData, setCreateFormData] = useState({
        email: '',
        name: '',
        firstName: '',
        actual_promotion: '',
        campusId: '',
        password: '',
    });

    useEffect(() => {
        const rights = getUserRights();
        setUserRights(rights);
        if (!rights.includes('EDIT_USER')) {
            router.push('/');
        }
    }, [router]);

    const fetchUsers = async () => {
        await fetchUsersAPI(setUsers, setLoading, setError);
    };

    const fetchCampus = async () => {
        await fetchCampusAPI(setCampus);
    };

    useEffect(() => {
        fetchUsers();
        fetchCampus();
    }, []);

    const handleDelete = async (user: User) => {
        await handleDeleteUser(user, users, setUsers);
    };

    const handleEdit = (user: User) => {
        setSelectedUser(user);
        setFormData({
            email: user.email,
            name: user.name,
            firstName: user.firstName,
            actual_promotion: user.actual_promotion || '',
            campusId: user.campus?.id || '',
        });
        setIsModalOpen(true);
    };

    const handleSubmitEdit = async (e: React.FormEvent) => {
        await submitEdit(e, selectedUser, formData, fetchUsers, setIsModalOpen, setSelectedUser);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
    };

    const handleEditRights = (user: User) => {
        setSelectedUser(user);
        setSelectedRights(user.rights);
        setIsRightsModalOpen(true);
    };

    const handleToggleRight = (right: string) => {
        setSelectedRights(prev =>
            prev.includes(right)
                ? prev.filter(r => r !== right)
                : [...prev, right]
        );
    };

    const handleSubmitRights = async (e: React.FormEvent) => {
        await submitRights(e, selectedUser, selectedRights, fetchUsers, setIsRightsModalOpen, setSelectedUser);
    };

    const handleCloseRightsModal = () => {
        setIsRightsModalOpen(false);
        setSelectedUser(null);
        setSelectedRights([]);
    };

    const handleAdd = () => {
        setCreateFormData({
            email: '',
            name: '',
            firstName: '',
            actual_promotion: '',
            campusId: '',
            password: '',
        });
        setIsCreateModalOpen(true);
    };

    const handleSubmitCreate = async (e: React.FormEvent) => {
        await submitCreate(e, createFormData, fetchUsers, setIsCreateModalOpen, setCreateFormData);
    };

    const handleCloseCreateModal = () => {
        setIsCreateModalOpen(false);
        setCreateFormData({
            email: '',
            name: '',
            firstName: '',
            actual_promotion: '',
            campusId: '',
            password: '',
        });
    };

    const columns: Column<User>[] = [
        {
            key: 'firstName',
            label: 'Prénom',
            width: '15%',
        },
        {
            key: 'name',
            label: 'Nom',
            width: '15%',
        },
        {
            key: 'email',
            label: 'Email',
            width: '20%',
        },
        {
            key: 'actual_promotion',
            label: 'Promotion',
            width: '10%',
            render: (user: User) => user.actual_promotion || '-',
        },
        {
            key: 'campus.name',
            label: 'Campus',
            width: '15%',
            render: (user: User) => user.campus?.name || '-',
        },
        {
            key: 'rights',
            label: 'Droits',
            width: '15%',
            sortable: false,
            render: (user: User) => (
                <div className="flex flex-wrap gap-1">
                    {user.rights.slice(0, 2).map((right, idx) => (
                        <span
                            key={idx}
                            className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                        >
                            {right}
                        </span>
                    ))}
                    {user.rights.length > 2 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                            +{user.rights.length - 2}
                        </span>
                    )}
                </div>
            ),
        },
        {
            key: 'createdAt',
            label: 'Créé le',
            width: '10%',
            render: (user: User) => new Date(user.createdAt).toLocaleDateString('fr-FR'),
        },
    ];

    const actions: Action<User>[] = [
        {
            label: 'Modifier',
            icon: 'fi fi-br-edit',
            onClick: handleEdit,
            variant: 'primary',
        },
        ...(userRights.includes('EDIT_RIGHTS') ? [{
            label: 'Gérer les droits',
            icon: 'fi fi-br-shield-check',
            onClick: handleEditRights,
            variant: 'warning' as const,
        }] : []),
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
                    title="Students"
                    data={users}
                    columns={columns}
                    actions={actions}
                    onAdd={handleAdd}
                    addButtonLabel="Ajouter un étudiant"
                    loading={loading}
                    emptyMessage="Aucun étudiant trouvé"
                    searchPlaceholder="Rechercher un étudiant..."
                />

                {/* Modal d'édition */}
                {isModalOpen && selectedUser && (
                    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-gray-900">
                                    Modifier l'étudiant
                                </h3>
                                <button
                                    onClick={handleCloseModal}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <i className="fi fi-br-cross text-xl"></i>
                                </button>
                            </div>

                            <form onSubmit={handleSubmitEdit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-800 mb-1">
                                        Prénom
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-800 mb-1">
                                        Nom
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-800 mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-800 mb-1">
                                        Promotion
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.actual_promotion}
                                        onChange={(e) => setFormData({ ...formData, actual_promotion: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-500"
                                        placeholder="Ex: Promo 2026"
                                    />
                                </div>

                                {/* Campus auto-assigné depuis l'utilisateur connecté */}

                                <div className="flex gap-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        className="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-semibold shadow-sm hover:shadow"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                    >
                                        Enregistrer
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Modal de création */}
                {isCreateModalOpen && (
                    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-gray-900">
                                    Créer un étudiant
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
                                        Prénom
                                    </label>
                                    <input
                                        type="text"
                                        value={createFormData.firstName}
                                        onChange={(e) => setCreateFormData({ ...createFormData, firstName: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-800 mb-1">
                                        Nom
                                    </label>
                                    <input
                                        type="text"
                                        value={createFormData.name}
                                        onChange={(e) => setCreateFormData({ ...createFormData, name: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-800 mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={createFormData.email}
                                        onChange={(e) => setCreateFormData({ ...createFormData, email: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-800 mb-1">
                                        Mot de passe
                                    </label>
                                    <input
                                        type="password"
                                        value={createFormData.password}
                                        onChange={(e) => setCreateFormData({ ...createFormData, password: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-800 mb-1">
                                        Promotion
                                    </label>
                                    <input
                                        type="text"
                                        value={createFormData.actual_promotion}
                                        onChange={(e) => setCreateFormData({ ...createFormData, actual_promotion: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-500"
                                        placeholder="Ex: Promo 2026"
                                    />
                                </div>

                                {/* Campus auto-assigné depuis l'utilisateur connecté */}

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

                {/* Modal de gestion des droits */}
                {isRightsModalOpen && selectedUser && (
                    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-gray-900">
                                    Gérer les droits
                                </h3>
                                <button
                                    onClick={handleCloseRightsModal}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <i className="fi fi-br-cross text-xl"></i>
                                </button>
                            </div>

                            <div className="mb-4">
                                <p className="text-sm text-gray-800">
                                    <span className="font-semibold">{selectedUser.firstName} {selectedUser.name}</span>
                                </p>
                                <p className="text-xs text-gray-600">{selectedUser.email}</p>
                            </div>

                            <form onSubmit={handleSubmitRights} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-800 mb-3">
                                        Sélectionnez les droits
                                    </label>
                                    {AVAILABLE_RIGHTS.map((right) => (
                                        <label
                                            key={right}
                                            className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedRights.includes(right)}
                                                onChange={() => handleToggleRight(right)}
                                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                            />
                                            <div className="flex-1">
                                                <span className="text-sm font-semibold text-gray-900">
                                                    {right}
                                                </span>
                                                <p className="text-xs text-gray-600">
                                                    {right === 'EDIT_USER' && 'Modifier les utilisateurs'}
                                                    {right === 'EDIT_ROOM' && 'Modifier les salles'}
                                                    {right === 'EDIT_RESERVATION' && 'Modifier les réservations'}
                                                    {right === 'EDIT_RIGHTS' && 'Modifier les droits des utilisateurs'}
                                                    {right === 'BOOK_ROOM' && 'Réserver une salle'}
                                                    {right === 'HOST_MEETING' && 'Organiser une réunion'}
                                                </p>
                                            </div>
                                        </label>
                                    ))}
                                </div>

                                <div className="flex gap-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={handleCloseRightsModal}
                                        className="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-semibold shadow-sm hover:shadow"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                    >
                                        Enregistrer
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
