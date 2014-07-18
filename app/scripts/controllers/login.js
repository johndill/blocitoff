'use strict';

angular.module('blocitoffApp')
  .controller('LoginCtrl', [
  	'$rootScope',
  	'$scope',
  	'$location',
  	'$window',
  	'Auth',

  	function($rootScope, $scope, $location, $window, Auth) {
  		$scope.rememberme = true;
  		$scope.login = function() {
  			Auth.login({
	  				username: $scope.username,
	  				password: $scope.password,
	  				rememberme: $scope.rememberme
  				},
  				function() {
  					$location.path('/');
  				},
  				function(err) {
  					$rootScope.error = err;
  				}
  			);
  		};

  		$scope.signup = function() {
  			Auth.signup({
	  				username: $scope.username,
	  				password: $scope.password,
	  				role: $scope.role
	  			},
	  			function() {
	  				$location.path('/');
	  			},
	  			function(err) {
	  				$rootScope.error = err;
	  			}
  			);
  		};
  	}
  ]);