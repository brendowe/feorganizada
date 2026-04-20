import jwt from 'jsonwebtoken';
import 'dotenv/config';
const secret = process.env.SECRET_KEY;


export default function gerarJWT (usuario) {
  return jwt.sign({ url: usuario.url, login: usuario.login }, secret, {
    expiresIn: '1h',
  });
};
