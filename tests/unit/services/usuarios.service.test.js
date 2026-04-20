import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import AppError from '../../../src/errors/apperror.js';

const mockConnection = {
  beginTransaction: jest.fn(),
  commit: jest.fn(),
  rollback: jest.fn(),
  release: jest.fn(),
};

const getConnectionMock = jest.fn(async () => mockConnection);

const mockIgrejaModel = {
  igrejaId: jest.fn(),
};

const mockMembrosModel = {
  cadastrarMembro: jest.fn(),
  cadastrarEndereco: jest.fn(),
  cadastrarTelefone: jest.fn(),
  buscarMembros: jest.fn(),
  buscarMembro: jest.fn(),
  buscarAniversariantes: jest.fn(),
};

const IgrejaModelMock = jest.fn(() => mockIgrejaModel);
const MembrosModelMock = jest.fn(() => mockMembrosModel);

await jest.unstable_mockModule('../../../src/config/db.js', () => ({
  default: {
    getConnection: getConnectionMock,
  },
}));

await jest.unstable_mockModule('../../../src/models/igreja.model.js', () => ({
  default: IgrejaModelMock,
}));

await jest.unstable_mockModule('../../../src/models/membros.model.js', () => ({
  default: MembrosModelMock,
}));

const { default: usuariosService } =
  await import('../../../src/services/usuarios.service.js');

const mockMembro = {
  nome: 'João Silva',
  nascimento: '1990-01-01',
  endereco: {
    estado: 'SP',
    cidade: 'São Paulo',
    bairro: 'Centro',
    rua: 'Rua A',
    complemento: 'Casa 1',
  },
  telefone: '11999999999',
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Testes do usuariosService.cadastrarMembro', () => {
  test('Deve cadastrar um membro com sucesso', async () => {
    mockIgrejaModel.igrejaId.mockResolvedValue(1);
    mockMembrosModel.cadastrarMembro.mockResolvedValue(4);
    mockMembrosModel.cadastrarEndereco.mockResolvedValue(5);
    mockMembrosModel.cadastrarTelefone.mockResolvedValue(6);

    const result = await usuariosService.cadastrarMembro(
      'igreja-url',
      mockMembro
    );

    expect(mockConnection.beginTransaction).toHaveBeenCalledTimes(1);
    expect(mockConnection.commit).toHaveBeenCalledTimes(1);
    expect(mockConnection.rollback).not.toHaveBeenCalled();
    expect(mockConnection.release).toHaveBeenCalledTimes(1);
    expect(result).toBe(4);
  });

  test('Deve lançar AppError se igreja não existir', async () => {
    mockIgrejaModel.igrejaId.mockResolvedValue(null);

    await expect(
      usuariosService.cadastrarMembro('igreja-url', mockMembro)
    ).rejects.toMatchObject({
      message: 'Igreja não encontrada',
      statusCode: 404,
    });

    expect(mockConnection.beginTransaction).not.toHaveBeenCalled();
    expect(mockConnection.rollback).toHaveBeenCalledTimes(1);
    expect(mockConnection.release).toHaveBeenCalledTimes(1);
  });

  test('Deve lançar AppError se cadastro de membro falhar', async () => {
    mockIgrejaModel.igrejaId.mockResolvedValue(1);
    mockMembrosModel.cadastrarMembro.mockResolvedValue(null);

    await expect(
      usuariosService.cadastrarMembro('igreja-url', mockMembro)
    ).rejects.toMatchObject({
      message: 'Erro ao cadastrar membro',
      statusCode: 500,
    });

    expect(mockConnection.beginTransaction).toHaveBeenCalledTimes(1);
    expect(mockConnection.commit).not.toHaveBeenCalled();
    expect(mockConnection.rollback).toHaveBeenCalledTimes(1);
    expect(mockConnection.release).toHaveBeenCalledTimes(1);
  });
});

describe('Testes do usuariosService.buscarMembros', () => {
  test('Deve retornar lista de membros', async () => {
    const membros = [
      { id: 1, nome: 'Membro 1' },
      { id: 2, nome: 'Membro 2' },
    ];

    mockMembrosModel.buscarMembros.mockResolvedValue(membros);

    const result = await usuariosService.buscarMembros('igreja-url');

    expect(mockConnection.beginTransaction).not.toHaveBeenCalled();
    expect(mockConnection.rollback).not.toHaveBeenCalled();
    expect(mockConnection.release).toHaveBeenCalledTimes(1);
    expect(result).toEqual(membros);
  });

  test('Deve lançar AppError quando não houver membros', async () => {
    mockMembrosModel.buscarMembros.mockResolvedValue([]);

    await expect(
      usuariosService.buscarMembros('igreja-url')
    ).rejects.toMatchObject({
      message: 'Nenhum membro encontrado',
      statusCode: 404,
    });

    expect(mockConnection.release).toHaveBeenCalledTimes(1);
  });
});

describe('Testes do usuariosService.buscarMembro', () => {
  test('Deve buscar um membro com sucesso', async () => {
    const membro = { id: 1, nome: 'Membro 1' };
    mockMembrosModel.buscarMembro.mockResolvedValue(membro);

    const result = await usuariosService.buscarMembro('igreja-url', 1);

    expect(mockConnection.release).toHaveBeenCalledTimes(1);
    expect(result).toEqual(membro);
  });

  test('Deve lançar AppError quando membro não for encontrado', async () => {
    mockMembrosModel.buscarMembro.mockResolvedValue(undefined);

    await expect(
      usuariosService.buscarMembro('igreja-url', 1)
    ).rejects.toBeInstanceOf(AppError);

    expect(mockConnection.release).toHaveBeenCalledTimes(1);
  });
});

describe('Testes do usuariosService.buscarAniversariantes', () => {
  test('Deve buscar aniversariantes com sucesso', async () => {
    const aniversariantes = [
      { id: 1, nome: 'Membro 1', nascimento: '1990-06-15' },
      { id: 2, nome: 'Membro 2', nascimento: '1985-06-20' },
    ];
    mockMembrosModel.buscarAniversariantes.mockResolvedValue(aniversariantes);

    const result = await usuariosService.buscarAniversariantes('igreja-url', 6);

    expect(mockConnection.beginTransaction).not.toHaveBeenCalled();
    expect(mockConnection.rollback).not.toHaveBeenCalled();
    expect(mockConnection.release).toHaveBeenCalledTimes(1);
    expect(result).toEqual(aniversariantes);
  });

  test('Deve lançar AppError quando não houver aniversariantes', async () => {
    mockMembrosModel.buscarAniversariantes.mockResolvedValue([]);

    await expect(
      usuariosService.buscarAniversariantes('igreja-url', 6)
    ).rejects.toMatchObject({
      message: 'Nenhum aniversariante encontrado',
      statusCode: 404,
    });

    expect(mockConnection.release).toHaveBeenCalledTimes(1);
  });
});
