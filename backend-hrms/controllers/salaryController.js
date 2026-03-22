import { sequelize } from "../config/sequelize.js";
import { QueryTypes } from "sequelize";
import { createNotification } from "./notificationController.js";

/* Get Attendance Stats for an employee in a specific month/year */
export const getAttendanceStats = async (req, res) => {
  const { employee_id, month, year } = req.query;

  if (!employee_id || !month || !year) {
    return res.status(400).json({ message: "employee_id, month, and year are required" });
  }

  try {
    // 1. Get Employee Basic Salary
    const [employee] = await sequelize.query(
      "SELECT basic_salary FROM employees WHERE id = :employee_id",
      { replacements: { employee_id }, type: QueryTypes.SELECT }
    );

    if (!employee) return res.status(404).json({ message: "Employee not found" });

    // 2. Count Present Days (present or wfh)
    const [attendanceStats] = await sequelize.query(
      `SELECT 
        COUNT(CASE WHEN work_type IN ('present', 'wfh') THEN 1 END) as present_days,
        COUNT(CASE WHEN work_type = 'leave' THEN 1 END) as leave_days
       FROM attendance 
       WHERE employee_id = :employee_id 
       AND MONTH(date) = :month 
       AND YEAR(date) = :year`,
      { replacements: { employee_id, month, year }, type: QueryTypes.SELECT }
    );

    // 3. Simple calculation for total working days in month (can be improved with holiday list)
    // For now, we assume standard 22-26 days or use the month's total days
    const totalDaysInMonth = new Date(year, month, 0).getDate();
    
    // Calculate weekends
    let weekends = 0;
    for (let i = 1; i <= totalDaysInMonth; i++) {
      const day = new Date(year, month - 1, i).getDay();
      if (day === 0 || day === 6) weekends++;
    }
    const standardWorkingDays = totalDaysInMonth - weekends;

    res.json({
      basic_salary: employee.basic_salary,
      present_days: attendanceStats.present_days || 0,
      leave_days: attendanceStats.leave_days || 0,
      total_days: totalDaysInMonth,
      standard_working_days: standardWorkingDays
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching attendance stats" });
  }
};

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

    // Check for duplicate
    const [existing] = await sequelize.query(
      "SELECT id FROM salaries WHERE employee_id = :employee_id AND month = :month AND year = :year",
      { replacements: { employee_id, month, year }, type: QueryTypes.SELECT }
    );

    if (existing) {
      return res.status(400).json({ message: "Salary already generated for this month and year" });
    }

    await sequelize.query(
      `INSERT INTO salaries (employee_id, month, year, basic_salary, working_days, present_days, leave_days, per_day_salary, deduction, final_salary, status)
       VALUES (:employee_id, :month, :year, :monthly_salary, :working_days, :present_days, :leave_days, :per_day_salary, :deduction, :final_salary, 'Generated')`,
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

    // Notify employee
    createNotification(employee_id, "Payslip Generated", `Your payslip for ${month}/${year} has been generated.`, "salary").catch(console.error);

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

/* Get My Salary (Current User's Payslips) */
export const getMySalary = async (req, res) => {
  const employeeId = req.user.employee_id;

  try {
    const results = await sequelize.query(
      `SELECT s.*, e.name 
       FROM salaries s 
       JOIN employees e ON s.employee_id = e.id 
       WHERE s.employee_id = :employee_id 
       ORDER BY s.year DESC, s.month DESC`,
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

export const updateSalaryStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) return res.status(400).json({ message: "Status required" });

  try {
    await sequelize.query(
      "UPDATE salaries SET status = :status WHERE id = :id",
      { replacements: { status, id }, type: QueryTypes.UPDATE }
    );
    res.json({ message: `Salary status updated to ${status}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
};

export const bulkGenerateSalary = async (req, res) => {
  const { month, year, employeeIds, defaultAllowance = 0, defaultBonus = 0, otherDeduction = 0 } = req.body;
  const actor_id = req.user.employee_id;
  const actor_role = req.user.role;

  if (!month || !year) return res.status(400).json({ message: "Month and Year required" });

  try {
    let targets = [];
    if (employeeIds && employeeIds.length > 0) {
      targets = employeeIds;
    } else {
      let query = "SELECT id, position FROM employees";
      let replacements = {};
      if (actor_role === "hr") {
          query += " WHERE hr_id = :actor_id OR manager_id = :actor_id OR id = :actor_id";
          replacements.actor_id = actor_id;
      }
      const employees = await sequelize.query(query, { replacements, type: QueryTypes.SELECT });
      targets = employees; // Array of {id, position}
    }

    let processed = 0;
    let skipped = 0;

    for (const emp of targets) {
      const empId = emp.id || emp;
      const position = emp.position || 'Employee';

      // 1. Check Duplicate
      const [existing] = await sequelize.query(
        "SELECT id FROM salaries WHERE employee_id = :empId AND month = :month AND year = :year",
        { replacements: { empId, month, year }, type: QueryTypes.SELECT }
      );
      if (existing) { skipped++; continue; }

      // 2. Fetch Employee Basic
      const [employee] = await sequelize.query(
        "SELECT id, basic_salary, position FROM employees WHERE id = :empId",
        { replacements: { empId }, type: QueryTypes.SELECT }
      );
      if (!employee) continue;

      // 3. Automated Config Calculation
      let allowance = parseFloat(defaultAllowance);
      let bonus = parseFloat(defaultBonus);

      // Role-Based Overrides
      const pos = (employee.position || position).toLowerCase();
      if (pos.includes('manager')) { allowance = 3000; bonus = 1000; }
      else if (pos.includes('developer')) { allowance = 1000; bonus = 500; }
      else if (pos.includes('intern')) { allowance = 500; bonus = 0; }

      // 4. PRECISE LEAVE TRACKING Logic
      const monthStart = `${year}-${String(month).padStart(2, '0')}-01`;
      const monthEnd = new Date(year, month, 0).toISOString().split('T')[0];

      const [leaveStats] = await sequelize.query(
        `SELECT SUM(DATEDIFF(
            LEAST(end_date, :monthEnd),
            GREATEST(start_date, :monthStart)
         ) + 1) as leave_days
         FROM leaves 
         WHERE employee_id = :empId 
         AND status = 'Approved'
         AND start_date <= :monthEnd 
         AND end_date >= :monthStart`,
        { replacements: { empId, monthStart, monthEnd }, type: QueryTypes.SELECT }
      );

      const leave_days = parseInt(leaveStats.leave_days || 0);

      // 5. Standard Payout Calculation
      const totalDaysInMonth = new Date(year, month, 0).getDate();
      let weekends = 0;
      for (let i = 1; i <= totalDaysInMonth; i++) {
        if ([0, 6].includes(new Date(year, month - 1, i).getDay())) weekends++;
      }
      const working_days = totalDaysInMonth - weekends;
      const present_days = Math.max(0, working_days - leave_days);
      const per_day_salary = parseFloat(employee.basic_salary) / working_days;
      const leave_deduction = leave_days * per_day_salary;
      const final_salary = parseFloat(employee.basic_salary) + allowance + bonus - (leave_deduction + parseFloat(otherDeduction));

      await sequelize.query(
        `INSERT INTO salaries (employee_id, month, year, basic_salary, allowance, bonus, working_days, present_days, leave_days, per_day_salary, deduction, final_salary, status)
         VALUES (:empId, :month, :year, :basic_salary, :allowance, :bonus, :working_days, :present_days, :leave_days, :per_day_salary, :deduction, :final_salary, 'Generated')`,
        {
          replacements: { 
              empId, month, year, 
              basic_salary: employee.basic_salary, 
              allowance, bonus,
              working_days, present_days, leave_days, 
              per_day_salary, 
              deduction: leave_deduction + parseFloat(otherDeduction), 
              final_salary 
          },
          type: QueryTypes.INSERT
        }
      );
      processed++;
    }

    res.json({ totalFound: targets.length, processed, skipped });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Bulk generation failed" });
  }
};

export const updateSalaryRecord = async (req, res) => {
    const { id } = req.params;
    const { allowance, bonus, deduction, final_salary } = req.body;

    try {
        await sequelize.query(
            "UPDATE salaries SET allowance = :allowance, bonus = :bonus, deduction = :deduction, final_salary = :final_salary WHERE id = :id",
            { replacements: { allowance, bonus, deduction, final_salary, id }, type: QueryTypes.UPDATE }
        );
        res.json({ message: "Salary record updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error updating salary record" });
    }
};

export const getPayrollSummary = async (req, res) => {
    const { month, year } = req.query;
    const actor_id = req.user.employee_id;
    const actor_role = req.user.role;

    try {
        let empQuery = "SELECT COUNT(*) as total FROM employees";
        let salQuery = "SELECT COUNT(*) as processed FROM salaries WHERE month = :month AND year = :year";
        let replacements = { month, year };

        if (actor_role === "hr") {
            empQuery += " WHERE hr_id = :actor_id OR manager_id = :actor_id OR id = :actor_id";
            salQuery += " AND employee_id IN (SELECT id FROM employees WHERE hr_id = :actor_id OR manager_id = :actor_id OR id = :actor_id)";
            replacements.actor_id = actor_id;
        }

        const [totalRes] = await sequelize.query(empQuery, { replacements, type: QueryTypes.SELECT });
        const [processedRes] = await sequelize.query(salQuery, { replacements, type: QueryTypes.SELECT });

        res.json({
            totalEmployees: totalRes.total,
            processedCount: processedRes.processed,
            month,
            year
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Database error" });
    }
};
