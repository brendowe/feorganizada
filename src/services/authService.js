import masterModel from '../models/masterModel.js';
import admModel from '../models/admModel.js';
import pool from '../config/db.js';
import bcrypt from 'bcrypt';
import 'dotenv/config';
import AppError from '../errors/AppError.js';
import gerarJWT from '../utils/gerarJWT.js';

class AuthService {
  async login(url, login, senha) {
    const connection = await pool.getConnection();

    try {
      const usuario = await this.buscarUsuario(login, url, connection);
      await this.verificarSenha(senha, usuario.senha);
      const token = gerarJWT(usuario);
      return token;
    } finally {
      connection.release();
    }
  }

  async buscarUsuario(login, url, connection) {
    const usuarioAdm = await admModel.buscarADM(login, url, connection);
    const usuarioMaster = await masterModel.buscarMaster(
      login,
      url,
      connection
    );

    if (!usuarioAdm && !usuarioMaster) {
      throw new AppError('Usuário não cadastrado', 404);
    }
    const usuario = usuarioAdm || usuarioMaster;
    return usuario;
  }

  async verificarSenha(senha, usuarioSenha) {
    const senhaValida = await bcrypt.compare(senha, usuarioSenha);
    if (!senhaValida) {
      throw new AppError('Login ou senha inválidos', 401);
    }
  }
}

export default new AuthService();
