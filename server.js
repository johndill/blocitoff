var express = require('express');
var morgan = require('morgan');
var http = require('http');
var csrf = require('csurf');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
var mongoose = require('mongoose');

var app = express();
var port = process.env.PORT || 8000;

mongoose.connect('');

app.use(morgan('dev'));
app.use(express.static(__dirname + '/dist'));
app.use(cookieParser());
app.use(session({
	secret: 'somesupersecretphrase',
	resave: true,
	saveUninitialized: true
}))

app.use(csrf());
app.use(function(req, res, next) {
	res.cookie('XSRF-TOKEN', req.csrfToken());
	next();
});

app.get('/hello', function(req, res) {
	res.send('hello world');
});

app.get('/views/*', function(req, res) {
	var requestedView = path.join('./', req.url);
	res.sendfile(requestedView);
});

http.createServer(app).listen(port, function() {
	console.log('Express server listening on port ' + port);
});