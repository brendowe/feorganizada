class authController {
  function(req, res) {
    try {
        const {login, senha} = req.body;
        const {url} = req.params;

    } catch (error) {
        console.error(error)
    }

  }
}
