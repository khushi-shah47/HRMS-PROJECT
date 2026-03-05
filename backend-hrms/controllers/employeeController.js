// import db from "../config/db.js";

// /* GET ALL */
// export const getEmployees = (req, res) => {
//   const page = parseInt(req.query.page) || 1;
//   const limit = parseInt(req.query.limit) || 10;
//   const department = req.query.department;
//   const search = req.query.search;
//   const sort = req.query.sort;

//   const offset = (page - 1) * limit;

//   let baseQuery = "FROM employees";
//   let whereClauses = [];
//   let queryParams = [];

//   // Department filter
//   if (department) {
//     whereClauses.push("department = ?");
//     queryParams.push(department);
//   }

//   // Search by name
//   if (search) {
//     whereClauses.push("name LIKE ?");
//     queryParams.push(`%${search}%`);
//   }

//   // Add WHERE if needed
//   if (whereClauses.length > 0) {
//     baseQuery += " WHERE " + whereClauses.join(" AND ");
//   }

//   // Sorting (safe whitelist)
//   let orderBy = "";
//   const allowedSortFields = ["id", "name", "email"];
//   if (sort && allowedSortFields.includes(sort)) {
//     orderBy = ` ORDER BY ${sort} ASC`;
//   }

//   const dataQuery = `SELECT * ${baseQuery}${orderBy} LIMIT ? OFFSET ?`;
//   const countQuery = `SELECT COUNT(*) as total ${baseQuery}`;

//   // Add pagination params
//   const finalParams = [...queryParams, limit, offset];

//   db.query(dataQuery, finalParams, (err, results) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).json(err);
//     }

//     db.query(countQuery, queryParams, (err2, countResult) => {
//       if (err2) {
//         console.error(err2);
//         return res.status(500).json(err2);
//       }

//       const total = countResult[0].total;

//       res.json({
//         data: results,
//         currentPage: page,
//         totalPages: Math.ceil(total / limit),
//         totalEmployees: total
//       });
//     });
//   });
// };

// /* GET SINGLE */
// export const getEmployeeById = (req, res) => {
//   const { id } = req.params;

//   db.query("SELECT * FROM employees WHERE id = ?", [id], (err, result) => {
//     if (err) return res.status(500).json(err);
//     res.json(result[0]);
//   });
// };

// /* CREATE */
// export const addEmployee = (req, res) => {

//   if (!req.body) {
//     return res.status(400).json({ message: "Request body missing" });
//   }

//   const { name, email, department } = req.body;

//   if (!name || !email || !department) {
//     return res.status(400).json({ message: "All fields are required" });
//   }

//   const sql = "INSERT INTO employees (name, email, department) VALUES (?, ?, ?)";

//   db.query(sql, [name, email, department], (err, result) => {
//     if (err) {console.error(err); return res.status(500).json(err);}

//     res.status(201).json({ message: "Employee created successfully" });
//   });
// };

// /* UPDATE */
// export const updateEmployee = (req, res) => {
//   const { id } = req.params;
//   const { name, email, department } = req.body;

//   const sql = `
//     UPDATE employees
//     SET name = ?, email = ?, department = ?
//     WHERE id = ?
//   `;

//   db.query(sql, [name, email, department, id], (err, result) => {
//     if (err) return res.status(500).json(err);

//     res.json({ message: "Employee updated successfully" });
//   });
// };

// /* DELETE */
// export const deleteEmployee = (req, res) => {
//   const { id } = req.params;

//   db.query("DELETE FROM employees WHERE id = ?", [id], (err, result) => {
//     if (err) return res.status(500).json(err);

//     res.json({ message: "Employee deleted successfully" });
//   });
// };

import db from "../config/db.js";

/* GET ALL WITH PAGINATION + DEPARTMENT JOIN */
export const getEmployees = (req, res) => {

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search;

  const offset = (page - 1) * limit;

  let baseQuery = `
    FROM employees e
    LEFT JOIN departments d ON e.department_id = d.id
  `;

  let where = [];
  let params = [];

  if (search) {
    where.push("e.name LIKE ?");
    params.push(`%${search}%`);
  }

  if (where.length) {
    baseQuery += " WHERE " + where.join(" AND ");
  }

  const dataQuery = `
    SELECT e.*, d.name AS department_name
    ${baseQuery}
    ORDER BY e.id DESC
    LIMIT ? OFFSET ?
  `;

  const countQuery = `SELECT COUNT(*) as total ${baseQuery}`;

  db.query(dataQuery, [...params, limit, offset], (err, data) => {
    if (err) return res.status(500).json(err);

    db.query(countQuery, params, (err2, count) => {
      if (err2) return res.status(500).json(err2);

      res.json({
        data,
        currentPage: page,
        totalPages: Math.ceil(count[0].total / limit),
        totalEmployees: count[0].total
      });
    });
  });
};


/* GET SINGLE */
export const getEmployeeById = (req, res) => {

  const { id } = req.params;

  db.query(
    `SELECT e.*, d.name AS department_name
     FROM employees e
     LEFT JOIN departments d ON e.department_id = d.id
     WHERE e.id = ?`,
    [id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result[0]);
    }
  );
};


/* CREATE */
export const addEmployee = (req, res) => {

  const { name, email, phone, position, department_id, join_date } = req.body;

  const sql = `
    INSERT INTO employees
    (name,email,phone,position,department_id,join_date)
    VALUES (?,?,?,?,?,?)
  `;

  db.query(sql, [name,email,phone,position,department_id,join_date], (err,result) => {

    if (err) return res.status(500).json(err);

    res.status(201).json({
      message: "Employee added",
      id: result.insertId
    });

  });
};


/* UPDATE */
export const updateEmployee = (req,res) => {

  const { id } = req.params;
  const { name,email,phone,position,department_id,join_date } = req.body;

  const sql = `
    UPDATE employees
    SET name=?,email=?,phone=?,position=?,department_id=?,join_date=?
    WHERE id=?
  `;

  db.query(sql,[name,email,phone,position,department_id,join_date,id],(err)=>{

    if(err) return res.status(500).json(err);

    res.json({ message:"Employee updated" });

  });

};


/* DELETE */
export const deleteEmployee = (req,res)=>{

  const { id } = req.params;

  db.query("DELETE FROM employees WHERE id=?", [id], (err)=>{

    if(err) return res.status(500).json(err);

    res.json({ message:"Employee deleted" });

  });

};