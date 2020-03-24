import Sequelize, { Model } from 'sequelize';

class Ministries extends Model {
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

export default Ministries;
