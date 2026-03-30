import db from "../config/db.js";
import { createNotification } from "./notificationController.js";


export const applyWFH = async (req, res) => {
  const { employee_id, start_date, end_date, reason } = req.body;

  if (!employee_id || !start_date || !end_date) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // 1. Verify role - Admin cannot apply
    const [emp] = await db.promise().query(
      `SELECT e.id, u.role, e.manager_id, e.hr_id 
       FROM employees e 
       JOIN users u ON e.user_id = u.id 
       WHERE e.id = ?`,
      [employee_id]
    );

    if (emp.length === 0) return res.status(404).json({ message: "Employee not found" });
    if (emp[0].role === "admin") return res.status(403).json({ message: "Admins do not apply for WFH" });

    // 1.5 Check for overlapping WFH or Leave requests
    const [overlapWFH] = await db.promise().query(
      `SELECT id FROM wfh_requests 
       WHERE employee_id = ? 
       AND status IN ('pending', 'approved', 'managerApproved')
       AND (start_date <= ? AND end_date >= ?)`,
      [employee_id, end_date, start_date]
    );

    if (overlapWFH.length > 0) {
      return res.status(400).json({ message: "You already have a WFH request for this date range" });
    }

    const [overlapLeave] = await db.promise().query(
      `SELECT id FROM leaves 
       WHERE employee_id = ? 
       AND status IN ('pending', 'approved', 'Approved', 'managerApproved')
       AND (start_date <= ? AND end_date >= ?)`,
      [employee_id, end_date, start_date]
    );

    if (overlapLeave.length > 0) {
      return res.status(400).json({ message: "You already have a leave request for this date range" });
    }

    // 2. Insert with hierarchy
    await db.promise().query(
      "INSERT INTO wfh_requests (employee_id, start_date, end_date, reason, manager_id, hr_id, status) VALUES (?,?,?,?,?,?,?)",
      [employee_id, start_date, end_date, reason, emp[0].manager_id, emp[0].hr_id, 'pending']
    );

    res.status(201).json({ message: "WFH request submitted", status: "pending" });

    // Notify Manager or HR
    const notifyId = emp[0].manager_id || emp[0].hr_id;
    if (notifyId) {
      createNotification(notifyId, "New WFH Request", `A new WFH request has been submitted by an employee.`, "wfh").catch(console.error);
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
};

export const approveWFH = async (req, res) => {
  const { id } = req.body;
  const actor_user_id = req.user.id;
  const actor_role = req.user.role;

  try {
    const [requestResult] = await db.promise().query(
      `SELECT w.*, u.role as owner_role, e.user_id as owner_user_id 
       FROM wfh_requests w 
       JOIN employees e ON w.employee_id = e.id
       JOIN users u ON e.user_id = u.id
       WHERE w.id = ?`,
      [id]
    );

    if (requestResult.length === 0) return res.status(404).json({ message: "WFH Request not found" });
    const request = requestResult[0];

    // Security Checks
    if (actor_user_id === request.owner_user_id) {
      return res.status(403).json({ message: "You cannot approve your own WFH request" });
    }
    if (actor_role === "manager" && request.owner_role === "hr") {
      return res.status(403).json({ message: "Managers cannot approve HR WFH requests" });
    }

    let nextStatus = "approved"; // Default for WFH is approved if manager says so, but we can do steps
    if (actor_role === "manager") {
      if (request.status !== "pending") return res.status(400).json({ message: "Request already processed" });
      nextStatus = "managerApproved";
    }

    await db.promise().query("UPDATE wfh_requests SET status = ? WHERE id = ?", [nextStatus, id]);
    res.json({ message: `WFH status updated to ${nextStatus}` });

    createNotification(request.owner_user_id, "WFH Request Updated", `Your WFH request has been moved to ${nextStatus}.`, "wfh").catch(console.error);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
};

export const rejectWFH = async (req, res) => {
  const { id } = req.body;
  const actor_user_id = req.user.id;

  try {
    const [requestResult] = await db.promise().query(
      `SELECT w.employee_id, e.user_id as owner_user_id FROM wfh_requests w JOIN employees e ON w.employee_id = e.id WHERE w.id = ?`,
      [id]
    );

    if (requestResult.length === 0) return res.status(404).json({ message: "WFH Request not found" });
    
    if (actor_user_id === requestResult[0].owner_user_id) {
      return res.status(403).json({ message: "You cannot reject your own request" });
    }

    await db.promise().query("UPDATE wfh_requests SET status = 'rejected' WHERE id = ?", [id]);
    res.json({ message: "WFH Rejected" });

    createNotification(requestResult[0].owner_user_id, "WFH Request Rejected", `Your WFH request has been rejected.`, "wfh").catch(console.error);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
};



export const getWFHHistory = (req,res)=>{

  const employeeId = req.params.employee_id;

  db.query(
    `SELECT w.*, e.name, u.role as owner_role
     FROM wfh_requests w
     JOIN employees e ON w.employee_id=e.id
     JOIN users u ON e.user_id = u.id
     WHERE w.employee_id=?
     ORDER BY w.start_date DESC`,
    [employeeId],
    (err,result)=>{
      if(err) return res.status(500).json(err);

      res.json(result);
    }
  );
};



export const getAllWFH = (req,res)=>{

  db.query(
    `SELECT w.*, e.name, u.role as owner_role
     FROM wfh_requests w
     JOIN employees e ON w.employee_id=e.id
     JOIN users u ON e.user_id = u.id
     ORDER BY w.start_date DESC`,
    (err,result)=>{
      if(err) return res.status(500).json(err);

      res.json(result);
    }
  );
};

/* Get My WFH Requests (Current User) */
export const getMyWFH = (req, res) => {
  const employeeId = req.user.employee_id;

  db.query(
    `SELECT w.*, e.name
     FROM wfh_requests w
     JOIN employees e ON w.employee_id = e.id
     WHERE w.employee_id = ?
     ORDER BY w.start_date DESC`,
    [employeeId],
    (err, result) => {
      if (err) {
        console.error("Error in getMyWFH:", err);
        return res.status(500).json({ message: "Database error" });
      }
      res.json(result);
    }
  );
};

export const getTeamWFH = (req, res) => {
  const managerId = req.user.employee_id;

  db.query(
    `SELECT w.*, e.name, d.name AS department, u.role as owner_role
     FROM wfh_requests w
     JOIN employees e ON w.employee_id = e.id
     JOIN users u ON e.user_id = u.id
     LEFT JOIN departments d ON e.department_id = d.id
     WHERE e.manager_id = ?
     ORDER BY w.start_date DESC`,
    [managerId],
    (err, result) => {
      if (err) {
        console.error("Error in getTeamWFH:", err);
        return res.status(500).json({ message: "Database error" });
      }
      res.json(result);
    }
  );
};
