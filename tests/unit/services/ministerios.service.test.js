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

const mockMinisterioModel = {
  verificarMinisterio: jest.fn(),
  cadastrarMinisterio: jest.fn(),
  buscarMinisterios: jest.fn(),
  verificarMinisterioId: jest.fn(),
  verificarMembroMinisterio: jest.fn(),
  cadastrarMembroMinisterio: jest.fn(),
  buscarMembrosMinisterio: jest.fn(),
};

const mockMembrosModel = {
  buscarMembro: jest.fn(),
};

const IgrejaModelMock = jest.fn(() => mockIgrejaModel);
const MinisterioModelMock = jest.fn(() => mockMinisterioModel);
const MembrosModelMock = jest.fn(() => mockMembrosModel);

await jest.unstable_mockModule('../../../src/config/db.js', () => ({
  default: {
    getConnection: getConnectionMock,
  },
}));

await jest.unstable_mockModule('../../../src/models/igreja.model.js', () => ({
  default: IgrejaModelMock,
}));

await jest.unstable_mockModule(
  '../../../src/models/ministerio.model.js',
  () => ({
    default: MinisterioModelMock,
  })
);

await jest.unstable_mockModule('../../../src/models/membros.model.js', () => ({
  default: MembrosModelMock,
}));

const { default: ministeriosService } =
  await import('../../../src/services/ministerios.service.js');

const mockMinisterio = {
  nomeMinisterio: 'EBD',
  url: 'Igreja de Deus',
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Testes do ministeriosService.cadastrarMinisterio', () => {
  test('Deve cadastrar ministério com sucesso', async () => {
    mockIgrejaModel.igrejaId.mockResolvedValue(5);
    mockMinisterioModel.verificarMinisterio.mockResolvedValue(false);
    mockMinisterioModel.cadastrarMinisterio.mockResolvedValue(2);

    const result = await ministeriosService.cadastrarMinisterio(mockMinisterio);

    expect(mockConnection.beginTransaction).toHaveBeenCalledTimes(1);
    expect(mockMinisterioModel.cadastrarMinisterio).toHaveBeenCalledWith(
      'EBD',
      5
    );
    expect(mockConnection.commit).toHaveBeenCalledTimes(1);
    expect(mockConnection.rollback).not.toHaveBeenCalled();
    expect(mockConnection.release).toHaveBeenCalledTimes(1);
    expect(result).toBe('Ministério EBD cadastrado com sucesso');
  });

  test('Deve lançar AppError se igreja não existir', async () => {
    mockIgrejaModel.igrejaId.mockResolvedValue(null);

    await expect(
      ministeriosService.cadastrarMinisterio(mockMinisterio)
    ).rejects.toMatchObject({
      message: 'Igreja não encontrada',
      statusCode: 404,
    });

    expect(mockConnection.beginTransaction).not.toHaveBeenCalled();
    expect(mockConnection.rollback).toHaveBeenCalledTimes(1);
    expect(mockConnection.release).toHaveBeenCalledTimes(1);
  });

  test('Deve lançar AppError se o nome do ministério já existir', async () => {
    mockIgrejaModel.igrejaId.mockResolvedValue(5);
    mockMinisterioModel.verificarMinisterio.mockResolvedValue(true);

    await expect(
      ministeriosService.cadastrarMinisterio(mockMinisterio)
    ).rejects.toMatchObject({
      message: 'O nome de ministério EBD já está cadastrado',
      statusCode: 409,
    });

    expect(mockConnection.beginTransaction).not.toHaveBeenCalled();
    expect(mockConnection.rollback).toHaveBeenCalledTimes(1);
    expect(mockConnection.release).toHaveBeenCalledTimes(1);
  });
});

describe('Testes do ministeriosService.buscarMinisterios', () => {
  test('Deve buscar ministérios com sucesso', async () => {
    const lista = [
      { id: 1, nome: 'EBD' },
      { id: 2, nome: 'Louvor' },
    ];

    mockIgrejaModel.igrejaId.mockResolvedValue(3);
    mockMinisterioModel.buscarMinisterios.mockResolvedValue(lista);

    const result = await ministeriosService.buscarMinisterios(
      mockMinisterio.url
    );

    expect(mockConnection.beginTransaction).not.toHaveBeenCalled();
    expect(mockConnection.rollback).not.toHaveBeenCalled();
    expect(mockConnection.release).toHaveBeenCalledTimes(1);
    expect(result).toEqual(lista);
  });

  test('Deve lançar AppError se igreja não existir', async () => {
    mockIgrejaModel.igrejaId.mockResolvedValue(null);

    await expect(
      ministeriosService.buscarMinisterios(mockMinisterio.url)
    ).rejects.toMatchObject({
      message: 'Igreja não encontrada',
      statusCode: 404,
    });

    expect(mockConnection.release).toHaveBeenCalledTimes(1);
  });

  test('Deve lançar AppError se ministerios vier nulo', async () => {
    mockIgrejaModel.igrejaId.mockResolvedValue(3);
    mockMinisterioModel.buscarMinisterios.mockResolvedValue(null);

    await expect(
      ministeriosService.buscarMinisterios(mockMinisterio.url)
    ).rejects.toMatchObject({
      message: 'Ministerios não encontrados',
      statusCode: 404,
    });

    expect(mockConnection.release).toHaveBeenCalledTimes(1);
  });
});

