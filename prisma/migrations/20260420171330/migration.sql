/*
  Warnings:

  - You are about to drop the `ministerio_membros` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `ministerio_membros` DROP FOREIGN KEY `ministerio_membros_membro_id_fkey`;

-- DropForeignKey
ALTER TABLE `ministerio_membros` DROP FOREIGN KEY `ministerio_membros_ministerio_id_fkey`;

-- DropTable
DROP TABLE `ministerio_membros`;

-- CreateTable
CREATE TABLE `ministerio_membro` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `funcao` VARCHAR(15) NOT NULL,
    `ministerio_id` INTEGER NOT NULL,
    `membro_id` INTEGER NOT NULL,

    UNIQUE INDEX `ministerio_membro_ministerio_id_membro_id_key`(`ministerio_id`, `membro_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ministerio_membro` ADD CONSTRAINT `ministerio_membro_ministerio_id_fkey` FOREIGN KEY (`ministerio_id`) REFERENCES `ministerio`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ministerio_membro` ADD CONSTRAINT `ministerio_membro_membro_id_fkey` FOREIGN KEY (`membro_id`) REFERENCES `membro`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
