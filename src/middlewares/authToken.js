import jwt from 'jsonwebtoken';
import 'dotenv/config';
import masterModel from '../models/masterModel.js';
import admModel from '../models/admModel.js';
import pool from '../config/db.js';

export default async function authToken(req, res, next) {
  const connection = await pool.getConnection();
  const headers = req.headers['authorization'];

  if (!headers) {
    connection.release();
    res.status(400).json({ message: 'Erro. Token não encontrado' });
  }
  const token = headers.split(' ')[1];

  if (!token) {
    connection.release();
    return res.status(400).json({ message: 'Erro. Token não encontrado' });
  }

  jwt.verify(token, process.env.SECRET_KEY, async (error, payload) => {
    if (error) {
      connection.release();
      return res.status(400).json({ message: 'token ou usuario errado' });
    }

    const usuarioAdm = await admModel.buscarADM(
      payload.login,
      payload.url,
      connection
    );
    const usuarioMaster = await masterModel.buscarMaster(
      payload.login,
      payload.url,
      connection
    );

    let usuario;
    if (usuarioAdm) {
      usuario = usuarioAdm;
    } else if (usuarioMaster) {
      usuario = usuarioMaster;
    }

    req.usuario = usuario;
    connection.release();
    next();
  });
}
