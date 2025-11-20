/*
** EPITECH PROJECT, 2025
** EPI BOOKING
** File description:
** Admin Login button file 
*/

"use client";

import { useEffect, useState, FormEvent } from "react";
import { Anton } from "next/font/google";

const anton = Anton({ subsets: ["latin"], weight: "400" });

type AdminLoginProps = {
  className?: string;
  onSubmit?: (email: string, password: string) => Promise<void> | void;
};

export default function AdminLogin({ className = "", onSubmit }: AdminLoginProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
        if (e.key === "Escape")
            setOpen(false);
    }

    if (open)
        window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const em = email.trim();

    if (!em || !password)
        return setError("Veuillez renseigner l'email et le mot de passe.");
    if (!/.+@.+\..+/.test(em))
        return setError("Veuillez saisir un email valide.");
    try {
      if (onSubmit)
        await onSubmit(em, password);
      setOpen(false);
      setEmail("");
      setPassword("");
    } catch (err) {
      setError("Échec de la connexion administrateur.");
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`bg-white border border-black/50 text-black/75 flex items-center justify-center hover:bg-black/5 transition-colors ${anton.className} ${className}`}
        aria-label="Autre méthode de connexion"
      >
        <span className="text-xl">&gt;&gt;</span>
        <span className="text-lg">&nbsp; AUTRE &nbsp;</span>
        <span className="text-xl">&lt;&lt;</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-[1px] flex items-center justify-center z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Connexion administrateur"
            className="w-full max-w-[520px] rounded-xl border border-black/50 bg-white shadow-xl p-6"
          >
            <div className={`${anton.className} text-center text-black text-xl mb-4`}>
              CONNEXION ADMINISTRATEUR
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="admin-email" className="block text-sm text-black/80 mb-1">
                  Email
                </label>
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-10 rounded-md border border-black/30 px-3 outline-none focus:border-blue-700 text-black placeholder-black/40"
                  placeholder="admin@example.com"
                />
              </div>
              <div>
                <label htmlFor="admin-password" className="block text-sm text-black/80 mb-1">
                  Mot de passe
                </label>
                <input
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-10 rounded-md border border-black/30 px-3 outline-none focus:border-blue-700 text-black placeholder-black/40"
                  placeholder="••••••••"
                />
              </div>

              {error && <p className="text-red-600 text-sm">{error}</p>}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    setError(null);
                  }}
                  className="px-4 h-10 rounded-md border border-black/30 text-black/80 hover:bg-black/5"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 h-10 rounded-md bg-blue-700 text-white hover:brightness-95"
                >
                  Se connecter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
