var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var User = require(__dirname + '/models/user.js');
var userRoles = require('../dist/scripts/routingConfig.js').userRoles;

var authConfig

if (process.env.NODE_ENV === 'production') {
	authConfig = {
		'googleAuth': {
			'clientID': '842916121088-75kdjh9366gshg7pc7qta65o5261vhh9.apps.googleusercontent.com',
			'clientSecret': 'nD4Cx8XptYGOfG9fxAVV8OTn',
			'callbackURL': 'http://blocitoff-dill.herokuapp.com/auth/google/callback'
		}
	};
}
else {
	authConfig = {
		'googleAuth': {
			'clientID': '842916121088-8ne18t9th9bis3f94e7umq9d75q61mfs.apps.googleusercontent.com',
			'clientSecret': 'WBreTm14e4VJ3sZsxGm8CIu7',
			'callbackURL': 'http://localhost:8000/auth/google/callback'
		}
	};
}



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

	passport.use(new GoogleStrategy({
			clientID: authConfig.googleAuth.clientID,
			clientSecret: authConfig.googleAuth.clientSecret,
			callbackURL: authConfig.googleAuth.callbackURL
		},

		function(token, refreshToken, profile, done) {
			// make code async (wait for response from google)
			process.nextTick(function() {
				User.findOne({ 'google.id': profile.id }, function(err, user) {
					if (err) {
						return done(err);
					}
					else if (user) {
						// user found, log them in
						return done(null, user);
					}
					else {
						// create new user
						var newUser = new User();

						newUser.google.id = profile.id;
						newUser.google.token = token;
						newUser.google.name = profile.displayName;
						newUser.google.email = profile.emails[0].value;
						newUser.role = userRoles.user;
						newUser.local.username = newUser.google.email;

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
		})
	);
};