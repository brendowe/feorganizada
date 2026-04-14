import jwt from 'jsonwebtoken';
import 'dotenv/config';
import MasterModel from '../models/master.model.js';
import AdmModel from '../models/adm.model.js';
import pool from '../config/db.js';
import AppError from '../errors/apperror.js';

export default async function authMiddleware(req, res, next) {
  let connection;
  try {
    const headers = req.headers['authorization'];

    if (!headers) {
      throw new AppError('Erro. Cabeçalho não encontrado', 401);
    }
    const token = headers.split(' ')[1];

    if (!token) {
      throw new AppError('Erro. Token não encontrado', 401);
    }

    const payload = jwt.verify(token, process.env.SECRET_KEY);

    connection = await pool.getConnection();

    const usuarioAdm = await AdmModel.buscarADM(
      payload.login,
      payload.url,
      connection
    );
    const usuarioMaster = await MasterModel.buscarMaster(
      payload.login,
      payload.url,
      connection
    );

    const usuario = usuarioAdm || usuarioMaster;

    if (!usuario) {
      throw new AppError('Acesso negado', 403);
    }

    req.usuario = usuario;
    next();
  } catch (error) {
    return next(error);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}
