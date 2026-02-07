import authService from '../services/authService.js';

class authController {
  async login(req, res, next) {
    try {
      const { url } = req.params;
      const { login, senha } = req.body;

      const token = await authService.login(url, login, senha);
      return res.status(200).json({
        message: `usuario ${login} logado com sucesso`,
        token,
      });
    } catch (error) {
     return next(error);
    }
  }
}

export default new authController();
