import { Router } from 'express';
import authToken from '../middlewares/authToken.js';
import ministeriosController from '../controllers/ministerios.controller.js';
import schemaValidator from '../middlewares/schemaValidator.js';
import { url } from '../validators/url.Validator.js';
import * as ministerioValidator from '../validators/ministerios.Validator.js';

const ministeriosRouter = new Router();

ministeriosRouter.post(
  '/:url/ministerios',
  schemaValidator(url, 'params'),
  schemaValidator(ministerioValidator.cadastrarMinisterioSchemma),
  authToken,
  ministeriosController.cadastrarMinisterio
);

ministeriosRouter.get(
  '/:url/ministerios',
  schemaValidator(url, 'params'),
  authToken,
  ministeriosController.buscarMinisterios
);

ministeriosRouter.post(
  '/:url/ministerios/:ministerioId', schemaValidator(ministerioValidator.MinisterioSchemaParams, 'params'), schemaValidator(ministerioValidator.cadastrarMembrosSchema),
  authToken,
  ministeriosController.cadastrarMembroMinisterio
);

ministeriosRouter.get(
  '/:url/ministerios/:ministerioId', schemaValidator(ministerioValidator.MinisterioSchemaParams, 'params'),
  authToken,
  ministeriosController.buscarMembrosMinisterio
);

export default ministeriosRouter;
