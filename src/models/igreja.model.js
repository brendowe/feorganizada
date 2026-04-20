class IgrejaModel {
  constructor(connection) {
    this.connection = connection;
  }
  async cadastrarIgreja(nomeIgreja, url) {
    const [result] = await this.connection.query(
      'INSERT INTO igreja (nome, url) VALUES (?, ?)',
      [nomeIgreja, url]
    );
    return result.insertId;
  }

  async cadastrarEndereço(igrejaId, igrejaEndereco) {
    const [result] = await this.connection.query(
      'INSERT INTO igreja_endereco (igreja_id, estado, cidade, bairro, rua, complemento) VALUES (?, ?, ?, ?, ?, ?)',
      [
        igrejaId,
        igrejaEndereco.estado,
        igrejaEndereco.cidade,
        igrejaEndereco.bairro,
        igrejaEndereco.rua,
        igrejaEndereco.complemento,
      ]
    );

    return result.insertId;
  }

  async cadastrarTelefone(igrejaId, telefoneIgreja) {
    const [result] = await this.connection.query(
      'INSERT INTO igreja_telefone (igreja_id, telefone) VALUES (?, ?)',
      [igrejaId, telefoneIgreja]
    );

    return result.insertId;
  }

  async verificarIgreja(url) {
    const [row] = await this.connection.query(
      'SELECT url FROM igreja WHERE url = ?',
      [url]
    );

    return row.length > 0;
  }

  async igrejaId(url) {
    const [row] = await this.connection.query(
      'SELECT id FROM igreja WHERE url = ?',
      [url]
    );

    return row.length > 0 ? row[0].id : null;
  }
}

export default IgrejaModel;
