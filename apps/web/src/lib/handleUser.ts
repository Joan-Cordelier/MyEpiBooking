/*
** EPITECH PROJECT, 2025
** EPI BOOKING
** File description:
** User storage helpers (pure utilities)
*/

export type StoredUser = {
    name?: string;
    firstName?: string;
    email?: string;
    photo?: string | null;
    [k: string]: unknown;
} | null;

export function parseStoredUser(): StoredUser {
    try {
        if (typeof window === 'undefined')
            return null;
        const raw = window.localStorage.getItem('user');
        if (!raw)
            return null;
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

export function deriveUser(
    u: StoredUser,
    initialName?: string,
    initialAvatar?: string
): { name?: string; avatar?: string } {
    if (!u)
        return { name: initialName, avatar: initialAvatar };
    const name = (u.name || u.firstName || u.email || initialName || '') as string | undefined;
    const avatar = (u.photo || initialAvatar || undefined) as string | undefined;

    return { name, avatar };
}

export function loadInitialUser(
    initialName?: string,
    initialAvatar?: string
): { name?: string; avatar?: string } {
    const u = parseStoredUser();

    return deriveUser(u, initialName, initialAvatar);
}


export function createUserStorageHandler(
    initialName: string | undefined,
    initialAvatar: string | undefined,
    onChange: (state: { name?: string; avatar?: string }) => void
): (e: StorageEvent) => void {
    return (e: StorageEvent) => {
        if (e.key !== 'user')
            return;
        let u: StoredUser = null;

        try {
            u = e.newValue ? (JSON.parse(e.newValue) as StoredUser) : null;
        } catch {
            u = null;
        }
        onChange(deriveUser(u, initialName, initialAvatar));
    };
}

export function getUserRights(): string[] {
    try {
        if (typeof window === 'undefined')
            return [];
        const user = parseStoredUser();
        if (!user || !Array.isArray(user.rights))
            return [];
        return user.rights as string[];
    } catch {
        return [];
    }
}

export function hasRight(right: string): boolean {
    return getUserRights().includes(right);
}

export function logout(): void {
    try {
        if (typeof window !== 'undefined') {
            window.localStorage.removeItem('token');
            window.localStorage.removeItem('user');
        }
    } catch {}
    if (typeof window !== 'undefined')
        window.location.href = '/login';
}
