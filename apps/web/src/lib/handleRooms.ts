/*
** EPITECH PROJECT, 2025
** EPI BOOKING
** File description:
** Romms handler functions
*/

import { Room } from "./data";
import * as Rooms from "@/api/rooms";
import { getUserCampusId } from "./handleUser";

export async function handleRoom(): Promise<Room[]> {
    try {
        const userCampusId = getUserCampusId();
        const data: any = await Rooms.getAllRooms(userCampusId || undefined);
        const list = Array.isArray(data) ? data : [];
        const filteredList = userCampusId ? list.filter((r: any) => r.campusId === userCampusId) : list;

        return filteredList.map((r: any) => {
            const state = r?.state === 'RESERVABLE' || r?.state === 'NON_RESERVABLE' ? r.state : 'RESERVABLE';

            return {
                id: String(r?.id ?? ''),
                name: String(r?.name ?? ''),
                floor: String(r?.floor ?? ''),
                state: state,
                capacity: Number(r?.capacity ?? 0),
                description: String(r?.description ?? ''),
                campusId: String(r?.campusId ?? ''),
                createdAt: String(r?.createdAt ?? ''),
            } as Room;
        });
    } catch (e) {
        console.error('Failed to load rooms', e);
        return [];
    }
}
