'use strict';

var adminApp = angular.module('adminApp');

adminApp
	.controller('ContactsCtrl', ['$rootScope', '$scope', 'AdminContact',
		function($rootScope, $scope, AdminContact) {

		$scope.tabs = [
			"Service", "RWA/Association", "Intercom"
		];
		$scope.selectedTab = 0;
		$scope.pageLoading = false;
		$scope.contacts = [];
		$scope.searchText = '';
		$scope.contactTypes = [
			"Electrician", "Plumber", "Carpenter", "Painter", "Driver", "Mechanic", "Gardener", "Maid", "Cook", "Others"
		];

		var contactsLength;


		$scope.changeTab = function(tab) {

			$scope.pageLoading = true;
			$scope.selectedTab = tab;
			
			var category;
			if(tab == 0) {
				category = 1;
			} else if(tab == 1) {
				category = 3;
			} else if(tab == 2) {
				category = 4;
			}
			getContactsByCategory(category, function(contacts) {
				
				$scope.contacts = contacts;
				contactsLength = contacts.length;
				$scope.pageLoading = false;

			});
		}


		$scope.changeTab(0);

		$scope.checkType = function(type) {
			if(!type || $scope.contactTypes.indexOf(type) == -1) {
				return 'Select type';
			}
		}


		$scope.checkName = function(name) {
			if(!name || name === 'Name') {
				return 'Enter a name';
			}
		}

		$scope.checkPosition = function(position) {
			if(!position || position === 'Position') {
				return 'Enter a position';
			}
		}

		$scope.checkFlat = function(flat) {
			if(flat === 'Flat') {
				return 'Enter flat number';
			}
		}

		$scope.checkPhone = function(phone) {
			if(!phone) {
				return 'Enter phone number';
			} else if(validatePhone(phone) == false) {
				return 'Invalid mobile number';
			}
		}


		$scope.checkEmail = function(email) {
			if(email && validateEmail(email) == false) {
				return 'Invalid email id';
			}
		}


		$scope.checkLocation = function(location) {
			if(!location || location === 'Location') {
				return 'Enter a location';
			}
		}


		$scope.checkNumber = function(number) {
			if(!number) {
				return 'Enter a number';
			} else if(isNaN(number)) {
				return 'Invalid number';
			}
		}


		$scope.removeContact = function(index, category, contactid, isDelete) {

    		if(!contactid) {
	  			$scope.contacts.splice(index, 1);
	  		} else if(isDelete){

	  			bootbox.confirm("Are you sure?", function(result) {
	  				if(result) {
			  			var data = {
				  			category: category,
				  			contactid: contactid
				  		};

				  		AdminContact.removeContact({}, data).$promise.then(function(res) {
				  			console.log(res);
				  			if(res && res.status === 'suc' && res.message === 'removed') {

				  				$scope.contacts.splice(index, 1);
				  				var alertMessage = {
									value: SUC_CONTACT_REMOVED,
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
  		}


		$scope.addContact = function(selectedTab) {
	    	
	    	if(selectedTab == 0) {
	    		$scope.inserted = {
		     		id: $scope.contacts.length+1,
		     		servicetype: $scope.contactTypes[0],
		     		name: 'Name',
		     		phone: 'Phone',
			     	email: 'Email'
		    	};
			    $scope.contacts.unshift($scope.inserted);
	    	} else if(selectedTab == 1) {
	    		$scope.inserted = { 
		     		id: $scope.contacts.length+1,
		     		position: 'Position',
		     		name: 'Name',
		     		phone: 'Phone',
			     	email: 'Email',
			     	flat: 'Flat'
		    	};
			    $scope.contacts.unshift($scope.inserted);
	    	} else if(selectedTab == 2) {
	    		$scope.inserted = { 
		     		id: $scope.contacts.length+1,
		     		location: 'Location',
		     		phone: 'Number'
		    	};
			    $scope.contacts.unshift($scope.inserted);
	    	}
	  	}


	  	$scope.saveContact = function(index, category, values, contactid, tab) {
	  		
	  		var c = $scope.contacts[index];

	  		var data = {};
	  		data = {
	  			category: category
	  		}
	  		if(values.servicetype) data.servicetype = values.servicetype;
	  		if(values.name) data.name = values.name;
	  		if(values.phone) data.phone = values.phone;
	  		if(values.email) data.email = values.email;
	  		if(values.position) data.position = values.position;
	  		if(values.location) data.location = values.location;
	  		if(values.flat) {
	  			values.flat = values.flat.replace(/[\. !@#$%^&*()<>?{}+,:-]+/g, "");
		  		data.flat = values.flat.toUpperCase();
	  		}

	  		if(!contactid) {
	  			/* It is a New Contact */

	  			AdminContact.addContact({}, data).$promise.then(function(res) {
	  				console.log(res);
	  				if(res && res.status === 'suc' && res.message === 'added') {

	  					$scope.changeTab(tab);
	  					var alertMessage = {
							value: SUC_CONTACT_ADDED,
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
	  				
					var message = getErrorVal(err);
					var alertMessage = {
						value: message,
						type: 'danger'
					};
					$rootScope.$broadcast('showAlertBox', alertMessage);
				});

	  		} else if(values.servicetype !== c.servicetype ||
	  			values.name !== c.name ||
	  			values.phone !== c.phone ||
	  			values.email !== c.email ||
	  			values.position !== c.position ||
	  			values.location !== c.location ||
	  			values.flat !== c.flat) {

	  			data.contactid = contactid;

	  			AdminContact.updateContact({}, data).$promise.then(function(res) {
	  				console.log(res);
	  				if(res && res.status === 'suc' && res.message === 'updated') {
	  					var alertMessage = {
							value: SUC_CONTACT_UPDATED,
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
					var message = getErrorVal(err);
					var alertMessage = {
						value: message,
						type: 'danger'
					};
					$rootScope.$broadcast('showAlertBox', alertMessage);
				});

	  		}
	  	}


		function getContactsByCategory(category, callback) {

			var contacts = [];
			if(category) {

				var data = {category: category};
				AdminContact.getContactsByCategory({}, data).$promise.then(function(res) {
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

adminApp
	.filter('searchFilterContacts', function () {
  		return function (items, scope) {
 			
  			var filtered = [];

  			if(scope.searchText === '') {
  				filtered = items;
  			} else {

  				angular.forEach(items, function(item) {

	  				if((item.type && item.type.toLowerCase().indexOf(scope.searchText.toLowerCase()) != -1) ||
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