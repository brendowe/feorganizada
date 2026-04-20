import { Router } from 'express';
import MasterController from '../controllers/master.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import masterMiddleware from '../middlewares/master.middleware.js';
import validateMiddleware from '../middlewares/schema-validator.middleware.js';
import * as masterValidator from '../validators/master.validator.js';

const masterRouter = new Router();

/**
 * @swagger
 * tags:
 *   name: Master
 *   description: Endpoints administrativos de nível master
 */

/**
 * @swagger
 * /{url}/adm/{id}:
 *   post:
 *     summary: Cadastrar um administrador
 *     tags: [Master]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: url
 *         schema:
 *           type: string
 *           example: esperanca-viva-sp
 *         required: true
 *         description: URL da igreja
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *           example: 2
 *         required: true
 *         description: ID do membro a ser promovido a administrador
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
 *                 minLength: 6
 *                 maxLength: 20
 *                 example: anabeatriz
 *               senha:
 *                 type: string
 *                 minLength: 8
 *                 maxLength: 24
 *                 example: NovaSenha@123
 *           example:
 *             login: anabeatriz
 *             senha: NovaSenha@123
 *     responses:
 *       201:
 *         description: Administrador cadastrado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso restrito a master
 *       409:
 *         description: Usuário já é administrador
 */

masterRouter.post(
  '/:url/adm/:id',
  validateMiddleware(masterValidator.cadastroAdmSchemaParams, 'params'),
  validateMiddleware(masterValidator.cadastroAdmSchema),
  authMiddleware,
  masterMiddleware,
  MasterController.cadastrarAdm
);

/**
 * @swagger
 * /{url}/adm/{login}:
 *   patch:
 *     summary: Atualizar senha de administrador
 *     tags: [Master]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: url
 *         schema:
 *           type: string
 *           example: esperanca-viva-sp
 *         required: true
 *         description: URL da igreja
 *       - in: path
 *         name: login
 *         schema:
 *           type: string
 *           example: anabeatriz
 *         required: true
 *         description: Login do administrador
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - novaSenha
 *             properties:
 *               novaSenha:
 *                 type: string
 *                 minLength: 8
 *                 maxLength: 24
 *                 example: SenhaForte@2026
 *           example:
 *             novaSenha: SenhaForte@2026
 *     responses:
 *       200:
 *         description: Senha atualizada com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso restrito a master
 *       404:
 *         description: Administrador não encontrado
 */

masterRouter.patch(
  '/:url/adm/:login',
  validateMiddleware(masterValidator.autMasterParams, 'params'),
  validateMiddleware(masterValidator.novaSenhaAdmSchema),
  authMiddleware,
  masterMiddleware,
  MasterController.atualizarSenhaAdm
);

export default masterRouter;
