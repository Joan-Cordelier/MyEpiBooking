/*
** EPITECH PROJECT, 2025
** EPI BOOKING
** File description:
** Rooms API functions
*/

import API from "./index"

class Bookings extends API {

    /* User's bookings */
    async getMy() {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

        return this.request(`/api/reservations/me`, {
            method: 'GET',
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
    }

    /* Get all bookings */
    async getAll() {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

        return this.request('/api/reservations', {
            method: 'GET',
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
    }

    /* Get a booking by its id */
    async get(id) {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

        return this.request(`/api/reservations/${encodeURIComponent(id)}`, {
            method: 'GET',
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
    }

    /* Create a new booking */
    async create(payload) {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

        return this.request('/api/reservations', {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
    }

    /* Delete a room by its id */
    async delete(id) {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

        return this.request(`/api/reservations/${encodeURIComponent(id)}`, {
            method: 'DELETE',
            headers: token ? { Authorization: `Bearer ${token}`} : {}
        });
    }

    /* Update a room by its id */
    async update(id, payload) {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

        return this.request(`/api/reservations/${encodeURIComponent(id)}` , {
            method: 'PUT',
            body: JSON.stringify(payload),
            headers: token ? { Authorization: `Bearer ${token}`} : {}
        });
    }
}

export const getMyBookings = () => new Bookings().getMy();
export const getAllBookings = () => new Bookings().getAll();
export const getBookingById = (id) => new Bookings().get(id);
export const createBooking = (payload) => new Bookings().create(payload);
export const deleteBooking = (id) => new Bookings().delete(id);
export const updateBooking = (id, payload) => new Bookings().update(id, payload);

export default { getMyBookings, getAllBookings, getBookingById, createBooking, deleteBooking, updateBooking };
