import { Router } from "express";
import masterController from "../controllers/master.controller.js";
import authToken from "../middlewares/authToken.js";
import authMaster from "../middlewares/authMaster.js";

const masterRouter = new Router();


masterRouter.post('/:url/adm/:id', authToken, authMaster, masterController.cadastarAdm)
masterRouter.patch('/:url/adm/:login', authToken, authMaster, masterController.atualizarSenhaAdm)

export default masterRouter;
