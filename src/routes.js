import { Router } from 'express';

import FunctionsController from './app/controllers/FunctionsController';

const routes = new Router();

/** Routes para Funções */
routes.get('/funcoes', FunctionsController.index);
routes.post('/funcoes', FunctionsController.store);
routes.put('/funcoes/:id', FunctionsController.update);
routes.delete('/funcoes/:id', FunctionsController.delete);

export default routes;
