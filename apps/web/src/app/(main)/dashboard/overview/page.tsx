/*
** EPITECH PROJECT, 2025
** EPI BOOKING
** File description:
** Dashboard page
*/

"use client";

import styles from "../../../page.module.css";
import OverviewKPI from "@/components/sections/Overview";

export default function Overview() {
  return (
    <div className={styles.pageWrapper}>
      <div className={styles.canvas}>
        <OverviewKPI />
      </div>
    </div>
  );
}
