import db from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = "hrms_secret_key";

/* LOGIN */
export const login = async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const sql = "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email], async (err, results) => {
    if (err)
      return res.status(500).json({
        message: "Server error",
        error: err.message
      });

    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = results[0];

    // Compare hashed password
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, role: user.role, employee_id: user.employee_id },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.username,
        email: user.email,
        role: user.role,
        employee_id: user.employee_id   // added
      }
    });
  });
};


/* SIGNUP */
export const signup = async (req, res) => {
  const { name, email, password, role } = req.body;

  // Validate input
  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Check if email already exists
  const checkSql = "SELECT email FROM users WHERE email = ?";

  db.query(checkSql, [email], (err, results) => {

    if (err)
      return res.status(500).json({
        message: "Server error",
        error: err.message
      });

    if (results.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Map frontend role to database enum
    const roleMap = {
      Admin: "admin",
      Manager: "manager",
      HR: "hr",
      Developer: "developer",
      Intern: "intern"
    };

    const dbRole = roleMap[role] || role;

    // 1️⃣ Create employee first
    const insertEmployeeSql =
      "INSERT INTO employees (name,email) VALUES (?,?)";

    db.query(insertEmployeeSql, [name,email], (err, employeeResult) => {

      if (err) {
        console.error("Employee creation error:", err);
        return res.status(500).json({
          message: "Employee creation failed",
          error: err.message
        });
      }

      const employeeId = employeeResult.insertId;

      // 2️⃣ Create user linked with employee
      const insertSql =
        "INSERT INTO users (username, email, password, role, employee_id) VALUES (?, ?, ?, ?, ?)";

      db.query(
        insertSql,
        [name, email, hashedPassword, dbRole, employeeId],
        (err, result) => {

          if (err) {
            console.error("Signup error:", err);
            return res.status(500).json({
              message: "Signup failed",
              error: err.message
            });
          }

          res.status(201).json({
            message: "User registered successfully",
            userId: result.insertId,
            employeeId: employeeId
          });
        }
      );

    });

  });
};


/* GET CURRENT USER */
export const getCurrentUser = (req, res) => {
  const { id } = req.params;

  const sql =
    "SELECT id, username, email, role, employee_id FROM users WHERE id = ?";

  db.query(sql, [id], (err, results) => {

    if (err)
      return res.status(500).json({
        message: "Server error",
        error: err.message
      });

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user: results[0] });
  });
};


/* UPDATE USER PROFILE */
export const updateProfile = (req, res) => {
  const { id } = req.params;
  const { username, email } = req.body;

  if (!username || !email) {
    return res.status(400).json({
      message: "Username and email are required"
    });
  }

  const sql = "UPDATE users SET username = ?, email = ? WHERE id = ?";

  db.query(sql, [username, email, id], (err, result) => {

    if (err)
      return res.status(500).json({
        message: "Server error",
        error: err.message
      });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Profile updated successfully" });
  });
};


/* CHANGE PASSWORD */
export const changePassword = async (req, res) => {
  // Use the ID from the JWT token for security
  const id = req.user.id;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      message: "Current and new password are required"
    });
  }

  const getSql = "SELECT password FROM users WHERE id = ?";

  db.query(getSql, [id], async (err, results) => {

    if (err)
      return res.status(500).json({
        message: "Server error",
        error: err.message
      });

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = results[0];

    const match = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!match) {
      return res.status(400).json({
        message: "Current password is incorrect"
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updateSql = "UPDATE users SET password = ? WHERE id = ?";

    db.query(updateSql, [hashedPassword, id], (err) => {

      if (err)
        return res.status(500).json({
          message: "Server error",
          error: err.message
        });

      res.json({ message: "Password changed successfully" });
    });
  });
};