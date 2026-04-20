class MinisterioModel {
  constructor(connection) {
    this.connection = connection;
  }
  async cadastrarMinisterio(nomeMinisterio, igrejaId) {
    const [result] = await this.connection.query(
      `INSERT INTO ministerio (nome, igreja_id) VALUES (?, ?)`,
      [nomeMinisterio, igrejaId]
    );

    return result.insertId;
  }

  async buscarMinisterios(igrejaId) {
    const [rows] = await this.connection.query(
      'SELECT * FROM ministerio WHERE igreja_id = ?',
      [igrejaId]
    );
    return rows;
  }

  async buscarMinisterio(igrejaId, nome) {
    const [row] = await this.connection.query(
      'SELECT * FROM ministerio WHERE igreja_id = ? AND nome = ?',
      [igrejaId, nome]
    );

    return row;
  }

  async verificarMinisterioId(igrejaId, ministerioId) {
    const [row] = await this.connection.query(
      'SELECT 1 FROM ministerio WHERE igreja_id = ? AND id = ?',
      [igrejaId, ministerioId]
    );

    return row.length > 0;
  }

  async verificarMinisterio(igrejaId, nomeMinisterio) {
    const [row] = await this.connection.query(
      'SELECT 1 FROM ministerio WHERE igreja_id = ? AND nome = ?',
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
    membro memb
        JOIN
    ministerio_membro mm ON memb.id = mm.membro_id
        JOIN
    ministerio mini ON mini.id = mm.ministerio_id
WHERE
    mini.id = ? AND mini.igreja_id = ?`,
      [ministerioId, igrejaId]
    );

    return rows;
  }

  async verificarMembroMinisterio(ministerioId, membroId) {
    const [row] = await this.connection.query(
      'SELECT 1 FROM ministerio_membro WHERE ministerio_id = ? AND membro_id = ?',
      [ministerioId, membroId]
    );

    return row.length > 0;
  }

  async cadastrarMembroMinisterio(ministerioId, membroId, funcao) {
    const [result] = await this.connection.query(
      `INSERT INTO ministerio_membro (ministerio_id, membro_id, funcao) VALUES (?, ?, ?)`,
      [ministerioId, membroId, funcao]
    );

    return result.insertId;
  }

  async deletarMinisterioMembro(membroId, igrejaId) {
    const [result] = await this.connection.query(
      'DELETE mm FROM ministerio_membro mm JOIN ministerio m ON mm.ministerio_id = m.id JOIN igreja i ON m.igreja_id = i.id WHERE mm.membro_id = ? AND i.id = ?',
      [membroId, igrejaId]
    );
    return result.affectedRows;
  }
}

export default MinisterioModel;
