import express from 'express';
import authRouter from './routes/auth.routes.js';
import usuariosRouter from './routes/usuarios.routes.js';
import masterRouter from './routes/master.routes.js';
import ministeriosRouter from './routes/ministerios.routes.js';
import igrejaRouter from './routes/igreja.routes.js';
import cors from 'cors';
import { errorHandler } from './middlewares/error.middleware.js';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import path from 'path';

class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
    this.swagger();
    this.errorHandler();
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
    this.server.use('/api', igrejaRouter);
  }

  errorHandler() {
    this.server.use(errorHandler);
  }

  swagger() {
    const options = {
      definition: {
        openapi: '3.0.0',
        info: {
          title: 'API de Gerenciamento de Igrejas',
          version: '1.0.0',
        },
        components: {
          securitySchemes: {
            bearerAuth: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT',
            },
          },
        },
        servers: [
          {
            url: '/api',
            description: 'Base da API',
          },
        ],
      },
      apis: [path.resolve('src/routes/*.js')],
    };

    const specs = swaggerJSDoc(options);

    const swaggerUiOptions = {
      swaggerOptions: {
        persistAuthorization: true,
        requestInterceptor: (req) => {
          const token = window.localStorage.getItem('swagger_jwt_token');
          const normalizedToken = token
            ?.replace(/^Bearer\s+/i, '')
            .replace(/^"|"$/g, '')
            .trim();

          if (normalizedToken && !req.headers.Authorization) {
            req.headers.Authorization = `Bearer ${normalizedToken}`;
          }

          return req;
        },
        responseInterceptor: (res) => {
          try {
            const isLoginRequest = (res.url || '').includes('/login');
            if (isLoginRequest && res.ok && typeof res.text === 'string') {
              const body = JSON.parse(res.text);
              if (body?.token && window.ui?.authActions) {
                window.localStorage.setItem('swagger_jwt_token', body.token);
                window.ui.authActions.authorize({
                  bearerAuth: {
                    name: 'bearerAuth',
                    schema: {
                      type: 'http',
                      in: 'header',
                      name: 'Authorization',
                      scheme: 'bearer',
                      bearerFormat: 'JWT',
                    },
                    value: body.token,
                  },
                });
              }
            }
          } catch {
            // Ignora erros de parse para não impactar demais requests.
          }
          return res;
        },
      },
    };

    this.server.use(
      '/api-docs',
      swaggerUi.serve,
      swaggerUi.setup(specs, swaggerUiOptions)
    );
  }
}

export default new App().server;
