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
import { logout as doLogout, getUserRights } from "../../lib/handleUser";
import { useState, useEffect } from "react";

const anton = Anton({ subsets: ["latin"], weight: "400" });
const istok = Istok_Web({ subsets: ["latin"], weight: ["400", "700"] });

export default function Navbar() {
    const pathname = usePathname();
    const [userRights, setUserRights] = useState<string[]>([]);
    const isActive = (href: string) => href !== "#" && (href === "/" ? pathname === "/" : pathname.startsWith(href));

    useEffect(() => {
        setUserRights(getUserRights());
    }, []);

    const hasRight = (right: string) => userRights.includes(right);
    const canAccessDashboard = hasRight('EDIT_ROOM') || hasRight('EDIT_USER');

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
				<div className={`pointer-events-none absolute left-[-11px] top-[-3px] w-48 h-9 bg-[#0032D7]/30 rounded-sm transition-opacity ${isActive("/") ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`} aria-hidden="true"></div>
				<i className={`fi fi-sr-map text-xl flex items-center ${isActive("/") ? "text-blue-700" : "text-blue-700/50 group-hover:text-blue-700"}`} aria-hidden="true"></i>
				<span className={`${istok.className} text-base font-bold ${isActive("/") ? "text-black" : "text-black/50 group-hover:text-black"}`}>Plan</span>
			</Link>
			<Link href="/schedule" className="group relative w-32 h-8 inline-flex items-center gap-3" aria-current={isActive("/schedule") ? "page" : undefined}>
				<div className={`pointer-events-none absolute left-[-11px] top-[-3px] w-48 h-9 bg-[#0032D7]/30 rounded-sm transition-opacity ${isActive("/schedule") ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`} aria-hidden="true"></div>
				<i className={`fi fi-sr-calendar text-xl flex items-center ${isActive("/schedule") ? "text-blue-700" : "text-blue-700/50 group-hover:text-blue-700"}`} aria-hidden="true"></i>
				<span className={`${istok.className} text-base font-bold ${isActive("/schedule") ? "text-black" : "text-black/50 group-hover:text-black"}`}>Schedule</span>
			</Link>
			<Link href="/bookings" className="group relative w-32 h-8 inline-flex items-center gap-3" aria-current={isActive("/bookings") ? "page" : undefined}>
				<div className={`pointer-events-none absolute left-[-11px] top-[-3px] w-48 h-9 bg-[#0032D7]/30 rounded-sm transition-opacity ${isActive("/bookings") ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`} aria-hidden="true"></div>
				<i className={`fi fi-sr-calendar-check text-xl flex items-center ${isActive("/bookings") ? "text-blue-700" : "text-blue-700/50 group-hover:text-blue-700"}`} aria-hidden="true"></i>
				<span className={`${istok.className} text-base font-bold ${isActive("/bookings") ? "text-black" : "text-black/50 group-hover:text-black"}`}>Bookings</span>
			</Link>
			{/* Section Dashboard */}
				{canAccessDashboard && (
					<div className="mt-2">
						<div className={`${anton.className} mb-3`}>
							<span className="text-blue-700 text-2xl">DASHBOARD</span>
							<span className="text-orange-400 text-2xl">_</span>
						</div>
						<div className="flex flex-col gap-4">
						<Link href="/dashboard/overview" className="group relative w-32 h-8 inline-flex items-center gap-3" aria-current={isActive("/dashboard/overview") ? "page" : undefined}>
							<div className={`pointer-events-none absolute left-[-11px] top-[-3px] w-48 h-9 bg-[#0032D7]/30 rounded-sm transition-opacity ${isActive("/dashboard/overview") ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`} aria-hidden="true"></div>
							<i className={`fi fi-sr-compass-alt text-xl flex items-center ${isActive("/dashboard/overview") ? "text-blue-700" : "text-blue-700/50 group-hover:text-blue-700"}`} aria-hidden="true"></i>
							<span className={`${istok.className} text-base font-bold ${isActive("/dashboard/overview") ? "text-black" : "text-black/50 group-hover:text-black"}`}>Overview</span>
						</Link>
							{hasRight('EDIT_USER') && (
							<Link href="/dashboard/students" className="group relative w-32 h-8 inline-flex items-center gap-3" aria-current={isActive("/dashboard/students") ? "page" : undefined}>
								<div className={`pointer-events-none absolute left-[-11px] top-[-3px] w-48 h-9 bg-[#0032D7]/30 rounded-sm transition-opacity ${isActive("/dashboard/students") ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`} aria-hidden="true"></div>
								<i className={`fi fi-br-circle-user text-xl flex items-center ${isActive("/dashboard/students") ? "text-blue-700" : "text-blue-700/50 group-hover:text-blue-700"}`} aria-hidden="true"></i>
								<span className={`${istok.className} text-base font-bold ${isActive("/dashboard/students") ? "text-black" : "text-black/50 group-hover:text-black"}`}>Students</span>
							</Link>
							)}
							{hasRight('EDIT_ROOM') && (
							<Link href="/dashboard/campus" className="group relative w-32 h-8 inline-flex items-center gap-3" aria-current={isActive("/dashboard/campus") ? "page" : undefined}>
								<div className={`pointer-events-none absolute left-[-11px] top-[-3px] w-48 h-9 bg-[#0032D7]/30 rounded-sm transition-opacity ${isActive("/dashboard/campus") ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`} aria-hidden="true"></div>
								<i className={`fi fi-br-lock-alt text-xl flex items-center ${isActive("/dashboard/campus") ? "text-blue-700" : "text-blue-700/50 group-hover:text-blue-700"}`} aria-hidden="true"></i>
								<span className={`${istok.className} text-base font-bold ${isActive("/dashboard/campus") ? "text-black" : "text-black/50 group-hover:text-black"}`}>Campus</span>
							</Link>
							)}
						</div>
					</div>
				)}
			</div>

			{/* Logout */}
			<button
				type="button"
				className="group relative w-32 h-8 inline-flex items-center gap-3"
				onClick={doLogout}
				aria-label="Se déconnecter"
			>
			<div className="pointer-events-none absolute left-[-11px] top-[-3px] w-48 h-9 bg-red-600/30 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true"></div>
			<i className="fi fi-br-power text-xl flex items-center text-red-600/70 group-hover:text-red-700" aria-hidden="true"></i>
			<span className={`${istok.className} text-base font-bold text-black/70 group-hover:text-black`}>Log out</span>
		</button>
		</nav>
	);
}
