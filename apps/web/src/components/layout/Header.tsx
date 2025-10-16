/*
** EPITECH PROJECT, 2025
** EPI BOOKING
** File description:
** Header component layout
*/

import Link from "next/link";

interface HeaderProps {
  username: string,
  avatarUrl: string,
  logoUrl: string
}

export default function Header({ username, avatarUrl, logoUrl }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 shadow-md bg-blue-700">
      {/* EPITECH Logo clickable to go home */}
      <Link href="/" className="inline-flex items-center">
        <img
          src={logoUrl}
          alt="Logo"
          className="h-10 w-auto cursor-pointer"
        />
      </Link>

      {/* User Profile */}
      <div className="flex items-center gap-3 text-white">
        <img
          src={avatarUrl}
          alt="avatar"
          className="w-12 h-12 rounded-xl object-cover"
        />
        <span className="text-lg font-bold">{username}</span>
      </div>
    </header>
  );
}
