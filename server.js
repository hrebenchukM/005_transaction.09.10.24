var express  = require('express'); 
var bodyparser = require('body-parser');

var app = express(); 
var port = 8080; 
var mssql = require('mssql'); 


var path = require('path');
var catalog = 'data';



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




register.post('/',  par,function (req, res) {
	
	console.log(req.body);

	let Login = req.body.Login;
	let Password = req.body.Password;
	let Name = req.body.Name;


	connection.connect(function (err) {
		// транзакция - безопасная операция над бд с возможностью отката изменений в случае ошибки при выполнении запроса  
		var transaction = new mssql.Transaction(connection);



		transaction.begin(function (err) {
			var request = new mssql.Request(transaction);
			request.input('Login', mssql.NVarChar(50), Login);
		



			
			request.query("SELECT Login FROM Users WHERE Login = @Login", function (err, result) {
				if (err) {
					console.log(err);
					transaction.rollback(function (err) {
						console.log('rollback successful');
						res.send('transaction rollback successful');
					});
				} 

                if (result.recordset.length > 0) {
                    transaction.rollback(function () {
                        console.log('rollback successful');
						res.send('login exists,transaction rollback successful');
                    });
                }
				 else
			    {



			request.input('Password', mssql.NVarChar(50), Password);
			request.input('Name', mssql.NVarChar(50), Name);
			request.query("INSERT INTO Users (Name, Login, Password) VALUES (@Name, @Login, @Password)", function (err, data) {

				if (err) {
					console.log(err);
					transaction.rollback(function (err) {
						console.log('rollback successful');
						res.send('transaction rollback successful');
					});
				} 
				else {
					transaction.commit(function (err, data) {
							console.log('data commit success');
							res.send('transaction successful');
						});
					}
				});
			}
		});
	});
});
});




login.post('/', par,function (req, res) {
	
	
	console.log(req.body);

    let Login = req.body.Login;
    let Password = req.body.Password;




	connection.connect(function (err) {
		// транзакция - безопасная операция над бд с возможностью отката изменений в случае ошибки при выполнении запроса  
		var transaction = new mssql.Transaction(connection);



		transaction.begin(function (err) {
			var request = new mssql.Request(transaction);
			request.input('Login', mssql.NVarChar(50), Login);
			request.input('Password', mssql.NVarChar(50), Password);


			request.query(`
                SELECT * 
                FROM Admins 
                WHERE Login = @Login AND Password = @Password
            `, function (err, data) {

				if (err) {
					console.log(err);
					transaction.rollback(function (err) {
						console.log('rollback successful');
						res.send('transaction rollback successful');
					});
				} 
				else {
					transaction.commit(function (err) {
							console.log('data commit success');


							var allItems = data.recordset;
							console.log(' result:', allItems);
			
			
			
							if (allItems.length > 0) {
						  var html = `
                                <table border="1">
                                    <tr>
                                        <th>Id</th>
                                        <th>Login</th>
                                        <th>Password</th>
                                    </tr>
                            `;
						
							for (let i = 0; i < allItems.length; i++) {
								html += `
								<tr>
									<td>${allItems[i].Id}</td>
									<td>${allItems[i].Login}</td>
									<td>${allItems[i].Password}</td>
								</tr>
							`;
							} 
							 html += '</table>';
							res.send(html);
						}else {
							res.sendFile(path.join(__dirname, catalog, 'index.html'));
						}
                    });
                }
            });
        });
    });
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
