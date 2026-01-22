import { Router } from "express";
import masterController from "../controllers/master.controller.js";
import authToken from "../middlewares/authToken.js";
import authMaster from "../middlewares/authMaster.js";
import schemaValidator from '../middlewares/schemaValidator.js';
import * as masterValidator from '../validators/master.Validator.js';

const masterRouter = new Router();


masterRouter.post('/:url/adm/:id', schemaValidator(masterValidator.cadastroAdmSchemaParams,'params'), schemaValidator(masterValidator.cadastroAdmSchema),authToken, authMaster, masterController.cadastarAdm);

masterRouter.patch('/:url/adm/:login', schemaValidator(masterValidator.autMasterParams,'params'), schemaValidator(masterValidator.novaSenhaAdmSchema),authToken, authMaster, masterController.atualizarSenhaAdm);

export default masterRouter;
