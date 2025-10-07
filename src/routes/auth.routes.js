import { Router } from 'express';
import cadastroIgrejaController from '../controllers/cadastroIgreja.controller.js';

const authRouter = new Router();

authRouter.post('/cadastro', cadastroIgrejaController.cadastro);

export default authRouter;
