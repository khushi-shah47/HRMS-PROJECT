import db from "../config/db.js";

/* Calculate Salary */
export const calculateSalary = (req, res) => {

  const { month, year } = req.body;

  const employeeQuery = "SELECT id, basic_salary FROM employees";

  db.query(employeeQuery, (err, employees) => {

    if (err) return res.status(500).json(err);

    employees.forEach(emp => {

      const attendanceQuery = `
      SELECT COUNT(*) as presentDays
      FROM attendance
      WHERE employee_id = ?
      AND MONTH(date) = ?
      AND YEAR(date) = ?
      AND work_type = 'present'
      `;

      db.query(attendanceQuery,[emp.id, month, year],(err,att)=>{

        const presentDays = att[0].presentDays;

        const workingDays = 22;

        const leaveDays = workingDays - presentDays;

        const perDaySalary = emp.basic_salary / workingDays;

        const deduction = leaveDays * perDaySalary;

        const finalSalary = emp.basic_salary - deduction;

        const insertQuery = `
        INSERT INTO salaries
        (employee_id, month, year, basic_salary, working_days, present_days, leave_days, per_day_salary, deduction, final_salary)
        VALUES (?,?,?,?,?,?,?,?,?,?)
        `;

        db.query(insertQuery,[
          emp.id,
          month,
          year,
          emp.basic_salary,
          workingDays,
          presentDays,
          leaveDays,
          perDaySalary,
          deduction,
          finalSalary
        ]);

      });

    });

    res.json({ message: "Payroll generated successfully" });

  });

};

/* Salary History */
export const getSalaryHistory = (req, res) => {
  const employeeId = req.params.employeeId;
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