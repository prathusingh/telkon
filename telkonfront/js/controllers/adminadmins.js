'use strict';

var adminApp = angular.module('adminApp');

adminApp
	.controller('AdminListCtrl', ['$rootScope', '$scope', '$timeout', 'AdminAdmin',
		function($rootScope, $scope, $timeout, AdminAdmin) {

		$scope.selectedOption = "All";
		$scope.viewOptions = ["All", "Admins", "Super Admins"];
		$scope.admins = [];
		$scope.adminemail = '';
		$scope.admintype= 5;
		$scope.searchText = '';
		$scope.adminShow = {};
		$scope.adminShowModal = false;
		$scope.pageLoading = true;
		$scope.dataLoading = false;
		$scope.errorCode = 0;
		$scope.addMessage = '';
		$scope.addErr = 0;
		$scope.dataShowMsg = '';
		$scope.dataShowErr = 0;

		$scope.refreshAdmins = function() {

			$scope.pageLoading = true;
			
			populateAdmins(function(admins) {

				$scope.pageLoading = false;
				$scope.admins = admins;
				$scope.changeShowOption($scope.selectedOption);
			});
		}

		$scope.refreshAdmins();


		$scope.changeShowOption = function(newOption) {
			$scope.selectedOption = newOption;
		}

		$scope.clearform = function() {
			$scope.addMessage = '';
			$scope.addErr = 0;
			$scope.adminemail = '';
		}

		$scope.addAdmin = function() {

			$scope.dataLoading = true;
			$scope.addMessage = '';
			$scope.addErr = 0;

			if($scope.adminemail) {

				if(validateEmail($scope.adminemail) == true) {

					var data = {email: $scope.adminemail, role: $scope.admintype};
					
					AdminAdmin.addAdmin({}, data).$promise.then(function(res) {
						console.log(res);

						if(res && res.status === 'suc') {

							if(res.message === 'invited') {
								$scope.refreshAdmins();
								$scope.addMessage = SUC_ADMIN_INVITED;
								$scope.adminemail = '';
								$scope.admintype= 5;

							} else if(res.message === 'added') {
								$scope.refreshAdmins();
								$scope.addMessage = SUC_ADMIN_ADDED;
								$scope.adminemail = '';
								$scope.admintype= 5;

							} else if(res.message === 'error_denied') {
								$scope.addErr = -1;
								$scope.addMessage = ERROR_ADMIN_ADD_PERMISSION_DENIED;

							} else if(res.message === 'error_repeat') {
								$scope.addErr = -1;
								$scope.addMessage = ERROR_ADMIN_ADD_REPEAT;

							} else if(res.message === 'error_notallowed') {
								$scope.addErr = -1;
								$scope.addMessage = ERROR_ADMIN_ADD_NOT_ALLOWED;

							} else if(res.message === 'error_blocked') {
								$scope.addErr = -1;
								$scope.addMessage = ERROR_ADMIN_ADD_BLOCKED;

							} else {
								$scope.addMessage = ERROR_UNKNOWN;
								$scope.addErr = -1;
								
							}
						} else {
							$scope.addMessage = ERROR_UNKNOWN;
							$scope.addErr = -1;
							$scope.dataLoading = false;
							
						}
						$scope.dataLoading = false;

					}, function(err) {
						var message = getErrorVal(err);
						$scope.addMessage = message;
						$scope.addErr = -1;
						$scope.dataLoading = false;
						
					});

				} else {
					$scope.addMessage = ERROR_ADMIN_INVALID_EMAIL;
					$scope.addErr = -1;
					$scope.dataLoading = false;
				}

			} else {
				$scope.addMessage = ERROR_ADMIN_EMPTY_EMAIL;
				$scope.addErr = -1;
				$scope.dataLoading = false;
			}
		}

		$scope.removeAdmin = function(adminuid) {

			var data = {adminuid: adminuid};

			bootbox.confirm("Are you sure?", function(result) {
	  			if(result) {

					AdminAdmin.removeAdmin({}, data).$promise.then(function(res) {
						console.log(res);
							
						if(res && res.status === 'suc') {
							$scope.refreshAdmins();
							if(res.message === 'removed') {
								var alertMessage = {
									value: SUC_ADMIN_REMOVED,
									type: 'success'
								};
								$rootScope.$broadcast('showAlertBox', alertMessage);
							} else if(res.message === 'error_denied') {
								var alertMessage = {
									value: ERROR_ADMIN_REMOVE_PERMISSION_DENIED,
									type: 'danger'
								};
								$rootScope.$broadcast('showAlertBox', alertMessage);
							} else if(res.message === 'error_self') {
								var alertMessage = {
									value: ERROR_ADMIN_REMOVE_SELF,
									type: 'danger'
								};
								$rootScope.$broadcast('showAlertBox', alertMessage);
							} else  {
								var alertMessage = {
									value: ERROR_UNKNOWN,
									type: 'danger'
								};
								$rootScope.$broadcast('showAlertBox', alertMessage);
							}
						} else {
							var alertMessage = {
								value: ERROR_UNKNOWN,
								type: 'danger'
							};
							$rootScope.$broadcast('showAlertBox', alertMessage);
						}

					}, function(err) {
						var message = getErrorVal(err);
						var alertMessage = {
							value: message,
							type: 'danger'
						};
						$rootScope.$broadcast('showAlertBox', alertMessage);
					});
				}
			});
		}


		$scope.clickAdmin = function(adminuid) {

			$scope.dataLoading = true;
			$scope.dataShowMsg = '';
			$scope.dataShowErr = 0;

			var data = {adminuid: adminuid};

			AdminAdmin.getOne({}, data).$promise.then(function(res) {
				console.log(res);
				if(res && res.status === 'suc' && res.data) {
						
					$scope.dataLoading = false;
					$scope.adminShow = res.data;

					if($scope.adminShow) {

						if($scope.adminShow.adminsince) {
							$scope.adminShow.adminsince = moment($scope.adminShow.adminsince).format(MOMENT_DISPLAY_DATE);	
						}

						if($scope.adminShow.role == 5 || $scope.adminShow.role == 7) {
	                   		$scope.adminShow.admintype = 'Admin';
	                   	} else if($scope.adminShow.role == 6 || $scope.adminShow.role == 8) {
	                   		$scope.adminShow.admintype = 'Super Admin';
	                   	} else {
	                   		$scope.adminShow.admintype = 'Admin';
	                   	}

	                   	if($scope.adminShow.imagedp) {
	                   		$scope.adminShow.imagedp = AWS_URL.IMAGEDP + $scope.adminShow.imagedp;
	                   	}
						if($scope.adminShow.residencetype == 0) {
	                   		$scope.adminShow.residencetype = 'Owner';
	                   	} else if($scope.adminShow.residencetype == 1) {
	                   		$scope.adminShow.residencetype = 'Tenant';
	                   	}
					}

				} else {
					
					$scope.dataShowMsg = ERROR_UNKNOWN;
					$scope.dataShowErr = -1;
					$scope.dataLoading = false;

				}
			}, function(err) {
				var message = getErrorVal(err);
				$scope.dataShowMsg = message;
				$scope.dataShowErr = -1;
				$scope.dataLoading = false;
			});
		}

		function populateAdmins(callback) {

			var admins = [];
			AdminAdmin.getAll({}).$promise.then(function(res) {
				console.log(res);
				if(res && res.status === 'suc' && res.data) {

					admins = res.data;

					if(admins) {

						var d;
						for(var i=0 ; i<admins.length ; i++) {
                   			if(admins[i].createdat) {
                   				d = admins[i].createdat;
      	             			admins[i].createdat = moment(d).format(MOMENT_DISPLAY_DATE);
                   			}
               			}
					}
					callback(admins);

				} else {
					callback(admins);
					var alertMessage = {
						value: ERROR_UNKNOWN,
						type: 'danger'
					};
					$rootScope.$broadcast('showAlertBox', alertMessage);
				}

			}, function(err) {
				var message = getErrorVal(err);
				callback(members);
				var alertMessage = {
					value: message,
					type: 'danger'
				};
				$rootScope.$broadcast('showAlertBox', alertMessage);
			});
		}

	}]);


