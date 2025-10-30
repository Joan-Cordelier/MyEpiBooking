/*
** EPITECH PROJECT, 2025
** EPI BOOKING
** File description:
** Reserve button component
*/

"use client";

export type ReserveButtonProps = {
    label?: string;
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
};

export default function ReserveButton({ label = "Réserver", onClick, disabled, className = "" }: ReserveButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={
                "inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-semibold text-white " +
                "bg-[#0032D7] hover:bg-[#0026A8] disabled:opacity-60 disabled:cursor-not-allowed shadow-sm " +
                className
            }
        >
            {label}
        </button>
    );
}
