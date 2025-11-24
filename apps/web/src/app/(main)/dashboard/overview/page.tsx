/*
** EPITECH PROJECT, 2025
** EPI BOOKING
** File description:
** Dashboard page
*/

"use client";

import styles from "../../../page.module.css";
import OverviewKPI from "@/components/sections/Overview";
import { getUserRights } from '@/lib/handleUser';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Overview() {
  const router = useRouter();

  useEffect(() => {
    const rights = getUserRights();
    if (!rights.includes('EDIT_ROOM') && !rights.includes('EDIT_USER')) {
      router.push('/');
    }
  }, [router]);

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.canvas}>
        <OverviewKPI />
      </div>
    </div>
  );
}
