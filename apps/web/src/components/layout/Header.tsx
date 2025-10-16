/*
** EPITECH PROJECT, 2025
** EPI BOOKING
** File description:
** Header component layout
*/

interface HeaderProps {
    username: string,
    avatarUrl: string,
    logoUrl: string
}

export default function Header({username, avatarUrl, logoUrl} : HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 shadow-md bg-blue-700">
      {/* EPITECH Logo */}
      <img
        src={logoUrl}
        alt="logo"
        className="h-12 w-auto"
      />

      {/* User Profile */}
      <div className="flex items-center gap-4 text-white">
        <img
          src={avatarUrl}
          alt="avatar"
          className="w-16 h-16 rounded-xl object-cover"
        />
        <span className="text-xl font-bold">{username}</span>
      </div>
    </header>
  );
}
