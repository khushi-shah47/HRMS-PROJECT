import db from "../config/db.js";
import bcrypt from "bcryptjs";
export const addUser = async (req, res) => {
  const { username, email, password, role, department_id } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    db.query(
      "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
      [username, email, hashedPassword, role],
      (err, result) => {
        if (err) return res.status(500).json({message: "Failed to create user", error: err});
        const userId = result.insertId;
        
        db.query(
          "INSERT INTO employees (name, email, department_id, user_id) VALUES (?, ?, ?, ?)",
          [username, email, department_id || null, userId],
          (err2) => {
            if (err2) console.error("Employee insert error in addUser:", err2);
            res.json({ message: "User added successfully", id: userId });
          }
        );
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
    d.id AS department_id,
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
  const { username, email, password, role, department_id } = req.body;
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

    if (role && role.trim() !== "") {
      query += ", role = ?";
      values.push(role);
    }

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

      let empQuery = "UPDATE employees SET name = ?";
      let empValues = [username];

      if (department_id !== undefined) {
        empQuery += ", department_id = ?";
        empValues.push(department_id || null);
      }
      
      empQuery += " WHERE user_id = ?";
      empValues.push(id);

      db.query(empQuery, empValues, (err2) => {
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

  // First fetch employee id to delete related records
  db.query("SELECT id FROM employees WHERE user_id = ?", [id], (err, empResults) => {
    if (err) return res.status(500).json(err);
    
    const empId = empResults[0]?.id;
    
    // We should rely on cascading if set, but if not set we should delete from employees first.
    // To be safe against foreign key errors, we delete from tables that reference employee_id
    if (empId) {
      db.query("DELETE FROM attendance WHERE employee_id = ?", [empId], () => {});
      db.query("DELETE FROM leaves WHERE employee_id = ?", [empId], () => {});
      db.query("DELETE FROM salary WHERE employee_id = ?", [empId], () => {});
      db.query("DELETE FROM wfh_requests WHERE employee_id = ?", [empId], () => {});
      db.query("DELETE FROM tasks WHERE assigned_to = ?", [empId], () => {});
      db.query("DELETE FROM employees WHERE id = ?", [empId], (errEmp) => {
         if (errEmp) console.error("Employee delete error", errEmp);
         db.query("DELETE FROM users WHERE id = ?", [id], (errUser) => {
            if (errUser) return res.status(500).json(errUser);
            res.json({ message: "User deleted" });
         });
      });
    } else {
       db.query("DELETE FROM users WHERE id = ?", [id], (errUser) => {
          if (errUser) return res.status(500).json(errUser);
          res.json({ message: "User deleted" });
       });
    }
  });
};
