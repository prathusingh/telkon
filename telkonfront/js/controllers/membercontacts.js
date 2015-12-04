'use strict';

var memberApp = angular.module('memberApp');

memberApp
	.controller('ContactsCtrl', ['$rootScope', '$scope', 'MemberContact',
		function($rootScope, $scope, MemberContact) {

		$scope.tabs = [
			"Service",
			"Around Me",
			"RWA/Association",
			"Intercom"
		];
		$scope.selectedTab = 0;
		$scope.searchText = '';
		$scope.pageLoading = false;
		$scope.contacts = [];

		$scope.changeTab = function(tab) {

			$scope.pageLoading = true;
			$scope.selectedTab = tab;
			
			var category;
			if(tab == 0) {
				category = 1;
			} else if(tab == 1) {
				category = 2;
			} else if(tab == 2) {
				category = 3;
			} else if(tab == 3) {
				category = 4;
			}
			getContactsByCategory(category, function(contacts) {
				
				$scope.contacts = contacts;
				$scope.pageLoading = false;

			});
		}

		$scope.changeTab(0);

		function getContactsByCategory(category, callback) {

			var contacts = [];
			if(category) {

				var data = {category: category};
				MemberContact.getContactsByCategory({}, data).$promise.then(function(res) {
					console.log(res);

					if(res && res.status === 'suc') {
						contacts = res.data;
						callback(contacts);

					} else {
						var alertMessage = {
							value: ERROR_UNKNOWN,
							type: 'danger'
						};
						$rootScope.$broadcast('showAlertBox', alertMessage);
						callback(contacts);
					}

				}, function(err) {
					var message = getErrorVal(err);
					callback(contacts);
					var alertMessage = {
						value: message,
						type: 'danger'
					};
					$rootScope.$broadcast('showAlertBox', alertMessage);
				});

			} else {
				callback(contacts);
			}
		}

}]);

memberApp
	.filter('searchFilterContacts', function () {
  		return function (items, scope) {
 			
  			var filtered = [];

  			if(scope.searchText === '') {
  				filtered = items;
  			} else {

  				angular.forEach(items, function(item) {

	  				if((item.servicetype && item.servicetype.toLowerCase().indexOf(scope.searchText.toLowerCase()) != -1) ||
	  					(item.name && item.name.toLowerCase().indexOf(scope.searchText.toLowerCase()) != -1) ||
	  					(item.position && item.position.toLowerCase().indexOf(scope.searchText.toLowerCase()) != -1) ||
	  					(item.location && item.location.toLowerCase().indexOf(scope.searchText.toLowerCase()) != -1) ||
	  					(item.email && item.email.toLowerCase().indexOf(scope.searchText.toLowerCase()) != -1)) {
	  					filtered.push(item);
	  				}
	  			});
  			}

    		return filtered;
  		};

	});