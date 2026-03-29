import Joi from 'joi';
import { urlSchema } from './url.validator.js';

export const cadastrarMinisterioSchemma = Joi.object({
  nomeMinisterio: Joi.string().min(6).max(25).required(),
});

export const MinisterioSchemaParams = Joi.object({
  url: urlSchema,
  ministerioId: Joi.number().required(),
});

export const cadastrarMembrosSchema = Joi.object({
  membroId: Joi.number().required(),
  funcao: Joi.string().min(4).max(15).required(),
});
