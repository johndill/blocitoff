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
	  				rememberme: true
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
	  				password: $scope.password
	  			},
	  			function() {
	  				$location.path('/');
	  			},
	  			function(err) {
	  				$rootScope.error = err;
	  			}
  			);
  		};

      $scope.loginOauth = function(provider) {
        $window.location.href = '/auth/' + provider;
      };
  	}
  ]);