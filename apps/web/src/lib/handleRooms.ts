/*
** EPITECH PROJECT, 2025
** EPI BOOKING
** File description:
** Romms handler functions
*/

import { Room } from "./data";
import * as Rooms from "@/api/backend/rooms";

export async function handleRoom(): Promise<Room[]> {
    try {
        const data: any = await Rooms.getAllRooms();
        const list = Array.isArray(data) ? data : [];

        return list.map((r: any) => {
            return {
                id: String(r?.id ?? ''),
                name: String(r?.name ?? ''),
                floor: String(r?.floor ?? ''),
                state: String(r?.state),
                capacity: Number(r?.capacity ?? 0),
                description: String(r?.description ?? ''),
            } as Room;
        });
    } catch (e) {
        console.error('Failed to load rooms', e);
        return [];
    }
}
