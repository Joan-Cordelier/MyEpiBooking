/*
** EPITECH PROJECT, 2025
** EPI BOOKING
** File description:
** Main app layout (excludes /login)
*/

"use client";

import Navbar from "@/components/layout/Navbar";
import Header from "@/components/layout/Header";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

      if (!token) {
        router.replace('/login');
        return;
      }
    } catch {
      router.replace('/login');
      return;
    }
    setReady(true);
  }, [router]);

  if (!ready)
    return null;
  return <>{children}</>;
}

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth>
      <Header
        logoUrl="/images/epitech_logo.png"
      />
      <Navbar />
      <main className="pt-16 pl-56">{children}</main>
    </RequireAuth>
  );
}
