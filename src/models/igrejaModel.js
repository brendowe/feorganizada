class igrejaModel {
  async cadastrarIgreja(nomeIgreja, url, connection) {
    const [igrejaCadastro] = await connection.query(
      'INSERT INTO igreja (nome, url) VALUES (?, ?)',
      [nomeIgreja, url]
    );
    return igrejaCadastro.insertId;
  }

  async cadastrarEndereço(igrejaId, endereco, connection) {
    const [enderecoCadastro] = await connection.query(
      'INSERT INTO igreja_endereco (igreja_id, estado, cidade, bairro, rua, complemento) VALUES (?, ?, ?, ?, ?, ?)',
      [
        igrejaId,
        endereco.estado,
        endereco.cidade,
        endereco.bairro,
        endereco.rua,
        endereco.complemento
      ]
    );
  }

  async cadastrarTelefone(igreja_id, telefoneIgreja, connection) {
    const [telefoneCadastro] = await connection.query(
      'INSERT INTO igreja_telefone (igreja_id, telefone) VALUES (?, ?)',
      [igreja_id, telefoneIgreja]
    );
  }

  async verificarIgreja(url, connection) {
    const [urlVerificada] = await connection.query(
      'SELECT * FROM igreja WHERE url = ?',
      [url]
    );

    return urlVerificada.length > 0;
  }
}

export default new igrejaModel();
