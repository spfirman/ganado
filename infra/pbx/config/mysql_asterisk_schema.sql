/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19  Distrib 10.11.16-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: asterisk
-- ------------------------------------------------------
-- Server version	10.11.16-MariaDB-ubu2204

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin` (
  `variable` varchar(20) NOT NULL DEFAULT '',
  `value` varchar(80) NOT NULL DEFAULT '',
  PRIMARY KEY (`variable`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ampusers`
--

DROP TABLE IF EXISTS `ampusers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `ampusers` (
  `username` varchar(190) NOT NULL,
  `email` varchar(40) DEFAULT '',
  `extension` varchar(40) DEFAULT '',
  `password_sha1` varchar(40) NOT NULL,
  `extension_low` varchar(20) NOT NULL DEFAULT '',
  `extension_high` varchar(20) NOT NULL DEFAULT '',
  `deptname` varchar(20) NOT NULL DEFAULT '',
  `sections` longblob NOT NULL,
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `callrecording`
--

DROP TABLE IF EXISTS `callrecording`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `callrecording` (
  `callrecording_id` int(11) NOT NULL AUTO_INCREMENT,
  `callrecording_mode` varchar(50) DEFAULT NULL,
  `description` varchar(50) DEFAULT NULL,
  `dest` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`callrecording_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `callrecording_module`
--

