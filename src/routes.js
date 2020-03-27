import { Router } from 'express';

import SessionController from './app/controllers/SessionController';
import FunctionsController from './app/controllers/FunctionsController';
import VolunteersController from './app/controllers/VolunteersController';
import GroupsController from './app/controllers/GroupsController';
import VolunteersFunctionsController from './app/controllers/VolunteersFunctionsController';
import VolunteersGroupsController from './app/controllers/VolunteersGroupsController';
import Ministries from './app/controllers/MinistriesController';
import VolunteersMinistries from './app/controllers/VolunteersMinistriesController';
import PeriodsController from './app/controllers/PeriodsController';

import AuthMiddleware from './app/middlewares/auth';
import AdminMiddleware from './app/middlewares/adm';

const routes = new Router();

/** Rotas para Voluntários */
routes.post('/volunteers', VolunteersController.store);

/** Rota para autenticação */
routes.post('/session', SessionController.store);

/** Rotas para cadastro das funcões do usuário */
routes.post('/volunteers-functions', VolunteersFunctionsController.store);
routes.get('/volunteers-functions/:id', VolunteersFunctionsController.index);

/** Rotas que precisam de autenticação */
routes.use(AuthMiddleware);

routes.get('/volunteers', VolunteersController.index);
routes.get('/volunteers/:id', VolunteersController.index);
routes.put('/volunteers', VolunteersController.update);

/** Rotas que precisam de autenticação e administrador */
routes.use(AdminMiddleware);

/** Rotas para Funções */
routes.get('/funcoes', FunctionsController.index);
routes.post('/funcoes', FunctionsController.store);
routes.put('/funcoes/:id', FunctionsController.update);
routes.delete('/funcoes/:id', FunctionsController.delete);

/** Rotas para Grupos  */
routes.post('/groups', GroupsController.store);
routes.get('/groups', GroupsController.index);
routes.get('/groups/:id', GroupsController.index);
routes.put('/groups/:id', GroupsController.update);
routes.delete('/groups/:id', GroupsController.delete);

/** Rotas para funções dos voluntários */
routes.get('/volunteers-functions', VolunteersFunctionsController.index);
routes.put('/volunteers-functions/:id', VolunteersFunctionsController.update);
routes.delete(
  '/volunteers-functions/:id',
  VolunteersFunctionsController.delete
);

/** Rotas para grupo dos voluntários */
routes.post('/volunteers-groups', VolunteersGroupsController.store);
routes.get('/volunteers-groups/:id', VolunteersGroupsController.index);
routes.get('/volunteers-groups', VolunteersGroupsController.index);
routes.put('/volunteers-groups/:id', VolunteersGroupsController.update);
routes.delete('/volunteers-groups/:id', VolunteersGroupsController.delete);

/** Rotas para ministérios */
routes.post('/ministries', Ministries.store);
routes.get('/ministries', Ministries.index);
routes.get('/ministries/:id', Ministries.index);
routes.put('/ministries/:id', Ministries.update);
routes.delete('/ministries/:id', Ministries.delete);

/** Rotas para voluntários nos ministérios */
routes.post('/volunteers-ministries', VolunteersMinistries.store);
routes.get('/volunteers-ministries/:id', VolunteersMinistries.index);
routes.put('/volunteers-ministries/:id', VolunteersMinistries.update);
routes.delete('/volunteers-ministries', VolunteersMinistries.delete);

/** Rotas para períodos */
routes.post('/periods', PeriodsController.store);
routes.get('/periods', PeriodsController.index);
routes.get('/periods/:id', PeriodsController.index);
routes.put('/periods/:id', PeriodsController.update);
routes.delete('/periods/:id', PeriodsController.delete);

export default routes;
