/* importar o módulo do jwt */
var jwt = require('jsonwebtoken');

module.exports = function(application){

	application.put('/login', function(req, res){
		application.app.controllers.index.logar(application, req, res);
	});

	application.put('/logout', function(req, res){
		var token = req.body.token || req.headers.authorization;
		if(token){
			jwt.verify(token, process.env.SECRET_KEY, function(err, decode){
				if(err){
					res.status(500).send({mensagem: 'Token inválido'});
				}else {
					application.app.controllers.index.deslogar(application, req, res);
				}
			});

		}else {
			res.status(401).send({mensagem: 'Token não encontrado'});
		}
	});

}
