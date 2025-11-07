class admModel {
  async cadastrarAdm(igreja_id, membros_id, login, senha, connection) {
    const [admCadastro] = await connection.query(
      'INSERT INTO membros_adm (igreja_id, membros_id, login, senha) VALUES (?, ?, ?, ?)',
      [igreja_id, membros_id, login, senha]
    );

    return admCadastro.insertId;
  }

  async buscarADM(login, url, connection) {
    const [adm] = await connection.query(
      'SELECT membros_adm.id, login, senha, url FROM membros_adm JOIN igreja ON igreja.id = membros_adm.igreja_id WHERE login = ? AND url = ?',
      [login, url]
    );

    if (adm.length > 0) {
      return adm[0];
    }

    return false;
  }

  async alterarSenhaAdm(login, id, novaSenha, connection) {
    const [adm] = await connection.query(
      'UPDATE membros_adm SET senha = ? WHERE login = ? AND id = ?',
      [novaSenha, login, id]
    );
    return adm.affectedRows;
  }
}

export default new admModel();
