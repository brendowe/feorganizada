import masterService from '../services/masterService.js';

class masterController {
  async cadastarAdm(req, res) {
    try {
      const { url, id } = req.params;
      const { login, senha } = req.body;

      return res
        .status(200)
        .json(await masterService.cadastrarAdm(url, id, login, senha));
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }

  async atualizarSenhaAdm(req, res) {
    try {
      const { url, login } = req.params;
      const { novaSenha } = req.body;

      return res
        .status(200)
        .json(await masterService.atualizarSenhaAdm(login, url, novaSenha));
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
}

export default new masterController();
