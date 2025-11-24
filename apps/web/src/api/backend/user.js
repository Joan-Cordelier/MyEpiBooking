/*
** EPITECH PROJECT, 2025
** EPI BOOKING
** File description:
** User API functions
*/

import API from "./index"

class Users extends API {

    /* Edit user's rights */
    async rights(id, payload, token) {
        return this.request(`/api/users/${encodeURIComponent(id)}/rights`, {
            method: 'PATCH',
            body: JSON.stringify(payload),
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
    }

    /* Get all users */
    async getAll(campusId) {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const url = campusId ? `/api/users?campusId=${encodeURIComponent(campusId)}` : '/api/users';
        return this.request(url, {
            method: 'GET',
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
    }

    /* Get a user by his id */
    async get(id) {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        return this.request(`/api/users/${encodeURIComponent(id)}`, {
            method: 'GET',
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
    }

    /* Create a new user. */
    async create(payload, token) {
        return this.request('/api/users', {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
    }

    /* Delete a user by his id. */
    async delete(id, token) {
        return this.request(`/api/users/${encodeURIComponent(id)}`, {
            method: 'DELETE',
            headers: token ? { Authorization: `Bearer ${token}`} : {}
        });
    }

    /* Update a user by his id */
    async update(id, payload, token) {
        return this.request(`/api/users/${encodeURIComponent(id)}`, {
            method: 'PUT',
            body: JSON.stringify(payload),
            headers: token ? { Authorization: `Bearer ${token}`} : {}
        });
    }
}

export const editUserRights = (id, payload, token) => new Users().rights(id, payload, token);
export const getAllUsers = (campusId) => new Users().getAll(campusId);
export const getUserById = (id) => new Users().get(id);
export const createUser = (payload, token) => new Users().create(payload, token);
export const deleteUser = (id, token) => new Users().delete(id, token);
export const updateUser = (id, payload, token) => new Users().update(id, payload, token);

export default { editUserRights, getAllUsers, getUserById, createUser, deleteUser, updateUser };
