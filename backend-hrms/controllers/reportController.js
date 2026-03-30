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
  SUM(CASE WHEN l.status IN ('approved', 'Approved') THEN 1 ELSE 0 END) AS approved,
  SUM(CASE WHEN l.status IN ('rejected', 'Rejected') THEN 1 ELSE 0 END) AS rejected,
  SUM(CASE WHEN l.status IN ('pending', 'Pending') THEN 1 ELSE 0 END) AS pending
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

export const getReportSummary = async (req, res) => {
  try {
    const [empCount] = await db.promise().query("SELECT COUNT(*) AS total FROM employees");
    const [leaveCount] = await db.promise().query("SELECT COUNT(*) AS total FROM leaves WHERE status = 'Pending'");
    const [wfhCount] = await db.promise().query("SELECT COUNT(*) AS total FROM wfh_requests WHERE status = 'Pending'");
    const [taskStats] = await db.promise().query(`
      SELECT 
        COUNT(*) AS total,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completed
      FROM tasks
    `);
    
    // Attendance Today
    const [attendanceToday] = await db.promise().query(`
      SELECT COUNT(DISTINCT employee_id) AS present 
      FROM attendance 
      WHERE DATE(date) = CURDATE()
    `);

    const totalTasks = taskStats[0].total || 0;
    const completedTasks = taskStats[0].completed || 0;
    const taskCompletionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    
    const totalEmployees = empCount[0].total || 1; 
    const attendanceRate = totalEmployees > 0 ? (attendanceToday[0].present / totalEmployees) * 100 : 0;

    res.json({
      totalEmployees: empCount[0].total,
      pendingRequests: (leaveCount[0].total || 0) + (wfhCount[0].total || 0),
      taskCompletionRate: Math.round(taskCompletionRate),
      attendanceRate: Math.round(attendanceRate)
    });
  } catch (error) {
    console.error("Report Summary Error:", error);
    res.status(500).json({ message: "Failed to fetch report summary" });
  }
};