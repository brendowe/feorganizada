class MembrosModel {
  constructor(connection) {
    this.connection = connection;
  }
  async cadastrarMembro(igrejaId, nome, nascimento) {
    const [result] = await this.connection.query(
      'INSERT INTO membros (nome, nascimento, igreja_id) VALUES (?, ?, ?)',
      [nome, nascimento, igrejaId]
    );
    return result.insertId;
  }

  async cadastrarEndereco(membrosId, endereco) {
    const [result] = await this.connection.query(
      'INSERT INTO membros_endereco (estado, cidade, bairro, rua, complemento, membros_id) VALUES (?, ?, ?, ?, ?, ?)',
      [
        endereco.estado,
        endereco.cidade,
        endereco.bairro,
        endereco.rua,
        endereco.complemento,
        membrosId,
      ]
    );

    return result.insertId;
  }

  async cadastrarTelefone(membrosId, telefone) {
    const [result] = await this.connection.query(
      'INSERT INTO membros_telefone (telefone, membros_id) VALUES (?, ?)',
      [telefone, membrosId]
    );

    return result.insertId;
  }

  async buscarMembros(url) {
    const [rows] = await this.connection.query(
      `SELECT
    m.id,
    m.nome,
    m.nascimento,
    i.nome AS nomeIgreja,
    i.url,
    me.estado,
    me.cidade,
    me.bairro,
    me.rua,
    me.complemento,
    mt.telefone
FROM
    membros m
        JOIN
    igreja i ON i.id = m.igreja_id
        JOIN
    membros_endereco me ON me.membros_id = m.id
        JOIN
    membros_telefone mt ON mt.membros_id = m.id
WHERE
    i.url = ? `,
      [url]
    );

    return rows;
  }

  async buscarMembro(url, membroId) {
    const [row] = await this.connection.query(
      `SELECT
    m.id,
    m.nome,
    m.nascimento,
    i.nome AS nomeIgreja,
    i.url,
    me.estado,
    me.cidade,
    me.bairro,
    me.rua,
    me.complemento,
    mt.telefone
FROM
    membros m
        JOIN
    igreja i ON i.id = m.igreja_id
        JOIN
    membros_endereco me ON me.membros_id = m.id
        JOIN
    membros_telefone mt ON mt.membros_id = m.id
WHERE
    i.url = ? AND m.id = ?`,
      [url, membroId]
    );

    return row[0];
  }

  async buscarAniversariantes(url, mes) {
    const [rows] = await this.connection.query(
      `SELECT
    m.id,
    m.nome,
    m.nascimento,
    mt.telefone
FROM
    membros m
        JOIN
    igreja i ON i.id = m.igreja_id
        JOIN
    membros_telefone mt ON mt.membros_id = m.id
WHERE
    i.url = ? AND MONTH (m.nascimento) = ?`,
      [url, mes]
    );

    return rows;
  }

  async deletarMembro(igrejaId, membroId) {
    const [result] = await this.connection.query(
      `DELETE FROM membros
WHERE igreja_id = ? AND id = ?`,
      [igrejaId, membroId]
    );

    return result.affectedRows;
  }
}

export default MembrosModel;
