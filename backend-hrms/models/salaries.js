const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('salaries', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    employee_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'employees',
        key: 'id'
      }
    },
    month: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    basic_salary: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true
    },
    allowance: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true,
      defaultValue: 0.00
    },
    bonus: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true,
      defaultValue: 0.00
    },
    working_days: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    present_days: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    leave_days: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    per_day_salary: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true
    },
    deduction: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true
    },
    final_salary: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('Pending', 'Generated', 'Paid'),
      allowNull: true,
      defaultValue: "Generated"
    }
  }, {
    sequelize,
    tableName: 'salaries',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "employee_id",
        using: "BTREE",
        fields: [
          { name: "employee_id" },
        ]
      },
    ]
  });
};
