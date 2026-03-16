const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tasks', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    assigned_to: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'employees',
        key: 'id'
      }
    },
    assigned_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'employees',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.ENUM('pending','in_progress','completed'),
      allowNull: true,
      defaultValue: "pending"
    },
    priority: {
      type: DataTypes.ENUM('low','medium','high'),
      allowNull: true,
      defaultValue: "medium"
    },
    due_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'tasks',
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
        name: "assigned_by",
        using: "BTREE",
        fields: [
          { name: "assigned_by" },
        ]
      },
      {
        name: "idx_tasks_employee",
        using: "BTREE",
        fields: [
          { name: "assigned_to" },
        ]
      },
    ]
  });
};
