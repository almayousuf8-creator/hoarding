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
  `status` enum('ACTIVE','HIDDEN','UNDER REVIEW') DEFAULT 'UNDER REVIEW',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `hoarding_id` int DEFAULT NULL,
  `note` text,
  PRIMARY KEY (`id`),
  KEY `fk_client_hoarding` (`hoarding_id`),
  CONSTRAINT `fk_client_hoarding` FOREIGN KEY (`hoarding_id`) REFERENCES `hoardings` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clients`
--

LOCK TABLES `clients` WRITE;
/*!40000 ALTER TABLE `clients` DISABLE KEYS */;
INSERT INTO `clients` VALUES (22,'riju','riju@gmail.com','8899774425',NULL,'ACTIVE','2026-10-05 11:52:58','2026-10-06 06:28:56',10,'enquiry'),(23,'Anusree','an@123.com','9882834567',NULL,'UNDER REVIEW','2026-10-06 04:51:41','2026-10-06 04:51:41',9,'emergency');
/*!40000 ALTER TABLE `clients` ENABLE KEYS */;
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
  KEY `hoarding_images_ibfk_1` (`hoarding_id`),
  CONSTRAINT `hoarding_images_ibfk_1` FOREIGN KEY (`hoarding_id`) REFERENCES `hoardings` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hoarding_images`
--

LOCK TABLES `hoarding_images` WRITE;
/*!40000 ALTER TABLE `hoarding_images` DISABLE KEYS */;
INSERT INTO `hoarding_images` VALUES (1,9,'/uploads/1790248689169-386447831.jpg',1,'ACTIVE','2026-09-24 11:12:13','2026-09-24 11:18:09'),(2,10,'/uploads/1790313864035-353653663.jpg',1,'ACTIVE','2026-09-25 05:24:24','2026-09-25 05:24:24'),(3,11,'/uploads/1790314242368-617083242.jpg',1,'HIDDEN','2026-09-25 05:30:42','2026-10-05 10:30:17'),(4,12,'/uploads/1790314957957-56900834.png',1,'ACTIVE','2026-09-25 05:42:37','2026-09-25 05:42:37'),(5,13,'/uploads/1790595537332-870649019.jpg',1,'ACTIVE','2026-09-28 11:38:57','2026-09-28 11:38:57'),(6,9,'/uploads/1790833576923-444550553.png',2,'ACTIVE','2026-10-01 05:46:16','2026-10-01 05:46:16'),(7,10,'/uploads/1790849930803-516614087.png',2,'HIDDEN','2026-10-01 10:18:50','2026-10-01 10:19:11'),(8,10,'/uploads/1790850622804-595498967.png',3,'ACTIVE','2026-10-01 10:30:22','2026-10-01 10:30:22'),(9,11,'/uploads/1791196586363-842735336.jpg',2,'ACTIVE','2026-10-05 10:36:26','2026-10-05 10:36:26'),(11,15,'/uploads/1791269254782-202005547.png',1,'ACTIVE','2026-10-06 06:47:34','2026-10-06 06:47:34'),(12,15,'/uploads/1791269254809-219101767.png',2,'ACTIVE','2026-10-06 06:47:34','2026-10-06 06:47:34'),(13,17,'/uploads/1791271003244-25106076.jpg',1,'ACTIVE','2026-10-06 07:16:43','2026-10-06 07:16:43'),(14,17,'/uploads/1791271003249-864868265.jpg',2,'ACTIVE','2026-10-06 07:16:43','2026-10-06 07:16:43');
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
  `dimensions` varchar(255) DEFAULT NULL,
  `availability_status` enum('AVAILABLE','OCCUPIED') DEFAULT 'AVAILABLE',
  `occupied_till` date DEFAULT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `google_maps_url` text,
  `status` enum('ACTIVE','HIDDEN') DEFAULT 'ACTIVE',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `state` varchar(255) DEFAULT '',
  `district` varchar(255) DEFAULT '',
  `is_deleted` tinyint DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `location_id` (`location_id`),
  CONSTRAINT `hoardings_ibfk_1` FOREIGN KEY (`location_id`) REFERENCES `locations` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hoardings`
--

LOCK TABLES `hoardings` WRITE;
/*!40000 ALTER TABLE `hoardings` DISABLE KEYS */;
INSERT INTO `hoardings` VALUES (9,1,'Kakkanad Billboard','kakkand high attention area.','20-24ft','OCCUPIED','2026-10-08',10.00100000,80.12330000,'https://www.google.com/maps/search/?api=1&query=Kakkanad%2C+Ernakulam%2C+Kerala&utm_source=chatgpt.com','ACTIVE','2026-09-24 11:07:11','2026-10-05 11:37:02','kerala','Ernakulam',0),(10,3,'KK highway board','center focus, maximum visibility.Multiple view points','12 × 24 ft','AVAILABLE',NULL,10.00100000,76.32300000,'https://maps.app.goo.gl/NfrmE2B7Spacujqz5?g_st=aw','ACTIVE','2026-09-25 05:24:24','2026-10-06 06:29:05','kerala','kozhikode',0),(11,4,'Thrissur Center','center of focus from all direction.','','OCCUPIED','2026-10-10',10.52823529,76.21627711,'https://www.google.com/maps/search/?api=1&query=Swaraj+Round%2C+Thrissur%2C+Kerala&utm_source=chatgpt.com','ACTIVE','2026-09-25 05:30:42','2026-10-05 11:37:15','kerala','Thrissur',0),(12,5,'lulu branding board','Located near LuLu Mall, Edappally, this premium hoarding offers excellent visibility in one of Kochi’s busiest commercial areas.','30 × 60 ft','AVAILABLE',NULL,11.00000000,80.12330000,'https://www.google.com/maps/search/?api=1&query=Lulu+Mall%2C+Edappally%2C+Ernakulam%2C+Kerala&utm_source=chatgpt.com','ACTIVE','2026-09-25 05:42:37','2026-10-03 11:35:39','kerala','Ernakulam',0),(13,6,'Kannur highlight','center of junction. Maximum Attention .','30 × 60 ft','AVAILABLE',NULL,10.52823529,76.21627711,'https://maps.app.goo.gl/NfrmE2B7Spacujqz5?g_st=aw','ACTIVE','2026-09-28 11:38:57','2026-10-03 11:36:07','Kerala','Kannur',0),(15,1,'q','','','AVAILABLE',NULL,NULL,NULL,NULL,'ACTIVE','2026-10-06 06:47:34','2026-10-06 07:15:29','a','q',1),(16,1,'','','','OCCUPIED','2026-10-07',NULL,NULL,NULL,'ACTIVE','2026-10-06 06:59:49','2026-10-06 07:14:52','ss','',1),(17,5,'test','test','20-10ft','AVAILABLE',NULL,10.00100000,80.12330000,'https://maps.app.goo.gl/NfrmE2B7Spacujqz5?g_st=aw','ACTIVE','2026-10-06 07:16:43','2026-10-06 07:18:42','kerala','Ernakulam',1);
/*!40000 ALTER TABLE `hoardings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `leads`
--

