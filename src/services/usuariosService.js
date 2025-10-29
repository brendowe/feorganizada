import igrejaModel from '../models/igrejaModel.js';
import membrosModel from '../models/membrosModel.js';
import pool from '../config/db.js';

class usuarios {
  async cadastrarMembro(url, novoMembro) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const igrejaId = await igrejaModel.igrejaId(url, connection);

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
}

export default new usuarios();
