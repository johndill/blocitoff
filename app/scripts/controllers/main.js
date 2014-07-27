'use strict';

/**
 * @ngdoc function
 * @name blocitoffApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the blocitoffApp
 */
angular.module('blocitoffApp')
  .controller('MainCtrl', ['$scope', '$log', '$location', '$rootScope', 'Todo', 
    function($scope, $log, $location, $rootScope, Todo) {
        Todo.getListNames();

        $scope.$on('todo.listNamesUpdated', function(e, data) {
        	$scope.lists = data;
        });

        $scope.createList = function(listName) {
        	Todo.createList(listName, Todo.getListNames);
        };

        $scope.removeList = function(listId) {
        	Todo.removeList(listId, Todo.getListNames);
        };

        $scope.openList = function(listId) {
            $rootScope.listId = listId;
            $location.path('/list');
        };

    $scope.$log = $log;
  }]);