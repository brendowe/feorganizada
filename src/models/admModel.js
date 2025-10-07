class admModel {
  async buscarADM(login, url, connection) {
    const [adm] = await connection.query(
      'SELECT login, senha, url from membros_adm join igreja on igreja.id = membros_adm.igreja_id  where login = ? and url = ?',
      [login, url]
    );

    if (adm.length > 0) {
      return adm[0];
    }

    return false;
  }
}

export default new admModel();
