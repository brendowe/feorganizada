import dotenv from 'dotenv';

dotenv.config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
});

console.log("ENV carregado:", process.env.NODE_ENV);
