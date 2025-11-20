/*
** EPITECH PROJECT, 2025
** EPI BOOKING
** File description:
** Bookings API functions
*/

import * as Bookings from "@/api/backend/bookings";
import { Room, Booking, ReservationType } from "./data";

function mapRoom(r: any): Room {
    return {
        id: String(r?.id ?? ''),
        name: String(r?.name ?? ''),
        floor: String(r?.floor ?? ''),
        state: (r?.state === 'RESERVABLE' || r?.state === 'NON_RESERVABLE') ? r.state : 'NON_RESERVABLE',
        capacity: Number(r?.capacity ?? 0),
        description: String(r?.description ?? ''),
        campusId: String(r?.campusId ?? ''),
        createdAt: String(r?.createdAt ?? ''),
    };
}

function mapBooking(b: any): Booking {
    const userName = String(b?.user?.name ?? '');
    const author = userName || 'Inconnu';

    return {
        type: (String(b?.type ?? '') as ReservationType),
        title: String(b?.title ?? ''),
        description: String(b?.description ?? ''),
        author,
        start: new Date(b?.startDate ?? b?.start ?? Date.now()),
        end: new Date(b?.endDate ?? b?.end ?? Date.now()),
        room: mapRoom(b?.room ?? {}),
    };
}

export async function handleBookings(): Promise<Booking[]> {
    try {
        const data: any = await Bookings.getAllBookings();
        const list = Array.isArray(data) ? data : [];

        return list.map(mapBooking);
    } catch (e) {
        console.error('Failed to load bookings', e);
        return [];
    }
}

export async function createBooking(payload: {
    type: ReservationType;
    title: string;
    description?: string;
    startDate: Date;
    endDate: Date;
    roomId: string;
}): Promise<Booking | null> {
    try {
        const body = {
            ...payload,
            startDate: payload.startDate.toISOString(),
            endDate: payload.endDate.toISOString(),
        };
        const data: any = await Bookings.createBooking(body);

        return mapBooking(data);
    } catch (e) {
        console.error('Failed to create booking', e);
        return null;
    }
}
