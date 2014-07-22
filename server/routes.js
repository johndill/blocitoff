var _ = require('underscore');
var path = require('path');
var AuthCtrl = require('./controllers/auth.js');
var TodoCtrl = require('./controllers/todo.js');
var userRoles = require('../dist/scripts/routingConfig.js').userRoles;

module.exports = function(app, passport) {
	// views
	app.get('/views/*', function(req, res) {
		var requestedView = path.join('./', req.url);
		var role = userRoles.public;
		var username = '';

		if (req.user) {
			role = req.user.role;
			username = req.user.local.username;
		}

		res.cookie('user', JSON.stringify({
			'username': username,
			'role': role
		}));

		res.sendfile(requestedView);
	});

	// local auth
	app.post('/signup', AuthCtrl.signup);
	app.post('/login', AuthCtrl.login);
	app.post('/logout', AuthCtrl.logout);

	// todo list
	app.post('/newlist', TodoCtrl.newlist);

	//  google auth
	app.get('/auth/google', passport.authenticate('google', {
		scope: ['profile', 'email']
	}));
	app.get('/auth/google/callback', passport.authenticate('google', {
		successRedirect: '/_',
    failureRedirect: '/login'
	}));

	// all other requests
	app.get('/*', function(req, res) {
		var role = userRoles.public;
		var username = '';

		if (req.user) {
			role = req.user.role;
			username = req.user.local.username;
		}

		res.cookie('user', JSON.stringify({
			'username': username,
			'role': role
		}));

		res.sendfile(path.resolve('./dist/index.html'));
	});
}