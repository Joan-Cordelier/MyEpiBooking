/*
** EPITECH PROJECT, 2025
** EPI BOOKING
** File description:
** Campus backend API
*/

import API from ".";

class Campus extends API {

    async getAll() {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

        return this.request('/api/campus', {
            method: 'GET',
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
    }

    async getById(id) {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

        return this.request(`api/campus/${id}`, {
            method: 'GET',
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
    }

    async create(payload, token) {
        return this.request('/api/campus', {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
    }

    async update(id, payload, token) {
        return this.request(`/api/campus/${id}`, {
            method: 'PUT',
            body: JSON.stringify(payload),
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
    }

    async delete(id, token) {
        return this.request(`/api/campus/${id}`, {
            method: 'DELETE',
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
    }
}

export const getAllCampus = () => new Campus().getAll();
export const getCampusById = (id) => new Campus().getById(id);
export const createCampus = (payload, token) => new Campus().create(payload, token);
export const updateCampus = (id, payload, token) => new Campus().update(id, payload, token);
export const deleteCampus = (id, token) => new Campus().delete(id, token);

export default { getAllCampus, getCampusById, createCampus, updateCampus, deleteCampus };
