/*
** EPITECH PROJECT, 2025
** EPI BOOKING
** File description:
** students functions handler
*/

import { User } from '@/lib/data';
import { getAllUsers, deleteUser, updateUser, editUserRights, createUser } from '@/api/user';
import { getAllCampus } from '@/api/campus';
import { getUserCampusId } from '@/lib/handleUser';

export const fetchUsers = async (
    setUsers: (users: User[]) => void,
    setLoading: (loading: boolean) => void,
    setError: (error: string | null) => void
) => {
    try {
        setLoading(true);
        const campusId = getUserCampusId();
        const data = await getAllUsers(campusId || undefined);
        
        // Filtrer côté frontend pour être sûr
        const filteredUsers = campusId 
            ? data.filter((user: User) => user.campus?.id === campusId)
            : data;
        
        setUsers(filteredUsers);
        setError(null);
    } catch (err: any) {
        console.error('Error fetching users:', err);
        setError('Impossible de charger les utilisateurs');
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

export const handleDeleteUser = async (
    user: User,
    users: User[],
    setUsers: (users: User[]) => void
) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer ${user.firstName} ${user.name} ?`))
        return;

    try {
        const token = localStorage.getItem('token');
        await deleteUser(user.id, token || '');
        setUsers(users.filter(u => u.id !== user.id));
    } catch (err: any) {
        console.error('Error deleting user:', err);
        alert('Erreur, veuillez réessayer plus tard...');
    }
};

export const handleSubmitEdit = async (
    e: React.FormEvent,
    selectedUser: User | null,
    formData: any,
    fetchUsers: () => Promise<void>,
    setIsModalOpen: (open: boolean) => void,
    setSelectedUser: (user: User | null) => void
) => {
    e.preventDefault();
    if (!selectedUser)
        return;

    try {
        const token = localStorage.getItem('token');
        const userCampusId = getUserCampusId();
        const updatedFormData = {
            ...formData,
            campusId: userCampusId || formData.campusId
        };
        await updateUser(selectedUser.id, updatedFormData, token || '');
        await fetchUsers();
        setIsModalOpen(false);
        setSelectedUser(null);
    } catch (err: any) {
        console.log(`Error updating user:\n${err}`);
        alert('Erreur, veuillez réessayer plus tard...');
    }
};

export const handleSubmitRights = async (
    e: React.FormEvent,
    selectedUser: User | null,
    selectedRights: string[],
    fetchUsers: () => Promise<void>,
    setIsRightsModalOpen: (open: boolean) => void,
    setSelectedUser: (user: User | null) => void
) => {
    e.preventDefault();
    if (!selectedUser)
        return;

    try {
        const token = localStorage.getItem('token');

        await editUserRights(selectedUser.id, { rights: selectedRights }, token || '');
        await fetchUsers();
        setIsRightsModalOpen(false);
        setSelectedUser(null);
    } catch (err: any) {
        console.log(`Error updating user rights:\n${err}`);
        alert('Erreur, veuillez réessayer plus tard...');
    }
};

export const handleSubmitCreate = async (
    e: React.FormEvent,
    createFormData: any,
    fetchUsers: () => Promise<void>,
    setIsCreateModalOpen: (open: boolean) => void,
    setCreateFormData: (data: any) => void
) => {
    e.preventDefault();

    try {
        const token = localStorage.getItem('token');
        const userCampusId = getUserCampusId();
        const newUserData = {
            ...createFormData,
            campusId: userCampusId || createFormData.campusId
        };
        await createUser(newUserData, token || '');
        await fetchUsers();
        setIsCreateModalOpen(false);
        setCreateFormData({
            email: '',
            name: '',
            firstName: '',
            actual_promotion: '',
            campusId: '',
            password: '',
        });
    } catch (err: any) {
        console.log(`Error creating user:\n${err}`);
        alert('Erreur, veuillez réessayer plus tard...');
    }
};

