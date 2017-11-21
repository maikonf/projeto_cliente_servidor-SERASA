/* importar as configurações do servidor */
var app = require('./config/server');

/* parametrizar a porta de escuta */
app.listen(5000, function(){
	var ip_server_api = 'http://localhost:3000/';
	console.log('Cliente Serasa online');
})
