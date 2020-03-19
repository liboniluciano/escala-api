import Sequelize, { Model } from 'sequelize';

class VolunteersFunctions extends Model {
  static init(sequelize) {
    super.init(
      {
        id_volunteer: Sequelize.INTEGER,
        id_function: Sequelize.INTEGER,
        desatived_at: Sequelize.DATE,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Volunteers, { foreignKey: 'id_volunteer' });
    this.belongsTo(models.Functions, { foreignKey: 'id_function' });
  }
}

export default VolunteersFunctions;
