-- SQL Dump for hrms_db
-- Generated at: 2026-03-23T19:54:48.004Z

CREATE DATABASE IF NOT EXISTS `hrms_db`;
USE `hrms_db`;

-- Table structure for table `announcements`
DROP TABLE IF EXISTS `announcements`;
CREATE TABLE `announcements` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `content` text,
  `created_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `policy_id` int DEFAULT NULL,
  `audience` enum('all','hr','manager','employee') DEFAULT 'all',
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `announcements_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table `announcements`
INSERT INTO `announcements` (`id`, `title`, `content`, `created_by`, `created_at`, `policy_id`, `audience`) VALUES (2, 'jdcnjnsd', 'njewcnwicjnewicncenw', 16, '2026-03-13 18:45:11', NULL, 'all');

-- Table structure for table `attendance`
DROP TABLE IF EXISTS `attendance`;
CREATE TABLE `attendance` (
  `id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int NOT NULL,
  `date` date NOT NULL,
  `time_in` datetime DEFAULT NULL,
  `time_out` datetime DEFAULT NULL,
  `work_type` enum('present','wfh','leave') DEFAULT 'present',
  `total_hours` decimal(5,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_attendance` (`employee_id`,`date`),
  CONSTRAINT `attendance_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table `attendance`
INSERT INTO `attendance` (`id`, `employee_id`, `date`, `time_in`, `time_out`, `work_type`, `total_hours`, `created_at`) VALUES (1, 1, '2026-02-28 18:30:00', '2026-03-01 03:35:00', '2026-03-01 12:30:00', 'present', '8.90', '2026-03-06 16:47:20');
INSERT INTO `attendance` (`id`, `employee_id`, `date`, `time_in`, `time_out`, `work_type`, `total_hours`, `created_at`) VALUES (2, 1, '2026-03-01 18:30:00', '2026-03-02 03:40:00', '2026-03-02 12:35:00', 'present', '8.90', '2026-03-06 16:47:20');
INSERT INTO `attendance` (`id`, `employee_id`, `date`, `time_in`, `time_out`, `work_type`, `total_hours`, `created_at`) VALUES (3, 2, '2026-02-28 18:30:00', '2026-03-01 03:30:00', '2026-03-01 12:20:00', 'present', '8.80', '2026-03-06 16:47:20');
INSERT INTO `attendance` (`id`, `employee_id`, `date`, `time_in`, `time_out`, `work_type`, `total_hours`, `created_at`) VALUES (4, 6, '2026-03-11 18:30:00', '2026-03-12 17:49:29', '2026-03-12 17:49:26', 'present', '0.00', '2026-03-12 17:49:24');
INSERT INTO `attendance` (`id`, `employee_id`, `date`, `time_in`, `time_out`, `work_type`, `total_hours`, `created_at`) VALUES (6, 13, '2026-03-11 18:30:00', '2026-03-12 18:28:25', '2026-03-12 18:28:23', 'present', '0.00', '2026-03-12 18:28:22');
INSERT INTO `attendance` (`id`, `employee_id`, `date`, `time_in`, `time_out`, `work_type`, `total_hours`, `created_at`) VALUES (9, 17, '2026-03-12 18:30:00', '2026-03-13 16:55:51', '2026-03-13 19:43:46', 'present', '2.80', '2026-03-13 16:55:51');
INSERT INTO `attendance` (`id`, `employee_id`, `date`, `time_in`, `time_out`, `work_type`, `total_hours`, `created_at`) VALUES (10, 22, '2026-03-12 18:30:00', '2026-03-13 18:53:43', '2026-03-13 19:09:41', 'present', '0.27', '2026-03-13 18:53:43');
INSERT INTO `attendance` (`id`, `employee_id`, `date`, `time_in`, `time_out`, `work_type`, `total_hours`, `created_at`) VALUES (11, 18, '2026-03-12 18:30:00', '2026-03-13 19:43:18', '2026-03-13 19:43:19', 'wfh', '0.00', '2026-03-13 19:43:18');
INSERT INTO `attendance` (`id`, `employee_id`, `date`, `time_in`, `time_out`, `work_type`, `total_hours`, `created_at`) VALUES (12, 18, '2026-03-13 18:30:00', '2026-03-14 05:18:49', '2026-03-14 05:19:08', 'wfh', '0.01', '2026-03-14 05:18:49');
INSERT INTO `attendance` (`id`, `employee_id`, `date`, `time_in`, `time_out`, `work_type`, `total_hours`, `created_at`) VALUES (13, 17, '2026-03-13 18:30:00', '2026-03-14 06:18:54', '2026-03-14 06:19:32', 'present', '0.01', '2026-03-14 06:18:54');
INSERT INTO `attendance` (`id`, `employee_id`, `date`, `time_in`, `time_out`, `work_type`, `total_hours`, `created_at`) VALUES (14, 19, '2026-03-21 18:30:00', '2026-03-22 09:58:02', '2026-03-22 09:58:11', 'present', '0.00', '2026-03-22 09:58:02');
INSERT INTO `attendance` (`id`, `employee_id`, `date`, `time_in`, `time_out`, `work_type`, `total_hours`, `created_at`) VALUES (15, 37, '2026-03-21 18:30:00', '2026-03-22 09:59:33', '2026-03-22 09:59:35', 'present', '0.00', '2026-03-22 09:59:33');
INSERT INTO `attendance` (`id`, `employee_id`, `date`, `time_in`, `time_out`, `work_type`, `total_hours`, `created_at`) VALUES (16, 33, '2026-03-21 18:30:00', '2026-03-22 10:26:17', '2026-03-22 10:26:19', 'present', '0.00', '2026-03-22 10:26:16');

-- Table structure for table `departments`
DROP TABLE IF EXISTS `departments`;
CREATE TABLE `departments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table `departments`
INSERT INTO `departments` (`id`, `name`, `description`, `created_at`) VALUES (2, 'Sales', '', '2026-03-12 18:26:13');
INSERT INTO `departments` (`id`, `name`, `description`, `created_at`) VALUES (4, 'IT', 'Technical', '2026-03-13 19:35:22');
INSERT INTO `departments` (`id`, `name`, `description`, `created_at`) VALUES (5, 'Sequel Test', NULL, '2026-03-21 16:54:23');
INSERT INTO `departments` (`id`, `name`, `description`, `created_at`) VALUES (6, 'Sequel Test 2', NULL, '2026-03-21 16:54:23');
INSERT INTO `departments` (`id`, `name`, `description`, `created_at`) VALUES (7, 'HR', 'Human Resources Department', '2026-03-21 17:12:50');

-- Table structure for table `employees`
DROP TABLE IF EXISTS `employees`;
CREATE TABLE `employees` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `position` varchar(100) DEFAULT NULL,
  `hire_date` date DEFAULT NULL,
  `leave_balance` int DEFAULT '20',
  `basic_salary` decimal(10,2) DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `department_id` int DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `join_date` date DEFAULT NULL,
  `manager_id` int DEFAULT NULL,
  `hr_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `uq_emp_userid` (`user_id`),
  KEY `fk_department` (`department_id`),
  KEY `fk_emp_manager` (`manager_id`),
  CONSTRAINT `employees_ibfk_1` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`),
  CONSTRAINT `fk_department` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_emp_manager` FOREIGN KEY (`manager_id`) REFERENCES `employees` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_emp_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table `employees`
INSERT INTO `employees` (`id`, `name`, `email`, `position`, `hire_date`, `leave_balance`, `basic_salary`, `created_at`, `department_id`, `phone`, `join_date`, `manager_id`, `hr_id`, `user_id`) VALUES (1, 'John Doe', 'john@example.com', 'Developer', '2023-01-14 18:30:00', 20, '60000.00', '2026-03-06 16:47:20', NULL, NULL, NULL, NULL, NULL, 1);
INSERT INTO `employees` (`id`, `name`, `email`, `position`, `hire_date`, `leave_balance`, `basic_salary`, `created_at`, `department_id`, `phone`, `join_date`, `manager_id`, `hr_id`, `user_id`) VALUES (2, 'Jane Smith', 'jane@example.com', 'Manager', '2022-05-31 18:30:00', 20, '75000.00', '2026-03-06 16:47:20', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `employees` (`id`, `name`, `email`, `position`, `hire_date`, `leave_balance`, `basic_salary`, `created_at`, `department_id`, `phone`, `join_date`, `manager_id`, `hr_id`, `user_id`) VALUES (3, 'Bob Wilson', 'bob@example.com', 'Accountant', '2023-03-19 18:30:00', 20, '55000.00', '2026-03-06 16:47:20', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `employees` (`id`, `name`, `email`, `position`, `hire_date`, `leave_balance`, `basic_salary`, `created_at`, `department_id`, `phone`, `join_date`, `manager_id`, `hr_id`, `user_id`) VALUES (4, 'Alice Brown', 'alice@example.com', 'Frontend Developer', '2023-04-09 18:30:00', 20, '58000.00', '2026-03-06 16:47:20', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `employees` (`id`, `name`, `email`, `position`, `hire_date`, `leave_balance`, `basic_salary`, `created_at`, `department_id`, `phone`, `join_date`, `manager_id`, `hr_id`, `user_id`) VALUES (5, 'David Miller', 'david@example.com', 'Backend Developer', '2023-05-11 18:30:00', 18, '62000.00', '2026-03-06 16:47:20', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `employees` (`id`, `name`, `email`, `position`, `hire_date`, `leave_balance`, `basic_salary`, `created_at`, `department_id`, `phone`, `join_date`, `manager_id`, `hr_id`, `user_id`) VALUES (6, 'Shyam Vachhani', NULL, NULL, NULL, 20, '0.00', '2026-03-11 19:11:00', NULL, NULL, NULL, NULL, NULL, 4);
INSERT INTO `employees` (`id`, `name`, `email`, `position`, `hire_date`, `leave_balance`, `basic_salary`, `created_at`, `department_id`, `phone`, `join_date`, `manager_id`, `hr_id`, `user_id`) VALUES (8, 'Shyam Vachhani', NULL, NULL, NULL, 20, '0.00', '2026-03-12 17:50:16', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `employees` (`id`, `name`, `email`, `position`, `hire_date`, `leave_balance`, `basic_salary`, `created_at`, `department_id`, `phone`, `join_date`, `manager_id`, `hr_id`, `user_id`) VALUES (9, 'Shyam Vachhani', NULL, NULL, NULL, 20, '0.00', '2026-03-12 17:52:14', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `employees` (`id`, `name`, `email`, `position`, `hire_date`, `leave_balance`, `basic_salary`, `created_at`, `department_id`, `phone`, `join_date`, `manager_id`, `hr_id`, `user_id`) VALUES (11, 'Shyam Vachhani 23', NULL, NULL, NULL, 20, '0.00', '2026-03-12 17:55:56', 7, NULL, NULL, NULL, NULL, 8);
INSERT INTO `employees` (`id`, `name`, `email`, `position`, `hire_date`, `leave_balance`, `basic_salary`, `created_at`, `department_id`, `phone`, `join_date`, `manager_id`, `hr_id`, `user_id`) VALUES (12, 'Sam Billings', NULL, NULL, NULL, 20, '0.00', '2026-03-12 18:01:06', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `employees` (`id`, `name`, `email`, `position`, `hire_date`, `leave_balance`, `basic_salary`, `created_at`, `department_id`, `phone`, `join_date`, `manager_id`, `hr_id`, `user_id`) VALUES (13, 'Sam', NULL, NULL, NULL, 20, '0.00', '2026-03-12 18:03:02', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `employees` (`id`, `name`, `email`, `position`, `hire_date`, `leave_balance`, `basic_salary`, `created_at`, `department_id`, `phone`, `join_date`, `manager_id`, `hr_id`, `user_id`) VALUES (15, 'Vachhani Shyam Dineshbhai', 'shyamvachhani100@gmail.com', 'Senior', NULL, 20, '0.00', '2026-03-12 18:26:53', 2, '09825224606', '2026-03-17 18:30:00', NULL, NULL, 2);
INSERT INTO `employees` (`id`, `name`, `email`, `position`, `hire_date`, `leave_balance`, `basic_salary`, `created_at`, `department_id`, `phone`, `join_date`, `manager_id`, `hr_id`, `user_id`) VALUES (17, 'Manager', NULL, NULL, NULL, 16, '0.00', '2026-03-13 16:40:09', 2, NULL, NULL, NULL, NULL, 13);
INSERT INTO `employees` (`id`, `name`, `email`, `position`, `hire_date`, `leave_balance`, `basic_salary`, `created_at`, `department_id`, `phone`, `join_date`, `manager_id`, `hr_id`, `user_id`) VALUES (18, 'Admin', NULL, NULL, NULL, 20, '0.00', '2026-03-13 16:57:26', NULL, NULL, NULL, NULL, NULL, 14);
INSERT INTO `employees` (`id`, `name`, `email`, `position`, `hire_date`, `leave_balance`, `basic_salary`, `created_at`, `department_id`, `phone`, `join_date`, `manager_id`, `hr_id`, `user_id`) VALUES (19, 'Developer', 'developer@gmail.com', 'Intern', NULL, 16, '0.00', '2026-03-13 17:22:21', 2, '9999999999', '2026-03-19 18:30:00', NULL, NULL, 15);
INSERT INTO `employees` (`id`, `name`, `email`, `position`, `hire_date`, `leave_balance`, `basic_salary`, `created_at`, `department_id`, `phone`, `join_date`, `manager_id`, `hr_id`, `user_id`) VALUES (20, 'HR', NULL, NULL, NULL, 20, '0.00', '2026-03-13 17:28:01', 7, NULL, NULL, NULL, NULL, 16);
INSERT INTO `employees` (`id`, `name`, `email`, `position`, `hire_date`, `leave_balance`, `basic_salary`, `created_at`, `department_id`, `phone`, `join_date`, `manager_id`, `hr_id`, `user_id`) VALUES (21, 'wdm', 'shyamvachhani24@gmail.com', 'Developer', NULL, 20, '0.00', '2026-03-13 17:48:41', 2, '1111111111', '2026-03-19 18:30:00', NULL, NULL, 3);
INSERT INTO `employees` (`id`, `name`, `email`, `position`, `hire_date`, `leave_balance`, `basic_salary`, `created_at`, `department_id`, `phone`, `join_date`, `manager_id`, `hr_id`, `user_id`) VALUES (22, 'Intern', NULL, NULL, NULL, 20, '0.00', '2026-03-13 18:52:46', NULL, NULL, NULL, NULL, NULL, 17);
INSERT INTO `employees` (`id`, `name`, `email`, `position`, `hire_date`, `leave_balance`, `basic_salary`, `created_at`, `department_id`, `phone`, `join_date`, `manager_id`, `hr_id`, `user_id`) VALUES (26, 'Vachhani Shyam Dineshbhai 12', 'shyamvachhani1011@gmail.com', 'Senior Developer', NULL, 20, '100000.00', '2026-03-21 06:11:25', 4, '9825224607', '2026-03-20 18:30:00', NULL, NULL, NULL);
INSERT INTO `employees` (`id`, `name`, `email`, `position`, `hire_date`, `leave_balance`, `basic_salary`, `created_at`, `department_id`, `phone`, `join_date`, `manager_id`, `hr_id`, `user_id`) VALUES (31, 'HR Person', NULL, 'HR Executive', NULL, 20, '0.00', '2026-03-21 16:45:53', 4, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `employees` (`id`, `name`, `email`, `position`, `hire_date`, `leave_balance`, `basic_salary`, `created_at`, `department_id`, `phone`, `join_date`, `manager_id`, `hr_id`, `user_id`) VALUES (32, 'Manager Person', NULL, 'Team Lead', NULL, 20, '0.00', '2026-03-21 16:45:53', 4, NULL, NULL, NULL, 4, NULL);
INSERT INTO `employees` (`id`, `name`, `email`, `position`, `hire_date`, `leave_balance`, `basic_salary`, `created_at`, `department_id`, `phone`, `join_date`, `manager_id`, `hr_id`, `user_id`) VALUES (33, 'HRX', 'hrx@gmail.com', 'Senior Developer', NULL, 20, '1000000.00', '2026-03-21 17:01:07', 7, '9998099937', '2026-03-20 18:30:00', NULL, NULL, 28);
INSERT INTO `employees` (`id`, `name`, `email`, `position`, `hire_date`, `leave_balance`, `basic_salary`, `created_at`, `department_id`, `phone`, `join_date`, `manager_id`, `hr_id`, `user_id`) VALUES (34, 'MGHECTOR', 'mghector@gmail.com', 'Intern', NULL, 19, '1000000.00', '2026-03-21 17:02:10', 4, '9825224606', '2026-03-20 18:30:00', NULL, 33, 29);
INSERT INTO `employees` (`id`, `name`, `email`, `position`, `hire_date`, `leave_balance`, `basic_salary`, `created_at`, `department_id`, `phone`, `join_date`, `manager_id`, `hr_id`, `user_id`) VALUES (35, 'DEVON', 'devon@gmail.com', 'Senior Developer', NULL, 15, '100000.00', '2026-03-21 17:03:10', 4, '9825224606', '2026-03-20 18:30:00', 34, 33, 30);
INSERT INTO `employees` (`id`, `name`, `email`, `position`, `hire_date`, `leave_balance`, `basic_salary`, `created_at`, `department_id`, `phone`, `join_date`, `manager_id`, `hr_id`, `user_id`) VALUES (36, 'AADMI', 'aadmi1@gmail.com', 'Administrator', NULL, 20, '5000000.00', '2026-03-21 17:30:14', NULL, '5555555554', '2026-03-16 18:30:00', NULL, NULL, 31);
INSERT INTO `employees` (`id`, `name`, `email`, `position`, `hire_date`, `leave_balance`, `basic_salary`, `created_at`, `department_id`, `phone`, `join_date`, `manager_id`, `hr_id`, `user_id`) VALUES (37, 'integer', 'int@gmail.com', 'Intern', NULL, 20, '10000.00', '2026-03-22 09:59:17', 4, '9999999999', '2026-03-21 18:30:00', 34, 33, 32);
INSERT INTO `employees` (`id`, `name`, `email`, `position`, `hire_date`, `leave_balance`, `basic_salary`, `created_at`, `department_id`, `phone`, `join_date`, `manager_id`, `hr_id`, `user_id`) VALUES (38, 'devil', 'devil@gmail.com', 'Junior Developer', NULL, 19, '100000.00', '2026-03-22 10:05:23', 4, '6666666666', '2026-03-21 18:30:00', 34, 33, 33);

-- Table structure for table `holidays`
DROP TABLE IF EXISTS `holidays`;
CREATE TABLE `holidays` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `holiday_date` date NOT NULL,
  `description` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table `holidays`
INSERT INTO `holidays` (`id`, `title`, `holiday_date`, `description`, `created_at`) VALUES (2, 'dfvdfvdffv', '2026-03-17 18:30:00', 'jwncence', '2026-03-13 18:45:28');
INSERT INTO `holidays` (`id`, `title`, `holiday_date`, `description`, `created_at`) VALUES (3, 'rbbrbr', '2026-03-22 18:30:00', 'rbrbrbrgbrbrbrbgrbgrbrgbgrbr', '2026-03-22 09:56:41');

-- Table structure for table `leaves`
DROP TABLE IF EXISTS `leaves`;
CREATE TABLE `leaves` (
  `id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `reason` text,
  `status` enum('pending','managerApproved','approved','rejected') DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `manager_id` int DEFAULT NULL,
  `hr_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `employee_id` (`employee_id`),
  CONSTRAINT `leaves_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table `leaves`
