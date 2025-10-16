import pool from "../config/db.js";
import masterModel from "../models/masterModel.js";

export default async function  authMaster(req, res, next) {
  const connection = await pool.getConnection();

  const usuario = req.usuario;

  const usuarioMaster = await masterModel.buscarMaster(usuario.login, usuario.url, connection);

  if(!usuarioMaster) {
    connection.release();
   return res.status(400).json({
        message: 'Apenas usuários master são permitidos'
    })
  }

  next();
}
