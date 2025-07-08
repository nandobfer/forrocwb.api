/*
  Warnings:

  - You are about to drop the column `bandId` on the `Artist` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Artist_bandId_fkey` ON `Artist`;

-- AlterTable
ALTER TABLE `Artist` DROP COLUMN `bandId`;
