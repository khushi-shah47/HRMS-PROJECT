import db from "../config/db.js";

/* Check-in */
export const checkIn = async (req, res) => {
  const { employee_id, work_type } = req.body;

  if (!employee_id) {
    return res.status(400).json({ message: "employee_id is required" });
  }

  if (!work_type) {
    return res.status(400).json({ message: "Work type is required" });
  }

  const today = new Date().toISOString().slice(0, 10);
  const now = new Date();

  try {
    // 1. Check for Holiday
    const [holiday] = await db.promise().query("SELECT title FROM holidays WHERE holiday_date = ?", [today]);
    if (holiday.length > 0) {
      return res.status(400).json({ message: `Today is a holiday: ${holiday[0].title}. Attendance not allowed.` });
    }

    // 2. Check for Approved Leave
    const [leave] = await db.promise().query(
      `SELECT id FROM leaves 
       WHERE employee_id = ? 
       AND status IN ('Approved', 'approved')
       AND ? BETWEEN start_date AND end_date`,
      [employee_id, today]
    );
    if (leave.length > 0) {
      return res.status(400).json({ message: "You are on an approved leave today. Attendance not allowed." });
    }

    // 3. Check if a record already exists for today
    const [attendance] = await db.promise().query("SELECT * FROM attendance WHERE employee_id=? AND date=?", [employee_id, today]);

    if (attendance.length > 0) {
      return res.status(400).json({ 
        message: "You have already recorded attendance for today.",
        attendance: attendance[0]
      });
    }

    // 4. Create new record
    await db.promise().query(
      `INSERT INTO attendance (employee_id, date, work_type, time_in) VALUES (?, ?, ?, ?)`,
      [employee_id, today, work_type, now]
    );

    res.json({
      message: "Checked in successfully",
      time_in: now,
      work_type: work_type
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
};

/* Check-out */
export const checkOut = async (req, res) => {
  const employeeId = req.body.employee_id;

  if (!employeeId) {
    return res.status(400).json({ message: "employee_id required" });
  }

  const today = new Date().toISOString().slice(0, 10);

  try {
    const [result] = await db.promise().query("SELECT * FROM attendance WHERE employee_id=? AND date=?", [employeeId, today]);

    if (!result.length || !result[0].time_in) {
      return res.status(400).json({ message: "No active check-in found for today." });
    }

    if (result[0].time_out) {
      return res.status(400).json({ message: "You have already checked out for today." });
    }

    const now = new Date();
    const timeIn = new Date(result[0].time_in);
    const hours = (now - timeIn) / 1000 / 3600;

    await db.promise().query(
      "UPDATE attendance SET time_out=?, total_hours=? WHERE employee_id=? AND date=?",
      [now, hours, employeeId, today]
    );

    res.json({
      message: "Checked out successfully",
      time_out: now,
      total_hours: hours.toFixed(2),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
};

/* Today's Attendance */
export const getTodayAttendance = async (req, res) => {
  const employeeId = req.params.employee_id;
  const today = new Date().toISOString().slice(0, 10);

  try {
    const [attendance] = await db.promise().query("SELECT * FROM attendance WHERE employee_id=? AND date=?", [employeeId, today]);
    const [holiday] = await db.promise().query("SELECT * FROM holidays WHERE holiday_date=?", [today]);
    const [leave] = await db.promise().query(
      "SELECT * FROM leaves WHERE employee_id=? AND status IN ('Approved', 'approved') AND ? BETWEEN start_date AND end_date",
      [employeeId, today]
    );
    const [wfh] = await db.promise().query(
      "SELECT * FROM wfh_requests WHERE employee_id=? AND status IN ('approved', 'Approved') AND ? BETWEEN start_date AND end_date",
      [employeeId, today]
    );

    let dailyStatus = "normal";
    if (holiday.length > 0) dailyStatus = "holiday";
    else if (leave.length > 0) dailyStatus = "leave";
    else if (wfh.length > 0) dailyStatus = "wfh";

    res.json({
      attendance: attendance[0] || null,
      holiday: holiday[0] || null,
      leave: leave[0] || null,
      wfh: wfh[0] || null,
      dailyStatus
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
};

/* Attendance History */
export const getAttendanceHistory = (req,res) => {
    const employeeId = req.params.employee_id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const offset = (page-1) * limit;
    db.query(
        "SELECT * FROM attendance WHERE employee_id=? ORDER BY date DESC LIMIT ? OFFSET ?",
        [employeeId, limit, offset],
        (err, result) => {
            if (err) {
                console.error("Attendance History Error 1:", err);
                return res.status(500).json({ message: "Database error", error: err.message });
            }
            db.query(
                "SELECT COUNT(*) as total FROM attendance WHERE employee_id=?",
                [employeeId],
                (err2, countResult) => {
                    if (err2) {
                        console.error("Attendance History Error 2:", err2);
                        return res.status(500).json({ message: "Database error", error: err2.message });
                    }
                    const total = (countResult && countResult.length > 0) ? countResult[0].total : 0;
                    const totalPages = Math.ceil(total / limit);
                    res.json({
                        data: result,
                        totalPages
                    });
                }
            );
        }
    );
};

/* All Attendance (Admin/HR) */
export const getAllAttendance = (req, res) => {
  const { start_date, end_date, employee_id, date } = req.query;
  let sql = "SELECT a.*, u.name FROM attendance a JOIN employees u ON a.employee_id=u.id WHERE 1=1";
  const params = [];

  if (employee_id) {
    sql += " AND a.employee_id=?";
    params.push(employee_id);
  }
  if (start_date) {
    sql += " AND a.date>=?";
    params.push(start_date);
  }
  if (end_date) {
    sql += " AND a.date<=?";
    params.push(end_date);
  }
  if (date) {
    sql += " AND a.date=?";
    params.push(date);
  }

  sql += " ORDER BY a.date DESC";

  db.query(sql, params, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};

/* Get Month Attendance (Current User) */
export const getMonthAttendance = (req, res) => {
  const employeeId = req.user.employee_id;
  const { month, year } = req.query;

  if (!month || !year) {
    return res.status(400).json({ message: "Month and year are required" });
  }

  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const endDate = new Date(year, month, 0).toISOString().slice(0, 10);

  db.query(
    "SELECT * FROM attendance WHERE employee_id=? AND date BETWEEN ? AND ? ORDER BY date ASC",
    [employeeId, startDate, endDate],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    }
  );
};

/* Get My Attendance (Current User) */
export const getMyAttendance = (req, res) => {
  const employeeId = req.user.employee_id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  db.query(
    "SELECT * FROM attendance WHERE employee_id=? ORDER BY date DESC LIMIT ? OFFSET ?",
    [employeeId, limit, offset],
    (err, result) => {
      if (err) return res.status(500).json(err);
      
      db.query(
        "SELECT COUNT(*) as total FROM attendance WHERE employee_id=?",
        [employeeId],
        (err2, countResult) => {
          if (err2) return res.status(500).json(err2);
          
          const total = countResult[0].total;
          const totalPages = Math.ceil(total / limit);
          res.json({
            data: result,
            currentPage: page,
            totalPages,
            total
          });
        }
      );
    }
  );
};

/* Get Team Attendance (Manager) */
export const getTeamAttendance = (req, res) => {
  const managerId = req.user.employee_id;
  const { start_date, end_date, date } = req.query;

  let sql = `
    SELECT a.*, e.name 
    FROM attendance a 
    JOIN employees e ON a.employee_id = e.id 
    JOIN users u ON e.id = u.employee_id
    WHERE e.manager_id = ?
  `;
  const params = [managerId];

  if (start_date) {
    sql += " AND a.date >= ?";
    params.push(start_date);
  }
  if (end_date) {
    sql += " AND a.date <= ?";
    params.push(end_date);
  }
  if (date) {
    sql += " AND a.date = ?";
    params.push(date);
  }

  sql += " ORDER BY a.date DESC";

  db.query(sql, params, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};