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
  const queryBuscarMembros = [
    'SELECT',
    '    m.id,',
    '    m.nome,',
    '    m.nascimento,',
    '    i.nome AS nomeIgreja,',
    '    i.url,',
    '    me.estado,',
    '    me.cidade,',
    '    me.bairro,',
    '    me.rua,',
    '    me.complemento,',
    '    mt.telefone',
    'FROM',
    '    membro m',
    '        JOIN',
    '    igreja i ON i.id = m.igreja_id',
    '        JOIN',
    '    membro_endereco me ON me.membro_id = m.id',
    '        JOIN',
    '    membro_telefone mt ON mt.membro_id = m.id',
    'WHERE',
    '    i.url = ? ',
  ].join('\n');

  const queryBuscarMembro = [
    'SELECT',
    '    m.id,',
    '    m.nome,',
    '    m.nascimento,',
    '    i.nome AS nomeIgreja,',
    '    i.url,',
    '    me.estado,',
    '    me.cidade,',
    '    me.bairro,',
    '    me.rua,',
    '    me.complemento,',
    '    mt.telefone',
    'FROM',
    '    membro m',
    '        JOIN',
    '    igreja i ON i.id = m.igreja_id',
    '        JOIN',
    '    membro_endereco me ON me.membro_id = m.id',
    '        JOIN',
    '    membro_telefone mt ON mt.membro_id = m.id',
    'WHERE',
    '    i.url = ? AND m.id = ?',
  ].join('\n');

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
        'INSERT INTO membro (nome, nascimento, igreja_id) VALUES (?, ?, ?)',
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
        'INSERT INTO membro_endereco (estado, cidade, bairro, rua, complemento, membro_id) VALUES (?, ?, ?, ?, ?, ?)',
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
        'INSERT INTO membro_telefone (telefone, membro_id) VALUES (?, ?)',
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
        queryBuscarMembros,
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
        queryBuscarMembro,
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
        queryBuscarMembro,
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
    membro m
        JOIN
    igreja i ON i.id = m.igreja_id
        JOIN
    membro_telefone mt ON mt.membro_id = m.id
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
        `DELETE FROM membro
WHERE igreja_id = ? AND id = ?`,
        [mockMembro.igrejaId, mockMembro.id]
      );

      expect(result).toBe(1);
    });
  });
});
