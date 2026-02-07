import igrejaModel from './igrejaModel.js';

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

    return membroEndereco.insertId;
  }

  async cadastrarTelefone(membros_id, telefone, connection) {
    const [membroTelefone] = await connection.query(
      'INSERT INTO membros_telefone (telefone, membros_id) VALUES (?, ?)',
      [telefone, membros_id]
    );

    return membroTelefone.insertId;
  }

  async buscarMembros(url, connection) {
    const [membros] = await connection.query(
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
    url = ? `,
      [url]
    );

    return membros;
  }

  async buscarMembro(url, id, connection) {
    const [membro] = await connection.query(
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
    url = ? AND m.id = ?`,
      [url, id]
    );

    if (membro.length > 0) {
      return membro[0];
    }

    return null;
  }

  async buscarAniversariantes(url, mes, connection) {
    const [aniversariantes] = await connection.query(
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
    url = ? AND MONTH (m.nascimento) = ?`,
      [url, mes]
    );

    return aniversariantes;
  }

  async deletarMembro(igrejaId, id, connection) {
    const [result] = await connection.query(
      `DELETE FROM membros
WHERE igreja_id = ? AND id = ?`,
      [igrejaId, id]
    );

    return result.affectedRows;
  }

  async deletarEndereco(id, igrejaId, connection) {
    const [result] = await connection.query(
      `DELETE me FROM membros_endereco me join membros m on me.membros_id = m.id join igreja i on m.igreja_id = i.id
WHERE me.membros_id = ? AND i.id = ?`,
      [id, igrejaId]
    );
    return result.affectedRows;
  }

  async deletarTelefone(id, igrejaId, connection) {
    const [result] = await connection.query(
      `DELETE mt FROM membros_telefone mt join membros m on mt.membros_id = m.id join igreja i on m.igreja_id = i.id
WHERE mt.membros_id = ? AND i.id = ?`,
      [id, igrejaId]
    );
    return result.affectedRows;
  }
}

export default new membrosModel();
