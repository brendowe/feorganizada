import { beforeEach, jest } from '@jest/globals';
import AdmModel from '../../../src/models/adm.model.js';

const mockAdm = {
  id: 6,
  igrejaId: 2,
  membrosId: 66,
  login: 'carlossilva',
  senha: 'senhaSegura123',
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Testes do admModel', () => {
  describe('Testes do admModel.cadastrarAdm', () => {
    test('Deve retornar o id do adm cadastrado', async () => {
      const mockQuery = jest.fn().mockResolvedValue([{ insertId: mockAdm.id }]);

      const admModel = new AdmModel({
        query: mockQuery,
      });

      const result = await admModel.cadastrarAdm(
        mockAdm.igrejaId,
        mockAdm.membrosId,
        mockAdm.login,
        mockAdm.senha
      );

      expect(mockQuery).toHaveBeenCalledWith(
        'INSERT INTO membro_adm (igreja_id, membro_id, login, senha) VALUES (?, ?, ?, ?)',
        [mockAdm.igrejaId, mockAdm.membrosId, mockAdm.login, mockAdm.senha]
      );

      expect(result).toEqual(mockAdm.id);
    });
  });

  describe('Testes do admModel.buscarAdm', () => {
    test('Retorna o adm cadastrado', async () => {
      const mockQuery = jest.fn().mockResolvedValue([[mockAdm]]);

      const admModel = new AdmModel({
        query: mockQuery,
      });

      const result = await admModel.buscarAdm(mockAdm.login, mockAdm.url);

      expect(mockQuery).toHaveBeenCalledWith(
        'SELECT membro_adm.id, membro_adm.login, membro_adm.senha, igreja.url FROM membro_adm JOIN igreja ON igreja.id = membro_adm.igreja_id WHERE membro_adm.login = ? AND igreja.url = ?',
        [mockAdm.login, mockAdm.url]
      );

      expect(result).toEqual(mockAdm);
    });

    test('Retorna null caso o adm não esteja cadastrado', async () => {
      const mockQuery = jest.fn().mockResolvedValue([[]]);

      const admModel = new AdmModel({ query: mockQuery });

      const result = await admModel.buscarAdm(mockAdm.login, mockAdm.url);

      expect(mockQuery).toHaveBeenCalledWith(
        'SELECT membro_adm.id, membro_adm.login, membro_adm.senha, igreja.url FROM membro_adm JOIN igreja ON igreja.id = membro_adm.igreja_id WHERE membro_adm.login = ? AND igreja.url = ?',
        [mockAdm.login, mockAdm.url]
      );

      expect(result).toBe(null);
    });
  });

  describe('Testes do admModel.alterarSenhaAdm', () => {
    test('Retorna o número de linhas alteradas no banco', async () => {
      const mockAdm = {
        login: 'Brendo',
        novaSenha: 12345,
        id: 71,
      };

      const mockQuery = jest.fn().mockResolvedValue([{ affectedRows: 1 }]);

      const admModel = new AdmModel({ query: mockQuery });

      const result = await admModel.alterarSenhaAdm(
        mockAdm.login,
        mockAdm.id,
        mockAdm.novaSenha
      );

      expect(mockQuery).toHaveBeenCalledWith(
        'UPDATE membro_adm SET senha = ? WHERE membro_adm.login = ? AND membro_adm.id = ?',
        [mockAdm.novaSenha, mockAdm.login, mockAdm.id]
      );

      expect(result).toEqual(1);
    });
  });
});
