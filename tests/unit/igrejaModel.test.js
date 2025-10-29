import igrejaModel from '../../src/models/igrejaModel.js';

describe('Testes do igrejaModel', () => {
  describe('Testes do igrejaModel.cadastrarTelefone', () => {
    test('Retorna o id do telefone cadastrado', async () => {
      const mockIgreja = {
        igreja_id: 71,
        telefoneIgreja: '(11) 91234-5678',
      };

      const connection = {
        query: jest.fn().mockResolvedValue([{ insertId: 71 }]),
      };

      const result = await igrejaModel.cadastrarTelefone(
        mockIgreja.igreja_id,
        mockIgreja.telefoneIgreja,
        connection
      );

      expect(connection.query).toHaveBeenCalledWith(
        'INSERT INTO igreja_telefone (igreja_id, telefone) VALUES (?, ?)',
        [mockIgreja.igreja_id, mockIgreja.telefoneIgreja]
      );

      expect(result).toBe(71);
    });
  });

  describe('Testes do igrejaModel.verificarIgreja', () => {
    test('Deve retornar true se a URL estiver cadastrada', async () => {
      const mockIgreja = {
        id: 2,
        nome: 'Igreja Esperança Viva',
        url: 'esperanca-viva-sp',
      };

      const connection = {
        query: jest.fn().mockResolvedValue([[mockIgreja]]),
      };

      const result = await igrejaModel.verificarIgreja(
        mockIgreja.url,
        connection
      );

      expect(connection.query).toHaveBeenCalledWith(
        'SELECT * FROM igreja WHERE url = ?',
        [mockIgreja.url]
      );

      expect(result).toBe(true);
    });

    test('Deve retornar false se a URL não estiver cadastrada', async () => {
      const mockIgreja = {
        id: 2,
        nome: 'Igreja Esperança Viva',
        url: 'esperanca-viva-sp',
      };

      const connection = {
        query: jest.fn().mockResolvedValue([[]]),
      };

      const result = await igrejaModel.verificarIgreja(
        mockIgreja.url,
        connection
      );

      expect(connection.query).toHaveBeenCalledWith(
        'SELECT * FROM igreja WHERE url = ?',
        [mockIgreja.url]
      );

      expect(result).toBe(false);
    });
  });

  describe('Testes do igrejaModel.igrejaId', () => {
    test('Deve retornar o id da Igreja encontrada', async () => {
      const mockIgreja = {
        id: 2,
        url: 'esperanca-viva-sp',
      };

      const connection = {
        query: jest.fn().mockResolvedValue([[{ id: mockIgreja.id }]]),
      };

      const result = await igrejaModel.igrejaId(mockIgreja.url, connection);

      expect(connection.query).toHaveBeenCalledWith(
        'SELECT id FROM igreja WHERE url = ?',
        [mockIgreja.url]
      );

      expect(result).toBe(2);
    });

    test('Deve retornar null caso não encontre a Igreja', async () => {
      const mockIgreja = {
        url: 'esperanca-viva-sp',
      };

      const connection = {
        query: jest.fn().mockResolvedValue([[]]),
      };

      const result = await igrejaModel.igrejaId(mockIgreja.url, connection);

      expect(connection.query).toHaveBeenCalledWith(
        'SELECT id FROM igreja WHERE url = ?',
        [mockIgreja.url]
      );

      expect(result).toBe(null);
    });
  });
});
