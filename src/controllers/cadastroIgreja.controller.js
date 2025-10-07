import cadastroIgrejaService from '../services/cadastroIgrejaService.js';

class cadastroIgrejaController {
  async cadastro(req, res) {
    try {
      const novoCadastro = req.body;
      res.json(await cadastroIgrejaService.cadastrarIgreja(novoCadastro));
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default new cadastroIgrejaController();
