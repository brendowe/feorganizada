import authService from '../services/authService.js';

class authController {
  async login(req, res) {
    try {
      const { url } = req.params;
      const { login, senha } = req.body;

      const token = await authService.login(url, login, senha);
      return res.json({
        message: `usuario ${login} logado com sucesso`,
        token,
      });
    } catch (error) {
      console.error(error);
    }
  }
}

export default new authController();
