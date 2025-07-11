-- AlterTable
ALTER TABLE `Artist` ADD COLUMN `birthdate` VARCHAR(191) NULL,
    ADD COLUMN `image` VARCHAR(191) NULL,
    ADD COLUMN `instagram` VARCHAR(191) NULL,
    MODIFY `description` VARCHAR(191) NULL;
