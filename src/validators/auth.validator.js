import Joi from 'joi';

export const loginSchema = Joi.object({
  login: Joi.string().min(5).max(20).required(),
  senha: Joi.string().min(6).max(20).required(),
});

export const cadastroSchema = Joi.object({
  nomeIgreja: Joi.string().min(6).max(100).required(),
  url: Joi.string().min(6).max(20).required(),
  enderecoIgreja: {
    estado: Joi.string().min(2).max(2).required(),
    cidade: Joi.string().max(50).required(),
    bairro: Joi.string().max(50).required(),
    rua: Joi.string().max(150).required(),
    complemento: Joi.string().max(50),
  },
  telefoneIgreja: Joi.string().length(15),
  nome: Joi.string().min(6).max(200).required(),
  nascimento: Joi.date().iso().required(),
  endereco: {
    estado: Joi.string().min(2).max(2).required(),
    cidade: Joi.string().max(50).required(),
    bairro: Joi.string().max(50).required(),
    rua: Joi.string().max(150).required(),
    complemento: Joi.string().max(50),
  },
  telefone: Joi.string().length(15).required(),
  master: {
    login: Joi.string().min(6).max(20).required(),
    senha: Joi.string().min(8).max(24).required(),
    email: Joi.string().email().required(),
  },
});
