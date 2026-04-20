import { beforeEach, jest } from '@jest/globals';
import MinisterioModel from '../../../src/models/ministerio.model.js';

const mockMinisterio = {
  id: 7,
  nome: 'Grupo de Louvor',
  igrejaId: 2,
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Testes do ministerioModel', () => {
  describe('Testes do ministerioModel.cadastrarMinisterio', () => {
    test('Retorna o id do ministerio cadastrado', async () => {
      const mockQuery = jest
        .fn()
        .mockResolvedValue([{ insertId: mockMinisterio.id }]);

      const ministerioModel = new MinisterioModel({ query: mockQuery });

      const result = await ministerioModel.cadastrarMinisterio(
        mockMinisterio.nome,
        mockMinisterio.igrejaId
      );

      expect(mockQuery).toHaveBeenCalledWith(
        'INSERT INTO ministerio (nome, igreja_id) VALUES (?, ?)',
        [mockMinisterio.nome, mockMinisterio.igrejaId]
      );

      expect(result).toEqual(mockMinisterio.id);
    });
  });

  describe('Testes do ministerioModel.buscarMinisterios', () => {
    test('Retorna a lista de ministerios', async () => {
      const mockMinisterios = [
        { id: 1, nome: 'EBD', igreja_id: 2 },
        { id: 2, nome: 'Grupo de Louvor', igreja_id: 2 },
        { id: 3, nome: 'Evangelismo', igreja_id: 2 },
      ];

      const mockQuery = jest.fn().mockResolvedValue([mockMinisterios]);

      const ministerioModel = new MinisterioModel({ query: mockQuery });

      const result = await ministerioModel.buscarMinisterios(
        mockMinisterio.igrejaId
      );

      expect(mockQuery).toHaveBeenCalledWith(
        'SELECT * FROM ministerio WHERE igreja_id = ?',
        [mockMinisterio.igrejaId]
      );

      expect(result).toEqual(mockMinisterios);
    });
  });

  describe('Testes do ministerioModel.buscarMinisterio', () => {
    test('Deve retornar o ministerio encontrado', async () => {
      const mockResultado = [
        {
          id: 10,
          nome: 'Escola Biblica Dominical',
          igreja_id: 2,
        },
      ];

      const mockQuery = jest.fn().mockResolvedValue([mockResultado]);

      const ministerioModel = new MinisterioModel({ query: mockQuery });

      const result = await ministerioModel.buscarMinisterio(
        mockMinisterio.igrejaId,
        'Escola Biblica Dominical'
      );

      expect(mockQuery).toHaveBeenCalledWith(
        'SELECT * FROM ministerio WHERE igreja_id = ? AND nome = ?',
        [mockMinisterio.igrejaId, 'Escola Biblica Dominical']
      );

      expect(result).toEqual(mockResultado);
    });

    test('Deve retornar array vazio caso nao encontre o ministerio', async () => {
      const mockQuery = jest.fn().mockResolvedValue([[]]);

      const ministerioModel = new MinisterioModel({ query: mockQuery });

      const result = await ministerioModel.buscarMinisterio(
        mockMinisterio.igrejaId,
        'Escola Biblica Dominical'
      );

      expect(mockQuery).toHaveBeenCalledWith(
        'SELECT * FROM ministerio WHERE igreja_id = ? AND nome = ?',
        [mockMinisterio.igrejaId, 'Escola Biblica Dominical']
      );

      expect(result).toEqual([]);
    });
  });

  describe('Testes do ministerioModel.verificarMinisterioId', () => {
    test('Deve retornar true se encontrar o ministerio', async () => {
      const mockQuery = jest.fn().mockResolvedValue([[{ id: 1 }]]);

      const ministerioModel = new MinisterioModel({ query: mockQuery });

      const result = await ministerioModel.verificarMinisterioId(
        mockMinisterio.igrejaId,
        mockMinisterio.id
      );

      expect(mockQuery).toHaveBeenCalledWith(
        'SELECT 1 FROM ministerio WHERE igreja_id = ? AND id = ?',
        [mockMinisterio.igrejaId, mockMinisterio.id]
      );

      expect(result).toBe(true);
    });

    test('Deve retornar false se nao encontrar o ministerio', async () => {
      const mockQuery = jest.fn().mockResolvedValue([[]]);

      const ministerioModel = new MinisterioModel({ query: mockQuery });

      const result = await ministerioModel.verificarMinisterioId(
        mockMinisterio.igrejaId,
        mockMinisterio.id
      );

      expect(mockQuery).toHaveBeenCalledWith(
        'SELECT 1 FROM ministerio WHERE igreja_id = ? AND id = ?',
        [mockMinisterio.igrejaId, mockMinisterio.id]
      );

      expect(result).toBe(false);
    });
  });

  describe('Testes do ministerioModel.verificarMinisterio', () => {
    test('Deve retornar true se o ministerio existir', async () => {
      const mockQuery = jest.fn().mockResolvedValue([[{ id: 10 }]]);

      const ministerioModel = new MinisterioModel({ query: mockQuery });

      const result = await ministerioModel.verificarMinisterio(
        mockMinisterio.igrejaId,
        'Escola Biblica Dominical'
      );

      expect(mockQuery).toHaveBeenCalledWith(
        'SELECT 1 FROM ministerio WHERE igreja_id = ? AND nome = ?',
        [mockMinisterio.igrejaId, 'Escola Biblica Dominical']
      );

      expect(result).toBe(true);
    });

    test('Deve retornar false se o ministerio nao existir', async () => {
      const mockQuery = jest.fn().mockResolvedValue([[]]);

      const ministerioModel = new MinisterioModel({ query: mockQuery });

      const result = await ministerioModel.verificarMinisterio(
        mockMinisterio.igrejaId,
        'Escola Biblica Dominical'
      );

      expect(mockQuery).toHaveBeenCalledWith(
        'SELECT 1 FROM ministerio WHERE igreja_id = ? AND nome = ?',
        [mockMinisterio.igrejaId, 'Escola Biblica Dominical']
      );

      expect(result).toBe(false);
    });
  });

  describe('Testes do ministerioModel.buscarMembrosMinisterio', () => {
    test('Retorna os membros quando o ministerio existe na igreja', async () => {
      const mockMembros = [
        {
          Nome: 'Juliana Pereira',
          IdMinisterio: 2,
          Ministerio: 'Escola Biblica Dominical',
          Funcao: 'Lider',
          idIgreja: 2,
        },
      ];

      const mockQuery = jest.fn().mockResolvedValue([mockMembros]);

      const ministerioModel = new MinisterioModel({ query: mockQuery });

      const result = await ministerioModel.buscarMembrosMinisterio(
        mockMinisterio.id,
        mockMinisterio.igrejaId
      );

      expect(mockQuery).toHaveBeenCalledWith(
        `SELECT
    memb.nome AS Nome,
    mini.id AS IdMinisterio,
    mini.nome AS Ministerio,
    mm.funcao AS Funcao,
    memb.igreja_id AS idIgreja
FROM
    membro memb
        JOIN
    ministerio_membro mm ON memb.id = mm.membro_id
        JOIN
    ministerio mini ON mini.id = mm.ministerio_id
WHERE
    mini.id = ? AND mini.igreja_id = ?`,
        [mockMinisterio.id, mockMinisterio.igrejaId]
      );

      expect(result).toEqual(mockMembros);
    });

    test('Retorna array vazio quando o ministerio nao possui membros', async () => {
      const mockQuery = jest.fn().mockResolvedValue([[]]);

      const ministerioModel = new MinisterioModel({ query: mockQuery });

      const result = await ministerioModel.buscarMembrosMinisterio(
        mockMinisterio.id,
        mockMinisterio.igrejaId
      );

      expect(mockQuery).toHaveBeenCalledWith(
        `SELECT
    memb.nome AS Nome,
    mini.id AS IdMinisterio,
    mini.nome AS Ministerio,
    mm.funcao AS Funcao,
    memb.igreja_id AS idIgreja
FROM
    membro memb
        JOIN
    ministerio_membro mm ON memb.id = mm.membro_id
        JOIN
    ministerio mini ON mini.id = mm.ministerio_id
WHERE
    mini.id = ? AND mini.igreja_id = ?`,
        [mockMinisterio.id, mockMinisterio.igrejaId]
      );

      expect(result).toEqual([]);
    });
  });

  describe('Testes do ministerioModel.verificarMembroMinisterio', () => {
    test('Deve retornar true se o membro esta cadastrado no ministerio', async () => {
      const mockMembro = {
        ministerioId: 2,
        membroId: 4,
      };

      const mockQuery = jest.fn().mockResolvedValue([[{ id: 6 }]]);

      const ministerioModel = new MinisterioModel({ query: mockQuery });

      const result = await ministerioModel.verificarMembroMinisterio(
        mockMembro.ministerioId,
        mockMembro.membroId
      );

      expect(mockQuery).toHaveBeenCalledWith(
        'SELECT 1 FROM ministerio_membro WHERE ministerio_id = ? AND membro_id = ?',
        [mockMembro.ministerioId, mockMembro.membroId]
      );

      expect(result).toBe(true);
    });

    test('Deve retornar false se o membro nao esta cadastrado no ministerio', async () => {
      const mockMembro = {
        ministerioId: 2,
        membroId: 4,
      };

      const mockQuery = jest.fn().mockResolvedValue([[]]);

      const ministerioModel = new MinisterioModel({ query: mockQuery });

      const result = await ministerioModel.verificarMembroMinisterio(
        mockMembro.ministerioId,
        mockMembro.membroId
      );

      expect(mockQuery).toHaveBeenCalledWith(
        'SELECT 1 FROM ministerio_membro WHERE ministerio_id = ? AND membro_id = ?',
        [mockMembro.ministerioId, mockMembro.membroId]
      );

      expect(result).toBe(false);
    });
  });

  describe('Testes do ministerioModel.cadastrarMembroMinisterio', () => {
    test('Deve retornar o id da relacao cadastrada', async () => {
      const mockMembro = {
        ministerioId: 2,
        membroId: 4,
        funcao: 'Membro',
      };

      const mockCadastroId = 5;
      const mockQuery = jest
        .fn()
        .mockResolvedValue([{ insertId: mockCadastroId }]);

      const ministerioModel = new MinisterioModel({ query: mockQuery });

      const result = await ministerioModel.cadastrarMembroMinisterio(
        mockMembro.ministerioId,
        mockMembro.membroId,
        mockMembro.funcao
      );

      expect(mockQuery).toHaveBeenCalledWith(
        'INSERT INTO ministerio_membro (ministerio_id, membro_id, funcao) VALUES (?, ?, ?)',
        [mockMembro.ministerioId, mockMembro.membroId, mockMembro.funcao]
      );

      expect(result).toEqual(mockCadastroId);
    });
  });

  describe('Testes do ministerioModel.deletarMinisterioMembro', () => {
    test('Deve retornar a quantidade de registros removidos', async () => {
      const mockMembro = {
        membroId: 4,
        igrejaId: 2,
      };

      const mockQuery = jest.fn().mockResolvedValue([{ affectedRows: 1 }]);

      const ministerioModel = new MinisterioModel({ query: mockQuery });

      const result = await ministerioModel.deletarMinisterioMembro(
        mockMembro.membroId,
        mockMembro.igrejaId
      );

      expect(mockQuery).toHaveBeenCalledWith(
        'DELETE mm FROM ministerio_membro mm JOIN ministerio m ON mm.ministerio_id = m.id JOIN igreja i ON m.igreja_id = i.id WHERE mm.membro_id = ? AND i.id = ?',
        [mockMembro.membroId, mockMembro.igrejaId]
      );

      expect(result).toBe(1);
    });
  });
});
