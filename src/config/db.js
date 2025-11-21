import '../config/env.js';
import mysql from 'mysql2/promise';
const host = process.env.HOST;
const user = process.env.USER;
const password = process.env.PASSWORD;
const database = process.env.DATABASE;

const pool = mysql.createPool({
  host: host,
  user: user,
  password: password,
  database: database,
  dateStrings: true,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

console.log('Banco carregado:', process.env.DATABASE);

export default pool;
