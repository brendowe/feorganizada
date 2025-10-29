import { Router } from "express";
import authToken from '../middlewares/authToken.js';
import usuariosController from "../controllers/usuarios.controller.js";

const usuariosRouter = new Router();

usuariosRouter.post('/:url/membros', authToken, usuariosController.cadastrarMembro);
usuariosRouter.get('/:url/membros', authToken, usuariosController.buscarMembros);
usuariosRouter.get('/:url/membros/:id', authToken, usuariosController.buscarMembro);

export default usuariosRouter;
