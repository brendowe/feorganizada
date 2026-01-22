import Joi from 'joi';

export const urlSchema = Joi.string().max(20).min(6);

export const url = Joi.object({
  url: urlSchema,
});
