import { beforeAll, beforeEach, expect, jest, test } from '@jest/globals';

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
    verificarIgreja: jest.fn(),
    cadastrarIgreja: jest.fn(),
    cadastrarEndereço: jest.fn(),
    cadastrarTelefone: jest.fn(),
  },
}));

const { default: igrejaModel } =
  await import('../../../src/models/igrejaModel.js');

await jest.unstable_mockModule('../../../src/models/membrosModel.js', () => ({
  default: {
    cadastrarMembro: jest.fn(),
    cadastrarEndereco: jest.fn(),
    cadastrarTelefone: jest.fn(),
  },
}));

const { default: membrosModel } =
  await import('../../../src/models/membrosModel.js');

await jest.unstable_mockModule('../../../src/models/masterModel.js', () => ({
  default: {
    verificarMaster: jest.fn(),
    cadastrarMaster: jest.fn(),
  },
}));

const { default: masterModel } =
  await import('../../../src/models/masterModel.js');

await jest.unstable_mockModule('../../../src/util/hashSenha.js', () => ({
  default: jest.fn(() => Promise.resolve('senha_hashada')),
}));

const { default: hashSenha } = await import('../../../src/util/hashSenha.js');

const { default: cadastroIgrejaService } =
  await import('../../../src/services/cadastroIgrejaService.js');

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

describe('Testes do cadastroIgrejaService', () => {
  test('Deve retornar "Igreja cadastrada com sucesso"', async () => {
    igrejaModel.verificarIgreja.mockResolvedValue(false);
    masterModel.verificarMaster.mockResolvedValue(false);
    igrejaModel.cadastrarIgreja.mockResolvedValue(7);
    igrejaModel.cadastrarEndereço.mockResolvedValue(10);
    igrejaModel.cadastrarTelefone.mockResolvedValue(12);
    membrosModel.cadastrarMembro.mockResolvedValue(15);
    membrosModel.cadastrarEndereco.mockResolvedValue(20);
    membrosModel.cadastrarTelefone.mockResolvedValue(19);
    masterModel.cadastrarMaster.mockResolvedValue(23);

    const result = await cadastroIgrejaService.cadastrarIgreja(mockCadastro);

    expect(mockConnection.beginTransaction).toHaveBeenCalled();
    expect(mockConnection.commit).toHaveBeenCalled();
    expect(mockConnection.release).toHaveBeenCalled();
    expect(hashSenha).toHaveBeenCalledWith('senhaSegura123');

    expect(result).toEqual('Igreja cadastrada com sucesso');
  });

  test('Deve retornar erro caso a url já esteja em uso', async () => {
    igrejaModel.verificarIgreja.mockResolvedValue(true);

    const result = await cadastroIgrejaService.cadastrarIgreja(mockCadastro);
    expect(result).toEqual(`A url ${mockCadastro.url} já está em uso`);

    expect(mockConnection.beginTransaction).not.toHaveBeenCalled();
    expect(mockConnection.commit).not.toHaveBeenCalled();
    expect(mockConnection.rollback).not.toHaveBeenCalled();
    expect(mockConnection.release).toHaveBeenCalled();
  });

  test('Deve retornar erro caso o e-mail já esteja em uso', async () => {
    igrejaModel.verificarIgreja.mockResolvedValue(false);
    masterModel.verificarMaster.mockResolvedValue(true);
    const result = await cadastroIgrejaService.cadastrarIgreja(mockCadastro);

    expect(result).toEqual(
      `O email ${mockCadastro.master.email} já está em uso`
    );

    expect(mockConnection.beginTransaction).not.toHaveBeenCalled();
    expect(mockConnection.commit).not.toHaveBeenCalled();
    expect(mockConnection.rollback).not.toHaveBeenCalled();
    expect(mockConnection.release).toHaveBeenCalled();
  });

  test('Deve retornar erro caso algo quebre', async () => {
    const erro = new Error('Falha ao cadastrar igreja');
    igrejaModel.verificarIgreja.mockResolvedValue(false);
    masterModel.verificarMaster.mockResolvedValue(false);
    igrejaModel.cadastrarIgreja.mockResolvedValue(7);
    igrejaModel.cadastrarEndereço.mockResolvedValue(10);
    igrejaModel.cadastrarTelefone.mockResolvedValue(12);
    membrosModel.cadastrarMembro.mockResolvedValue(15);
    membrosModel.cadastrarEndereco.mockResolvedValue(20);
    membrosModel.cadastrarTelefone.mockResolvedValue(19);
    masterModel.cadastrarMaster.mockRejectedValue(erro);

    await expect(
      cadastroIgrejaService.cadastrarIgreja(mockCadastro)
    ).rejects.toThrow('Falha ao cadastrar igreja');

    expect(hashSenha).toHaveBeenCalledWith(mockCadastro.master.senha);

    expect(mockConnection.beginTransaction).toHaveBeenCalled();
    expect(mockConnection.commit).not.toHaveBeenCalled();
    expect(mockConnection.rollback).toHaveBeenCalled();
    expect(mockConnection.release).toHaveBeenCalled();
  });
});
