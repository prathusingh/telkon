'use strict';

var publicApp = angular.module('publicApp', [
  'ngRoute',
  'ngResource',
  'ngSanitize',
  'vcRecaptcha'
]);

publicApp
	.config(['$routeProvider', '$httpProvider', '$locationProvider',
		function($routeProvider, $httpProvider, locationProvider) {

		$httpProvider.defaults.withCredentials = true;

		$routeProvider
			.when('/', {
	  			templateUrl: "index.html"
	  		})
  			.otherwise({
	  			redirectTo: function(route, path, search) {
	  				return "/";
  				}
  			});
	}])
	.run(function($rootScope, $location, $window, $timeout, Public) {

		console.log('authenicateUser');
		authenicateUser();
		
		function authenicateUser() {

			Public.get({}).$promise.then(function(res) {

				console.log(res);
				if(res && res.status === 'suc' && res.message === 'authorised' && res.data) {

					var user;
					var role;

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
					console.log(TAG + 'Bad Request');
				}

			}, function(err) {
				//$window.location.href = HOST + '/#/index';
			});
		}

		function broadcastEvents(socket){


			/* NOTICE */
			socket.on('noticeAdded', function (notice) {

	        	console.log('Notifier# noticeAdded');
	        	$rootScope.$broadcast('noticeAdded', notice);
	        });
	    }

	});


publicApp
	.factory('Public', function($resource) {

      return $resource(
        rootUrl + '/auth/login/form',
          {},
          {
            enquire: {
              method: 'POST',
              url: rootUrl + '/auth/enquire/add'
            }
          }
        );
	 });

	
publicApp
	.controller('EnquireCtrl', ['$scope', '$timeout', 'Public',
		function($scope, $timeout, Public) {

		$scope.enquire = {};
		$scope.enquire.name = '';
		$scope.enquire.email = '';
		$scope.enquire.message = '';
		$scope.addMessage = '';
		$scope.errorCode = 0;
		$scope.isLoading = false;

		$scope.sendMessage= function() {

			$scope.addMessage = '';
			$scope.errorCode = 0;
			$scope.isLoading = false;

			if($scope.enquire.email) {

				if(validateEmail($scope.enquire.email) == true) {

					var data = {
						name: $scope.enquire.name || 'Empty',
						email: $scope.enquire.email,
						message: $scope.enquire.message || 'Empty'
					}

					$scope.isLoading = true;
					Public.enquire({}, data).$promise.then(function(res) {
						console.log(res);

						if(res && res.status === 'suc' && res.message === 'sent') {
							
							$scope.addMessage = SUC_ENQUIRE_SENT;
							$scope.enquire.name = '';
							$scope.enquire.email = '';
							$scope.enquire.message = '';

						} else {

							$scope.addMessage = ERROR_UNKNOWN;
							$scope.errorCode = -1;
						}
						$scope.isLoading = false;


					}, function(err) {
						var message = getErrorVal(err);
						$scope.addMessage = message;
						$scope.errorCode = -1;
						$scope.isLoading = false;
					});

				} else {

					$scope.addMessage = ERROR_ENQUIRE_INVALID_EMAIL;
					$scope.errorCode = -1;
				}

			} else {

				$scope.addMessage = ERROR_ENQUIRE_EMPTY_EMAIL;
				$scope.errorCode = -1;
				console.log($scope.addMessage);
			}
		}

	}]);
   

/* HTTP STATUS CODE */
var ERROR_400 = 'Invalid parameters';
var ERROR_401 = 'Unauthorized';
var ERROR_403 = 'Unexpected error. Please log in again';
var ERROR_500 = 'Server Problem. Try after some time';
var ERROR_UNKNOWN = 'Unknown Problem. Try after some time';
var ERROR_DATA_NOT_FOUND = 'Requested data is not found';

/* ERROR */
var ERROR_ENQUIRE_EMPTY_EMAIL =  'Please enter an Email ID';
var ERROR_ENQUIRE_INVALID_EMAIL =  'Email Id is invalid';

/* SUC */
var SUC_ENQUIRE_SENT = 'Thanks for writing to us. We will revert shortly';


function getErrorVal(err) {

	var message = '';
	if(err.status == 400) {
		message = ERROR_400;
	} else if(err.status == 401) {
		message = ERROR_401;
	} else if(err.status == 403) {
		message = ERROR_403;
	} else if(err.status == 500) {
		message = ERROR_500;
	} else {
		message = ERROR_UNKNOWN;
	}

	return message;
}

function validateEmail(email) { 
   var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
   return re.test(email);
}