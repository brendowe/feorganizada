import { jest } from '@jest/globals';
import MasterModel from '../../../src/models/master.model.js';

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

      const mockQuery = jest.fn().mockResolvedValue([{ insertId: 1 }]);

      const masterModel = new MasterModel({ query: mockQuery });

      const result = await masterModel.cadastrarMaster(
        mockUser.igreja_id,
        mockUser.membros_id,
        mockUser
      );

      expect(mockQuery).toHaveBeenCalledWith(
        'INSERT INTO membros_master (login, senha, email, membros_id, igreja_id) VALUES (?, ?, ?, ?, ?)',
        [
          mockUser.login,
          mockUser.senha,
          mockUser.email,
          mockUser.membros_id,
          mockUser.igreja_id,
        ]
      );

      expect(result).toBe(1);
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

      const mockQuery = jest.fn().mockResolvedValue([[mockUser]]);

      const masterModel = new MasterModel({ query: mockQuery });

      const result = await masterModel.verificarMaster('carlossilva@email.com');

      expect(mockQuery).toHaveBeenCalledWith(
        'SELECT 1 FROM membros_master WHERE email = ? limit 1',
        ['carlossilva@email.com']
      );

      expect(result).toBe(true);
    });

    test('Deve retornar false se o e-mail não foi encontrado', async () => {

        const mockQuery = jest.fn().mockResolvedValue([[]]);

      const masterModel = new MasterModel({ query: mockQuery });

      const result = await masterModel.verificarMaster(
        'carlossilva@email.com'
      );

      expect(mockQuery).toHaveBeenCalledWith(
        'SELECT 1 FROM membros_master WHERE email = ? limit 1',
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

     const mockQuery = jest.fn().mockResolvedValue([[mockUser]]);

      const masterModel = new MasterModel({ query: mockQuery });

      const result = await masterModel.buscarMaster(
        'Brendo',
        'esperanca-viva-sp'
      );

      expect(mockQuery).toHaveBeenCalledWith(
        'SELECT mm.login, mm.senha, i.url from membros_master mm join igreja i on i.id = mm.igreja_id where mm.login = ? and i.url = ? limit 1',
        ['Brendo', 'esperanca-viva-sp']
      );

      expect(result).toEqual(mockUser);
    });

    test('Deve retornar null caso não encontre o usuário Master', async () => {
      const mockQuery = jest.fn().mockResolvedValue([[]]);

      const masterModel = new MasterModel({ query: mockQuery });

      const result = await masterModel.buscarMaster(
        'Brendo',
        'esperanca-viva-sp'
      );

      expect(mockQuery).toHaveBeenCalledWith(
        'SELECT mm.login, mm.senha, i.url from membros_master mm join igreja i on i.id = mm.igreja_id where mm.login = ? and i.url = ? limit 1',
        ['Brendo', 'esperanca-viva-sp']
      );

      expect(result).toBe(null);
    });
  });
});
