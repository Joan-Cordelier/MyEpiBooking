/*
** EPITECH PROJECT, 2025
** EPI BOOKING
** File description:
** Header component layout
*/

"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

interface HeaderProps {
  username: string,
  avatarUrl: string,
  logoUrl: string,
  onLogout?: () => void,
}

export default function Header({ username, avatarUrl, logoUrl, onLogout }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const userRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {

    /* Handle Click */
    function handleClickOutside(e: MouseEvent)
    {
      if (userRef.current && !userRef.current.contains(e.target as Node))
        setMenuOpen(false);
    }

    /* Handle Escape Key  */
    function handleEsc(e: KeyboardEvent)
    {
      if (e.key === "Escape")
        setMenuOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

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
      <div className="relative mr-4" ref={userRef}>
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
          className="flex items-center gap-2 sm:gap-3 text-white focus:outline-none rounded-lg px-1"
        >
          <img
            src={avatarUrl}
            alt="avatar"
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl object-cover"
          />
          <span className="hidden sm:inline text-base sm:text-lg font-bold">{username.toUpperCase()}</span>
                    <i className="fi fi-br-angle-small-down text-sm leading-none mt-[1px]"></i>

        </button>

        {/* {menuOpen && (
          <div
            role="menu"
            aria-label="menu utilisateur"
            className="absolute right-0 mt-2 w-44 rounded-lg border border-black/10 bg-white text-neutral-800 shadow-lg overflow-hidden z-[60]"
          >
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setMenuOpen(false);
                if (onLogout) onLogout();
                else console.log("logout clicked");
              }}
              className="w-full text-left px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 focus:outline-none focus:bg-red-50"
            >
              <span className="inline-flex items-center gap-2">
                <i className="fi fi-br-exit"></i> 
                SE DÉCONNECTER
              </span>
            </button>
          </div>
        )} */}
      </div>
    </header>
  );
}
