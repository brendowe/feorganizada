import { beforeEach, jest } from '@jest/globals';
import MembrosModel from '../../../src/models/membros.model.js';

const mockMembro = {
  id: 71,
  igrejaId: 2,
  nome: 'Carlos Silva',
  nascimento: '1985-07-23',
};

const mockEndereco = {
  estado: 'SP',
  cidade: 'Sao Paulo',
  bairro: 'Vila Nova',
  rua: 'Rua dos Lirios',
  complemento: 'Apartamento 101',
};

const mockMembroDetalhado = {
  id: 71,
  nome: 'Carlos Silva',
  nascimento: '1985-07-23',
  nomeIgreja: 'Igreja Esperanca Viva',
  url: 'esperanca-viva-sp',
  estado: 'SP',
  cidade: 'Sao Paulo',
  bairro: 'Jardim das Flores',
  rua: 'Rua das Oliveiras',
  complemento: 'Proximo a praca central',
  telefone: '(11) 99876-5432',
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Testes do membrosModel', () => {
  describe('Testes do membrosModel.cadastrarMembro', () => {
    test('Deve retornar o id do membro cadastrado', async () => {
      const mockQuery = jest
        .fn()
        .mockResolvedValue([{ insertId: mockMembro.id }]);

      const membrosModel = new MembrosModel({ query: mockQuery });

      const result = await membrosModel.cadastrarMembro(
        mockMembro.igrejaId,
        mockMembro.nome,
        mockMembro.nascimento
      );

      expect(mockQuery).toHaveBeenCalledWith(
        'INSERT INTO membros (nome, nascimento, igreja_id) VALUES (?, ?, ?)',
        [mockMembro.nome, mockMembro.nascimento, mockMembro.igrejaId]
      );

      expect(result).toEqual(mockMembro.id);
    });
  });

  describe('Testes do membrosModel.cadastrarEndereco', () => {
    test('Deve retornar o id do endereco cadastrado', async () => {
      const mockEnderecoId = 10;
      const mockQuery = jest
        .fn()
        .mockResolvedValue([{ insertId: mockEnderecoId }]);

      const membrosModel = new MembrosModel({ query: mockQuery });

      const result = await membrosModel.cadastrarEndereco(
        mockMembro.id,
        mockEndereco
      );

      expect(mockQuery).toHaveBeenCalledWith(
        'INSERT INTO membros_endereco (estado, cidade, bairro, rua, complemento, membros_id) VALUES (?, ?, ?, ?, ?, ?)',
        [
          mockEndereco.estado,
          mockEndereco.cidade,
          mockEndereco.bairro,
          mockEndereco.rua,
          mockEndereco.complemento,
          mockMembro.id,
        ]
      );

      expect(result).toEqual(mockEnderecoId);
    });
  });

  describe('Testes do membrosModel.cadastrarTelefone', () => {
    test('Deve retornar o id do telefone cadastrado', async () => {
      const mockTelefone = '(11) 99876-5432';
      const mockTelefoneId = 666;
      const mockQuery = jest
        .fn()
        .mockResolvedValue([{ insertId: mockTelefoneId }]);

      const membrosModel = new MembrosModel({ query: mockQuery });

      const result = await membrosModel.cadastrarTelefone(
        mockMembro.id,
        mockTelefone
      );

      expect(mockQuery).toHaveBeenCalledWith(
        'INSERT INTO membros_telefone (telefone, membros_id) VALUES (?, ?)',
        [mockTelefone, mockMembro.id]
      );

      expect(result).toEqual(mockTelefoneId);
    });
  });

  describe('Testes do membrosModel.buscarMembros', () => {
    test('Deve retornar um array com os membros cadastrados na url da igreja', async () => {
      const mockUrl = 'esperanca-viva-sp';
      const mockMembros = [mockMembroDetalhado];
      const mockQuery = jest.fn().mockResolvedValue([mockMembros]);

      const membrosModel = new MembrosModel({ query: mockQuery });

      const result = await membrosModel.buscarMembros(mockUrl);

      expect(mockQuery).toHaveBeenCalledWith(
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
        [mockUrl]
      );

      expect(result).toEqual(mockMembros);
    });
  });

  describe('Testes do membrosModel.buscarMembro', () => {
    test('Deve retornar o membro da url informada com o id informado', async () => {
      const mockUrl = 'esperanca-viva-sp';
      const mockQuery = jest.fn().mockResolvedValue([[mockMembroDetalhado]]);

      const membrosModel = new MembrosModel({ query: mockQuery });

      const result = await membrosModel.buscarMembro(mockUrl, mockMembro.id);

      expect(mockQuery).toHaveBeenCalledWith(
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
        [mockUrl, mockMembro.id]
      );

      expect(result).toEqual(mockMembroDetalhado);
    });

    test('Deve retornar undefined caso nao encontre o membro', async () => {
      const mockUrl = 'esperanca-viva-sp';
      const mockQuery = jest.fn().mockResolvedValue([[]]);

      const membrosModel = new MembrosModel({ query: mockQuery });

      const result = await membrosModel.buscarMembro(mockUrl, mockMembro.id);

      expect(mockQuery).toHaveBeenCalledWith(
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
        [mockUrl, mockMembro.id]
      );

      expect(result).toBeUndefined();
    });
  });

  describe('Testes do membrosModel.buscarAniversariantes', () => {
    test('Deve retornar os aniversariantes de um determinado mes', async () => {
      const mockInfos = {
        url: 'esperanca-viva-sp',
        mes: 5,
      };

      const mockAniversariantes = [
        {
          id: 1,
          nome: 'Rafael Oliveira',
          nascimento: '2001-05-22 00:00:00',
          telefone: '(71) 91234-5678',
        },
        {
          id: 2,
          nome: 'Brendo Washington Oliveira',
          nascimento: '2001-05-22 00:00:00',
          telefone: '(71) 91234-5678',
        },
      ];

      const mockQuery = jest.fn().mockResolvedValue([mockAniversariantes]);

      const membrosModel = new MembrosModel({ query: mockQuery });

      const result = await membrosModel.buscarAniversariantes(
        mockInfos.url,
        mockInfos.mes
      );

      expect(mockQuery).toHaveBeenCalledWith(
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
        [mockInfos.url, mockInfos.mes]
      );

      expect(result).toEqual(mockAniversariantes);
    });
  });

  describe('Testes do membrosModel.deletarMembro', () => {
    test('Deve retornar a quantidade de linhas afetadas ao deletar o membro', async () => {
      const mockQuery = jest.fn().mockResolvedValue([{ affectedRows: 1 }]);

      const membrosModel = new MembrosModel({ query: mockQuery });

      const result = await membrosModel.deletarMembro(
        mockMembro.igrejaId,
        mockMembro.id
      );

      expect(mockQuery).toHaveBeenCalledWith(
        `DELETE FROM membros
WHERE igreja_id = ? AND id = ?`,
        [mockMembro.igrejaId, mockMembro.id]
      );

      expect(result).toBe(1);
    });
  });
});
