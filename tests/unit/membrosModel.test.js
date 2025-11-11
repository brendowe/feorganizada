import membrosModel from '../../src/models/membrosModel.js';

describe('Testes do membrosModel', () => {
  describe('Testes do membrosModel.cadastrarMembro', () => {
    test('Deve retornar o id do membro cadastrado', async () => {
      const mockMembro = {
        nome: 'Carlos Silva',
        nascimento: '1985-07-23',
        igrejaId: 71,
      };

      const connection = {
        query: jest.fn().mockResolvedValue([{ insertId: 6 }]),
      };

      const result = await membrosModel.cadastrarMembro(
        mockMembro.igrejaId,
        mockMembro.nome,
        mockMembro.nascimento,
        connection
      );

      expect(connection.query).toHaveBeenCalledWith(
        'INSERT INTO membros (nome, nascimento, igreja_id) VALUES (?, ?, ?)',
        [mockMembro.nome, mockMembro.nascimento, mockMembro.igrejaId]
      );

      expect(result).toEqual(6);
    });
  });

  describe('Testes do membrosModel.cadastrarEndereco', () => {
    test('Deve retornar o id do endereço cadastrado', async () => {
      const mockEndereco = {
        estado: 'SP',
        cidade: 'São Paulo',
        bairro: 'Vila Nova',
        rua: 'Rua dos Lírios',
        complemento: 'Apartamento 101',
      };

      const membrosId = 6;

      const connection = {
        query: jest.fn().mockResolvedValue([{ insertId: 10 }]),
      };

      const result = await membrosModel.cadastrarEndereco(
        membrosId,
        mockEndereco,
        connection
      );

      expect(connection.query).toHaveBeenCalledWith(
        'INSERT INTO membros_endereco (estado, cidade, bairro, rua, complemento, membros_id) VALUES (?, ?, ?, ?, ?, ?)',
        [
          mockEndereco.estado,
          mockEndereco.cidade,
          mockEndereco.bairro,
          mockEndereco.rua,
          mockEndereco.complemento,
          membrosId,
        ]
      );

      expect(result).toEqual(10);
    });
  });

  describe('Testes do membrosModel.cadastrarTelefone', () => {
    test('Deve retornar o id do telefone cadastrado', async () => {
      const mockTelefone = {
        telefone: '(11) 99876-5432',
        id: 15,
      };

      const connection = {
        query: jest.fn().mockResolvedValue([{ insertId: 666 }]),
      };

      const result = await membrosModel.cadastrarTelefone(
        mockTelefone.id,
        mockTelefone.telefone,
        connection
      );

      expect(connection.query).toHaveBeenCalledWith(
        'INSERT INTO membros_telefone (telefone, membros_id) VALUES (?, ?)',
        [mockTelefone.telefone, mockTelefone.id]
      );

      expect(result).toEqual(666);
    });
  });

  describe('Testes do membrosModel.buscarMembros', () => {
    test('Deve retornar uma array com os membros cadastrados naquela URL de Igreja', async () => {
      const mockUrl = 'esperanca-viva-sp';
      const mockMembros = {
        id: 1,
        nome: 'Carlos Silva',
        nascimento: '1985-07-23',
        nomeIgreja: 'Igreja Esperança Viva',
        url: 'esperanca-viva-sp',
        estado: 'SP',
        cidade: 'São Paulo',
        bairro: 'Jardim das Flores',
        rua: 'Rua das Oliveiras',
        complemento: 'Próximo à praça central',
        telefone: '(11) 99876-5432',
      };

      const connection = {
        query: jest.fn().mockResolvedValue([mockMembros]),
      };

      const result = await membrosModel.buscarMembros(mockUrl, connection);

      expect(connection.query).toHaveBeenCalledWith(
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
    url = ? `,
        [mockUrl]
      );

      expect(result).toEqual(mockMembros);
    });
  });

  describe('Testes do membrosModel.buscarMembro', () => {
    test('Deve retornar o membro cadastrado naquela URL de Igreja e que possua aquele id', async () => {
      const mockMembro = {
        url: 'esperanca-viva-sp',
        id: 71,
      };
      const mockMembros = {
        id: 71,
        nome: 'Carlos Silva',
        nascimento: '1985-07-23',
        nomeIgreja: 'Igreja Esperança Viva',
        url: 'esperanca-viva-sp',
        estado: 'SP',
        cidade: 'São Paulo',
        bairro: 'Jardim das Flores',
        rua: 'Rua das Oliveiras',
        complemento: 'Próximo à praça central',
        telefone: '(11) 99876-5432',
      };

      const connection = {
        query: jest.fn().mockResolvedValue([mockMembros]),
      };

      const result = await membrosModel.buscarMembro(
        mockMembro.url,
        mockMembro.id,
        connection
      );

      expect(connection.query).toHaveBeenCalledWith(
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
    url = ? AND m.id = ?`,
        [mockMembro.url, mockMembro.id]
      );

      expect(result).toEqual(mockMembros);
    });
  });

  describe('Testes do membrosModel.buscarAniversariantes', () => {
    test('Deve retornar todos os aniversariantes de um determinado mês', async () => {
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
        {
          id: 3,
          nome: 'Brendo Washington 22222',
          nascimento: '2001-05-22 00:00:00',
          telefone: '(71) 91234-5678',
        },
      ];

      const connection = {
        query: jest.fn().mockResolvedValue([mockAniversariantes]),
      };

      const result = await membrosModel.buscarAniversariantes(
        mockInfos.url,
        mockInfos.mes,
        connection
      );

      expect(connection.query).toHaveBeenCalledWith(
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
    url = ? AND MONTH (m.nascimento) = ?`,
        [mockInfos.url, mockInfos.mes]
      );

      expect(result).toEqual(mockAniversariantes);
    });
  });
});
