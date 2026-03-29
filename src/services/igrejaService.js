import igrejaModel from '../models/igrejaModel.js';
import membrosModel from '../models/membrosModel.js';
import masterModel from '../models/masterModel.js';
import pool from '../config/db.js';
import hashSenha from '../utils/hashsenha.util.js';

class IgrejaService {
  async cadastrarIgreja(novoCadastro) {
    const connection = await pool.getConnection();

    try {
      const url = await igrejaModel.verificarIgreja(
        novoCadastro.url,
        connection
      );
      if (url) return `A url ${novoCadastro.url} já está em uso`;

      const email = await masterModel.verificarMaster(
        novoCadastro.master.email,
        connection
      );
      if (email) return `O email ${novoCadastro.master.email} já está em uso`;

      await connection.beginTransaction();

      const igrejaId = await igrejaModel.cadastrarIgreja(
        novoCadastro.nomeIgreja,
        novoCadastro.url,
        connection
      );

      await igrejaModel.cadastrarEndereço(
        igrejaId,
        novoCadastro.enderecoIgreja,
        connection
      );

      await igrejaModel.cadastrarTelefone(
        igrejaId,
        novoCadastro.telefoneIgreja,
        connection
      );

      const membroId = await membrosModel.cadastrarMembro(
        igrejaId,
        novoCadastro.nome,
        novoCadastro.nascimento,
        connection
      );

      await membrosModel.cadastrarEndereco(
        membroId,
        novoCadastro.endereco,
        connection
      );

      await membrosModel.cadastrarTelefone(
        membroId,
        novoCadastro.telefone,
        connection
      );

      novoCadastro.master.senha = await hashSenha(novoCadastro.master.senha);
      await masterModel.cadastrarMaster(
        igrejaId,
        membroId,
        novoCadastro.master,
        connection
      );

      await connection.commit();
      return 'Igreja cadastrada com sucesso';
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}

export default new IgrejaService();
