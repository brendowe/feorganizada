import { Router } from 'express';
import authToken from '../middlewares/authToken.js';
import ministeriosController from '../controllers/ministerios.controller.js';

const ministeriosRouter = new Router();

ministeriosRouter.post('/:url/ministerios', authToken, ministeriosController.cadastrarMinisterio);

ministeriosRouter.get('/:url/ministerios', authToken, ministeriosController.buscarMinisterios);

ministeriosRouter.post('/:url/ministerios/:ministerioId', authToken, ministeriosController.cadastrarMembroMinisterio);

ministeriosRouter.get('/:url/ministerios/:ministerioId', authToken, ministeriosController.buscarMembrosMinisterio);

export default ministeriosRouter;
