-- CreateTable
CREATE TABLE `igreja` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(100) NOT NULL,
    `url` VARCHAR(20) NOT NULL,

    UNIQUE INDEX `igreja_url_key`(`url`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `igreja_telefone` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `telefone` CHAR(15) NOT NULL,
    `igreja_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `igreja_endereco` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `estado` VARCHAR(50) NOT NULL,
    `cidade` VARCHAR(50) NOT NULL,
    `bairro` VARCHAR(50) NOT NULL,
    `rua` VARCHAR(150) NOT NULL,
    `complemento` VARCHAR(50) NULL,
    `igreja_id` INTEGER NOT NULL,

    UNIQUE INDEX `igreja_endereco_igreja_id_key`(`igreja_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `membro` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(200) NOT NULL,
    `nascimento` DATETIME(3) NOT NULL,
    `igreja_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `membro_endereco` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `estado` VARCHAR(50) NOT NULL,
    `cidade` VARCHAR(50) NOT NULL,
    `bairro` VARCHAR(50) NOT NULL,
    `rua` VARCHAR(150) NOT NULL,
    `complemento` VARCHAR(50) NULL,
    `membro_id` INTEGER NOT NULL,

    UNIQUE INDEX `membro_endereco_membro_id_key`(`membro_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `membro_telefone` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `telefone` CHAR(15) NOT NULL,
    `membro_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `membro_adm` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `login` VARCHAR(20) NOT NULL,
    `senha` VARCHAR(100) NOT NULL,
    `membro_id` INTEGER NOT NULL,
    `igreja_id` INTEGER NOT NULL,

    UNIQUE INDEX `membro_adm_membro_id_key`(`membro_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `membro_master` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `login` VARCHAR(20) NOT NULL,
    `senha` VARCHAR(100) NOT NULL,
    `email` VARCHAR(50) NOT NULL,
    `membro_id` INTEGER NOT NULL,
    `igreja_id` INTEGER NOT NULL,

    UNIQUE INDEX `membro_master_email_key`(`email`),
    UNIQUE INDEX `membro_master_membro_id_key`(`membro_id`),
    UNIQUE INDEX `membro_master_igreja_id_key`(`igreja_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ministerio` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(25) NOT NULL,
    `igreja_id` INTEGER NOT NULL,

    UNIQUE INDEX `ministerio_igreja_id_nome_key`(`igreja_id`, `nome`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ministerio_membros` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `funcao` VARCHAR(15) NOT NULL,
    `ministerio_id` INTEGER NOT NULL,
    `membro_id` INTEGER NOT NULL,

    UNIQUE INDEX `ministerio_membros_ministerio_id_membro_id_key`(`ministerio_id`, `membro_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `igreja_telefone` ADD CONSTRAINT `igreja_telefone_igreja_id_fkey` FOREIGN KEY (`igreja_id`) REFERENCES `igreja`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `igreja_endereco` ADD CONSTRAINT `igreja_endereco_igreja_id_fkey` FOREIGN KEY (`igreja_id`) REFERENCES `igreja`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `membro` ADD CONSTRAINT `membro_igreja_id_fkey` FOREIGN KEY (`igreja_id`) REFERENCES `igreja`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `membro_endereco` ADD CONSTRAINT `membro_endereco_membro_id_fkey` FOREIGN KEY (`membro_id`) REFERENCES `membro`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `membro_telefone` ADD CONSTRAINT `membro_telefone_membro_id_fkey` FOREIGN KEY (`membro_id`) REFERENCES `membro`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `membro_adm` ADD CONSTRAINT `membro_adm_membro_id_fkey` FOREIGN KEY (`membro_id`) REFERENCES `membro`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `membro_adm` ADD CONSTRAINT `membro_adm_igreja_id_fkey` FOREIGN KEY (`igreja_id`) REFERENCES `igreja`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `membro_master` ADD CONSTRAINT `membro_master_membro_id_fkey` FOREIGN KEY (`membro_id`) REFERENCES `membro`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `membro_master` ADD CONSTRAINT `membro_master_igreja_id_fkey` FOREIGN KEY (`igreja_id`) REFERENCES `igreja`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ministerio` ADD CONSTRAINT `ministerio_igreja_id_fkey` FOREIGN KEY (`igreja_id`) REFERENCES `igreja`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ministerio_membros` ADD CONSTRAINT `ministerio_membros_ministerio_id_fkey` FOREIGN KEY (`ministerio_id`) REFERENCES `ministerio`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ministerio_membros` ADD CONSTRAINT `ministerio_membros_membro_id_fkey` FOREIGN KEY (`membro_id`) REFERENCES `membro`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
