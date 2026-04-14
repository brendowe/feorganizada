import MasterService from '../services/master.service.js';

class MasterController {
  async cadastrarAdm(req, res, next) {
    try {
      const { url, id } = req.params;
      const { login, senha } = req.body;

      return res.status(201).json({
        message: 'Administrador cadastrado com sucesso',
        data: await MasterService.cadastrarAdm(url, id, login, senha),
      });
    } catch (error) {
      return next(error);
    }
  }

  async atualizarSenhaAdm(req, res, next) {
    try {
      const { url, login } = req.params;
      const { novaSenha } = req.body; 

      return res.status(200).json({
        message: 'Senha atualizada com sucesso.',
        data: await MasterService.atualizarSenhaAdm(login, url, novaSenha),
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new MasterController();
