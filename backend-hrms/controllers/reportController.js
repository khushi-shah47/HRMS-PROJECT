import db from "../config/db.js";

export const attendanceReport = (req, res) => {

  const sql = `
  SELECT 
  e.id,
  e.name,
  COUNT(a.id) AS attendance_days,
  SUM(a.total_hours) AS total_hours
  FROM employees e
  LEFT JOIN attendance a 
  ON e.id = a.employee_id
  GROUP BY e.id
  ORDER BY e.name
  `;

  db.query(sql, (err, result) => {

    if (err) {
      console.error(err);
      return res.status(500).json(err);
    }

    res.json(result);
  });
};

export const leaveReport = (req, res) => {

  const sql = `
  SELECT 
  e.name,
  COUNT(l.id) AS total_leaves,
  SUM(CASE WHEN l.status='Approved' THEN 1 ELSE 0 END) AS approved,
  SUM(CASE WHEN l.status='Rejected' THEN 1 ELSE 0 END) AS rejected,
  SUM(CASE WHEN l.status='Pending' THEN 1 ELSE 0 END) AS pending
  FROM employees e
  LEFT JOIN leaves l ON e.id = l.employee_id
  GROUP BY e.id
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);

    res.json(result);
  });
};

export const taskReport = (req, res) => {

  const sql = `
  SELECT 
  e.name,
  COUNT(t.id) AS total_tasks,
  SUM(CASE WHEN t.status='completed' THEN 1 ELSE 0 END) AS completed,
  SUM(CASE WHEN t.status='pending' THEN 1 ELSE 0 END) AS pending
  FROM employees e
  LEFT JOIN tasks t ON e.id = t.assigned_to
  GROUP BY e.id
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);

    res.json(result);
  });
};