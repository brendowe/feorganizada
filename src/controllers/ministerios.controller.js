import ministeriosService from '../services/ministeriosService.js';

class ministeriosController {
  async cadastrarMinisterio(req, res) {
    const { url } = req.params;
    const { nomeMinisterio } = req.body;
    const novoMinisterio = { url, nomeMinisterio };

    try {
      res
        .status(200)
        .json(await ministeriosService.cadastrarMinisterio(novoMinisterio));
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async buscarMinisterios(req, res) {
    const { url } = req.params;

    try {
      res.status(200).json(await ministeriosService.buscarMinisterios(url));
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async cadastrarMembroMinisterio(req, res) {
    const { url, ministerioId } = req.params;
    const { membroId, funcao } = req.body;

    try {
      res
        .status(200)
        .json(
          await ministeriosService.cadastrarMembroMinisterio(
            url,
            ministerioId,
            membroId,
            funcao
          )
        );
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default new ministeriosController();
