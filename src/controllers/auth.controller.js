import AuthService from '../services/auth.service.js';

class AuthController {
  async login(req, res, next) {
    try {
      const { url } = req.params;
      const { login, senha } = req.body;

      const token = await AuthService.login(url, login, senha);
      return res.status(200).json({
        message: `usuario logado com sucesso`,
        token,
      });
    } catch (error) {
      return next(error);
    }
  }
}

export default new AuthController();
