-- DropForeignKey
ALTER TABLE `Artist` DROP FOREIGN KEY `Artist_bandId_fkey`;

-- CreateTable
CREATE TABLE `_ArtistToBand` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_ArtistToBand_AB_unique`(`A`, `B`),
    INDEX `_ArtistToBand_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_ArtistToBand` ADD CONSTRAINT `_ArtistToBand_A_fkey` FOREIGN KEY (`A`) REFERENCES `Artist`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ArtistToBand` ADD CONSTRAINT `_ArtistToBand_B_fkey` FOREIGN KEY (`B`) REFERENCES `Band`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
