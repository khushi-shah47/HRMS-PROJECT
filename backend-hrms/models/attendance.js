const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('attendance', {
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
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    time_in: {
      type: DataTypes.DATE,
      allowNull: true
    },
    time_out: {
      type: DataTypes.DATE,
      allowNull: true
    },
    work_type: {
      type: DataTypes.ENUM('present','wfh','leave'),
      allowNull: true,
      defaultValue: "present"
    },
    total_hours: {
      type: DataTypes.DECIMAL(5,2),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'attendance',
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
        name: "unique_attendance",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "employee_id" },
          { name: "date" },
        ]
      },
    ]
  });
};
