var LocalStrategy = require('passport-local').Strategy;
var User = require(__dirname + '/models/user.js');
var userRoles = require('../dist/scripts/routingConfig.js').userRoles;

module.exports = function(passport) {
	passport.serializeUser(function(user, done) {
		done(null, user._id);
	});

	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err, user);
		});
	});

	passport.use('local', new LocalStrategy({
			passReqToCallback: true
		},
		function(req, username, password, done) {
			User.findOne({ 'local.username': req.body.username }, function(err, user) {
				if (err) {
					return done(err);
				}
				else if (!user) {
					return done(null, false, { message: 'Incorrect username.' });
				}
				else if (!user.validPassword(req.body.password)) {
					return done(null, false, { message: 'Incorrect password.' });
				}
				else {
					return done(null, user);
				}
			});
		})
	);
};