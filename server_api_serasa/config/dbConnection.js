/* importação do mongodb */
var mongo = require('mongodb');

var conMongoDB = function(){
  console.log('Iniciando conexão com o BD');
  var db = new mongo.Db(
    'serasaBD',
    new mongo.Server(
      'localhost',
      27017,
      {}
    ),
    {}
  );

  return db;
}

module.exports = function(){
  return conMongoDB;
}
