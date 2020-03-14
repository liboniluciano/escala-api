import { Router } from 'express';

import SessionController from './app/controllers/SessionController';
import FunctionsController from './app/controllers/FunctionsController';
import VolunteersController from './app/controllers/VolunteersController';

import AuthMiddleware from './app/middlewares/auth';

const routes = new Router();

/** Rotas para Voluntários */
routes.post('/volunteers', VolunteersController.store);

/** Rota para autenticação */
routes.post('/session', SessionController.store);

/** Rotas que precisam de autenticação */
routes.use(AuthMiddleware);

/** Rotas para Funções */
routes.get('/funcoes', FunctionsController.index);
routes.post('/funcoes', FunctionsController.store);
routes.put('/funcoes/:id', FunctionsController.update);
routes.delete('/funcoes/:id', FunctionsController.delete);

routes.get('/volunteers', VolunteersController.index);
routes.get('/volunteers/:id', VolunteersController.index);
// routes.put('/volunteers', VolunteersController.update);

export default routes;
