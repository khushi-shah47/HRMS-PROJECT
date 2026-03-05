import db from "../config/db.js";

/* Calculate Salary */
export const calculateSalary = (req, res) => {
  const { employee_id, month, year, basic_salary, working_days, present_days, leave_days } = req.body;

  const per_day_salary = basic_salary / working_days;
  const deduction = leave_days * per_day_salary;
  const final_salary = basic_salary - deduction;

  db.query(
    "INSERT INTO salaries (employee_id, month, year, basic_salary, working_days, present_days, leave_days, per_day_salary, deduction, final_salary) VALUES (?,?,?,?,?,?,?,?,?,?)",
    [employee_id, month, year, basic_salary, working_days, present_days, leave_days, per_day_salary, deduction, final_salary],
    (err, result) => {
      if (err){ console.error(err); return res.status(500).json(err);};
      res.json({ message: "Salary calculated", final_salary });
    }
  );
};

/* Salary History */
export const getSalaryHistory = (req, res) => {
  const employeeId = req.params.employee_id;
  db.query(
    "SELECT s.*, e.name FROM salaries s JOIN employees e ON s.employee_id=e.id WHERE s.employee_id=? ORDER BY s.created_at DESC",
    [employeeId],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    }
  );
};

/* Monthly Salary Report */
export const getSalaryReport = (req, res) => {
  const { month, year } = req.query;
  let sql = "SELECT s.*, e.name, e.department FROM salaries s JOIN employees e ON s.employee_id=e.id WHERE 1=1";
  const params = [];
  if(month){ sql += " AND s.month=?"; params.push(month);}
  if(year){ sql += " AND s.year=?"; params.push(year);}
  sql += " ORDER BY s.employee_id ASC";
  db.query(sql, params, (err, result) => {
    if(err) return res.status(500).json(err);
    res.json(result);
  });
};