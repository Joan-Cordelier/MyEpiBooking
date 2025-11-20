/*
  Warnings:

  - The values [BOOTHING] on the enum `reservations_type` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `reservations` MODIFY `type` ENUM('MEETING', 'WORK', 'KICK_OFF', 'BOOTSTRAP', 'WORKSHOP', 'TALK', 'UNEXPECTED') NOT NULL;
