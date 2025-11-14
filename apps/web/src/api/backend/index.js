/*
** EPITECH PROJECT, 2025
** EPI BOOKING
** File description:
** Backend API Link
*/

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "";

function build_url(path) {
    if (!API_URL)
        return path;
    return `${API_URL.replace(/\/$/, '')}${path}`;
}

function handle_error(response, data)
{
    if (response.status === 401) {
        try {
            const hadToken = !!localStorage.getItem('token');

            localStorage.removeItem('token');
            localStorage.removeItem('user');
            if (typeof window !== 'undefined' && hadToken) {
                const from = `${window.location?.pathname || ''}${window.location?.search || ''}${window.location?.hash || ''}`;
                const loginUrl = `/login${from ? `?from=${encodeURIComponent(from)}` : ''}`;

                setTimeout(() => {
                    try {
                        window.location.replace(loginUrl);
                    } catch {
                        window.location.href = loginUrl;
                    }
                }, 0);
            }
        } catch { }
    }
    throw { status: response.status, data };
}

class API {
    async request(path, options = {}) {
        const url = build_url(path);
        const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
        const opts = { ...options, headers, credentials: options.credentials ?? 'include' };

        try {
            const response = await fetch(url, opts);
            const text = await response.text();
            let data;

            try {
                data = text ? JSON.parse(text) : null;
            } catch (e) {
                data = text;
            }
            if (!response.ok) {
                console.error(`API Error ${response.status}`);
                handle_error(response, data);
            }
            return data;
        } catch (e) {
            console.log(`Error ${e}:\nRequest failed at url '${url}'.`);
            throw e;
        }
    }
}

export default API;
