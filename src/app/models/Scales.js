import Sequelize, { Model } from 'sequelize';

class Scales extends Model {
  static init(sequelize) {
    super.init(
      {
        id_group: Sequelize.INTEGER,
        id_period: Sequelize.INTEGER,
        id_volunteer_created: Sequelize.INTEGER,
        id_ministery: Sequelize.INTEGER,
        title: Sequelize.STRING,
        date: Sequelize.DATE,
        observations: Sequelize.STRING,
        disabled_at: Sequelize.DATE,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Groups, { foreignKey: 'id_group' });
    this.belongsTo(models.Periods, { foreignKey: 'id_period' });
    this.belongsTo(models.Volunteers, { foreignKey: 'id_volunteer_created' });
    this.belongsTo(models.Ministries, { foreignKey: 'id_ministery' });
  }
}

export default Scales;
