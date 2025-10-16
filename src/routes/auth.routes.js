import { Router } from 'express';
import cadastroIgrejaController from '../controllers/cadastroIgreja.controller.js';
import authController from '../controllers/auth.controller.js';


const authRouter = new Router();

authRouter.post('/cadastro', cadastroIgrejaController.cadastro);
authRouter.post('/:url/login', authController.login);


export default authRouter;
