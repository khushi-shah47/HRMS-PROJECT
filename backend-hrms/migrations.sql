-- ============================================================
-- HRMS MIGRATIONS — Run these in your MySQL client (hrms_db)
-- ============================================================

-- PHASE 3: Team Hierarchy columns
ALTER TABLE employees
  ADD COLUMN IF NOT EXISTS manager_id INT NULL,
  ADD COLUMN IF NOT EXISTS hr_id INT NULL;

ALTER TABLE employees
  ADD CONSTRAINT fk_emp_manager FOREIGN KEY (manager_id) REFERENCES employees(id) ON DELETE SET NULL;

-- PHASE 5: Approval chain status for leaves
ALTER TABLE leaves
  ADD COLUMN IF NOT EXISTS manager_id INT NULL,
  ADD COLUMN IF NOT EXISTS hr_id INT NULL;

-- Extend leaves status to include managerApproved
ALTER TABLE leaves MODIFY COLUMN status ENUM('Pending','managerApproved','Approved','Rejected') DEFAULT 'Pending';

-- Extend wfh_requests status to include managerApproved
ALTER TABLE wfh_requests MODIFY COLUMN status ENUM('pending','managerApproved','approved','rejected') DEFAULT 'pending';

-- PHASE 7: Policy engine columns
ALTER TABLE policies
  ADD COLUMN IF NOT EXISTS max_leaves_per_year INT DEFAULT 20,
  ADD COLUMN IF NOT EXISTS max_wfh_per_month INT DEFAULT 8,
  ADD COLUMN IF NOT EXISTS late_mark_time TIME DEFAULT '09:30:00',
  ADD COLUMN IF NOT EXISTS half_day_cutoff TIME DEFAULT '13:00:00';

-- PHASE 8: Announcement audience + policy link
ALTER TABLE announcements
  ADD COLUMN IF NOT EXISTS policy_id INT NULL,
  ADD COLUMN IF NOT EXISTS audience ENUM('all','hr','manager','employee') DEFAULT 'all';

-- PHASE 10: Salary records table (structured monthly)
CREATE TABLE IF NOT EXISTS salary_records (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT NOT NULL,
  month VARCHAR(7) NOT NULL COMMENT 'Format: YYYY-MM',
  base_salary DECIMAL(10,2) DEFAULT 0,
  bonus DECIMAL(10,2) DEFAULT 0,
  deductions DECIMAL(10,2) DEFAULT 0,
  net_salary DECIMAL(10,2) GENERATED ALWAYS AS (base_salary + bonus - deductions) STORED,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
  UNIQUE KEY unique_salary_month (employee_id, month)
);

-- ============================================================
-- PHASE 11: Schema flip — move FK from users.employee_id
--           to employees.user_id  (proper employee architecture)
-- Run these statements IN ORDER in your MySQL client (hrms_db)
-- ============================================================

-- Step 1: Add user_id column to employees
ALTER TABLE employees
  ADD COLUMN IF NOT EXISTS user_id INT NULL UNIQUE;

-- Step 2: Backfill user_id from existing users.employee_id mapping
UPDATE employees e
  INNER JOIN users u ON u.employee_id = e.id
  SET e.user_id = u.id;

-- Step 3: Add FK constraint on employees.user_id → users.id
ALTER TABLE employees
  ADD CONSTRAINT fk_emp_user
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;

-- Step 4: Drop the employee_id column from users
--         (run AFTER confirming employees.user_id is fully populated)
ALTER TABLE users DROP FOREIGN KEY fk_emp_user;   -- drop if named differently
ALTER TABLE users DROP COLUMN employee_id;

