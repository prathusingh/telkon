'use strict';

var othersApp = angular.module('othersApp');


othersApp
	.controller('PageCtrl', ['$rootScope', '$scope', '$window', '$document', '$timeout', 'Other',
		function($rootScope, $scope, $window, $document, $timeout, Other) {

		$scope.bodyPageLoaderShow = true;

		$scope.name = '';
		$scope.flat = '';
		$scope.societyname = '';
		$scope.city = '';
		$scope.residencetype = '';
		$scope.dataLoading = true;

		getProfile();

		function getProfile() {

			Other.getProfileData({}, {}).$promise.then(function(res) {

				console.log(res);
				if(res && res.status === 'suc' && res.data) {

					$scope.flat = res.data.flat;
					$scope.societyname = res.data.societyname;
					$scope.city = res.data.city;
					$scope.residencetype = res.data.residencetype;
					if($scope.residencetype == 0) $scope.residencetype = 'Owner';
					else if($scope.residencetype == 1) $scope.residencetype = 'Tenant';
					$scope.dataLoading = false;

				} else {
					$scope.dataLoading = false;
				}
			}, function(err) {
				console.log(err);
				$scope.dataLoading = false;
			});
		}

		$scope.logout = function() {

			$rootScope.$broadcast('bodyPageLoaderShow');
			Other.logout({}, {}).$promise.then(function(res) {

				console.log(res)
				if(res && res.status === 'suc' && res.message === 'loggedout') {

					$rootScope.$broadcast('bodyPageLoaderHide');
					$window.location.href = HOST + '/';

				} else {
					$rootScope.$broadcast('bodyPageLoaderHide');
					$window.location.href = HOST + '/';
				}

			}, function(err) {
				console.log(err);
				$rootScope.$broadcast('bodyPageLoaderHide');
				$window.location.href = HOST + '/';
			});

		}


		$scope.suspendAccount = function() {

			bootbox.confirm("Are you sure?", function(result) {
  				if(result) {

					$rootScope.$broadcast('bodyPageLoaderShow');
					Other.suspend({}, {}).$promise.then(function(res) {

						console.log(res)
						if(res && res.status === 'suc' && res.message === 'suspended') {

							$rootScope.$broadcast('bodyPageLoaderHide');
							$window.location.href = HOST + '/';

						} else {
							$rootScope.$broadcast('bodyPageLoaderHide');
							$window.location.href = HOST + '/';
						}

					}, function(err) {
						console.log(err);
						$rootScope.$broadcast('bodyPageLoaderHide');
						$window.location.href = HOST + '/';
					});
				}
			});

		}

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