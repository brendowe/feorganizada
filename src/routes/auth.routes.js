import { Router } from 'express';
import AuthController from '../controllers/auth.controller.js';
import validateMiddleware from '../middlewares/schema-validator.middleware.js';
import { loginSchema } from '../validators/auth.validator.js';
import { urlParamSchema } from '../validators/url.validator.js';

const authRouter = new Router();

/**
 * @swagger
 * tags:
 *   name: Autenticação
 *   description: Endpoints de autenticação de usuários
 */

/**
 * @swagger
 * /{url}/login:
 *   post:
 *     summary: Realizar login
 *     tags: [Autenticação]
 *     parameters:
 *       - in: path
 *         name: url
 *         schema:
 *           type: string
 *           example: esperanca-viva-sp
 *         required: true
 *         description: URL da igreja
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - login
 *               - senha
 *             properties:
 *               login:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 20
 *                 example: mastercentral
 *               senha:
 *                 type: string
 *                 minLength: 6
 *                 maxLength: 20
 *                 example: Senha@123
 *           example:
 *             login: carlossilva
 *             senha: senhaSegura123
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Credenciais inválidas
 *       404:
 *         description: Igreja ou usuário não encontrado
 */

authRouter.post(
  '/:url/login',
  validateMiddleware(urlParamSchema, 'params'),
  validateMiddleware(loginSchema),
  AuthController.login
);

export default authRouter;
