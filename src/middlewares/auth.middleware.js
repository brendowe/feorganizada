import jwt from 'jsonwebtoken';
import 'dotenv/config';
import MasterModel from '../models/master.model.js';
import AdmModel from '../models/adm.model.js';
import pool from '../config/db.js';
import AppError from '../errors/apperror.js';

export default async function authMiddleware(req, res, next) {
  let connection;
  try {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
      throw new AppError('Erro. Cabeçalho não encontrado', 401);
    }

    const token = authorizationHeader
      .replace(/^Bearer\s+/i, '')
      .replace(/^"|"$/g, '')
      .trim();

    if (!token || token.toLowerCase() === 'bearer') {
      throw new AppError('Erro. Token não encontrado', 401);
    }

    const payload = jwt.verify(token, process.env.SECRET_KEY);

    connection = await pool.getConnection();

    const admModel = new AdmModel(connection);
    const masterModel = new MasterModel(connection);

    const usuarioAdm = await admModel.buscarAdm(
      payload.login,
      payload.url
    );
    const usuarioMaster = await masterModel.buscarMaster(
      payload.login,
      payload.url
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
