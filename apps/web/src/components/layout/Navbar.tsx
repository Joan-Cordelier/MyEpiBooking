/*
** EPITECH PROJECT, 2025
** EPIBOOKING
** File description:
** Navigation bar component
*/

'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Anton, Istok_Web } from "next/font/google";

const anton = Anton({ subsets: ["latin"], weight: "400" });
const istok = Istok_Web({ subsets: ["latin"], weight: ["400", "700"] });

export default function Navbar() {
    const pathname = usePathname();
    const isActive = (href: string) => href !== "#" && (href === "/" ? pathname === "/" : pathname.startsWith(href));
	return (
		<nav
			aria-label="Navigation latérale"
			className="fixed left-0 top-14 sm:top-16 bottom-0 w-56 px-6 py-6 bg-white border-r border-black/75 z-40 flex flex-col"
		>
			{/* Navigation Section */}
			<div className={`mb-4 ${anton.className}`}>
				<span className="text-blue-700 text-2xl">NAVIGATION</span>
				<span className="text-orange-400 text-2xl">_</span>
			</div>

			{/* Liens */}
			<div className="flex-1 flex flex-col gap-5">
				<Link href="/" className="group relative w-32 h-8 inline-flex items-center gap-3" aria-current={isActive("/") ? "page" : undefined}>
					<div className={`pointer-events-none absolute left-[-11px] top-[-3px] w-48 h-9 bg-[#0032D7]/50 rounded-sm transition-opacity ${isActive("/") ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`} aria-hidden="true"></div>
					<i className={`fi fi-sr-map text-lg ${isActive("/") ? "text-blue-700" : "text-blue-700/50 group-hover:text-blue-700"}`} aria-hidden="true"></i>
					<span className={`${istok.className} text-lg font-bold ${isActive("/") ? "text-black" : "text-black/50 group-hover:text-black"}`}>Plan</span>
				</Link>

				<Link href="/schedule" className="group relative w-32 h-8 inline-flex items-center gap-3" aria-current={isActive("/schedule") ? "page" : undefined}>
					<div className={`pointer-events-none absolute left-[-11px] top-[-3px] w-48 h-9 bg-[#0032D7]/50 rounded-sm transition-opacity ${isActive("/schedule") ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`} aria-hidden="true"></div>
					<i className={`fi fi-sr-calendar text-lg ${isActive("/schedule") ? "text-blue-700" : "text-blue-700/50 group-hover:text-blue-700"}`} aria-hidden="true"></i>
					<span className={`${istok.className} text-lg font-bold ${isActive("/schedule") ? "text-black" : "text-black/50 group-hover:text-black"}`}>Schedule</span>
				</Link>

				<Link href="#" className="group relative w-36 h-8 inline-flex items-center gap-3">
					<div className="pointer-events-none absolute left-[-11px] top-[-3px] w-48 h-9 bg-[#0032D7]/50 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true"></div>
					<i className="fi fi-sr-calendar-check text-lg text-blue-700/50 group-hover:text-blue-700" aria-hidden="true"></i>
					<span className={`${istok.className} text-lg font-bold text-black/50 group-hover:text-black`}>My Bookings</span>
				</Link>

				{/* Section Dashboard */}
				<div className="mt-2">
					<div className={`${anton.className} mb-3`}>
						<span className="text-blue-700 text-2xl">DASHBOARD</span>
						<span className="text-orange-400 text-2xl">_</span>
					</div>
					<div className="flex flex-col gap-4">
						<Link href="#" className="group relative w-40 h-8 inline-flex items-center gap-3">
							<div className="pointer-events-none absolute left-[-11px] top-[-3px] w-48 h-9 bg-[#0032D7]/50 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true"></div>
							<i className="fi fi-sr-compass-alt text-lg text-blue-700/50 group-hover:text-blue-700" aria-hidden="true"></i>
							<span className={`${istok.className} text-lg font-bold text-black/50 group-hover:text-black`}>Overview</span>
						</Link>
						<Link href="#" className="group relative w-40 h-8 inline-flex items-center gap-3">
							<div className="pointer-events-none absolute left-[-11px] top-[-3px] w-48 h-9 bg-[#0032D7]/50 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true"></div>
							<i className="fi fi-br-circle-user text-lg text-blue-700/50 group-hover:text-blue-700" aria-hidden="true"></i>
							<span className={`${istok.className} text-lg font-bold text-black/50 group-hover:text-black`}>Profile</span>
						</Link>
						<Link href="#" className="group relative w-40 h-8 inline-flex items-center gap-3">
							<div className="pointer-events-none absolute left-[-11px] top-[-3px] w-48 h-9 bg-[#0032D7]/50 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true"></div>
							<i className="fi fi-br-lock-alt text-lg text-blue-700/50 group-hover:text-blue-700" aria-hidden="true"></i>
							<span className={`${istok.className} text-lg font-bold text-black/50 group-hover:text-black`}>Rooms</span>
						</Link>
						<Link href="#" className="group relative w-40 h-8 inline-flex items-center gap-3">
							<div className="pointer-events-none absolute left-[-11px] top-[-3px] w-48 h-9 bg-[#0032D7]/50 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true"></div>
							<i className="fi fi-sr-calendar text-lg text-blue-700/50 group-hover:text-blue-700" aria-hidden="true"></i>
							<span className={`${istok.className} text-lg font-bold text-black/50 group-hover:text-black`}>Bookings</span>
						</Link>
					</div>
				</div>
			</div>

			{/* Logout */}
			<button
				type="button"
				className="group relative w-32 h-8 inline-flex items-center gap-3"
				onClick={() => console.log("logout clicked")}
				aria-label="Se déconnecter"
			>
				<div className="pointer-events-none absolute left-[-11px] top-[-3px] w-48 h-9 bg-[#0032D7]/50 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true"></div>
				<i className="fi fi-br-power text-lg text-red-600/50 group-hover:text-red-600" aria-hidden="true"></i>
				<span className={`${istok.className} text-lg font-bold text-black/50 group-hover:text-black`}>Log out</span>
			</button>
		</nav>
	);
}
