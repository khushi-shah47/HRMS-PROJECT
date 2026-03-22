import db from "../config/db.js";
import { createNotification } from "./notificationController.js";

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

      // Notify the assignee
      createNotification(assigned_to, "New Task Assigned", `You have been assigned a new task: ${title}`, "task").catch(console.error);
    }
  );
};

export const getAllTasks = (req, res) => {
  const userRole = req.user.role;
  const employeeId = req.user.employee_id;

  let sql = `
  SELECT t.*, 
  e1.name AS assigned_to_name,
  e2.name AS assigned_by_name
  FROM tasks t
  JOIN employees e1 ON t.assigned_to = e1.id
  JOIN employees e2 ON t.assigned_by = e2.id
  `;

  const params = [];
  if (userRole === "manager") {
    sql += " WHERE t.assigned_by = ?";
    params.push(employeeId);
  }

  sql += " ORDER BY t.created_at DESC";

  db.query(sql, params, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};

export const getTaskById = (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT t.*, 
    e1.name AS assigned_to_name,
    e2.name AS assigned_by_name
    FROM tasks t
    JOIN employees e1 ON t.assigned_to = e1.id
    JOIN employees e2 ON t.assigned_by = e2.id
    WHERE t.id = ?
  `;

  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.length === 0) return res.status(404).json({ message: "Task not found" });
    res.json(result[0]);
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

    // Notify the assigner and assignee
    db.query("SELECT title, assigned_by, assigned_to FROM tasks WHERE id = ?", [id], (err, taskResult) => {
      if (!err && taskResult.length > 0) {
        const task = taskResult[0];
        createNotification(task.assigned_by, "Task Status Updated", `Status of task '${task.title}' updated to ${status}.`, "task").catch(console.error);
        createNotification(task.assigned_to, "Task Status Updated", `Status of task '${task.title}' updated to ${status}.`, "task").catch(console.error);
      }
    });
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

export const updateTask = (req, res) => {
  const { id } = req.params;
  const { title, description, assigned_to, assigned_by, priority, due_date } = req.body;

  const sql = `
    UPDATE tasks 
    SET title = ?, description = ?, assigned_to = ?, assigned_by = ?, priority = ?, due_date = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [title, description, assigned_to, assigned_by, priority, due_date, id],
    (err, result) => {
      if (err) return res.status(500).json(err);

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Task not found" });
      }

      res.json({ message: "Task updated successfully" });
    }
  );
};

/* Get My Tasks (Current User) */
export const getMyTasks = (req, res) => {
  const employeeId = req.user.employee_id;

  const sql = `
    SELECT t.*, 
           e1.name AS assigned_to_name,
           e2.name AS assigned_by_name
    FROM tasks t
    JOIN employees e1 ON t.assigned_to = e1.id
    JOIN employees e2 ON t.assigned_by = e2.id
    WHERE t.assigned_to = ?
    ORDER BY t.created_at DESC
  `;

  db.query(sql, [employeeId], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};