DROP TABLE IF EXISTS `callrecording_module`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `callrecording_module` (
  `extension` varchar(50) DEFAULT NULL,
  `cidnum` varchar(50) DEFAULT '',
  `callrecording` varchar(10) DEFAULT NULL,
  `display` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `certman_cas`
--

DROP TABLE IF EXISTS `certman_cas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `certman_cas` (
  `uid` int(11) NOT NULL AUTO_INCREMENT,
  `basename` varchar(190) NOT NULL,
  `cn` varchar(255) NOT NULL,
  `on` varchar(255) NOT NULL,
  `passphrase` varchar(255) DEFAULT NULL,
  `salt` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`uid`),
  UNIQUE KEY `basename` (`basename`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `certman_certs`
--

DROP TABLE IF EXISTS `certman_certs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `certman_certs` (
  `cid` int(11) NOT NULL AUTO_INCREMENT,
  `caid` int(11) DEFAULT NULL,
  `basename` varchar(190) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `type` varchar(2) NOT NULL DEFAULT 'ss',
  `default` tinyint(1) NOT NULL DEFAULT 0,
  `additional` longblob DEFAULT NULL,
  PRIMARY KEY (`cid`),
  UNIQUE KEY `basename_UNIQUE` (`basename`),
  UNIQUE KEY `basename` (`basename`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `certman_csrs`
--

DROP TABLE IF EXISTS `certman_csrs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `certman_csrs` (
  `cid` int(11) NOT NULL AUTO_INCREMENT,
  `basename` varchar(190) NOT NULL,
  PRIMARY KEY (`cid`),
  UNIQUE KEY `basename` (`basename`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `certman_mapping`
--

DROP TABLE IF EXISTS `certman_mapping`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `certman_mapping` (
  `id` varchar(20) NOT NULL,
  `cid` int(11) DEFAULT NULL,
  `verify` varchar(255) DEFAULT NULL,
  `setup` varchar(45) DEFAULT NULL,
  `rekey` int(11) DEFAULT NULL,
  `auto_generate_cert` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `cron_jobs`
--

DROP TABLE IF EXISTS `cron_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `cron_jobs` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `modulename` varchar(170) NOT NULL DEFAULT '',
  `jobname` varchar(170) NOT NULL DEFAULT '',
  `command` longtext DEFAULT NULL,
  `class` varchar(255) DEFAULT '',
  `schedule` varchar(255) NOT NULL DEFAULT '',
  `max_runtime` int(11) NOT NULL DEFAULT 30,
  `enabled` tinyint(1) NOT NULL DEFAULT 1,
  `execution_order` int(11) NOT NULL DEFAULT 100,
  PRIMARY KEY (`id`),
  UNIQUE KEY `modulename` (`modulename`,`jobname`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `cronmanager`
--

DROP TABLE IF EXISTS `cronmanager`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `cronmanager` (
  `module` varchar(50) NOT NULL DEFAULT '',
  `id` varchar(24) NOT NULL DEFAULT '',
  `time` varchar(5) DEFAULT NULL,
  `freq` int(11) NOT NULL DEFAULT 0,
  `lasttime` int(11) NOT NULL DEFAULT 0,
  `command` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`module`,`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `custom_extensions`
--

DROP TABLE IF EXISTS `custom_extensions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `custom_extensions` (
  `custom_exten` varchar(80) NOT NULL DEFAULT '',
  `description` varchar(40) NOT NULL DEFAULT '',
  `notes` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`custom_exten`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `dahdi`
--

DROP TABLE IF EXISTS `dahdi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `dahdi` (
  `id` varchar(20) NOT NULL DEFAULT '-1',
  `keyword` varchar(30) NOT NULL DEFAULT '',
  `data` varchar(255) NOT NULL DEFAULT '',
  `flags` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`,`keyword`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `dahdichandids`
--

DROP TABLE IF EXISTS `dahdichandids`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `dahdichandids` (
  `channel` int(11) NOT NULL DEFAULT 0,
  `description` varchar(80) NOT NULL DEFAULT '',
  `did` varchar(60) NOT NULL DEFAULT '',
  PRIMARY KEY (`channel`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `devices`
--

DROP TABLE IF EXISTS `devices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `devices` (
  `id` varchar(20) NOT NULL DEFAULT '',
  `tech` varchar(10) NOT NULL DEFAULT '',
  `dial` varchar(255) NOT NULL DEFAULT '',
  `devicetype` varchar(5) NOT NULL DEFAULT '',
  `user` varchar(50) DEFAULT NULL,
  `description` varchar(80) DEFAULT NULL,
  `emergency_cid` varchar(100) DEFAULT NULL,
  `hint_override` varchar(100) DEFAULT NULL,
  KEY `id` (`id`),
  KEY `tech` (`tech`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `emergencydevices`
--

DROP TABLE IF EXISTS `emergencydevices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `emergencydevices` (
  `id` varchar(20) NOT NULL,
  `tech` varchar(10) NOT NULL,
  `dial` varchar(255) NOT NULL,
  `devicetype` varchar(10) DEFAULT NULL,
  `user` varchar(50) DEFAULT NULL,
  `description` varchar(100) DEFAULT NULL,
  `emergency_cid` varchar(100) DEFAULT NULL,
  `hint_override` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `featurecodes`
--

DROP TABLE IF EXISTS `featurecodes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `featurecodes` (
  `modulename` varchar(50) NOT NULL DEFAULT '',
  `featurename` varchar(50) NOT NULL DEFAULT '',
  `description` varchar(200) NOT NULL DEFAULT '',
  `helptext` varchar(500) NOT NULL DEFAULT '',
  `defaultcode` varchar(20) DEFAULT NULL,
  `customcode` varchar(20) DEFAULT NULL,
  `enabled` tinyint(1) NOT NULL DEFAULT 0,
  `providedest` tinyint(1) NOT NULL DEFAULT 0,
  `depend` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`modulename`,`featurename`),
  KEY `enabled` (`enabled`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `freepbx_log`
--

DROP TABLE IF EXISTS `freepbx_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `freepbx_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `time` datetime NOT NULL,
  `section` varchar(50) DEFAULT NULL,
  `level` varchar(150) NOT NULL DEFAULT 'error',
  `status` int(11) NOT NULL DEFAULT 0,
  `message` longtext NOT NULL,
  PRIMARY KEY (`id`),
  KEY `time` (`time`,`level`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `freepbx_settings`
--

DROP TABLE IF EXISTS `freepbx_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `freepbx_settings` (
  `keyword` varchar(50) NOT NULL DEFAULT '',
  `value` varchar(255) DEFAULT NULL,
  `name` varchar(80) DEFAULT NULL,
  `level` tinyint(1) DEFAULT 0,
  `description` longtext DEFAULT NULL,
  `type` varchar(25) DEFAULT NULL,
  `options` longtext DEFAULT NULL,
  `defaultval` varchar(255) DEFAULT NULL,
  `readonly` tinyint(1) DEFAULT 0,
  `hidden` tinyint(1) DEFAULT 0,
  `category` varchar(50) DEFAULT NULL,
  `module` varchar(50) DEFAULT NULL,
  `emptyok` tinyint(1) DEFAULT 1,
  `sortorder` int(11) DEFAULT 0,
  PRIMARY KEY (`keyword`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `globals`
--

DROP TABLE IF EXISTS `globals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `globals` (
  `variable` varchar(190) NOT NULL,
  `value` varchar(255) NOT NULL,
  PRIMARY KEY (`variable`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `iax`
--

DROP TABLE IF EXISTS `iax`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `iax` (
  `id` varchar(20) NOT NULL DEFAULT '-1',
  `keyword` varchar(30) NOT NULL DEFAULT '',
  `data` varchar(255) NOT NULL,
  `flags` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`,`keyword`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `incoming`
--

DROP TABLE IF EXISTS `incoming`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `incoming` (
  `cidnum` varchar(50) DEFAULT NULL,
  `extension` varchar(50) NOT NULL,
  `destination` varchar(60) DEFAULT NULL,
  `privacyman` tinyint(1) DEFAULT NULL,
  `alertinfo` varchar(255) DEFAULT NULL,
  `ringing` varchar(20) DEFAULT NULL,
  `fanswer` varchar(20) DEFAULT NULL,
  `mohclass` varchar(80) NOT NULL DEFAULT 'default',
  `description` varchar(100) DEFAULT NULL,
  `grppre` varchar(80) DEFAULT NULL,
  `delay_answer` int(11) DEFAULT NULL,
  `pricid` varchar(20) DEFAULT NULL,
  `pmmaxretries` varchar(2) DEFAULT NULL,
  `pmminlength` varchar(2) DEFAULT NULL,
  `reversal` varchar(10) DEFAULT NULL,
  `rvolume` varchar(2) DEFAULT '',
  `indication_zone` varchar(20) DEFAULT 'default'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `indications_zonelist`
--

DROP TABLE IF EXISTS `indications_zonelist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `indications_zonelist` (
  `iso` varchar(20) NOT NULL,
  `name` varchar(80) NOT NULL,
  `conf` longblob DEFAULT NULL,
  PRIMARY KEY (`iso`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `kvblobstore`
--

DROP TABLE IF EXISTS `kvblobstore`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `kvblobstore` (
  `uuid` char(36) NOT NULL,
  `type` char(32) DEFAULT NULL,
  `content` longblob DEFAULT NULL,
  PRIMARY KEY (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `kvstore_Dashboard`
--

DROP TABLE IF EXISTS `kvstore_Dashboard`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `kvstore_Dashboard` (
  `key` char(255) NOT NULL,
  `val` varchar(4096) DEFAULT NULL,
  `type` char(16) DEFAULT NULL,
  `id` char(255) DEFAULT NULL,
  UNIQUE KEY `uniqueindex` (`key`(190),`id`(190)),
  KEY `keyindex` (`key`(190)),
  KEY `idindex` (`id`(190))
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `kvstore_FreePBX`
--

DROP TABLE IF EXISTS `kvstore_FreePBX`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `kvstore_FreePBX` (
  `key` char(255) NOT NULL,
  `val` varchar(4096) DEFAULT NULL,
  `type` char(16) DEFAULT NULL,
  `id` char(255) DEFAULT NULL,
  UNIQUE KEY `uniqueindex` (`key`(190),`id`(190)),
  KEY `keyindex` (`key`(190)),
  KEY `idindex` (`id`(190))
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `kvstore_FreePBX_Framework`
--

DROP TABLE IF EXISTS `kvstore_FreePBX_Framework`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `kvstore_FreePBX_Framework` (
  `key` char(255) NOT NULL,
  `val` varchar(4096) DEFAULT NULL,
  `type` char(16) DEFAULT NULL,
  `id` char(255) DEFAULT NULL,
  UNIQUE KEY `uniqueindex` (`key`(190),`id`(190)),
  KEY `keyindex` (`key`(190)),
  KEY `idindex` (`id`(190))
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `kvstore_FreePBX_Hooks`
--

DROP TABLE IF EXISTS `kvstore_FreePBX_Hooks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `kvstore_FreePBX_Hooks` (
  `key` char(255) NOT NULL,
  `val` varchar(4096) DEFAULT NULL,
  `type` char(16) DEFAULT NULL,
  `id` char(255) DEFAULT NULL,
  UNIQUE KEY `uniqueindex` (`key`(190),`id`(190)),
  KEY `keyindex` (`key`(190)),
  KEY `idindex` (`id`(190))
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `kvstore_FreePBX_Media`
--

DROP TABLE IF EXISTS `kvstore_FreePBX_Media`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `kvstore_FreePBX_Media` (
  `key` char(255) NOT NULL,
  `val` varchar(4096) DEFAULT NULL,
  `type` char(16) DEFAULT NULL,
  `id` char(255) DEFAULT NULL,
  UNIQUE KEY `uniqueindex` (`key`(190),`id`(190)),
  KEY `keyindex` (`key`(190)),
  KEY `idindex` (`id`(190))
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `kvstore_FreePBX_modules_Cdr`
--

DROP TABLE IF EXISTS `kvstore_FreePBX_modules_Cdr`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `kvstore_FreePBX_modules_Cdr` (
  `key` char(255) NOT NULL,
  `val` varchar(4096) DEFAULT NULL,
  `type` char(16) DEFAULT NULL,
  `id` char(255) DEFAULT NULL,
  UNIQUE KEY `uniqueindex` (`key`(190),`id`(190)),
  KEY `keyindex` (`key`(190)),
  KEY `idindex` (`id`(190))
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `kvstore_FreePBX_modules_Conferences`
--

DROP TABLE IF EXISTS `kvstore_FreePBX_modules_Conferences`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `kvstore_FreePBX_modules_Conferences` (
  `key` char(255) NOT NULL,
  `val` varchar(4096) DEFAULT NULL,
  `type` char(16) DEFAULT NULL,
  `id` char(255) DEFAULT NULL,
  UNIQUE KEY `uniqueindex` (`key`(190),`id`(190)),
  KEY `keyindex` (`key`(190)),
  KEY `idindex` (`id`(190))
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `kvstore_FreePBX_modules_Core`
--

DROP TABLE IF EXISTS `kvstore_FreePBX_modules_Core`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `kvstore_FreePBX_modules_Core` (
  `key` char(255) NOT NULL,
  `val` varchar(4096) DEFAULT NULL,
  `type` char(16) DEFAULT NULL,
  `id` char(255) DEFAULT NULL,
  UNIQUE KEY `uniqueindex` (`key`(190),`id`(190)),
  KEY `keyindex` (`key`(190)),
  KEY `idindex` (`id`(190))
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `kvstore_FreePBX_modules_Customappsreg`
--

DROP TABLE IF EXISTS `kvstore_FreePBX_modules_Customappsreg`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `kvstore_FreePBX_modules_Customappsreg` (
  `key` char(255) NOT NULL,
  `val` varchar(4096) DEFAULT NULL,
  `type` char(16) DEFAULT NULL,
  `id` char(255) DEFAULT NULL,
  UNIQUE KEY `uniqueindex` (`key`(190),`id`(190)),
  KEY `keyindex` (`key`(190)),
  KEY `idindex` (`id`(190))
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `kvstore_FreePBX_modules_Filestore`
--

DROP TABLE IF EXISTS `kvstore_FreePBX_modules_Filestore`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `kvstore_FreePBX_modules_Filestore` (
  `key` char(255) NOT NULL,
  `val` varchar(4096) DEFAULT NULL,
  `type` char(16) DEFAULT NULL,
  `id` char(255) DEFAULT NULL,
  UNIQUE KEY `uniqueindex` (`key`(190),`id`(190)),
  KEY `keyindex` (`key`(190)),
  KEY `idindex` (`id`(190))
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `kvstore_FreePBX_modules_Voicemail`
--

DROP TABLE IF EXISTS `kvstore_FreePBX_modules_Voicemail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `kvstore_FreePBX_modules_Voicemail` (
  `key` char(255) NOT NULL,
  `val` varchar(4096) DEFAULT NULL,
  `type` char(16) DEFAULT NULL,
  `id` char(255) DEFAULT NULL,
  UNIQUE KEY `uniqueindex` (`key`(190),`id`(190)),
  KEY `keyindex` (`key`(190)),
  KEY `idindex` (`id`(190))
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `kvstore_OOBE`
--

DROP TABLE IF EXISTS `kvstore_OOBE`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `kvstore_OOBE` (
  `key` char(255) NOT NULL,
  `val` varchar(4096) DEFAULT NULL,
  `type` char(16) DEFAULT NULL,
  `id` char(255) DEFAULT NULL,
  UNIQUE KEY `uniqueindex` (`key`(190),`id`(190)),
  KEY `keyindex` (`key`(190)),
  KEY `idindex` (`id`(190))
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `kvstore_Sipsettings`
--

DROP TABLE IF EXISTS `kvstore_Sipsettings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `kvstore_Sipsettings` (
  `key` char(255) NOT NULL,
  `val` varchar(4096) DEFAULT NULL,
  `type` char(16) DEFAULT NULL,
  `id` char(255) DEFAULT NULL,
  UNIQUE KEY `uniqueindex` (`key`(190),`id`(190)),
  KEY `keyindex` (`key`(190)),
  KEY `idindex` (`id`(190))
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `logfile_logfiles`
--

DROP TABLE IF EXISTS `logfile_logfiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `logfile_logfiles` (
  `name` varchar(25) NOT NULL DEFAULT '',
  `permanent` tinyint(1) NOT NULL DEFAULT 0,
  `readonly` tinyint(1) NOT NULL DEFAULT 0,
  `disabled` tinyint(1) NOT NULL DEFAULT 0,
  `debug` varchar(25) DEFAULT NULL,
  `dtmf` varchar(25) DEFAULT NULL,
  `error` varchar(25) DEFAULT NULL,
  `fax` varchar(25) DEFAULT NULL,
  `notice` varchar(25) DEFAULT NULL,
  `verbose` varchar(25) DEFAULT NULL,
  `warning` varchar(25) DEFAULT NULL,
  `security` varchar(25) DEFAULT NULL,
  PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `logfile_settings`
--

DROP TABLE IF EXISTS `logfile_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `logfile_settings` (
  `key` varchar(100) NOT NULL DEFAULT '',
  `value` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `meetme`
--

DROP TABLE IF EXISTS `meetme`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `meetme` (
  `exten` varchar(50) NOT NULL,
  `options` varchar(15) DEFAULT NULL,
  `userpin` varchar(50) DEFAULT NULL,
  `adminpin` varchar(50) DEFAULT NULL,
  `description` varchar(50) DEFAULT NULL,
  `joinmsg_id` int(11) DEFAULT NULL,
  `music` varchar(80) DEFAULT NULL,
  `users` smallint(5) unsigned DEFAULT 0,
  `language` varchar(10) NOT NULL DEFAULT '',
  `timeout` int(10) unsigned DEFAULT 21600,
  PRIMARY KEY (`exten`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `module_xml`
--

DROP TABLE IF EXISTS `module_xml`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `module_xml` (
  `id` varchar(20) NOT NULL DEFAULT 'xml',
  `time` int(11) NOT NULL DEFAULT 0,
  `data` longblob DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `modules`
--

DROP TABLE IF EXISTS `modules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `modules` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `modulename` varchar(50) NOT NULL DEFAULT '',
  `version` varchar(20) NOT NULL DEFAULT '',
  `enabled` tinyint(1) NOT NULL DEFAULT 0,
  `signature` longblob DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `music`
--

DROP TABLE IF EXISTS `music`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `music` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `category` varchar(190) DEFAULT NULL,
  `type` varchar(100) DEFAULT NULL,
  `random` tinyint(1) DEFAULT 0,
  `application` varchar(255) DEFAULT NULL,
  `format` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `category_UNIQUE` (`category`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `module` varchar(50) NOT NULL DEFAULT '',
  `id` varchar(50) NOT NULL DEFAULT '',
  `level` int(11) NOT NULL DEFAULT 0,
  `display_text` varchar(255) NOT NULL DEFAULT '',
  `extended_text` longblob NOT NULL,
  `link` varchar(255) NOT NULL DEFAULT '',
  `reset` tinyint(1) NOT NULL DEFAULT 0,
  `candelete` tinyint(1) NOT NULL DEFAULT 0,
  `timestamp` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`module`,`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `outbound_route_email`
--

DROP TABLE IF EXISTS `outbound_route_email`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `outbound_route_email` (
  `route_id` int(11) NOT NULL,
  `emailfrom` varchar(320) DEFAULT '',
  `emailto` varchar(320) DEFAULT '',
  `emailsubject` longtext DEFAULT '',
  `emailbody` longtext DEFAULT '',
  PRIMARY KEY (`route_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `outbound_route_patterns`
--

DROP TABLE IF EXISTS `outbound_route_patterns`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `outbound_route_patterns` (
  `route_id` int(11) NOT NULL,
  `match_pattern_prefix` varchar(60) NOT NULL DEFAULT '',
  `match_pattern_pass` varchar(60) NOT NULL DEFAULT '',
  `match_cid` varchar(60) NOT NULL DEFAULT '',
  `prepend_digits` varchar(100) NOT NULL DEFAULT '',
  PRIMARY KEY (`route_id`,`match_pattern_prefix`,`match_pattern_pass`,`match_cid`,`prepend_digits`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `outbound_route_sequence`
--

DROP TABLE IF EXISTS `outbound_route_sequence`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `outbound_route_sequence` (
  `route_id` int(11) NOT NULL,
  `seq` int(11) NOT NULL,
  PRIMARY KEY (`route_id`,`seq`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `outbound_route_trunks`
--

DROP TABLE IF EXISTS `outbound_route_trunks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `outbound_route_trunks` (
  `route_id` int(11) NOT NULL,
  `trunk_id` int(11) NOT NULL,
  `seq` int(11) NOT NULL,
  PRIMARY KEY (`route_id`,`trunk_id`,`seq`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `outbound_routes`
--

DROP TABLE IF EXISTS `outbound_routes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `outbound_routes` (
  `route_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(40) DEFAULT NULL,
  `outcid` varchar(255) DEFAULT NULL,
  `outcid_mode` varchar(20) DEFAULT NULL,
  `password` varchar(80) DEFAULT NULL,
  `emergency_route` varchar(4) DEFAULT NULL,
  `intracompany_route` varchar(4) DEFAULT NULL,
  `mohclass` varchar(80) DEFAULT NULL,
  `time_group_id` int(11) DEFAULT NULL,
  `dest` varchar(255) DEFAULT NULL,
  `time_mode` varchar(20) DEFAULT '',
  `calendar_id` varchar(255) DEFAULT NULL,
  `calendar_group_id` varchar(255) DEFAULT NULL,
  `timezone` varchar(255) DEFAULT NULL,
  `notification_on` varchar(255) DEFAULT 'call',
  PRIMARY KEY (`route_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `pjsip`
--

DROP TABLE IF EXISTS `pjsip`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `pjsip` (
  `id` varchar(20) NOT NULL DEFAULT '-1',
  `keyword` varchar(30) NOT NULL DEFAULT '',
  `data` varchar(8100) NOT NULL,
  `flags` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`,`keyword`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `recordings`
--

DROP TABLE IF EXISTS `recordings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `recordings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `displayname` varchar(50) DEFAULT NULL,
  `filename` longblob DEFAULT NULL,
  `description` varchar(254) DEFAULT NULL,
  `fcode` tinyint(1) DEFAULT 0,
  `fcode_pass` varchar(20) DEFAULT NULL,
  `fcode_lang` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `sip`
--

DROP TABLE IF EXISTS `sip`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `sip` (
  `id` varchar(20) NOT NULL DEFAULT '-1',
  `keyword` varchar(30) NOT NULL DEFAULT '',
  `data` varchar(8100) NOT NULL,
  `flags` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`,`keyword`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `sipsettings`
--

DROP TABLE IF EXISTS `sipsettings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `sipsettings` (
  `keyword` varchar(50) NOT NULL DEFAULT '',
  `seq` tinyint(1) NOT NULL DEFAULT 0,
  `type` tinyint(1) NOT NULL DEFAULT 0,
  `data` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`keyword`,`seq`,`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `soundlang_customlangs`
--

DROP TABLE IF EXISTS `soundlang_customlangs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `soundlang_customlangs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `language` varchar(20) NOT NULL,
  `description` varchar(80) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `soundlang_packages`
--

DROP TABLE IF EXISTS `soundlang_packages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `soundlang_packages` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `type` varchar(20) NOT NULL,
  `module` varchar(80) NOT NULL,
  `language` varchar(20) NOT NULL,
  `license` longblob DEFAULT NULL,
  `author` varchar(80) DEFAULT NULL,
  `authorlink` varchar(256) DEFAULT NULL,
  `format` varchar(20) NOT NULL,
  `version` varchar(20) DEFAULT NULL,
  `installed` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `unique` (`type`,`module`,`language`,`format`)
) ENGINE=InnoDB AUTO_INCREMENT=148 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `soundlang_prompts`
--

DROP TABLE IF EXISTS `soundlang_prompts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `soundlang_prompts` (
  `type` varchar(20) NOT NULL,
  `module` varchar(80) NOT NULL,
  `language` varchar(20) NOT NULL,
  `format` varchar(20) NOT NULL,
  `filename` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `soundlang_settings`
--

DROP TABLE IF EXISTS `soundlang_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `soundlang_settings` (
  `keyword` varchar(20) NOT NULL,
  `value` varchar(80) NOT NULL,
  PRIMARY KEY (`keyword`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `trunk_dialpatterns`
--

DROP TABLE IF EXISTS `trunk_dialpatterns`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `trunk_dialpatterns` (
  `trunkid` int(11) NOT NULL DEFAULT 0,
  `match_pattern_prefix` varchar(50) NOT NULL DEFAULT '',
  `match_pattern_pass` varchar(50) NOT NULL DEFAULT '',
  `prepend_digits` varchar(50) NOT NULL DEFAULT '',
  `seq` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`trunkid`,`match_pattern_prefix`,`match_pattern_pass`,`prepend_digits`,`seq`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `trunks`
--

DROP TABLE IF EXISTS `trunks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `trunks` (
  `trunkid` int(11) NOT NULL DEFAULT 0,
  `tech` varchar(20) NOT NULL,
  `channelid` varchar(190) NOT NULL DEFAULT '',
  `name` varchar(255) NOT NULL DEFAULT '',
  `outcid` varchar(255) NOT NULL DEFAULT '',
  `keepcid` varchar(4) DEFAULT 'off',
  `maxchans` varchar(6) DEFAULT '',
  `failscript` varchar(255) NOT NULL DEFAULT '',
  `dialoutprefix` varchar(255) NOT NULL DEFAULT '',
  `usercontext` varchar(255) DEFAULT NULL,
  `provider` varchar(40) DEFAULT NULL,
  `disabled` varchar(4) DEFAULT 'off',
  `continue` varchar(4) DEFAULT 'off',
  `routedisplay` varchar(4) DEFAULT 'on',
  PRIMARY KEY (`trunkid`,`tech`,`channelid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `extension` varchar(20) NOT NULL DEFAULT '',
  `password` varchar(20) DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL,
  `voicemail` varchar(50) DEFAULT NULL,
  `ringtimer` int(11) DEFAULT NULL,
  `noanswer` varchar(100) DEFAULT NULL,
  `recording` varchar(50) DEFAULT NULL,
  `outboundcid` varchar(50) DEFAULT NULL,
  `sipname` varchar(50) DEFAULT NULL,
  `noanswer_cid` varchar(20) NOT NULL DEFAULT '',
  `busy_cid` varchar(20) NOT NULL DEFAULT '',
  `chanunavail_cid` varchar(20) NOT NULL DEFAULT '',
  `noanswer_dest` varchar(255) NOT NULL DEFAULT '',
  `busy_dest` varchar(255) NOT NULL DEFAULT '',
  `chanunavail_dest` varchar(255) NOT NULL DEFAULT '',
  `mohclass` varchar(80) DEFAULT 'default',
  KEY `extension` (`extension`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `voicemail_admin`
--

DROP TABLE IF EXISTS `voicemail_admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `voicemail_admin` (
  `variable` varchar(30) NOT NULL DEFAULT '',
  `value` varchar(80) NOT NULL DEFAULT '',
  PRIMARY KEY (`variable`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping routines for database 'asterisk'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-01 20:25:49
