-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Apr 11, 2021 at 07:59 AM
-- Server version: 10.4.17-MariaDB
-- PHP Version: 7.3.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `project`
--

-- --------------------------------------------------------

--
-- Table structure for table `ACCOUNT`
--

CREATE TABLE `ACCOUNT` (
  `AccountEmail` varchar(30) NOT NULL,
  `AccountPassword` varchar(60) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `COURSE`
--

CREATE TABLE `COURSE` (
  `ID` int(10) UNSIGNED NOT NULL,
  `CourseName` varchar(30) NOT NULL,
  `Description` varchar(50) DEFAULT NULL,
  `PersonID` int(10) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- --------------------------------------------------------

--
-- Table structure for table `ENROLLMENT`
--

CREATE TABLE `ENROLLMENT` (
  `PersonID` int(10) UNSIGNED NOT NULL,
  `CourseID` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `FAVORITE_COURSE`
--

CREATE TABLE `FAVORITE_COURSE` (
  `PersonID` int(10) UNSIGNED NOT NULL,
  `CourseID` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `PERSON`
--

CREATE TABLE `PERSON` (
  `ID` int(10) UNSIGNED NOT NULL,
  `FirstName` varchar(30) NOT NULL,
  `LastName` varchar(30) NOT NULL,
  `RoleID` int(10) UNSIGNED DEFAULT NULL,
  `Email` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- --------------------------------------------------------

--
-- Table structure for table `SCHOOL_ROLE`
--

CREATE TABLE `SCHOOL_ROLE` (
  `ID` int(10) UNSIGNED NOT NULL,
  `RoleName` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `SCHOOL_ROLE`
--

INSERT INTO `SCHOOL_ROLE` (`ID`, `RoleName`) VALUES
(1, 'STUDENT'),
(2, 'PROFESSOR'),
(3, 'ADMIN');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `ACCOUNT`
--
ALTER TABLE `ACCOUNT`
  ADD PRIMARY KEY (`AccountEmail`);

--
-- Indexes for table `COURSE`
--
ALTER TABLE `COURSE`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `CourseName` (`CourseName`),
  ADD KEY `PersonID` (`PersonID`);

--
-- Indexes for table `ENROLLMENT`
--
ALTER TABLE `ENROLLMENT`
  ADD PRIMARY KEY (`PersonID`,`CourseID`),
  ADD KEY `CourseID` (`CourseID`);

--
-- Indexes for table `FAVORITE_COURSE`
--
ALTER TABLE `FAVORITE_COURSE`
  ADD PRIMARY KEY (`PersonID`,`CourseID`),
  ADD KEY `CourseID` (`CourseID`);

--
-- Indexes for table `PERSON`
--
ALTER TABLE `PERSON`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `Email` (`Email`),
  ADD KEY `RoleID` (`RoleID`);

--
-- Indexes for table `SCHOOL_ROLE`
--
ALTER TABLE `SCHOOL_ROLE`
  ADD PRIMARY KEY (`ID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `COURSE`
--
ALTER TABLE `COURSE`
  MODIFY `ID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `PERSON`
--
ALTER TABLE `PERSON`
  MODIFY `ID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `SCHOOL_ROLE`
--
ALTER TABLE `SCHOOL_ROLE`
  MODIFY `ID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `COURSE`
--
ALTER TABLE `COURSE`
  ADD CONSTRAINT `course_ibfk_1` FOREIGN KEY (`PersonID`) REFERENCES `PERSON` (`ID`);

--
-- Constraints for table `ENROLLMENT`
--
ALTER TABLE `ENROLLMENT`
  ADD CONSTRAINT `enrollment_ibfk_1` FOREIGN KEY (`PersonID`) REFERENCES `PERSON` (`ID`),
  ADD CONSTRAINT `enrollment_ibfk_2` FOREIGN KEY (`CourseID`) REFERENCES `COURSE` (`ID`);

--
-- Constraints for table `FAVORITE_COURSE`
--
ALTER TABLE `FAVORITE_COURSE`
  ADD CONSTRAINT `favorite_course_ibfk_1` FOREIGN KEY (`PersonID`) REFERENCES `PERSON` (`ID`),
  ADD CONSTRAINT `favorite_course_ibfk_2` FOREIGN KEY (`CourseID`) REFERENCES `COURSE` (`ID`);

--
-- Constraints for table `PERSON`
--
ALTER TABLE `PERSON`
  ADD CONSTRAINT `person_ibfk_1` FOREIGN KEY (`Email`) REFERENCES `ACCOUNT` (`AccountEmail`),
  ADD CONSTRAINT `person_ibfk_2` FOREIGN KEY (`RoleID`) REFERENCES `SCHOOL_ROLE` (`ID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
