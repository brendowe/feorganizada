import admModel from '../../src/models/admModel.js';

describe('Testes do admModel', () => {

    describe('Testes do admModel.cadastrarAdm', ()=> {

        test('Deve retornar o id do adm cadastrado', async () => {
            const mockAdm = {
                id: 6,
                igrejaId: 2,
                membrosId: 66,
                login: 'carlossilva',
                senha: 'senhaSegura123'
            }

            const connection = {
                query: jest.fn().mockResolvedValue([{insertId: 6}])
            }


            const result = await admModel.cadastrarAdm(mockAdm.igrejaId, mockAdm.membrosId, mockAdm.login, mockAdm.senha, connection);

            expect(connection.query).toHaveBeenCalledWith('INSERT INTO membros_adm (igreja_id, membros_id, login, senha) VALUES (?, ?, ?, ?)', [mockAdm.igrejaId, mockAdm.membrosId, mockAdm.login, mockAdm.senha]);

            expect(result).toEqual(mockAdm.id);





















        })
























    })


























  describe('Testes do admModel.buscarADM', () => {
    test('Retorna o adm cadastrado', async () => {
      const mockAdm = {
        login: 'carlossilva',
        senha: 'senhaSegura123',
        url: 'esperanca-viva-sp',
      };

      const connection = {
        query: jest.fn().mockResolvedValue([[mockAdm]]),
      };

      const result = await admModel.buscarADM(
        mockAdm.login,
        mockAdm.url,
        connection
      );

      expect(connection.query).toHaveBeenCalledWith(
        'SELECT login, senha, url FROM membros_adm JOIN igreja ON igreja.id = membros_adm.igreja_id WHERE login = ? AND url = ?',
        [mockAdm.login, mockAdm.url]
      );

      expect(result).toEqual(mockAdm);
    });

    test('Retorna false caso o adm não esteja cadastrado', async () => {
      const mockAdm = {
        login: 'carlossilva',
        senha: 'senhaSegura123',
        url: 'esperanca-viva-sp',
      };

      const connection = {
        query: jest.fn().mockResolvedValue([[]]),
      };

      const result = await admModel.buscarADM(
        mockAdm.login,
        mockAdm.url,
        connection
      );

      expect(connection.query).toHaveBeenCalledWith(
        'SELECT login, senha, url FROM membros_adm JOIN igreja ON igreja.id = membros_adm.igreja_id WHERE login = ? AND url = ?',
        [mockAdm.login, mockAdm.url]
      );

      expect(result).toBe(false);
    });
  });
});
