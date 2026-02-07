class ministerioModel {
  async cadastrarMinisterio(nomeMinisterio, igrejaId, connection) {
    const [ministerio] = await connection.query(
      `INSERT INTO ministerios (nome, igreja_id) VALUES (?, ?)`,
      [nomeMinisterio, igrejaId]
    );

    return ministerio.insertId;
  }

  async buscarMinisterios(igrejaId, connection) {
    const [ministerios] = await connection.query(
      'SELECT * FROM ministerios WHERE igreja_id = ?',
      [igrejaId]
    );
    return ministerios;
  }

  async buscarMinisterio(igrejaId, nome, connection) {
    const [ministerio] = await connection.query(
      'SELECT * FROM ministerios WHERE igreja_id = ? AND nome = ?',
      [igrejaId, nome]
    );

    if (ministerio.length > 0) {
      return ministerio;
    }

    return null;
  }

  async verificarMinisterioId(igrejaId, ministerioId, connection) {
    const [ministerio] = await connection.query(
      'SELECT * FROM ministerios WHERE igreja_id = ? AND id = ?',
      [igrejaId, ministerioId]
    );

    if (ministerio.length > 0) {
      return true;
    }

    return false;
  }

  async verificarMinisterio(igrejaId, nomeMinisterio, connection) {
    const [ministerio] = await connection.query(
      'SELECT * FROM ministerios WHERE igreja_id = ? AND nome = ?',
      [igrejaId, nomeMinisterio]
    );

    return ministerio.length > 0;
  }

  async buscarMembrosMinisterio(ministerioId, igrejaId, connection) {
    const [membros] = await connection.query(
      `SELECT
    memb.nome AS Nome,
    mini.id AS IdMinisterio,
    mini.nome AS Ministerio,
    mm.funcao AS Função,
    memb.igreja_id AS idIgreja
FROM
    membros memb
        JOIN
    ministerios_membros mm ON memb.id = mm.id
        JOIN
    ministerios mini ON mini.id = mm.ministerios_id
WHERE
    mini.id = ? AND mini.igreja_id = ?`,
      [ministerioId, igrejaId]
    );

    if (membros.length > 0) {
      return membros;
    }

    return null;
  }

  async verificarMembroMinisterio(ministerioId, membroId, connection) {
    const [membro] = await connection.query(
      'SELECT * FROM ministerios_membros WHERE ministerios_id = ? AND membros_id = ?',
      [ministerioId, membroId]
    );

    if (membro.length > 0) {
      return true;
    }

    return false;
  }

  async cadastrarMembroMinisterio(ministerioId, membroId, funcao, connection) {
    const [membro] = await connection.query(
      `INSERT INTO ministerios_membros (ministerios_id, membros_id, funcao) VALUES (?, ?, ?)`,
      [ministerioId, membroId, funcao]
    );

    return membro.insertId;
  }

  async deletarMinisterioMembro(membroId, igrejaId, connection) {
    const [result] = await connection.query(
      'DELETE mm FROM ministerios_membros mm JOIN ministerios m ON mm.ministerios_id = m.id JOIN igreja i ON m.igreja_id = i.id WHERE mm.membros_id = ? AND i.id = ?',
      [membroId, igrejaId]
    );
    return result.affectedRows;
  }
}

export default new ministerioModel();
