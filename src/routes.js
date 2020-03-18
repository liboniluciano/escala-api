import { Router } from 'express';

import SessionController from './app/controllers/SessionController';
import FunctionsController from './app/controllers/FunctionsController';
import VolunteersController from './app/controllers/VolunteersController';
import GroupsController from './app/controllers/GroupsController';

import AuthMiddleware from './app/middlewares/auth';
import AdminMiddleware from './app/middlewares/adm';

const routes = new Router();

/** Rotas para Voluntários */
routes.post('/volunteers', VolunteersController.store);

/** Rota para autenticação */
routes.post('/session', SessionController.store);

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

export default routes;
