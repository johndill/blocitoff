var _ = require('underscore');
var path = require('path');
var AuthCtrl = require('./controllers/auth.js');
var userRoles = require('../dist/scripts/routingConfig.js').userRoles;
var accessLevels = require('../dist/scripts/routingConfig.js').accessLevels;

module.exports = function(app, passport) {
	// views
	app.get('/views/*', function(req, res) {
		var requestedView = path.join('./', req.url);
		res.sendfile(requestedView);
	});

	// auth
	app.post('/signup', AuthCtrl.signup);
	app.post('/login', AuthCtrl.login);
	app.post('/logout', AuthCtrl.logout);

	// all other requests
	app.get('/*', function(req, res) {
		var role = userRoles.public;
		var username = '';

		if (req.user) {
			role = req.user.role;
			username = req.user.username;
		}

		res.cookie('user', JSON.stringify({
			'username': username,
			'role': role
		}));

		res.sendfile(path.resolve('./dist/index.html'));
	});
}