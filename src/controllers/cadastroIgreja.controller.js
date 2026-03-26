import cadastroIgrejaService from '../services/cadastroIgrejaService.js';

class CadastroIgrejaController {
  async cadastro(req, res, next) {
    try {
      const novaIgreja = req.body;

      return res.status(201).json({
        message: 'Igreja cadastrada com sucesso',
        data: await cadastroIgrejaService.cadastrarIgreja(novaIgreja),
      });
    } catch (error) {
      return next(error);
    }
  }
}
export default new CadastroIgrejaController();
