CREATE DATABASE  IF NOT EXISTS `feorganizada` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `feorganizada`;
-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: feorganizada
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `igreja`
--

DROP TABLE IF EXISTS `igreja`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `igreja` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `url` varchar(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `url` (`url`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `igreja_endereco`
--

DROP TABLE IF EXISTS `igreja_endereco`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `igreja_endereco` (
  `id` int NOT NULL AUTO_INCREMENT,
  `igreja_id` int NOT NULL,
  `estado` varchar(50) NOT NULL,
  `cidade` varchar(50) NOT NULL,
  `bairro` varchar(50) NOT NULL,
  `rua` varchar(150) NOT NULL,
  `complemento` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `igreja_id` (`igreja_id`),
  CONSTRAINT `igreja_endereco_ibfk_1` FOREIGN KEY (`igreja_id`) REFERENCES `igreja` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `igreja_telefone`
--

DROP TABLE IF EXISTS `igreja_telefone`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `igreja_telefone` (
  `id` int NOT NULL AUTO_INCREMENT,
  `igreja_id` int NOT NULL,
  `telefone` char(15) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `igreja_id` (`igreja_id`),
  CONSTRAINT `igreja_telefone_ibfk_1` FOREIGN KEY (`igreja_id`) REFERENCES `igreja` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `membros`
--

DROP TABLE IF EXISTS `membros`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `membros` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(200) NOT NULL,
  `nascimento` date NOT NULL,
  `igreja_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `igreja_id` (`igreja_id`),
  CONSTRAINT `membros_ibfk_1` FOREIGN KEY (`igreja_id`) REFERENCES `igreja` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `membros_adm`
--

DROP TABLE IF EXISTS `membros_adm`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `membros_adm` (
  `id` int NOT NULL AUTO_INCREMENT,
  `login` varchar(20) NOT NULL,
  `senha` varchar(100) NOT NULL,
  `membros_id` int NOT NULL,
  `igreja_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `membros_id` (`membros_id`),
  KEY `igreja_id` (`igreja_id`),
  CONSTRAINT `membros_adm_ibfk_1` FOREIGN KEY (`membros_id`) REFERENCES `membros` (`id`),
  CONSTRAINT `membros_adm_ibfk_2` FOREIGN KEY (`igreja_id`) REFERENCES `igreja` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `membros_endereco`
--

DROP TABLE IF EXISTS `membros_endereco`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `membros_endereco` (
  `id` int NOT NULL AUTO_INCREMENT,
  `estado` varchar(50) NOT NULL,
  `cidade` varchar(50) NOT NULL,
  `bairro` varchar(50) NOT NULL,
  `rua` varchar(150) NOT NULL,
  `complemento` varchar(50) DEFAULT NULL,
  `membros_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `membros_id` (`membros_id`),
  CONSTRAINT `membros_endereco_ibfk_1` FOREIGN KEY (`membros_id`) REFERENCES `membros` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `membros_master`
--

DROP TABLE IF EXISTS `membros_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `membros_master` (
  `id` int NOT NULL AUTO_INCREMENT,
  `login` varchar(20) NOT NULL,
  `senha` varchar(100) NOT NULL,
  `email` varchar(50) NOT NULL,
  `membros_id` int NOT NULL,
  `igreja_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `membros_id` (`membros_id`),
  UNIQUE KEY `igreja_id` (`igreja_id`),
  CONSTRAINT `membros_master_ibfk_1` FOREIGN KEY (`membros_id`) REFERENCES `membros` (`id`),
  CONSTRAINT `membros_master_ibfk_2` FOREIGN KEY (`igreja_id`) REFERENCES `igreja` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `membros_telefone`
--

DROP TABLE IF EXISTS `membros_telefone`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `membros_telefone` (
  `id` int NOT NULL AUTO_INCREMENT,
  `telefone` char(15) NOT NULL,
  `membros_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `membros_id` (`membros_id`),
  CONSTRAINT `membros_telefone_ibfk_1` FOREIGN KEY (`membros_id`) REFERENCES `membros` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ministerios`
--

DROP TABLE IF EXISTS `ministerios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ministerios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(25) NOT NULL,
  `igreja_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nome_ministerio` (`igreja_id`,`nome`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ministerios_membros`
--

DROP TABLE IF EXISTS `ministerios_membros`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ministerios_membros` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ministerios_id` int NOT NULL,
  `membros_id` int NOT NULL,
  `funcao` varchar(15) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nome_membro` (`ministerios_id`,`membros_id`),
  KEY `membros_id` (`membros_id`),
  CONSTRAINT `ministerios_membros_ibfk_1` FOREIGN KEY (`ministerios_id`) REFERENCES `ministerios` (`id`),
  CONSTRAINT `ministerios_membros_ibfk_2` FOREIGN KEY (`membros_id`) REFERENCES `membros` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping events for database 'feorganizada'
--

--
-- Dumping routines for database 'feorganizada'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-07  9:48:38
