/*
** EPITECH PROJECT, 2025
** EPI BOOKING
** File description:
** Data
*/

export interface Room {
    id: string;
    name: string;
    floor: string;
    capacity: number;
    description?: string;
    state: 'RESERVABLE' | 'NON_RESERVABLE'
    campusId: string;
    createdAt: string;
}

export const AVAILABLE_RIGHTS = [
    'EDIT_USER',
    'EDIT_ROOM',
    'EDIT_RESERVATION',
    'EDIT_RIGHTS',
    'BOOK_ROOM',
    'HOST_MEETING'
]

export interface User {
    id: string;
    email: string;
    name: string;
    firstName: string;
    actual_promotion?: string;
    photo: string;
    campus?: {
        name: string;
        id: string;
    };
    rights: string[];
    createdAt: string;
    updatedAt: string;
}

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
