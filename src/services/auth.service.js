import MasterModel from '../models/master.model.js';
import AdmModel from '../models/adm.model.js';
import pool from '../config/db.js';
import bcrypt from 'bcrypt';
import 'dotenv/config';
import AppError from '../errors/apperror.js';
import gerarJWT from '../utils/gerarjwt.util.js';

class AuthService {
  async login(url, login, senha) {
    let connection;

    try {
      connection = await pool.getConnection();

      const admModel = new AdmModel(connection);
      const masterModel = new MasterModel(connection);

      const usuario = await this.buscarUsuario(
        login,
        url,
        admModel,
        masterModel
      );
      await this.verificarSenha(senha, usuario.senha);
      const token = gerarJWT(usuario);
      return token;
    } finally {
      if (connection) connection.release();
    }
  }

  async buscarUsuario(login, url, admModel, masterModel) {
    const usuarioAdm = await admModel.buscarAdm(login, url);
    const usuarioMaster = await masterModel.buscarMaster(login, url);

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
