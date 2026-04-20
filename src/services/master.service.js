import AdmModel from '../models/adm.model.js';
import IgrejaModel from '../models/igreja.model.js';
import pool from '../config/db.js';
import hashSenha from '../utils/hashsenha.util.js';
import AppError from '../errors/apperror.js';

class MasterService {
  async cadastrarAdm(url, id, login, senha) {
    let connection;

    try {
      connection = await pool.getConnection();

      const admModel = new AdmModel(connection);
      const igrejaModel = new IgrejaModel(connection);

      await connection.beginTransaction();

      const admCadastrado = await admModel.buscarAdm(login, url);

      if (admCadastrado) {
        throw new AppError('Usuário já é adm', 409);
      }

      const igrejaId = await igrejaModel.igrejaId(url);
      const senhaHash = await hashSenha(senha);

      const novoAdm = await admModel.cadastrarAdm(
        igrejaId,
        id,
        login,
        senhaHash
      );

      await connection.commit();

      return novoAdm;
    } catch (error) {
      if (connection) {
        await connection.rollback();
      }
      throw error;
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }

  async atualizarSenhaAdm(login, url, novaSenha) {
    let connection;

    try {
      connection = await pool.getConnection();

      const admModel = new AdmModel(connection);

      const admCadastrado = await admModel.buscarAdm(login, url);

      if (!admCadastrado) {
        throw new AppError('Adm não cadastrado', 404);
      }

      const novaSenhaHash = await hashSenha(novaSenha);

      const senhaAtualizada = await admModel.alterarSenhaAdm(
        admCadastrado.login,
        admCadastrado.id,
        novaSenhaHash
      );

      if (senhaAtualizada === 0) {
        throw new AppError('Senha não foi alterada', 500);
      }
      return 'Senha alterada com sucesso';
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }
}

export default new MasterService();
