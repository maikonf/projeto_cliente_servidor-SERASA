module.exports.verificar_token = function(application,token, res){
  console.log('token verificado: ' + token );
  var connection = application.config.dbConnection;
  var ParceiroDAO = new application.app.models.ParceiroDAO(connection);

  var token_invalid = ParceiroDAO.verificar_token(token, res);
}
