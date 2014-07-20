var express = require('express');
var http = require('http');
var passport = require('passport');
var path = require('path');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var session = require('express-session');
var csrf = require('csurf');
var mongoose = require('mongoose');

var app = express();
var port = process.env.PORT || 8000;

mongoose.connect('mongodb://admin:admin@kahana.mongohq.com:10030/app27532717');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(express.static(__dirname + '/dist'));
app.use(cookieParser());
app.use(session({
	secret: 'somesupersecretphrase',
	resave: true,
	saveUninitialized: true
}));

app.use(csrf());
app.use(function(req, res, next) {
	res.cookie('XSRF-TOKEN', req.csrfToken());
	next();
});

// passport stuff
require('./server/passport.js')(passport);  // pass passport for configuration
app.use(passport.initialize());
app.use(passport.session());

// routes
require(__dirname + '/server/routes.js')(app, passport);

http.createServer(app).listen(port, function() {
	console.log('Express server listening on port ' + port);
});