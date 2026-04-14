import IgrejaService from '../services/igreja.service.js';

class IgrejaController {
  async cadastro(req, res, next) {
    try {
      const novaIgreja = req.body;

      return res.status(201).json({
        message: 'Igreja cadastrada com sucesso',
        data: await IgrejaService.cadastrarIgreja(novaIgreja),
      });
    } catch (error) {
      return next(error);
    }
  }
}
export default new IgrejaController();
