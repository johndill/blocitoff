'use strict';

angular.module('blocitoffApp')
	.factory('Todo', ['$http', '$rootScope', 'Auth', function($http, $rootScope, Auth) {

		return {
			createList: function(listName, success, error) {
				var listToCreate = { username: Auth.user.username, listName: listName };
				$http.post('/newlist', listToCreate)
					.success(function(res) {
						success();
					})
					.error(error);
			},

			removeList: function(listId, success, error) {
				var listToRemove = { username: Auth.user.username, listId: listId };
				$http.post('/removeList', listToRemove)
					.success(function(res) {
						success();
					})
					.error(error);
			},

			getListNames: function(success, error) {
				var listNames;
				$http.post('/getlistnames', { username: Auth.user.username })
					.success(function(res) {
						$rootScope.$broadcast('todo.listNamesUpdated', res);
					})
					.error(error);
			},

			getList: function(success, error) {
				var listToGet = { username: Auth.user.username, listId: $rootScope.listId };
				$http.post('/getlist', listToGet)
					.success(function(res) {
						$rootScope.$broadcast('todo.listUpdated', res);
					})
					.error(error);
			},

			addListItem: function(listId, text, success, error) {
				var itemToAdd = { username: Auth.user.username, listId: listId, text: text };
				$http.post('/additem', itemToAdd)
					.success(function(res) {
						success();
					})
					.error(error);
			},

			removeListItem: function(listId, itemId, success, error) {
				var itemToRemove = { username: Auth.user.username, listId: listId, itemId: itemId };
				$http.post('/removeitem', itemToRemove)
					.success(function(res) {
						success();
					})
					.error(error);
			}
		};
	}]);