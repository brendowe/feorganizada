import pool from '../config/db.js';
import MasterModel from '../models/master.model.js';
import AppError from '../errors/apperror.js';

export default async function masterMiddleware(req, res, next) {
  let connection;

  try {
    if (!req.usuario) {
      throw new AppError('Acesso negado: usuário não autenticado', 401);
    }

    connection = await pool.getConnection();

    const usuarioMaster = await MasterModel.buscarMaster(
      req.usuario.login,
      req.usuario.url,
      connection
    );

    if (!usuarioMaster) {
      throw new AppError('Acesso negado: usuário não é um master', 403);
    }

    return next();
  } catch (error) {
    return next(error);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}
