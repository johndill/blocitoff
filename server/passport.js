var LocalStrategy = require('passport-local').Strategy;
var User = require('./server/models/user.js');

module.exports = function(passport) {
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err, user);
		});
	});

	passport.use('localLogin', new LocalStrategy({
			usernameField: 'username',
			passwordField: 'password'
		},
		function(username, password, done) {
			User.findOne({ 'local.username': username }, function(err, user) {
				if (err) {
					return done(err);
				}
				else if (!user) {
					return done(null, false, { message: 'Incorrect username.' });
				}
				else if (!user.validPassword(password)) {
					return done(null, false, { message: 'Incorrect password.' });
				}
				else {
					return done(null, user);
				}
			});
		})
	);

	passport.use('localSignup', new LocalStrategy({
			usernameField: 'username',
			passwordField: 'password'
		},
		function(username, password, done) {
			process.nextTick(function() {
				User.findOne({ 'local.username': username }, function(err, user) {
					if (err) {
						return done(err);
					}
					else if (user) {
						// user already exists
						return done(null, false, { message: 'User already exists.' });
					}
					else {
						// create user
						var newUser = new User();

						newUser.local.username = username;
						newUser.local.password = newUser.generateHash(password);

						newUser.save(function(err) {
							if (err) {
								throw err;
							}
							else {
								return done(null, newUser);
							}
						});
					}
				});
			});
		}
	));
};