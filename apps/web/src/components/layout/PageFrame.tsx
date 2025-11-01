/*
** EPITECH PROJECT, 2025
** EPI BOOKING
** File description:
** Page frame layout file
*/

"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import Navbar from "@/components/layout/Navbar";

type PageFrameProps = {
  children: ReactNode;
};

export default function PageFrame({ children }: PageFrameProps) {
  const pathname = usePathname();
  const hideChrome = pathname === "/login" || pathname?.startsWith("/login/");

  if (hideChrome) {
    return <main className="min-h-screen">{children}</main>;
  }

  return (
    <>
      <Header
        username="John Doe"
        avatarUrl="/images/68x70.svg"
        logoUrl="/images/epitech_logo.png"
      />
      <Navbar />
      <main className="pt-16 pl-56">{children}</main>
    </>
  );
}
