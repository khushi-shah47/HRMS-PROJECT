import { sequelize } from "../config/sequelize.js";
import { QueryTypes } from "sequelize";

/* GET PROFILE */

export const getProfile = async (req, res) => {

  const userId = req.user.id;

  try {

    const user = await sequelize.query(

      `SELECT 
        e.id,
        e.name,
        e.email,
        e.phone,
        e.position,
        d.name AS department,
        e.join_date
       FROM employees e
       LEFT JOIN departments d ON e.department_id = d.id
       WHERE e.id = :id`,

      {
        replacements: { id: userId },
        type: QueryTypes.SELECT
      }

    );

    if (!user.length) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user[0]);

  } catch (err) {

    console.error(err);
    res.status(500).json({ message: "Failed Try Again" });

  }
};


/* UPDATE PROFILE */

export const updateProfile = async (req, res) => {

  const userId = req.user.id;

  const { name, phone } = req.body;

  try {

    await sequelize.query(

      `UPDATE employees 
       SET name = :name,
           phone = :phone
       WHERE id = :id`,

      {
        replacements: { id: userId, name, phone },
        type: QueryTypes.UPDATE
      }

    );

    res.json({ message: "Profile updated successfully" });

  } catch (err) {

    console.error(err);
    res.status(500).json({ message: "Failed Try Again" });

  }
};