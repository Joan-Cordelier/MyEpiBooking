/*
** EPITECH PROJECT, 2025
** EPI BOOKING
** File description:
** formatDuration function
*/

import { differenceInMinutes } from 'date-fns';

export function formatDuration(start: Date, end: Date): string {
    const total = Math.max(0, differenceInMinutes(end, start));
    const h = Math.floor(total / 60);
    const m = total % 60;

    if (h > 0 && m > 0)
        return `${h}h${m}`;
    if (h > 0)
        return `${h}h`;
    return `${m}min`;
}
