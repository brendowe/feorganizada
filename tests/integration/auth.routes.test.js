import supertest from 'supertest';
import app from '../../src/app.js';

describe('POST /cadastro', () => {
  test('Deve retornar uma mensagem de sucesso', async () => {
    const response = await supertest(app)
      .post('/api/cadastro')
      .send({
        nomeIgreja: 'Igreja Esperançaamente4',
        url: 'esperanca 42',
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
          email: 'Sassss@email.com',
        },
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Igreja cadastrada com sucesso');
  });

});
