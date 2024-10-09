var express  = require('express'); 
var app = express(); 
var port = 8080; 
var mssql = require('mssql'); 


var path = require('path');
var catalog = 'data';
var bodyparser = require('body-parser');



// параметры соединения с бд
var config = {
	user: 'admin',           // пользователь базы данных
	password: '12345',          // пароль пользователя 
	server: 'LENOVO\\SQLEXPRESS',       // хост
	database: 'ATB',          // имя бд
	port: 1433,             // порт, на котором запущен sql server
	  options: {
		  encrypt: true,  // Использование SSL/TLS
		  trustServerCertificate: true // Отключение проверки самоподписанного сертификата
	  },
 }
// вложенные приложения используются для маршрутизации 
var app = express(); // главное приложение
var login = express(); // вложенное приложение 
var register = express(); 

const par=bodyparser.urlencoded({extended:false,});//не наследуется

// компонент  express.static() указывает на каталог с файлами
app.use('/', express.static(path.join(__dirname ,catalog)));

var connection = new mssql.ConnectionPool(config);



app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname, catalog, 'index.html'));
}); 

register.get('/', function (req, res) {
	console.log(register.mountpath); // /user 
	res.sendFile(path.join(__dirname, catalog, 'register.html'));
}); 


login.get('/', function (req, res) { 
  // свойство mountpath содержить текущий путь маршрутизации(route) 
  console.log(login.mountpath); // /admin
  res.sendFile(path.join(__dirname, catalog, 'login.html'));
}); 





register.post('/', par, function (req, res) {
   
});





login.post('/',par, function(req, res){
	
	});



// событие mount генерируется, когда происходит привязка дочернего(вложенного) 
// приложения к родительскому 
register.on('mount', function() {
	console.log('user mounted'); 
}); 
login.on('mount', function() {
	console.log('admin mounted'); 
});

// связывание главного приложения со вложенным 
app.use('/login', login); 
app.use('/register', register); 

app.get('*', function(req, res){
	res.send('<h1>404</h1>');
});


app.listen(port, function() {
	console.log('app running on port ' + port); 
}); 
