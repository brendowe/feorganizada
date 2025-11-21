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

    if(ministerio.length > 0) {
        return ministerio
    }


    return null;
  }


 async verificarMinisterio(igrejaId, nome, connection) {
    const [ministerio] = await connection.query(
      'SELECT * FROM ministerios WHERE igreja_id = ? AND nome = ?',
      [igrejaId, nome]
    );


    return ministerio.length > 0;
  }


  async buscarMembrosMinisterio(ministerioId, igrejaId, connection) {
    const [membros] = await connection.query(
      'SELECT * FROM ministerios_membros WHERE ministerios_id = ? AND igreja_id = ?',
      [ministerioId, igrejaId]
    );

    return membros;
  }

  async cadastrarMembroMinisterio(ministerioId, membroId, funcao, connection) {
    const [membro] = await connection.query(
      `INSERT INTO ministerios_membros (ministerios_id, membros_id, funcao) VALUES (?, ?, ?)`,
      [ministerioId, membroId, funcao]
    );

    return membro.insertId;
  }
}

export default new ministerioModel();
