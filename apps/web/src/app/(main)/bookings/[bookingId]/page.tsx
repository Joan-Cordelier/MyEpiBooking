/*
** EPITECH PROJECT, 2025
** EPI BOOKING
** File description:
** Booking detail page
*/

"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getBookingById, deleteBooking, updateBooking } from '@/api/backend/bookings';
import { getAllRooms } from '@/api/backend/rooms';
import { getUserId, hasRight } from '@/lib/handleUser';
import styles from "../../../page.module.css";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Anton } from "next/font/google";

const anton = Anton({ subsets: ["latin"], weight: "400" });

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
    UNEXPECTED: 'bg-red-100 text-red-700'
};

export default function BookingDetailPage() {
    const router = useRouter();
    const params = useParams();
    const bookingId = params.bookingId as string;

    const [booking, setBooking] = useState<any | null>(null);
    const [rooms, setRooms] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    const [deleteError, setDeleteError] = useState<string | null>(null);
    
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: 'MEETING',
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: '',
        roomId: '',
    });

    useEffect(() => {
        if (bookingId) {
            fetchBooking();
            fetchRooms();
        }
    }, [bookingId]);

    const fetchBooking = async () => {
        try {
            setLoading(true);
            const data = await getBookingById(bookingId);
            const startDate = new Date(data.startDate);
            const endDate = new Date(data.endDate);

            setBooking(data);
            setFormData({
                title: data.title || '',
                description: data.description || '',
                type: data.type || 'MEETING',
                startDate: format(startDate, 'yyyy-MM-dd'),
                startTime: format(startDate, 'HH:mm'),
                endDate: format(endDate, 'yyyy-MM-dd'),
                endTime: format(endDate, 'HH:mm'),
                roomId: data.room?.id || '',
            });
            setError(null);
        } catch (err: any) {
            console.error('Error fetching booking:', err);
            setError('Impossible de charger la réservation');
        } finally {
            setLoading(false);
        }
    };

    const fetchRooms = async () => {
        try {
            const data = await getAllRooms();

            setRooms(Array.isArray(data) ? data : []);
        } catch (err: any) {
            console.error('Error fetching rooms:', err);
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setFormError(null);
        if (booking) {
            const startDate = new Date(booking.startDate);
            const endDate = new Date(booking.endDate);

            setFormData({
                title: booking.title || '',
                description: booking.description || '',
                type: booking.type || 'MEETING',
                startDate: format(startDate, 'yyyy-MM-dd'),
                startTime: format(startDate, 'HH:mm'),
                endDate: format(endDate, 'yyyy-MM-dd'),
                endTime: format(endDate, 'HH:mm'),
                roomId: booking.room?.id || '',
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);

        try {
            const startDateTime = new Date(`${formData.startDate}T${formData.startTime}:00`);
            const endDateTime = new Date(`${formData.endDate}T${formData.endTime}:00`);
            const payload = {
                title: formData.title,
                description: formData.description,
                type: formData.type,
                startDate: startDateTime.toISOString(),
                endDate: endDateTime.toISOString(),
                roomId: formData.roomId,
            };

            if (endDateTime <= startDateTime) {
                setFormError('La date de fin doit être après la date de début');
                return;
            }
            await updateBooking(bookingId, payload)
            await fetchBooking();
            setIsEditing(false);
        } catch (err: any) {
            const errorMessage = err?.data?.message || err?.message || 'Erreur lors de la modification de la réservation';
            setFormError(errorMessage);
        }
    };

    const handleDelete = () => {
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        setDeleteError(null);
        try {
            await deleteBooking(bookingId);
            router.push('/bookings');
        } catch (err: any) {
            console.error('Error deleting booking:', err);
            const errorMessage = err?.data?.message || err?.message || 'Erreur lors de l\'annulation de la réservation';
            setDeleteError(errorMessage);
        }
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setDeleteError(null);
    };

    if (loading) {
        return (
            <div className={styles.pageWrapper}>
                <div className={styles.canvas}>
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !booking) {
        return (
            <div className={styles.pageWrapper}>
                <div className={styles.canvas}>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                        {error || 'Réservation introuvable'}
                    </div>
                    <button
                        onClick={() => router.push('/bookings')}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                    >
                        Retour aux réservations
                    </button>
                </div>
            </div>
        );
    }

    const typeLabel = TYPE_LABELS[booking.type] || booking.type;
    const typeColor = TYPE_COLORS[booking.type] || TYPE_COLORS.OTHER;
    const currentUserId = getUserId();
    const isOwner = currentUserId && booking.user?.id && currentUserId === booking.user.id;
    const canEditReservation = hasRight('EDIT_RESERVATION');
    const canModify = isOwner || canEditReservation;

    return (
        <div className={styles.pageWrapper}>
            <div className={`${styles.canvas} px-4 sm:px-6 lg:px-8 py-6`}>
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => router.push('/bookings')}
                        className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-white hover:bg-blue-600 border-2 border-blue-600 rounded-lg font-semibold mb-6 transition-all duration-200 group"
                    >
                        <i className="fi fi-br-angle-left text-base leading-none group-hover:-translate-x-1 transition-transform"></i>
                        Retour aux réservations
                    </button>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                        <div className={`${anton.className}`}>
                            <span className="text-blue-700 text-3xl">
                                {!isEditing ? 'DÉTAILS' : 'MODIFIER'}
                            </span>
                            <span className="text-orange-400 text-3xl">_</span>
                        </div>
                        {!isEditing && (
                            <div className="flex flex-wrap gap-3">
                                <button
                                    onClick={handleEdit}
                                    disabled={!canModify}
                                    className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:from-blue-600 disabled:hover:to-blue-700"
                                >
                                    <i className="fi fi-br-pencil text-base leading-none"></i>
                                    Modifier
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={!canModify}
                                    className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-50 hover:border-red-700 transition-all duration-200 font-semibold shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-red-600"
                                >
                                    <i className="fi fi-br-trash text-base leading-none"></i>
                                    Annuler
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Card principale */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">{!isEditing ? (
                        <div className="p-6 space-y-6">
                            {/* Titre et type */}
                            <div className="pb-4 border-b border-gray-200">
                                <h2 className="text-2xl font-bold text-gray-900 mb-3">{booking.title}</h2>
                                <span className={`inline-block px-3 py-1.5 rounded-full text-sm font-semibold ${typeColor}`}>
                                    {typeLabel}
                                </span>
                            </div>

                            {/* Auteur de la réservation */}
                            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Réservé par</label>
                                <div className="flex items-center gap-4">
                                    {booking.user?.photo ? (
                                        <img
                                            src={booking.user.photo}
                                            alt={booking.user.name || 'Utilisateur'}
                                            className="w-14 h-14 rounded-full object-cover border-2 border-blue-300"
                                        />
                                    ) : (
                                        <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center border-2 border-blue-300">
                                            <span className="text-white font-bold text-xl">
                                                {booking.user?.name ? booking.user.name[0].toUpperCase() : booking.user?.firstName ? booking.user.firstName[0].toUpperCase() : '?'}
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <div className="font-bold text-gray-900 text-lg">
                                            {booking.user?.firstName && booking.user?.name 
                                                ? `${booking.user.firstName} ${booking.user.name}`
                                                : booking.user?.firstName || booking.user?.name || 'Utilisateur inconnu'}
                                        </div>
                                        {booking.user?.email && (
                                            <div className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                                                <i className="fi fi-br-envelope text-xs"></i>
                                                {booking.user.email}
                                            </div>
                                        )}
                                        {booking.user?.actual_promotion && (
                                            <div className="text-xs text-blue-700 font-semibold mt-1 bg-blue-100 inline-block px-2 py-0.5 rounded">
                                                {booking.user.actual_promotion}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Informations de la salle */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">Salle</label>
                                    <div className="flex items-center gap-2 text-gray-900">
                                        <i className="fi fi-br-room-service text-blue-600 text-lg"></i>
                                        <span className="font-semibold text-lg">{booking.room?.name || '-'}</span>
                                        <span className="text-gray-500">•</span>
                                        <span className="text-sm text-gray-600">Étage {booking.room?.floor || '-'}</span>
                                    </div>
                                </div>
                                
                                <div className="space-y-1">
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">Capacité</label>
                                    <div className="flex items-center gap-2 text-gray-900">
                                        <i className="fi fi-br-users-alt text-blue-600 text-lg"></i>
                                        <span className="font-semibold text-lg">{booking.room?.capacity || '-'} personnes</span>
                                    </div>
                                </div>
                            </div>

                            {/* Dates */}
                            <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">Début</label>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-gray-900">
                                                <i className="fi fi-br-calendar text-blue-600 text-lg"></i>
                                                <span className="font-semibold">
                                                    {format(new Date(booking.startDate), 'dd MMMM yyyy', { locale: fr })}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-600 pl-7">
                                                <i className="fi fi-br-clock text-sm"></i>
                                                <span className="text-sm font-medium">
                                                    {format(new Date(booking.startDate), 'HH:mm', { locale: fr })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">Fin</label>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-gray-900">
                                                <i className="fi fi-br-calendar text-blue-600 text-lg"></i>
                                                <span className="font-semibold">
                                                    {format(new Date(booking.endDate), 'dd MMMM yyyy', { locale: fr })}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-600 pl-7">
                                                <i className="fi fi-br-clock text-sm"></i>
                                                <span className="text-sm font-medium">
                                                    {format(new Date(booking.endDate), 'HH:mm', { locale: fr })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Description */}
                            <div className="space-y-2">
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">Description</label>
                                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 min-h-[80px]">
                                    <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
                                        {booking.description || 'Aucune description fournie'}
                                    </p>
                                </div>
                            </div>

                            {/* Informations supplémentaires */}
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <i className="fi fi-br-calendar-plus text-blue-600"></i>
                                        <span>Créée le {format(new Date(booking.createdAt), 'dd MMMM yyyy à HH:mm', { locale: fr })}</span>
                                    </div>
                                    {booking.updatedAt && booking.updatedAt !== booking.createdAt && (
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <i className="fi fi-br-edit text-blue-600"></i>
                                            <span>Modifiée le {format(new Date(booking.updatedAt), 'dd MMMM yyyy à HH:mm', { locale: fr })}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {formError && (
                                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 flex items-start gap-3">
                                    <i className="fi fi-br-exclamation text-red-600 text-xl mt-0.5"></i>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-red-900 mb-1">Erreur</h4>
                                        <p className="text-sm text-red-700">{formError}</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setFormError(null)}
                                        className="text-red-400 hover:text-red-600 transition-colors"
                                    >
                                        <i className="fi fi-br-cross"></i>
                                    </button>
                                </div>
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-900 uppercase tracking-wide mb-2">
                                        Titre*
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-900 uppercase tracking-wide mb-2">
                                        Type*
                                    </label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 font-medium"
                                        required
                                    >
                                        <option value="MEETING">Meeting</option>
                                        <option value="WORK">Work</option>
                                        <option value="KICK_OFF">Kick-off</option>
                                        <option value="BOOTHING">Boothing</option>
                                        <option value="WORKSHOP">Workshop</option>
                                        <option value="TALK">Talk</option>
                                        <option value="UNEXPECTED">Autre</option>
                                    </select>
                                </div>
                            
                                <div>
                                    <label className="block text-xs font-bold text-gray-900 uppercase tracking-wide mb-2">
                                        Salle*
                                    </label>
                                    <select
                                        value={formData.roomId}
                                        onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
                                        className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 font-medium"
                                        required
                                    >
                                        <option value="">Sélectionner une salle</option>
                                        {rooms.map((room) => (
                                            <option key={room.id} value={room.id}>
                                                {room.name} - Étage {room.floor} ({room.capacity} places)
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-gray-900 uppercase tracking-wide mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows={4}
                                        className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none text-gray-900"
                                        placeholder="Ajouter une description..."
                                    />
                                </div>
                            
                                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 bg-blue-50 rounded-lg p-5 border-2 border-blue-200">
                                    <div className="space-y-3">
                                        <label className="block text-xs font-bold text-gray-900 uppercase tracking-wide">
                                            <i className="fi fi-br-calendar text-blue-600 mr-1"></i>
                                            Date de début*
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.startDate}
                                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                            className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white text-gray-900 font-medium"
                                            required
                                        />
                                        <label className="block text-xs font-bold text-gray-900 uppercase tracking-wide">
                                            <i className="fi fi-br-clock text-blue-600 mr-1"></i>
                                            Heure*
                                        </label>
                                        <input
                                            type="time"
                                            value={formData.startTime}
                                            onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                            className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white text-gray-900 font-medium"
                                            step="1800"
                                            required
                                        />
                                    </div>
                            
                                    <div className="space-y-3">
                                        <label className="block text-xs font-bold text-gray-900 uppercase tracking-wide">
                                            <i className="fi fi-br-calendar text-blue-600 mr-1"></i>
                                            Date de fin*
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.endDate}
                                            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                            className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white text-gray-900 font-medium"
                                            required
                                        />
                                        <label className="block text-xs font-bold text-gray-900 uppercase tracking-wide">
                                            <i className="fi fi-br-clock text-blue-600 mr-1"></i>
                                            Heure*
                                        </label>
                                        <input
                                            type="time"
                                            value={formData.endTime}
                                            onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                            className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white text-gray-900 font-medium"
                                            step="1800"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        
                            <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t-2 border-gray-200">
                                <button
                                    type="button"
                                    onClick={handleCancelEdit}
                                    className="flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-gray-400 text-gray-700 rounded-lg hover:bg-gray-100 hover:border-gray-500 transition-all duration-200 font-bold shadow-md hover:shadow-lg"
                                >
                                    <i className="fi fi-br-cross text-base leading-none"></i>
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                                >
                                    <i className="fi fi-br-disk text-base leading-none"></i>
                                    Enregistrer les modifications
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                {/* Modal de confirmation d'annulation */}
                {isDeleteModalOpen && (
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
                                            <p className="text-sm text-gray-700">{booking.title}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <i className="fi fi-br-room-service text-blue-600 mt-0.5"></i>
                                        <div>
                                            <span className="text-sm font-semibold text-gray-800">Salle:</span>
                                            <p className="text-sm text-gray-700">{booking.room?.name || '-'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <i className="fi fi-br-calendar text-blue-600 mt-0.5"></i>
                                        <div>
                                            <span className="text-sm font-semibold text-gray-800">Date:</span>
                                            <p className="text-sm text-gray-700">
                                                {format(new Date(booking.startDate), 'dd MMM yyyy à HH:mm', { locale: fr })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 bg-red-50 border-2 border-red-200 rounded-lg p-3">
                                    <p className="text-sm text-red-700 font-bold flex items-center gap-2">
                                        <i className="fi fi-br-exclamation text-red-600"></i>
                                        Cette action est irréversible
                                    </p>
                                </div>
                            </div>

                            {deleteError && (
                                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 flex items-start gap-3">
                                    <i className="fi fi-br-exclamation text-red-600 text-xl mt-0.5"></i>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-red-900 mb-1">Erreur</h4>
                                        <p className="text-sm text-red-700">{deleteError}</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setDeleteError(null)}
                                        className="text-red-400 hover:text-red-600 transition-colors"
                                    >
                                        <i className="fi fi-br-cross"></i>
                                    </button>
                                </div>
                            )}

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    type="button"
                                    onClick={closeDeleteModal}
                                    className="flex-1 flex items-center justify-center gap-2 px-5 py-3 border-2 border-gray-400 text-gray-700 rounded-lg hover:bg-gray-100 hover:border-gray-500 transition-all duration-200 font-bold shadow-md hover:shadow-lg"
                                >
                                    <i className="fi fi-br-angle-left text-base leading-none"></i>
                                    Retour
                                </button>
                                <button
                                    type="button"
                                    onClick={confirmDelete}
                                    className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                                >
                                    <i className="fi fi-br-trash text-base leading-none"></i>
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
