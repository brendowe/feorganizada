import express from 'express';
import authRouter from './routes/auth.routes.js';

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
  }
}

export default new App().server;
