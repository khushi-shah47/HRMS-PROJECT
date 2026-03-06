DROP DATABASE hrms_db;

CREATE DATABASE hrms_db;
USE hrms_db;

CREATE TABLE employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    department VARCHAR(100),
    position VARCHAR(100),
    hire_date DATE,
    leave_balance INT DEFAULT 20,
    basic_salary DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO employees (name, email, department, position, hire_date, basic_salary) VALUES 
('John Doe', 'john@example.com', 'IT', 'Developer', '2023-01-15',60000),
('Jane Smith', 'jane@example.com', 'HR', 'Manager', '2022-06-01',75000),
('Bob Wilson', 'bob@example.com', 'Finance', 'Accountant', '2023-03-20',55000),
('Alice Brown', 'alice@example.com', 'IT', 'Frontend Developer', '2023-04-10',58000),
('David Miller', 'david@example.com', 'IT', 'Backend Developer', '2023-05-12',62000);

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT,
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255),
  role ENUM('admin','manager','hr','developer','intern') DEFAULT 'developer',
  FOREIGN KEY (employee_id) REFERENCES employees(id)
);

INSERT INTO users (employee_id,email,password,role)
VALUES (1,'admin@gmail.com','123456','admin');

CREATE TABLE attendance (
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

CREATE TABLE leaves (
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

CREATE TABLE salaries (
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
-- NEW TABLES (Create these first - no dependencies)
-- ============================================

-- Departments table
CREATE TABLE IF NOT EXISTS departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Holidays table
CREATE TABLE IF NOT EXISTS holidays (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    holiday_date DATE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Policies table
CREATE TABLE IF NOT EXISTS policies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE employees
DROP COLUMN department;

ALTER TABLE employees
ADD department_id INT;

ALTER TABLE employees
ADD FOREIGN KEY (department_id) REFERENCES departments(id);

ALTER TABLE users
ADD COLUMN username VARCHAR(100) UNIQUE AFTER employee_id;

ALTER TABLE users
MODIFY password VARCHAR(255) NOT NULL;

ALTER TABLE users
ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

CREATE TABLE tasks (
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
  FOREIGN KEY (assigned_by) REFERENCES employees(id) ON DELETE CASCADE
);

CREATE INDEX idx_tasks_employee
ON tasks(assigned_to);

CREATE TABLE task_comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  task_id INT NOT NULL,
  employee_id INT NOT NULL,
  comment TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

CREATE TABLE task_attachments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  task_id INT NOT NULL,
  file_url VARCHAR(500),
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
);

ALTER TABLE employees
ADD phone VARCHAR(20),
ADD join_date DATE;

ALTER TABLE employees
ADD CONSTRAINT fk_department
FOREIGN KEY (department_id) REFERENCES departments(id)
ON DELETE SET NULL;