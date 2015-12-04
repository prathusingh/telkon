'use strict';

var websiteApp = angular.module('websiteApp');


websiteApp
	.controller('OAuthCallbackCtrl', ['$scope', '$window', '$timeout', 'User',
		function($scope, $window, $timeout, User) {

			$window.location.href = HOST + '/app#/google';
	}]);


websiteApp
	.controller('RegisterCtrl', ['$scope', '$window', '$timeout', 'User',
		function($scope, $window, $timeout, User) {

		$scope.register = {};
		$scope.email = '';
		$scope.password = '';
		$scope.rpassword = '';
  		$scope.message = '';
  		$scope.isLoading = false;
  		$scope.googleAuthUrl = '';

  		function getGoogleAuthUrl(callback) {

  			User.getGoogleAuthUrl({}, {}).$promise.then(function(res) {
  				console.log(res);
  				if(res && res.status === 'suc' && res.data) {
  					$scope.googleAuthUrl = res.data;
  					callback();
  				} else {
  					callback();
  				}
  			}, function(err) {
				console.log(err);
				callback();
			});
  		}

  		$scope.logInWithGoogle = function() {
  			
  			getGoogleAuthUrl(function() {
  				$window.location.href = $scope.googleAuthUrl;
  			});
  		}
  		
  		// TODO: Error messages
  		$scope.submitRegister = function() {

  			$scope.message = '';
  			$scope.isLoading = true;

  			if(validateEmail($scope.email) == false) {

  				$scope.isLoading = false;
				$scope.message = ERROR_USER_INVALID_EMAIL;

			} else if($scope.password !== $scope.rpassword) {

				$scope.isLoading = false;
				$scope.message = ERROR_USER_MISMATCH_PASSWORD;

			} else if($scope.password.length < 6) {

				$scope.isLoading = false;
				$scope.message = ERROR_USER_LENGTH_PASSWORD;

			} else {

				var data = {
	  				email: $scope.email,
	  				password: $scope.password
	  			}

				User.register({}, data).$promise.then(function(res) {

					console.log(res);
					$scope.isLoading = false;
					if(res && res.status === 'suc') {

						if(res.message === 'registered') {
							$scope.message = SUC_USER_REGISTERED;
							$window.location.href = "#/personal";
						} else if(res.message === 'error_unavailable') {
							$scope.message = ERROR_USER_UNAVAILABLE_EMAIL;
						} else if(res.message === 'error_invalidemail') {
							$scope.message = ERROR_USER_INVALID_EMAIL;
						} else if(res.message === 'invalidpassword') {
							$scope.message = ERROR_USER_LENTGH_PASSWORD;
						} else {
							$scope.message = ERROR_USER_UNKNOWN;
						}
					}

				}, function(err) {
					var message = getErrorVal(err);
					$scope.message = message;
					$scope.isLoading = false;
				});
			}  			
  		}
	}]);


