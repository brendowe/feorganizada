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

await jest.unstable_mockModule(
  '../../../src/models/ministerioModel.js',
  () => ({
    default: {
      verificarMinisterio: jest.fn(),
      cadastrarMinisterio: jest.fn(),
      buscarMinisterios: jest.fn(),
      verificarMinisterioId: jest.fn(),
      verificarMembroMinisterio: jest.fn(),
      cadastrarMembroMinisterio: jest.fn(),
      buscarMembrosMinisterio: jest.fn(),
    },
  })
);

await jest.unstable_mockModule('../../../src/models/membrosModel.js', () => ({
  default: {
    buscarMembro: jest.fn(),
  },
}));

const { default: igrejaModel } =
  await import('../../../src/models/igrejaModel.js');

const { default: ministerioModel } =
  await import('../../../src/models/ministerioModel.js');

const { default: membrosModel } =
  await import('../../../src/models/membrosModel.js');

const { default: ministeriosService } =
  await import('../../../src/services/ministeriosService.js');

const mockMinisterio = {
  nomeMinisterio: 'EBD',
  url: 'Igreja de Deus',
};

const mockMembroMinisterio = {
  url: 'Igreja de Deus',
  ministerioId: 2,
  membroId: 10,
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Testes do ministeriosService.cadastrarMinisterio', () => {
  test('Deve cadastrar com sucesso', async () => {
    igrejaModel.igrejaId.mockResolvedValue(5);
    ministerioModel.verificarMinisterio.mockResolvedValue(false);
    ministerioModel.cadastrarMinisterio.mockResolvedValue(2);

    let result = await ministeriosService.cadastrarMinisterio(mockMinisterio);

    expect(mockConnection.beginTransaction).toHaveBeenCalled();
    expect(mockConnection.commit).toHaveBeenCalled();
    expect(mockConnection.rollback).not.toHaveBeenCalled();
    expect(mockConnection.release).toHaveBeenCalled();

    expect(result).toBe(
      `Ministério ${mockMinisterio.nomeMinisterio} cadastrado com sucesso`
    );
  });

  test('Deve retornar erro se o nome do ministério já estiver cadastrado', async () => {
    igrejaModel.igrejaId.mockResolvedValue(5);
    ministerioModel.verificarMinisterio.mockResolvedValue(true);

    let result = await ministeriosService.cadastrarMinisterio(mockMinisterio);

    expect(mockConnection.beginTransaction).not.toHaveBeenCalled();
    expect(mockConnection.commit).not.toHaveBeenCalled();
    expect(mockConnection.rollback).toHaveBeenCalled();
    expect(mockConnection.release).toHaveBeenCalled();
    expect(result).toBe(
      `O nome de ministério ${mockMinisterio.nomeMinisterio} já está cadastrado`
    );
  });

  test('Deve lançar erro ao ocorrer exceção', async () => {
    let erro = new Error('Erro no banco de dados');
    igrejaModel.igrejaId.mockResolvedValue(5);
    ministerioModel.verificarMinisterio.mockRejectedValue(erro);

    await expect(
      ministeriosService.cadastrarMinisterio(mockMinisterio)
    ).rejects.toThrow(erro);

    expect(mockConnection.beginTransaction).not.toHaveBeenCalled();
    expect(mockConnection.commit).not.toHaveBeenCalled();
    expect(mockConnection.rollback).toHaveBeenCalled();
    expect(mockConnection.release).toHaveBeenCalled();
  });
});

