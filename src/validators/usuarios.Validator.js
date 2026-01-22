import Joi from 'joi';
import {urlSchema } from '../validators/url.Validator.js';

export const cadastrarMembroSchema = Joi.object({
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
});

export const buscarMembroSchemaParams = Joi.object({
  url: urlSchema,
  id: Joi.number().required(),
});

export const buscarAniversariantesSchemaParams = Joi.object({
  url: urlSchema,
  mes: Joi.number().min(1).max(12).required(),
});