websiteApp
	.controller('RegisterAdminCtrl', ['$scope', '$window', '$timeout', 'User',
		function($scope, $window, $timeout, User) {

		$scope.register = {};
		$scope.email = '';
		$scope.password = '';
		$scope.rpassword = '';
  		$scope.message = '';
  		$scope.errorCode = 0;
  		$scope.isLoading = false;
  		
  		// TODO: Error messages
  		$scope.submitRegister = function() {

  			$scope.message = '';
  			$scope.errorCode = 0;
  			$scope.isLoading = true;

  			if(validateEmail($scope.email) == false) {

  				$scope.isLoading = false;
				$scope.message = ERROR_USER_INVALID_EMAIL;
				$scope.errorCode = 1;

			} else if($scope.password !== $scope.rpassword) {

				$scope.isLoading = false;
				$scope.message = ERROR_USER_MISMATCH_PASSWORD;
				$scope.errorCode = 2;

			} else if($scope.password.length < 6) {

				$scope.isLoading = false;
				$scope.message = ERROR_USER_LENGTH_PASSWORD;
				$scope.errorCode = 2;

			} else {

				var data = {
	  				email: $scope.email,
	  				password: $scope.password
	  			}

				User.registerAdmin({}, data).$promise.then(function(res) {

					console.log(res);
					$scope.isLoading = false;
					if(res && res.status === 'suc') {

						if(res.message === 'registered') {
							$scope.message = SUC_USER_REGISTERED;
							$timeout(function() {
								$window.location.href = "#/official";
							}, 2000);
							
							//$window.location.href = "#/createSoc";
						} else if(res.message === 'error_unavailable') {
							$scope.message = ERROR_USER_UNAVAILABLE_EMAIL;
							$scope.errorCode = 3;
						} else if(res.message === 'error_invalidemail') {
							$scope.message = ERROR_USER_INVALID_EMAIL;
							$scope.errorCode = 1;
						} else if(res.message === 'error_invalidpassword') {
							$scope.message = ERROR_USER_LENGTH_PASSWORD;
							$scope.errorCode = 2;
						} else {
							$scope.message = ERROR_UNKNOWN;
							$scope.errorCode = -1;
						}
					} else {
						$scope.message = ERROR_UNKNOWN;
						$scope.errorCode = -1;
					}
				}, function(err) {
					var message = getErrorVal(err);
					$scope.message = message;
					$scope.errorCode = -1;
					$scope.isLoading = false;
				});
			}
  		}
	}]);


websiteApp
	.controller('ForgetPasswordCtrl', ['$scope', '$window', '$timeout', 'User',
		function($scope, $window, $timeout, User) {

			$scope.email = '';
			$scope.message = '';
			$scope.isLoading = false;

			$scope.submit = function() {

				$scope.message = '';
				$scope.isLoading = true;

				if(validateEmail($scope.email) == false) {
					$scope.message = 'Please enter a valid Email Id';
					$scope.isLoading = false;
				} else {
	
					var data = {email: $scope.email};
					User.recover({}, data).$promise.then(function(res) {
						console.log(res);

						$scope.isLoading = false;

						if(res && res.status === 'suc') {

							if(res.message === 'mailed') {
								$scope.message = SUC_USER_PASSWORD_MAILED;
							} else if(res.message === 'error_nouser') {
								$scope.message = ERROR_USER_NOT_REGISTERED_EMAIL;	
							} else if(res.message === 'error_invalidemail') {
								$scope.message = ERROR_USER_INVALID_EMAIL;
							} else {
								$scope.message = ERROR_UNKNOWN;
							}
						} else {
							$scope.message = ERROR_UNKNOWN;
						}
					}, function(err) {
						console.log(err);
						var message = getErrorVal(err);
						$scope.message = message;
						$scope.isLoading = false;
					});
				}
				

			}
	}]);


