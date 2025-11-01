/*
** EPITECH PROJECT, 2025
** EPI BOOKING
** File description:
** Layout file
*/

import PageFrame from "@/components/layout/PageFrame";
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
        <PageFrame>{children}</PageFrame>
      </body>
    </html>
  );
}
