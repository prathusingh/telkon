'use strict';

var memberApp = angular.module('memberApp');

memberApp
	.controller('SidenavCtrl', ['$rootScope', '$scope', '$location', '$timeout',
		 function($rootScope, $scope, $location, $timeout) {
		
		$scope.viewOptions = [
			"Home",
			"My Forums",
			"My Clubs",
			"My Classifieds",
			"Society Members",
			"Saved Notices",
			"Saved Classifieds"
		];
		$scope.selectedOption = '';

		$scope.changeShowOption = function(newOption) {

			console.log(newOption);
			if(!newOption) $scope.selectedOption = null;
			$scope.selectedOption = newOption;
			if(newOption === $scope.viewOptions[0]) {
				$rootScope.$broadcast('homeSelectedFromSidenav');
			} else {
				$rootScope.$broadcast('homeUnselectedFromSidenav');
			}
		}

		$scope.changeShowOption(getActiveSideTab($location.path().substring(1)));

		$scope.$on('notificationClicked', function(event, url) {
			
			console.log('Notifier# notificationClicked - HANDLER');
			$timeout(function() {
				$scope.$apply(function() {
			        $scope.selectedOption = $scope.viewOptions[0];
				});
			});
		});

		$scope.$on('homeSelected', function(event) {
			
			console.log('Notifier# homeSelected - HANDLER');
			$timeout(function() {
				$scope.$apply(function() {
			        $scope.selectedOption = $scope.viewOptions[0];
				});
			});
		});

		$scope.$on('newTabSelected', function(event, newOption) {
			
			console.log('Notifier# newTabSelected - HANDLER');
			console.log(newOption);

			if(!newOption) {
				$scope.changeShowOption(null);
				return;
			}

			if($scope.viewOptions.indexOf(newOption) == -1) {
				$scope.changeShowOption(null);
				return;
			}

			$timeout(function() {
				$scope.$apply(function() {
			        $scope.changeShowOption(newOption);
				});
			});

		});
		
		$scope.getRoute = function(option) {

			var route = '';

			if(option === $scope.viewOptions[0]) {
				route = 'forums';
			} else if(option === $scope.viewOptions[1]) {
				route = 'myforums';
			} else if(option === $scope.viewOptions[2]) {
				route = 'myclubs';
			} else if(option === $scope.viewOptions[3]) {
				route = 'myclassifieds';
			} else if(option === $scope.viewOptions[4]) {
				route = 'members';
			} else if(option === $scope.viewOptions[5]) {
				route = 'savednotices';
			} else if(option === $scope.viewOptions[6]) {
				route = 'savedclassifieds';
			}

			return route;
		}

		function getActiveSideTab(route) {

			var sideTab = '';

			if(route === 'forums') {
				sideTab = $scope.viewOptions[0];
			} else if(route === 'myforums') {
				sideTab = $scope.viewOptions[1];
			} else if(route === 'myclubs') {
				sideTab = $scope.viewOptions[2];
			} else if(route === 'myclassifieds') {
				sideTab = $scope.viewOptions[3];
			} else if(route === 'members') {
				sideTab = $scope.viewOptions[4];
			} else if(route === 'savednotices') {
				sideTab = $scope.viewOptions[5];
			} else if(route === 'savedclassifieds') {
				sideTab = $scope.viewOptions[6];
			}
			return sideTab;

		}
	}]);

