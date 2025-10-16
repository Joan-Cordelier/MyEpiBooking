/*
** EPITECH PROJECT, 2025
** EPI BOOKING
** File description:
** Room selector component
*/

"use client";

export type RoomSelectorProps = {
    rooms: string[];
    value?: string;
    onChange?: (value: string) => void;
    className?: string;
};

export default function RoomSelector({ rooms, value, onChange, className = "" }: RoomSelectorProps) {
    return (
        <div className={"inline-flex items-center gap-2 rounded-md bg-black/5 px-2 py-1 " + className}>
            <select
                className="bg-transparent outline-none text-black font-bold"
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
            >
                {rooms.map((room) => (
                    <option key={room} value={room}>
                        {room}
                    </option>
                ))}
            </select>
        </div>
    );
}
