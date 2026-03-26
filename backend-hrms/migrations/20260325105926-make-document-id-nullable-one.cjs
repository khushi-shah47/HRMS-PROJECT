'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('test_tb', {
      id: {
        autoIncrement: true,
        type: Sequelize.INTEGER,
        primaryKey: true
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('test_tb');
  }
};