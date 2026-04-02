import db from "../config/db.js";
import bcrypt from "bcryptjs";
export const addUser = async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
      [username, email, hashedPassword, role],
      (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "User added", id: result.insertId });
      }
    );
  } catch (err) {
    res.status(500).json({ message: "Error hashing password" });
  }
};

export const getUsers = (req, res) => {

const sql = `
  SELECT
    u.id,
    u.username,
    u.email,
    u.role,
    e.name AS employee_name,
    d.name AS department_name
  FROM users u
  LEFT JOIN employees e ON e.user_id = u.id
  LEFT JOIN departments d ON e.department_id = d.id
  ORDER BY u.id DESC
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json(err);
    }
    res.json(result);
  });
};

export const updateUser = async (req, res) => {
  const id = req.params.id;
  const { username, email, password } = req.body;
  if (!username || username.trim().length < 3) {
    return res.status(400).json({ message: "Invalid username" });
  }

  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email" });
  }

  if (password && password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }
  try {
    let query = "UPDATE users SET username = ?, email = ?";
    let values = [username, email];

    // only update password if provided
    if (password && typeof password === "string" && password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(password, 10);
      query += ", password = ?";
      values.push(hashedPassword);
    }

    query += " WHERE id = ?";
    values.push(id);

    // 🔥 STEP 1: Update users table
    db.query(query, values, (err) => {
      if (err) {
        console.error("DB ERROR:", err); // 🔥 IMPORTANT
        return res.status(500).json(err);
      }

      db.query(
        "UPDATE employees SET name = ? WHERE user_id = ?",
        [username, id],
        (err2) => {
          if (err2) {
            console.error("EMPLOYEE ERROR:", err2); // 🔥 IMPORTANT
          }

          res.json({ message: "User updated successfully" });
        }
      );
    });

  } catch (err) {
    res.status(500).json({ message: "Error updating user" });
  }
};

export const deleteUser = (req, res) => {

  const id = req.params.id;

  db.query(
    "DELETE FROM users WHERE id = ?",
    [id],
    (err) => {

      if (err) return res.status(500).json(err);

      res.json({
        message: "User deleted"
      });

    }
  );

};
