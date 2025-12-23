import { describe, expect, jest, test } from '@jest/globals';
import ministerioModel from '../../src/models/ministerioModel';

describe('Testes do ministerioModel', () => {
  describe('Testes do ministerioModel.cadastarMinisterio', () => {
    test('Retorna o id do ministerio cadastrado', async () => {
      const ministerioMock = {
        id: 7,
        nome: 'Grupo de Louvor',
        igreja_id: '2',
      };

      const connection = {
        query: jest.fn().mockResolvedValue([
          {
            insertId: 7,
          },
        ]),
      };

      const result = await ministerioModel.cadastrarMinisterio(
        ministerioMock.nome,
        ministerioMock.igreja_id,
        connection
      );

      expect(connection.query).toHaveBeenCalledWith(
        `INSERT INTO ministerios (nome, igreja_id) VALUES (?, ?)`,
        [ministerioMock.nome, ministerioMock.igreja_id]
      );

      expect(result).toEqual(7);
    });
  });

  describe('Testes do ministerioModel.buscarMinisterios', () => {
    test('Retorna a lista de ministerios', async () => {
      const mockMinisterios = [
        { id: 1, nome: 'EBD', igreja_id: 2 },
        { id: 2, nome: 'Grupo de Louvor', igreja_id: 2 },
        { id: 3, nome: 'Evangelismo', igreja_id: 2 },
        { id: 4, nome: 'Grupo Jovem', igreja_id: 2 },
      ];

      const igrejaId = 2;

      const connection = {
        query: jest.fn().mockResolvedValue([mockMinisterios]),
      };

      const result = await ministerioModel.buscarMinisterios(
        igrejaId,
        connection
      );

      expect(connection.query).toHaveBeenCalledWith(
        `SELECT * FROM ministerios WHERE igreja_id = ?`,
        [igrejaId]
      );

      expect(result).toEqual(mockMinisterios);
    });
  });

  describe('Testes do ministerioModel.buscarMinisterio', () => {
    test('Deve retornar o ministério encontrado', async () => {
      const mockMinisterio = [
        {
          id: 10,
          nome: 'Escola Bíblica Dominical',
          igreja_id: 2,
        },
      ];

      const ministerio = {
        nome: 'Escola Bíblica Dominical',
        igrejaId: 2,
      };

      const connection = {
        query: jest.fn().mockResolvedValue([mockMinisterio]),
      };

      const result = await ministerioModel.buscarMinisterio(
        ministerio.igrejaId,
        ministerio.nome,
        connection
      );

      expect(connection.query).toHaveBeenCalledWith(
        `SELECT * FROM ministerios WHERE igreja_id = ? AND nome = ?`,
        [ministerio.igrejaId, ministerio.nome]
      );

      expect(result).toEqual(mockMinisterio);
    });

    test('Deve retornar null se o ministério não for encontrado', async () => {
      const ministerio = {
        nome: 'Escola Bíblica Dominical',
        igrejaId: 2,
      };

      const connection = {
        query: jest.fn().mockResolvedValue([[]]),
      };

      const result = await ministerioModel.buscarMinisterio(
        ministerio.igrejaId,
        ministerio.nome,
        connection
      );

      expect(connection.query).toHaveBeenCalledWith(
        `SELECT * FROM ministerios WHERE igreja_id = ? AND nome = ?`,
        [ministerio.igrejaId, ministerio.nome]
      );

      expect(result).toEqual(null);
    });
  });

  describe('Testes do ministerioModel.verificarMinisterioId', () => {
    test('Deve retornar true se encontrar o ministerior', async () => {
      const mockMinisterio = {
        id: 1,
        nome: 'Grupo de Louvor',
        igreja_id: 4,
      };

      const mock = {
        ministerioId: 1,
        igrejaId: 4,
      };

      const connection = {
        query: jest.fn().mockResolvedValue([[mockMinisterio]]),
      };

      const result = await ministerioModel.verificarMinisterioId(
        mock.igrejaId,
        mock.ministerioId,
        connection
      );

      expect(connection.query).toHaveBeenCalledWith(
        `SELECT * FROM ministerios WHERE igreja_id = ? AND id = ?`,
        [mock.igrejaId, mock.ministerioId]
      );

      expect(result).toEqual(true);
    });

    test('Deve tornar false se não encontrar o ministerio', async () => {
      const mock = {
        ministerioId: 1,
        igrejaId: 4,
      };

      const connection = {
        query: jest.fn().mockResolvedValue([[]]),
      };

      const result = await ministerioModel.verificarMinisterioId(
        mock.igrejaId,
        mock.ministerioId,
        connection
      );

      expect(connection.query).toHaveBeenCalledWith(
        `SELECT * FROM ministerios WHERE igreja_id = ? AND id = ?`,
        [mock.igrejaId, mock.ministerioId]
      );

      expect(result).toEqual(false);
    });
  });

  describe('Testes do ministerioModel.verificarMinisterio', () => {
    test('Deve retornar true se o ministerio existir', async () => {
      const mockMinisterio = [
        {
          id: 10,
          nome: 'Escola Bíblica Dominical',
          igreja_id: 2,
        },
      ];

      const mock = {
        igrejaId: 2,
        nomeMinisterio: 'Escola Bíblica Dominical',
      };

      const connection = {
        query: jest.fn().mockResolvedValue([mockMinisterio]),
      };

      const result = await ministerioModel.verificarMinisterio(
        mock.igrejaId,
        mock.nomeMinisterio,
        connection
      );

      expect(connection.query).toHaveBeenCalledWith(
        `SELECT * FROM ministerios WHERE igreja_id = ? AND nome = ?`,
        [mock.igrejaId, mock.nomeMinisterio]
      );

      expect(result).toEqual(true);
    });

    test('Deve retornar false se o ministerio não existir', async () => {
      const mock = {
        igrejaId: 2,
        nomeMinisterio: 'Escola Bíblica Dominical',
      };

      const connection = {
        query: jest.fn().mockResolvedValue([[]]),
      };

      const result = await ministerioModel.verificarMinisterio(
        mock.igrejaId,
        mock.nomeMinisterio,
        connection
      );

      expect(connection.query).toHaveBeenCalledWith(
        `SELECT * FROM ministerios WHERE igreja_id = ? AND nome = ?`,
        [mock.igrejaId, mock.nomeMinisterio]
      );

      expect(result).toEqual(false);
    });
  });

  describe('Testes do ministerioModel.buscarMembrosMinisterio', () => {
    test('Retorna os membros se o id do ministerio existir no id da Igreja', async () => {
      const mockMembros = [
        {
          Nome: 'Juliana Pereira',
          IdMinisterio: 2,
          Ministerio: 'Escola Bíblica Dominical',
          Função: 'Líder',
          idIgreja: 2,
        },
        {
          Nome: 'Carlos Silva',
          IdMinisterio: 2,
          Ministerio: 'Escola Bíblica Dominical',
          Função: 'Líder',
          idIgreja: 2,
        },
      ];

      const mock = {
        ministerioId: 2,
        igrejaId: 2,
      };

      const connection = {
        query: jest.fn().mockResolvedValue([mockMembros]),
      };

      const result = await ministerioModel.buscarMembrosMinisterio(
        mock.ministerioId,
        mock.igrejaId,
        connection
      );

      expect(connection.query).toHaveBeenCalledWith(
        `SELECT
    memb.nome AS Nome,
    mini.id AS IdMinisterio,
    mini.nome AS Ministerio,
    mm.funcao AS Função,
    memb.igreja_id AS idIgreja
FROM
    membros memb
        JOIN
    ministerios_membros mm ON memb.id = mm.id
        JOIN
    ministerios mini ON mini.id = mm.ministerios_id
WHERE
    mini.id = ? AND mini.igreja_id = ?`,
        [mock.ministerioId, mock.igrejaId]
      );

      expect(result).toEqual(mockMembros);
    });

    test('Retorna null se o id do ministerio não existir no id da Igreja', async () => {
      const mock = {
        ministerioId: 2,
        igrejaId: 2,
      };

      const connection = {
        query: jest.fn().mockResolvedValue([[]]),
      };

      const result = await ministerioModel.buscarMembrosMinisterio(
        mock.ministerioId,
        mock.igrejaId,
        connection
      );

      expect(connection.query).toHaveBeenCalledWith(
        `SELECT
    memb.nome AS Nome,
    mini.id AS IdMinisterio,
    mini.nome AS Ministerio,
    mm.funcao AS Função,
    memb.igreja_id AS idIgreja
FROM
    membros memb
        JOIN
    ministerios_membros mm ON memb.id = mm.id
        JOIN
    ministerios mini ON mini.id = mm.ministerios_id
WHERE
    mini.id = ? AND mini.igreja_id = ?`,
        [mock.ministerioId, mock.igrejaId]
      );

      expect(result).toEqual(null);
    });
  });

  describe('Testes do ministerioModel.verificarMembroMinisterio', () => {
    test('Deve retornar true se o membro está cadastrado no ministério', async () => {
      const mockMembro = {
        id: 6,
        ministerios_id: 2,
        membros_id: 2,
        funcao: 'Líder',
      };

      const mock = {
        ministerioId: 2,
        membroId: 2,
      };

      const connection = {
        query: jest.fn().mockResolvedValue([[mockMembro]]),
      };

      const result = await ministerioModel.verificarMembroMinisterio(
        mock.ministerioId,
        mock.membroId,
        connection
      );

      expect(connection.query).toHaveBeenCalledWith(
        `SELECT * FROM ministerios_membros WHERE ministerios_id = ? AND membros_id = ?`,
        [mock.ministerioId, mock.membroId]
      );

      expect(result).toEqual(true);
    });

    test('Deve retornar false se o membro não está cadastrado no ministério', async () => {
      const mock = {
        ministerioId: 2,
        membroId: 2,
      };

      const connection = {
        query: jest.fn().mockResolvedValue([[]]),
      };

      const result = await ministerioModel.verificarMembroMinisterio(
        mock.ministerioId,
        mock.membroId,
        connection
      );

      expect(connection.query).toHaveBeenCalledWith(
        `SELECT * FROM ministerios_membros WHERE ministerios_id = ? AND membros_id = ?`,
        [mock.ministerioId, mock.membroId]
      );

      expect(result).toEqual(false);
    });
  });

  describe('Testes do ministerioModel.cadastrarMembroMinisterio', () => {
    test('Deve retornar o id do membro cadastrado', async () => {
      const mockMembro = {
        ministerioId: 2,
        membroId: 4,
        funcao: 'Membro',
      };

      const connection = {
        query: jest.fn().mockResolvedValue([{ insertId: 5 }]),
      };

      const result = await ministerioModel.cadastrarMembroMinisterio(
        mockMembro.ministerioId,
        mockMembro.membroId,
        mockMembro.funcao,
        connection
      );

      expect(connection.query).toHaveBeenCalledWith(
        `INSERT INTO ministerios_membros (ministerios_id, membros_id, funcao) VALUES (?, ?, ?)`,
        [mockMembro.ministerioId, mockMembro.membroId, mockMembro.funcao]
      );

      expect(result).toEqual(5);
    });
  });
});
