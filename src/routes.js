import { Router } from 'express';

import FunctionsController from './app/controllers/FunctionsController';
import VolunteersController from './app/controllers/VolunteersController';

const routes = new Router();

/** Rotas para Funções */
routes.get('/funcoes', FunctionsController.index);
routes.post('/funcoes', FunctionsController.store);
routes.put('/funcoes/:id', FunctionsController.update);
routes.delete('/funcoes/:id', FunctionsController.delete);

/** Rotas para Voluntários */
routes.post('/volunteers', VolunteersController.store);
routes.get('/volunteers', VolunteersController.index);
routes.get('/volunteers/:id', VolunteersController.index);

export default routes;
