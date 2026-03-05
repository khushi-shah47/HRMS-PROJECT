import db from "../config/db.js";

export const addUser = (req, res) => {
  const { username, email, password, role, department_id } = req.body;

  db.query(
    "INSERT INTO users (username, email, password, role, department_id) VALUES (?, ?, ?, ?, ?)",
    [username, email, password, role, department_id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "User added", id: result.insertId });
    }
  );
};

export const getUsers = (req, res) => {
  db.query(
    "SELECT u.id, u.username, u.email, u.role, u.department_id, d.name as department_name FROM users u LEFT JOIN departments d ON u.department_id = d.id ORDER BY u.id DESC",
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    }
  );
};

export const updateUser = (req, res) => {
  const id = req.params.id;
  const { username, email, role, department_id } = req.body;

  db.query(
    "UPDATE users SET username = ?, email = ?, role = ?, department_id = ? WHERE id = ?",
    [username, email, role, department_id, id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "User updated" });
    }
  );
};

export const deleteUser = (req, res) => {
  const id = req.params.id;

  db.query("DELETE FROM users WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "User deleted" });
  });
};
