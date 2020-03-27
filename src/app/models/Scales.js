import Sequelize, { Model } from 'sequelize';

class Scales extends Model {
  static init(sequelize) {
    super.init(
      {
        id_group: Sequelize.INTEGER,
        id_period: Sequelize.INTEGER,
        id_volunteer_create: Sequelize.INTEGER,
        title: Sequelize.STRING,
        date: Sequelize.DATE,
        note: Sequelize.STRING,
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
    this.belongsTo(models.Volunteers, { foreignKey: 'id_volunteer_create' });
  }
}

export default Scales;