DROP TABLE IF EXISTS `leads`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `leads` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `message` text NOT NULL,
  `status` enum('NEW','READ') DEFAULT 'NEW',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `leads`
--

LOCK TABLES `leads` WRITE;
/*!40000 ALTER TABLE `leads` DISABLE KEYS */;
/*!40000 ALTER TABLE `leads` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `locations`
--

DROP TABLE IF EXISTS `locations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `locations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `status` enum('ACTIVE','HIDDEN') DEFAULT 'ACTIVE',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `state` varchar(255) DEFAULT '',
  `district` varchar(255) DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `locations`
--

LOCK TABLES `locations` WRITE;
/*!40000 ALTER TABLE `locations` DISABLE KEYS */;
INSERT INTO `locations` VALUES (1,'Kakkanad','ACTIVE','2026-09-24 10:26:46','2026-10-03 16:04:53','kerala','Ernakulam'),(2,'Ernakulam Central','HIDDEN','2026-09-24 10:26:46','2026-10-05 11:54:03','kerala','Ernakulam'),(3,'kozhikode highway','ACTIVE','2026-09-25 05:12:01','2026-10-03 16:05:20','kerala','kozhikode'),(4,'Thrissur Round','ACTIVE','2026-09-25 05:26:54','2026-10-03 16:05:41','kerala','Thrissur'),(5,'Edappally ernakulam','ACTIVE','2026-09-25 05:34:30','2026-10-03 16:05:58','kerala','Ernakulam'),(6,'Thalaserry','ACTIVE','2026-09-28 11:35:59','2026-10-03 16:06:08','kerala','Kannur'),(10,'Pattambi','HIDDEN','2026-10-03 08:52:33','2026-10-03 15:55:46','kerala','Palakkad'),(11,'kakkanad infopark','HIDDEN','2026-10-03 08:53:56','2026-10-03 14:15:51','kerala','Ernakulam'),(12,'karappakkam','ACTIVE','2026-10-05 11:18:57','2026-10-05 11:18:57','Tamil Nadu','Chennai');
/*!40000 ALTER TABLE `locations` ENABLE KEYS */;
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

-- Dump completed on 2026-10-06 12:59:31