websiteApp
	.controller('LoginCtrl', ['$scope', '$window', 'User',
		function($scope, $window, User) {

		$scope.email = '';
  		$scope.password = '';
  		$scope.message = '';
  		$scope.isLoading = false;
  		$scope.googleAuthUrl = '';


  		function getGoogleAuthUrl(callback) {

  			User.getGoogleAuthUrl({}, {}).$promise.then(function(res) {
  				console.log(res);
  				if(res && res.status === 'suc' && res.data) {
  					$scope.googleAuthUrl = res.data;
  					callback();
  				} else {
  					callback();
  				}
  			}, function(err) {
				console.log(err);
				callback();
			});
  		}

  		$scope.logInWithGoogle = function() {
  			
  			getGoogleAuthUrl(function() {

  				$window.location.href = $scope.googleAuthUrl;

  			});
  		}

  		// TODO: Error messages
  		$scope.loginSubmit = function() {

  			$scope.message = '';
  			$scope.isLoading = true;

  			if(validateEmail($scope.email) == false){
				$scope.message = ERROR_USER_INVALID_EMAIL;
				$scope.isLoading = false;
			} else if(!$scope.password) {
				$scope.message = ERROR_USER_EMPTY_PASSWORD;
				$scope.isLoading = false;
			} else {
				var data = {
  					email: $scope.email,
  					password: $scope.password
  				}

  				User.login({}, data).$promise.then(function(res) {

  					console.log(res);
  					$scope.isLoading = false;
  					if(res && res.status === 'suc') {

			  			if(res.message === 'loggedin' && res.data) {

			  				if(res.data.isblocked) {
								$window.location.href = HOST + '/others#/blocked';
							} else if(res.data.isremoved) {
								$window.location.href = HOST + '/others#/removed';
							} else {
			  					var role = res.data.role;

			  					if(role === 4) {	// member
									$window.location.href = HOST + '/member#/';
								} else if(role === 5 || role === 6 || role === 7 || role === 8) { 	// admin
									$window.location.href = HOST + '/admin#/';
								} else if(role === 2) { 	// guestmember
									$window.location.href = HOST + '/app#/details';
								} else if(role === 3) { 	// guestadmin
									$window.location.href = HOST + '/app#/createSoc';
								} else if(role === 1) { 	// guestplus
									$window.location.href = HOST + '/app#/details';
								} else if(role === 0) { 	// ys
									$window.location.href = HOST + '/sys#/';
								} else if(role === 9) { 	// block
									$window.location.href = HOST + '/block#/';
								}
							}

						} else if(res.message === 'error_nouser') {
							$scope.message = ERROR_USER_NOT_REGISTERED_EMAIL;
						} else if(res.message === 'error_incorrect') {
							$scope.message = ERROR_USER_INCORRECT_CREDENTIALS;
						} else {
							$scope.message = ERROR_UNKNOWN;
						}
					}
  				}, function(err) {
					var message = getErrorVal(err);
					$scope.message = message;
					$scope.isLoading = false;
				});
			}
  		}
	}]);


websiteApp
	.controller('PersonalCtrl', ['$rootScope', '$scope', '$window', 'User',
		function($rootScope, $scope, $window, User) {

		$scope.name = '';
		$scope.phone = '';
		$scope.dataLoading = false;
		$scope.errorCode = 0;
		$scope.message = '';


		$scope.postPersonal = function() {

			$scope.dataLoading = true;
			$scope.errorCode = 0;
			$scope.message = '';

			if($scope.name) {
				if($scope.phone && (validatePhone($scope.phone) == true)) {

					var data = {name: $scope.name, phone: $scope.phone};
					User.postPersonal({}, data).$promise.then(function(res) {
						console.log(res);
						if(res && res.status === 'suc' && res.message === 'updated') {

							$scope.dataLoading = false;
							$scope.errorCode = 0;
							$scope.message = '';
							$window.location.href = "#/details";

						} else {

							$scope.dataLoading = false;
							$scope.errorCode = -1;
							$scope.message = ERROR_UNKNOWN;
						}
					}, function(err) {
						var message = getErrorVal(err);
						$scope.message = message;
						$scope.dataLoading = false;
						$scope.errorCode = -1;

					});


				} else {

					$scope.dataLoading = false;
					$scope.errorCode = 2;
					$scope.message = ERROR_USER_EMPTY_PHONE;

				}

			} else {

				$scope.dataLoading = false;
				$scope.errorCode = 1;
				$scope.message = ERROR_USER_EMPTY_NAME;
			}

		}		
	}]);


websiteApp
	.controller('OfficialCtrl', ['$rootScope', '$scope', '$window', 'User',
		function($rootScope, $scope, $window, User) {

		$scope.name = '';
		$scope.phone = '';
		$scope.position = '';
		$scope.department = '';
		$scope.dataLoading = false;
		$scope.errorCode = 0;
		$scope.message = '';

		$scope.postData = function() {

			$scope.dataLoading = true;
			$scope.errorCode = 0;
			$scope.message = '';

			if($scope.name) {

				var data = {
					name: $scope.name,
					phone: $scope.phone,
					position: $scope.position,
					department: $scope.department
				};
				User.postOfficial({}, data).$promise.then(function(res) {
					console.log(res);
					if(res && res.status === 'suc' && res.message === 'updated') {

						$scope.dataLoading = false;
						$scope.errorCode = 0;
						$scope.message = '';
						$window.location.href = "#/createSoc";

					} else {

						$scope.dataLoading = false;
						$scope.errorCode = -1;
						$scope.message = ERROR_UNKNOWN;
					}
				}, function(err) {
					var message = getErrorVal(err);
					$scope.message = message;
					$scope.dataLoading = false;
					$scope.errorCode = -1;

				});

			} else {

				$scope.dataLoading = false;
				$scope.errorCode = 1;
				$scope.message = ERROR_USER_EMPTY_NAME;
			}
		}	
	}]);


