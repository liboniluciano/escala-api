import Sequelize, { Model } from 'sequelize';

class Groups extends Model {
  static init(sequelize) {
    super.init(
      {
        id_volunteer_created: Sequelize.INTEGER,
        id_ministry: Sequelize.INTEGER,
        name: Sequelize.STRING,
        disabled_at: Sequelize.DATE,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Volunteers, { foreignKey: 'id_volunteer_created' });
    this.belongsTo(models.Groups, { foreignKey: 'id_ministry' });
  }
}

export default Groups;
