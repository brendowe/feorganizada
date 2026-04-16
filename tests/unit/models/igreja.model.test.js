import { jest } from '@jest/globals';
import IgrejaModel from '../../../src/models/igreja.model.js';

describe('Testes do igrejaModel', () => {
  describe('Testes do igrejaModel.cadastrarIgreja', () => {
    test('Deve retornar o id da Igreja cadastrada', async () => {
      const mockIgreja = {
        nomeIgreja: 'Igreja Esperança Viva',
        url: 'esperanca-viva-sp',
      };

      const igrejaId = 1;
      const mockQuery = jest.fn().mockResolvedValue([{ insertId: igrejaId }]);

      const igrejaModel = new IgrejaModel({ query: mockQuery });

      const result = await igrejaModel.cadastrarIgreja(
        mockIgreja.nomeIgreja,
        mockIgreja.url
      );

      expect(mockQuery).toHaveBeenCalledWith(
        'INSERT INTO igreja (nome, url) VALUES (?, ?)',
        [mockIgreja.nomeIgreja, mockIgreja.url]
      );

      expect(result).toBe(1);
    });
  });

  describe('Testes do igrejaModel.cadastrarEndereço', () => {
    test('Deve retornar o id do endereço', async () => {
      const mockEndereco = {
        estado: 'SP',
        cidade: 'São Paulo',
        bairro: 'Jardim das Flores',
        rua: 'Rua das Oliveiras',
        complemento: 'Próximo à praça central',
      };

      const mockIgrejaId = 5;

      const mockQuery = jest
        .fn()
        .mockResolvedValue([{ insertId: mockIgrejaId }]);

      const igrejaModel = new IgrejaModel({ query: mockQuery });

      const result = await igrejaModel.cadastrarEndereço(
        mockIgrejaId,
        mockEndereco
      );

      expect(mockQuery).toHaveBeenCalledWith(
        'INSERT INTO igreja_endereco (igreja_id, estado, cidade, bairro, rua, complemento) VALUES (?, ?, ?, ?, ?, ?)',
        [
          mockIgrejaId,
          mockEndereco.estado,
          mockEndereco.cidade,
          mockEndereco.bairro,
          mockEndereco.rua,
          mockEndereco.complemento,
        ]
      );

      expect(result).toBe(5);
    });
  });

  describe('Testes do igrejaModel.cadastrarTelefone', () => {
    test('Retorna o id do telefone cadastrado', async () => {
      const mockIgreja = {
        igreja_id: 71,
        telefoneIgreja: '(11) 91234-5678',
      };

      const mockQuery = jest
        .fn()
        .mockResolvedValue([{ insertId: mockIgreja.igreja_id }]);

      const igrejaModel = new IgrejaModel({ query: mockQuery });

      const result = await igrejaModel.cadastrarTelefone(
        mockIgreja.igreja_id,
        mockIgreja.telefoneIgreja
      );

      expect(mockQuery).toHaveBeenCalledWith(
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

      const mockQuery = jest
        .fn()
        .mockResolvedValue([[{ url: mockIgreja.url }]]);

      const igrejaModel = new IgrejaModel({ query: mockQuery });

      const result = await igrejaModel.verificarIgreja(mockIgreja.url);

      expect(mockQuery).toHaveBeenCalledWith(
        'SELECT url FROM igreja WHERE url = ?',
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

       const mockQuery = jest
        .fn()
        .mockResolvedValue([[]]);

      const igrejaModel = new IgrejaModel({ query: mockQuery });

      const result = await igrejaModel.verificarIgreja(
        mockIgreja.url
      );

      expect(mockQuery).toHaveBeenCalledWith(
        'SELECT url FROM igreja WHERE url = ?',
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

      const mockQuery = jest
        .fn()
        .mockResolvedValue([[{ id: mockIgreja.id }]]);

      const igrejaModel = new IgrejaModel({ query: mockQuery });

      const result = await igrejaModel.igrejaId(mockIgreja.url);

      expect(mockQuery).toHaveBeenCalledWith(
        'SELECT id FROM igreja WHERE url = ?',
        [mockIgreja.url]
      );

      expect(result).toBe(2);
    });

    test('Deve retornar null caso não encontre a Igreja', async () => {
      const mockIgreja = {
        url: 'esperanca-viva-sp',
      };

      const mockQuery = jest
        .fn()
        .mockResolvedValue([[]]);

      const igrejaModel = new IgrejaModel({ query: mockQuery });

      const result = await igrejaModel.igrejaId(mockIgreja.url);

      expect(mockQuery).toHaveBeenCalledWith(
        'SELECT id FROM igreja WHERE url = ?',
        [mockIgreja.url]
      );

      expect(result).toBe(null);
    });
  });
});
