/*
** EPITECH PROJECT, 2025
** EPI BOOKING
** File description:
** Layout file
*/

import Header from "@/components/layout/Header";
import Navbar from "@/components/layout/Navbar";
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
      <head>
        {/* Flaticon UIcons */}
        <link
          rel="stylesheet"
          href="https://cdn-uicons.flaticon.com/2.4.2/uicons-bold-rounded/css/uicons-bold-rounded.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn-uicons.flaticon.com/2.4.2/uicons-solid-rounded/css/uicons-solid-rounded.css"
        />
      </head>
      <body>
        <Header
          username="John Doe"
          avatarUrl="/images/68x70.svg"
          logoUrl="/images/epitech_logo.png"
        />
        <Navbar />
        <main className="pt-16 pl-56">{children}</main>
      </body>
    </html>
  );
}
