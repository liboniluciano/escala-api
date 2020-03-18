import Sequelize, { Model } from 'sequelize';

class Groups extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        volunteer_id_created: Sequelize.INTEGER,
        desatived_at: Sequelize.DATE,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Volunteers, { foreignKey: 'volunteer_id_created' });
  }
}

export default Groups;
