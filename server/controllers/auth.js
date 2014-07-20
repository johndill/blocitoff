var passport = require('passport');
var User = require('../models/user.js');
var userRoles = require('../../dist/scripts/routingConfig.js').userRoles;

module.exports = {
	signup: function(req, res, next) {
		User.findOne({ 'local.username': req.body.username }, function(err, user) {
			if (err) {
				res.send(500, err);
			}
			else if (validateSignup(req.body.username, req.body.password)) {
				res.send(400, validateSignup(req.body.username, req.body.password));
			}
			else if (user) {
				res.send(403, 'That username is taken. Try again.');
			}
			else {
				var newUser = new User();

				newUser.local.username = req.body.username;
				newUser.local.password = newUser.generateHash(req.body.password);
				newUser.role = userRoles.user;

				newUser.save(function(err) {
					if (err) {
						next(err);
					}
					else {
						req.logIn(newUser, function(err) {
							if (err) {
								next(err);
							}
							else {
								res.json(200, { "role": newUser.role, "username": newUser.local.username });
							}
						});
					}
				});
			}
		});
	},

	login: function(req, res, next) {
		passport.authenticate('local', function(err, user) {
			if (err) {
				return next(err);
			}
			else if (!user) {
				res.send(400, 'Invalid username or password. Try again.');
			}
			else {
				req.logIn(user, function(err) {
					if (err) {
						return next(err);
					}
					if (req.body.rememberme) req.session.cookie.maxAge = 1000 *60 * 24 * 7;
					res.json(200, { "role": user.role, "username": user.local.username });
				});
			}
		})(req, res, next);
	},

	logout: function(req, res) {
		req.logout();
		res.send(200);
	}
};

function validateSignup (username, password) {
	var ret;
	
	if (username === '') {
		ret = 'You must specify a username.';
	} 
	else if (password === '') {
		ret = 'Password is too short.';
	}
	else {
		ret = null;
	}

	return ret;
}