class membrosModel {
  async cadastrarMembro(igreja_id, nome, nascimento, connection) {
    const [membroCadastro] = await connection.query(
      'INSERT INTO membros (nome, nascimento, igreja_id) VALUES (?, ?, ?)',
      [nome, nascimento, igreja_id]
    );
    return membroCadastro.insertId;
  }


  async cadastrarEndereco(membros_id, endereco, connection) {
    const [membroEndereco] = await connection.query('INSERT INTO membros_endereco (estado, cidade, bairro, rua, complemento, membros_id) VALUES (?, ?, ?, ?, ?, ?)', [endereco.estado, endereco.cidade, endereco.bairro, endereco.rua, endereco.complemento, membros_id]);
  }

  async cadastrarTelefone(membros_id, telefone, connection) {
    const [membroTelefone] = await connection.query('INSERT INTO membros_telefone (telefone, membros_id) VALUES (?, ?)', [telefone, membros_id]);
  }

}

export default new membrosModel();
