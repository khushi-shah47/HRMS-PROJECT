import db from "../config/db.js";

export const applyLeave = (req, res) => {
  const { employee_id, start_date, end_date, reason } = req.body;

  if (!employee_id || !start_date || !end_date) {
    return res.status(400).json({ message: "All required fields missing" });
  }

  const sql = `
    INSERT INTO leaves (employee_id, start_date, end_date, reason)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [employee_id, start_date, end_date, reason], (err) => {
    if (err) return res.status(500).json(err);

    res.status(201).json({ message: "Leave applied successfully" });
  });
};

export const getLeaves = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const status = req.query.status;

  const offset = (page - 1) * limit;

  let baseQuery = `
    FROM leaves l
    JOIN employees e ON l.employee_id = e.id
  `;

  let whereClauses = [];
  let params = [];

  if (status) {
    whereClauses.push("l.status = ?");
    params.push(status);
  }

  if (whereClauses.length > 0) {
    baseQuery += " WHERE " + whereClauses.join(" AND ");
  }

  const dataQuery = `
    SELECT l.id, e.name, e.department,
           l.start_date, l.end_date,
           l.reason, l.status
    ${baseQuery}
    LIMIT ? OFFSET ?
  `;

  const countQuery = `SELECT COUNT(*) as total ${baseQuery}`;

  const finalParams = [...params, limit, offset];

  db.query(dataQuery, finalParams, (err, results) => {
    if (err) return res.status(500).json(err);

    db.query(countQuery, params, (err2, countResult) => {
      if (err2) return res.status(500).json(err2);

      res.json({
        data: results,
        currentPage: page,
        totalPages: Math.ceil(countResult[0].total / limit),
        totalLeaves: countResult[0].total
      });
    });
  });
};

export const updateLeaveStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ message: "Status required" });
  }

  // First get leave details
  const getLeave = "SELECT employee_id, start_date, end_date FROM leaves WHERE id = ?";

  db.query(getLeave, [id], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.length === 0) {
      return res.status(404).json({ message: "Leave not found" });
    }

    const leave = result[0];

    // Calculate leave days
    const start = new Date(leave.start_date);
    const end = new Date(leave.end_date);

    const days = (end - start) / (1000 * 60 * 60 * 24) + 1;

    // If Approved → reduce leave balance
    if (status === "Approved") {
      const reduceLeave =
        "UPDATE employees SET leave_balance = leave_balance - ? WHERE id = ?";

      db.query(reduceLeave, [days, leave.employee_id], (err2) => {
        if (err2) return res.status(500).json(err2);
      });
    }

    // Update leave status
    const updateLeave = "UPDATE leaves SET status = ? WHERE id = ?";

    db.query(updateLeave, [status, id], (err3) => {
      if (err3) return res.status(500).json(err3);

      res.json({ message: "Leave status updated successfully" });
    });
  });
};