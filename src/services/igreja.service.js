import IgrejaModel from '../models/igreja.model.js';
import MembrosModel from '../models/membros.model.js';
import MasterModel from '../models/master.model.js';
import pool from '../config/db.js';
import hashSenha from '../utils/hashsenha.util.js';
import AppError from '../errors/apperror.js';

class IgrejaService {
  async cadastrarIgreja(novoCadastro) {
    let connection;

    try {
      connection = await pool.getConnection();

      const igrejaModel = new IgrejaModel(connection);
      const membrosModel = new MembrosModel(connection);
      const masterModel = new MasterModel(connection);

      const url = await igrejaModel.verificarIgreja(novoCadastro.url);
      if (url) {
        throw new AppError(`A url ${novoCadastro.url} já está em uso`, 409);
      }

      const email = await masterModel.verificarMaster(
        novoCadastro.master.email
      );
      if (email) {
        throw new AppError(
          `O email ${novoCadastro.master.email} já está em uso`,
          409
        );
      }

      await connection.beginTransaction();

      const igrejaId = await igrejaModel.cadastrarIgreja(
        novoCadastro.nomeIgreja,
        novoCadastro.url
      );

      await igrejaModel.cadastrarEndereço(
        igrejaId,
        novoCadastro.enderecoIgreja
      );

      await igrejaModel.cadastrarTelefone(
        igrejaId,
        novoCadastro.telefoneIgreja
      );

      const membroId = await membrosModel.cadastrarMembro(
        igrejaId,
        novoCadastro.nome,
        novoCadastro.nascimento
      );

      await membrosModel.cadastrarEndereco(membroId, novoCadastro.endereco);

      await membrosModel.cadastrarTelefone(membroId, novoCadastro.telefone);

      novoCadastro.master.senha = await hashSenha(novoCadastro.master.senha);
      await masterModel.cadastrarMaster(
        igrejaId,
        membroId,
        novoCadastro.master
      );

      await connection.commit();
      return igrejaId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }
}

export default new IgrejaService();
