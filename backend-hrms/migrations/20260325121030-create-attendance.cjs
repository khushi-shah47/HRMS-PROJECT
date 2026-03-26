'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Step 1: Create the table WITHOUT the foreign key
    await queryInterface.createTable('attendance', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      employee_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'employees',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      time_in: {
        type: Sequelize.DATE,
        allowNull: true
      },
      time_out: {
        type: Sequelize.DATE,
        allowNull: true
      },
      work_type: {
        type: Sequelize.ENUM('present','wfh','leave'),
        defaultValue: 'present'
      },
      total_hours: {
        type: Sequelize.DECIMAL(5,2),
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Step 3: Add UNIQUE constraint
    await queryInterface.addConstraint('attendance', {
      fields: ['employee_id','date'],
      type: 'unique',
      name: 'unique_attendance'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('attendance');
  }
};