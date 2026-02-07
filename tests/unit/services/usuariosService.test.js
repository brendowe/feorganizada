import { beforeEach, describe, expect, jest, test } from '@jest/globals';

const mockConnection = {
  beginTransaction: jest.fn(),
  commit: jest.fn(),
  rollback: jest.fn(),
  release: jest.fn(),
};

await jest.unstable_mockModule('../../../src/config/db.js', () => ({
  default: {
    getConnection: jest.fn(() => Promise.resolve(mockConnection)),
  },
}));

await jest.unstable_mockModule('../../../src/models/igrejaModel.js', () => ({
  default: {
    igrejaId: jest.fn(),
  },
}));

await jest.unstable_mockModule('../../../src/models/membrosModel.js', () => ({
  default: {
    cadastrarMembro: jest.fn(),
    cadastrarEndereco: jest.fn(),
    cadastrarTelefone: jest.fn(),
    buscarMembros: jest.fn(),
    buscarMembro: jest.fn(),
    buscarAniversariantes: jest.fn(),
  },
}));

const { default: igrejaModel } =
  await import('../../../src/models/igrejaModel.js');

const { default: membrosModel } =
  await import('../../../src/models/membrosModel.js');

const { default: usuarios } =
  await import('../../../src/services/usuariosService.js');

const mockMembro = {
  nome: 'João Silva',
  nascimento: '1990-01-01',
  endereco: 'Rua A, 123',
  telefone: '123456789',
};

const mockMembros = [
  { id: 1, nome: 'Membro 1' },
  { id: 2, nome: 'Membro 2' },
];

const mockAniversariantes = [
  {
    id: 1,
    nome: 'Membro 1',
    nascimento: '1990-06-15',
    telefone: '(12) 34567-4489',
  },
  {
    id: 2,
    nome: 'Membro 2',
    nascimento: '1985-06-20',
    telefone: '(98) 76543-4821',
  },
];

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Testes do usuarios.cadastrarMembro', () => {
  test('Deve cadastrar um novo membro com sucesso', async () => {
    igrejaModel.igrejaId.mockResolvedValue(1);
    membrosModel.cadastrarMembro.mockResolvedValue(4);
    membrosModel.cadastrarEndereco.mockResolvedValue(5);
    membrosModel.cadastrarTelefone.mockResolvedValue(6);

    let result = await usuarios.cadastrarMembro('igreja-url', mockMembro);

    expect(mockConnection.beginTransaction).toHaveBeenCalled();
    expect(mockConnection.commit).toHaveBeenCalled();
    expect(mockConnection.rollback).not.toHaveBeenCalled();
    expect(mockConnection.release).toHaveBeenCalled();
    expect(result).toBe('usuário cadastrado com sucesso');
  });

  test('Deve tratar erro ao cadastrar um novo membro', async () => {
    igrejaModel.igrejaId.mockResolvedValue(1);
    membrosModel.cadastrarMembro.mockRejectedValue(
      new Error('Erro ao cadastrar membro')
    );
    await expect(
      usuarios.cadastrarMembro('igreja-url', mockMembro)
    ).rejects.toThrow('Erro ao cadastrar membro');
    expect(mockConnection.beginTransaction).toHaveBeenCalled();
    expect(mockConnection.commit).not.toHaveBeenCalled();
    expect(mockConnection.rollback).toHaveBeenCalled();
    expect(mockConnection.release).toHaveBeenCalled();
  });
});

describe('Testes do usuarios.buscarMembros', () => {
  test('Deve buscar membros com sucesso', async () => {
    membrosModel.buscarMembros.mockResolvedValue(mockMembros);
    let result = await usuarios.buscarMembros('igreja-url');

    expect(mockConnection.beginTransaction).toHaveBeenCalled();
    expect(mockConnection.commit).not.toHaveBeenCalled();
    expect(mockConnection.rollback).not.toHaveBeenCalled();
    expect(mockConnection.release).toHaveBeenCalled();
    expect(result).toBe(mockMembros);
  });
  test('Deve tratar erro ao buscar membros', async () => {
    membrosModel.buscarMembros.mockRejectedValue(
      new Error('Erro ao buscar membros')
    );
    await expect(usuarios.buscarMembros('igreja-url')).rejects.toThrow(
      'Erro ao buscar membros'
    );
    expect(mockConnection.beginTransaction).toHaveBeenCalled();
    expect(mockConnection.commit).not.toHaveBeenCalled();
    expect(mockConnection.rollback).toHaveBeenCalled();
    expect(mockConnection.release).toHaveBeenCalled();
  });
});

describe('Testes do usuarios.buscarMembro', () => {
  test('Deve buscar um membro com sucesso', async () => {
    const mockMembroDetalhado = { id: 1, nome: 'Membro 1', detalhes: '...' };
    membrosModel.buscarMembro.mockResolvedValue(mockMembroDetalhado);
    let result = await usuarios.buscarMembro('igreja-url', 1);
    expect(mockConnection.beginTransaction).toHaveBeenCalled();
    expect(mockConnection.commit).not.toHaveBeenCalled();
    expect(mockConnection.rollback).not.toHaveBeenCalled();
    expect(mockConnection.release).toHaveBeenCalled();
    expect(result).toBe(mockMembroDetalhado);
  });
  test('Deve tratar erro ao buscar um membro', async () => {
    membrosModel.buscarMembro.mockRejectedValue(
      new Error('Erro ao buscar membro')
    );
    await expect(usuarios.buscarMembro('igreja-url', 1)).rejects.toThrow(
      'Erro ao buscar membro'
    );
    expect(mockConnection.beginTransaction).toHaveBeenCalled();
    expect(mockConnection.commit).not.toHaveBeenCalled();
    expect(mockConnection.rollback).toHaveBeenCalled();
    expect(mockConnection.release).toHaveBeenCalled();
  });
});

describe('Testes do usuarios.buscarAniversariantes', () => {
  test('Deve buscar aniversariantes com sucesso', async () => {
    membrosModel.buscarAniversariantes.mockResolvedValue(mockAniversariantes);
    let result = await usuarios.buscarAniversariantes('igreja-url', 6);
    expect(mockConnection.beginTransaction).not.toHaveBeenCalled();
    expect(mockConnection.commit).not.toHaveBeenCalled();
    expect(mockConnection.rollback).not.toHaveBeenCalled();
    expect(mockConnection.release).toHaveBeenCalled();
    expect(result).toBe(mockAniversariantes);
  });
  test('Deve tratar erro ao buscar aniversariantes', async () => {
    membrosModel.buscarAniversariantes.mockRejectedValue(
      new Error('Erro ao buscar aniversariantes')
    );
    await expect(
      usuarios.buscarAniversariantes('igreja-url', 6)
    ).rejects.toThrow('Erro ao buscar aniversariantes');
    expect(mockConnection.beginTransaction).not.toHaveBeenCalled();
    expect(mockConnection.commit).not.toHaveBeenCalled();
    expect(mockConnection.rollback).not.toHaveBeenCalled();
    expect(mockConnection.release).toHaveBeenCalled();
  });
});
