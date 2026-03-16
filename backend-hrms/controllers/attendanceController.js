import db from "../config/db.js";

/* Check-in */
export const checkIn = (req, res) => {
  const { employee_id, work_type } = req.body;

  if (!employee_id) {
    return res.status(400).json({ message: "employee_id is required" });
  }

  if (!work_type) {
    return res.status(400).json({ message: "Work type is required" });
  }

  const today = new Date().toISOString().slice(0, 10);

  // Check if already checked out today
  db.query(
    "SELECT time_out FROM attendance WHERE employee_id=? AND date=?",
    [employee_id, today],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json(err);
      }

      if (result.length && result[0].time_out) {
        return res.status(400).json({ message: "Already checked out for today" });
      }

      const now = new Date();
      db.query(
        `INSERT INTO attendance (employee_id, date, work_type, time_in)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE time_in=?, work_type=?`,
        [employee_id, today, work_type, now, now, work_type],
        (err2, result2) => {
          if (err2) {
            console.error(err2);
            return res.status(500).json(err2);
          }

          res.json({
            message: "Checked in",
            time_in: now
          });
        }
      );
    }
  );
};

/* Today's Attendance */

/* Check-out */
export const checkOut = (req, res) => {
  const employeeId = req.body.employee_id;

  if (!employeeId) {
    return res.status(400).json({ message: "employee_id required" });
  }

  const today = new Date().toISOString().slice(0, 10);

  db.query(
    "SELECT * FROM attendance WHERE employee_id=? AND date=?",
    [employeeId, today],
    (err, result) => {
      if (err) return res.status(500).json(err);

      if (!result.length || !result[0].time_in) {
        return res.status(400).json({ message: "Check-in first" });
      }

      if (result[0].time_out) {
        return res.status(400).json({ message: "Already checked out" });
      }

      const now = new Date();
      const timeIn = new Date(result[0].time_in);
      const hours = (now - timeIn) / 1000 / 3600;

      db.query(
        "UPDATE attendance SET time_out=?, total_hours=? WHERE employee_id=? AND date=?",
        [now, hours, employeeId, today],
        (err2) => {
          if (err2) return res.status(500).json(err2);

          res.json({
            message: "Checked out",
            time_out: now,
            total_hours: hours,
          });
        }
      );
    }
  );
};

/* Today's Attendance */
export const getTodayAttendance = (req,res) => {
    const employeeId = req.params.employee_id;
    const today = new Date().toISOString().slice(0,10);
    db.query("SELECT * FROM attendance WHERE employee_id=? AND date=?", [employeeId,today], (err,result)=>{
        if(err) return res.status(500).json(err);
        res.json(result[0] || { message:"Not checked in yet" });
    });
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
        (err,result)=>{
            if(err) return res.status(500).json(err);
            db.query(
                "SELECT COUNT(*) as total FROM attendance WHERE employee_id=?",
                [employeeId],
                (err2,countResult)=>{
                    const total = countResult[0].total;
                    const totalPages = Math.ceil(total/limit);
                    res.json({
                        data: result,
                        totalPages
                    });
                }
            );
        }
    );
};

/* All Attendance (Admin/Manager) */
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