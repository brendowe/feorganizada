import { Router } from 'express';
import cadastroIgrejaController from '../controllers/cadastroIgreja.controller.js';
import authController from '../controllers/auth.controller.js';
import schemaValidator from '../middlewares/schemaValidator.js';
import { loginSchema } from '../validators/auth.validator.js';
import { cadastroSchema } from '../validators/auth.validator.js';
import { url } from '../validators/url.Validator.js';

const authRouter = new Router();

authRouter.post(
  '/cadastro',
  schemaValidator(cadastroSchema),
  cadastroIgrejaController.cadastro
);
authRouter.post(
  '/:url/login',
  schemaValidator(url, 'params'),
  schemaValidator(loginSchema),
  authController.login
);

export default authRouter;
