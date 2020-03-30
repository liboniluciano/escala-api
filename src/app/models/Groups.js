import Sequelize, { Model } from 'sequelize';

class Groups extends Model {
  static init(sequelize) {
    super.init(
      {
        id_volunteer_created: Sequelize.INTEGER,
        id_ministry: Sequelize.INTEGER,
        name: Sequelize.STRING,
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
    this.belongsTo(models.Groups, { foreignKey: 'id_ministry' });
  }
}

export default Groups;