INSERT INTO `leaves` (`id`, `employee_id`, `start_date`, `end_date`, `reason`, `status`, `created_at`, `manager_id`, `hr_id`) VALUES (1, 1, '2026-03-09 18:30:00', '2026-03-11 18:30:00', 'Medical', 'approved', '2026-03-06 16:47:20', NULL, NULL);
INSERT INTO `leaves` (`id`, `employee_id`, `start_date`, `end_date`, `reason`, `status`, `created_at`, `manager_id`, `hr_id`) VALUES (2, 2, '2026-03-14 18:30:00', '2026-03-15 18:30:00', 'Personal', 'rejected', '2026-03-06 16:47:20', NULL, NULL);
INSERT INTO `leaves` (`id`, `employee_id`, `start_date`, `end_date`, `reason`, `status`, `created_at`, `manager_id`, `hr_id`) VALUES (3, 5, '2026-03-18 18:30:00', '2026-03-19 18:30:00', 'eccece', 'approved', '2026-03-11 19:30:58', NULL, NULL);
INSERT INTO `leaves` (`id`, `employee_id`, `start_date`, `end_date`, `reason`, `status`, `created_at`, `manager_id`, `hr_id`) VALUES (4, 5, '2026-03-12 18:30:00', '2026-03-13 18:30:00', 'cdcdc', 'rejected', '2026-03-11 19:40:44', NULL, NULL);
INSERT INTO `leaves` (`id`, `employee_id`, `start_date`, `end_date`, `reason`, `status`, `created_at`, `manager_id`, `hr_id`) VALUES (6, 17, '2026-03-14 18:30:00', '2026-03-15 18:30:00', 'bjhbjhb', 'approved', '2026-03-13 16:56:16', NULL, NULL);
INSERT INTO `leaves` (`id`, `employee_id`, `start_date`, `end_date`, `reason`, `status`, `created_at`, `manager_id`, `hr_id`) VALUES (7, 22, '2026-03-14 18:30:00', '2026-03-15 18:30:00', 'vwwevw', 'rejected', '2026-03-13 18:58:52', NULL, NULL);
INSERT INTO `leaves` (`id`, `employee_id`, `start_date`, `end_date`, `reason`, `status`, `created_at`, `manager_id`, `hr_id`) VALUES (8, 17, '2026-03-14 18:30:00', '2026-03-15 18:30:00', '', 'approved', '2026-03-13 19:38:46', NULL, NULL);
INSERT INTO `leaves` (`id`, `employee_id`, `start_date`, `end_date`, `reason`, `status`, `created_at`, `manager_id`, `hr_id`) VALUES (9, 19, '2026-03-14 18:30:00', '2026-03-15 18:30:00', 'bfgbfbg', 'approved', '2026-03-14 05:22:25', NULL, NULL);
INSERT INTO `leaves` (`id`, `employee_id`, `start_date`, `end_date`, `reason`, `status`, `created_at`, `manager_id`, `hr_id`) VALUES (10, 17, '2026-03-15 18:30:00', '2026-03-16 18:30:00', 'vacation', 'pending', '2026-03-14 06:20:49', NULL, NULL);
INSERT INTO `leaves` (`id`, `employee_id`, `start_date`, `end_date`, `reason`, `status`, `created_at`, `manager_id`, `hr_id`) VALUES (11, 19, '2026-03-17 18:30:00', '2026-03-18 18:30:00', 'vacation', 'approved', '2026-03-14 06:22:37', NULL, NULL);
INSERT INTO `leaves` (`id`, `employee_id`, `start_date`, `end_date`, `reason`, `status`, `created_at`, `manager_id`, `hr_id`) VALUES (12, 19, '2026-03-17 18:30:00', '2026-03-18 18:30:00', 'ervvev', 'rejected', '2026-03-16 16:47:12', NULL, NULL);
INSERT INTO `leaves` (`id`, `employee_id`, `start_date`, `end_date`, `reason`, `status`, `created_at`, `manager_id`, `hr_id`) VALUES (13, 22, '2026-03-19 18:30:00', '2026-03-20 18:30:00', 'bgrbgrbrgbr', 'pending', '2026-03-16 16:49:17', NULL, NULL);
INSERT INTO `leaves` (`id`, `employee_id`, `start_date`, `end_date`, `reason`, `status`, `created_at`, `manager_id`, `hr_id`) VALUES (14, 19, '2026-03-21 18:30:00', '2026-03-26 18:30:00', 'brbtrbr', 'rejected', '2026-03-21 20:13:17', NULL, NULL);
INSERT INTO `leaves` (`id`, `employee_id`, `start_date`, `end_date`, `reason`, `status`, `created_at`, `manager_id`, `hr_id`) VALUES (15, 35, '2026-03-21 18:30:00', '2026-03-25 18:30:00', 'bdsbkvsv', 'approved', '2026-03-21 20:19:44', 34, 33);
INSERT INTO `leaves` (`id`, `employee_id`, `start_date`, `end_date`, `reason`, `status`, `created_at`, `manager_id`, `hr_id`) VALUES (16, 34, '2026-03-21 18:30:00', '2026-03-21 18:30:00', 'erg', 'approved', '2026-03-21 20:23:43', NULL, 33);
INSERT INTO `leaves` (`id`, `employee_id`, `start_date`, `end_date`, `reason`, `status`, `created_at`, `manager_id`, `hr_id`) VALUES (17, 34, '2026-03-22 18:30:00', '2026-03-23 18:30:00', 'ugygu', 'pending', '2026-03-21 20:31:34', NULL, 33);
INSERT INTO `leaves` (`id`, `employee_id`, `start_date`, `end_date`, `reason`, `status`, `created_at`, `manager_id`, `hr_id`) VALUES (18, 38, '2026-03-21 18:30:00', '2026-03-21 18:30:00', 'nkjnk', 'approved', '2026-03-22 10:06:36', 34, 33);

