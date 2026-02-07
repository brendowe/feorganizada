import pool from '../config/db.js';
import igrejaModel from '../models/igrejaModel.js';
import ministerioModel from '../models/ministerioModel.js';
import membrosModel from '../models/membrosModel.js';

class ministeriosService {
  async cadastrarMinisterio(novoMinisterio) {
    const connection = await pool.getConnection();

    try {
      const igreja_id = await igrejaModel.igrejaId(
        novoMinisterio.url,
        connection
      );

      const ministerioVerificado = await ministerioModel.verificarMinisterio(
        igreja_id,
        novoMinisterio.nomeMinisterio,
        connection
      );

      if (ministerioVerificado) {
        await connection.rollback();

        return `O nome de ministério ${novoMinisterio.nomeMinisterio} já está cadastrado`;
      }
      await connection.beginTransaction();

      await ministerioModel.cadastrarMinisterio(
        novoMinisterio.nomeMinisterio,
        igreja_id,
        connection
      );

      await connection.commit();

      return `Ministério ${novoMinisterio.nomeMinisterio} cadastrado com sucesso`;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async buscarMinisterios(url) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();
      const igreja_id = await igrejaModel.igrejaId(url, connection);

      const ministerios = await ministerioModel.buscarMinisterios(
        igreja_id,
        connection
      );

      return ministerios;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async cadastrarMembroMinisterio(url, ministerioId, membroId, funcao) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const igrejaId = await igrejaModel.igrejaId(url, connection);

      if (igrejaId === null) {
        await connection.rollback();

        return `Erro. Igreja não encontrada`;
      }

      const ministerioVerificado = await ministerioModel.verificarMinisterioId(
        igrejaId,
        ministerioId,
        connection
      );

      if (ministerioVerificado === false) {
        await connection.rollback();

        return `Erro. Ministério não encontrado`;
      }

      const membroVerificado = await membrosModel.buscarMembro(
        url,
        membroId,
        connection
      );

      if (membroVerificado === null) {
        await connection.rollback();

        return `Erro. Membro não encontrado.`;
      }

      const membroMinisterioVerificado =
        await ministerioModel.verificarMembroMinisterio(
          ministerioId,
          membroId,
          connection
        );

      if (membroMinisterioVerificado === true) {
        await connection.rollback();

        return `Erro. Membro já cadastrado nesse ministério`;
      }

      const ministerioMembro = await ministerioModel.cadastrarMembroMinisterio(
        ministerioId,
        membroId,
        funcao,
        connection
      );

      if (ministerioMembro === null) {
        await connection.rollback();

        return `Erro. Membro não foi cadastrado.`;
      }

      await connection.commit();

      return `Membro cadastrado com sucesso`;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async buscarMembrosMinisterio(ministerioId, url) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const igrejaId = await igrejaModel.igrejaId(url, connection);

      const buscarMembros = await ministerioModel.buscarMembrosMinisterio(
        ministerioId,
        igrejaId,
        connection
      );

      if (buscarMembros === null) {
        await connection.rollback();

        return `Erro. Membros não encontrados`;
      }

      return buscarMembros;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}

export default new ministeriosService();
