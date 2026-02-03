import bcrypt, { hash } from 'bcrypt';
import 'dotenv/config';

export default async function hashSenha(senha) {
  const saltRounds = parseInt(process.env.SALTROUNDS);
  const hashedSenha = await bcrypt.hash(senha, saltRounds);
  return hashedSenha;
}

