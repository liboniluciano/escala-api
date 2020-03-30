module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('scales', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      id_group: {
        type: Sequelize.INTEGER,
        references: { model: 'groups', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: true,
      },
      id_period: {
        type: Sequelize.INTEGER,
        references: { model: 'periods', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: true,
      },
      id_volunteer_created: {
        type: Sequelize.INTEGER,
        references: { model: 'volunteers', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: true,
      },
      id_ministery: {
        type: Sequelize.INTEGER,
        references: { model: 'ministries', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: true,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      observations: {
        type: Sequelize.STRING,
        allowNull: false,
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
    return queryInterface.dropTable('scales');
  },
};
