class membrosModel {
  async cadastrarMembro(igreja_id, nome, nascimento, connection) {
    const [membroCadastro] = await connection.query(
      'INSERT INTO membros (nome, nascimento, igreja_id) VALUES (?, ?, ?)',
      [nome, nascimento, igreja_id]
    );
    return membroCadastro.insertId;
  }

  async cadastrarEndereco(membros_id, endereco, connection) {
    const [membroEndereco] = await connection.query(
      'INSERT INTO membros_endereco (estado, cidade, bairro, rua, complemento, membros_id) VALUES (?, ?, ?, ?, ?, ?)',
      [
        endereco.estado,
        endereco.cidade,
        endereco.bairro,
        endereco.rua,
        endereco.complemento,
        membros_id,
      ]
    );
  }

  async cadastrarTelefone(membros_id, telefone, connection) {
    const [membroTelefone] = await connection.query(
      'INSERT INTO membros_telefone (telefone, membros_id) VALUES (?, ?)',
      [telefone, membros_id]
    );
  }

  async buscarMembros(url, connection) {
    const [membros] = await connection.query('SELECT m.id, m.nome, m.nascimento,    i.nome AS nomeIgreja,    i.url FROM membros m   JOIN igreja i ON i.id = m.igreja_id WHERE  url = ?', [url]);

    return membros;
  }

   async buscarMembro(url, id, connection) {
    const [membro] = await connection.query('SELECT m.id, m.nome, m.nascimento,    i.nome AS nomeIgreja,    i.url FROM membros m   JOIN igreja i ON i.id = m.igreja_id WHERE  url = ? AND m.id = ?', [url, id]);

    return membro;
  }


}

export default new membrosModel();
