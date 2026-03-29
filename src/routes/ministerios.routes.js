import { Router } from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import MinisteriosController from '../controllers/ministerios.controller.js';
import validateMiddleware from '../middlewares/schema-validator.middleware.js';
import { url } from '../validators/url.validator.js';
import * as ministerioValidator from '../validators/ministerios.validator.js';

const ministeriosRouter = new Router();

ministeriosRouter.post(
  '/:url/ministerios',
  validateMiddleware(url, 'params'),
  validateMiddleware(ministerioValidator.cadastrarMinisterioSchemma),
  authMiddleware,
  MinisteriosController.cadastrarMinisterio
);

ministeriosRouter.get(
  '/:url/ministerios',
  validateMiddleware(url, 'params'),
  authMiddleware,
  MinisteriosController.buscarMinisterios
);

ministeriosRouter.post(
  '/:url/ministerios/:ministerioId',
  validateMiddleware(ministerioValidator.MinisterioSchemaParams, 'params'),
  validateMiddleware(ministerioValidator.cadastrarMembrosSchema),
  authMiddleware,
  MinisteriosController.cadastrarMembroMinisterio
);

ministeriosRouter.get(
  '/:url/ministerios/:ministerioId',
  validateMiddleware(ministerioValidator.MinisterioSchemaParams, 'params'),
  authMiddleware,
  MinisteriosController.buscarMembrosMinisterio
);

export default ministeriosRouter;
