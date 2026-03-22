import db from "../config/db.js";

export const addUser = (req, res) => {
  const { username, email, password, role } = req.body;

  db.query(
    "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
    [username, email, password, role],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "User added", id: result.insertId });
    }
  );
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

export const updateUser = (req, res) => {

  const id = req.params.id;
  const { username, email, role } = req.body;

  db.query(
    "UPDATE users SET username = ?, email = ?, role = ? WHERE id = ?",
    [username, email, role, id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "User updated" });
    }
  );
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
