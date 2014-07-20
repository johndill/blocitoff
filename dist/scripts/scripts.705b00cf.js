"use strict";angular.module("blocitoffApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch"]).config(["$routeProvider","$locationProvider",function(a,b){var c=routingConfig.accessLevels;a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl",access:c.user}).when("/about",{templateUrl:"views/about.html",controller:"AboutCtrl",access:c.public}).when("/login",{templateUrl:"views/login.html",controller:"LoginCtrl",access:c.anon}).otherwise({redirectTo:"/"}),b.html5Mode(!0)}]).run(["$rootScope","$location","Auth",function(a,b,c){a.$on("$routeChangeStart",function(d,e){a.error=null,c.authorize(e.access)||b.path(c.isLoggedIn()?"/":"/login")})}]),angular.module("blocitoffApp").controller("MainCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("blocitoffApp").controller("AboutCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("blocitoffApp").controller("LoginCtrl",["$rootScope","$scope","$location","$window","Auth",function(a,b,c,d,e){b.rememberme=!0,b.login=function(){e.login({username:b.username,password:b.password,rememberme:!0},function(){c.path("/")},function(b){a.error=b})},b.signup=function(){e.signup({username:b.username,password:b.password},function(){c.path("/")},function(b){a.error=b})},b.loginOauth=function(a){d.location.href="/auth/"+a}}]),angular.module("blocitoffApp").controller("NavCtrl",["$rootScope","$scope","$location","Auth",function(a,b,c,d){b.user=d.user,b.userRoles=d.userRoles,b.accessLevels=d.accessLevels,b.logout=function(){d.logout(function(){c.path("/login")},function(){a.error="Failed to logout"})}}]),angular.module("blocitoffApp").factory("Auth",["$http","$cookieStore",function(a,b){function c(a){angular.extend(f,a)}var d=routingConfig.accessLevels,e=routingConfig.userRoles,f=b.get("user")||{username:"",role:e.public};return b.remove("blocitoffUser"),{authorize:function(a,b){return void 0===b&&(b=f.role),void 0===a&&(a=d.public),a.bitMask&b.bitMask},isLoggedIn:function(a){return void 0===a&&(a=f),a.role.title===e.user.title||a.role.title===e.admin.title},signup:function(b,d,e){a.post("/signup",b).success(function(a){c(a),d()}).error(e)},login:function(b,d,e){a.post("/login",b).success(function(a){c(a),d()}).error(e)},logout:function(b,d){a.post("/logout").success(function(){c({username:"",role:e.public}),b()}).error(d)},accessLevels:d,userRoles:e,user:f}}]);