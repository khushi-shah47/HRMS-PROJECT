import db from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = "hrms_secret_key";

/* LOGIN */
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  // Join employees to get the employee_id for the JWT
  const sql = `
    SELECT u.*, e.id AS employee_id
    FROM users u
    LEFT JOIN employees e ON e.user_id = u.id
    WHERE u.email = ?`;

  db.query(sql, [email], async (err, results) => {
    if (err)
      return res.status(500).json({ message: "Server error", error: err.message });

    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = results[0];

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
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
        employee_id: user.employee_id
      }
    });
  });
};


/* SIGNUP */
export const signup = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const checkSql = "SELECT email FROM users WHERE email = ?";
  db.query(checkSql, [email], (err, results) => {
    if (err)
      return res.status(500).json({ message: "Server error", error: err.message });

    if (results.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const roleMap = {
      Admin: "admin", Manager: "manager", HR: "hr",
      Developer: "developer", Intern: "intern"
    };
    const dbRole = roleMap[role] || role;

    // 1️⃣ Create user first
    const insertUserSql =
      "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)";

    db.query(insertUserSql, [name, email, hashedPassword, dbRole], (err, userResult) => {
      if (err) {
        console.error("User creation error:", err);
        return res.status(500).json({ message: "User creation failed", error: err.message });
      }

      const userId = userResult.insertId;

      // 2️⃣ Create employee linked to the user
      const insertEmployeeSql =
        "INSERT INTO employees (name, email, user_id) VALUES (?, ?, ?)";

      db.query(insertEmployeeSql, [name, email, userId], (err, employeeResult) => {
        if (err) {
          console.error("Employee creation error:", err);
          return res.status(500).json({ message: "Employee creation failed", error: err.message });
        }

        res.status(201).json({
          message: "User registered successfully",
          userId,
          employeeId: employeeResult.insertId
        });
      });
    });
  });
};


/* GET CURRENT USER */
export const getCurrentUser = (req, res) => {
  const { id } = req.params;

  const sql =
    "SELECT id, username, email, role FROM users WHERE id = ?";

  db.query(sql, [id], (err, results) => {
    if (err)
      return res.status(500).json({ message: "Server error", error: err.message });

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