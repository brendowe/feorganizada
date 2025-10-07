import masterModel from '../models/masterModel';
import admModel from '../models/admModel';
import pool from '../config/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
const secret = process.env.SECRET_KEY;

const gerarJWT = (usuario) => {
  return jwt.sign({ url: usuario.url, login: usuario.login }, secret, {
    expiresIn: '1h',
  });
};

class authService {
  async authLogin(url, login, senha) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const usuarioAdm = await admModel.buscarADM(login, url, connection);
      const usuarioMaster = await masterModel.buscarMaster(login, url, connection);
      if (!usuarioAdm && !usuarioMaster) return 'usuário não cadastrado';

        let usuario;
        if(usuarioAdm) {
            usuario = usuarioAdm;
        } else if(usuarioMaster) {
            usuario = usuarioMaster;
        }

      const senhaVerificada = await bcrypt.compare(senha, usuario.senha);
      if (!senhaVerificada) return 'senha incorreta';

      const token = gerarJWT(usuario);
      return token;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}
