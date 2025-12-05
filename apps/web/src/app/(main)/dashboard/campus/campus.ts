/*
** EPITECH PROJECT, 2025
** EPI BOOKING
** File description:
** Campus page functions
*/

import { Room } from '@/lib/data';
import { getAllRooms, createRoom } from '@/api/backend/rooms';
import { getAllCampus } from '@/api/backend/campus';
import { getUserCampusId } from '@/lib/handleUser';

export const fetchRooms = async (
    setRooms: (rooms: Room[]) => void,
    setLoading: (loading: boolean) => void,
    setError: (error: string | null) => void
) => {
    try {
        setLoading(true);
        const campusId = getUserCampusId();
        const data = await getAllRooms(campusId || undefined);
        setRooms(data);
        setError(null);
    } catch (err: any) {
        console.error('Error fetching rooms:', err);
        setError('Impossible de charger les salles');
    } finally {
        setLoading(false);
    }
};

export const fetchCampus = async (
    setCampus: (campus: any[]) => void
) => {
    try {
        const data = await getAllCampus();
        setCampus(data);
    } catch (err: any) {
        console.error('Error fetching campus:', err);
    }
};

export const handleSubmitCreateRoom = async (
    e: React.FormEvent,
    createFormData: any,
    fetchRooms: () => Promise<void>,
    setIsCreateModalOpen: (open: boolean) => void,
    setCreateFormData: (data: any) => void
) => {
    e.preventDefault();

    try {
        const token = localStorage.getItem('token');
        const userCampusId = getUserCampusId();
        
        if (!userCampusId) {
            alert('Impossible de déterminer votre campus. Veuillez vous reconnecter.');
            return;
        }
        
        const payload = {
            name: createFormData.name.trim(),
            floor: createFormData.floor.trim(),
            capacity: parseInt(createFormData.capacity, 10),
            description: createFormData.description.trim() || 'Aucune description',
            campusId: userCampusId,
        };
        
        await createRoom(payload, token || '');
        await fetchRooms();
        setIsCreateModalOpen(false);
        setCreateFormData({
            name: '',
            floor: '',
            capacity: '',
            description: '',
        });
    } catch (err: any) {
        alert('Erreur, veuillez réessayer plus tard...');
    }
};

