-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: hoarding_leasing
-- ------------------------------------------------------
-- Server version	8.0.43

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
-- Table structure for table `clients`
--

DROP TABLE IF EXISTS `clients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clients` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `address` text,
  `status` enum('ACTIVE','HIDDEN') DEFAULT 'ACTIVE',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `hoarding_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_client_hoarding` (`hoarding_id`),
  CONSTRAINT `fk_client_hoarding` FOREIGN KEY (`hoarding_id`) REFERENCES `hoardings` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clients`
--

LOCK TABLES `clients` WRITE;
/*!40000 ALTER TABLE `clients` DISABLE KEYS */;
INSERT INTO `clients` VALUES (5,'Malavika M','malu@gmail.com','9895483412','mahesh villa,ambalappuzha ,alappuzha','ACTIVE','2026-09-25 09:43:43','2026-09-25 09:43:43',12);
/*!40000 ALTER TABLE `clients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `districts`
--

DROP TABLE IF EXISTS `districts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `districts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `state_id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `status` enum('ACTIVE','HIDDEN') DEFAULT 'ACTIVE',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `state_id` (`state_id`,`name`),
  CONSTRAINT `districts_ibfk_1` FOREIGN KEY (`state_id`) REFERENCES `states` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `districts`
--

LOCK TABLES `districts` WRITE;
/*!40000 ALTER TABLE `districts` DISABLE KEYS */;
INSERT INTO `districts` VALUES (1,1,'Ernakulam','ACTIVE','2026-09-24 10:26:46','2026-09-24 10:26:46'),(2,1,'Alappuzha','ACTIVE','2026-09-24 11:32:44','2026-09-24 11:32:44'),(3,1,'Kozhikode','ACTIVE','2026-09-25 05:07:59','2026-09-25 05:07:59'),(4,1,'Thrissur','ACTIVE','2026-09-25 05:25:22','2026-09-25 05:25:22');
/*!40000 ALTER TABLE `districts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hoarding_images`
--

DROP TABLE IF EXISTS `hoarding_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hoarding_images` (
  `id` int NOT NULL AUTO_INCREMENT,
  `hoarding_id` int NOT NULL,
  `image_path` varchar(255) NOT NULL,
  `sort_order` int DEFAULT '0',
  `status` enum('ACTIVE','HIDDEN') DEFAULT 'ACTIVE',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `hoarding_id` (`hoarding_id`),
  CONSTRAINT `hoarding_images_ibfk_1` FOREIGN KEY (`hoarding_id`) REFERENCES `hoardings` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hoarding_images`
--

