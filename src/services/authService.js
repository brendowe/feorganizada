import masterModel from '../models/masterModel.js';
import admModel from '../models/admModel.js';
import pool from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import AppError  from '../errors/AppError.js';
const secret = process.env.SECRET_KEY;

const gerarJWT = (usuario) => {
  return jwt.sign({ url: usuario.url, login: usuario.login }, secret, {
    expiresIn: '1h',
  });
};

class authService {
  async login(url, login, senha) {
    const connection = await pool.getConnection();

    try {
      const usuarioAdm = await admModel.buscarADM(login, url, connection);
      const usuarioMaster = await masterModel.buscarMaster(
        login,
        url,
        connection
      );
      if (!usuarioAdm && !usuarioMaster) {
        throw new AppError('Usuário não cadastrado', 404);
      }
      let usuario;
      if (usuarioAdm) {
        usuario = usuarioAdm;
      } else if (usuarioMaster) {
        usuario = usuarioMaster;
      }

      const senhaVerificada = await bcrypt.compare(senha, usuario.senha);
      if (!senhaVerificada) {
        throw new AppError('Login ou senha inválidos', 401);
      }

      const token = gerarJWT(usuario);
      return token;
    } catch (error) {
      throw new AppError('Erro ao fazer login', 500);
    } finally {
      connection.release();
    }
  }
}

export default new authService();
