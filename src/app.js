import express from 'express';
import authRouter from './routes/auth.routes.js';
import usuariosRouter from './routes/usuarios.routes.js';
import masterRouter from './routes/master.routes.js';
import ministeriosRouter from './routes/ministerios.routes.js';
import cors from 'cors';

class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(cors({ origin: 'http://127.0.0.1:5500' }));
    this.server.use(express.json());
  }

  routes() {
    this.server.use('/api', authRouter);
    this.server.use('/api', usuariosRouter);
    this.server.use('/api', masterRouter);
    this.server.use('/api', ministeriosRouter);
  }

  exceptionHandler() {
    this.server.use(errorMiddleware);
  }
}

export default new App().server;
