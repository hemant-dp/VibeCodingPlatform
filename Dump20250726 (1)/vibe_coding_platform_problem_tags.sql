-- MySQL dump 10.13  Distrib 8.0.29, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: vibe_coding_platform
-- ------------------------------------------------------
-- Server version	5.7.13-log

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
-- Table structure for table `problem_tags`
--

DROP TABLE IF EXISTS `problem_tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `problem_tags` (
  `problem_id` bigint(20) NOT NULL,
  `tag` varchar(255) DEFAULT NULL,
  `tags` varchar(255) DEFAULT NULL,
  KEY `FK75c3mea4mc2l8m7u1eitphhwd` (`problem_id`),
  CONSTRAINT `FK75c3mea4mc2l8m7u1eitphhwd` FOREIGN KEY (`problem_id`) REFERENCES `problems` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `problem_tags`
--

LOCK TABLES `problem_tags` WRITE;
/*!40000 ALTER TABLE `problem_tags` DISABLE KEYS */;
INSERT INTO `problem_tags` VALUES (1,NULL,'Array'),(1,NULL,'Hash Table'),(2,NULL,'Array'),(2,NULL,'Dynamic Programming'),(2,NULL,'Divide and Conquer'),(3,NULL,'Binary Tree'),(3,NULL,'DFS'),(3,NULL,'Dynamic Programming'),(2,NULL,'Array'),(2,NULL,'Dynamic Programming'),(2,NULL,'Divide and Conquer'),(3,NULL,'Binary Tree'),(3,NULL,'DFS'),(3,NULL,'Dynamic Programming'),(2,NULL,'Array'),(2,NULL,'Dynamic Programming'),(2,NULL,'Divide and Conquer'),(3,NULL,'Binary Tree'),(3,NULL,'DFS'),(3,NULL,'Dynamic Programming');
/*!40000 ALTER TABLE `problem_tags` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-26 14:07:56
