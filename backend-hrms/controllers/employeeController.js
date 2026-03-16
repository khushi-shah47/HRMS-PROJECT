// controllers/employeeController.js
import { sequelize } from "../config/sequelize.js";
import { QueryTypes } from "sequelize";

/* GET ALL EMPLOYEES */
export const getEmployees = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || "";
  const offset = (page - 1) * limit;

  const baseQuery = `FROM employees e LEFT JOIN departments d ON e.department_id = d.id`;
  let where = "";
  let replacements = {};

  if (search) {
    where = `WHERE e.name LIKE :search`;
    replacements.search = `%${search}%`;
  }

  try {
    const employees = await sequelize.query(
      `SELECT e.id, e.name, e.email, e.phone, e.position, e.department_id, d.name AS department_name, e.join_date, e.created_at
       ${baseQuery} ${where} ORDER BY e.id DESC LIMIT :limit OFFSET :offset`,
      { replacements: { ...replacements, limit, offset }, type: QueryTypes.SELECT }
    );

    const countResult = await sequelize.query(
      `SELECT COUNT(*) AS total ${baseQuery} ${where}`,
      { replacements, type: QueryTypes.SELECT }
    );

    res.json({
      employees,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(countResult[0].total / limit),
        totalEmployees: countResult[0].total
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed Try Again" });
  }
};

/* GET SINGLE EMPLOYEE */
export const getEmployeeById = async (req, res) => {
  const { id } = req.params;
  try {
    const employee = await sequelize.query(
      `SELECT e.id, e.name, e.email, e.phone, e.position, e.department_id, d.name AS department_name, e.join_date
       FROM employees e LEFT JOIN departments d ON e.department_id = d.id WHERE e.id = :id`,
      { replacements: { id }, type: QueryTypes.SELECT }
    );

    if (!employee.length) return res.status(404).json({ message: "Employee not found" });

    res.json(employee[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed Try Again" });
  }
};

/* ADD EMPLOYEE */
export const addEmployee = async (req, res) => {
  const { name, email, phone, position, department_id, join_date } = req.body;
  if (!name || !email || !phone || !position || !department_id || !join_date) return res.status(400).json({ message: "All fields Are Required" });

  try {
    const result = await sequelize.query(
      `INSERT INTO employees (name,email,phone,position,department_id,join_date)
       VALUES (:name, :email, :phone, :position, :department_id, :join_date)`,
      { replacements: { name, email, phone, position, department_id, join_date }, type: QueryTypes.INSERT }
    );

    res.status(201).json({ message: "Employee Added successfully", employeeId: result[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed Try Again" });
  }
};

/* UPDATE EMPLOYEE */
export const updateEmployee = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, position, department_id, join_date } = req.body;

  try {
    await sequelize.query(
      `UPDATE employees SET name=:name, email=:email, phone=:phone, position=:position, department_id=:department_id, join_date=:join_date WHERE id=:id`,
      { replacements: { id, name, email, phone, position, department_id, join_date }, type: QueryTypes.UPDATE }
    );
    res.json({ message: "Employee updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed Try Again" });
  }
};

/* DELETE EMPLOYEE */
export const deleteEmployee = async (req, res) => {
  const { id } = req.params;
  
  // Only admin/hr can delete
  if (!['admin', 'hr'].includes(req.user.role)) {
    return res.status(403).json({ message: "Only Admin/HR can delete employees" });
  }
  
  const t = await sequelize.transaction();
  try {
    // 1. Delete salaries
    await sequelize.query(`DELETE FROM salaries WHERE employee_id = :id`, { 
      replacements: { id }, 
      type: QueryTypes.DELETE,
      transaction: t
    });
    
    // 2. Update tasks (nullify assigned_to/assigned_by)
    await sequelize.query(`UPDATE tasks SET assigned_to = NULL, assigned_by = NULL WHERE assigned_to = :id OR assigned_by = :id`, {
      replacements: { id },
      type: QueryTypes.UPDATE,
      transaction: t
    });
    
    // 3. Delete users linked to this employee
    await sequelize.query(`DELETE FROM users WHERE employee_id = :id`, {
      replacements: { id },
      type: QueryTypes.DELETE,
      transaction: t
    });
    
    // 4. Delete employee (cascades to attendance, leaves, wfh, tasks comments)
    await sequelize.query(`DELETE FROM employees WHERE id = :id`, { 
      replacements: { id }, 
      type: QueryTypes.DELETE,
      transaction: t 
    });
    
    await t.commit();
    res.json({ message: "Employee and related records deleted successfully" });
  } catch (err) {
    await t.rollback();
    console.error('Delete employee error:', err);
    res.status(500).json({ message: "Failed to delete employee: " + err.message });
  }
};
