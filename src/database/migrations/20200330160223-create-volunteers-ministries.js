module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('volunteers_ministries', {
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
        onDelete: 'SET NULL',
        allowNull: true,
      },
      id_ministry: {
        type: Sequelize.INTEGER,
        references: { model: 'ministries', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: true,
      },
      leader: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      disabled_at: {
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
    return queryInterface.dropTable('volunteers_ministries');
  },
};
