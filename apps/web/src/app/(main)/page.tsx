/*
** EPITECH PROJECT, 2025
** EPI BOOKING
** File description:
** Homepage (grouped under main layout)
*/

"use client";

import styles from "../page.module.css";

export default function Home() {
  return (

    <div className={styles.pageWrapper}>
      <div className={styles.canvas}>
        <p>
          home
        </p>
        {/* Responsive container centered without transform scaling to keep calendar aligned */}
        {/* <div className="mx-auto max-w-[1600px] lg:max-w-[1800px] px-4 sm:px-6 lg:px-8 mt-8 sm:mt-12 md:mt-16">
          <BookingCalendarSection />
        </div> */}
      </div>
    </div>
  );
}
