var express=require('express');
var app = express();
var server = require('http').Server(app);
var path = require('path');
var ejs = require('ejs');
var router = require('./routers/pageRouter');
var favicon = require('static-favicon');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

app.set('port', process.env.PORT || 80);
app.set('views', path.join(__dirname, 'static/dist'));
app.engine('.ejs', ejs.__express);
app.set('view engine', 'ejs');// app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(favicon());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(express.static(path.join(__dirname, 'static/dist')));
app.use('/', router);


// development only
if (process.env.NODE_ENV === 'development') {
    console.log("development");
}

server.listen(app.get('port'),function(){
	console.log("server was started!");
});