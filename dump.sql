-- MySQL dump 10.13  Distrib 8.0.40, for macos14 (arm64)
--
-- Host: 127.0.0.1    Database: xdid_db
-- ------------------------------------------------------
-- Server version	9.3.0

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
-- Table structure for table `admins`
--

DROP TABLE IF EXISTS `admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admins` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `role` enum('admin','superadmin') DEFAULT 'admin',
  `lastLogin` datetime DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `kyc`
--

DROP TABLE IF EXISTS `kyc`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kyc` (
  `id` int NOT NULL AUTO_INCREMENT,
  `kycId` varchar(255) NOT NULL,
  `userId` int NOT NULL,
  `documentType` enum('passport','driving_license','adhaar_card') NOT NULL,
  `documentNumber` varchar(255) NOT NULL,
  `frontImagePath` varchar(500) NOT NULL,
  `backImagePath` varchar(500) DEFAULT NULL,
  `selfiePath` varchar(500) NOT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `submittedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `reviewedBy` int DEFAULT NULL,
  `reviewedAt` datetime DEFAULT NULL,
  `rejectionReason` text,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `kycId` (`kycId`),
  KEY `reviewedBy` (`reviewedBy`),
  KEY `idx_kycId` (`kycId`),
  KEY `idx_userId` (`userId`),
  KEY `idx_status` (`status`),
  KEY `idx_documentNumber` (`documentNumber`),
  CONSTRAINT `kyc_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `kyc_ibfk_2` FOREIGN KEY (`reviewedBy`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `kyc_admins`
--

DROP TABLE IF EXISTS `kyc_admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kyc_admins` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `fullName` varchar(255) NOT NULL,
  `employeeId` varchar(255) NOT NULL,
  `role` enum('kyc_admin','kyc_supervisor') DEFAULT 'kyc_admin',
  `isActive` tinyint(1) DEFAULT '1',
  `lastActive` datetime DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `employeeId` (`employeeId`),
  KEY `idx_email` (`email`),
  KEY `idx_employeeId` (`employeeId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `fullName` varchar(255) NOT NULL,
  `dob_date` varchar(255) NOT NULL,
  `phoneNumber` varchar(20) NOT NULL,
  `kycId` varchar(255) DEFAULT NULL,
  `kycStatus` enum('not_started','pending','verified','approved','rejected') DEFAULT 'not_started',
  `kycSubmissionDate` datetime DEFAULT NULL,
  `kycApprovalDate` datetime DEFAULT NULL,
  `role` enum('user','kycAdmin','issuer','verifier','admin') NOT NULL DEFAULT 'user',
  `did` varchar(255) DEFAULT NULL,
  `publicKey` text,
  `credentialHashes` text,
  `zkpPublicReferences` text,
  `otp` varchar(255) DEFAULT NULL,
  `otpExpires` datetime DEFAULT NULL,
  `resetPasswordToken` varchar(255) DEFAULT NULL,
  `resetPasswordExpire` datetime DEFAULT NULL,
  `isVerified` tinyint(1) DEFAULT '0',
  `lastLogin` datetime DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `did` (`did`),
  KEY `idx_email` (`email`),
  KEY `idx_did` (`did`),
  KEY `idx_kycStatus` (`kycStatus`),
  KEY `idx_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `verification_requests`
--

DROP TABLE IF EXISTS `verification_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `verification_requests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `verifierDid` varchar(255) NOT NULL,
  `userDid` varchar(255) NOT NULL,
  `credentialType` enum('AadhaarCredential','PANCredential','DrivingLicenseCredential','PassportCredential') NOT NULL,
  `verificationType` enum('KYC','AgeVerification','IdentityVerification','AddressVerification') NOT NULL,
  `country` varchar(100) DEFAULT 'India',
  `status` enum('pending','accepted','rejected','submitted','verified','failed','expired') DEFAULT 'pending',
  `requestedFields` text,
  `proofData` text,
  `verificationResult` text,
  `requestMessage` text,
  `responseMessage` text,
  `threadId` varchar(255) DEFAULT NULL,
  `respondedAt` datetime DEFAULT NULL,
  `expiresAt` datetime DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_verifierDid` (`verifierDid`),
  KEY `idx_userDid` (`userDid`),
  KEY `idx_status` (`status`),
  KEY `idx_threadId` (`threadId`),
  KEY `idx_createdAt` (`createdAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-13  6:43:07
