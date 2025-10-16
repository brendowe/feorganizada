import express from 'express';
import authRouter from './routes/auth.routes.js';
import usuariosRouter from './routes/usuarios.routes.js';

class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json());
  }

  routes() {
    this.server.use('/api', authRouter);
    this.server.use('/api', usuariosRouter);
  }

  exceptionHandler() {
    this.server.use(errorMiddleware);
  }
}

export default new App().server;
