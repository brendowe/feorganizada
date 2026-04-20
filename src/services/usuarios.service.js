import IgrejaModel from '../models/igreja.model.js';
import MembrosModel from '../models/membros.model.js';
import pool from '../config/db.js';
import AdmModel from '../models/adm.model.js';
import MinisteriosModel from '../models/ministerio.model.js';
import AppError from '../errors/apperror.js';

class Usuarios {
  async cadastrarMembro(url, novoMembro) {
    let connection;
    try {
      connection = await pool.getConnection();

      const igrejaModel = new IgrejaModel(connection);
      const membrosModel = new MembrosModel(connection);

      const igrejaId = await igrejaModel.igrejaId(url);

      if (!igrejaId) {
        throw new AppError('Igreja não encontrada', 404);
      }

      await connection.beginTransaction();

      const membroId = await membrosModel.cadastrarMembro(
        igrejaId,
        novoMembro.nome,
        novoMembro.nascimento
      );

      if (!membroId) {
        throw new AppError('Erro ao cadastrar membro', 500);
      }

      const membroEndereco = await membrosModel.cadastrarEndereco(
        membroId,
        novoMembro.endereco
      );

      if (!membroEndereco) {
        throw new AppError('Erro ao cadastrar endereço do membro', 500);
      }

      const membroTelefone = await membrosModel.cadastrarTelefone(
        membroId,
        novoMembro.telefone
      );

      if (!membroTelefone) {
        throw new AppError('Erro ao cadastrar telefone do membro', 500);
      }

      await connection.commit();
      return membroId;
    } catch (error) {
      if (connection) {
        await connection.rollback();
      }
      throw error;
    } finally {
      connection.release();
    }
  }

  async buscarMembros(url) {
    let connection;
    try {
      connection = await pool.getConnection();

      const membrosModel = new MembrosModel(connection);

      const membros = await membrosModel.buscarMembros(url);
      if (membros.length === 0) {
        throw new AppError('Nenhum membro encontrado', 404);
      }

      return membros;
    } finally {
      connection.release();
    }
  }

  async buscarMembro(url, id) {
    let connection;
    try {
      connection = await pool.getConnection();

      const membrosModel = new MembrosModel(connection);

      const membro = await membrosModel.buscarMembro(url, id);

      if (!membro) {
        throw new AppError('Membro não encontrado', 404);
      }

      return membro;
    } finally {
      connection.release();
    }
  }

  async buscarAniversariantes(url, mes) {
    let connection;
    try {
      connection = await pool.getConnection();

      const membrosModel = new MembrosModel(connection);

      const aniversariantes = await membrosModel.buscarAniversariantes(
        url,
        mes
      );

      if (aniversariantes.length === 0) {
        throw new AppError('Nenhum aniversariante encontrado', 404);
      }

      return aniversariantes;
    } finally {
      connection.release();
    }
  }

  async deletarMembro(url, id) {
    let connection;
    try {
      connection = await pool.getConnection();

      const membrosModel = new MembrosModel(connection);
      const igrejaModel = new IgrejaModel(connection);
      const admModel = new AdmModel(connection);

      await connection.beginTransaction();

      let igrejaId = await igrejaModel.igrejaId(url);
      if (!igrejaId) {
        throw new AppError('Igreja não encontrada', 404);
      }
      let verificarAdm = await admModel.verificarAdm(id, igrejaId);

      if (verificarAdm) {
        throw new AppError(
          'Não é permitido deletar um membro que é administrador da igreja.',
          403
        );
      }

      const result = await membrosModel.deletarMembro(igrejaId, id);

      if (result.affectedRows === 0) {
        throw new AppError('Membro não encontrado', 404);
      }

      await connection.commit();
      return 'Usuário deletado com sucesso';
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
}

export default new Usuarios();
