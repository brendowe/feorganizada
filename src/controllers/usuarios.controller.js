import usuariosService from '../services/usuariosService.js';

class UsuariosController {
  async cadastrarMembro(req, res, next) {
    try {
      const { url } = req.params;
      const novoMembro = req.body;

      return res.status(201).json({
        message: 'Membro cadastrado com sucesso',
        data: await usuariosService.cadastrarMembro(url, novoMembro),
      });
    } catch (error) {
      return next(error);
    }
  }

  async buscarMembros(req, res, next) {
    try {
      const { url } = req.params;

      return res.status(200).json({
        message: 'Membros encontrados',
        data: await usuariosService.buscarMembros(url),
      });
    } catch (error) {
      return next(error);
    }
  }

  async buscarMembro(req, res, next) {
    try {
      const { url, id } = req.params;

      return res.status(200).json({
        message: 'Membro encontrado',
        data: await usuariosService.buscarMembro(url, id),
      });
    } catch (error) {
      return next(error);
    }
  }

  async buscarAniversariantes(req, res, next) {
    try {
      const { url, mes } = req.params;

      return res.status(200).json({
        message: 'Aniversariantes encontrados',
        data: await usuariosService.buscarAniversariantes(url, mes),
      });
    } catch (error) {
      return next(error);
    }
  }

  async deletarMembro(req, res, next) {
    try {
      const { url, id } = req.params;

      return res.status(200).json({
        message: 'Membro deletado com sucesso',
        data: await usuariosService.deletarMembro(url, id),
      });
    } catch (error) {
      return next(error);
    }
  }
}

export default new UsuariosController();
