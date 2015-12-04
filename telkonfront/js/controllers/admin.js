'use strict';

var adminApp = angular.module('adminApp');

adminApp
	.controller('SidenavCtrl', ['$scope', '$location', '$timeout',
		function($scope, $location, $timeout) {
		
		$scope.viewOptions = [
			"Notices",
			"Complaints", 
			//"Classifieds",
			"Contacts",
			"Members",
			"Admins",
			"Society - Rules & Regulations",
			"Admin's Guide"
		];

		$scope.selectedOption = getActiveTab() || 'Notices';

		$scope.changeShowOption = function(newOption) {
			$scope.selectedOption = newOption;
		}

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
				route = 'notices';
			} else if(option === $scope.viewOptions[1]) {
				route = 'complaints';
			//} else if(option === 'Classifieds') {
				//route = 'classifieds';
			} else if(option === $scope.viewOptions[2]) {
				route = 'contacts';
			} else if(option === $scope.viewOptions[3]) {
				route = 'members';
			} else if(option === 'Polls') {
				route = 'polls';
			} else if(option === $scope.viewOptions[4]) {
				route = 'admins';
			} else if(option === $scope.viewOptions[5]) {
				route = 'rules';
			} else if(option === $scope.viewOptions[6]) {
				route = 'guide';
			}

			return route;
		}

		function getActiveTab() {

			var tabPath = $location.path().substring(1);
			var tab;

			for(var i=0 ;  i<$scope.viewOptions.length ; i++) {

				tab = $scope.viewOptions[i];

				if( (tab.toLowerCase().replace(/ /g,'')).indexOf(tabPath) != -1 ) {
					console.log(tab);
					return tab;
				}
			}
		}
	}]);

adminApp
	.controller('HeaderCtrl', ['$rootScope', '$scope', '$window', 'AdminProfile',
		function($rootScope, $scope, $window, AdminProfile) {

		$scope.name = '';
		$scope.mode = 0;
		$scope.imagedp = '';

		loadBootData();

		$scope.logout = function() {

			$rootScope.$broadcast('bodyPageLoaderShow');
			AdminProfile.logout({}, {}).$promise.then(function(res) {

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

			AdminProfile.getBootData({}, {}).$promise.then(function(res) {
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

adminApp
	.controller('RulesCtrl', ['$rootScope', '$scope', '$location', 'AdminRules',
		function($rootScope, $scope, $location, AdminRules) {

		$scope.societyrules = 'Admin is preparing - Rules & Regulations';
		$scope.editedRules = '';
		$scope.isLoading = false;
		$scope.message = '';
		$scope.errorCOde = 0;

		$scope.populateRules = function() {

			$scope.isLoading = true;
			AdminRules.getAll({}, {}).$promise.then(function(res) {
				console.log(res);

				if(res && res.status === 'suc' && res.data) {
					$scope.societyrules = res.data;
				}
				$scope.isLoading = false;

			}, function(err) {
				var message = getErrorVal(err);
				var alertMessage = {
					value: message,
					type: 'danger'
				};
				$rootScope.$broadcast('showAlertBox', alertMessage);
				$scope.isLoading = false;
			});
		}

		$scope.populateRules();

		$scope.updateRules = function(editedRules) {

			if(editedRules &&
				editedRules !== 'Admin is preparing - Rules & Regulations'&&
				editedRules !== $scope.societyrules) {
				
				var data = {societyrules: editedRules};

				$scope.isLoading = true;
				AdminRules.edit({}, data).$promise.then(function(res) {
				console.log(res);

					if(res && res.status === 'suc' && res.message === 'edited') {

						var alertMessage = {
							value: SUC_ADMIN_UPDATED_RULES,
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
					$scope.isLoading = false;

				}, function(err) {
					var message = getErrorVal(err);
					var alertMessage = {
						value: message,
						type: 'danger'
					};
					$rootScope.$broadcast('showAlertBox', alertMessage);
					$scope.isLoading = false;
				});
			}
		}
	}]);

adminApp
	.controller('GuideCtrl', ['$scope', '$rootScope',
		function($scope, $rootScope) {

		$scope.viewOptions = [
			"Notices",
			"Complaints", 
			//"Classifieds",
			"Contacts",
			"Members",
			"Admins",
			"Society - Rules & Regulations",
			"Admin's Guide"
		];

		$scope.changeShowOption = function(newOption) {
			$rootScope.$broadcast('newTabSelected', newOption);
		}
	}]);