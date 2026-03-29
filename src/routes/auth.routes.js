import { Router } from 'express';
import AuthController from '../controllers/auth.controller.js';
import validateMiddleware from '../middlewares/schema-validator.middleware.js';
import { loginSchema } from '../validators/auth.validator.js';
import { urlParamSchema } from '../validators/url.validator.js';

const authRouter = new Router();

authRouter.post(
  '/:url/login',
  validateMiddleware(urlParamSchema, 'params'),
  validateMiddleware(loginSchema),
  AuthController.login
);

export default authRouter;
