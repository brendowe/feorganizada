import { Router } from 'express';
import cadastroIgrejaController from '../controllers/cadastroIgreja.controller.js';
import authController from '../controllers/auth.controller.js';
import authToken from '../middlewares/authToken.js';
import authMaster from '../middlewares/authMaster.js';

const authRouter = new Router();

authRouter.post('/cadastro', cadastroIgrejaController.cadastro);
authRouter.post('/:url/login', authController.login);
authRouter.get('/:url/protegida', authToken, authMaster,(req, res)=> {
    res.status(200).json({
        message: 'a rota protegida pode ser acessada por você pq você é um master'
    })
})

export default authRouter;