describe('Testes do ministeriosService.buscarMinisterios', () => {
  test('Deve buscar ministérios com sucesso', async () => {
    igrejaModel.igrejaId.mockResolvedValue(3);
    ministerioModel.buscarMinisterios.mockResolvedValue([
      { id: 1, nomeMinisterio: 'EBD' },
      { id: 2, nomeMinisterio: 'Louvor' },
    ]);
    let result = await ministeriosService.buscarMinisterios(mockMinisterio.url);
    expect(mockConnection.beginTransaction).toHaveBeenCalled();
    expect(mockConnection.commit).not.toHaveBeenCalled();
    expect(mockConnection.rollback).not.toHaveBeenCalled();
    expect(mockConnection.release).toHaveBeenCalled();

    expect(result).toEqual([
      { id: 1, nomeMinisterio: 'EBD' },
      { id: 2, nomeMinisterio: 'Louvor' },
    ]);
  });

  test('Deve lançar erro ao ocorrer exceção', async () => {
    let erro = new Error('Erro no banco de dados');
    igrejaModel.igrejaId.mockResolvedValue(3);
    ministerioModel.buscarMinisterios.mockRejectedValue(erro);

    await expect(
      ministeriosService.buscarMinisterios(mockMinisterio.url)
    ).rejects.toThrow(erro);
    expect(mockConnection.beginTransaction).toHaveBeenCalled();
    expect(mockConnection.commit).not.toHaveBeenCalled();
    expect(mockConnection.rollback).toHaveBeenCalled();
    expect(mockConnection.release).toHaveBeenCalled();
  });
});

