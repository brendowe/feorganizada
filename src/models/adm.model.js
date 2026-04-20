class AdmModel {
  constructor(connection) {
    this.connection = connection;
  }

  async cadastrarAdm(igrejaId, membroId, login, senha) {
    const [result] = await this.connection.query(
      'INSERT INTO membro_adm (igreja_id, membro_id, login, senha) VALUES (?, ?, ?, ?)',
      [igrejaId, membroId, login, senha]
    );

    return result.insertId;
  }

  async buscarAdm(login, url) {
    const [rows] = await this.connection.query(
      'SELECT membro_adm.id, membro_adm.login, membro_adm.senha, igreja.url FROM membro_adm JOIN igreja ON igreja.id = membro_adm.igreja_id WHERE membro_adm.login = ? AND igreja.url = ?',
      [login, url]
    );

    return rows[0] || null;
  }

  async verificarAdm(membroId, igrejaId) {
    const [rows] = await this.connection.query(
      'SELECT membro_adm.id FROM membro_adm WHERE membro_adm.membro_id = ? AND membro_adm.igreja_id = ?',
      [membroId, igrejaId]
    );

    return rows.length > 0;
  }

  async alterarSenhaAdm(login, admId, novaSenha) {
    const [result] = await this.connection.query(
      'UPDATE membro_adm SET senha = ? WHERE membro_adm.login = ? AND membro_adm.id = ?',
      [novaSenha, login, admId]
    );
    return result.affectedRows;
  }
}

export default AdmModel;
