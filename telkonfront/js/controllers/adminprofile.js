'use strict';

var adminApp = angular.module('adminApp');


adminApp
	.controller('ProfileCtrl', ['$rootScope', '$scope', '$window', '$timeout', '$upload', 'AdminProfile',
		function($rootScope, $scope, $window, $timeout, $upload, AdminProfile) {
	

			/* Helper */
			$scope.creds = AWS_S3_CRED;

			/* Profile */
			$scope.uid = '';
			$scope.socid = '';
			$scope.imagedp = '';
			$scope.name = '';
			$scope.admintype = 'Admin';
			$scope.flat = '';
			$scope.societyname = '';
			$scope.city = '';
			$scope.email = '';
			$scope.phone = '';
			$scope.position = '';
			$scope.department = '';
			$scope.pageLoading = false;
			$scope.message = '';

			/* Imagedp Upload */
			$scope.imageUpload = {};
			$scope.imageUpload.fileName = '';
			$scope.imageUpload.isUploading = false;
			$scope.imageUpload.addMsg = '';
			$scope.imageUpload.addErr = 0;
			$scope.myImage = '';
    		$scope.myCroppedImage = '';

    		$scope.refreshProfile = function() {
				loadProfile( function() {
					$scope.pageLoading = false;
				});
			}

			$scope.refreshProfile();

    		var handleFileSelect=function(evt) {
	      		var file = evt.currentTarget.files[0];
	      		var reader = new FileReader();
	      		reader.onload = function (evt) {
	        		$scope.$apply(function($scope){
	          			$scope.myImage = evt.target.result;
	          			console.log($scope.myImage);
	        		});
	      		};
	      		reader.readAsDataURL(file);
    		};
    		angular.element(document.querySelector('#fileInput')).on('change',handleFileSelect);


    		$scope.setImage = function() {

    			$scope.isUploading = true;
    			var encodeFormatStr = 'data:image/png;base64,';
    			var index = $scope.myCroppedImage.indexOf(encodeFormatStr); 
    			//console.log(index);
    			//console.log($scope.myCroppedImage.substring(index + encodeFormatStr.length));
    			//var file = atob($scope.myCroppedImage.substring(index + encodeFormatStr.length));
    			var file = dataURItoBlob($scope.myCroppedImage);
				$upload.upload({
					url: rootUrl + '/admin/profile/update/imagedp',
					file: file
				}).progress(function (evt) {
					$scope.upload.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
					//console.log('progress: ' + $scope.upload.progressPercentage + '% ' + evt.config.file.name);
				}).success(function (data, status, headers, config) {
					var alertMessage = {
						value: 'Updated Successfully',
						type: 'success'
					};
					$rootScope.$broadcast('showAlertBox', alertMessage);
					$timeout( function() {
						$scope.$apply(function() {
    					$window.location.reload();
						});
					}, 1000);

				}).xhr(function(xhr) {
					xhr.upload.addEventListener('abort', function() {
						console.log('Aborted');
						var alertMessage = {
							value: 'Aborted',
							type: 'danger'
						};
						$rootScope.$broadcast('showAlertBox', alertMessage);
					}, false);
				}).error(function(err) {
					console.log(err);
					var alertMessage = {
						value: 'Server Problem',
						type: 'danger'
					};
					$rootScope.$broadcast('showAlertBox', alertMessage);
				});
    		}

    		$scope.upload = function() {
			
				$scope.imageUpload.addMsg = '';
				$scope.imageUpload.addErr = 0;
				$scope.imageUpload.isUploading = true;

				var re = /(?:\.([^.]+))?$/;
				AWS.config.update({
					accessKeyId: $scope.creds.access_key,
					secretAccessKey: $scope.creds.secret_key
				});
				AWS.config.region = 'us-west-2';
				var bucket = new AWS.S3({
					params: {
						Bucket: $scope.creds.bucket
					}
				});
 
 				if($scope.file) {

					$scope.imageUpload.fileName = $scope.clubid + '.' + re.exec($scope.file.name)[1];

	 				var encodeFormatStr = 'data:image/png;base64,';
	    			var index = $scope.myCroppedImage.indexOf(encodeFormatStr);
	    			var temp64 = $scope.myCroppedImage.substring(index + encodeFormatStr.length);
	    			var fileUp = base64ToFile(temp64, $scope.imageUpload.fileName, $scope.file.type);

					$scope.imageUpload.fileName = $scope.clubid + '.png';

					if(IMAGE_MIME_TYPE.indexOf($scope.file.type) != -1) {

						var params = {
							Key: AWS_UPLOAD_FOLDER.IMAGEDP + '/' + $scope.imageUpload.fileName,
							ContentType: $scope.file.type,
							Body: fileUp,
							ServerSideEncryption: 'AES256'
						};

						bucket.putObject(params, function(err, data) {
					
							if(err) {
								$scope.imageUpload.addMsg = err.message;
								$scope.imageUpload.addErr = -1;
								$scope.imageUpload.isUploading = false;
								return false;
							}
						})
						.on('httpUploadProgress', function(progress) {
							console.log(Math.round(progress.loaded / progress.total * 100) + '% done')
						})
						.on('complete', function(resp) {

							console.log(resp);
							if(resp.error) {
								$scope.imageUpload.addMsg = resp.error.message;
								$scope.imageUpload.addErr = -1;
								$scope.imageUpload.isUploading = false;
							} else {
								updateImagedpName();
							}
						});

					} else {

						$scope.imageUpload.addErr = 1;
						$scope.imageUpload.addMsg = ERROR_PROFILE_INVALID_IMAGEDP;
						$scope.imageUpload.isUploading = false;
					}

  				} else {

  					$scope.imageUpload.addErr = 1;
					$scope.imageUpload.addMsg = ERROR_PROFILE_EMPTY_IMAGEDP;
					$scope.imageUpload.isUploading = false;
				}
			}

			$scope.updateName = function(name) {

				$scope.message = '';

				if(!name) {
					$scope.message = ERROR_PROFILE_EMPTY_NAME;
				} else if(name !== $scope.name) {

					name = toFirstLetterCap(name.trim());
					var data = {name: name};
					AdminProfile.updateName({}, data).$promise.then(function(res) {
						console.log(res);
						if(res && res.status === 'suc' && res.message === 'updated') {

							$scope.name = name;
							var alertMessage = {
								value: SUC_PROFILE_NAME_UPDATED,
								type: 'success'
							};
							$rootScope.$broadcast('showAlertBox', alertMessage);
							$rootScope.$broadcast('nameChanged', name);

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

			$scope.updatePhone = function(phone) {

				$scope.message = '';

				if(!phone) {
					$scope.message = ERROR_PROFILE_EMPTY_PHONE;
				} else if(isNaN(phone)) {
					$scope.message = ERROR_PROFILE_INVALID_PHONE;
				} else if(phone.length != 10 || (phone.charAt(0) != 9 && phone.charAt(0) != 8 && phone.charAt(0) != 7)) {
					$scope.message = ERROR_PROFILE_INVALID_PHONE;
				} else if(phone !== $scope.phone) {

					phone = phone.trim();
					var data = {phone: phone};

					AdminProfile.updatePhone({}, data).$promise.then(function(res) {
						console.log(res);

						if(res && res.status === 'suc' && res.message === 'updated') {

							$scope.phone = phone;
							var alertMessage = {
								value: SUC_PROFILE_UPDATED_PHONE,
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

			$scope.updatePosition = function(position) {

				$scope.message = '';

				if(!position) {
					$scope.message = ERROR_PROFILE_EMPTY_POSITION;
				}
				else if(position !== $scope.position) {

					position = toFirstLetterCap(position.trim());

					var data = {position: position};
					AdminProfile.updatePosition({}, data).$promise.then(function(res) {
						console.log(res);
						if(res && res.status === 'suc' && res.message === 'updated') {

							$scope.position = position;
							var alertMessage = {
								value: SUC_PROFILE_UPDATED_POSITION,
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

			$scope.updateDepartment = function(department) {

				$scope.message = '';

				if(!department) {
					$scope.message = ERROR_PROFILE_EMPTY_DEPARTMENT;
				}
				else if(department !== $scope.department) {

					department = toFirstLetterCap(department.trim());

					var data = {department: department};
					AdminProfile.updateDepartment({}, data).$promise.then(function(res) {
						console.log(res);
						if(res && res.status === 'suc' && res.message === 'updated') {

							$scope.department = department;
							var alertMessage = {
								value: SUC_PROFILE_UPDATED_DEPARTMENT,
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

			function updateImagedpName() {

				var data = {imagedp: $scope.imageUpload.fileName};

				AdminProfile.updateImagedp({}, data).$promise.then(function(res) {
					console.log(res);

					if(res && res.status === 'suc' && res.message === 'updated') {

						$scope.imageUpload.isUploading = false;
						$scope.imageUpload.addErr = 0;
						$scope.imageUpload.addMsg = SUC_CLUB_PAGE_UPDATED_IMAGEDP;

						$timeout( function() {
							$scope.$apply(function() {
		    				$window.location.reload();
							});
						}, 1000);

					} else {
						$scope.imageUpload.isUploading = false;
						$scope.imageUpload.addErr = -1;
						$scope.imageUpload.addMsg = ERROR_UNKNOWN;
					}

				}, function(err) {
					var message = getErrorVal(err);
					$scope.imageUpload.isUploading = false;
					$scope.imageUpload.addErr = -1;
					$scope.imageUpload.addMsg = message;

				});
			}

			function loadProfile(callback) {

				$scope.pageLoading = true;
				AdminProfile.getProfileData({}, {}).$promise.then(function(res) {
					console.log(res);

					if(res && res.status === 'suc' && res.data) {

						$scope.name = res.data.name || '';
						$scope.societyname = res.data.societyname;
						$scope.city = res.data.city;
						$scope.email = res.data.email;
						$scope.phone = res.data.phone || '';
						$scope.position = res.data.position || '';
						$scope.department = res.data.department || '';
						if(res.data.imagedp) {
							$scope.imagedp = AWS_URL.IMAGEDP + res.data.imagedp;	
						}

						var role = res.data.role;
						if(role && (role == 6 || role == 8)) {
							$scope.admintype = 'Super Admin';
						}

						callback();

					} else {

						callback();
						var alertMessage = {
							value: 'Unknown Error!',
							type: 'danger'
						};
						$rootScope.$broadcast('showAlertBox', alertMessage);
					}

				}, function(err) {

					console.log(err);
					callback();
					var alertMessage = {
						value: 'Server Error!',
						type: 'danger'
					};
					$rootScope.$broadcast('showAlertBox', alertMessage);

				});
			}

	}]);


adminApp
	.controller('SettingsCtrl', ['$scope', '$timeout', function($scope, $timeout) {
				

	}]);


adminApp
	.controller('InfoCtrl', ['$rootScope', '$scope', '$timeout', 'AdminProfile',
		function($rootScope, $scope, $timeout, AdminProfile) {
	
			$scope.societyname = '';
			$scope.societycode = '';
			$scope.locality = '';
			$scope.city = '';
			$scope.pincode = '';
			$scope.flatsample = '';
			$scope.phase = 0;
			$scope.tower = 0;
			$scope.block = 0;
			$scope.flats = 0;
			$scope.pageLoading = false;
			$scope.message = '';

			loadInfo( function() {
				$scope.pageLoading = false;
			});

			$scope.updateFlatsample = function(flatsample) {

				flatsample = flatsample.trim();
				$scope.message = '';

				if(!flatsample) {
					$scope.message = 'Please enter a sample flat number';
				}
				else if(flatsample !== $scope.flatsample) {

					var data = {flatsample: flatsample};
					AdminProfile.updateFlatsample({}, data).$promise.then(function(res) {
						console.log(res);
						if(res && res.status === 'suc' && res.message === 'updated') {

							$scope.flatsample = flatsample;
							var alertMessage = {
								value: 'Updated Successfully!',
								type: 'success'
							};
							$rootScope.$broadcast('showAlertBox', alertMessage);

						} else {

							var alertMessage = {
								value: 'Unknown Error!',
								type: 'danger'
							};
							$rootScope.$broadcast('showAlertBox', alertMessage);
						}
					}, function(err) {

						console.log(err);
						var alertMessage = {
							value: 'Server Error!',
							type: 'danger'
						};
						$rootScope.$broadcast('showAlertBox', alertMessage);
					});
				}
			}

			$scope.updateLayoutFlats = function(layoutflats) {

				$scope.message = '';

				if(!layoutflats) {
					$scope.message = 'Please enter a sample flat number';
				}
				else if(layoutflats !== $scope.flats) {

					var data = {layoutflats: layoutflats};
					AdminProfile.updateLayoutflats({}, data).$promise.then(function(res) {
						console.log(res);
						if(res && res.status === 'suc' && res.message === 'updated') {

							$scope.flats = layoutflats;
							var alertMessage = {
								value: 'Updated Successfully!',
								type: 'success'
							};
							$rootScope.$broadcast('showAlertBox', alertMessage);

						} else {

							var alertMessage = {
								value: 'Unknown Error!',
								type: 'danger'
							};
							$rootScope.$broadcast('showAlertBox', alertMessage);
						}
					}, function(err) {

						console.log(err);
						var alertMessage = {
							value: 'Server Error!',
							type: 'danger'
						};
						$rootScope.$broadcast('showAlertBox', alertMessage);
					});
				}
			}


			function loadInfo(callback) {

				$scope.pageLoading = true;
				AdminProfile.getSocietyInfo({}, {}).$promise.then(function(res) {
					console.log(res);

					if(res && res.status === 'suc' && res.data) {

						$scope.societyname = res.data.societyname || 'Not Mentioned';
						$scope.societycode = res.data.societycode || 'Not Mentioned';
						$scope.locality = res.data.locality || 'Not Mentioned';
						$scope.city = res.data.city || 'Not Mentioned';
						$scope.pincode = res.data.pincode || 'Not Mentioned';
						$scope.flatsample = res.data.flatsample || 'Not Mentioned';
						$scope.phase = res.data.layoutphase;
						$scope.tower = res.data.layouttower;
						$scope.block = res.data.layoutblock;
						$scope.flats = res.data.layoutflats;

						callback();

					} else {

						callback();
						var alertMessage = {
							value: 'Unknown Error!',
							type: 'danger'
						};
						$rootScope.$broadcast('showAlertBox', alertMessage);
					}

				}, function(err) {

					console.log(err);
					callback();
					var alertMessage = {
						value: 'Server Error!',
						type: 'danger'
					};
					$rootScope.$broadcast('showAlertBox', alertMessage);

				});
			}

	}]);


adminApp
	.controller('ResetCtrl', ['$rootScope', '$scope', '$timeout', 'AdminProfile',
		function($rootScope, $scope, $timeout, AdminProfile) {
	
		$scope.oldPassword = '';
		$scope.newPassword = '';
		$scope.repeatPassword = '';
		$scope.message = '';
		$scope.errorCode = 0;

		$scope.cancel = function() {

			$scope.oldPassword = '';
			$scope.newPassword = '';
			$scope.repeatPassword = '';
			$scope.message = '';
			$scope.errorCode = 0;
			
		}

		$scope.resetPassword = function() {

			if($scope.newPassword !== $scope.repeatPassword) {

				$scope.message = 'New Password and Confirm Password do not match';
				$scope.errorCode = 1;

			} else if($scope.newPassword.length < 6) {

				$scope.message = 'New Password must be atleast 6 characters long';
				$scope.errorCode = 2;

			} else {

				var data = {
					oldp: $scope.oldPassword,
					newp: $scope.newPassword
				};
				AdminProfile.resetPassword({}, data).$promise.then(function(res) {

					console.log(res);

					if(res && res.status === 'suc') {

						if(res.message === 'error_incorrect') {

							$scope.message = 'Incorrect old password';
							$scope.errorCode = 3;

						} else if(res.message === 'reset') {

							var alertMessage = {
								value: 'Password Reset!',
								type: 'success'
							};
							$rootScope.$broadcast('showAlertBox', alertMessage);
							$scope.cancel();

						} else {
							var alertMessage = {
								value: 'Unknown Error!',
								type: 'danger'
							};
							$rootScope.$broadcast('showAlertBox', alertMessage);
						}
					} else {
						var alertMessage = {
							value: 'Unknown Error!',
							type: 'danger'
						};
						$rootScope.$broadcast('showAlertBox', alertMessage);
					}
				}, function(err) {

					console.log(err);
					var alertMessage = {
						value: 'Server Error!',
						type: 'danger'
					};
					$rootScope.$broadcast('showAlertBox', alertMessage);

				});
			}
		}
		
	}]);


adminApp
	.controller('BecomeMemberCtrl', ['$rootScope', '$scope', '$window', '$timeout', 'AdminProfile',
		function($rootScope, $scope, $window, $timeout, AdminProfile) {
	
		$scope.flat = '';
		$scope.residencetype = 1;
		$scope.message = '';
		$scope.errorCode = 0;

		$scope.cancel = function() {

			$scope.flat = '';
			$scope.message = '';
			$scope.errorCode = 0;
			
		}

		$scope.becomeMember = function() {

			if($scope.flat) {

				$scope.flat = $scope.flat.replace(/[\. !@#$%^&*()<>?{}+,:-]+/g, "");
				$scope.flat = $scope.flat.toUpperCase();
				bootbox.confirm("These details cannot be changed later. Continue?", function(result) {
  					
  					if(result) {
						
						var data = {
							flat: $scope.flat,
							residencetype: $scope.residencetype
						};

						AdminProfile.becomeMember({}, data).$promise.then(function(res) {

							console.log(res);

							if(res && res.status === 'suc' && res.message === 'becamemember') {

								$scope.cancel();
								var alertMessage = {
									value: 'Became Member!',
									type: 'success'
								};
								$rootScope.$broadcast('showAlertBox', alertMessage);
								$window.location.href = HOST + '/member#';
								$scope.cancel();

							} else {
								var alertMessage = {
									value: 'Unknown Error!',
									type: 'danger'
								};
								$rootScope.$broadcast('showAlertBox', alertMessage);
							}

						}, function(err) {

							console.log(err);
							var alertMessage = {
								value: 'Server Error!',
								type: 'danger'
							};
							$rootScope.$broadcast('showAlertBox', alertMessage);

						});
					}
				});

			} else {

				$scope.message = 'Please enter your flat number';
				$scope.errorCode = 1;
				
			}
		}
		
	}]);

adminApp
	.controller('AccountCtrl', ['$rootScope', '$scope', '$window', 'AdminProfile',
		function($rootScope, $scope, $window, AdminProfile) {
	
		$scope.message = '';

		$scope.suspendAccount = function() {

			bootbox.confirm("Are you sure. Continue?", function(result) {
  				if(result) {
					$rootScope.$broadcast('bodyPageLoaderShow');
					AdminProfile.suspendAccount({}, {}).$promise.then(function(res) {

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

		$scope.deleteAccount = function() {

			bootbox.confirm("Are you sure. Continue?", function(result) {
  				if(result) {
					$rootScope.$broadcast('bodyPageLoaderShow');
					AdminProfile.deleteAccount({}, {}).$promise.then(function(res) {

						console.log(res)
						if(res && res.status === 'suc' && res.message === 'deleted') {

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
	}]);