// controllers/employeeController.js
import { sequelize } from "../config/sequelize.js";
import { QueryTypes } from "sequelize";

/* GET ALL EMPLOYEES */
export const getEmployees = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || "";
  const offset = (page - 1) * limit;

  const baseQuery = ` 
    FROM employees e 
    LEFT JOIN departments d ON e.department_id = d.id
    LEFT JOIN users u ON e.user_id = u.id 
  `;
  let where = "";
  let replacements = {};

  if (search) {
    where = `WHERE e.name LIKE :search`;
    replacements.search = `%${search}%`;
  }

  try {
    const employees = await sequelize.query(
      `SELECT e.id, e.name, e.email, u.role, e.phone, e.position, e.department_id, e.basic_salary, d.name AS department_name, e.join_date, e.created_at
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
    res.status(500).json({ message: "Database error" });
  }
};

/* GET SINGLE EMPLOYEE */
export const getEmployeeById = async (req, res) => {
  const { id } = req.params;
  try {
    const employee = await sequelize.query(
      `SELECT e.id, e.name, e.email, e.phone, e.position, e.department_id, e.basic_salary, d.name AS department_name, e.join_date
       FROM employees e LEFT JOIN departments d ON e.department_id = d.id WHERE e.id = :id`,
      { replacements: { id }, type: QueryTypes.SELECT }
    );

    if (!employee.length) return res.status(404).json({ message: "Employee not found" });

    res.json(employee[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
};

/* ADD EMPLOYEE */
export const addEmployee = async (req, res) => {
  const { name, email, phone, position, department_id, join_date, basic_salary } = req.body;
  if (!name || !email) return res.status(400).json({ message: "Name and Email are required" });

  try {
    const result = await sequelize.query(
      `INSERT INTO employees (name,email,phone,position,department_id,join_date,basic_salary)
       VALUES (:name, :email, :phone, :position, :department_id, :join_date, :basic_salary)`,
      { replacements: { name, email, phone, position, department_id, join_date, basic_salary }, type: QueryTypes.INSERT }
    );

    res.status(201).json({ message: "Employee created successfully", employeeId: result[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
};

/* UPDATE EMPLOYEE */
export const updateEmployee = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, position, department_id, join_date, basic_salary } = req.body;

  try {
    await sequelize.query(
      `UPDATE employees SET name=:name, email=:email, phone=:phone, position=:position, department_id=:department_id, join_date=:join_date, basic_salary=:basic_salary WHERE id=:id`,
      { replacements: { id, name, email, phone, position, department_id, join_date, basic_salary }, type: QueryTypes.UPDATE }
    );
    res.json({ message: "Employee updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
};

/* DELETE EMPLOYEE */
export const deleteEmployee = async (req, res) => {
  const { id } = req.params;
  try {
    await sequelize.query(`DELETE FROM employees WHERE id=:id`, { replacements: { id }, type: QueryTypes.DELETE });
    res.json({ message: "Employee deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
};

/* GET TEAM EMPLOYEES (Manager) */
export const getTeamEmployees = async (req, res) => {
  const managerId = req.user.employee_id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || "";
  const offset = (page - 1) * limit;

  let where = "WHERE e.manager_id = :managerId";
  let replacements = { managerId, limit, offset };

  if (search) {
    where += " AND e.name LIKE :search";
    replacements.search = `%${search}%`;
  }

  try {
    const employees = await sequelize.query(
      `SELECT e.id, e.name, e.email, e.phone, e.position, e.department_id, e.basic_salary, d.name AS department_name, e.join_date, e.created_at
       FROM employees e 
       LEFT JOIN departments d ON e.department_id = d.id 
       ${where} 
       ORDER BY e.id DESC 
       LIMIT :limit OFFSET :offset`,
      { replacements, type: QueryTypes.SELECT }
    );

    const countResult = await sequelize.query(
      `SELECT COUNT(*) AS total FROM employees e ${where}`,
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
    res.status(500).json({ message: "Database error" });
  }
};