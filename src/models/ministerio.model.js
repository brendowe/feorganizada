class MinisterioModel {
  constructor(connection) {
    this.connection = connection;
  }
  async cadastrarMinisterio(nomeMinisterio, igrejaId) {
    const [result] = await this.connection.query(
      `INSERT INTO ministerios (nome, igreja_id) VALUES (?, ?)`,
      [nomeMinisterio, igrejaId]
    );

    return result.insertId;
  }

  async buscarMinisterios(igrejaId) {
    const [rows] = await this.connection.query(
      'SELECT * FROM ministerios WHERE igreja_id = ?',
      [igrejaId]
    );
    return rows;
  }

  async buscarMinisterio(igrejaId, nome) {
    const [row] = await this.connection.query(
      'SELECT * FROM ministerios WHERE igreja_id = ? AND nome = ?',
      [igrejaId, nome]
    );

    return row;
  }

  async verificarMinisterioId(igrejaId, ministerioId) {
    const [row] = await this.connection.query(
      'SELECT 1 FROM ministerios WHERE igreja_id = ? AND id = ?',
      [igrejaId, ministerioId]
    );

    return row.length > 0;
  }

  async verificarMinisterio(igrejaId, nomeMinisterio) {
    const [row] = await this.connection.query(
      'SELECT 1 FROM ministerios WHERE igreja_id = ? AND nome = ?',
      [igrejaId, nomeMinisterio]
    );

    return row.length > 0;
  }

  async buscarMembrosMinisterio(ministerioId, igrejaId) {
    const [rows] = await this.connection.query(
      `SELECT
    memb.nome AS Nome,
    mini.id AS IdMinisterio,
    mini.nome AS Ministerio,
    mm.funcao AS Funcao,
    memb.igreja_id AS idIgreja
FROM
    membros memb
        JOIN
    ministerios_membros mm ON memb.id = mm.membros_id
        JOIN
    ministerios mini ON mini.id = mm.ministerios_id
WHERE
    mini.id = ? AND mini.igreja_id = ?`,
      [ministerioId, igrejaId]
    );

    return rows;
  }

  async verificarMembroMinisterio(ministerioId, membroId) {
    const [row] = await this.connection.query(
      'SELECT 1 FROM ministerios_membros WHERE ministerios_id = ? AND membros_id = ?',
      [ministerioId, membroId]
    );

    return row.length > 0;
  }

  async cadastrarMembroMinisterio(ministerioId, membroId, funcao) {
    const [result] = await this.connection.query(
      `INSERT INTO ministerios_membros (ministerios_id, membros_id, funcao) VALUES (?, ?, ?)`,
      [ministerioId, membroId, funcao]
    );

    return result.insertId;
  }

  async deletarMinisterioMembro(membroId, igrejaId) {
    const [result] = await this.connection.query(
      'DELETE mm FROM ministerios_membros mm JOIN ministerios m ON mm.ministerios_id = m.id JOIN igreja i ON m.igreja_id = i.id WHERE mm.membros_id = ? AND i.id = ?',
      [membroId, igrejaId]
    );
    return result.affectedRows;
  }
}

export default MinisterioModel;
