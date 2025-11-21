import pool from '../config/db.js';
import igrejaModel from '../models/igrejaModel.js';
import ministerioModel from '../models/ministerioModel.js';

class ministeriosService {
  async cadastrarMinisterio(novoMinisterio) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const igreja_id = await igrejaModel.igrejaId(
        novoMinisterio.url,
        connection
      );

      const ministerioVerificado = await ministerioModel.verificarMinisterio(
        igreja_id,
        novoMinisterio.nome,
        connection
      );

      if (ministerioVerificado) {
        await connection.rollback();

        return `O nome de ministério ${novoMinisterio.nome} já está cadastrado`;
      }

      const ministerio = await ministerioModel.cadastrarMinisterio(
        novoMinisterio.nome,
        igreja_id,
        connection
      );

      await connection.commit();

      return `Ministério ${novoMinisterio.nome} cadastrado com sucesso`;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}
