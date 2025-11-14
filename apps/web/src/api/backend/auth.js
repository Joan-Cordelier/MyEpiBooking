/*
** EPITECH PROJECT, 2025
** EPI BOOKING
** File description:
** Authentication API Functions
*/

import API from "./index";

class Auth extends API {

    /* Login Function */
    async login(email, password) {
        return this.request('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({email, password})
        });
    }

}

export const login = (email, password) => new Auth().login(email, password);

export default { login };
