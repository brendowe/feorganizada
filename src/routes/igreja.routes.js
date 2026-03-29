import { Router } from 'express';
import IgrejaController from '../controllers/igreja.controller.js';
import validateMiddleware from '../middlewares/schema-validator.middleware.js';
import { cadastroSchema } from '../validators/igreja.validator.js';

const igrejaRouter = new Router();

igrejaRouter.post(
  '/igrejas',
  validateMiddleware(cadastroSchema),
  IgrejaController.cadastro
);

export default igrejaRouter;
