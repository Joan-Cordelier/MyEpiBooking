/*
** EPITECH PROJECT, 2025
** EPI BOOKING
** File description:
** Main app layout (excludes /login)
*/

import Navbar from "@/components/layout/Navbar";
import Header from "@/components/layout/Header";

export default function MainLayout({ children }: { children: React.ReactNode }) {
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
