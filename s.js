// module.exports = {

//     tableRows: ``,
//     // выбор всех элементов и отображение в виде таблицы 
//     getAllItems: function (req, res) {
		
//         var self = this; 		
// 		self.tableRows = ``; 

// 			var request = new mssql.Request(connection);  
// 			request.stream = true; 
// 			request.query("SELECT * FROM items"); 
			
// 			request.on('row', function(row){ 
	
// 				self.tableRows += ` <tr>
// 							<td>${row.name} </td>
// 							<td>${row.description}</td>
// 							<td>${row.completed ? 'yes' : 'no'}</td>
// 						</tr>` 
// 			}); 
			
// 			request.on('done', function(affected) { 
// 				console.log('show_items'); 
// 				res.render('index', { data:  self.tableRows }); 
// 			})		

//     }




// app.get('/', function (req, res) {
// 	connection.connect(function (err) {
// 		// транзакция - безопасная операция над бд с возможностью отката изменений в случае ошибки при выполнении запроса  
// 		var transaction = new mssql.Transaction(connection);

// 		transaction.begin(function (err) {
// 			var request = new mssql.Request(transaction);
// 			request.query("INSERT INTO items (name, description) VALUES ('test item', 'some text')", function (err, data) {

// 				if (err) {
// 					console.log(err);
// 					transaction.rollback(function (err) {
// 						console.log('rollback successful');
// 						res.send('transaction rollback successful');
// 					});
// 				} 
// 				else {
// 					transaction.commit(function (err, data) {
// 							console.log('data commit success');
// 							res.send('transaction successful');
// 					});
// 				};
// 			});
// 		});
// 	});
// });

// демонстрация отката изменений в случае ошибки при выполнении запроса к бд 

// app.get('/error', function (req, res) {
// 	var transaction = new mssql.Transaction(connection);

// 	transaction.begin(function (err) {
// 		var request = new mssql.Request(transaction);
// 		request.query("bad sql", function (err, data) {
// 			if (err) {
// 				console.log(err);
// 				transaction.rollback(function (err) {

// 					if (err) {
// 						console.log('rollback error');
// 					}
// 					else {
// 						console.log('rollback successful');
// 						res.send('transaction rollback successful');
// 					}
// 				});
// 			} else {
// 				transaction.commit(function (err, data) {
// 					if (err) {
// 						console.log('could not commit data');
// 					}
// 					else {
// 						console.log('data commit success');
// 						res.send('transaction successful');
// 					};
// 				});
// 			};
// 		});
// 	});
// });