-- Table structure for table `notifications`
DROP TABLE IF EXISTS `notifications`;
CREATE TABLE `notifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `type` enum('leave','wfh','task','announcement','policy','salary') NOT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_notifications_user` (`user_id`),
  CONSTRAINT `fk_notifications_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table `notifications`
INSERT INTO `notifications` (`id`, `title`, `message`, `type`, `is_read`, `created_at`, `user_id`) VALUES (1, 'WFH Request Updated', 'Your WFH request has been moved to approved.', 'wfh', 0, '2026-03-21 20:12:24', 1);
INSERT INTO `notifications` (`id`, `title`, `message`, `type`, `is_read`, `created_at`, `user_id`) VALUES (2, 'Leave Request Updated', 'Your leave request has been rejected.', 'leave', 0, '2026-03-21 20:12:36', 2);
INSERT INTO `notifications` (`id`, `title`, `message`, `type`, `is_read`, `created_at`, `user_id`) VALUES (3, 'Leave Request Updated', 'Your leave request has been managerapproved.', 'leave', 0, '2026-03-21 20:14:00', 2);
INSERT INTO `notifications` (`id`, `title`, `message`, `type`, `is_read`, `created_at`, `user_id`) VALUES (4, 'Leave Request Updated', 'Your leave request has been rejected.', 'leave', 0, '2026-03-21 20:16:21', 2);
INSERT INTO `notifications` (`id`, `title`, `message`, `type`, `is_read`, `created_at`, `user_id`) VALUES (5, 'New Leave Request', 'A new leave request has been submitted by an employee.', 'leave', 0, '2026-03-21 20:19:44', 29);
INSERT INTO `notifications` (`id`, `title`, `message`, `type`, `is_read`, `created_at`, `user_id`) VALUES (6, 'New Leave Request', 'A new leave request has been submitted by an employee.', 'leave', 0, '2026-03-21 20:23:43', 28);
INSERT INTO `notifications` (`id`, `title`, `message`, `type`, `is_read`, `created_at`, `user_id`) VALUES (7, 'New Leave Request', 'A new leave request has been submitted by an employee.', 'leave', 0, '2026-03-21 20:31:34', 28);
INSERT INTO `notifications` (`id`, `title`, `message`, `type`, `is_read`, `created_at`, `user_id`) VALUES (8, 'New WFH Request', 'A new WFH request has been submitted by an employee.', 'wfh', 0, '2026-03-21 20:32:35', 28);
INSERT INTO `notifications` (`id`, `title`, `message`, `type`, `is_read`, `created_at`, `user_id`) VALUES (9, 'New WFH Request', 'A new WFH request has been submitted by an employee.', 'wfh', 0, '2026-03-21 20:34:00', 29);
INSERT INTO `notifications` (`id`, `title`, `message`, `type`, `is_read`, `created_at`, `user_id`) VALUES (10, 'New Leave Request', 'A new leave request has been submitted by an employee.', 'leave', 0, '2026-03-22 10:06:36', 29);
INSERT INTO `notifications` (`id`, `title`, `message`, `type`, `is_read`, `created_at`, `user_id`) VALUES (11, 'Leave Request Updated', 'Your leave request has been managerapproved.', 'leave', 0, '2026-03-22 10:22:25', 28);
INSERT INTO `notifications` (`id`, `title`, `message`, `type`, `is_read`, `created_at`, `user_id`) VALUES (12, 'Leave Request Updated', 'Your leave request has been approved.', 'leave', 0, '2026-03-22 10:23:05', 28);

-- Table structure for table `policies`
DROP TABLE IF EXISTS `policies`;
CREATE TABLE `policies` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `max_leaves_per_year` int DEFAULT '20',
  `max_wfh_per_month` int DEFAULT '8',
  `late_mark_time` time DEFAULT '09:30:00',
  `half_day_cutoff` time DEFAULT '13:00:00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table structure for table `salaries`
DROP TABLE IF EXISTS `salaries`;
CREATE TABLE `salaries` (
  `id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int NOT NULL,
  `month` varchar(20) DEFAULT NULL,
  `year` int DEFAULT NULL,
  `basic_salary` decimal(10,2) DEFAULT NULL,
  `allowance` decimal(10,2) DEFAULT '0.00',
  `bonus` decimal(10,2) DEFAULT '0.00',
  `working_days` int DEFAULT NULL,
  `present_days` int DEFAULT NULL,
  `leave_days` int DEFAULT NULL,
  `per_day_salary` decimal(10,2) DEFAULT NULL,
  `deduction` decimal(10,2) DEFAULT NULL,
  `final_salary` decimal(10,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('Pending','Generated','Paid') DEFAULT 'Generated',
  PRIMARY KEY (`id`),
  KEY `salaries_ibfk_1` (`employee_id`),
  CONSTRAINT `salaries_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table `salaries`
INSERT INTO `salaries` (`id`, `employee_id`, `month`, `year`, `basic_salary`, `allowance`, `bonus`, `working_days`, `present_days`, `leave_days`, `per_day_salary`, `deduction`, `final_salary`, `created_at`, `status`) VALUES (2, 15, '3', 2026, '5000.00', '0.00', '0.00', 22, 22, 0, '227.27', '0.00', '5000.00', '2026-03-13 17:32:49', 'Generated');
INSERT INTO `salaries` (`id`, `employee_id`, `month`, `year`, `basic_salary`, `allowance`, `bonus`, `working_days`, `present_days`, `leave_days`, `per_day_salary`, `deduction`, `final_salary`, `created_at`, `status`) VALUES (3, 5, '3', 2026, '62000.00', '0.00', '0.00', 22, 22, 0, '2818.18', '0.00', '62000.00', '2026-03-13 17:44:08', 'Generated');
INSERT INTO `salaries` (`id`, `employee_id`, `month`, `year`, `basic_salary`, `allowance`, `bonus`, `working_days`, `present_days`, `leave_days`, `per_day_salary`, `deduction`, `final_salary`, `created_at`, `status`) VALUES (4, 19, '3', 2026, '5550.00', '0.00', '0.00', 22, 22, 0, '252.27', '0.00', '5550.00', '2026-03-13 19:21:04', 'Generated');
INSERT INTO `salaries` (`id`, `employee_id`, `month`, `year`, `basic_salary`, `allowance`, `bonus`, `working_days`, `present_days`, `leave_days`, `per_day_salary`, `deduction`, `final_salary`, `created_at`, `status`) VALUES (5, 5, '2', 2026, '62000.00', '0.00', '0.00', 20, 20, 0, '3100.00', '0.00', '62000.00', '2026-03-14 06:29:55', 'Generated');
INSERT INTO `salaries` (`id`, `employee_id`, `month`, `year`, `basic_salary`, `allowance`, `bonus`, `working_days`, `present_days`, `leave_days`, `per_day_salary`, `deduction`, `final_salary`, `created_at`, `status`) VALUES (6, 2, '3', 2026, '75000.00', '0.00', '0.00', 22, 22, 0, '3409.09', '0.00', '75000.00', '2026-03-22 16:52:58', 'Generated');
INSERT INTO `salaries` (`id`, `employee_id`, `month`, `year`, `basic_salary`, `allowance`, `bonus`, `working_days`, `present_days`, `leave_days`, `per_day_salary`, `deduction`, `final_salary`, `created_at`, `status`) VALUES (7, 3, '3', 2026, '55000.00', '0.00', '0.00', 22, 22, 0, '2500.00', '0.00', '55000.00', '2026-03-22 16:52:58', 'Generated');
INSERT INTO `salaries` (`id`, `employee_id`, `month`, `year`, `basic_salary`, `allowance`, `bonus`, `working_days`, `present_days`, `leave_days`, `per_day_salary`, `deduction`, `final_salary`, `created_at`, `status`) VALUES (8, 4, '3', 2026, '58000.00', '0.00', '0.00', 22, 22, 0, '2636.36', '0.00', '58000.00', '2026-03-22 16:52:58', 'Generated');
INSERT INTO `salaries` (`id`, `employee_id`, `month`, `year`, `basic_salary`, `allowance`, `bonus`, `working_days`, `present_days`, `leave_days`, `per_day_salary`, `deduction`, `final_salary`, `created_at`, `status`) VALUES (9, 8, '3', 2026, '0.00', '0.00', '0.00', 22, 22, 0, '0.00', '0.00', '0.00', '2026-03-22 16:52:58', 'Generated');
INSERT INTO `salaries` (`id`, `employee_id`, `month`, `year`, `basic_salary`, `allowance`, `bonus`, `working_days`, `present_days`, `leave_days`, `per_day_salary`, `deduction`, `final_salary`, `created_at`, `status`) VALUES (10, 9, '3', 2026, '0.00', '0.00', '0.00', 22, 22, 0, '0.00', '0.00', '0.00', '2026-03-22 16:52:58', 'Generated');
INSERT INTO `salaries` (`id`, `employee_id`, `month`, `year`, `basic_salary`, `allowance`, `bonus`, `working_days`, `present_days`, `leave_days`, `per_day_salary`, `deduction`, `final_salary`, `created_at`, `status`) VALUES (11, 12, '3', 2026, '0.00', '0.00', '0.00', 22, 22, 0, '0.00', '0.00', '0.00', '2026-03-22 16:52:58', 'Generated');
INSERT INTO `salaries` (`id`, `employee_id`, `month`, `year`, `basic_salary`, `allowance`, `bonus`, `working_days`, `present_days`, `leave_days`, `per_day_salary`, `deduction`, `final_salary`, `created_at`, `status`) VALUES (12, 13, '3', 2026, '0.00', '0.00', '0.00', 22, 22, 0, '0.00', '0.00', '0.00', '2026-03-22 16:52:58', 'Generated');
INSERT INTO `salaries` (`id`, `employee_id`, `month`, `year`, `basic_salary`, `allowance`, `bonus`, `working_days`, `present_days`, `leave_days`, `per_day_salary`, `deduction`, `final_salary`, `created_at`, `status`) VALUES (13, 26, '3', 2026, '100000.00', '0.00', '0.00', 22, 22, 0, '4545.45', '0.00', '100000.00', '2026-03-22 16:52:58', 'Generated');
INSERT INTO `salaries` (`id`, `employee_id`, `month`, `year`, `basic_salary`, `allowance`, `bonus`, `working_days`, `present_days`, `leave_days`, `per_day_salary`, `deduction`, `final_salary`, `created_at`, `status`) VALUES (14, 31, '3', 2026, '0.00', '0.00', '0.00', 22, 22, 0, '0.00', '0.00', '0.00', '2026-03-22 16:52:58', 'Generated');
INSERT INTO `salaries` (`id`, `employee_id`, `month`, `year`, `basic_salary`, `allowance`, `bonus`, `working_days`, `present_days`, `leave_days`, `per_day_salary`, `deduction`, `final_salary`, `created_at`, `status`) VALUES (15, 32, '3', 2026, '0.00', '0.00', '0.00', 22, 22, 0, '0.00', '0.00', '0.00', '2026-03-22 16:52:58', 'Generated');
INSERT INTO `salaries` (`id`, `employee_id`, `month`, `year`, `basic_salary`, `allowance`, `bonus`, `working_days`, `present_days`, `leave_days`, `per_day_salary`, `deduction`, `final_salary`, `created_at`, `status`) VALUES (16, 1, '3', 2026, '60000.00', '0.00', '0.00', 22, 22, 0, '2727.27', '0.00', '60000.00', '2026-03-22 16:52:58', 'Generated');
INSERT INTO `salaries` (`id`, `employee_id`, `month`, `year`, `basic_salary`, `allowance`, `bonus`, `working_days`, `present_days`, `leave_days`, `per_day_salary`, `deduction`, `final_salary`, `created_at`, `status`) VALUES (17, 21, '3', 2026, '0.00', '0.00', '0.00', 22, 22, 0, '0.00', '0.00', '0.00', '2026-03-22 16:52:58', 'Generated');
INSERT INTO `salaries` (`id`, `employee_id`, `month`, `year`, `basic_salary`, `allowance`, `bonus`, `working_days`, `present_days`, `leave_days`, `per_day_salary`, `deduction`, `final_salary`, `created_at`, `status`) VALUES (18, 6, '3', 2026, '0.00', '0.00', '0.00', 22, 22, 0, '0.00', '0.00', '0.00', '2026-03-22 16:52:58', 'Generated');
INSERT INTO `salaries` (`id`, `employee_id`, `month`, `year`, `basic_salary`, `allowance`, `bonus`, `working_days`, `present_days`, `leave_days`, `per_day_salary`, `deduction`, `final_salary`, `created_at`, `status`) VALUES (19, 11, '3', 2026, '0.00', '0.00', '0.00', 22, 22, 0, '0.00', '0.00', '0.00', '2026-03-22 16:52:58', 'Generated');
INSERT INTO `salaries` (`id`, `employee_id`, `month`, `year`, `basic_salary`, `allowance`, `bonus`, `working_days`, `present_days`, `leave_days`, `per_day_salary`, `deduction`, `final_salary`, `created_at`, `status`) VALUES (20, 17, '3', 2026, '0.00', '0.00', '0.00', 22, 22, 0, '0.00', '0.00', '0.00', '2026-03-22 16:52:58', 'Generated');
INSERT INTO `salaries` (`id`, `employee_id`, `month`, `year`, `basic_salary`, `allowance`, `bonus`, `working_days`, `present_days`, `leave_days`, `per_day_salary`, `deduction`, `final_salary`, `created_at`, `status`) VALUES (21, 18, '3', 2026, '0.00', '0.00', '0.00', 22, 22, 0, '0.00', '0.00', '0.00', '2026-03-22 16:52:58', 'Generated');
INSERT INTO `salaries` (`id`, `employee_id`, `month`, `year`, `basic_salary`, `allowance`, `bonus`, `working_days`, `present_days`, `leave_days`, `per_day_salary`, `deduction`, `final_salary`, `created_at`, `status`) VALUES (22, 20, '3', 2026, '0.00', '0.00', '0.00', 22, 22, 0, '0.00', '0.00', '0.00', '2026-03-22 16:52:58', 'Generated');
INSERT INTO `salaries` (`id`, `employee_id`, `month`, `year`, `basic_salary`, `allowance`, `bonus`, `working_days`, `present_days`, `leave_days`, `per_day_salary`, `deduction`, `final_salary`, `created_at`, `status`) VALUES (23, 22, '3', 2026, '0.00', '0.00', '0.00', 22, 22, 0, '0.00', '0.00', '0.00', '2026-03-22 16:52:58', 'Generated');
INSERT INTO `salaries` (`id`, `employee_id`, `month`, `year`, `basic_salary`, `allowance`, `bonus`, `working_days`, `present_days`, `leave_days`, `per_day_salary`, `deduction`, `final_salary`, `created_at`, `status`) VALUES (24, 33, '3', 2026, '1000000.00', '0.00', '0.00', 22, 22, 0, '45454.55', '0.00', '1000000.00', '2026-03-22 16:52:58', 'Generated');
INSERT INTO `salaries` (`id`, `employee_id`, `month`, `year`, `basic_salary`, `allowance`, `bonus`, `working_days`, `present_days`, `leave_days`, `per_day_salary`, `deduction`, `final_salary`, `created_at`, `status`) VALUES (25, 34, '3', 2026, '1000000.00', '0.00', '0.00', 22, 22, 0, '45454.55', '0.00', '1000000.00', '2026-03-22 16:52:58', 'Generated');
INSERT INTO `salaries` (`id`, `employee_id`, `month`, `year`, `basic_salary`, `allowance`, `bonus`, `working_days`, `present_days`, `leave_days`, `per_day_salary`, `deduction`, `final_salary`, `created_at`, `status`) VALUES (26, 35, '3', 2026, '100000.00', '0.00', '0.00', 22, 22, 0, '4545.45', '0.00', '100000.00', '2026-03-22 16:52:58', 'Generated');
INSERT INTO `salaries` (`id`, `employee_id`, `month`, `year`, `basic_salary`, `allowance`, `bonus`, `working_days`, `present_days`, `leave_days`, `per_day_salary`, `deduction`, `final_salary`, `created_at`, `status`) VALUES (27, 36, '3', 2026, '5000000.00', '10000.00', '10000.00', 22, 22, 0, '227272.73', '5000.00', '5015000.00', '2026-03-22 16:52:58', 'Generated');
INSERT INTO `salaries` (`id`, `employee_id`, `month`, `year`, `basic_salary`, `allowance`, `bonus`, `working_days`, `present_days`, `leave_days`, `per_day_salary`, `deduction`, `final_salary`, `created_at`, `status`) VALUES (28, 37, '3', 2026, '10000.00', '0.00', '0.00', 22, 22, 0, '454.55', '0.00', '10000.00', '2026-03-22 16:52:58', 'Generated');
INSERT INTO `salaries` (`id`, `employee_id`, `month`, `year`, `basic_salary`, `allowance`, `bonus`, `working_days`, `present_days`, `leave_days`, `per_day_salary`, `deduction`, `final_salary`, `created_at`, `status`) VALUES (29, 38, '3', 2026, '100000.00', '0.00', '0.00', 22, 22, 0, '4545.45', '0.00', '100000.00', '2026-03-22 16:52:58', 'Generated');

-- Table structure for table `salary_records`
DROP TABLE IF EXISTS `salary_records`;
CREATE TABLE `salary_records` (
  `id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int NOT NULL,
  `month` varchar(7) NOT NULL COMMENT 'Format: YYYY-MM',
  `base_salary` decimal(10,2) DEFAULT '0.00',
  `bonus` decimal(10,2) DEFAULT '0.00',
  `deductions` decimal(10,2) DEFAULT '0.00',
  `net_salary` decimal(10,2) GENERATED ALWAYS AS (((`base_salary` + `bonus`) - `deductions`)) STORED,
  `notes` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_salary_month` (`employee_id`,`month`),
  CONSTRAINT `salary_records_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table structure for table `task_attachments`
DROP TABLE IF EXISTS `task_attachments`;
CREATE TABLE `task_attachments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `task_id` int NOT NULL,
  `file_url` varchar(500) DEFAULT NULL,
  `uploaded_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `task_id` (`task_id`),
  CONSTRAINT `task_attachments_ibfk_1` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table `task_attachments`
INSERT INTO `task_attachments` (`id`, `task_id`, `file_url`, `uploaded_at`) VALUES (1, 1, '/uploads/tasks/1773421982108-BDA_Apache-Pig (1).pdf', '2026-03-13 17:13:02');
INSERT INTO `task_attachments` (`id`, `task_id`, `file_url`, `uploaded_at`) VALUES (2, 2, '/uploads/tasks/1773422672090-CE076_BDA_LAB04.pdf', '2026-03-13 17:24:32');
INSERT INTO `task_attachments` (`id`, `task_id`, `file_url`, `uploaded_at`) VALUES (3, 6, '/uploads/tasks/1773470121791-Deep Learning â 12_1.pdf', '2026-03-14 06:35:21');

-- Table structure for table `task_comments`
DROP TABLE IF EXISTS `task_comments`;
CREATE TABLE `task_comments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `task_id` int NOT NULL,
  `employee_id` int NOT NULL,
  `comment` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `task_id` (`task_id`),
  KEY `employee_id` (`employee_id`),
  CONSTRAINT `task_comments_ibfk_1` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`) ON DELETE CASCADE,
  CONSTRAINT `task_comments_ibfk_2` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table `task_comments`
