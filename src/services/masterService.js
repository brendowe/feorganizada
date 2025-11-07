import admModel from '../models/admModel.js';
import igrejaModel from '../models/igrejaModel.js';
import pool from '../config/db.js';
import hashSenha from '../util/hashSenha.js';

class masterService {
  async cadastrarAdm(url, id, login, senha) {
    const connection = await pool.getConnection();

    try {
      connection.beginTransaction();

      const admCadastrado = await admModel.buscarADM(login, url, connection);

      if (admCadastrado != false) {
        connection.release();
        return 'Usuário já é adm';
      }

      //const membro = await membrosModel.buscarMembro(url, id, connection);

      const igrejaId = await igrejaModel.igrejaId(url, connection);
      const senhaHash = await hashSenha(senha);

      await admModel.cadastrarAdm(igrejaId, id, login, senhaHash, connection);

      await connection.commit();

      return 'Novo adm cadastrado com sucesso';
    } catch (error) {
      await connection.rollback();

      throw error;
    } finally {
      connection.release();
    }
  }

  async atualizarSenhaAdm(login, url, novaSenha) {
    const connection = await pool.getConnection();

    try {
      connection.beginTransaction();

      const admCadastrado = await admModel.buscarADM(login, url, connection);

      if (admCadastrado == false) {
        connection.release();
        return 'Adm não cadastrado';
      }

      const novaSenhaHash = await hashSenha(novaSenha);

      const senhaAtualizada = await admModel.alterarSenhaAdm(
        admCadastrado.login,
        admCadastrado.id,
        novaSenhaHash,
        connection
      );

      if (senhaAtualizada == 0) {
        connection.release();

        return 'Senha não foi alterada';
      }

      await connection.commit();
      return 'Senha alterada com sucesso';
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}

export default new masterService();
