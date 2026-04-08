import { sequelize } from "../config/sequelize.js";
import { QueryTypes } from "sequelize";

// Get employee by ID
export const getEmployeeById = async (req, res) => {
  const { id } = req.params;
  try {
    const [employee] = await sequelize.query(
        `SELECT 
            e.*,
            u.email,
            u.role,
            d.name AS department_name
        FROM employees e
        LEFT JOIN users u ON e.user_id = u.id
        LEFT JOIN departments d ON e.department_id = d.id
        WHERE u.id = :id`,
        {
            replacements: { id },
            type: QueryTypes.SELECT
        }
    );

    if (!employee) {
      // Fallback to user data if no employee record
      const [user] = await sequelize.query(
        `SELECT id, username, email, role FROM users WHERE id = :id`,
        { replacements: { id }, type: QueryTypes.SELECT }
      );
      if (!user) return res.status(404).json({ message: "User not found" });
      
      employee = {
        id: null,
        name: user.username,
        email: user.email,
        phone: null,
        position: user.role.charAt(0).toUpperCase() + user.role.slice(1),
        department_name: null,
        profile_image: null,
        role: user.role,
        ...user
      };
    }

    res.json(employee);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
};

// Update profile (only 4 fields)
export const updateProfile = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;

  if (!name?.trim()) return res.status(400).json({ message: "Name is required" });
  if (!/\S+@\S+\.\S+/.test(email)) return res.status(400).json({ message: "Invalid email" });

  try {
    await sequelize.query(
      `UPDATE users
       SET username = :name,
           email = :email
       WHERE id = :id`,
      {
        replacements: {
          id,
          name: name.trim(),
          email: email.toLowerCase()
        },
        type: QueryTypes.UPDATE
      }
    );

    // Check if employee exists, if not create
    const [existingEmp] = await sequelize.query(
      `SELECT id FROM employees WHERE user_id = :id`,
      { replacements: { id }, type: QueryTypes.SELECT }
    );
    if (!existingEmp) {
      await sequelize.query(
        `INSERT INTO employees (name, email, phone, user_id, position) 
         VALUES (:name, :email, :phone, :id, 'Staff')`,
        {
          replacements: {
            id,
            name: name.trim(),
            email: email.toLowerCase(),
            phone: phone || null
          },
          type: QueryTypes.INSERT
        }
      );
    } else {
      await sequelize.query(
        `UPDATE employees
         SET name = :name,
             email = :email,
             phone = :phone
         WHERE user_id = :id`,
        {
          replacements: {
            id,
            name: name.trim(),
            email: email.toLowerCase(),
            phone: phone || null
          },
          type: QueryTypes.UPDATE
        }
      );
    }

    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
};