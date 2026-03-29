import pool from '../config/db.js';
import masterModel from '../models/masterModel.js';
import AppError from '../errors/AppError.js';

export default async function masterMiddleware(req, res, next) {
  if (!req.usuario) {
    return next(new AppError('Usuário não autenticado', 401));
  }

  const connection = await pool.getConnection();

  try {
    const usuarioMaster = await masterModel.buscarMaster(
      req.usuario.login,
      req.usuario.url,
      connection
    );

    if (!usuarioMaster) {
      return next(new AppError('Acesso negado: usuário não é um master', 403));
    }

    return next();
  } catch (error) {
    return next(error);
  } finally {
    connection.release();
  }
}
