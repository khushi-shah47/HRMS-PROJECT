import { sequelize } from "../config/sequelize.js";
import { QueryTypes } from "sequelize";

/* Calculate Salary for specific employee */
export const calculateSalary = async (req, res) => {
  const { employee_id, month, year, monthly_salary, working_days, leave_days } = req.body;

  if (!employee_id || !month || !year || !monthly_salary || !working_days || leave_days === undefined) {
    return res.status(400).json({
      message: "Missing required fields: employee_id, month, year, monthly_salary, working_days, leave_days"
    });
  }

  try {
    const present_days = working_days - leave_days;
    const per_day_salary = parseFloat(monthly_salary) / working_days;
    const deduction = leave_days * per_day_salary;
    const final_salary = parseFloat(monthly_salary) - deduction;

    await sequelize.query(
      `INSERT INTO salaries (employee_id, month, year, basic_salary, working_days, present_days, leave_days, per_day_salary, deduction, final_salary)
       VALUES (:employee_id, :month, :year, :monthly_salary, :working_days, :present_days, :leave_days, :per_day_salary, :deduction, :final_salary)`,
      {
        replacements: { employee_id, month, year, monthly_salary, working_days, present_days, leave_days, per_day_salary, deduction, final_salary },
        type: QueryTypes.INSERT
      }
    );

    res.status(201).json({
      message: "Salary calculated and saved successfully",
      salary_details: {
        present_days,
        per_day_salary: per_day_salary.toFixed(2),
        deduction: deduction.toFixed(2),
        final_salary: final_salary.toFixed(2)
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error during salary calculation" });
  }
};

/* Salary History */
export const getSalaryHistory = async (req, res) => {
  const employeeId = req.params.employee_id;

  try {
    const results = await sequelize.query(
      `SELECT s.*, e.name 
       FROM salaries s 
       JOIN employees e ON s.employee_id = e.id 
       WHERE s.employee_id = :employee_id 
       ORDER BY s.created_at DESC`,
      {
        replacements: { employee_id: employeeId },
        type: QueryTypes.SELECT
      }
    );

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
};

/* Monthly Salary Report */
export const getSalaryReport = async (req, res) => {
  const { month, year } = req.query;

  let baseQuery = `
    FROM salaries s 
    JOIN employees e ON s.employee_id = e.id 
    LEFT JOIN departments d ON e.department_id = d.id
  `;

  let replacements = {};
  let whereClauses = [];

  if (month) {
    whereClauses.push("s.month = :month");
    replacements.month = month;
  }
  if (year) {
    whereClauses.push("s.year = :year");
    replacements.year = year;
  }

  if (whereClauses.length > 0) {
    baseQuery += " WHERE " + whereClauses.join(" AND ");
  }

  try {
    const results = await sequelize.query(
      `SELECT s.*, e.name, COALESCE(d.name, 'No Department') AS department
       ${baseQuery}
       ORDER BY e.name ASC`,
      {
        replacements,
        type: QueryTypes.SELECT
      }
    );

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
};

