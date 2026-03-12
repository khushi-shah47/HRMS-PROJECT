import { sequelize } from "../config/sequelize.js";
import { QueryTypes } from "sequelize";

export const getDashboardStats = async (req, res) => {
  try {
    const today = new Date().toISOString().slice(0, 10);

    const stats = await Promise.all([
      // Total Employees
      sequelize.query("SELECT COUNT(*) as totalEmployees FROM employees", { type: QueryTypes.SELECT }),
      // Present Today
      sequelize.query(
        `SELECT COUNT(*) as presentToday 
         FROM attendance 
         WHERE DATE(date) = :today AND work_type = 'present'`,
        { replacements: { today }, type: QueryTypes.SELECT }
      ),
      // Leaves Today
      sequelize.query(
        `SELECT COUNT(*) as leavesToday 
         FROM leaves l 
         JOIN employees e ON l.employee_id = e.id 
         WHERE DATE(l.start_date) <= :today AND DATE(l.end_date) >= :today AND l.status IN ('Approved', 'Pending')`,
        { replacements: { today }, type: QueryTypes.SELECT }
      ),
      // WFH Today
      sequelize.query(
        `SELECT COUNT(*) as wfhToday 
         FROM attendance 
         WHERE DATE(date) = :today AND work_type = 'wfh'`,
        { replacements: { today }, type: QueryTypes.SELECT }
      )
    ]);

    res.json({
      totalEmployees: stats[0][0].totalEmployees,
      presentToday: parseInt(stats[1][0].presentToday) || 0,
      leavesToday: parseInt(stats[2][0].leavesToday) || 0,
      wfhToday: parseInt(stats[3][0].wfhToday) || 0
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
};

