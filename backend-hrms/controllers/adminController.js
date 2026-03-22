// controllers/adminController.js
import { sequelize } from "../config/sequelize.js";
import { QueryTypes } from "sequelize";
import bcrypt from "bcryptjs";

/* -------------------------------------------------------
   GET ALL HR EMPLOYEES
   Returns employees whose linked user has role = 'hr'
------------------------------------------------------- */
export const getHrs = async (req, res) => {
  try {
    const hrs = await sequelize.query(
      `SELECT e.id, e.name, e.email
       FROM employees e
       INNER JOIN users u ON u.id = e.user_id
       WHERE u.role = 'hr'
       ORDER BY e.name ASC`,
      { type: QueryTypes.SELECT }
    );
    res.json(hrs);
  } catch (err) {
    console.error("getHrs error:", err);
    res.status(500).json({ message: "Failed to fetch HR list" });
  }
};

/* -------------------------------------------------------
   GET MANAGERS FILTERED BY HR
   Returns employees whose linked user has role = 'manager'
   AND whose hr_id matches the supplied hrId query param
------------------------------------------------------- */
export const getManagers = async (req, res) => {
  const { hrId } = req.query;
  if (!hrId) {
    return res.status(400).json({ message: "hrId query param is required" });
  }
  try {
    const managers = await sequelize.query(
      `SELECT e.id, e.name, e.email
       FROM employees e
       INNER JOIN users u ON u.id = e.user_id
       WHERE u.role = 'manager' AND e.hr_id = :hrId
       ORDER BY e.name ASC`,
      { replacements: { hrId }, type: QueryTypes.SELECT }
    );
    res.json(managers);
  } catch (err) {
    console.error("getManagers error:", err);
    res.status(500).json({ message: "Failed to fetch manager list" });
  }
};

/* -------------------------------------------------------
   CREATE EMPLOYEE  (Admin only)
   Atomically creates User + Employee within a transaction.
   Enforces HR → Manager → Employee hierarchy.
   employees.user_id  ←  FK pointing to users.id
------------------------------------------------------- */
export const createEmployee = async (req, res) => {
  const {
    name,
    email,
    password,
    role,
    phone,
    position,
    department_id,
    join_date,
    basic_salary,
    hr_id: rawHrId,
    manager_id: rawManagerId
  } = req.body;

  /* ── 1. Basic required fields ── */
  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "name, email, password and role are required" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  const validRoles = ["admin", "hr", "manager", "developer", "intern"];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ message: `Invalid role. Must be one of: ${validRoles.join(", ")}` });
  }

  // Role-specific Position Validation
  const rolePositions = {
    admin: ["Administrator"],
    hr: ["HR Executive", "Senior HR", "HR Manager"],
    manager: ["Team Lead", "Engineering Manager", "Product Manager"],
    developer: ["Junior Developer", "Senior Developer"],
    intern: ["Intern"]
  };

  let finalPosition = position;
  if (role === "intern") {
    finalPosition = "Intern";
  } else if (role !== "admin" && rolePositions[role] && !rolePositions[role].includes(position)) {
    return res.status(400).json({ 
      message: `Invalid position for role ${role}. Allowed: ${rolePositions[role].join(", ")}` 
    });
  }

  /* ── 2. Hierarchy validation & normalization ── */
  let hr_id = null;
  let manager_id = null;
  let final_department_id = department_id;

  if (role === "admin") {
    hr_id = null;
    manager_id = null;
    // Admin department stays as provided or NULL
  } else if (role === "hr") {
    hr_id = null;
    manager_id = null;
    // Force "HR" department
    const [hrDept] = await sequelize.query("SELECT id FROM departments WHERE name = 'HR'", { type: QueryTypes.SELECT });
    if (!hrDept) {
      return res.status(500).json({ message: "HR Department not found. Please ensure it exists in departments table." });
    }
    final_department_id = hrDept.id;

  } else if (role === "manager") {
    if (!rawHrId) {
      return res.status(400).json({ message: "A manager must be assigned to an HR" });
    }
    const hrCheck = await sequelize.query(
      `SELECT e.id FROM employees e
       INNER JOIN users u ON u.id = e.user_id
       WHERE e.id = :hrId AND u.role = 'hr'`,
      { replacements: { hrId: rawHrId }, type: QueryTypes.SELECT }
    );
    if (!hrCheck.length) {
      return res.status(400).json({ message: "Selected HR is invalid or does not have HR role" });
    }
    hr_id = rawHrId;
    manager_id = null;

  } else {
    // developer / intern
    if (!rawManagerId) {
      return res.status(400).json({ message: "An employee must be assigned to a manager" });
    }
    const managerRow = await sequelize.query(
      `SELECT e.id, e.hr_id, e.department_id FROM employees e
       INNER JOIN users u ON u.id = e.user_id
       WHERE e.id = :managerId AND u.role = 'manager'`,
      { replacements: { managerId: rawManagerId }, type: QueryTypes.SELECT }
    );
    if (!managerRow.length) {
      return res.status(400).json({ message: "Selected manager is invalid or does not have manager role" });
    }
    manager_id = rawManagerId;
    hr_id = managerRow[0].hr_id || null;
    // Auto-sync department with manager
    final_department_id = managerRow[0].department_id;
  }

  /* ── 3. Duplicate email check ── */
  const existing = await sequelize.query(
    `SELECT id FROM users WHERE email = :email LIMIT 1`,
    { replacements: { email }, type: QueryTypes.SELECT }
  );
  if (existing.length) {
    return res.status(409).json({ message: "Email is already registered" });
  }

  /* ── 4. Atomic transaction: create user first, then employee ── */
  const t = await sequelize.transaction();
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user first (no FK dependency)
    // Insert user first (no FK dependency)
    const userResult = await sequelize.query(
      `INSERT INTO users (username, email, password, role)
       VALUES (:username, :email, :password, :role)`,
      {
        replacements: { username: name || "Unknown", email, password: hashedPassword, role },
        type: QueryTypes.INSERT,
        transaction: t
      }
    );
    
    // In MySQL, QueryTypes.INSERT returns [id, affectedRows]
    const userId = userResult[0];
    console.log("Created User ID:", userId, "for name:", name);

    // Insert employee with user_id FK pointing to the new user
    const empResult = await sequelize.query(
      `INSERT INTO employees
         (name, email, phone, position, department_id, join_date, basic_salary, manager_id, hr_id, user_id)
       VALUES
         (:name, :email, :phone, :position, :department_id, :join_date, :basic_salary, :manager_id, :hr_id, :user_id)`,
      {
        replacements: {
          name,
          email,
          phone: phone || null,
          position: finalPosition || null,
          department_id: final_department_id || null,
          join_date: join_date || null,
          basic_salary: basic_salary ? parseFloat(basic_salary) : 0,
          manager_id,
          hr_id,
          user_id: userId
        },
        type: QueryTypes.INSERT,
        transaction: t
      }
    );
    const employeeId = empResult[0];

    await t.commit();

    return res.status(201).json({
      message: "Employee and user account created successfully",
      employeeId,
      userId
    });
  } catch (err) {
    await t.rollback();
    console.error("createEmployee transaction error:", err);
    return res.status(500).json({ message: err.message || "Internal server error" });
  }
};
