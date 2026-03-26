import pool from "../config/db.js";
import masterModel from "../models/masterModel.js";
import { errorHandler } from "./errorHandler.js";

export default async function  authMaster(req, res, next) {
  const connection = await pool.getConnection();

  const usuario = req.usuario;

  const usuarioMaster = await masterModel.buscarMaster(usuario.login, usuario.url, connection);

  if(!usuarioMaster) {
    connection.release();

    const error = new Error('Acesso negado: usuário não é um master');
    error.statusCode = 403;

    return error;
  }

  next();
}
