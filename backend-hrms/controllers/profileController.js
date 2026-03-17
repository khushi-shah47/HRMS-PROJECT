import { sequelize } from "../config/sequelize.js";
import { QueryTypes } from "sequelize";

// Get employee by ID
export const getEmployeeById = async (req, res) => {
  const { id } = req.params;
  try {
    const [employee] = await sequelize.query(
        `SELECT 
            e.id,
            e.name,
            e.email,
            e.phone,
            e.join_date,
            e.position,
            d.name AS department_name
        FROM employees e
        LEFT JOIN departments d ON e.department_id = d.id
        WHERE e.id = :id`,
        {
            replacements: { id },
            type: QueryTypes.SELECT
        }
    );

    if (!employee) return res.status(404).json({ message: "Employee not found" });

    res.json(employee);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
};

// Update profile (only 4 fields)
export const updateProfile = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, join_date } = req.body;

  if (!name?.trim()) return res.status(400).json({ message: "Name is required" });
  if (!/\S+@\S+\.\S+/.test(email)) return res.status(400).json({ message: "Invalid email" });

  try {
    await sequelize.query(
      `UPDATE employees
       SET name = :name,
           email = :email,
           phone = :phone,
           join_date = :join_date
       WHERE id = :id`,
      {
        replacements: {
          id,
          name: name.trim(),
          email: email.toLowerCase(),
          phone: phone || null,
          join_date: join_date || null
        },
        type: QueryTypes.UPDATE
      }
    );

    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
};