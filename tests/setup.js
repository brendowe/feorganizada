import pool from '../src/config/db.js';

afterAll(async () => {
  // Desabilita FKs
  await pool.query('SET FOREIGN_KEY_CHECKS = 0');

  // Busca as tabelas
  const [tables] = await pool.query(`
    SELECT TABLE_NAME
    FROM information_schema.tables
    WHERE table_schema = 'feorganizada_clone'
  `);

  // Limpa todas as tabelas
  for (const { TABLE_NAME } of tables) {
    await pool.query(`TRUNCATE TABLE \`${TABLE_NAME}\``);
  }

  // Reativa FKs
  await pool.query('SET FOREIGN_KEY_CHECKS = 1');

  // Fecha o pool
  await pool.end();
});
