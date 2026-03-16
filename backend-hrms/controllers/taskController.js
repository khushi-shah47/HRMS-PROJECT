import db from "../config/db.js";

export const createTask = (req, res) => {
  const { title, description, assigned_to, assigned_by, priority, due_date } = req.body;

  const sql = `
    INSERT INTO tasks 
    (title, description, assigned_to, assigned_by, priority, due_date)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [title, description, assigned_to, assigned_by, priority, due_date],
    (err, result) => {
      if (err) return res.status(500).json(err);

      res.json({ message: "Task created", taskId: result.insertId });
    }
  );
};

export const getAllTasks = (req, res) => {

  const sql = `
  SELECT t.*, 
  e1.name AS assigned_to_name,
  e2.name AS assigned_by_name
  FROM tasks t
  JOIN employees e1 ON t.assigned_to = e1.id
  JOIN employees e2 ON t.assigned_by = e2.id
  ORDER BY t.created_at DESC
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);

    res.json(result);
  });
};

export const getEmployeeTasks = (req, res) => {

  const { employee_id } = req.params;

  const sql = `
  SELECT *
  FROM tasks
  WHERE assigned_to = ?
  ORDER BY created_at DESC
  `;

  db.query(sql, [employee_id], (err, result) => {
    if (err) return res.status(500).json(err);

    res.json(result);
  });
};

export const updateTaskStatus = (req, res) => {

  const { id } = req.params;
  const { status } = req.body;

  const sql = `
  UPDATE tasks
  SET status = ?
  WHERE id = ?
  `;

  db.query(sql, [status, id], (err) => {
    if (err) return res.status(500).json(err);

    res.json({ message: "Task status updated" });
  });
};

export const deleteTask = (req, res) => {

  const { id } = req.params;

  db.query(
    "DELETE FROM tasks WHERE id = ?",
    [id],
    (err) => {
      if (err) return res.status(500).json(err);

      res.json({ message: "Task deleted" });
    }
  );
};