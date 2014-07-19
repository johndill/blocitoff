"use strict";angular.module("blocitoffApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch"]).config(["$routeProvider",function(a){var b=routingConfig.accessLevels;a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl",access:b.user}).when("/about",{templateUrl:"views/about.html",controller:"AboutCtrl",access:b.public}).when("/login",{templateUrl:"views/login.html",controller:"LoginCtrl",access:b.anon}).otherwise({redirectTo:"/"})}]).run(["$rootScope","$location","Auth",function(a,b,c){a.$on("$routeChangeStart",function(a,d){console.log("checked if logged in, user shown below:"),console.log(c.user),c.authorize(d.access)||b.path(c.isLoggedIn()?"/":"/login")})}]),angular.module("blocitoffApp").controller("MainCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("blocitoffApp").controller("AboutCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("blocitoffApp").controller("LoginCtrl",["$rootScope","$scope","$location","$window","Auth",function(a,b,c,d,e){b.rememberme=!0,b.login=function(){e.login({username:b.username,password:b.password,rememberme:b.rememberme},function(){c.path("/")},function(b){a.error=b})},b.signup=function(){e.signup({username:b.username,password:b.password,role:b.role},function(){c.path("/")},function(b){a.error=b})}}]),angular.module("blocitoffApp").controller("NavCtrl",["$rootScope","$scope","$location","Auth",function(a,b,c,d){b.user=d.user,b.userRoles=d.userRoles,b.accessLevels=d.accessLevels,b.logout=function(){d.logout(function(){c.path("/login")},function(){a.error="Failed to logout"})}}]),angular.module("blocitoffApp").factory("Auth",["$http","$cookieStore",function(a,b){function c(a){angular.extend(f,a),console.log(f)}var d=routingConfig.accessLevels,e=routingConfig.userRoles,f=b.get("user")||{username:"",role:e.public};return{authorize:function(a,b){return void 0===b&&(b=f.role),void 0===a&&(a=d.public),a.bitMask&b.bitMask},isLoggedIn:function(a){return void 0===a&&(a=f),a.role.title===e.user.title||a.role.title===e.admin.title},signup:function(b,d,e){a.post("/signup",b).success(function(a){c(a),d()}).error(e)},login:function(b,d,e){a.post("/login",b).success(function(a){c(a),d()}).error(e)},logout:function(b,d){a.post("/logout").success(function(){c({username:"",role:e.public}),b()}).error(d)},accessLevels:d,userRoles:e,user:f}}]);