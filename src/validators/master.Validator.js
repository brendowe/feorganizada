import Joi from 'joi';
import { urlSchema } from './url.Validator.js';

export const cadastroAdmSchemaParams = Joi.object({
  url: urlSchema,
  id: Joi.number().required(),
});

export const cadastroAdmSchema = Joi.object({
  login: Joi.string().min(6).max(20).required(),
  senha: Joi.string().min(8).max(24).required(),
});

export const autMasterParams = Joi.object({
  url: urlSchema,
  login: Joi.string().min(6).max(20).required(),
});

export const novaSenhaAdmSchema = Joi.object({
  novaSenha: Joi.string().min(8).max(24).required(),
});
