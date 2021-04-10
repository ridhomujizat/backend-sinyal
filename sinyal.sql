-- phpMyAdmin SQL Dump
-- version 5.0.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Apr 10, 2021 at 06:10 PM
-- Server version: 10.4.14-MariaDB
-- PHP Version: 7.4.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sinyal`
--

-- --------------------------------------------------------

--
-- Table structure for table `message`
--

CREATE TABLE `message` (
  `id` int(11) NOT NULL,
  `idSender` int(11) NOT NULL,
  `idReceiver` int(11) NOT NULL,
  `chat` text NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `isLast` int(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `firstName` varchar(80) DEFAULT NULL,
  `lastName` varchar(80) DEFAULT NULL,
  `picture` varchar(80) DEFAULT NULL,
  `email` varchar(80) NOT NULL,
  `pin` varchar(60) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `firstName`, `lastName`, `picture`, `email`, `pin`, `createdAt`, `updatedAt`) VALUES
(2, 'Ridho', '', 'upload/profile/profile-picture-1617169002102.jpg', 'ridhomujizat@gmail.com', '$2b$10$NgbrlmOO/g8soq/MOS4f.e6U0pRBrypcD3yyDL6/bhfDMfD.dbfQW', '2021-03-14 22:44:26', '2021-04-10 14:44:55'),
(3, 'Fanny ', 'Citra', 'upload/profile/profile-picture-1617169315001.jpg', 'pain5811588248@gmail.com', '$2b$10$C6A12uhb685zluoZrkeXp.vd.657C0WRW2EGMrAktneJS220AMINC', '2021-03-14 22:44:26', '2021-04-10 14:38:36'),
(4, 'Indah ', '', 'upload/profile/profile-picture-1615767456328.jpg', 'lulululu@gmail.com', '$2b$10$qySWddm6yuwwUK0Bfz739OSNFFvLf3xc/PX24BQ550kgVW5mBJfp6', '2021-03-14 22:44:26', '2021-04-10 15:03:05'),
(10, 'Rahma', 'Nurul', NULL, 'rahmanurul@gmail.com', '$2b$10$5NwLMIkRlQMNuJenXMzFAO90tPZU.p0GhFTdmDoTK6YvocY3ubFle', '2021-03-14 22:44:26', '2021-03-21 09:55:42'),
(12, 'Ridho', '', NULL, 'ridho.16181@student.unsika.ac.id', '$2b$10$pKwbAQ2pI7IhgbZ9w/8NVej7eZhwCaHJvRFqJVXBnT1KUpC3W44DO', '2021-03-19 23:45:52', '2021-03-19 23:49:11');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `message`
--
ALTER TABLE `message`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idSender` (`idSender`),
  ADD KEY `idReceiver` (`idReceiver`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `message`
--
ALTER TABLE `message`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=367;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `message`
--
ALTER TABLE `message`
  ADD CONSTRAINT `message_ibfk_1` FOREIGN KEY (`idSender`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `message_ibfk_2` FOREIGN KEY (`idReceiver`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
