-- CreateTable
CREATE TABLE `Log` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `datetime` VARCHAR(191) NOT NULL,
    `action` VARCHAR(191) NOT NULL,
    `target` VARCHAR(191) NOT NULL,
    `message` TEXT NOT NULL,
    `request_ip` VARCHAR(191) NULL,
    `admin_id` INTEGER NOT NULL,
    `admin_name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
