/*
  Warnings:

  - You are about to drop the column `locationId` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the `Location` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `location` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Event` DROP FOREIGN KEY `Event_locationId_fkey`;

-- AlterTable
ALTER TABLE `Event` DROP COLUMN `locationId`,
    ADD COLUMN `location` JSON NOT NULL;

-- DropTable
DROP TABLE `Location`;
