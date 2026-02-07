import { Router } from 'express';
import authToken from '../middlewares/authToken.js';
import usuariosController from '../controllers/usuarios.controller.js';
import schemaValidator from '../middlewares/schemaValidator.js';
import * as usuariosValidator from '../validators/usuarios.Validator.js';
import { url } from '../validators/url.Validator.js';

const usuariosRouter = new Router();

usuariosRouter.post(
  '/:url/membros',
  schemaValidator(url, 'params'), schemaValidator(usuariosValidator.cadastrarMembroSchema),
  authToken,
  usuariosController.cadastrarMembro
);

usuariosRouter.get(
  '/:url/membros',
  schemaValidator(url, 'params'),
  authToken,
  usuariosController.buscarMembros
);

usuariosRouter.get(
  '/:url/membros/:id',
  schemaValidator(usuariosValidator.buscarMembroSchemaParams, 'params'),
  authToken,
  usuariosController.buscarMembro
);

usuariosRouter.get(
  '/:url/aniversariantes/:mes',
  authToken, schemaValidator(usuariosValidator.buscarAniversariantesSchemaParams, 'params'),
  usuariosController.buscarAniversariantes
);

usuariosRouter.delete('/:url/membros/:id',
  schemaValidator(usuariosValidator.deletarMembroSchemaParams, 'params'),
  authToken,
  usuariosController.deletarMembro
);

export default usuariosRouter;
