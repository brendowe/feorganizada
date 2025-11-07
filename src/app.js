import express from 'express';
import authRouter from './routes/auth.routes.js';
import usuariosRouter from './routes/usuarios.routes.js';
import masterRouter from './routes/master.routes.js';

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
    this.server.use('/api', masterRouter);
  }

  exceptionHandler() {
    this.server.use(errorMiddleware);
  }
}

export default new App().server;
