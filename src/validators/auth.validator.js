import Joi from 'joi';

export const loginSchema = Joi.object({
  login: Joi.string().min(5).max(20).required(),
  senha: Joi.string().min(6).max(20).required(),
});