memberApp
	.controller('HeaderCtrl', ['$rootScope', '$scope', '$timeout', '$window', 'MemberProfile',
		function($rootScope, $scope, $timeout, $window, MemberProfile) {

		$scope.name = '';
		$scope.mode = 0;
		$scope.imagedp = '';
		$scope.society = {};

		loadBootData();

		$scope.$on('societySupportData', function(event, society) {
			
			console.log('Notifier# societySupportData - HANDLER');

			$timeout(function() {
				$scope.$apply(function() {
			        $scope.society = society;
			        broadcastSocietyData();
				});
			});
		});

		$scope.$on('requestBroadcastSocietyData', function(event) {

			console.log('Notifier# requestBroadcastSocietyData - HANDLER');

			$timeout(function() {
				$scope.$apply(function() {
			        broadcastSocietyData();
				});
			});
		});

		$scope.$on('showMemberSupport', function(event) {
			
			console.log('Notifier# showMemberSupport - HANDLER');

			$timeout(function() {
				$scope.$apply(function() {
					showSupport();
				});
			});
		});

		function showSupport() {

			MemberProfile.supportAdd({}, {}).$promise.then(function(res) {

				console.log(res)
				if(res && res.status === 'suc' && res.message === 'added') {
					var alertMessage = {
						value: SUC_PROFILE_SUPPORT_ADDED,
						type: 'success'
					};
					$rootScope.$broadcast('showAlertBox', alertMessage);
				} else {
					var alertMessage = {
						value: ERROR_UNKNOWN,
						type: 'danger'
					};
					$rootScope.$broadcast('showAlertBox', alertMessage);
				}

			}, function(err) {
				console.log(err);
				var message = getErrorVal(err);
				var alertMessage = {
					value: message,
					type: 'danger'
				};
				$rootScope.$broadcast('showAlertBox', alertMessage);
			});
		}

		function broadcastSocietyData() {
			$rootScope.$broadcast('societySupportInfo', $scope.society);
		}

		$scope.logout = function() {

			$rootScope.$broadcast('bodyPageLoaderShow');
			MemberProfile.logout({}, {}).$promise.then(function(res) {

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

		function loadBootData() {

			MemberProfile.getBootData({}, {}).$promise.then(function(res) {
				console.log(res);
				if(res && res.status === 'suc' && res.data) {
					$scope.name = res.data.name;
					$scope.mode = res.data.mode;
					if(res.data.imagedp) {
						$scope.imagedp = AWS_URL.IMAGEDP + res.data.imagedp;	
					}
				} else {
					console.log("Bad Request");
				}
			}, function(err) {
				console.log(err);
			});

		}

		$scope.$on('nameChanged', function(event, name) {

			console.log('Notifier# nameChanged - HANDLER');
			$scope.name = name;
	    });			


	}]);


memberApp
	.controller('TabCtrl', ['$rootScope', '$scope', '$location', '$timeout',
		function($rootScope, $scope, $location, $timeout) {

		$scope.viewOptions = [
			"Forums",
			"Clubs",
			"Notices",
			//"Complaints",
			"Classifieds",
			"Contacts",
		];

		$scope.$on('homeSelectedFromSidenav', function(event) {
			
			console.log('Notifier# homeSelectedFromSidenav - HANDLER');
			$timeout(function() {
				$scope.$apply(function() {
			        $scope.selectedOption = $scope.viewOptions[0];
				});
			});

		});

		$scope.$on('homeUnselectedFromSidenav', function(event) {
			
			console.log('Notifier# homeUnselectedFromSidenav - HANDLER');
			$timeout(function() {
				$scope.$apply(function() {
			        $scope.selectedOption = null;
				});
			});

		});

		$scope.$on('newTabSelected', function(event, newOption) {
			
			console.log('Notifier# newTabSelected - HANDLER');

			if(!newOption) return;
			if($scope.viewOptions.indexOf(newOption) == -1) return;

			$timeout(function() {
				$scope.$apply(function() {
			        $scope.changeShowOption(newOption);
				});
			});

		});

		$scope.changeShowOption = function(newOption) {

			console.log(newOption);
			if(newOption) {
				$rootScope.$broadcast('homeSelected');
				$scope.selectedOption = newOption;
			}
		}

		$scope.changeShowOption(getActiveTab($location.path().substring(1)));

		function getActiveTab(tabPath) {

			var tab;

			for(var i=0 ;  i<$scope.viewOptions.length ; i++) {

				tab = $scope.viewOptions[i];
				if( tabPath === tab.toLowerCase() ) {
					console.log(tab);
					return tab;
				}
			}

			return null;
			//return $scope.viewOptions[0];
		}

	}]);