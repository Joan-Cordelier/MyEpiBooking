/*
** EPITECH PROJECT, 2025
** EPI BOOKING
** File description:
** Header component layout
*/

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  loadInitialUser,
  createUserStorageHandler,
  logout as doLogout,
} from "../../lib/handleUser";

interface HeaderProps {
  username?: string,
  avatarUrl?: string,
  logoUrl?: string,
}

function useUserProfile(initialName?: string, initialAvatar?: string) {
  const [name, setName] = useState<string | undefined>(initialName);
  const [avatar, setAvatar] = useState<string | undefined>(initialAvatar);

  useEffect(() => {
    const init = loadInitialUser(initialName, initialAvatar);

    setName(init.name);
    setAvatar(init.avatar);
    const handler = createUserStorageHandler(initialName, initialAvatar, ({ name, avatar }) => {
      setName(name);
      setAvatar(avatar);
    });
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, [initialName, initialAvatar]);

  return { name, avatar, logout: doLogout } as const;
}

export default function Header({ username: usernameProp, avatarUrl: avatarProp, logoUrl }: HeaderProps) {
  const { name: username, avatar } = useUserProfile(usernameProp, avatarProp);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-blue-700 h-14 sm:h-16 px-4 sm:px-6">
      {/* EPITECH Logo */}
      <Link href="/" className="inline-flex items-center">
        <img
          src={logoUrl}
          alt="Logo"
          className="h-8 sm:h-10 w-auto cursor-pointer"
        />
      </Link>

      {/* User Profile */}
  <div className="relative mr-4">
        <button
          type="button"
          aria-haspopup="menu"
          className="flex items-center gap-2 sm:gap-3 text-white focus:outline-none rounded-lg px-1"
        >
          <img
            src={avatar ?? '/images/68x70.svg'}
            alt="avatar"
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl object-cover"
          />
          <span className="hidden sm:inline text-base sm:text-lg font-bold">{(username ?? 'Utilisateur').toString().toUpperCase()}</span>
                    <i className="fi fi-br-angle-small-down text-sm leading-none mt-[1px]"></i>

        </button>

        
      </div>
    </header>
  );
}
