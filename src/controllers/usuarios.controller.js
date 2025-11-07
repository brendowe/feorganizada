import usuariosService from '../services/usuariosService.js';

class usuariosController {
  async cadastrarMembro(req, res) {
    try {
      const { url } = req.params;
      const novoMembro = req.body;

      res.json(await usuariosService.cadastrarMembro(url, novoMembro));
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async buscarMembros(req, res) {
    try {
      const { url } = req.params;
      res.json(await usuariosService.buscarMembros(url));
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async buscarMembro(req, res) {
    try {
      const { url, id } = req.params;

      res.json(await usuariosService.buscarMembro(url, id));
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async buscarAniversariantes(req, res) {
    try {
      const { url, mes } = req.params;

      res.json(await usuariosService.buscarAniversariantes(url, mes));
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default new usuariosController();
