'use strict';

var oAuthApp = angular.module('oAuthApp', [
  'ngRoute',
  'ngResource',
  'ngSanitize'
]);

oAuthApp
	.config(['$routeProvider', '$httpProvider', '$locationProvider',
		function($routeProvider, $httpProvider, locationProvider) {

		$httpProvider.defaults.withCredentials = true;

		$routeProvider
  			.otherwise({
	  			redirectTo: function(route, path, search) {
	  				return "/";
  				}
  			});

	}])
	.run(function($rootScope, $location, $window, $timeout, OAuthService) {

		if($rootScope.isGoogleSignIn) return;

		$rootScope.isGoogleSignIn = true;

	});


oAuthApp
	.factory('OAuthService',
		function($resource) {

      return $resource(
        rootUrl + '/auth/login/form',
          {},
          {
            signupWithGoogle: {
              method: 'POST',
              url: rootUrl + '/auth/register/google'
            }
          }
        );
	 });

	
oAuthApp
	.controller('PageCtrl', ['$scope', '$timeout', '$location', '$window', 'OAuthService',
		function($scope, $timeout, $location, $window, OAuthService) {

		$scope.message = '';
		$scope.bodyPageLoaderShow = false;
		
		$scope.goBack = function() {
			$window.location.href = HOST + '/app#/';
		}

		googleOauth();

		function googleOauth() {

			var url = $location.absUrl();
			var code = url.substring(url.indexOf('?code') + 6);
			var data = {code: code};
			OAuthService.signupWithGoogle({}, data).$promise.then(function(res) {

				console.log(res);
				$scope.bodyPageLoaderShow = false;
				if(res && res.status === 'suc') {

					if(res.message === 'error_useralready') {
						$scope.message = "This Email Id is already registered";
					} else if(res.message === 'registered') {
						$scope.message = 'Congratulations! Registration is successful';
						$window.location.href = HOST + '/app#/personal';
					} else if(res.message === 'loggedin') {

						if(res.data) {

							var role;
							var user;

							if(res.data.role) {
								user = res.data;
							} else {
								user = res.data.user;
							}
						
							role = user.role;

							if(user.isremoved) {
								$window.location.href = HOST + '/others#/removed';
							} else if(user.isblocked) {
								$window.location.href = HOST + '/others#/blocked';
							} else {

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
									$window.location.href = HOST + '/others#/';
								}
							}
						} else {
							$window.location.href = HOST + '/app#/register';
						}

					} else {
						$window.location.href = HOST + '/app#/register';
					}
				}

			}, function(err) {

				if(err.status == 400) {
					$scope.message = 'Strange. Invalid parameters';
				} else if(err.status == 403) {
					$scope.message = 'Logged out. Please log in again';
				} else if(err.status == 500) {
					$scope.message = 'Server Problem. Please try after some time';
				} else {
					$scope.message = 'Unknown Problem. Please try ter sometime';
				}
				$scope.bodyPageLoaderShow = false;

			});
		}

	}]);
    
