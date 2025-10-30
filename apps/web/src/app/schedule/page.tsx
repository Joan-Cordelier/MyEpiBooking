/*
** EPITECH PROJECT, 2025
** EPI BOOKING
** File description:
** Scedule page
*/

"use client";

import styles from "../page.module.css";
import BookingCalendarSection from "@/components/sections/Calendar";

export default function Schedule() {
  return (
    <div className={styles.pageWrapper}>
      <div className={styles.canvas}>
        {/* Calendar */}
        <div className="mx-auto max-w-[1600px] lg:max-w-[1800px] px-4 sm:px-6 lg:px-8 mt-8 sm:mt-12 md:mt-16">
          <BookingCalendarSection />
        </div>
      </div>
    </div>
  );
}
