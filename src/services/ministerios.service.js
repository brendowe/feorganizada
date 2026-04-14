import pool from '../config/db.js';
import IgrejaModel from '../models/igreja.model.js';
import MinisterioModel from '../models/ministerio.model.js';
import MembrosModel from '../models/membros.model.js';
import AppError from '../errors/apperror.js';

class MinisteriosService {
  async cadastrarMinisterio(novoMinisterio) {
    let connection;

    try {
      connection = await pool.getConnection();

      const igrejaModel = new IgrejaModel(connection);
      const ministerioModel = new MinisterioModel(connection);

      const igrejaId = await igrejaModel.igrejaId(novoMinisterio.url);

      if (!igrejaId) {
        throw new AppError('Igreja não encontrada', 404);
      }

      const ministerioVerificado = await ministerioModel.verificarMinisterio(
        igrejaId,
        novoMinisterio.nomeMinisterio
      );

      if (ministerioVerificado) {
        throw new AppError(
          `O nome de ministério ${novoMinisterio.nomeMinisterio} já está cadastrado`,
          409
        );
      }

      await connection.beginTransaction();

      await ministerioModel.cadastrarMinisterio(
        novoMinisterio.nomeMinisterio,
        igrejaId
      );
      await connection.commit();
      return `Ministério ${novoMinisterio.nomeMinisterio} cadastrado com sucesso`;
    } catch (error) {
      if (connection) {
        await connection.rollback();
      }
      throw error;
    } finally {
      connection.release();
    }
  }

  async buscarMinisterios(url) {
    let connection;
    try {
      connection = await pool.getConnection();

      const igrejaModel = new IgrejaModel(connection);
      const ministerioModel = new MinisterioModel(connection);

      const igrejaId = await igrejaModel.igrejaId(url);

      if (!igrejaId) {
        throw new AppError('Igreja não encontrada', 404);
      }

      const ministerios = await ministerioModel.buscarMinisterios(igrejaId);

      if (ministerios === null) {
        throw new AppError('Ministerios não encontrados', 404);
      }

      return ministerios;
    } finally {
      connection.release();
    }
  }

  async cadastrarMembroMinisterio(url, ministerioId, membroId, funcao) {
    let connection;

    try {
      connection = await pool.getConnection();
      const igrejaModel = new IgrejaModel(connection);
      const ministerioModel = new MinisterioModel(connection);
      const membrosModel = new MembrosModel(connection);

      const igrejaId = await igrejaModel.igrejaId(url);
      if (!igrejaId) {
        throw new AppError(`Erro. Igreja não encontrada`, 404);
      }

      const ministerioVerificado = await ministerioModel.verificarMinisterioId(
        igrejaId,
        ministerioId
      );

      if (!ministerioVerificado) {
        throw new AppError(`Erro. Ministério não encontrado`, 404);
      }

      const membroVerificado = await membrosModel.buscarMembro(url, membroId);

      if (membroVerificado === null) {
        throw new AppError(`Erro. Membro não encontrado.`, 404);
      }

      const membroMinisterioVerificado =
        await ministerioModel.verificarMembroMinisterio(ministerioId, membroId);

      if (membroMinisterioVerificado) {
        throw new AppError(`Erro. Membro já cadastrado nesse ministério`, 409);
      }

      await connection.beginTransaction();

      const ministerioMembro = await ministerioModel.cadastrarMembroMinisterio(
        ministerioId,
        membroId,
        funcao
      );

      if (ministerioMembro === null) {
        throw new AppError('Erro. Membro não foi cadastrado.', 500);
      }

      await connection.commit();

      return `Membro cadastrado com sucesso`;
    } catch (error) {
      if (connection) {
        await connection.rollback();
      }
      throw error;
    } finally {
      connection.release();
    }
  }

  async buscarMembrosMinisterio(ministerioId, url) {
    let connection;

    try {
      connection = await pool.getConnection();

      const igrejaModel = new IgrejaModel(connection);
      const ministerioModel = new MinisterioModel(connection);

      const igrejaId = await igrejaModel.igrejaId(url);

      if (igrejaId === null) {
        throw new AppError('Igreja não encontrada', 404);
      }

      const buscarMembros = await ministerioModel.buscarMembrosMinisterio(
        ministerioId,
        igrejaId
      );

      if (buscarMembros === null) {
        throw new AppError('Erro. Membros não encontrados', 404);
      }

      return buscarMembros;
    } finally {
      connection.release();
    }
  }
}

export default new MinisteriosService();