INSERT INTO `task_comments` (`id`, `task_id`, `employee_id`, `comment`, `created_at`) VALUES (1, 1, 18, 'ceececee', '2026-03-13 17:13:14');
INSERT INTO `task_comments` (`id`, `task_id`, `employee_id`, `comment`, `created_at`) VALUES (2, 2, 19, 'uierfhuhuerf', '2026-03-13 17:24:19');
INSERT INTO `task_comments` (`id`, `task_id`, `employee_id`, `comment`, `created_at`) VALUES (3, 2, 17, 'fvdvdvdf', '2026-03-13 17:26:50');
INSERT INTO `task_comments` (`id`, `task_id`, `employee_id`, `comment`, `created_at`) VALUES (4, 6, 18, 'hi', '2026-03-14 06:34:24');

-- Table structure for table `tasks`
DROP TABLE IF EXISTS `tasks`;
CREATE TABLE `tasks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text,
  `assigned_to` int DEFAULT NULL,
  `assigned_by` int DEFAULT NULL,
  `status` enum('pending','in_progress','completed') DEFAULT 'pending',
  `priority` enum('low','medium','high') DEFAULT 'medium',
  `due_date` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `assigned_by` (`assigned_by`),
  KEY `idx_tasks_employee` (`assigned_to`),
  CONSTRAINT `tasks_ibfk_1` FOREIGN KEY (`assigned_to`) REFERENCES `employees` (`id`) ON DELETE CASCADE,
  CONSTRAINT `tasks_ibfk_2` FOREIGN KEY (`assigned_by`) REFERENCES `employees` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table `tasks`
INSERT INTO `tasks` (`id`, `title`, `description`, `assigned_to`, `assigned_by`, `status`, `priority`, `due_date`, `created_at`) VALUES (1, 'vbbcbvcbbdsviudv', 'bdbfdbdbdfbdbdfbdfbdbvsudi', 18, 18, 'completed', 'medium', '2026-03-24 18:30:00', '2026-03-12 18:57:17');
INSERT INTO `tasks` (`id`, `title`, `description`, `assigned_to`, `assigned_by`, `status`, `priority`, `due_date`, `created_at`) VALUES (2, 'ger', 'gtrtrhtrh', 19, 17, 'completed', 'medium', '2026-03-14 18:30:00', '2026-03-13 17:23:30');
INSERT INTO `tasks` (`id`, `title`, `description`, `assigned_to`, `assigned_by`, `status`, `priority`, `due_date`, `created_at`) VALUES (3, 'vfdv', 'fdvdfvvdvdfv', 22, 17, 'completed', 'medium', '2026-03-14 18:30:00', '2026-03-13 19:08:52');
INSERT INTO `tasks` (`id`, `title`, `description`, `assigned_to`, `assigned_by`, `status`, `priority`, `due_date`, `created_at`) VALUES (4, 'vf', 'vdvdvdf', 20, 18, 'pending', 'medium', '2026-03-14 18:30:00', '2026-03-13 19:44:41');
INSERT INTO `tasks` (`id`, `title`, `description`, `assigned_to`, `assigned_by`, `status`, `priority`, `due_date`, `created_at`) VALUES (5, 'gb', 'bgfbgfb', 20, 18, 'pending', 'high', '2026-03-20 18:30:00', '2026-03-14 05:19:53');
INSERT INTO `tasks` (`id`, `title`, `description`, `assigned_to`, `assigned_by`, `status`, `priority`, `due_date`, `created_at`) VALUES (6, 'Database Setup', 'setup and plan database', 19, 18, 'in_progress', 'high', '2026-03-14 18:30:00', '2026-03-14 06:31:53');

-- Table structure for table `users`
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','manager','hr','developer','intern') DEFAULT 'developer',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table `users`
INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`, `created_at`) VALUES (1, 'John Doe', 'admin@gmail.com', '123456', 'admin', '2026-03-06 16:47:21');
INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`, `created_at`) VALUES (2, 'yournewuser', 'shyamvachhani100@gmail.com', 'SecurePass123!', 'manager', '2026-03-07 04:44:38');
INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`, `created_at`) VALUES (3, 'testuser2', 'shyamvachhani24@gmail.com', 'password1234', 'manager', '2026-03-07 04:45:38');
INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`, `created_at`) VALUES (4, 'Shyam Vachhani', 'testuser2@gmail.com', '$2b$10$w9XHznl2alJ/.MbzXNYvb.26AQYo/L8j1uHldM8qg6oeldMK8Vsn2', 'admin', '2026-03-11 19:11:00');
INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`, `created_at`) VALUES (8, 'Shyam Vachhani 23', 'yournewuser1@gmail.com', '$2b$10$6XpakHnpTJZDAeA4GazmE.eDO9SyYQRUZ3L3mXOzpmB2Ryd3OSt/q', 'hr', '2026-03-12 17:55:56');
INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`, `created_at`) VALUES (10, 'Sam11', 'yournewuser1331@gmail.com', '$2b$10$/wi7XaDb6Jw4ItPI.Vuo1eL0yQDimA6ZNAae50jPHUlzp5FTD2NAe', 'hr', '2026-03-12 18:03:02');
INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`, `created_at`) VALUES (13, 'Manager', 'manager@gmail.com', '$2b$10$pXyIlOees3tmmYxbMJ.vROmfd9CUzSNIlOQoYM5GoE.DRTHbJ8baO', 'manager', '2026-03-13 16:40:09');
INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`, `created_at`) VALUES (14, 'Admin', 'admin12@gmail.com', '$2b$10$TFww6C9YgREI1L.R1P29X.Y4N.azy4fW6a1UJtsByQAgEbI8k5yOO', 'admin', '2026-03-13 16:57:26');
INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`, `created_at`) VALUES (15, 'Developer', 'developer@gmail.com', '$2b$10$fTdloPCSD0BhtJBHNf29C.xmz8CvNpmpyIQv85n6xka9Y7QMZwQXi', 'developer', '2026-03-13 17:22:21');
INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`, `created_at`) VALUES (16, 'HR', 'hr@gmail.com', '$2b$10$AshREJobze2JMqWyG.hnSuGT4DznR1Wa2C.vQCwhywJI5A4jK/5F2', 'hr', '2026-03-13 17:28:01');
INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`, `created_at`) VALUES (17, 'Intern', 'intern@gmail.com', '$2b$10$2Suf.C6gyHP3Q176W.ra7e.FFKwT4bN8GhHHuJONjMl7qc6fl3V1q', 'intern', '2026-03-13 18:52:46');
INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`, `created_at`) VALUES (18, NULL, 'hr1@test.com', '$2b$10$abcdefg1234567890hash', 'hr', '2026-03-21 14:56:35');
INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`, `created_at`) VALUES (21, NULL, 'hr2@test.com', '$2b$10$abcdefg1234567890hash', 'hr', '2026-03-21 16:33:39');
INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`, `created_at`) VALUES (22, NULL, 'hr3@test.com', '$2b$10$abcdefg1234567890hash', 'hr', '2026-03-21 16:42:15');
INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`, `created_at`) VALUES (24, NULL, 'hr4@test.com', '$2b$10$abcdefg1234567890hash', 'hr', '2026-03-21 16:43:19');
INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`, `created_at`) VALUES (26, NULL, 'hr45@test.com', '$2b$10$abcdefg1234567890hash', 'hr', '2026-03-21 16:44:56');
INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`, `created_at`) VALUES (27, NULL, 'manager45@test.com', '$2b$10$abcdefg1234567890hash', 'manager', '2026-03-21 16:45:53');
INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`, `created_at`) VALUES (28, 'HRX', 'hrx@gmail.com', '$2b$10$VNDCWd0iWQXpWnpEkSRYee9a/dIwgcXi6cl69Ec2NF/6i8cNS5bLq', 'hr', '2026-03-21 17:01:07');
INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`, `created_at`) VALUES (29, 'MGHECTOR', 'mghector@gmail.com', '$2b$10$0L/cqJimJLD3/QeJDYfzn.sWKc2kqFuDE.qPnykYf.mqMh12OhPny', 'manager', '2026-03-21 17:02:10');
INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`, `created_at`) VALUES (30, 'DEVON', 'devon@gmail.com', '$2b$10$aF.WTSwDrPmB.QtSxVZniOT91YOXNZk3IbqCnXJR0i3VkcaTSNiTm', 'developer', '2026-03-21 17:03:10');
INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`, `created_at`) VALUES (31, 'AADMI', 'aadmi@gmail.com', '$2b$10$s6jWfo2oeZ.W.uouQBttuOrDt44AJVFXvrVTlzeiMygjm6d941XIK', 'admin', '2026-03-21 17:30:14');
INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`, `created_at`) VALUES (32, 'integer', 'int@gmail.com', '$2b$10$EKT/obPe0DOoZcuVq/9RUeTOVxiy2f71uEAJL3l0XaYo.hiJLxPbS', 'intern', '2026-03-22 09:59:17');
INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`, `created_at`) VALUES (33, 'devil', 'devil@gmail.com', '$2b$10$i.fjcRi04ScB42cFJ.rSWeaIW9zZCspWfGQVFQovExLRdUuDHUb7C', 'developer', '2026-03-22 10:05:23');