websiteApp
	.controller('DetailsCtrl', ['$scope', '$window', '$timeout', '$location', 'User',
		function($scope, $window, $timeout, $location, User) {

		$scope.city = '';
  		$scope.message = '';
  		$scope.obj = {};
  		$scope.obj.society = {};
  		$scope.obj.flat = '';
  		$scope.obj.residenceType = 1;

  		$scope.flatSample = '';
  		$scope.otherSociety = '';
  		$scope.errorCode = 0;
  		$scope.isLoading = false;

  		$scope.isCitiesLoading = false;
  		$scope.selectCities = [];

  		$scope.isSocietiesLoading = false;
  		$scope.selectSocieties = [];

  		authenicateUser(User, $window, function(role) {

  			if(role != 2) {
  				$window.location.href = HOST + '/#/index';
  			} else {

  				$scope.isCitiesLoading = true;
  				getSelectCities(function(cities) {
  					$scope.isCitiesLoading = false;
  					$scope.selectCities = cities;
  					if($scope.selectCities && $scope.selectCities.length>0) {
  						$scope.city = $scope.selectCities[0];
  						$scope.updateSocieties($scope.city);
  					}
  				});
  			}
  		});

  		$scope.updateSocieties = function(city) {
  			
  			$scope.obj = {};
  			$scope.obj.society = {};
  			$scope.obj.flat = '';
  			$scope.obj.residenceType = 1;
  			$scope.selectSocieties = [];
  			$scope.errorCode = 0;

  			var data = {city: $scope.city};
  			$scope.isSocietiesLoading = true;
  			User.getSocieties({}, data).$promise.then(function(res) {
				console.log(res);
  				if(res && res.status === 'suc') {
  					$scope.selectSocieties = res.data;
  					
  					if($scope.selectSocieties[0]) {
  						$scope.society = $scope.selectSocieties[0].socid;
  					}

  					$scope.isSocietiesLoading = false;
  					$scope.updateFlatSample();
  				}
  			}, function(err) {
				var message = getErrorVal(err);
				$scope.message = message;
				$scope.isSocietiesLoading = false;
			});
  		}


  		// TODO: Confirmation
  		$scope.guestLogin = function() {
  		}

  		$scope.clearMessage = function() {
  			$scope.message = '';
  		}

  		$scope.submitDetails = function() {

  			$scope.clearMessage();
  			$scope.errorCode = 0;

  			if($scope.society !== 'Others') {

  				if($scope.society) {
  					if($scope.obj.flat) {

  						var boxData = '';
  						$scope.obj.flat = $scope.obj.flat.trim().replace(/[\. !@#$%^&*()<>?{}+,:-]+/g, "");
		  				$scope.obj.flat = $scope.obj.flat.toUpperCase();

		  				var dummy = [];

		  				var showSociety = '';
  						var showLocality = '';

  						dummy.push({field: 'Flat', value: $scope.obj.flat});

  						for(var i=0 ; i<$scope.selectSocieties.length; i++) {
  							if($scope.selectSocieties[i].socid === $scope.society) {
  								showSociety = $scope.selectSocieties[i].societyname;
  								showLocality = $scope.selectSocieties[i].locality;
  								break;
  							}
  						}

  						if($scope.obj.residenceType == 0) {
  							dummy.push({field: 'Residence Type', value: 'Owner'});	
  						} else if($scope.obj.residenceType == 1) {
  							dummy.push({field: 'Residence Type', value: 'Tenant'});	
  						}
  						
  						dummy.push({field: 'Society', value: showSociety || 'Invalid Society'});
  						dummy.push({field: 'Locality', value: showLocality || 'Invalid Locality'});
  						dummy.push({field: 'City', value: $scope.city});
  						
  						



  						boxData += '<h2 class="text-center">My Residence</h2> <br><br>';

  						boxData += getBootboxTable(dummy);

  						boxData += '<br><h3 class="color-green text-center">Continue ?</h3>'
  						bootbox.confirm(boxData, function(result) {
  						
  							if(result) {

  								$scope.isLoading = true;
		  						var data = {
				  					city: $scope.city,
				  					socid: $scope.society,
				  					flat: $scope.obj.flat,
				  					residencetype: $scope.obj.residenceType
				  				}

				  				User.details({}, data).$promise.then(function(res) {

				  					$scope.isLoading = false;
				  					console.log(res);
				  					if(res && res.status === 'suc') {
				  						$window.location.href = HOST + '/member#/personal';
				  					} else {
				  						$scope.message = ERROR_UNKNOWN;
				  					}
				  				}, function(err) {
									console.log(err);
									$scope.isLoading = false;
									if(err.status == 400) {
										$scope.message = ERROR_400;
									} else if(err.status == 401) {
										$scope.message = ERROR_401;
									} else if(err.status == 403) {
										$scope.message = ERROR_403;
									} else if(err.status == 500) {
										$scope.message = ERROR_500
									} else {
										$scope.message = ERROR_UNKNOWN;
									}
								});
  							} else {
  								$scope.isLoading = false;
  							}
						});
  						
  					} else {
  						$scope.isLoading = false;
  						$scope.message = ERROR_USER_EMPTY_FLAT;
  						$scope.errorCode = 2;
  					}
  				} else {
  					$scope.isLoading = false;
  					$scope.message = ERROR_USER_EMPTY_SOCIETY;
  					$scope.errorCode = 1;
  				}

  			} else {

  				if($scope.obj.otherSociety) {

  					var data = {
		  				city: $scope.city,
		  				societyname: $scope.obj.otherSociety
		  			}

		  			User.newDetails({}, data).$promise.then(function(res) {

		  				$scope.isLoading = false;
		  				console.log(res);
		  				if(res && res.status === 'suc') {
		  					$location.path('guest');
		  					//$window.location.href = HOST + '/app#/';
		  				} else {
		  					$scope.message = ERROR_UNKNOWN;
		  				}
					}, function(err) {
						var message = getErrorVal(err);
						$scope.message = message;
						$scope.isLoading = false;

					});

  				} else {
  					$scope.isLoading = false;
  					$scope.message = ERROR_USER_EMPTY_SOCIETY;
  					$scope.errorCode = 3;
  				}

  			}
  		}

  		$scope.updateFlatSample = function() {

  			console.log($scope.selectSocieties);
  			console.log($scope.society);

  			$scope.clearMessage();
  			$scope.obj.flat = '';

  			for(var i=0 ; i<$scope.selectSocieties.length ; i++) {
  				if($scope.selectSocieties[i].societyname === $scope.society) {
  					$scope.flatSample = $scope.selectSocieties[i].flatsample;
  					break;
  				}
  				$scope.flatSample = '';
  			}
  		}

  		function getSelectCities(callback) {

  			User.getCities({}).$promise.then(function(res) {
				console.log(res);
  				if(res && res.status === 'suc') {
  					callback(res.data);
  				}

  			}, function(err) {
				var message = getErrorVal(err);
				$scope.message = message;
				$scope.isCitiesLoading = false;
				callback([]);

			});
  		}
	}]);


websiteApp
	.controller('CreateSocietyCtrl', ['$scope', '$window', '$timeout', 'User',
		function($scope, $window, $timeout, User) {

		$scope.city = '';
		$scope.locality = '';
		$scope.pincode = '';
		$scope.societyname = '';

  		$scope.message = '';
  		$scope.errorCode = 0;
  		$scope.isLoading = false;

  		$scope.isCitiesLoading = false;
  		$scope.selectCities = [];

  		authenicateUser(User, $window, function(role) {
  			if(role != 3) {
  				$window.location.href = HOST + '/#/index';
  			} else {
  				
  				$scope.isCitiesLoading = true;
  				getSelectCities(function(cities) {
  					$scope.isCitiesLoading = false;
  					$scope.selectCities = cities;
  					if($scope.selectCities && $scope.selectCities.length>0) {
  						$scope.city = $scope.selectCities[0];
  					}
  				});
  			}
  		});


  		$scope.clearMessage = function() {
  			$scope.message = '';
  		}

  		$scope.submitDetails = function() {

  			$scope.clearMessage();

  			if($scope.city) {
  				if($scope.locality) {
  					if($scope.societyname) {
  						if($scope.pincode && (validatePincode($scope.pincode) == true)) {

  							var boxData = '';
  							var dummy = [];
	  						dummy.push({field: 'City', value: $scope.city});
	  						dummy.push({field: 'Locality', value: $scope.locality});
	  						dummy.push({field: 'Society', value: $scope.societyname});
	  						dummy.push({field: 'Pincode', value: $scope.pincode});

	  						boxData += '<h2 class="text-center">Society Details</h2> <br><br>';

	  						boxData += getBootboxTable(dummy);
	  						console.log(boxData);
	  						boxData += '<br><h3 class="color-green text-center">Continue ?</h3>'

  							bootbox.confirm(boxData, function(result) {
		  						if(result) {

		  							$scope.isLoading = true;

				  					var data = {
					  					city: $scope.city,
					  					locality: $scope.locality,
					  					societyname: $scope.societyname,
					  					pincode: $scope.pincode,
						  			}

						  			User.createSociety({}, data).$promise.then(function(res) {

						  				$scope.isLoading = false;
						  				console.log(res);
					 					if(res && res.status === 'suc' && res.message === 'created') {
					 						$window.location.href = HOST + '/admin#/';
						  				} else {
						  					$scope.message = ERROR_UNKNOWN;
						  				}
						  			}, function(err) {
										var message = getErrorVal(err);
										$scope.message = message;
										$scope.isLoading = false;

									});

		  						} else {
		  							$scope.isLoading = false;
		  						}
							});
  						} else {
  							$scope.isLoading = false;
  							$scope.message = ERROR_USER_EMPTY_PINCODE;
  							$scope.errorCode = 4;
  						}
  					} else {
  						$scope.isLoading = false;
  						$scope.message = ERROR_USER_EMPTY_SOCIETY2;
  						$scope.errorCode = 3;
  					}
  				} else {
  					$scope.isLoading = false;
  					$scope.message = ERROR_USER_EMPTY_LOCALITY;
  					$scope.errorCode = 2;
  				}
  			} else {
  				$scope.isLoading = false;
  				$scope.message = ERROR_USER_EMPTY_CITY;
  				$scope.errorCode = 1;
  			}
  		}

  		function getSelectCities(callback) {

  			User.getCities({}).$promise.then(function(res) {
				console.log(res);
  				if(res && res.status === 'suc') {
  					callback(res.data);
  				}

  			}, function(err) {
				var message = getErrorVal(err);
				$scope.message = message;
				$scope.isCitiesLoading = false;
				callback([]);

			});
  		}
	}]);


function authenicateUser(User, $window, callback) {

	User.get({}).$promise.then(function(res) {
		console.log(res);
		if(res) {
			if(res.status === 'suc' && res.message === 'authorised' && res.data) {
				var role = res.data.role;
				if(!role) {
					$window.location.href = HOST + '/#/index';
				} else {
					callback(role);
				}
			}
		}
	}, function(err) {
		callback(null);
		$window.location.href = HOST + '/#/index';
	});
}