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
    function handleClickOutside(e: MouseEvent) {
      if (userRef.current && !userRef.current.contains(e.target as Node))
        setMenuOpen(false);
    }
    function handleEsc(e: KeyboardEvent) {
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
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 shadow-md bg-blue-700">
      {/* EPITECH Logo */}
      <Link href="/" className="inline-flex items-center">
        <img
          src={logoUrl}
          alt="Logo"
          className="h-10 w-auto cursor-pointer"
        />
      </Link>

      {/* User Profile */}
      <div className="relative mr-30" ref={userRef}>
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
          className="flex items-center gap-3 text-white rounded-lg px-1"
        >
          <img
            src={avatarUrl}
            alt="avatar"
            className="w-12 h-12 rounded-xl object-cover"
          />
          <span className="text-lg font-bold">{username.toUpperCase()}</span>
          <i className="fi fi-br-angle-small-down text-sm leading-none mt-[1px]"></i>
        </button>

        {menuOpen && (
          <div
            role="menu"
            aria-label="menu utilisateur"
            className="absolute right-0 mt-2 w-50 rounded-lg border border-black/10 bg-white text-neutral-800 shadow-lg overflow-hidden z-[60]"
          >
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setMenuOpen(false);
                if (onLogout)
                  onLogout();
                else
                  console.log("logout clicked");
              }}
              className="w-full text-left px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <span className="inline-flex items-center gap-2">
                <i className="fi fi-br-exit text-xs self-center"></i>
                SE DÉCONNECTER
              </span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
