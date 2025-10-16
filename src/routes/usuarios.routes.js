import { Router } from "express";
import authToken from '../middlewares/authToken.js';
import usuariosController from "../controllers/usuarios.controller.js";

const usuariosRouter = new Router();

usuariosRouter.post('/:url/cadastrarMembro', authToken, usuariosController.cadastrarMembro);


export default usuariosRouter;
