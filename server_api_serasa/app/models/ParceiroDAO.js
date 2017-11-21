/* importação do crypto */
var crypto = require("crypto");

function ParceiroDAO(connection){
  this._connection = connection();
}

ParceiroDAO.prototype.inserirParceiro = function(parceiro, res){
  this._connection.open( function(err, mongoclient){
    mongoclient.collection("parceiros", function(err, collection){
      collection.find({cnpj: parceiro.cnpj}).toArray(function(err, result){
        if(result[0] != undefined){
          res.status(409).send({message: 'Parceiro já cadastrado'});
          mongoclient.close();
          return;
        }else{
          mongoclient.collection("parceiros", function(err, collection){

            /* criptografando a senha antes de inserir no BD */
            var senha_criptografada = crypto.createHash("md5").update(parceiro.senha).digest("hex");
            parceiro.senha = senha_criptografada;

            collection.insert({
              cnpj: parceiro.cnpj,
              nome_fantasia: parceiro.nome_fantasia,
              razao_social: parceiro.razao_social,
              email: parceiro.email,
              nome_usuario: parceiro.nome_usuario,
              senha: parceiro.senha,
              status: 1
            });
            mongoclient.close();
            res.status(200).send({mensagem:'Parceiro cadastrado com sucesso'});
          });
        }
      });
    });
  });
}

ParceiroDAO.prototype.logar = function(parceiro, res, token){
  this._connection.open( function(err, mongoclient){
    mongoclient.collection("parceiros", function(err, collection){

      var senha_criptografada = crypto.createHash("md5").update(parceiro.senha).digest("hex");
      parceiro.senha = senha_criptografada;
      collection.find(parceiro).toArray(function(err, result){

        if(result[0] != undefined){
          res.status(200).send({mensagem: 'Logado com sucesso.', token: token });
          return;
        }else{
          res.status(404).send({mensagem: 'usuário e ou senha inválida'});
          return;
        }

      });

      mongoclient.close();
    });
  });
}

ParceiroDAO.prototype.deslogar = function(token, res){
  this._connection.open( function(err, mongoclient){
    mongoclient.collection("invalid_tokens", function(err, collection){
      collection.find({ token: token }).toArray(function(err, result){

        if(result[0] != undefined){
          mongoclient.close();
          res.status(401).send({ mensagem: 'Usuário não está logado'});
        }else{
          mongoclient.collection("invalid_tokens", function(err, collection){
            collection.insert({
              token: token
            });
            mongoclient.close();

            res.status(200).send({mensagem:'Usuário deslogado com sucesso.'});
          });

        }
      });
    });
  });
}

ParceiroDAO.prototype.buscar_parceiro = function(parceiro, res, token){
  this._connection.open( function(err, mongoclient){
    mongoclient.collection("invalid_tokens", function(err, collection){
      collection.find({ token: token }).toArray(function(err, result){

        if(result[0] != undefined){
          mongoclient.close();
          res.status(401).send({ mensagem: 'Usuário não autorizado'});
        }else{
          mongoclient.collection("parceiros", function(err, collection){

            var senha_criptografada = crypto.createHash("md5").update(parceiro.senha).digest("hex");
            parceiro.senha = senha_criptografada;

            var busca_parceiro = { nome_usuario: parceiro.nome_usuario, senha: parceiro.senha };
            collection.find(busca_parceiro).toArray(function(err, result){

              if(result[0] != undefined){
                res.status(200).send({
                  cnpj: result[0].cnpj,
                  nome_fantasia: result[0].nome_fantasia,
                  razao_social: result[0].razao_social,
                  email: result[0].email,
                  nome_usuario: result[0].nome_usuario
                });
              }else{
                res.status(404).send({message: 'Usuário não encontrado.'});
                return;
              }

            });
            mongoclient.close();
          });
        }
      });
    });
  });
}

ParceiroDAO.prototype.atualizar_parceiro = function(dados, res, dados_parceiro, token){
  this._connection.open( function(err, mongoclient){
    mongoclient.collection("invalid_tokens", function(err, collection){
      collection.find({ token: token }).toArray(function(err, result){

        if(result[0] != undefined){
          mongoclient.close();
          res.status(401).send({ mensagem: 'Usuário não autorizado'});
        }else{
          mongoclient.collection("parceiros", function(err, collection){
            var senha_atual = crypto.createHash("md5").update(dados_parceiro.senha).digest("hex");
            var senha_nova = '';
            if(dados.senha === ""){
              senha_nova = crypto.createHash("md5").update(dados_parceiro.senha).digest("hex");
            }else{
              senha_nova = crypto.createHash("md5").update(dados.senha).digest("hex");
            }

            collection.update(
              { "nome_usuario": dados_parceiro.nome_usuario, "senha": senha_atual },
              { $set: {
                  "nome_fantasia": dados.nome_fantasia,
                  "razao_social": dados.razao_social,
                  "email": dados.email,
                  "senha": senha_nova
                }
              },
              { upsert: false },
              function(err, result){
                if(err){
                  console.log(err);
                }else{
                  res.status(200).send({mensagem: 'Parceiro atualizado com sucesso.'});
                }
              });
              mongoclient.close();
          });
        }
      });
    });
  });
}

ParceiroDAO.prototype.deletarParceiro = function(res, dados_parceiro, token){
  this._connection.open( function(err, mongoclient){
    mongoclient.collection("invalid_tokens", function(err, collection){
      collection.find({ token: token }).toArray(function(err, result){

        if(result[0] != undefined){
          mongoclient.close();
          res.status(401).send({ mensagem: 'Usuário não autorizado'});
        }else{
          mongoclient.collection("parceiros", function(err, collection){
            var senha_criptografada = crypto.createHash("md5").update(dados_parceiro.senha).digest("hex");
            collection.remove(
              { nome_usuario: dados_parceiro.nome_usuario, senha: senha_criptografada},
              function(err, result){
                if(err){
                  console.log(err);
                }else{
                  console.log(result.result.n);
                  if(result.result.n > 0){
                    res.status(200).send({mensagem: 'Parceiro desativado com sucesso.'});
                  }else{
                    res.status(404).send({mensagem: 'Parceiro não encontrado.'});
                  }
                }
                mongoclient.close();
              });

          });
        }
      });
    });
  });
}

module.exports = function(){
  return ParceiroDAO;
}
