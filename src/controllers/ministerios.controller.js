import MinisteriosService from '../services/ministerios.service.js';

class MinisteriosController {
  async cadastrarMinisterio(req, res, next) {
    try {
      const { url } = req.params;
      const { nomeMinisterio } = req.body;

      return res.status(201).json({
        message: 'Ministério cadastrado com sucesso',
        data: await MinisteriosService.cadastrarMinisterio(url, nomeMinisterio),
      });
    } catch (error) {
      return next(error);
    }
  }

  async buscarMinisterios(req, res, next) {
    try {
      const { url } = req.params;

      return res.status(200).json({
        message: 'Ministérios encontrados com sucesso',
        data: await MinisteriosService.buscarMinisterios(url),
      });
    } catch (error) {
      return next(error);
    }
  }

  async cadastrarMembroMinisterio(req, res, next) {
    try {
      const { url, ministerioId } = req.params;
      const { membroId, funcao } = req.body;

      return res.status(201).json({
        message: 'Membro cadastrado no ministério com sucesso',
        data: await MinisteriosService.cadastrarMembroMinisterio(
          url,
          ministerioId,
          membroId,
          funcao
        ),
      });
    } catch (error) {
      return next(error);
    }
  }

  async buscarMembrosMinisterio(req, res, next) {
    try {
      const { url, ministerioId } = req.params;
      return res
        .status(200)
        .json({
          message: 'Membros do ministério encontrados com sucesso',
          data: await MinisteriosService.buscarMembrosMinisterio(ministerioId, url),
        });
    } catch (error) {
      return next(error);
    }
  }
}

export default new MinisteriosController();
