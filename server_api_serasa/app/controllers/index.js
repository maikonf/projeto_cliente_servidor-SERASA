var jwt = require('jsonwebtoken');
var jws = require('jws');
var token = '';

module.exports.logar = function(application, req, res){

  var dadosForm = req.body;

  console.log('DADOS ENVIADOS PELO CLIENTE PARA AUTENTICAÇÃO');
  console.log(dadosForm);

  token = jwt.sign(dadosForm, process.env.SECRET_KEY, {
    expiresIn: 4000
  });

  req.checkBody({
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

  ParceiroDAO.logar(dadosForm, res, token);

}

module.exports.deslogar = function(application, req, res){
  var token_deslogar = req.body.token || req.headers.authorization;

  console.log('TOKEN ENVIADO PELO CLIENTE PARA LOGOUT');
  console.log(token_deslogar);

  var connection = application.config.dbConnection;
  var ParceiroDAO = new application.app.models.ParceiroDAO(connection);

  ParceiroDAO.deslogar(token_deslogar, res);
}
