/*
** EPITECH PROJECT, 2025
** EPI BOOKING
** File description:
** Login route (no header/navbar)
*/

"use client";

import styles from "../page.module.css";
import LoginSection from "@/components/sections/Login";

export default function Login() {
    return (
        <div className={styles.pageWrapper}>
            <div className={styles.canvas}>
                {/* Login */}
                <LoginSection
                    topLogoSrc="/images/epitech_logo2.png"
                    titleImageSrc="/images/office.png"
                />
            </div>
        </div>
    );
}