LOCK TABLES `hoarding_images` WRITE;
/*!40000 ALTER TABLE `hoarding_images` DISABLE KEYS */;
INSERT INTO `hoarding_images` VALUES (1,9,'/uploads/1790248689169-386447831.jpg',1,'ACTIVE','2026-09-24 11:12:13','2026-09-24 11:18:09'),(2,10,'/uploads/1790313864035-353653663.jpg',1,'ACTIVE','2026-09-25 05:24:24','2026-09-25 05:24:24'),(3,11,'/uploads/1790314242368-617083242.jpg',1,'ACTIVE','2026-09-25 05:30:42','2026-09-25 05:30:42'),(4,12,'/uploads/1790314957957-56900834.png',1,'ACTIVE','2026-09-25 05:42:37','2026-09-25 05:42:37');
/*!40000 ALTER TABLE `hoarding_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hoardings`
--

DROP TABLE IF EXISTS `hoardings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hoardings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `location_id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text,
  `availability_status` enum('AVAILABLE','OCCUPIED') DEFAULT 'AVAILABLE',
  `occupied_till` date DEFAULT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `google_maps_url` text,
  `status` enum('ACTIVE','HIDDEN') DEFAULT 'ACTIVE',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `amount` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `location_id` (`location_id`),
  CONSTRAINT `hoardings_ibfk_1` FOREIGN KEY (`location_id`) REFERENCES `locations` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hoardings`
--

LOCK TABLES `hoardings` WRITE;
/*!40000 ALTER TABLE `hoardings` DISABLE KEYS */;
INSERT INTO `hoardings` VALUES (9,1,'kakkanad billboard','40-20ft','AVAILABLE',NULL,10.00100000,76.32300000,'http/location/kakkkanad','ACTIVE','2026-09-24 11:07:11','2026-09-24 11:07:11',30000.00),(10,3,'KK highway board','','OCCUPIED','2026-09-26',10.00100000,76.32300000,'https://maps.app.goo.gl/NfrmE2B7Spacujqz5?g_st=aw','ACTIVE','2026-09-25 05:24:24','2026-09-25 05:24:24',50000.00),(11,4,'Thrissur Center','sample','AVAILABLE',NULL,10.52823529,76.21627711,'https://www.google.com/maps/search/?api=1&query=Swaraj+Round%2C+Thrissur%2C+Kerala&utm_source=chatgpt.com','ACTIVE','2026-09-25 05:30:42','2026-09-25 05:30:42',55000.00),(12,5,'lulu branding board','','AVAILABLE',NULL,11.00000000,80.12330000,'https://www.google.com/maps/search/?api=1&query=Lulu+Mall%2C+Edappally%2C+Ernakulam%2C+Kerala&utm_source=chatgpt.com','ACTIVE','2026-09-25 05:42:37','2026-09-25 05:42:37',75000.00);
/*!40000 ALTER TABLE `hoardings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `locations`
--

DROP TABLE IF EXISTS `locations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `locations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `district_id` int NOT NULL,
  `client_id` int DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `description` text,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `google_maps_url` text,
  `status` enum('ACTIVE','HIDDEN') DEFAULT 'ACTIVE',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `district_id` (`district_id`),
  KEY `fk_location_client` (`client_id`),
  CONSTRAINT `fk_location_client` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE SET NULL,
  CONSTRAINT `locations_ibfk_1` FOREIGN KEY (`district_id`) REFERENCES `districts` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `locations`
--

LOCK TABLES `locations` WRITE;
/*!40000 ALTER TABLE `locations` DISABLE KEYS */;
INSERT INTO `locations` VALUES (1,1,NULL,'Kakkanad',NULL,NULL,NULL,NULL,'ACTIVE','2026-09-24 10:26:46','2026-09-24 10:26:46'),(2,1,NULL,'Ernakulam Central',NULL,NULL,NULL,NULL,'ACTIVE','2026-09-24 10:26:46','2026-09-24 10:26:46'),(3,3,NULL,'kozhikode highway','',10.00100000,76.32300000,'','ACTIVE','2026-09-25 05:12:01','2026-09-25 05:12:01'),(4,4,NULL,'Thrissur Round','sample',10.52823529,76.21627711,'','ACTIVE','2026-09-25 05:26:54','2026-09-25 05:26:54'),(5,1,NULL,'Edappally ernakulam','',11.00000000,80.12330000,NULL,'ACTIVE','2026-09-25 05:34:30','2026-09-25 05:39:12');
/*!40000 ALTER TABLE `locations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `states`
--

DROP TABLE IF EXISTS `states`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `states` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `status` enum('ACTIVE','HIDDEN') DEFAULT 'ACTIVE',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `states`
--

LOCK TABLES `states` WRITE;
/*!40000 ALTER TABLE `states` DISABLE KEYS */;
INSERT INTO `states` VALUES (1,'Kerala','ACTIVE','2026-09-24 08:40:50','2026-09-24 08:40:50'),(2,'Tamil Nadu','ACTIVE','2026-09-24 08:40:50','2026-09-24 08:40:50'),(3,'Karnataka','ACTIVE','2026-09-24 08:40:50','2026-09-24 08:40:50'),(4,'Mumbai','HIDDEN','2026-09-24 11:25:27','2026-09-24 11:25:27');
/*!40000 ALTER TABLE `states` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('ADMIN','CLIENT') NOT NULL,
  `client_id` int DEFAULT NULL,
  `status` enum('ACTIVE','HIDDEN') DEFAULT 'ACTIVE',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `fk_user_client` (`client_id`),
  CONSTRAINT `fk_user_client` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Admin User','admin@hoarding.com','$2b$10$y/dTJw1/R2ZmdoxNQL7kn..y63gcPVV5GvLbFlvXLvZ5vbNIdQ4aq','ADMIN',NULL,'ACTIVE','2026-09-24 08:40:50','2026-09-24 08:40:50'),(2,'Client User','client@hoarding.com','$2b$10$lSbFWGI/A.vzFeOJUT2RNO02KY2aYrPFbvLf9gWv3R8vlwlqH84tG','CLIENT',NULL,'ACTIVE','2026-09-24 08:40:50','2026-09-24 08:40:50');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-25 16:07:09