describe('Testes do ministeriosService.cadastrarMembroMinisterio', () => {
  test('Deve cadastrar membro no ministério com sucesso', async () => {
    igrejaModel.igrejaId.mockResolvedValue(4);
    ministerioModel.verificarMinisterioId.mockResolvedValue(true);

    membrosModel.buscarMembro.mockResolvedValue([
      {
        id: 10,
        nome: 'João Silva',
        nascimento: '1990-05-15',
        nomeIgreja: 'Igreja de Deus',
        url: 'Igreja de Deus',
        estado: 'SP',
        cidade: 'São Paulo',
        bairro: 'Centro',
        rua: 'Rua A',
        complemento: 'Apto 101',
        telefone: '11999999999',
      },
    ]);

    ministerioModel.verificarMembroMinisterio.mockResolvedValue(false);

    ministerioModel.cadastrarMembroMinisterio.mockResolvedValue(1);
    let result = await ministeriosService.cadastrarMembroMinisterio(
      mockMembroMinisterio.url,
      mockMembroMinisterio.ministerioId,
      mockMembroMinisterio.membroId,
      'Líder'
    );
    expect(mockConnection.beginTransaction).toHaveBeenCalled();
    expect(mockConnection.commit).toHaveBeenCalled();
    expect(mockConnection.rollback).not.toHaveBeenCalled();
    expect(mockConnection.release).toHaveBeenCalled();
    expect(result).toBe('Membro cadastrado com sucesso');
  });

  test('Deve retornar erro se a igreja não for encontrada', async () => {
    igrejaModel.igrejaId.mockResolvedValue(null);
    let result = await ministeriosService.cadastrarMembroMinisterio(
      mockMembroMinisterio.url,
      mockMembroMinisterio.ministerioId,
      mockMembroMinisterio.membroId,
      'Líder'
    );
    expect(mockConnection.beginTransaction).toHaveBeenCalled();
    expect(mockConnection.commit).not.toHaveBeenCalled();

    expect(mockConnection.rollback).toHaveBeenCalled();
    expect(mockConnection.release).toHaveBeenCalled();
    expect(result).toBe('Erro. Igreja não encontrada');
  });
  test('Deve lançar erro se o ministério não for encontrado', async () => {
    igrejaModel.igrejaId.mockResolvedValue(4);
    ministerioModel.verificarMinisterioId.mockResolvedValue(false);
    let result = await ministeriosService.cadastrarMembroMinisterio(
      mockMembroMinisterio.url,
      mockMembroMinisterio.ministerioId,
      mockMembroMinisterio.membroId,
      'Líder'
    );
    expect(mockConnection.beginTransaction).toHaveBeenCalled();
    expect(mockConnection.commit).not.toHaveBeenCalled();
    expect(mockConnection.rollback).toHaveBeenCalled();
    expect(mockConnection.release).toHaveBeenCalled();
    expect(result).toBe('Erro. Ministério não encontrado');
  });

  test('Deve lançar erro se o membro não for encontrado', async () => {
    igrejaModel.igrejaId.mockResolvedValue(4);
    ministerioModel.verificarMinisterioId.mockResolvedValue(true);
    membrosModel.buscarMembro.mockResolvedValue(null);
    let result = await ministeriosService.cadastrarMembroMinisterio(
      mockMembroMinisterio.url,
      mockMembroMinisterio.ministerioId,
      mockMembroMinisterio.membroId,
      'Líder'
    );
    expect(mockConnection.beginTransaction).toHaveBeenCalled();
    expect(mockConnection.commit).not.toHaveBeenCalled();
    expect(mockConnection.rollback).toHaveBeenCalled();
    expect(mockConnection.release).toHaveBeenCalled();
    expect(result).toBe('Erro. Membro não encontrado.');
  });
  test('Deve lançar erro se o membro já estiver cadastrado no ministério', async () => {
    igrejaModel.igrejaId.mockResolvedValue(4);
    ministerioModel.verificarMinisterioId.mockResolvedValue(true);
    membrosModel.buscarMembro.mockResolvedValue([
      {
        id: 10,
        nome: 'João Silva',
        nascimento: '1990-05-15',
        nomeIgreja: 'Igreja de Deus',
        url: 'Igreja de Deus',
        estado: 'SP',
        cidade: 'São Paulo',
        bairro: 'Centro',
        rua: 'Rua A',
        complemento: 'Apto 101',
        telefone: '11999999999',
      },
    ]);
    ministerioModel.verificarMembroMinisterio.mockResolvedValue(true);
    let result = await ministeriosService.cadastrarMembroMinisterio(
      mockMembroMinisterio.url,
      mockMembroMinisterio.ministerioId,
      mockMembroMinisterio.membroId,
      'Líder'
    );
    expect(mockConnection.beginTransaction).toHaveBeenCalled();
    expect(mockConnection.commit).not.toHaveBeenCalled();
    expect(mockConnection.rollback).toHaveBeenCalled();
    expect(mockConnection.release).toHaveBeenCalled();
    expect(result).toBe('Erro. Membro já cadastrado nesse ministério');
  });
  test('Deve lançar erro ao ocorrer exceção', async () => {
    let erro = new Error('Erro no banco de dados');
    igrejaModel.igrejaId.mockResolvedValue(4);
    ministerioModel.verificarMinisterioId.mockResolvedValue(true);
    membrosModel.buscarMembro.mockRejectedValue(erro);
    await expect(
      ministeriosService.cadastrarMembroMinisterio(
        mockMembroMinisterio.url,
        mockMembroMinisterio.ministerioId,
        mockMembroMinisterio.membroId,
        'Líder'
      )
    ).rejects.toThrow(erro);
    expect(mockConnection.beginTransaction).toHaveBeenCalled();
  });
  test('Deve lançar erro se o membro nao for cadastrado no ministério', async () => {
    let erro = new Error('Erro no banco de dados');
    igrejaModel.igrejaId.mockResolvedValue(4);
    ministerioModel.verificarMinisterioId.mockResolvedValue(true);
    membrosModel.buscarMembro.mockResolvedValue([
      {
        id: 10,
        nome: 'João Silva',
        nascimento: '1990-05-15',
        nomeIgreja: 'Igreja de Deus',
        url: 'Igreja de Deus',
        estado: 'SP',
        cidade: 'São Paulo',
        bairro: 'Centro',
        rua: 'Rua A',
        complemento: 'Apto 101',

        telefone: '11999999999',
      },
    ]);
    ministerioModel.verificarMembroMinisterio.mockResolvedValue(false);
    ministerioModel.cadastrarMembroMinisterio.mockRejectedValue(erro);

    await expect(
      ministeriosService.cadastrarMembroMinisterio(
        mockMembroMinisterio.url,
        mockMembroMinisterio.ministerioId,
        mockMembroMinisterio.membroId,

        'Líder'
      )
    ).rejects.toThrow(erro);
    expect(mockConnection.beginTransaction).toHaveBeenCalled();
  });

  test('Deve lançar erro se o membro não foi cadastrado no ministério', async () => {
    let erro = new Error('Erro. Membro não foi cadastrado.');
    igrejaModel.igrejaId.mockResolvedValue(4);
    ministerioModel.verificarMinisterioId.mockResolvedValue(true);
    membrosModel.buscarMembro.mockResolvedValue([
      {
        id: 10,
        nome: 'João Silva',
        nascimento: '1990-05-15',
        nomeIgreja: 'Igreja de Deus',
        url: 'Igreja de Deus',
        estado: 'SP',
        cidade: 'São Paulo',
        bairro: 'Centro',
        rua: 'Rua A',
        complemento: 'Apto 101',
        telefone: '11999999999',
      },
    ]);
    ministerioModel.verificarMembroMinisterio.mockResolvedValue(false);
    ministerioModel.cadastrarMembroMinisterio.mockResolvedValue(null);
  });

  describe('Testes do ministeriosService.buscarMembrosMinisterio', () => {
    test('Deve buscar membros do ministério com sucesso', async () => {
      igrejaModel.igrejaId.mockResolvedValue(4);
      ministerioModel.buscarMembrosMinisterio.mockResolvedValue([
        {
          id: 10,
          nome: 'João Silva',
          funcao: 'Líder',
        },

        {
          id: 12,
          nome: 'Maria Souza',
          funcao: 'Membro',
        },
      ]);
      let result = await ministeriosService.buscarMembrosMinisterio(
        mockMembroMinisterio.url,
        mockMembroMinisterio.ministerioId
      );
      expect(mockConnection.beginTransaction).toHaveBeenCalled();
      expect(mockConnection.commit).not.toHaveBeenCalled();
      expect(mockConnection.rollback).not.toHaveBeenCalled();
      expect(mockConnection.release).toHaveBeenCalled();
      expect(result).toEqual([
        {
          id: 10,
          nome: 'João Silva',
          funcao: 'Líder',
        },
        {
          id: 12,
          nome: 'Maria Souza',
          funcao: 'Membro',
        },
      ]);
    });
    test('Deve lançar erro caso os membros não sejam encontrados', async () => {
      igrejaModel.igrejaId.mockResolvedValue(4);
      ministerioModel.buscarMembrosMinisterio.mockResolvedValue(null);
      let result = await ministeriosService.buscarMembrosMinisterio(
        mockMembroMinisterio.url,
        mockMembroMinisterio.ministerioId
      );
      expect(mockConnection.beginTransaction).toHaveBeenCalled();
      expect(mockConnection.commit).not.toHaveBeenCalled();
      expect(mockConnection.rollback).toHaveBeenCalled();
      expect(mockConnection.release).toHaveBeenCalled();
      expect(result).toBe('Erro. Membros não encontrados');
    });
    test('Deve lançar erro ao ocorrer exceção', async () => {
      let erro = new Error('Erro no banco de dados');
      igrejaModel.igrejaId.mockResolvedValue(4);
      ministerioModel.buscarMembrosMinisterio.mockRejectedValue(erro);
      await expect(
        ministeriosService.buscarMembrosMinisterio(
          mockMembroMinisterio.url,
          mockMembroMinisterio.ministerioId
        )
      ).rejects.toThrow(erro);
      expect(mockConnection.beginTransaction).toHaveBeenCalled();

      expect(mockConnection.commit).not.toHaveBeenCalled();
      expect(mockConnection.rollback).toHaveBeenCalled();
      expect(mockConnection.release).toHaveBeenCalled();
    });
  });
});
