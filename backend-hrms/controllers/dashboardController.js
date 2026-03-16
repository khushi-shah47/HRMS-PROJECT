import { sequelize } from "../config/sequelize.js";
import { QueryTypes } from "sequelize";

const getBaseStats = async (today) => {
  const [totalEmployeesRes, presentRes, leavesRes, wfhRes] = await Promise.all([
    sequelize.query("SELECT COUNT(*) as value FROM employees", { type: QueryTypes.SELECT }),
    sequelize.query(
      `SELECT COUNT(*) as value FROM attendance WHERE DATE(date) = :today AND work_type = 'present'`,
      { replacements: { today }, type: QueryTypes.SELECT }
    ),
    sequelize.query(
      `SELECT COUNT(*) as value FROM leaves l WHERE DATE(l.start_date) <= :today AND DATE(l.end_date) >= :today AND l.status = 'Pending'`,
      { replacements: { today }, type: QueryTypes.SELECT }
    ),
    sequelize.query(
      `SELECT COUNT(*) as value FROM attendance WHERE DATE(date) = :today AND work_type = 'wfh'`,
      { replacements: { today }, type: QueryTypes.SELECT }
    )
  ]);

  return [
    {
      title: "Total Employees",
      value: parseInt(totalEmployeesRes[0].value) || 0,
      change: "+12%"
    },
    {
      title: "Present Today",
      value: parseInt(presentRes[0].value) || 0,
      change: "+2%"
    },
    {
      title: "Pending Leaves",
      value: parseInt(leavesRes[0].value) || 0,
      change: "+1%"
    },
    {
      title: "WFH Today",
      value: parseInt(wfhRes[0].value) || 0,
      change: "-1%"
    }
  ];
};

export const getRoleStats = async (req, res) => {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const role = req.user.role;
    const employeeId = req.user.employee_id;

    let stats = await getBaseStats(today);

    if (role === 'admin') {
      const [deptRes, pendingReqRes] = await Promise.all([
        sequelize.query("SELECT COUNT(*) as value FROM departments", { type: QueryTypes.SELECT }),
        sequelize.query("SELECT COUNT(*) as value FROM leaves WHERE status = 'Pending'", { type: QueryTypes.SELECT })
      ]);
      stats.push(
        { title: "Total Departments", value: parseInt(deptRes[0].value) || 0, change: "stable" },
        { title: "Pending Requests", value: parseInt(pendingReqRes[0].value) || 0, change: "+3%" }
      );
    } else if (role === 'hr') {
      const thirtyDaysAgo = new Date(Date.now() - 30*24*60*60*1000).toISOString().slice(0, 10);
      const [deptRes, recentHiresRes] = await Promise.all([
        sequelize.query("SELECT COUNT(*) as value FROM departments", { type: QueryTypes.SELECT }),
        sequelize.query(
          `SELECT COUNT(*) as value FROM employees WHERE hire_date >= :thirtyDaysAgo`,
          { replacements: { thirtyDaysAgo }, type: QueryTypes.SELECT }
        )
      ]);
      stats.push(
        { title: "Total Departments", value: parseInt(deptRes[0].value) || 0, change: "stable" },
        { title: "New Hires (30d)", value: parseInt(recentHiresRes[0].value) || 0, change: "+2%" }
      );
    } else if (role === 'manager' && employeeId) {
      const [teamTasksRes, pendingTeamTasksRes] = await Promise.all([
        sequelize.query(
          `SELECT COUNT(*) as value FROM tasks WHERE assigned_by = :employeeId`,
          { replacements: { employeeId }, type: QueryTypes.SELECT }
        ),
        sequelize.query(
          `SELECT COUNT(*) as value FROM tasks WHERE assigned_by = :employeeId AND status != 'completed'`,
          { replacements: { employeeId }, type: QueryTypes.SELECT }
        )
      ]);
      stats.push(
        { title: "Team Tasks", value: parseInt(teamTasksRes[0].value) || 0, change: "+5%" },
        { title: "Pending Tasks", value: parseInt(pendingTeamTasksRes[0].value) || 0, change: "-2%" }
      );
    } else if (['developer', 'intern'].includes(role) && employeeId) {
      const [totalTasksRes, pendingTasksRes] = await Promise.all([
        sequelize.query(
          `SELECT COUNT(*) as value FROM tasks WHERE assigned_to = :employeeId`,
          { replacements: { employeeId }, type: QueryTypes.SELECT }
        ),
        sequelize.query(
          `SELECT COUNT(*) as value FROM tasks WHERE assigned_to = :employeeId AND status = 'pending'`,
          { replacements: { employeeId }, type: QueryTypes.SELECT }
        )
      ]);
      stats.push(
        { title: "Total Tasks", value: parseInt(totalTasksRes[0].value) || 0, change: "stable" },
        { title: "Pending Tasks", value: parseInt(pendingTasksRes[0].value) || 0, change: "-1%" }
      );
    }

    res.json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const stats = await getBaseStats(today);
    res.json({
      totalEmployees: stats[0].value,
      presentToday: stats[1].value,
      leavesToday: stats[2].value,
      wfhToday: stats[3].value
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
};

