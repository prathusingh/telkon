'use strict';

var adminApp = angular.module('adminApp');

adminApp
	.controller('AlertCtrl', ['$scope', '$timeout', function($scope, $timeout) {

		$scope.message = {};
		$scope.showAlertBox = false;

		$scope.$on('showAlertBox', function(event, message) {

			$timeout(function() {
				console.log('showAlertBox: ' + message.value);
				console.log('showAlertBox: ' + message.type);
		      	$scope.$apply(function() {

			        $scope.message.value = message.value;
					$scope.message.type = message.type;
					$scope.showAlertBox = true;
				});

				$timeout(function() {
					$scope.showAlertBox = false;
					$scope.message = {};
			    }, 3000);
			});
				

	    });

	}]);


adminApp
	.controller('PageLoadCtrl', ['$scope', '$document', '$timeout',
		function($scope, $document, $timeout) {

		$scope.bodyPageLoaderShow = true;

		angular.element(document).ready(function () {
			console.log('Body loading completed!');
    	});

		$scope.$on('bodyPageLoaderShow', function(event) {

			console.log('bodyPageLoaderShow');
			$timeout(function() {
		      	$scope.$apply(function() {
					$scope.bodyPageLoaderShow = true;
				});
			});
	    });

	    $scope.$on('bodyPageLoaderHide', function(event) {

			$timeout(function() {

				console.log('bodyPageLoaderHide');
		      	$scope.$apply(function() {
					$scope.bodyPageLoaderShow = false;
				});

			});
				

	    });

	}]);
