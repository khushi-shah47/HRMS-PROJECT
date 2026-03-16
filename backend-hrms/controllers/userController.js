import db from "../config/db.js";

export const addUser = (req, res) => {

  const { username, email, password, role, department_id } = req.body;

  // Step 1: create employee first
  const employeeSql = `
    INSERT INTO employees (name, department_id)
    VALUES (?, ?)
  `;

  db.query(employeeSql, [username, department_id || null], (empErr, empResult) => {

    if (empErr) return res.status(500).json(empErr);

    const employeeId = empResult.insertId;

    // Step 2: create user linked with employee
    const userSql = `
      INSERT INTO users (username, email, password, role, employee_id)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
      userSql,
      [username, email, password, role, employeeId],
      (userErr, userResult) => {

        if (userErr) return res.status(500).json(userErr);

        res.json({
          message: "User and Employee created successfully",
          userId: userResult.insertId,
          employeeId: employeeId
        });

      }
    );

  });

};

export const getUsers = (req, res) => {

  const sql = `
  SELECT 
    u.id,
    u.username,
    u.email,
    u.role,
    e.name AS employee_name,
    d.name AS department_name
  FROM users u
  LEFT JOIN employees e ON u.employee_id = e.id
  LEFT JOIN departments d ON e.department_id = d.id
  ORDER BY u.id DESC
  `;

  db.query(sql, (err, result) => {

    if (err) {
      console.error(err);
      return res.status(500).json(err);
    }

    res.json(result);

  });

};

export const updateUser = (req, res) => {

  const id = req.params.id;
  const { username, email, role, department_id } = req.body;

  // Step 1: get employee_id from users table
  const getEmployeeSql = "SELECT employee_id FROM users WHERE id = ?";

  db.query(getEmployeeSql, [id], (err, result) => {

    if (err) return res.status(500).json(err);

    if (result.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const employeeId = result[0].employee_id;

    // Step 2: update users table
    const updateUserSql = `
      UPDATE users 
      SET username = ?, email = ?, role = ?
      WHERE id = ?
    `;

    db.query(updateUserSql, [username, email, role, id], (err2) => {

      if (err2) return res.status(500).json(err2);

      // Step 3: update employee department
      const updateEmployeeSql = `
        UPDATE employees
        SET department_id = ?
        WHERE id = ?
      `;

      db.query(updateEmployeeSql, [department_id || null, employeeId], (err3) => {

        if (err3) return res.status(500).json(err3);

        res.json({
          message: "User updated successfully"
        });

      });

    });

  });

};

export const deleteUser = (req, res) => {

  const id = req.params.id;

  db.query(
    "DELETE FROM users WHERE id = ?",
    [id],
    (err) => {

      if (err) return res.status(500).json(err);

      res.json({
        message: "User deleted"
      });

    }
  );

};