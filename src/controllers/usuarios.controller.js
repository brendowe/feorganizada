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
}

export default new usuariosController();
