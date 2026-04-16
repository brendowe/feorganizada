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
  verificarIgreja: jest.fn(),
  cadastrarIgreja: jest.fn(),
  cadastrarEndereço: jest.fn(),
  cadastrarTelefone: jest.fn(),
};

const mockMembrosModel = {
  cadastrarMembro: jest.fn(),
  cadastrarEndereco: jest.fn(),
  cadastrarTelefone: jest.fn(),
};

const mockMasterModel = {
  verificarMaster: jest.fn(),
  cadastrarMaster: jest.fn(),
};

const IgrejaModelMock = jest.fn(() => mockIgrejaModel);
const MembrosModelMock = jest.fn(() => mockMembrosModel);
const MasterModelMock = jest.fn(() => mockMasterModel);

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

await jest.unstable_mockModule('../../../src/models/master.model.js', () => ({
  default: MasterModelMock,
}));

await jest.unstable_mockModule('../../../src/utils/hashsenha.util.js', () => ({
  default: jest.fn(() => Promise.resolve('senha_hashada')),
}));

const { default: hashSenha } =
  await import('../../../src/utils/hashsenha.util.js');

const { default: igrejaService } =
  await import('../../../src/services/igreja.service.js');

const mockCadastro = {
  nomeIgreja: 'Igreja Esperança Viva',
  url: 'esperanca-viva-sps',
  enderecoIgreja: {
    estado: 'SP',
    cidade: 'São Paulo',
    bairro: 'Jardim das Flores',
    rua: 'Rua das Oliveiras',
    complemento: 'Próximo à praça central',
  },
  telefoneIgreja: '(11) 91234-5678',
  nome: 'Carlos Silva',
  nascimento: '1985-07-23',
  endereco: {
    estado: 'SP',
    cidade: 'São Paulo',
    bairro: 'Vila Nova',
    rua: 'Rua dos Lírios',
    complemento: 'Apartamento 101',
  },
  telefone: '(11) 99876-5432',
  master: {
    login: 'carlossilva',
    senha: 'senhaSegura123',
    email: 'car2lossilva@email.com',
  },
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Testes do igrejaService.cadastrarIgreja', () => {
  test('Deve cadastrar igreja com sucesso e retornar o igrejaId', async () => {
    mockIgrejaModel.verificarIgreja.mockResolvedValue(false);
    mockMasterModel.verificarMaster.mockResolvedValue(false);
    mockIgrejaModel.cadastrarIgreja.mockResolvedValue(7);
    mockIgrejaModel.cadastrarEndereço.mockResolvedValue(10);
    mockIgrejaModel.cadastrarTelefone.mockResolvedValue(12);
    mockMembrosModel.cadastrarMembro.mockResolvedValue(15);
    mockMembrosModel.cadastrarEndereco.mockResolvedValue(20);
    mockMembrosModel.cadastrarTelefone.mockResolvedValue(19);
    mockMasterModel.cadastrarMaster.mockResolvedValue(23);

    const result = await igrejaService.cadastrarIgreja(
      structuredClone(mockCadastro)
    );

    expect(getConnectionMock).toHaveBeenCalledTimes(1);
    expect(IgrejaModelMock).toHaveBeenCalledWith(mockConnection);
    expect(MembrosModelMock).toHaveBeenCalledWith(mockConnection);
    expect(MasterModelMock).toHaveBeenCalledWith(mockConnection);
    expect(mockConnection.beginTransaction).toHaveBeenCalledTimes(1);
    expect(mockConnection.commit).toHaveBeenCalledTimes(1);
    expect(mockConnection.rollback).not.toHaveBeenCalled();
    expect(mockConnection.release).toHaveBeenCalledTimes(1);
    expect(hashSenha).toHaveBeenCalledWith('senhaSegura123');
    expect(mockMasterModel.cadastrarMaster).toHaveBeenCalledWith(
      7,
      15,
      expect.objectContaining({ senha: 'senha_hashada' })
    );
    expect(result).toBe(7);
  });

  test('Deve lançar AppError se a url já estiver em uso', async () => {
    mockIgrejaModel.verificarIgreja.mockResolvedValue(true);

    await expect(
      igrejaService.cadastrarIgreja(structuredClone(mockCadastro))
    ).rejects.toMatchObject({
      message: `A url ${mockCadastro.url} já está em uso`,
      statusCode: 409,
    });

    expect(hashSenha).not.toHaveBeenCalled();
    expect(mockConnection.beginTransaction).not.toHaveBeenCalled();
    expect(mockConnection.commit).not.toHaveBeenCalled();
    expect(mockConnection.rollback).toHaveBeenCalledTimes(1);
    expect(mockConnection.release).toHaveBeenCalledTimes(1);
  });

  test('Deve lançar AppError se o e-mail já estiver em uso', async () => {
    mockIgrejaModel.verificarIgreja.mockResolvedValue(false);
    mockMasterModel.verificarMaster.mockResolvedValue(true);

    await expect(
      igrejaService.cadastrarIgreja(structuredClone(mockCadastro))
    ).rejects.toMatchObject({
      message: `O email ${mockCadastro.master.email} já está em uso`,
      statusCode: 409,
    });

    expect(hashSenha).not.toHaveBeenCalled();
    expect(mockConnection.beginTransaction).not.toHaveBeenCalled();
    expect(mockConnection.commit).not.toHaveBeenCalled();
    expect(mockConnection.rollback).toHaveBeenCalledTimes(1);
    expect(mockConnection.release).toHaveBeenCalledTimes(1);
  });

  test('Deve dar rollback e relançar erro se algo quebrar no fluxo', async () => {
    const erro = new Error('Falha ao cadastrar igreja');
    mockIgrejaModel.verificarIgreja.mockResolvedValue(false);
    mockMasterModel.verificarMaster.mockResolvedValue(false);
    mockIgrejaModel.cadastrarIgreja.mockResolvedValue(7);
    mockIgrejaModel.cadastrarEndereço.mockResolvedValue(10);
    mockIgrejaModel.cadastrarTelefone.mockResolvedValue(12);
    mockMembrosModel.cadastrarMembro.mockResolvedValue(15);
    mockMembrosModel.cadastrarEndereco.mockResolvedValue(20);
    mockMembrosModel.cadastrarTelefone.mockResolvedValue(19);
    mockMasterModel.cadastrarMaster.mockRejectedValue(erro);

    await expect(
      igrejaService.cadastrarIgreja(structuredClone(mockCadastro))
    ).rejects.toThrow('Falha ao cadastrar igreja');

    expect(hashSenha).toHaveBeenCalledWith(mockCadastro.master.senha);

    expect(mockConnection.beginTransaction).toHaveBeenCalledTimes(1);
    expect(mockConnection.commit).not.toHaveBeenCalled();
    expect(mockConnection.rollback).toHaveBeenCalledTimes(1);
    expect(mockConnection.release).toHaveBeenCalledTimes(1);
  });

  test('As validações de conflito devem retornar AppError', async () => {
    mockIgrejaModel.verificarIgreja.mockResolvedValue(true);

    await expect(
      igrejaService.cadastrarIgreja(structuredClone(mockCadastro))
    ).rejects.toBeInstanceOf(AppError);
  });
});
