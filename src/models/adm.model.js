class AdmModel {
  constructor(connection) {
    this.connection = connection;
  }

  async cadastrarAdm(igrejaId, membroId, login, senha) {
    const [result] = await this.connection.query(
      'INSERT INTO membros_adm (igreja_id, membros_id, login, senha) VALUES (?, ?, ?, ?)',
      [igrejaId, membroId, login, senha]
    );

    return result.insertId;
  }

  async buscarAdm(login, url) {
    const [rows] = await this.connection.query(
      'SELECT membros_adm.id, membros_adm.login, membros_adm.senha, igreja.url FROM membros_adm JOIN igreja ON igreja.id = membros_adm.igreja_id WHERE membros_adm.login = ? AND igreja.url = ?',
      [login, url]
    );

    return rows[0] || null;
  }

  async verificarAdm(membroId, igrejaId) {
    const [rows] = await this.connection.query(
      'SELECT membros_adm.id FROM membros_adm WHERE membros_adm.membros_id = ? AND membros_adm.igreja_id = ?',
      [membroId, igrejaId]
    );

    return rows.length > 0;
  }

  async alterarSenhaAdm(login, admId, novaSenha) {
    const [result] = await this.connection.query(
      'UPDATE membros_adm SET senha = ? WHERE membros_adm.login = ? AND membros_adm.id = ?',
      [novaSenha, login, admId]
    );
    return result.affectedRows;
  }
}

export default AdmModel;
