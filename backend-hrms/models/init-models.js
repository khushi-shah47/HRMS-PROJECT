var DataTypes = require("sequelize").DataTypes;
var _attendance = require("./attendance");
var _departments = require("./departments");
var _employees = require("./employees");
var _holidays = require("./holidays");
var _leaves = require("./leaves");
var _policies = require("./policies");
var _salaries = require("./salaries");
var _task_attachments = require("./task_attachments");
var _task_comments = require("./task_comments");
var _tasks = require("./tasks");
var _users = require("./users");
var _wfh_requests = require("./wfh_requests");

function initModels(sequelize) {
  var attendance = _attendance(sequelize, DataTypes);
  var departments = _departments(sequelize, DataTypes);
  var employees = _employees(sequelize, DataTypes);
  var holidays = _holidays(sequelize, DataTypes);
  var leaves = _leaves(sequelize, DataTypes);
  var policies = _policies(sequelize, DataTypes);
  var salaries = _salaries(sequelize, DataTypes);
  var task_attachments = _task_attachments(sequelize, DataTypes);
  var task_comments = _task_comments(sequelize, DataTypes);
  var tasks = _tasks(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);
  var wfh_requests = _wfh_requests(sequelize, DataTypes);

  employees.belongsTo(departments, { as: "department", foreignKey: "department_id"});
  departments.hasMany(employees, { as: "employees", foreignKey: "department_id"});
  attendance.belongsTo(employees, { as: "employee", foreignKey: "employee_id"});
  employees.hasMany(attendance, { as: "attendances", foreignKey: "employee_id"});
  leaves.belongsTo(employees, { as: "employee", foreignKey: "employee_id"});
  employees.hasMany(leaves, { as: "leaves", foreignKey: "employee_id"});
  salaries.belongsTo(employees, { as: "employee", foreignKey: "employee_id"});
  employees.hasMany(salaries, { as: "salaries", foreignKey: "employee_id"});
  task_comments.belongsTo(employees, { as: "employee", foreignKey: "employee_id"});
  employees.hasMany(task_comments, { as: "task_comments", foreignKey: "employee_id"});
  tasks.belongsTo(employees, { as: "assigned_to_employee", foreignKey: "assigned_to"});
  employees.hasMany(tasks, { as: "tasks", foreignKey: "assigned_to"});
  tasks.belongsTo(employees, { as: "assigned_by_employee", foreignKey: "assigned_by"});
  employees.hasMany(tasks, { as: "assigned_by_tasks", foreignKey: "assigned_by"});
  users.belongsTo(employees, { as: "employee", foreignKey: "employee_id"});
  employees.hasMany(users, { as: "users", foreignKey: "employee_id"});
  wfh_requests.belongsTo(employees, { as: "employee", foreignKey: "employee_id"});
  employees.hasMany(wfh_requests, { as: "wfh_requests", foreignKey: "employee_id"});
  task_attachments.belongsTo(tasks, { as: "task", foreignKey: "task_id"});
  tasks.hasMany(task_attachments, { as: "task_attachments", foreignKey: "task_id"});
  task_comments.belongsTo(tasks, { as: "task", foreignKey: "task_id"});
  tasks.hasMany(task_comments, { as: "task_comments", foreignKey: "task_id"});

  return {
    attendance,
    departments,
    employees,
    holidays,
    leaves,
    policies,
    salaries,
    task_attachments,
    task_comments,
    tasks,
    users,
    wfh_requests,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
