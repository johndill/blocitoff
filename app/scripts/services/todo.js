'use strict';

angular.module('blocitoffApp')
	.factory('Todo', ['$http', 'Auth', function($http, Auth) {

		function changeList(list) {
			
		}

		return {
			newList: function(listName, success, error) {
				var listToCreate = { username: Auth.user, listName: listName };
				$http.post('/newlist', listToCreate)
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