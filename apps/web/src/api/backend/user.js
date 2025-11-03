/*
** EPITECH PROJECT, 2025
** EPI BOOKING
** File description:
** User API functions
*/

import API from "./index"

class User extends API {

    /* Get all users */
    async getAll() {
        return this.request('/user/get', {method: 'GET'});
    }

    /* Get a user by his id */
    async get(id) {
        return this.request(`/user/get/${encodeURIComponent(id)}`, {method: 'GET'});
    }

    /* Create a new user. */
    async create(payload, token) {
        return this.request('/user/create', {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
    }

    /* Delete a user by his id. */
    async delete(id, token) {
        return this.request(`/user/delete/${encodeURIComponent(id)}`, {
            method: 'DELETE',
            headers: token ? { Authorization: `Bearer ${token}`} : {}
        });
    }

    /* Update a user by his id */
    async update(id, payload, token) {
        return this.request(`/user/update/${encodeURIComponent(id)}`, {
            method: 'PUT',
            body: JSON.stringify(payload),
            headers: token ? { Authorization: `Bearer ${token}`} : {}
        });
    }
}

export const getAllUsers = () => new User().getAll();
export const getUserById = (id) => new User().get(id);
export const createUser = (payload, token) => new User().create(payload, token);
export const deleteUser = (id, token) => new User().delete(id, token);
export const updateUser = (id, payload, token) => new UserApi().update(id, payload, token);

export default { getAllUsers, getUserById, createUser, deleteUser, updateUser };
