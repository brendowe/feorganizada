import Joi from 'joi';

export const urlSchema = Joi.string().max(20).min(6);

export const urlParamSchema  = Joi.object({
  url: urlSchema,
});
