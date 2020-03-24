import Sequelize, { Model } from 'sequelize';

class VolunteersMinistries extends Model {
  static init(sequelize) {
    super.init(
      {
        id_volunteer: Sequelize.INTEGER,
        id_ministry: Sequelize.INTEGER,
        flg_leader: Sequelize.BOOLEAN,
        disabled_at: Sequelize.DATE,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Volunteers, { foreignKey: 'id_volunteer' });
    this.belongsTo(models.Ministries, { foreignKey: 'id_ministry' });
  }
}

export default VolunteersMinistries;
