'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('salary_records', {
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
      month: {
        type: Sequelize.STRING(7),
        allowNull: false,
        comment: 'Format: YYYY-MM'
      },
      base_salary: {
        type: Sequelize.DECIMAL(10,2),
        defaultValue: 0.00
      },
      bonus: {
        type: Sequelize.DECIMAL(10,2),
        defaultValue: 0.00
      },
      deductions: {
        type: Sequelize.DECIMAL(10,2),
        defaultValue: 0.00
      },
      net_salary: {
        type: Sequelize.DECIMAL(10,2),
        // Sequelize doesn’t support generated columns directly in all versions
        // Will be calculated in app logic
      },
      notes: {
        type: Sequelize.TEXT
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    await queryInterface.addConstraint('salary_records', {
      fields: ['employee_id','month'],
      type: 'unique',
      name: 'unique_salary_month'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('salary_records');
  }
};