/*
** EPITECH PROJECT, 2025
** EPI BOOKING
** File description:
** Romms handler functions
*/

import * as Rooms from "@/api/backend/rooms"

export type Room = {
    id: string;
    name: string;
    floor: string;
    state: boolean;
    capacity: number;
    description: string;
}

export async function handleRoom(): Promise<Room[]> {
    const rooms = Rooms.getAllRooms();

    try {
        const data: any = await Rooms.getAllRooms();
        const list = Array.isArray(data) ? data : [];

        return list.map((r: any) => {
            const up = String(r?.state ?? '').toUpperCase();
            const isReservable = up === 'RESERVABLE' || up === 'RESEVABLE';

            return {
                id: String(r?.id ?? ''),
                name: String(r?.name ?? ''),
                floor: String(r?.floor ?? ''),
                state: isReservable,
                capacity: Number(r?.capacity ?? 0),
                description: String(r?.description ?? ''),
            } as Room;
        });
    } catch (e) {
        console.error('Failed to load rooms', e);
        return [];
    }
}
