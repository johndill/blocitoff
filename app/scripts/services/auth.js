'use strict';

angular.module('blocitoffApp')
	.factory('Auth', ['$http', '$cookieStore', function($http, $cookieStore) {
		var accessLevels = routingConfig.accessLevels;
		var userRoles = routingConfig.userRoles;
		var currentUser = $cookieStore.get('user') || { username: '', role: userRoles.public };

		// immediately remove cookie after it is read
		$cookieStore.remove('blocitoffUser');

		function changeUser(user) {
			angular.extend(currentUser, user);
		}

		return {
			authorize: function(accessLevel, role) {
				if (role === undefined) {
					role = currentUser.role;
				}

				if (accessLevel === undefined) {
					accessLevel = accessLevels.public;
				}

				// use bitwise and operator to verify user has access
				return accessLevel.bitMask & role.bitMask;
			},

			isLoggedIn: function(user) {
				if (user ===  undefined) {
					user = currentUser;
				}

				// user is logged in if they have 'user' or 'admin' role
				return user.role.title === userRoles.user.title || user.role.title === userRoles.admin.title;
			},

			signup: function(user, success, error) {
				$http.post('/signup', user)
					.success(function(res) {
						changeUser(res);
						success();
					})
					.error(error);
			},

			login: function(user, success, error) {
				$http.post('/login', user)
					.success(function(res) {
						changeUser(res);
						success();
					})
					.error(error);
			},

			logout: function(success, error) {
				$http.post('/logout')
					.success(function() {
						changeUser({
							username: '',
							role: userRoles.public
						});
						success();
					})
					.error(error);
			},

			accessLevels: accessLevels,
			userRoles: userRoles,
			user: currentUser
		};
	}]);