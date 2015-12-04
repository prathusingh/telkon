'use strict';

var websiteApp = angular.module('websiteApp', [
  'ngRoute',
  'ngResource',
  'ngSanitize',
  'angular-bootstrap-select',
  'angular-bootstrap-select.extra'
]);

websiteApp
	.config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {

		$httpProvider.defaults.withCredentials = true;

	  	$routeProvider
	  		/*.when('/main', {
	  			templateUrl: "templates/main.html"
	  		})*/
	  		.when('/login', {
	  			templateUrl: "templates/login.html"
	  		})
	  		.when('/register', {
	  			templateUrl: "templates/register.html"
	  		})
	  		.when('/details', {
	  			templateUrl: "templates/details.html"
	  		})
	  		.when('/guest', {
	  			templateUrl: "templates/guest.html"
	  		})
	  		.when('/personal', {
	  			templateUrl: "templates/personal.html"
	  		})
	  		.when('/official', {
	  			templateUrl: "templates/official.html"
	  		})
	  		.when('/forgetpassword', {
	  			templateUrl: "templates/forgetpassword.html"
	  		})/*
	  		.when('/about', {
	  			templateUrl: "templates/about.html"
	  		})
	  		.when('/features', {
	  			templateUrl: "templates/features.html"
	  		})
	  		.when('/faqs', {
	  			templateUrl: "templates/faqs.html"
	  		})
	  		.when('/contact', {
	  			templateUrl: "templates/contact.html"
	  		})*/
			.when('/oauth2callback', {
	  			templateUrl: "templates/oauth2callback.html"
	  		})
	  		.when('/terms', {
	  			templateUrl: "templates/terms.html"
	  		})
	  		.when('/privacy', {
	  			templateUrl: "templates/privacy.html"
	  		})/*
	  		.when('/test', {
	  			templateUrl: "templates/test.html"
	  		})*/
			.when('/createAd', {
	  			templateUrl: "templates/createAd.html"
	  		})
	  		.when('/createSoc', {
	  			templateUrl: "templates/createSoc.html"
	  		})
  			.otherwise({
	  			redirectTo: function(route, path, search) {
	  				return "/login";
  				}
  			});
		}

	])
	.run(function(User, $window) {

		//authenicateUser();
		/*
			
		*/

		function authenicateUser() {

			User.get({}).$promise.then(function(res) {

				console.log(res);
				if(res && res.status === 'suc' && res.message === 'authorised' && res.data) {

					if(res.data.isremoved) {
						$window.location.href = HOST + '/others#/removed';
					} else if(res.data.isblocked) {
						$window.location.href = HOST + '/others#/blocked';
					} else {

						var role = res.data.role;
						var loginas = res.data.loginas;

						if(role == 2) {
							$window.location.href = HOST + '/app#/details';
						} else if(role == 1) {
							$window.location.href = HOST + '/app#/details';
						} else if(role == 3) {
							$window.location.href = HOST + '/app#/createSoc';
						} else if(role == 4) {
							$window.location.href = HOST + '/member#/';
						} else if(role == 5 || role == 6 || role == 7 || role == 8) {
							$window.location.href = HOST + '/admin#/';
						} else if(role == 0) {
							$window.location.href = HOST + '/sys#/';
						} else if(role == 9) {
							$window.location.href = HOST + '/block#/';
						}
					}
				} else {
					console.log('Bad Request');
				}

			}, function(err) {
				console.log(err);
			});
		}
	});
