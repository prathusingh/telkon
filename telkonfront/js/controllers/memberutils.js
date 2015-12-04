'use strict';

var memberApp = angular.module('memberApp');

memberApp
	.controller('AlertCtrl', ['$scope', '$timeout', function($scope, $timeout) {

		$scope.message = {};
		$scope.showAlertBox = false;
		$scope.timeOut = 3000;

		$scope.$on('showAlertBox', function(event, message) {

			console.log('Notifier# showAlertBox - HANDLER');

			$scope.showAlertBox = false;
			$scope.message = {};
			$scope.timeOut = 3000;

			$timeout(function() {

		      	$scope.$apply(function() {
			        $scope.message.value = message.value;
					$scope.message.type = message.type;
					$scope.showAlertBox = true;
				});

				$timeout(function() {
					$scope.showAlertBox = false;
					$scope.message = {};
			    }, $scope.timeOut);
			});

	    });

	}]);


memberApp
	.controller('PageLoadCtrl', ['$scope', '$document', '$timeout',
		function($scope, $document, $timeout) {

		$scope.bodyPageLoaderShow = true;

		angular.element(document).ready(function () {
			console.log('Body loading completed!');
    	});

		$scope.$on('bodyPageLoaderShow', function(event) {

			console.log('Notifier# bodyPageLoaderShow - HANDLER');

			$timeout(function() {
		      	$scope.$apply(function() {
					$scope.bodyPageLoaderShow = true;
				});
			});
	    });

	    $scope.$on('bodyPageLoaderHide', function(event) {

	    	console.log('Notifier# bodyPageLoaderHide - HANDLER');

			$timeout(function() {
		      	$scope.$apply(function() {
					$scope.bodyPageLoaderShow = false;
				});

			});

	    });

	}]);
