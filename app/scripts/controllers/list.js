'use strict';

angular.module('blocitoffApp')
  .controller('ListCtrl', ['$scope', '$log', '$rootScope', 'Todo', function($scope, $log, $rootScope, Todo) {
    $scope.listId = $rootScope.listId;
    Todo.getList();

    $scope.$on('todo.listUpdated', function(e, data) {
        $scope.list = data;
    });
  }]);