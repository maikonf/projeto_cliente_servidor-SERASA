var jwtDecode = require('jwt-decode');

module.exports.cadastrar = function(application, req, res){

  var dadosForm = req.body;
  console.log('DADOS ENVIADOS PELO CLIENTE PARA CADASTRO');
  console.log(dadosForm);

  req.checkBody({
    cnpj: {
      notEmpty: true,
      errorMessage: 'CNPJ obrigatório'
    },
    nome_fantasia: {
      notEmpty: true,
      errorMessage: 'Nome Fantasia é obrigatório.'
    },
    razao_social: {
      notEmpty: true,
      errorMessage: 'Razão Social é obrigatório.'
    },
    email: {
      notEmpty: true,
      errorMessage: 'Email é obrigatório'
    },
    nome_usuario: {
      notEmpty: true,
      errorMessage: 'Usuário é obrigatório.'
    },
    senha: {
      notEmpty: true,
      errorMessage: 'Senha é obrigatório.'
    }
  });

  /* Captura de erros na montagem do Json (400)*/
  var erros400 = req.validationErrors();

  if(erros400){
    res.status(400).send({mensagem: erros400[0].msg});
    return;
  }

  req.assert('cnpj', 'O CNPJ informado possui uma quantidade de caracteres inválida.').isLength({ min: 5, max: 18 });
  req.assert('nome_fantasia', 'O Nome Fantasia informado possui uma quantidade de caracteres inválida.').isLength({ min: 5, max: 255 });
  req.assert('razao_social', 'A Razão Social informada possui uma quantidade de caracteres inválida.').isLength({ min: 5, max: 255 });
  req.assert('email', 'O Email informado possui uma quantidade de caracteres inválida.').isLength({ min: 5, max: 255 });
  req.assert('email', 'Email inválido.').isEmail();
  req.assert('nome_usuario', 'O Usuário informado possui uma quantidade de caracteres inválida.').isLength({ min: 5, max: 255});
  req.assert('senha', 'A senha informada possui uma quantidade de caracteres inválida.').isLength({ min: 5, max: 255});

  /* Captura de erros na validação dos dados */
  var erros422 = req.validationErrors();
  if(erros422){
    res.status(422).send({mensagem: erros422[0].msg});
    return;
  }

  var connection = application.config.dbConnection;
  var ParceiroDAO = new application.app.models.ParceiroDAO(connection);

  ParceiroDAO.inserirParceiro(dadosForm, res);
}

module.exports.buscar_parceiro = function(application, req, res){

  var token = req.body.token || req.headers.authorization;
  var dados_parceiro = jwtDecode(token);

  console.log('TOKEN ENVIADO PELO CLIENTE PARA BUSCAR PARCEIRO AUTENTICADO.');
  console.log(token);

  var connection = application.config.dbConnection;
  var ParceiroDAO = new application.app.models.ParceiroDAO(connection);

  ParceiroDAO.buscar_parceiro(dados_parceiro, res, token);

}

module.exports.atualizar_parceiro = function(application, req, res){

  var dados = req.body;

  console.log('DADOS ENVIADOS PARA ATUALIZAÇÃO DO PARCEIRO AUTENTICADO');
  console.log(dados);

  var token = req.body.token || req.headers.authorization;
  var dados_parceiro = jwtDecode(token);

  req.checkBody({
    nome_fantasia: {
      notEmpty: true,
      errorMessage: 'Nome Fantasia é obrigatório.'
    },
    razao_social: {
      notEmpty: true,
      errorMessage: 'Razão Social é obrigatório.'
    },
    email: {
      notEmpty: true,
      errorMessage: 'Email é obrigatório'
    }
  });

  /* Captura de erros na montagem do Json (400)*/
  var erros400 = req.validationErrors();

  if(erros400){
    res.status(400).send({message: erros400[0].msg});
    return;
  }

  req.assert('nome_fantasia', 'O Nome Fantasia informado possui uma quantidade de caracteres inválida.').isLength({ min: 5, max: 255 });
  req.assert('razao_social', 'A Razão Social informada possui uma quantidade de caracteres inválida.').isLength({ min: 5, max: 255 });
  req.assert('email', 'O Email informado possui uma quantidade de caracteres inválida.').isLength({ min: 5, max: 255 });
  req.assert('email', 'Email inválido.').isEmail();

  /* Captura de erros na validação dos dados */
  var erros422 = req.validationErrors();
  if(erros422){
    res.status(422).send({message: erros422[0].msg});
    return;
  }

  var connection = application.config.dbConnection;
  var ParceiroDAO = new application.app.models.ParceiroDAO(connection);

  ParceiroDAO.atualizar_parceiro(dados, res, dados_parceiro, token);

}

module.exports.deletarParceiro = function(application, req, res){

  var token = req.body.token || req.headers.authorization;

  console.log('TOKEN ENVIADO PELO PARCEIRO PARA DESATIVAÇÃO');
  console.log(token);

  var dados_parceiro = jwtDecode(token);
  var connection = application.config.dbConnection;
  var ParceiroDAO = new application.app.models.ParceiroDAO(connection);

  ParceiroDAO.deletarParceiro(res, dados_parceiro, token);

}
