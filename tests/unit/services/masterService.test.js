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

await jest.unstable_mockModule('../../../src/models/admModel.js', () => ({
  default: {
    buscarADM: jest.fn(),
    cadastrarAdm: jest.fn(),
    alterarSenhaAdm: jest.fn(),
  },
}));

await jest.unstable_mockModule('../../../src/models/igrejaModel.js', () => ({
  default: {
    igrejaId: jest.fn(),
  },
}));

await jest.unstable_mockModule('../../../src/util/hashSenha.js', () => ({
  default: jest.fn(() => Promise.resolve('senha_hashada')),
}));

const { default: hashSenha } = await import('../../../src/util/hashSenha.js');

const { default: admModel } = await import('../../../src/models/admModel.js');

const { default: igrejaModel } =
  await import('../../../src/models/igrejaModel.js');

const { default: masterService } =
  await import('../../../src/services/masterService.js');

const mockAdm = {
  url: 'IgrejaDB',
  id: 5,
  login: 'brendow',
  senha: 'segura123',
  igrejaID: 2,
  novaSenha: 'novasenhasegura12',
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Testes do masterService.cadastrarAdm', () => {
  test('Deve retornar mensagem de sucesso ao cadastrar', async () => {
    admModel.buscarADM.mockResolvedValue(false);
    igrejaModel.igrejaId.mockResolvedValue(2);
    admModel.cadastrarAdm.mockResolvedValue(12);

    const result = await masterService.cadastrarAdm(
      mockAdm.url,
      mockAdm.id,
      mockAdm.login,
      mockAdm.senha
    );

    expect(hashSenha).toHaveBeenCalledWith(mockAdm.senha);

    expect(mockConnection.beginTransaction).toHaveBeenCalled();
    expect(mockConnection.commit).toHaveBeenCalled();
    expect(mockConnection.rollback).not.toHaveBeenCalled();
    expect(mockConnection.release).toHaveBeenCalled();

    expect(result).toBe('Novo adm cadastrado com sucesso');
  });

  test('Deve retornar um erro caso o usuário já seja um ADM', async () => {
    admModel.buscarADM.mockResolvedValue(true);

    const result = await masterService.cadastrarAdm(
      mockAdm.url,
      mockAdm.id,
      mockAdm.login,
      mockAdm.senha
    );

    expect(hashSenha).not.toHaveBeenCalled();
    expect(mockConnection.beginTransaction).not.toHaveBeenCalled();
    expect(mockConnection.commit).not.toHaveBeenCalled();
    expect(mockConnection.rollback).not.toHaveBeenCalled();
    expect(mockConnection.release).toHaveBeenCalled();
    expect(result).toBe('Usuário já é adm');
  });

  test('Erro ao cadastrar', async() => {
    const erro = new Error('Falha ao cadastrar');
    admModel.buscarADM.mockResolvedValue(false);
    igrejaModel.igrejaId.mockResolvedValue(2);
    admModel.cadastrarAdm.mockRejectedValue(erro);

    await expect (masterService.cadastrarAdm(
      mockAdm.url,
      mockAdm.id,
      mockAdm.login,
      mockAdm.senha
    )).rejects.toThrow('Falha ao cadastrar');

    expect(mockConnection.beginTransaction).toHaveBeenCalled();
    expect(mockConnection.commit).not.toHaveBeenCalled();
    expect(mockConnection.rollback).toHaveBeenCalled();
    expect(mockConnection.release).toHaveBeenCalled();
  })
});

describe('Testes do masterService.atualizarSenhaAdm', () => {
  test('Deve retornar uma mensagem de sucesso', async () => {
    admModel.buscarADM.mockResolvedValue(true);
    admModel.alterarSenhaAdm.mockResolvedValue(1);

    let result = await masterService.atualizarSenhaAdm(
      mockAdm.login,
      mockAdm.url,
      mockAdm.novaSenha
    );

    expect(hashSenha).toHaveBeenCalledWith(mockAdm.novaSenha);
    expect(mockConnection.beginTransaction).toHaveBeenCalled();
    expect(mockConnection.commit).toHaveBeenCalled();
    expect(mockConnection.rollback).not.toHaveBeenCalled();
    expect(mockConnection.release).toHaveBeenCalled();
    expect(result).toBe('Senha alterada com sucesso');
  });

  test('Deve retornar mensagem de erro se não encontrar o Adm', async () => {
    admModel.buscarADM.mockResolvedValue(false);

    let result = await masterService.atualizarSenhaAdm(
      mockAdm.login,
      mockAdm.url,
      mockAdm.novaSenha
    );

    expect(hashSenha).not.toHaveBeenCalled();
    expect(mockConnection.beginTransaction).not.toHaveBeenCalled();
    expect(mockConnection.commit).not.toHaveBeenCalled();
    expect(mockConnection.rollback).not.toHaveBeenCalled();
    expect(mockConnection.release).toHaveBeenCalled();
    expect(result).toBe('Adm não cadastrado');
  });

  test('Deve retornar erro se a senha não for alterada', async () => {
    admModel.buscarADM.mockResolvedValue(true);
    admModel.alterarSenhaAdm.mockResolvedValue(0);

    let result = await masterService.atualizarSenhaAdm(
      mockAdm.login,
      mockAdm.url,
      mockAdm.novaSenha
    );

    expect(hashSenha).toHaveBeenCalledWith(mockAdm.novaSenha);
    expect(mockConnection.beginTransaction).toHaveBeenCalled();
    expect(mockConnection.commit).not.toHaveBeenCalled();
    expect(mockConnection.rollback).not.toHaveBeenCalled();
    expect(mockConnection.release).toHaveBeenCalled();
    expect(result).toBe('Senha não foi alterada');
  });

  test('Retorna erro caso algo tenha quebrado', async() => {

    const erro = new Error('Falha ao cadastrar');
    admModel.buscarADM.mockResolvedValue(true);
    admModel.alterarSenhaAdm.mockRejectedValue(erro);

    await expect (masterService.atualizarSenhaAdm(
      mockAdm.login,
      mockAdm.id,
      mockAdm.novaSenha,
    )).rejects.toThrow('Falha ao cadastrar');

    expect(hashSenha).toHaveBeenCalledWith(mockAdm.novaSenha);
    expect(mockConnection.beginTransaction).toHaveBeenCalled();
    expect(mockConnection.commit).not.toHaveBeenCalled();
    expect(mockConnection.rollback).toHaveBeenCalled();
    expect(mockConnection.release).toHaveBeenCalled();




  })
});
