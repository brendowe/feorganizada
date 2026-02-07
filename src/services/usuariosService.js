import igrejaModel from '../models/igrejaModel.js';
import membrosModel from '../models/membrosModel.js';
import pool from '../config/db.js';
import admModel from '../models/admModel.js';
import ministeriosModel from '../models/ministerioModel.js';

class usuarios {
  async cadastrarMembro(url, novoMembro) {
    const connection = await pool.getConnection();

    try {
      const igrejaId = await igrejaModel.igrejaId(url, connection);

      await connection.beginTransaction();

      const membroId = await membrosModel.cadastrarMembro(
        igrejaId,
        novoMembro.nome,
        novoMembro.nascimento,
        connection
      );

      await membrosModel.cadastrarEndereco(
        membroId,
        novoMembro.endereco,
        connection
      );

      await membrosModel.cadastrarTelefone(
        membroId,
        novoMembro.telefone,
        connection
      );

      await connection.commit();
      return 'usuário cadastrado com sucesso';
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async buscarMembros(url) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();
      const membros = await membrosModel.buscarMembros(url, connection);

      return membros;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async buscarMembro(url, id) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();
      const membro = await membrosModel.buscarMembro(url, id, connection);

      return membro;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async buscarAniversariantes(url, mes) {
    const connection = await pool.getConnection();

    try {
      const aniversariantes = await membrosModel.buscarAniversariantes(
        url,
        mes,
        connection
      );

      return aniversariantes;
    } catch (error) {
      throw error;
    } finally {
      connection.release();
    }
  }

  async deletarMembro(url, id) {
    const connection = await pool.getConnection();
    try {
      let verificarAdm = await admModel.verificarAdm(id, url, connection);
      let igrejaId = await igrejaModel.igrejaId(url, connection);

      if (verificarAdm === true) {
        return 'Não é permitido deletar um membro que é administrador da igreja.';
      }

      await connection.beginTransaction();
      await membrosModel.deletarEndereco(id, igrejaId, connection);
      await membrosModel.deletarTelefone(id, igrejaId, connection);
      await ministeriosModel.deletarMinisterioMembro(id, igrejaId, connection);
      await membrosModel.deletarMembro(igrejaId, id, connection);

      await connection.commit();
      return 'Usuário deletado com sucesso';
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}

export default new usuarios();
