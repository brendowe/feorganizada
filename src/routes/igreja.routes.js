import { Router } from 'express';
import IgrejaController from '../controllers/igreja.controller.js';
import validateMiddleware from '../middlewares/schema-validator.middleware.js';
import { cadastroSchema } from '../validators/igreja.validator.js';

const igrejaRouter = new Router();

/**
 * @swagger
 * tags:
 *   name: Igrejas
 *   description: Endpoints para cadastro de igrejas
 */

/**
 * @swagger
 * /igrejas:
 *   post:
 *     summary: Cadastrar uma nova igreja
 *     tags: [Igrejas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nomeIgreja
 *               - url
 *               - enderecoIgreja
 *               - telefoneIgreja
 *               - nome
 *               - nascimento
 *               - endereco
 *               - telefone
 *               - master
 *             properties:
 *               nomeIgreja:
 *                 type: string
 *                 example: Igreja Esperança Viva
 *               url:
 *                 type: string
 *                 example: esperanca-viva-sp
 *               enderecoIgreja:
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
 *                     example: Jardim das Flores
 *                   rua:
 *                     type: string
 *                     example: Rua das Oliveiras
 *                   complemento:
 *                     type: string
 *                     example: Próximo à praça central
 *               telefoneIgreja:
 *                 type: string
 *                 example: (11) 91234-5678
 *               nome:
 *                 type: string
 *                 example: Carlos Silva
 *               nascimento:
 *                 type: string
 *                 format: date
 *                 example: 1985-07-23
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
 *                     example: Rua dos Lírios
 *                   complemento:
 *                     type: string
 *                     example: Apartamento 101
 *               telefone:
 *                 type: string
 *                 example: (11) 99876-5432
 *               master:
 *                 type: object
 *                 properties:
 *                   login:
 *                     type: string
 *                     example: carlossilva
 *                   senha:
 *                     type: string
 *                     example: senhaSegura123
 *                   email:
 *                     type: string
 *                     format: email
 *                     example: carlossilva@gmail.com
 *           example:
 *             nomeIgreja: Igreja Esperança Viva
 *             url: esperanca-viva-sp
 *             enderecoIgreja:
 *               estado: SP
 *               cidade: São Paulo
 *               bairro: Jardim das Flores
 *               rua: Rua das Oliveiras
 *               complemento: Próximo à praça central
 *             telefoneIgreja: (11) 91234-5678
 *             nome: Carlos Silva
 *             nascimento: 1985-07-23
 *             endereco:
 *               estado: SP
 *               cidade: São Paulo
 *               bairro: Vila Nova
 *               rua: Rua dos Lírios
 *               complemento: Apartamento 101
 *             telefone: (11) 99876-5432
 *             master:
 *               login: carlossilva
 *               senha: senhaSegura123
 *               email: carlossilva@gmail.com
 *     responses:
 *       201:
 *         description: Igreja cadastrada com sucesso
 *       400:
 *         description: Dados inválidos
 *       409:
 *         description: URL ou email já em uso
 */

igrejaRouter.post(
  '/igrejas',
  validateMiddleware(cadastroSchema),
  IgrejaController.cadastro
);

export default igrejaRouter;
