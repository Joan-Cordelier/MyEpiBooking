/*
** EPITECH PROJECT, 2025
** EPI BOOKING
** File description:
** Rooms API functions
*/

import API from "./index"

class Rooms extends API {

    /* Set a different state */
    async setState(id, payload, token) {
        return this.request(`/api/rooms/${encodeURIComponent(id)}/state`, {
            method: 'PATCH',
            body: JSON.stringify(payload),
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
    }

    /* Get all rooms */
    async getAll(campusId) {
        const url = campusId ? `/api/rooms?campusId=${encodeURIComponent(campusId)}` : '/api/rooms';
        return this.request(url, {method: 'GET'});
    }

    /* Get a room by its id */
    async get(id) {
        return this.request(`/api/rooms/${encodeURIComponent(id)}`, {method: 'GET'});
    }

    /* Create a new room */
    async create(payload, token) {
        return this.request('/api/rooms', {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
    }

    /* Delete a room by its id */
    async delete(id, token) {
        return this.request(`/api/rooms/${encodeURIComponent(id)}`, {
            method: 'DELETE',
            headers: token ? { Authorization: `Bearer ${token}`} : {}
        });
    }

    /* Update a room by its id */
    async update(id, payload, token) {
        return this.request(`/api/rooms/${encodeURIComponent(id)}` , {
            method: 'PUT',
            body: JSON.stringify(payload),
            headers: token ? { Authorization: `Bearer ${token}`} : {}
        });
    }
}

export const setRoomState = (id, payload, token) => new Rooms().setState(id, payload, token);
export const getAllRooms = (campusId) => new Rooms().getAll(campusId);
export const getRoomById = (id) => new Rooms().get(id);
export const createRoom = (payload, token) => new Rooms().create(payload, token);
export const deleteRoom = (id, token) => new Rooms().delete(id, token);
export const updateRoom = (id, payload, token) => new Rooms().update(id, payload, token);

export default { setRoomState, getAllRooms, getRoomById, createRoom, deleteRoom, updateRoom };
