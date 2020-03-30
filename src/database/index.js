import Sequelize from 'sequelize';

import databaseConfig from '../config/database';

import Functions from '../app/models/Functions';
import Volunteers from '../app/models/Volunteers';
import Groups from '../app/models/Groups';
import VolunteersFunctions from '../app/models/VolunteersFunctions';
import VolunteersGroups from '../app/models/VolunteersGroups';
import Ministries from '../app/models/Ministries';
import VolunteersMinistries from '../app/models/VolunteersMinistries';
import Periods from '../app/models/Periods';
import Scales from '../app/models/Scales';
import Categories from '../app/models/Categories';

const models = [
  Functions,
  Volunteers,
  Groups,
  VolunteersFunctions,
  VolunteersGroups,
  Ministries,
  VolunteersMinistries,
  Periods,
  Scales,
  Categories,
];

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
