class masterModel {
  async cadastrarMaster(igreja_id, membros_id, master, connection) {
    const [masterCadastro] = await connection.query(
      'INSERT INTO membros_master (login, senha, email, membros_id, igreja_id) VALUES (?, ?, ?, ?, ?)',
      [master.login, master.senha, master.email, membros_id, igreja_id]
    );
  }

  async verificarMaster(email, connection) {
    const [emailVerificado] = await connection.query(
      'SELECT * FROM membros_master WHERE email = ?',
      [email]
    );

    return emailVerificado.length > 0;
  }

  async buscarMaster(login, url, connection) {
    const [master] = await connection.query(
      'SELECT login, senha, url from membros_master join igreja on igreja.id = membros_master.igreja_id  where login = ? and url = ?',
      [login, url]
    );

    if (master.length > 0) {
      return master[0];
    }

    return false;
  }
}

export default new masterModel();
