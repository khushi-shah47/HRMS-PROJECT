import db from "../config/db.js";

/* LOGIN */
export const login = (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const sql = "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email], (err, results) => {
    if (err) return res.status(500).json({ message: "Server error", error: err.message });

    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = results[0];

    // Check password (plain text comparison)
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.username,
        email: user.email,
        role: user.role
      }
    });
  });
};

/* SIGNUP */
export const signup = (req, res) => {
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

  // Check if email already exists
  const checkSql = "SELECT email FROM users WHERE email = ?";
  db.query(checkSql, [email], (err, results) => {
    if (err) return res.status(500).json({ message: "Server error", error: err.message });

    if (results.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Map frontend role to database enum (lowercase)
    const roleMap = {
      "Admin": "admin",
      "Manager": "manager",
      "HR": "hr",
      "Developer": "developer"
    };

    const dbRole = roleMap[role] || role;

    // Use username instead of name (matching database schema)
    // employee_id can be NULL for new user registrations
    const insertSql = "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)";

    db.query(insertSql, [name, email, password, dbRole], (err, result) => {
      if (err) {
        console.error("Signup error:", err);
        return res.status(500).json({ message: "Signup failed", error: err.message });
      }

      res.status(201).json({ 
        message: "User registered successfully",
        userId: result.insertId
      });
    });
  });
};

/* GET CURRENT USER */
export const getCurrentUser = (req, res) => {
  const { id } = req.params;
  
  const sql = "SELECT id, username, email, role, employee_id FROM users WHERE id = ?";
  
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ message: "Server error", error: err.message });
    
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
    return res.status(400).json({ message: "Username and email are required" });
  }
  
  const sql = "UPDATE users SET username = ?, email = ? WHERE id = ?";
  
  db.query(sql, [username, email, id], (err, result) => {
    if (err) return res.status(500).json({ message: "Server error", error: err.message });
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json({ message: "Profile updated successfully" });
  });
};

/* CHANGE PASSWORD */
export const changePassword = (req, res) => {
  const { id } = req.params;
  const { currentPassword, newPassword } = req.body;
  
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "Current and new password are required" });
  }
  
  // Get current password
  const getSql = "SELECT password FROM users WHERE id = ?";
  
  db.query(getSql, [id], (err, results) => {
    if (err) return res.status(500).json({ message: "Server error", error: err.message });
    
    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    
    if (results[0].password !== currentPassword) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }
    
    const updateSql = "UPDATE users SET password = ? WHERE id = ?";
    
    db.query(updateSql, [newPassword, id], (err, result) => {
      if (err) return res.status(500).json({ message: "Server error", error: err.message });
      
      res.json({ message: "Password changed successfully" });
    });
  });
};
