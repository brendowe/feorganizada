import AppError from '../errors/apperror.js';

const validateMiddleware = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property], {
      abortEarly: true,
    });

    if (error) {
      return next(new AppError(error.details[0].message, 400));
    }

    return next();
  };
};

export default validateMiddleware;
