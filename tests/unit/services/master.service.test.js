import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import AppError from '../../../src/errors/apperror.js';

const mockConnection = {
  beginTransaction: jest.fn(),
  commit: jest.fn(),
  rollback: jest.fn(),
  release: jest.fn(),
};

const getConnectionMock = jest.fn(async () => mockConnection);

const mockAdmModel = {
  buscarAdm: jest.fn(),
  cadastrarAdm: jest.fn(),
  alterarSenhaAdm: jest.fn(),
};

const mockIgrejaModel = {
  igrejaId: jest.fn(),
};

const AdmModelMock = jest.fn(() => mockAdmModel);
const IgrejaModelMock = jest.fn(() => mockIgrejaModel);

await jest.unstable_mockModule('../../../src/config/db.js', () => ({
  default: {
    getConnection: getConnectionMock,
  },
}));

await jest.unstable_mockModule('../../../src/models/adm.model.js', () => ({
  default: AdmModelMock,
}));

await jest.unstable_mockModule('../../../src/models/igreja.model.js', () => ({
  default: IgrejaModelMock,
}));

await jest.unstable_mockModule('../../../src/utils/hashsenha.util.js', () => ({
  default: jest.fn(async () => 'senha_hashada'),
}));

const { default: hashSenha } =
  await import('../../../src/utils/hashsenha.util.js');
const { default: masterService } =
  await import('../../../src/services/master.service.js');

const mockAdm = {
  url: 'IgrejaDB',
  id: 5,
  login: 'brendow',
  senha: 'segura123',
  novaSenha: 'novasenhasegura12',
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Testes do masterService.cadastrarAdm', () => {
  test('Deve cadastrar novo adm com sucesso', async () => {
    mockAdmModel.buscarAdm.mockResolvedValue(null);
    mockIgrejaModel.igrejaId.mockResolvedValue(2);
    mockAdmModel.cadastrarAdm.mockResolvedValue(12);

    const result = await masterService.cadastrarAdm(
      mockAdm.url,
      mockAdm.id,
      mockAdm.login,
      mockAdm.senha
    );

    expect(getConnectionMock).toHaveBeenCalledTimes(1);
    expect(AdmModelMock).toHaveBeenCalledWith(mockConnection);
    expect(IgrejaModelMock).toHaveBeenCalledWith(mockConnection);
    expect(mockConnection.beginTransaction).toHaveBeenCalledTimes(1);
    expect(hashSenha).toHaveBeenCalledWith(mockAdm.senha);
    expect(mockAdmModel.cadastrarAdm).toHaveBeenCalledWith(
      2,
      5,
      'brendow',
      'senha_hashada'
    );
    expect(mockConnection.commit).toHaveBeenCalledTimes(1);
    expect(mockConnection.rollback).not.toHaveBeenCalled();
    expect(mockConnection.release).toHaveBeenCalledTimes(1);
    expect(result).toBe(12);
  });

  test('Deve lançar AppError quando usuário já é adm', async () => {
    mockAdmModel.buscarAdm.mockResolvedValue({ id: 99, login: 'brendow' });

    await expect(
      masterService.cadastrarAdm(
        mockAdm.url,
        mockAdm.id,
        mockAdm.login,
        mockAdm.senha
      )
    ).rejects.toMatchObject({
      message: 'Usuário já é adm',
      statusCode: 409,
    });

    expect(hashSenha).not.toHaveBeenCalled();
    expect(mockConnection.beginTransaction).toHaveBeenCalledTimes(1);
    expect(mockConnection.commit).not.toHaveBeenCalled();
    expect(mockConnection.rollback).toHaveBeenCalledTimes(1);
    expect(mockConnection.release).toHaveBeenCalledTimes(1);
  });

  test('Deve fazer rollback e relançar erro inesperado', async () => {
    const erro = new Error('Falha ao cadastrar');
    mockAdmModel.buscarAdm.mockResolvedValue(null);
    mockIgrejaModel.igrejaId.mockResolvedValue(2);
    mockAdmModel.cadastrarAdm.mockRejectedValue(erro);

    await expect(
      masterService.cadastrarAdm(
        mockAdm.url,
        mockAdm.id,
        mockAdm.login,
        mockAdm.senha
      )
    ).rejects.toThrow('Falha ao cadastrar');

    expect(mockConnection.beginTransaction).toHaveBeenCalledTimes(1);
    expect(mockConnection.commit).not.toHaveBeenCalled();
    expect(mockConnection.rollback).toHaveBeenCalledTimes(1);
    expect(mockConnection.release).toHaveBeenCalledTimes(1);
  });
});

describe('Testes do masterService.atualizarSenhaAdm', () => {
  test('Deve retornar mensagem de sucesso', async () => {
    mockAdmModel.buscarAdm.mockResolvedValue({ id: 8, login: mockAdm.login });
    mockAdmModel.alterarSenhaAdm.mockResolvedValue(1);

    const result = await masterService.atualizarSenhaAdm(
      mockAdm.login,
      mockAdm.url,
      mockAdm.novaSenha
    );

    expect(hashSenha).toHaveBeenCalledWith(mockAdm.novaSenha);
    expect(mockAdmModel.alterarSenhaAdm).toHaveBeenCalledWith(
      mockAdm.login,
      8,
      'senha_hashada'
    );
    expect(mockConnection.beginTransaction).not.toHaveBeenCalled();
    expect(mockConnection.commit).not.toHaveBeenCalled();
    expect(mockConnection.rollback).not.toHaveBeenCalled();
    expect(mockConnection.release).toHaveBeenCalledTimes(1);
    expect(result).toBe('Senha alterada com sucesso');
  });

  test('Deve lançar AppError se adm não existir', async () => {
    mockAdmModel.buscarAdm.mockResolvedValue(null);

    await expect(
      masterService.atualizarSenhaAdm(
        mockAdm.login,
        mockAdm.url,
        mockAdm.novaSenha
      )
    ).rejects.toMatchObject({
      message: 'Adm não cadastrado',
      statusCode: 404,
    });

    expect(hashSenha).not.toHaveBeenCalled();
    expect(mockConnection.release).toHaveBeenCalledTimes(1);
  });

  test('Deve lançar AppError se a senha não for alterada', async () => {
    mockAdmModel.buscarAdm.mockResolvedValue({ id: 8, login: mockAdm.login });
    mockAdmModel.alterarSenhaAdm.mockResolvedValue(0);

    await expect(
      masterService.atualizarSenhaAdm(
        mockAdm.login,
        mockAdm.url,
        mockAdm.novaSenha
      )
    ).rejects.toMatchObject({
      message: 'Senha não foi alterada',
      statusCode: 500,
    });

    expect(hashSenha).toHaveBeenCalledWith(mockAdm.novaSenha);
    expect(mockConnection.release).toHaveBeenCalledTimes(1);
  });

  test('Valida que os erros de regra são AppError', async () => {
    mockAdmModel.buscarAdm.mockResolvedValue(null);

    await expect(
      masterService.atualizarSenhaAdm(
        mockAdm.login,
        mockAdm.url,
        mockAdm.novaSenha
      )
    ).rejects.toBeInstanceOf(AppError);
  });
});
