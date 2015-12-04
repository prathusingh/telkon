'use strict';

var apiRootUrl = rootUrl + '/user';

var othersApp = angular.module('othersApp', [
  'ngRoute',
  'ngResource',
  'ngSanitize'
]);

othersApp
	.config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {

		$httpProvider.defaults.withCredentials = true;

	  	$routeProvider
	  		
	  		.when('/blocked', {
	  			templateUrl: "viewothers/blocked.html"
	  		})
	  		.when('/removed', {
	  			templateUrl: "viewothers/removed.html"
	  		})
  			.otherwise({
	  			redirectTo: function(route, path, search) {
	  				return "/";
  				}
  			});
		}
	])
	.run(function(Other, $window, $rootScope) {

		authenicateUser();

		function authenicateUser() {

			Other.get({}).$promise.then(function(res) {
				console.log(res);
				if(res && res.status === 'suc' && res.message === 'authorised' && res.data) {
					
					if(res.data.isblocked) {

						var socket = window.io.connect(rootUrl);
						socket.emit('blockConnected', res.data);
						$rootScope.$broadcast('bodyPageLoaderHide');

					} else if(res.data.isremoved) {

						var socket = window.io.connect(rootUrl);
						socket.emit('removedConnected', res.data);
						$rootScope.$broadcast('bodyPageLoaderHide');

					} else {

						$window.location.href = HOST + '/';
					}
					
				} else {
					$rootScope.$broadcast('bodyPageLoaderHide');
					$window.location.href = HOST + '/';
				}
			}, function(err) {
				console.log(err);
				$window.location.href = HOST + '/';
			});
		}

	});