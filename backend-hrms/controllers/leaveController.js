import { sequelize } from "../config/sequelize.js";
import { QueryTypes } from "sequelize";
import { createNotification } from "./notificationController.js";
import { LEAVE_POLICY } from "../config/leavePolicy.js";
const calculateWorkingDays = (startDate, endDate) => {
  let count = 0;
  let curDate = new Date(startDate);
  const lastDate = new Date(endDate);
  while (curDate <= lastDate) {
    const dayOfWeek = curDate.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) count++;
    curDate.setDate(curDate.getDate() + 1);
  }
  return count;
};

export const applyLeave = async (req, res) => {
  const { employee_id, start_date, end_date, reason , leave_type } = req.body;
 
  if (!employee_id || !start_date || !end_date || !leave_type) {
    return res.status(400).json({ message: "All required fields missing" });
  }

  try {
    // 1. Verify role - Admin cannot apply
    const [emp] = await sequelize.query(
      `SELECT e.id, e.name, u.role, e.manager_id, e.hr_id 
       FROM employees e 
       JOIN users u ON e.user_id = u.id 
       WHERE e.id = :employee_id`,
      { replacements: { employee_id }, type: QueryTypes.SELECT }
    );

    // add START
      const validTypes = [
        "Paid Leave",
        "Sick Leave",
        "Casual Leave",
        "Emergency Leave",
        "Unpaid Leave"
      ];

      if (!validTypes.includes(leave_type)) {
        return res.status(400).json({ message: "Invalid leave type" });
      }
      // add END

    if (!emp) return res.status(404).json({ message: "Employee not found" });
    if (emp.role === "admin") return res.status(403).json({ message: "Admins do not apply for leave" });

    // 1.5 Check for overlapping Leave or WFH requests
    const overlapLeave = await sequelize.query(
      `SELECT id FROM leaves 
       WHERE employee_id = :employee_id 
       AND status IN ('pending', 'approved', 'managerApproved')
       AND (start_date <= :end_date AND end_date >= :start_date)`,
      { replacements: { employee_id, start_date, end_date }, type: QueryTypes.SELECT }
    );

    if (overlapLeave.length > 0) {
      return res.status(400).json({ message: "You already have a leave request for this date range" });
    }

    if (new Date(end_date) < new Date(start_date)) {
      return res.status(400).json({ message: "End date cannot be before start date" });
    }

    if (start_date && new Date(start_date) < new Date()) {
      return res.status(400).json({ message: "You can't apply the leave of past date!"});
    }

    // add START
      if (leave_type !== "Unpaid Leave") {

        if (!LEAVE_POLICY[leave_type]) {
          return res.status(400).json({ message: "Leave policy not defined" });
        }
        const limit = LEAVE_POLICY[leave_type] || 0;
       

        const usedLeaves = await sequelize.query(
          `SELECT start_date, end_date FROM leaves
          WHERE employee_id = :employee_id
          AND leave_type = :leave_type
          AND status != 'Rejected'`,
          {
            replacements: { employee_id, leave_type },
            type: QueryTypes.SELECT
          }
        );

        const usedDays = usedLeaves.reduce((total, l) => {
          /* [WEEKEND THING] - Old logic:
          const days =
            Math.ceil(
              (new Date(l.end_date) - new Date(l.start_date)) /
              (1000 * 60 * 60 * 24)
            ) + 1;
          */
          const days = calculateWorkingDays(l.start_date, l.end_date);
          return total + days;
        }, 0);

        /* [WEEKEND THING] - Old logic:
        const requestedDays =
          Math.ceil((new Date(end_date) - new Date(start_date)) / (1000 * 60 * 60 * 24)) + 1;
        */
        const requestedDays = calculateWorkingDays(start_date, end_date);
      

        if (usedDays + requestedDays > limit) {
          return res.status(400).json({
            message: `Not enough ${leave_type}. Remaining: ${limit - usedDays}`
          });
        }
      }
      // add END

    //   if ((leaveType === "Sick Leave" || leaveType === "Emergency Leave") && startDate > new Date()) {
    //   showSnackbar("This Leave Type can only be applied for today", "error");
    //   return;
    // }
      if( leave_type === "Sick Leave" || leave_type === "Emergency Leave" && new Date(start_date) > new Date()){
        return res.status(400).json({ message: "This Leave Type can only be applied for today" });
      }

    const overlapWFH = await sequelize.query(
      `SELECT id FROM wfh_requests 
       WHERE employee_id = :employee_id 
       AND status IN ('pending', 'approved', 'managerApproved')
       AND (start_date <= :end_date AND end_date >= :start_date)`,
      { replacements: { employee_id, start_date, end_date }, type: QueryTypes.SELECT }
    );

    if (overlapWFH.length > 0) {
      return res.status(400).json({ message: "You already have a WFH request for this date range" });
    }

    // 2. Insert with hierarchy
    await sequelize.query(
      `INSERT INTO leaves (employee_id, leave_type, start_date, end_date, reason, manager_id, hr_id, status)
       VALUES (:employee_id, :leave_type, :start_date, :end_date, :reason, :manager_id, :hr_id, 'pending')`,
      {
        replacements: { 
          employee_id, 
          leave_type, // add
          start_date, 
          end_date, 
          reason, 
          manager_id: emp.manager_id, 
          hr_id: emp.hr_id 
        },
        type: QueryTypes.INSERT
      }
    );

    res.status(201).json({ message: "Leave applied successfully", status: "pending" });

    // Notify Manager or HR
    if (emp.manager_id) {
      createNotification(
        emp.manager_id,
        "New Leave Request",
        `A new leave request has been submitted by ${emp.name || 'an employee'}.`,
        "leave"
      ).catch(console.error);
    }

    if (emp.hr_id) {
      createNotification(
        emp.hr_id,
        "New Leave Request",
        `A new leave request has been submitted by ${emp.name || 'an employee'}.`,
        "leave"
      ).catch(console.error);
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
};

/* Get Leaves */
export const getLeaves = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const status = req.query.status;
  const offset = (page - 1) * limit;

  let baseQuery = `
    FROM leaves l
    JOIN employees e ON l.employee_id = e.id
    JOIN users u ON e.user_id = u.id
    LEFT JOIN departments d ON e.department_id = d.id
  `;

  let whereClauses = [];
  let replacements = {};

  if (status) {
    whereClauses.push("l.status = :status");
    replacements.status = status;
  }

  if (whereClauses.length > 0) {
    baseQuery += " WHERE " + whereClauses.join(" AND ");
  }

  try {
    const dataQuery = `
      SELECT l.id, e.name, u.role AS owner_role, l.employee_id, d.name AS department,
             l.start_date, l.end_date, l.leave_type,
             l.reason, l.status
      ${baseQuery}
      ORDER BY l.id DESC
      LIMIT :limit OFFSET :offset
    `;

    const countQuery = `
      SELECT COUNT(*) as total ${baseQuery}
    `;

    const leaves = await sequelize.query(dataQuery, {
      replacements: { ...replacements, limit, offset },
      type: QueryTypes.SELECT
    });

    const countResult = await sequelize.query(countQuery, {
      replacements,
      type: QueryTypes.SELECT
    });

    const totalLeaves = countResult[0].total;

    res.json({
      data: leaves,
      currentPage: page,
      totalPages: Math.ceil(totalLeaves / limit),
      totalLeaves
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
};

export const updateLeaveStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const actor_id = req.user.id; // User ID from token
  const actor_role = req.user.role;

  if (!status) return res.status(400).json({ message: "Status required" });

  try {
    // 1. Fetch leave and record owner details
    const leaveResult = await sequelize.query(
      `SELECT l.*, u.role as owner_role, e.id as employee_row_id, e.user_id as owner_user_id
       FROM leaves l 
       JOIN employees e ON l.employee_id = e.id
       JOIN users u ON e.user_id = u.id
       WHERE l.id = :id`,
      { replacements: { id }, type: QueryTypes.SELECT }
    );

    if (leaveResult.length === 0) return res.status(404).json({ message: "Leave not found" });
    const leave = leaveResult[0];

    // 2. Security Checks
    // Rule: Cannot approve your own leave
    if (actor_id === leave.owner_user_id) {
      return res.status(403).json({ message: "You cannot approve/reject your own leave request" });
    }

    // Rule: Manager cannot approve HR request
    if (actor_role === "manager" && leave.owner_role === "hr") {
      return res.status(403).json({ message: "Managers cannot approve HR leave requests" });
    }

    // 3. Logic based on role and stage
    let nextStatus = status; // Default (e.g., Rejected)

    if (status === "approved") {
      if (actor_role === "manager") {
        // Manager approval is only Stage 1
        if (leave.status !== "pending") return res.status(400).json({ message: "Leave already processed to next stage" });
        nextStatus = "managerApproved";
      } else if (actor_role === "hr" || actor_role === "admin") {
        // HR/Admin is Final Approval (Stage 2 or Override)
        nextStatus = "approved"; // Keep consistent with DB ENUM
      } else {
        return res.status(403).json({ message: "Unauthorized to approve" });
      }
    }

    // 4. If FINAL Approval -> Deduct Balance
    if (nextStatus === "approved" && leave.status !== "approved") {
      /* [WEEKEND THING] - Old logic:
      const start = new Date(leave.start_date);
      const end = new Date(leave.end_date);
      const days = Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1;
      */
      const days = calculateWorkingDays(leave.start_date, leave.end_date);

      // Check if employee has enough balance
      const [employee] = await sequelize.query(
        "SELECT leave_balance FROM employees WHERE id = :employee_id",
        { replacements: { employee_id: leave.employee_id }, type: QueryTypes.SELECT }
      );

      if (employee && employee.leave_balance < days) {
        return res.status(400).json({ message: "Insufficient leave balance" });
      }

      await sequelize.query(
        `UPDATE employees SET leave_balance = leave_balance - :days WHERE id = :employee_id`,
        { replacements: { days, employee_id: leave.employee_id }, type: QueryTypes.UPDATE }
      );
    }

    // 5. Update Status
    await sequelize.query(
      `UPDATE leaves SET status = :nextStatus WHERE id = :id`,
      { replacements: { nextStatus, id }, type: QueryTypes.UPDATE }
    );

    res.json({ message: `Leave status updated to ${nextStatus}` });

    // Notify the employee
    const message =
      nextStatus === "managerApproved"
        ? "Your leave request has been approved by the manager and is awaiting HR approval."
        : nextStatus === "approved"
        ? "Your leave request has been fully approved."
        : nextStatus === "Rejected"
        ? "Your leave request has been rejected."
        : "Your leave request status has been updated.";

    createNotification(
      leave.employee_id, // 🔥 IMPORTANT FIX
      "Leave Request Update",
      message,
      "leave"
    ).catch(console.error);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
};

/* Get My Leaves (Current User) */
export const getMyLeaves = async (req, res) => {
  const employeeId = req.user.employee_id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const leaves = await sequelize.query(
      `SELECT l.*, e.name 
       FROM leaves l 
       JOIN employees e ON l.employee_id = e.id 
       WHERE l.employee_id = :employee_id 
       ORDER BY l.created_at DESC 
       LIMIT :limit OFFSET :offset`,
      {
        replacements: { employee_id: employeeId, limit, offset },
        type: QueryTypes.SELECT
      }
    );

    const countResult = await sequelize.query(
      `SELECT COUNT(*) as total FROM leaves WHERE employee_id = :employee_id`,
      { replacements: { employee_id: employeeId }, type: QueryTypes.SELECT }
    );

    const total = countResult[0].total;

    res.json({
      data: leaves,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      total
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
};

/* Get Team Leaves (Manager) */
export const getTeamLeaves = async (req, res) => {
  const managerId = req.user.employee_id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const status = req.query.status;
  const offset = (page - 1) * limit;

  let whereClauses = [
    "l.manager_id = :managerId"
  ];
  let replacements = { managerId, limit, offset };

  if (status) {
    whereClauses.push("l.status = :status");
    replacements.status = status;
  }

  try {
    const leaves = await sequelize.query(
      `SELECT l.id, e.name, u.role AS owner_role, l.employee_id, d.name AS department, l.start_date, l.end_date, l.leave_type, l.reason, l.status
       FROM leaves l
       JOIN employees e ON l.employee_id = e.id
       JOIN users u ON e.user_id = u.id
       LEFT JOIN departments d ON e.department_id = d.id
       WHERE ${whereClauses.join(" AND ")}
       ORDER BY l.created_at DESC
       LIMIT :limit OFFSET :offset`,
      { replacements, type: QueryTypes.SELECT }
    );

     const countResult = await sequelize.query(
      `SELECT COUNT(*) as total
       FROM leaves l
       JOIN employees e ON l.employee_id = e.id
       WHERE l.manager_id = :managerId${status ? " AND l.status = :status" : ""}`,
      { replacements, type: QueryTypes.SELECT }
    );

    const total = countResult[0].total;

    res.json({
      data: leaves,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      total
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
};

