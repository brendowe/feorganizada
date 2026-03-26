import 'dotenv/config';
import mysql from 'mysql2/promise';
const host = process.env.DB_HOST;
const user = process.env.DB_USER;
const password = process.env.PASSWORD;
const database = process.env.DATABASE;

const pool = mysql.createPool({
  host,
  user,
  password,
  database,
  dateStrings: true,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
