import { Router } from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import usuariosController from '../controllers/usuarios.controller.js';
import validateMiddleware from '../middlewares/schema-validator.middleware.js';
import * as usuariosValidator from '../validators/usuarios.Validator.js';
import { urlParamSchema } from '../validators/url.validator.js';

const usuariosRouter = new Router();

/**
 * @swagger
 * tags:
 *   name: Usuários
 *   description: Endpoints relacionados aos usuários (membros)
 */

/**
 * @swagger
 * /{url}/membros:
 *   get:
 *     summary: Buscar membros da igreja
 *     tags: [Usuários]
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
 *     responses:
 *       200:
 *         description: Lista de membros retornada com sucesso
 *       401:
 *         description: Não autorizado
 */
usuariosRouter.get(
  '/:url/membros',
  validateMiddleware(urlParamSchema, 'params'),
  authMiddleware,
  usuariosController.buscarMembros
);

/**
 * @swagger
 * /{url}/membros/{id}:
 *   get:
 *     summary: Buscar um membro específico
 *     tags: [Usuários]
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
 *           example: 1
 *         required: true
 *         description: ID do membro
 *     responses:
 *       200:
 *         description: Membro encontrado com sucesso
 *       404:
 *         description: Membro não encontrado
 *       401:
 *         description: Não autorizado
 */
usuariosRouter.get(
  '/:url/membros/:id',
  validateMiddleware(usuariosValidator.buscarMembroSchemaParams, 'params'),
  authMiddleware,
  usuariosController.buscarMembro
);

/**
 * @swagger
 * /{url}/aniversariantes/{mes}:
 *   get:
 *     summary: Buscar aniversariantes por mês
 *     tags: [Usuários]
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
 *         name: mes
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *           example: 7
 *         required: true
 *         description: Mês de aniversário
 *     responses:
 *       200:
 *         description: Lista de aniversariantes retornada com sucesso
 *       404:
 *         description: Nenhum aniversariante encontrado
 *       401:
 *         description: Não autorizado
 */
usuariosRouter.get(
  '/:url/aniversariantes/:mes',
  authMiddleware,
  validateMiddleware(
    usuariosValidator.buscarAniversariantesSchemaParams,
    'params'
  ),
  usuariosController.buscarAniversariantes
);

/**
 * @swagger
 * /{url}/membros:
 *   post:
 *     summary: Cadastrar um novo membro
 *     tags: [Usuários]
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Ana Beatriz Costa
 *               nascimento:
 *                 type: string
 *                 format: date
 *                 example: 1998-03-17
 *               endereco:
 *                 type: object
 *                 properties:
 *                   estado:
 *                     type: string
 *                     example: SP
 *                   cidade:
 *                     type: string
 *                     example: São Paulo
 *                   bairro:
 *                     type: string
 *                     example: Vila Nova
 *                   rua:
 *                     type: string
 *                     example: Rua das Acácias
 *                   complemento:
 *                     type: string
 *                     example: Casa 4
 *               telefone:
 *                 type: string
 *                 example: (11) 99877-6655
 *           example:
 *             nome: Ana Beatriz Costa
 *             nascimento: 1998-03-17
 *             endereco:
 *               estado: SP
 *               cidade: São Paulo
 *               bairro: Vila Nova
 *               rua: Rua das Acácias
 *               complemento: Casa 4
 *             telefone: (11) 99877-6655
 *     responses:
 *       201:
 *         description: Membro cadastrado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 */
usuariosRouter.post(
  '/:url/membros',
  validateMiddleware(urlParamSchema, 'params'),
  validateMiddleware(usuariosValidator.cadastrarMembroSchema),
  authMiddleware,
  usuariosController.cadastrarMembro
);

/**
 * @swagger
 * /{url}/membros/{id}:
 *   delete:
 *     summary: Deletar um membro específico
 *     tags: [Usuários]
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
 *         description: ID do membro
 *     responses:
 *       200:
 *         description: Membro deletado com sucesso
 *       404:
 *         description: Membro não encontrado
 *       401:
 *         description: Não autorizado
 */
usuariosRouter.delete(
  '/:url/membros/:id',
  validateMiddleware(usuariosValidator.deletarMembroSchemaParams, 'params'),
  authMiddleware,
  usuariosController.deletarMembro
);

export default usuariosRouter;
