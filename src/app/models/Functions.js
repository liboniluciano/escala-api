import Sequelize, { Model } from 'sequelize';

class Functions extends Model {
  static init(sequelize) {
    super.init(
      {
        id_category: Sequelize.INTEGER,
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
    this.belongsTo(models.Categories, { foreignKey: 'id_category' });
  }
}

export default Functions;
