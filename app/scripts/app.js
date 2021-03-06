'use strict';

/**
 * @ngdoc overview
 * @name blocitoffApp
 * @description
 * # blocitoffApp
 *
 * Main module of the application.
 */
angular
  .module('blocitoffApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])

  // define client routes
  .config(function ($routeProvider, $locationProvider) {
    var access = routingConfig.accessLevels;

    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        access: access.user
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        access: access.public
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
        access: access.anon
      })
      .when('/list', {
        templateUrl: 'views/list.html',
        controller: 'ListCtrl',
        access: access.user
      })
      .otherwise({
        redirectTo: '/'
      });

      $locationProvider.html5Mode(true);
  })

  // verifiy user is logged at each route change
  .run(['$rootScope', '$location', 'Auth', function($rootScope, $location, Auth) {
    $rootScope.$on('$routeChangeStart', function(event, next, current) {
      $rootScope.error = null;
      if (!Auth.authorize(next.access)) {
        if (Auth.isLoggedIn()) {
          $location.path('/');
        }
        else {
          $location.path('/login');
        }
      }
    });
  }]);