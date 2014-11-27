var mysql = require('mysql');

var pool  = mysql.createPool({
    host     : '127.0.0.1',
    user     : 'root',
    password : 'root',
    port: '3306',
    database: 'taojibi'
});

pool.getConnection(function(err, connection) {

    connection.query( 'SELECT * FROM ftxia_setting;', function(err, result) {
        console.log(result);
        connection.release();
    });
});
