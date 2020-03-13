import Sequelize from 'sequelize';

import databaseConfig from '../config/database';

import Functions from '../app/models/Functions';
import Volunteers from '../app/models/Volunteers';

const models = [Functions, Volunteers];

class Database {
  constructor() {
    this.connection = new Sequelize(databaseConfig);

    this.init();
  }

  init() {
    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
