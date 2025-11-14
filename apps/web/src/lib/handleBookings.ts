/*
** EPITECH PROJECT, 2025
** EPI BOOKING
** File description:
** Bookings API functions
*/

import * as Bookings from "@/api/backend/bookings";
import { Room } from "./handleRooms";

export type ReservationType =
    | 'MEETING'
    | 'WORK'
    | 'KICK_OFF'
    | 'BOOTHING'
    | 'WORKSHOP'
    | 'TALK'
    | 'UNEXPECTED';

export type Booking = {
    type: ReservationType;
    title: string;
    description: string;
    author: string;
    start: Date;
    end: Date;
    room: Room;
}

function mapRoom(r: any): Room {
    const up = String(r?.state ?? '').toUpperCase();
    const isReservable = up === 'RESERVABLE' || up === 'RESEVABLE';
    return {
        id: String(r?.id ?? ''),
        name: String(r?.name ?? ''),
        floor: String(r?.floor ?? ''),
        state: isReservable,
        capacity: Number(r?.capacity ?? 0),
        description: String(r?.description ?? ''),
    };
}

function mapBooking(b: any): Booking {
    return {
        type: (String(b?.type ?? '') as ReservationType),
        title: String(b?.title ?? ''),
        description: String(b?.description ?? ''),
        author: String(b?.user?.name ?? b?.user?.email ?? ''),
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

export async function handleMyBookings(): Promise<Booking[]> {
    try {
        const data: any = await Bookings.getMyBookings();
        const list = Array.isArray(data) ? data : [];
        return list.map(mapBooking);
    } catch (e) {
        console.error('Failed to load my bookings', e);
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
