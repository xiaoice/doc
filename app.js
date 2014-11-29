var express=require('express');
var app = express();
var server = require('http').Server(app);
var path = require('path');
var ejs = require('ejs');
var router = require('./routers/router');
var favicon = require('static-favicon');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var cache = require('./dao/cache');

cache.init(function (err,data) {
    console.log("cache was init!");
});
app.set('port', process.env.PORT || 80);
app.set('views', path.join(__dirname, 'static/dist'));
app.engine('.ejs', ejs.__express);
app.set('view engine', 'ejs');// app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(favicon());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(express.static(path.join(__dirname, 'static/dist')));
router(app);

// development only
if (process.env.NODE_ENV === 'development') {
    console.log("development");
}

server.listen(app.get('port'),function(){
	console.log("server was started!");
});

process.on('uncaughtException', function (err) {
    console.dir(err.stack);
});