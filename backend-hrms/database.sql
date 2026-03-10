-- ============================================
-- CREATE DATABASE AND USE
-- ============================================
CREATE DATABASE IF NOT EXISTS hrms_db;
USE hrms_db;

-- ============================================
-- DEPARTMENTS
-- ============================================
CREATE TABLE IF NOT EXISTS departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- EMPLOYEES
-- ============================================
CREATE TABLE IF NOT EXISTS employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    department_id INT,
    position VARCHAR(100),
    hire_date DATE,
    leave_balance INT DEFAULT 20,
    basic_salary DECIMAL(10,2) DEFAULT 0,
    phone VARCHAR(20),
    join_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
);

INSERT INTO employees (name, email, position, hire_date, basic_salary) VALUES 
('John Doe', 'john@example.com', 'Developer', '2023-01-15',60000),
('Jane Smith', 'jane@example.com', 'Manager', '2022-06-01',75000),
('Bob Wilson', 'bob@example.com', 'Accountant', '2023-03-20',55000),
('Alice Brown', 'alice@example.com', 'Frontend Developer', '2023-04-10',58000),
('David Miller', 'david@example.com', 'Backend Developer', '2023-05-12',62000);

-- ============================================
-- USERS
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT,
    username VARCHAR(100) UNIQUE,
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin','manager','hr','developer','intern') DEFAULT 'developer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id)
);

INSERT INTO users (employee_id,username,email,password,role) VALUES 
(1,'admin','admin@gmail.com','$2a$10$YourHashedPasswordHere','admin');

-- ============================================
-- ATTENDANCE
-- ============================================
CREATE TABLE IF NOT EXISTS attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    date DATE NOT NULL,
    time_in DATETIME,
    time_out DATETIME,
    work_type ENUM('present','wfh','leave') DEFAULT 'present',
    total_hours DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    UNIQUE KEY unique_attendance (employee_id, date)
);

INSERT INTO attendance (employee_id,date,time_in,time_out,work_type,total_hours) VALUES
(1,'2026-03-01','2026-03-01 09:05','2026-03-01 18:00','present',8.9),
(1,'2026-03-02','2026-03-02 09:10','2026-03-02 18:05','present',8.9),
(2,'2026-03-01','2026-03-01 09:00','2026-03-01 17:50','present',8.8);

-- ============================================
-- LEAVES
-- ============================================
CREATE TABLE IF NOT EXISTS leaves (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT,
    status ENUM('Pending','Approved','Rejected') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

INSERT INTO leaves (employee_id,start_date,end_date,reason,status) VALUES
(1,'2026-03-10','2026-03-12','Medical','Approved'),
(2,'2026-03-15','2026-03-16','Personal','Pending');

-- ============================================
-- SALARIES
-- ============================================
CREATE TABLE IF NOT EXISTS salaries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    month VARCHAR(20),
    year INT,
    basic_salary DECIMAL(10,2),
    working_days INT,
    present_days INT,
    leave_days INT,
    per_day_salary DECIMAL(10,2),
    deduction DECIMAL(10,2),
    final_salary DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id)
);

-- ============================================
-- WFH REQUESTS
-- ============================================
CREATE TABLE IF NOT EXISTS wfh_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT,
    status ENUM('pending','approved','rejected') DEFAULT 'pending',
    manager_approval ENUM('pending','approved','rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id)
);

INSERT INTO wfh_requests (employee_id,start_date,end_date,reason,status,manager_approval) VALUES
(1,'2026-03-10','2026-03-11','Personal work','pending','pending'),
(2,'2026-03-12','2026-03-13','Internet issue at home','approved','approved'),
(3,'2026-03-15','2026-03-16','Family emergency','rejected','rejected'),
(4,'2026-03-18','2026-03-19','Home repair','pending','pending');

-- ============================================
-- HOLIDAYS
-- ============================================
CREATE TABLE IF NOT EXISTS holidays (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    holiday_date DATE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- POLICIES
-- ============================================
CREATE TABLE IF NOT EXISTS policies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TASKS & RELATED TABLES
-- ============================================
CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    assigned_to INT,
    assigned_by INT,
    status ENUM('pending','in_progress','completed') DEFAULT 'pending',
    priority ENUM('low','medium','high') DEFAULT 'medium',
    due_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assigned_to) REFERENCES employees(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_by) REFERENCES employees(id) ON DELETE SET NULL
);

CREATE INDEX idx_tasks_employee ON tasks(assigned_to);

CREATE TABLE IF NOT EXISTS task_comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    task_id INT NOT NULL,
    employee_id INT NOT NULL,
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS task_attachments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    task_id INT NOT NULL,
    file_url VARCHAR(500),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
);

