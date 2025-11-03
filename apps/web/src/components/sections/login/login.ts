/*
** EPITECH PROJECT, 2025
** EPI BOOKING
** File description:
** Login function
*/

"use client";

import { useRouter } from "next/navigation";
import * as Auth from "@/api/backend/auth";

export function handleMicrosoftLogin()
{
    const router = useRouter();

    console.log("Epitech login clicked");
    router.push("/schedule"); // TEMPORARY FAKE REDIRECTION
}

export async function handleLogin(email: string, password: string): Promise<void> {
    console.log(`${email}:${password}`);
    try {
        const data = await Auth.login(email, password);

        if (data?.token) {
            localStorage.setItem('token', data.token);
            if (data.user)
                localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.removeItem('jwtToken');
        }
    } catch (e) {
        console.error("Login failed:", e);
    }
}

