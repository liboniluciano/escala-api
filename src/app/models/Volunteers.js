import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class Volunteers extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        telephone: Sequelize.INTEGER,
        admin: Sequelize.BOOLEAN,
        disabled: Sequelize.BOOLEAN,
        disabled_at: Sequelize.DATE,
      },
      {
        sequelize,
      }
    );

    this.addHook('beforeSave', async volunteers => {
      if (volunteers.password) {
        volunteers.password_hash = await bcrypt.hash(volunteers.password, 8);
      }
    });

    return this;
  }

  // Comparando duas senhas
  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

export default Volunteers;
