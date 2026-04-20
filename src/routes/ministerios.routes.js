import { Router } from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import MinisteriosController from '../controllers/ministerios.controller.js';
import validateMiddleware from '../middlewares/schema-validator.middleware.js';
import { urlParamSchema } from '../validators/url.validator.js';
import * as ministerioValidator from '../validators/ministerios.validator.js';

const ministeriosRouter = new Router();

/**
 * @swagger
 * tags:
 *   name: Ministérios
 *   description: Endpoints de gestão de ministérios
 */

/**
 * @swagger
 * /{url}/ministerios:
 *   get:
 *     summary: Listar ministérios da igreja
 *     tags: [Ministérios]
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
 *         description: Ministérios encontrados com sucesso
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Igreja ou ministérios não encontrados
 */
ministeriosRouter.get(
  '/:url/ministerios',
  validateMiddleware(urlParamSchema, 'params'),
  authMiddleware,
  MinisteriosController.buscarMinisterios
);

/**
 * @swagger
 * /{url}/ministerios/{ministerioId}:
 *   get:
 *     summary: Buscar membros de um ministério
 *     tags: [Ministérios]
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
 *         name: ministerioId
 *         schema:
 *           type: integer
 *           example: 2
 *         required: true
 *         description: ID do ministério
 *     responses:
 *       200:
 *         description: Membros do ministério encontrados com sucesso
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Igreja ou membros do ministério não encontrados
 */
ministeriosRouter.get(
  '/:url/ministerios/:ministerioId',
  validateMiddleware(ministerioValidator.MinisterioSchemaParams, 'params'),
  authMiddleware,
  MinisteriosController.buscarMembrosMinisterio
);

/**
 * @swagger
 * /{url}/ministerios:
 *   post:
 *     summary: Cadastrar um novo ministério
 *     tags: [Ministérios]
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
 *             required:
 *               - nomeMinisterio
 *             properties:
 *               nomeMinisterio:
 *                 type: string
 *                 minLength: 6
 *                 maxLength: 25
 *                 example: Ministério de Louvor
 *           example:
 *             nomeMinisterio: Ministério de Louvor
 *     responses:
 *       201:
 *         description: Ministério cadastrado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Igreja não encontrada
 *       409:
 *         description: Ministério já cadastrado
 */
ministeriosRouter.post(
  '/:url/ministerios',
  validateMiddleware(urlParamSchema, 'params'),
  validateMiddleware(ministerioValidator.cadastrarMinisterioSchemma),
  authMiddleware,
  MinisteriosController.cadastrarMinisterio
);

/**
 * @swagger
 * /{url}/ministerios/{ministerioId}:
 *   post:
 *     summary: Cadastrar membro em um ministério
 *     tags: [Ministérios]
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
 *         name: ministerioId
 *         schema:
 *           type: integer
 *           example: 2
 *         required: true
 *         description: ID do ministério
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - membroId
 *               - funcao
 *             properties:
 *               membroId:
 *                 type: integer
 *                 example: 5
 *               funcao:
 *                 type: string
 *                 minLength: 4
 *                 maxLength: 15
 *                 example: Vocal
 *           example:
 *             membroId: 2
 *             funcao: Vocal
 *     responses:
 *       201:
 *         description: Membro cadastrado no ministério com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Igreja, ministério ou membro não encontrado
 *       409:
 *         description: Membro já cadastrado no ministério
 */
ministeriosRouter.post(
  '/:url/ministerios/:ministerioId',
  validateMiddleware(ministerioValidator.MinisterioSchemaParams, 'params'),
  validateMiddleware(ministerioValidator.cadastrarMembrosSchema),
  authMiddleware,
  MinisteriosController.cadastrarMembroMinisterio
);

export default ministeriosRouter;