adminApp
	.filter('searchFilterAdmins', function () {
  		return function (items, scope) {
 			
  			var filtered = [];

  			if(scope.searchText === '') {
  				filtered = items;
  			} else {

  				angular.forEach(items, function(item) {

	  				if ((item.email && item.email.toLowerCase().indexOf(scope.searchText.toLowerCase()) != -1) ||
	  					(item.name && item.name.toLowerCase().indexOf(scope.searchText.toLowerCase()) != -1)) {

	  						filtered.push(item);
	  				}
	  			});
  			}

    		return filtered;
  		};

	});



adminApp
	.filter('selectedOptionFilterAdmins', function () {
  		return function (items, scope) {
  			
  			var filtered = [];

  			if(scope.selectedOption === 'All') {
  				filtered = items;
  			} else {
  				angular.forEach(items, function(item) {
	  				if(scope.selectedOption === 'Admins') {
	  					if(item.role == 5 || item.role == 7) {
	  						filtered.push(item);
	  					}
	  				} else if(scope.selectedOption === 'Super Admins') {
	  					if(item.role == 6 || item.role == 8) {
	  						filtered.push(item);
	  					}
	  				} else if(scope.selectedOption === 'Blocked') {
	  					if(item.isblocked) {
	  						filtered.push(item);
	  					}
	  				}
	  			});
  			}

  			
    		return filtered;
  		};
	});