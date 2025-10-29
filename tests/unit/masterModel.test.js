import masterModel from '../../src/models/masterModel.js';

describe('Testes do masterModel', () => {
  describe('Testes do masterModel.cadastrarMaster', () => {
    test('Deve verificar se o Master foi cadastrado', async () => {
      const mockUser = {
        id: 1,
        login: 'carlossilva',
        senha: '$2b$12$m6cbTn4Y661HbzPG0h9DZeThfnd3CY7pY//WURMdcs1CXSFV2AXmS',
        email: 'carlossilva@email.com',
        membros_id: 1,
        igreja_id: 2,
      };

      const connection = {
        query: jest.fn().mockResolvedValue([{insertId: 1}]),
      };


      const result = await masterModel.cadastrarMaster(mockUser.igreja_id, mockUser.membros_id, mockUser, connection);

      expect(connection.query).toHaveBeenCalledWith('INSERT INTO membros_master (login, senha, email, membros_id, igreja_id) VALUES (?, ?, ?, ?, ?)',
      [mockUser.login, mockUser.senha, mockUser.email, mockUser.membros_id, mockUser.igreja_id]);

      expect(result).toBe(1)

    });
  });

  describe('Testes do masterModel.verificarMaster', () => {
    test('Deve retornar true se o e-mail já está cadastrado', async () => {
      const mockUser = {
        id: 1,
        login: 'carlossilva',
        senha: '$2b$12$m6cbTn4Y661HbzPG0h9DZeThfnd3CY7pY//WURMdcs1CXSFV2AXmS',
        email: 'carlossilva@email.com',
        membros_id: 1,
        igreja_id: 2,
      };

      const connection = {
        query: jest.fn().mockResolvedValue([[mockUser]]),
      };

      const result = await masterModel.verificarMaster(
        'carlossilva@email.com',
        connection
      );

      expect(connection.query).toHaveBeenCalledWith(
        'SELECT * FROM membros_master WHERE email = ?',
        ['carlossilva@email.com']
      );

      expect(result).toBe(true);
    });

    test('Deve retornar false se o e-mail não foi encontrado', async () => {
      const connection = {
        query: jest.fn().mockResolvedValue([[]]),
      };

      const result = await masterModel.verificarMaster(
        'carlossilva@email.com',
        connection
      );

      expect(connection.query).toHaveBeenCalledWith(
        'SELECT * FROM membros_master WHERE email = ?',
        ['carlossilva@email.com']
      );

      expect(result).toBe(false);
    });
  });

  describe('Testes do masterModel.buscarMaster', () => {
    test('Deve retornar o usuário Master encontrado', async () => {
      const mockUser = {
        login: 'Brendo',
        senha: 'senhaSegura123p',
        url: 'esperanca-viva-sp',
      };

      const connection = {
        query: jest.fn().mockResolvedValue([[mockUser]]),
      };

      const result = await masterModel.buscarMaster(
        'Brendo',
        'esperanca-viva-sp',
        connection
      );

      expect(connection.query).toHaveBeenCalledWith(
        'SELECT login, senha, url from membros_master join igreja on igreja.id = membros_master.igreja_id  where login = ? and url = ?',
        ['Brendo', 'esperanca-viva-sp']
      );

      expect(result).toEqual(mockUser);
    });

    test('Deve retornar false caso não encontre o usuário Master', async () => {
      const connection = {
        query: jest.fn().mockResolvedValue([[]]),
      };

      const result = await masterModel.buscarMaster(
        'Brendo',
        'esperanca-viva-sp',
        connection
      );

      expect(connection.query).toHaveBeenCalledWith(
        'SELECT login, senha, url from membros_master join igreja on igreja.id = membros_master.igreja_id  where login = ? and url = ?',
        ['Brendo', 'esperanca-viva-sp']
      );

      expect(result).toBe(false);
    });
  });
});