-- Table structure for table `wfh_requests`
DROP TABLE IF EXISTS `wfh_requests`;
CREATE TABLE `wfh_requests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int NOT NULL,
  `manager_id` int DEFAULT NULL,
  `hr_id` int DEFAULT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `reason` text,
  `status` enum('pending','managerApproved','approved','rejected') DEFAULT 'pending',
  `manager_approval` enum('pending','approved','rejected') DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `wfh_requests_ibfk_1` (`employee_id`),
  CONSTRAINT `wfh_requests_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table `wfh_requests`
INSERT INTO `wfh_requests` (`id`, `employee_id`, `manager_id`, `hr_id`, `start_date`, `end_date`, `reason`, `status`, `manager_approval`, `created_at`) VALUES (1, 1, NULL, NULL, '2026-03-09 18:30:00', '2026-03-10 18:30:00', 'Personal work', 'approved', 'pending', '2026-03-06 16:47:21');
INSERT INTO `wfh_requests` (`id`, `employee_id`, `manager_id`, `hr_id`, `start_date`, `end_date`, `reason`, `status`, `manager_approval`, `created_at`) VALUES (2, 2, NULL, NULL, '2026-03-11 18:30:00', '2026-03-12 18:30:00', 'Internet issue at home', 'approved', 'approved', '2026-03-06 16:47:21');
INSERT INTO `wfh_requests` (`id`, `employee_id`, `manager_id`, `hr_id`, `start_date`, `end_date`, `reason`, `status`, `manager_approval`, `created_at`) VALUES (3, 3, NULL, NULL, '2026-03-14 18:30:00', '2026-03-15 18:30:00', 'Family emergency', 'rejected', 'rejected', '2026-03-06 16:47:21');
INSERT INTO `wfh_requests` (`id`, `employee_id`, `manager_id`, `hr_id`, `start_date`, `end_date`, `reason`, `status`, `manager_approval`, `created_at`) VALUES (4, 4, NULL, NULL, '2026-03-17 18:30:00', '2026-03-18 18:30:00', 'Home repair', 'approved', 'approved', '2026-03-06 16:47:21');
INSERT INTO `wfh_requests` (`id`, `employee_id`, `manager_id`, `hr_id`, `start_date`, `end_date`, `reason`, `status`, `manager_approval`, `created_at`) VALUES (5, 19, NULL, NULL, '2026-03-14 18:30:00', '2026-03-15 18:30:00', 'dfvfdv', 'approved', 'approved', '2026-03-13 18:55:04');
INSERT INTO `wfh_requests` (`id`, `employee_id`, `manager_id`, `hr_id`, `start_date`, `end_date`, `reason`, `status`, `manager_approval`, `created_at`) VALUES (6, 17, NULL, NULL, '2026-03-15 18:30:00', '2026-03-16 18:30:00', 'efeferfefrefr', 'approved', 'approved', '2026-03-13 20:08:23');
INSERT INTO `wfh_requests` (`id`, `employee_id`, `manager_id`, `hr_id`, `start_date`, `end_date`, `reason`, `status`, `manager_approval`, `created_at`) VALUES (7, 34, NULL, 33, '2026-03-24 18:30:00', '2026-03-25 18:30:00', 'vhvh', 'rejected', 'pending', '2026-03-21 20:32:35');
INSERT INTO `wfh_requests` (`id`, `employee_id`, `manager_id`, `hr_id`, `start_date`, `end_date`, `reason`, `status`, `manager_approval`, `created_at`) VALUES (8, 35, 34, 33, '2026-03-21 18:30:00', '2026-03-24 18:30:00', 'vievruhih', 'approved', 'pending', '2026-03-21 20:34:00');

