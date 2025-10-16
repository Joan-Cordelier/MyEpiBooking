import { differenceInMinutes } from 'date-fns';

export function formatDuration(start: Date, end: Date): string {
    const total = Math.max(0, differenceInMinutes(end, start));
    const h = Math.floor(total / 60);
    const m = total % 60;

    if (h > 0 && m > 0)
        return `${h}h${m}`; // e.g., 1h30
    if (h > 0)
        return `${h}h`; // e.g., 1h, 2h
    return `${m}min`; // e.g., 30min
}
