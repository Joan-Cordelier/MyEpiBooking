/*
** EPITECH PROJECT, 2025
** EPI BOOKING
** File description:
** Login system file
*/

"use client";

import { Anton } from "next/font/google";
import { useRouter } from "next/navigation";
import AdminLogin from "@/components/ui/AdminLogin";

import { handleMicrosoftLogin, handleLogin } from "./login"

const anton = Anton({ subsets: ["latin"], weight: "400" });

type LoginProps = {
	onEpitechLogin?: () => void;
	onAdminLogin?: (email: string, password: string) => Promise<void> | void;
	topLogoSrc?: string;
	titleImageSrc?: string;
};

export default function Login({
	topLogoSrc = "https://placehold.co/328x81",
	titleImageSrc = "https://placehold.co/431x100",
}: LoginProps) {
    return (
        <section className="w-full min-h-[80vh] bg-white overflow-hidden flex items-center justify-center">
            <div className="w-[891px] h-[587px] rounded-xl border border-black/50 bg-transparent flex">
                <div className="m-auto w-full max-w-[731px] flex flex-col items-center">
                    <img
                        src={topLogoSrc}
                        alt="Top logo"
                        className="w-80 h-20 object-contain"
                    />

                    <div className="w-full h-px bg-black/50 mt-10" />

                    <img
                        src={titleImageSrc}
                        alt="Title"
                        className="w-96 h-24 object-contain mt-8"
                    />

                    <button
                        type="button"
                        onClick={handleMicrosoftLogin}
                        className={`mt-8 w-[556px] h-7 bg-blue-700 text-white flex items-center justify-center hover:brightness-95 transition-all ${anton.className}`}
                        aria-label="Se connecter avec un compte Epitech"
                    >
                        <span className="text-xl">&gt;&gt;</span>
                        <span className="text-lg">&nbsp; SE CONNECTER AVEC UN COMPTE EPITECH &nbsp;</span>
                        <span className="text-xl">&lt;&lt;</span>
                    </button>

                    <div className={`mt-6 text-center text-black text-lg ${anton.className}`}>OU</div>

                    <AdminLogin
                        className={`mt-4 w-[556px] h-7`}
                        onSubmit={handleLogin}
                    />
                </div>
            </div>
        </section>
    );
}

