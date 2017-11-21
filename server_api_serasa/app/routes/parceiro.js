/* importar o módulo do jwt */
var jwt = require('jsonwebtoken');

module.exports = function(application){
	application.get('/parceiro', function(req, res){
		var token = req.body.token || req.headers.authorization;
		if(token){
			jwt.verify(token, process.env.SECRET_KEY, function(err, decode){
				if(err){
					res.status(500).send({mensagem: 'Token inválido'});
				}else {
					application.app.controllers.cadastro.buscar_parceiro(application, req, res);
				}
			});
		}else {
			res.status(500).send({mensagem: 'Token não encontrado'});
		}
	});

  application.post('/parceiro', function(req, res){
		application.app.controllers.cadastro.cadastrar(application, req, res);
	});

  application.put('/parceiro', function(req, res){
		var token = req.body.token || req.headers.authorization;

		if(token){
			jwt.verify(token, process.env.SECRET_KEY, function(err, decode){
				if(err){
					res.status(500).send({mensagem: 'Token inválido'});
				}else {
					application.app.controllers.cadastro.atualizar_parceiro(application, req, res);
				}
			});

		}else {
			res.status(500).send({mensagem: 'Token não encontrado'});
		}
	});

  application.delete('/parceiro', function(req, res){
		var token = req.body.token || req.headers.authorization;

		if(token){
			jwt.verify(token, process.env.SECRET_KEY, function(err, decode){
				if(err){
					res.status(500).send({mensagem: 'Token inválido'});
				}else {
					application.app.controllers.cadastro.deletarParceiro(application, req, res);
				}
			});

		}else {
			res.status(500).send({mensagem: 'Token não encontrado'});
		}
	});
}
