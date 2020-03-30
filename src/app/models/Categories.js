import Sequelize, { Model } from 'sequelize';

class Categories extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        disabled_at: Sequelize.DATE,
      },
      {
        sequelize,
      }
    );

    return this;
  }
}

export default Categories;