describe('Testes do ministeriosService.cadastrarMembroMinisterio', () => {
  test('Deve cadastrar membro no ministério com sucesso', async () => {
    mockIgrejaModel.igrejaId.mockResolvedValue(4);
    mockMinisterioModel.verificarMinisterioId.mockResolvedValue(true);
    mockMembrosModel.buscarMembro.mockResolvedValue({
      id: 10,
      nome: 'João Silva',
    });
    mockMinisterioModel.verificarMembroMinisterio.mockResolvedValue(false);
    mockMinisterioModel.cadastrarMembroMinisterio.mockResolvedValue(1);

    const result = await ministeriosService.cadastrarMembroMinisterio(
      'Igreja de Deus',
      2,
      10,
      'Líder'
    );

    expect(mockConnection.beginTransaction).toHaveBeenCalledTimes(1);
    expect(mockConnection.commit).toHaveBeenCalledTimes(1);
    expect(mockConnection.rollback).not.toHaveBeenCalled();
    expect(mockConnection.release).toHaveBeenCalledTimes(1);
    expect(result).toBe('Membro cadastrado com sucesso');
  });

  test('Deve lançar AppError se membro já estiver no ministério', async () => {
    mockIgrejaModel.igrejaId.mockResolvedValue(4);
    mockMinisterioModel.verificarMinisterioId.mockResolvedValue(true);
    mockMembrosModel.buscarMembro.mockResolvedValue({
      id: 10,
      nome: 'João Silva',
    });
    mockMinisterioModel.verificarMembroMinisterio.mockResolvedValue(true);

    await expect(
      ministeriosService.cadastrarMembroMinisterio(
        'Igreja de Deus',
        2,
        10,
        'Líder'
      )
    ).rejects.toMatchObject({
      message: 'Erro. Membro já cadastrado nesse ministério',
      statusCode: 409,
    });

    expect(mockConnection.beginTransaction).not.toHaveBeenCalled();
    expect(mockConnection.rollback).toHaveBeenCalledTimes(1);
    expect(mockConnection.release).toHaveBeenCalledTimes(1);
  });

  test('Deve lançar AppError quando cadastro em ministerio retornar nulo', async () => {
    mockIgrejaModel.igrejaId.mockResolvedValue(4);
    mockMinisterioModel.verificarMinisterioId.mockResolvedValue(true);
    mockMembrosModel.buscarMembro.mockResolvedValue({
      id: 10,
      nome: 'João Silva',
    });
    mockMinisterioModel.verificarMembroMinisterio.mockResolvedValue(false);
    mockMinisterioModel.cadastrarMembroMinisterio.mockResolvedValue(null);

    await expect(
      ministeriosService.cadastrarMembroMinisterio(
        'Igreja de Deus',
        2,
        10,
        'Líder'
      )
    ).rejects.toMatchObject({
      message: 'Erro. Membro não foi cadastrado.',
      statusCode: 500,
    });

    expect(mockConnection.beginTransaction).toHaveBeenCalledTimes(1);
    expect(mockConnection.commit).not.toHaveBeenCalled();
    expect(mockConnection.rollback).toHaveBeenCalledTimes(1);
    expect(mockConnection.release).toHaveBeenCalledTimes(1);
  });
});

describe('Testes do ministeriosService.buscarMembrosMinisterio', () => {
  test('Deve buscar membros do ministério com sucesso', async () => {
    const membros = [
      { nome: 'João Silva', Funcao: 'Líder' },
      { nome: 'Maria Souza', Funcao: 'Membro' },
    ];

    mockIgrejaModel.igrejaId.mockResolvedValue(4);
    mockMinisterioModel.buscarMembrosMinisterio.mockResolvedValue(membros);

    const result = await ministeriosService.buscarMembrosMinisterio(
      2,
      'Igreja de Deus'
    );

    expect(mockConnection.beginTransaction).not.toHaveBeenCalled();
    expect(mockConnection.rollback).not.toHaveBeenCalled();
    expect(mockConnection.release).toHaveBeenCalledTimes(1);
    expect(result).toEqual(membros);
  });

  test('Deve lançar AppError quando membros não forem encontrados', async () => {
    mockIgrejaModel.igrejaId.mockResolvedValue(4);
    mockMinisterioModel.buscarMembrosMinisterio.mockResolvedValue(null);

    await expect(
      ministeriosService.buscarMembrosMinisterio(2, 'Igreja de Deus')
    ).rejects.toBeInstanceOf(AppError);

    expect(mockConnection.release).toHaveBeenCalledTimes(1);
  });
});
