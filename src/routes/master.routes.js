import { Router } from 'express';
import MasterController from '../controllers/master.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import masterMiddleware from '../middlewares/master.middleware.js';
import validateMiddleware from '../middlewares/schema-validator.middleware.js';
import * as masterValidator from '../validators/master.validator.js';

const masterRouter = new Router();

masterRouter.post(
  '/:url/adm/:id',
  validateMiddleware(masterValidator.cadastroAdmSchemaParams, 'params'),
  validateMiddleware(masterValidator.cadastroAdmSchema),
  authMiddleware,
  masterMiddleware,
  MasterController.cadastrarAdm
);

masterRouter.patch(
  '/:url/adm/:login',
  validateMiddleware(masterValidator.autMasterParams, 'params'),
  validateMiddleware(masterValidator.novaSenhaAdmSchema),
  authMiddleware,
  masterMiddleware,
  MasterController.atualizarSenhaAdm
);

export default masterRouter;
