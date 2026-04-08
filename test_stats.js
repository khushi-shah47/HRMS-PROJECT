import { sequelize } from "./backend-hrms/config/sequelize.js";
import { QueryTypes } from "sequelize";

async function run() {
  try {
      const today = new Date().toISOString().slice(0, 10);
      const res = await sequelize.query(`SELECT COUNT(*) as presentToday FROM attendance`, { type: QueryTypes.SELECT });
      console.log("Total attendance:", res);

      const res2 = await sequelize.query(
        `SELECT COUNT(*) as presentToday 
         FROM attendance 
         WHERE DATE(date) = :today AND work_type = 'present'`,
        { replacements: { today }, type: QueryTypes.SELECT }
      );
      console.log("Present today:", res2[0]);
      
      const leaves = await sequelize.query(
        `SELECT COUNT(*) as leavesToday 
         FROM leaves l 
         JOIN employees e ON l.employee_id = e.id 
         WHERE DATE(l.start_date) <= :today AND DATE(l.end_date) >= :today AND l.status IN ('approved', 'Approved', 'pending', 'Pending', 'managerApproved')`,
        { replacements: { today }, type: QueryTypes.SELECT }
      );
      console.log("Leaves today:", leaves[0]);
      
  } catch (err) {
      console.error(err);
  } finally {
      process.exit();
  }
}
run();
