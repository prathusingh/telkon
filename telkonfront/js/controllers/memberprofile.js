'use strict';

var memberApp = angular.module('memberApp');


memberApp
	.controller('ProfileCtrl', ['$rootScope', '$scope', '$timeout', '$upload', '$location', '$window', 'MemberProfile',
		function($rootScope, $scope, $timeout, $upload, $location, $window, MemberProfile) {
	
			/* Helper */
			$scope.creds = AWS_S3_CRED;

			/* Profile */
			$scope.uid = '';
			$scope.socid = '';
			$scope.imagedp = '';
			$scope.name = '';
			$scope.aboutme = '';
			$scope.flat = '';
			$scope.societyName = '';
			$scope.city = '';
			$scope.residenceType = 'N/A';
			$scope.email = '';
			$scope.phone = '';
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
					url: rootUrl + '/member/profile/update/imagedp',
					file: file
				}).progress(function (evt) {
					$scope.upload.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
					//console.log('progress: ' + $scope.upload.progressPercentage + '% ' + evt.config.file.name);
				}).success(function (data, status, headers, config) {
					var alertMessage = {
						value: SUC_PROFILE_UPDATED_IMAGEDP,
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
							value: ERROR_PROFILE_ABORTED_IMAGEDP,
							type: 'danger'
						};
						$rootScope.$broadcast('showAlertBox', alertMessage);
					}, false);
				}).error(function(err) {
					var message = getErrorVal(err);
					var alertMessage = {
						value: message,
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

				name = name.trim();
				$scope.message = '';

				if(!name) {
					$scope.message = ERROR_PROFILE_EMPTY_NAME;
				}
				else if(name !== $scope.name) {
					var data = {name: name};
					MemberProfile.updateName({}, data).$promise.then(function(res) {
						console.log(res);
						if(res && res.status === 'suc' && res.message === 'updated') {
							$scope.name = name;
							var alertMessage = {
								value: SUC_PROFILE_UPDATED_NAME,
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

			$scope.updateAboutme = function(aboutme) {

				aboutme = aboutme.trim();
				$scope.message = '';

				if(!aboutme) {
					$scope.message = ERROR_PROFILE_UPDATED_ABOUTME;
				}
				else if(aboutme !== $scope.aboutme) {
					var data = {aboutme: aboutme};
					MemberProfile.updateAboutme({}, data).$promise.then(function(res) {
						console.log(res);
						if(res && res.status === 'suc' && res.message === 'updated') {
							$scope.aboutme = aboutme;
							var alertMessage = {
								value: SUC_PROFILE_UPDATED_ABOUTME,
								type: 'success'
							};
							$rootScope.$broadcast('showAlertBox', alertMessage);
							$rootScope.$broadcast('nameChanged', aboutme);
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

				phone = phone.trim();
				$scope.message = '';

				if(phone.length != 10 || isNaN(phone)) {
					$scope.message = 'Invalid number format';
				} else if(phone.charAt(0) != 9 && phone.charAt(0) != 8 && phone.charAt(0) != 7) {
					$scope.message = 'Invalid mobile number';
				} else if(phone !== $scope.phone) {
					var data = {phone: phone};
					MemberProfile.updatePhone({}, data).$promise.then(function(res) {
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

			function updateImagedpName() {

				var data = {imagedp: $scope.imageUpload.fileName};

				MemberProfile.updateImagedp({}, data).$promise.then(function(res) {
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
				MemberProfile.getProfileData({}, {}).$promise.then(function(res) {
					console.log(res);

					if(res && res.status === 'suc' && res.data) {

						$scope.uid = res.data.uid || '';
						$scope.socid = res.data.socid || '';
						$scope.name = res.data.name || 'Not Mentioned';
						$scope.flat = res.data.flat;
						$scope.societyName = res.data.societyname;
						$scope.city = res.data.city;
						if(res.data.residencetype == 0) {
							$scope.residenceType = 'Owner';
						} else if(res.data.residencetype == 1) {
							$scope.residenceType = 'Tenant';
						}
						$scope.email = res.data.email;
						$scope.phone = res.data.phone || 'Not Mentioned';
						if(res.data.imagedp) {
							$scope.imagedp = AWS_URL.IMAGEDP + res.data.imagedp;
						}

					} else {
						
						var alertMessage = {
							value: ERROR_UNKNOWN,
							type: 'danger'
						};
						$rootScope.$broadcast('showAlertBox', alertMessage);
					}
					callback();

				}, function(err) {
					var message = getErrorVal(err);
					var alertMessage = {
						value: message,
						type: 'danger'
					};
					$rootScope.$broadcast('showAlertBox', alertMessage);
					callback();
				});
			}
	}]);


memberApp
	.controller('FamilyCtrl', ['$rootScope', '$scope', '$timeout', 'MemberProfile',
		function($rootScope, $scope, $timeout, MemberSidenav) {

		$scope.family = [];
		$scope.pageLoading = false;

		$scope.refreshFamily = function() {

			$scope.pageLoading = true;
			populateFamily(function(family) {

				$scope.family = chunk(family, 2);
				console.log($scope.family);
				$scope.pageLoading = false;
			});
		}

		$scope.refreshFamily();

		$scope.report = function(reportuid) {
    		console.log(reportuid);

    		bootbox.confirm("Are you sure?", function(result) {
  				if(result) {
		    		var data = {reportuid: reportuid};
		    		MemberSidenav.reportFamily({}, data).$promise.then(function(res) {
		    			console.log(res);
		    			if(res && res.status === 'suc' && res.message === 'reported') {

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


		$scope.$on('familyMemberReported', function(event, reportuid) {

			console.log('Notifier# familyMemberReported - HANDLER');
			console.log(reportuid);
			
			var member;
	      	$scope.$apply(function() {

	      		for(var i=0 ; i<2 ; i++) {
	      			if($scope.family[i]) {
	      				for(var j=0 ; j<$scope.family[i].length ; j++) {
		      				if($scope.family[i][j].uid === reportuid) {
								$scope.family[i][j].isreported = true;
								break;
							}
						}
	      			}
		      			
	      		}
			});
	    });

	    $scope.$on('memberRemovedByAdmin', function(event, uid) {

			console.log('Notifier# memberRemovedByAdmin - HANDLER');
			console.log(uid);
			
	      	$scope.$apply(function() {

	      		var member = {};
	      		for(var i=0 ; i<2 ; i++) {
	      			if($scope.family[i]) {
	      				for(var j=0 ; j<$scope.family[i].length ; j++) {
		      				if($scope.family[i][j].uid === uid) {
								$scope.family[i].splice(j, 1);
								break;
							}
						}
	      			}
		      			
	      		}
			});
	    });

		function populateFamily(callback) {

			var family = [];
			MemberSidenav.getFamily({}).$promise.then(function(res) {
				console.log(res);
				if(res && res.status === 'suc') {

					family = res.data

					if(family) {

						for(var i=0; i<family.length; i++) {

							if(family[i].imagedp) {
								family[i].imagedp = AWS_URL.IMAGEDP + family[i].imagedp;
							}
						}
					}

					callback(family);

				} else {

					callback(family);
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
				callback(family);

			});
		}
	}]);


memberApp
	.controller('InfoCtrl', ['$rootScope', '$scope', '$timeout', 'MemberProfile',
		function($rootScope, $scope, $timeout, MemberProfile) {

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
		$scope.societyrules = '';

		loadInfo( function() {
			$scope.pageLoading = false;
		});

		function loadInfo(callback) {

			$scope.pageLoading = true;
			MemberProfile.getSocietyInfo({}, {}).$promise.then(function(res) {
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
					$scope.societyrules = res.data.societyrules || 'Admin is preparing - Rules & Regulations';

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


memberApp
	.controller('SettingsCtrl', ['$scope', '$timeout', function($scope, $timeout) {
	}]);


memberApp
	.controller('ResetCtrl', ['$rootScope', '$scope', '$timeout', 'MemberProfile',
		function($rootScope, $scope, $timeout, MemberProfile) {
	
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
				MemberProfile.resetPassword({}, data).$promise.then(function(res) {

					console.log(res);
					if(res && res.status === 'suc' && res.message === 'error_incorrect') {

						$scope.message = 'Incorrect old password';
						$scope.errorCode = 3;

					} else if(res.status === 'suc' && res.message === 'reset') {

						var alertMessage = {
							value: SUC_PROFILE_RESET_PASSWORD,
							type: 'success'
						};
						$rootScope.$broadcast('showAlertBox', alertMessage);
						$scope.errorCode = 0;
						$scope.message = '';
						$scope.cancel();

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
	}]);


memberApp
	.controller('AccountCtrl', ['$rootScope', '$scope', '$window', 'MemberProfile',
		function($rootScope, $scope, $window, MemberProfile) {
	
		$scope.message = '';

		$scope.suspendAccount = function() {

			bootbox.confirm("Are you sure. Continue?", function(result) {
  				if(result) {
					$rootScope.$broadcast('bodyPageLoaderShow');
					MemberProfile.suspendAccount({}, {}).$promise.then(function(res) {

						console.log(res)
						if(res && res.status === 'suc' && res.message === 'suspended') {

							var alertMessage = {
								value: SUC_ACCOUNT_SUSPENDED,
								type: 'danger'
							};
							$rootScope.$broadcast('showAlertBox', alertMessage);

							$rootScope.$broadcast('bodyPageLoaderHide');
							$window.location.href = HOST + '/';

						} else {

							var alertMessage = {
								value: ERROR_UNKNOWN,
								type: 'danger'
							};
							$rootScope.$broadcast('showAlertBox', alertMessage);

							$rootScope.$broadcast('bodyPageLoaderHide');
							$window.location.href = HOST + '/';
						}

					}, function(err) {
						var message = getErrorVal(err);
						var alertMessage = {
							value: message,
							type: 'danger'
						};
						$rootScope.$broadcast('showAlertBox', alertMessage);

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
					MemberProfile.deleteAccount({}, {}).$promise.then(function(res) {

						console.log(res)
						if(res && res.status === 'suc' && res.message === 'deleted') {

							var message = getErrorVal(err);
							var alertMessage = {
								value: SUC_ACCOUNT_DELETED,
								type: 'danger'
							};
							$rootScope.$broadcast('showAlertBox', alertMessage);

							$rootScope.$broadcast('bodyPageLoaderHide');
							$window.location.href = HOST + '/';

						} else {

							var message = getErrorVal(err);
							var alertMessage = {
								value: ERROR_UNKNOWN,
								type: 'danger'
							};
							$rootScope.$broadcast('showAlertBox', alertMessage);

							$rootScope.$broadcast('bodyPageLoaderHide');
							$window.location.href = HOST + '/';
						}

					}, function(err) {
						var message = getErrorVal(err);
						var alertMessage = {
							value: message,
							type: 'danger'
						};
						$rootScope.$broadcast('showAlertBox', alertMessage);

						$rootScope.$broadcast('bodyPageLoaderHide');
						$window.location.href = HOST + '/';
					});
				}
			});
		}
	}]);


memberApp
	.controller('ComingsoonCtrl', ['$rootScope', '$scope', '$timeout', 'MemberProfile',
		function($rootScope, $scope, $timeout, MemberSidenav) {

		$scope.feedback = {};
		$scope.feedback.message = '';
		$scope.feedback.errorCode = 0;
		$scope.feedback.addMessage = '';
		$scope.feedback.addErr = 0;
		$scope.feedback.dataLoading = false;

		$scope.clearData = function() {
			$scope.feedback = {};
		}

		$scope.postFeedback = function() {

			$scope.feedback.errorCode = 0;
			$scope.feedback.addMessage = '';
			$scope.feedback.addErr = 0;

			if($scope.feedback.message) {

				var data = {message: $scope.feedback.message};
				$scope.feedback.dataLoading = true;
				MemberSidenav.feedbackAdd({}, data).$promise.then(function(res) {
					console.log(res);

					if(res && res.status === 'suc' && res.message === 'added') {
						$scope.feedback.addMessage = SUC_COMINGSOON_FEEDBACK_SUBMITTED;
						$scope.feedback.message = '';
					} else {
						$scope.feedback.addMessage = ERROR_UNKNOWN;
						$scope.feedback.addErr = -1;
					}
					$scope.feedback.dataLoading = false;

				}, function(err) {
					console.log(err);
					var message = getErrorVal(err);
					$scope.feedback.addMessage = message;
					$scope.feedback.addErr = -1;
					$scope.feedback.dataLoading = false;
				});

			} else {
				$scope.feedback.addMessage = ERROR_COMINGSOON_FEEDBACK_EMPTY_MESSAGE;
				$scope.feedback.errorCode = 1;
				$scope.feedback.addErr = -1;
			}
			
		}
	}]);

memberApp
	.controller('RulesCtrl', ['$rootScope', '$scope', '$location', 'MemberRules',
		function($rootScope, $scope, $location, MemberRules) {

		$scope.societyrules = 'Admin is preparing - Rules & Regulations';
		$scope.isLoading = false;

		$scope.populateRules = function() {

			$scope.isLoading = true;
			MemberRules.getAll({}, {}).$promise.then(function(res) {
				console.log(res);

				if(res && res.status === 'suc' && res.data) {
					$scope.societyrules = res.data;
				}
				$scope.isLoading = false;

			}, function(err) {
				console.log(err);
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
	}]);

memberApp
	.controller('GuideCtrl', ['$scope', '$rootScope',
		function($scope, $rootScope) {

		$scope.viewOptions = [
			"Forums",
			"Notices",
			"Complaints",
			"Classifieds",
			"Contacts",
		];

		$scope.viewSideOptions = [
			"Home",
			"Family Members",
			"Society Members",
			"My Classifieds",
			"My Forums",
			"Saved Notices",
			"Saved Classifieds",
			//"Feedback/Suggestion",
			"Coming Soon",
			"Society - Rules & Regulations",
			"Member Guide"
		];

		$scope.changeShowOption = function(newOption) {
			$rootScope.$broadcast('newTabSelected', newOption);
		}
	}]);