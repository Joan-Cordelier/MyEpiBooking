/*
** EPITECH PROJECT, 2025
** EPI BOOKING
** File description:
** Layout file
*/

import Header from "@/components/layout/Header";
import "./globals.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "@/styles/rbc-overrides.css";

export const metadata = {
  title: "My EpiBooking",
  description: "Plateforme de réservation Epitech",
  icons: {
    icon: "/images/icon.png",
    apple: "/images/icon.png",
    shortcut: "/images/icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <Header
        username="John Doe"
        avatarUrl="/images/68x70.svg"
        logoUrl="/images/epitech_logo.png"
        />
        <main className="pt-24">{children}</main>
      </body>
    </html>
  );
}
