import { Router } from 'express';
import authToken from '../middlewares/authToken.js';
import usuariosController from '../controllers/usuarios.controller.js';
import ministeriosController from '../controllers/ministerios.controller.js';

const usuariosRouter = new Router();

usuariosRouter.post(
  '/:url/membros',
  authToken,
  usuariosController.cadastrarMembro
);
usuariosRouter.get(
  '/:url/membros',
  authToken,
  usuariosController.buscarMembros
);
usuariosRouter.get(
  '/:url/membros/:id',
  authToken,
  usuariosController.buscarMembro
);
usuariosRouter.get(
  '/:url/aniversariantes/:mes',
  authToken,
  usuariosController.buscarAniversariantes
);
usuariosRouter.post('/:url/ministerios', authToken, ministeriosController.cadastrarMinisterio);

usuariosRouter.get('/:url/ministerios', authToken, ministeriosController.buscarMinisterios);

usuariosRouter.post('/:url/ministerios/:ministerioId', authToken, ministeriosController.cadastrarMembroMinisterio);

export default usuariosRouter;
