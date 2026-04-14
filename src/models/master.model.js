class MasterModel {
  constructor(connection) {
    this.connection = connection;
  }
  async cadastrarMaster(igrejaId, membrosId, master) {
    const [result] = await this.connection.query(
      'INSERT INTO membros_master (login, senha, email, membros_id, igreja_id) VALUES (?, ?, ?, ?, ?)',
      [master.login, master.senha, master.email, membrosId, igrejaId]
    );

    return result.insertId;
  }

  async verificarMaster(email) {
    const [row] = await this.connection.query(
      'SELECT 1 FROM membros_master WHERE email = ? limit 1',
      [email]
    );

    return row.length > 0;
  }

  async buscarMaster(login, url) {
    const [row] = await this.connection.query(
      'SELECT mm.login, mm.senha, i.url from membros_master mm join igreja i on i.id = mm.igreja_id where mm.login = ? and i.url = ? limit 1',
      [login, url]
    );

    return row[0] || null;
  }
}

export default MasterModel;
