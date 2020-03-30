module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('volunteers_functions', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      id_volunteer: {
        type: Sequelize.INTEGER,
        references: { model: 'volunteers', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false,
      },
      id_function: {
        type: Sequelize.INTEGER,
        references: { model: 'functions', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false,
      },
      desatived_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('volunteers_functions');
  },
};
