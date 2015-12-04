'use strict';

var adminApp = angular.module('adminApp');

adminApp
	.controller('NoticesCtrl', ['$rootScope', '$scope', '$upload', '$timeout', '$sce', 'AdminNotice',
		function($rootScope, $scope, $upload, $timeout, $sce, AdminNotice) {

		$scope.validForValues = [
			10, 15, 30, 60
		];
		$scope.selectedOption = "All";
		$scope.viewOptions = ["All", "Composed", "Uploaded"];
		$scope.notices = [];
		$scope.noticeShow = {};
		$scope.noticeShowMsg = '';

		$scope.compose = {};
		$scope.compose.title = '';
		$scope.compose.desc = '';
		$scope.compose.validFor = $scope.validForValues[0];
		$scope.compose.errorCode = 0;
		$scope.compose.successMsg = '';
		$scope.compose.errorMsg = '';
		$scope.compose.hasPosted = false;

		$scope.upload = {};
		$scope.upload.title = '';
		$scope.upload.desc = '';
		$scope.upload.validFor = $scope.validForValues[0];
		$scope.upload.meantfor = 2;
		$scope.upload.errorCode = 0;
		$scope.upload.successMsg = '';
		$scope.upload.errorMsg = '';
		$scope.upload.file = null;

		$scope.isUploading = false;
		$scope.message = '';
		$scope.dataLoading = true;
		$scope.pageLoading = true;
		$scope.upload.progressPercentage = 0;
		//$scope.composeTab = 0;
		$scope.recSkip = 0;
		$scope.isLoadingMore = false;
		$scope.isLoadCompleted = false;
		$scope.dataShowMsg = '';
		$scope.dataShowErr = 0;
		$scope.searchText = {};
		$scope.searchText.title = '';

		$scope.loadMore = function() {

			if($scope.isLoadCompleted) return;
			if($scope.isLoadingMore) return;

			$scope.recSkip++;
			$scope.isLoadingMore = true;

			populateNoticesChunk(function(notices) {
			
				if(!notices || notices.length == 0) {
					$scope.isLoadCompleted = true;
				} else {
					for(var i=0; i<notices.length; i++) {
						$scope.notices.push(notices[i]);
					}
				}

				$scope.isLoadingMore = false;

			});
		}
		

		$scope.refreshNotices = function() {

			$scope.pageLoading = true;
			$scope.recSkip = 0;
			$scope.isLoadCompleted = false;
			$scope.searchText.title = '';

			populateNotices(function(notices) {

				$scope.pageLoading = false;
				$scope.notices = notices;
				$scope.changeShowOption($scope.selectedOption);
			});
		}

		$scope.searchNotices = function() {

			$scope.pageLoading = true;
			$scope.recSkip = 0;
			$scope.isLoadCompleted = false;

			populateNotices(function(notices) {

				$scope.pageLoading = false;
				$scope.notices = notices;
				$scope.changeShowOption($scope.selectedOption);
			});
		}

		$scope.refreshNotices();


		$scope.clearForm = function() {

			console.log('clearForm')
	    	$scope.compose.title = '';
	    	$scope.upload.title = '';
			$scope.upload.desc = '';
			$scope.isUploading = false;
			$scope.upload.successMsg = '';
			$scope.upload.errorMsg = '';
			$scope.upload.errorCode = 0;
			$scope.upload.validFor = $scope.validForValues[0];
			$scope.upload.meantfor = 2;
			$scope.upload.file = null;
			$scope.upload.progressPercentage = 0;
			$scope.message = '';
			$scope.compose.successMsg = '';
			$scope.compose.errorMsg = '';
			$scope.compose.errorCode = 0;
			$scope.compose.hasPosted = false;
			$scope.compose.validFor = $scope.validForValues[0];
			$scope.compose.desc = '';
			$scope.dataShowMsg = '';
			$scope.dataShowErr = 0;
	    }


		$scope.changeComposeTab = function(tab) {
			$scope.composeTab = tab;
		}

		
		$scope.changeShowOption = function(newOption) {
			$scope.selectedOption = newOption;
		}


		$scope.showNoticeDetails = function(nid) {

			$scope.dataLoading = true;
			$scope.noticeShow.url = null;
			$scope.dataShowMsg = '';
			$scope.dataShowErr = 0;
			var data = {nid: nid};
				
			AdminNotice.getOne({}, data).$promise.then(function(res) {
				console.log(res);
				$scope.dataLoading = false;

				if(res && res.status === 'suc' && res.data) {

					$scope.noticeShow = res.data;
					$scope.noticeShow.createdat = moment($scope.noticeShow.createdat).format(MOMENT_DISPLAY_DATE_TIME);

					$scope.noticeShow.desc = $scope.noticeShow.desc.replace(/(\r\n|\r|\n)/g, '\n');
					$scope.noticeShow.expiry = moment($scope.noticeShow.expiry).format(MOMENT_DISPLAY_DATE);
					if($scope.noticeShow.meantfor == 2) {
                   		$scope.noticeShow.meantfor = 'Both';
                   	} else if($scope.noticeShow.meantfor == 0) {
           				$scope.noticeShow.meantfor = 'Owner';
                   	} else if($scope.noticeShow.meantfor == 1) {
                   		$scope.noticeShow.meantfor = 'Tenant';
                   	}

					if($scope.noticeShow.contenturl) {

						var noticeShowUrl = GOOGLE_DOC_URL + rootUrl + $scope.noticeShow.contenturl + "&embedded=true";
						$scope.noticeShow.url = $sce.trustAsResourceUrl(noticeShowUrl);
					} else {
						$scope.noticeShowUrl = null;
					}

				} else {
					$scope.dataShowMsg = ERROR_UNKNOWN;
					$scope.dataShowErr = -1;
				}

			}, function(err) {
				var message = getErrorVal(err);
				$scope.dataShowMsg = message;
				$scope.dataShowErr = -1;
				var alertMessage = {
					value: message,
					type: 'danger'
				};
				$rootScope.$broadcast('showAlertBox', alertMessage);
				$scope.dataLoading = false;
			});
		}


		$scope.$watch('files', function () {
	        $scope.upload($scope.files);
	    });


	    $scope.upload = function (files) {

	    	$scope.message = '';
	    	$scope.upload.errorCode = 0;
	    	$scope.upload.progressPercentage = 0;
	    	$scope.upload.errorMsg = '';
	    	$scope.upload.successMsg = '';
	    	$scope.upload.file = null;

	    	if(!$scope.upload.title) {
	    		$scope.upload.errorMsg = ERROR_NOTICE_EMPTY_TITLE;
	    		$scope.upload.errorCode = 1;
	    	}
	    	if(!$scope.upload.desc) {
	    		$scope.upload.errorMsg = ERROR_NOTICE_EMPTY_CONTENT;
	    		if($scope.upload.errorCode == 1) {
	    			$scope.upload.errorCode = 3;
	    		} else {
	    			$scope.upload.errorCode = 2;
	    		}
	    	}
	    	if($scope.upload.errorCode == 0) {

	    		$scope.isUploading = true;
	    		var data = {
	    			title: $scope.upload.title,
	    			desc: $scope.upload.desc,
	    			validfor: $scope.upload.validFor,
	    			meantfor: $scope.upload.meantfor
	    		};

	    		if (files && files.length > 0 ) {

					var file = files[0];
					$scope.upload.file = file;

		            if($scope.upload.file.type === 'application/pdf') {

		               	if($scope.upload.file.size < 10485760) {	// 10 MB
		                	$upload.upload({
				                url: rootUrl + '/admin/notice/upload',
				                data: data,
				                file: file
				            }).progress(function (evt) {
				                $scope.upload.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
				            }).success(function (data, status, headers, config) {
				       	    	$scope.isUploading = false;
								$scope.upload.successMsg = SUC_NOTICE_UPLOADED;
							}).xhr(function(xhr){
								xhr.upload.addEventListener('abort', function() {
									console.log('Aborted');
								}, false);
							}).error(function(err) {
				                var message = getErrorVal(err);
								var alertMessage = {
									value: message,
									type: 'danger'
								};
								$rootScope.$broadcast('showAlertBox', alertMessage);
			                	$scope.isUploading = false;
			                });
	                	} else {
	                		$scope.isUploading = false;
		                	$scope.upload.errorMsg = ERROR_NOTICE_FILE_SIZE_LIMIT;
		                }
			                	
					} else {
		            	$scope.isUploading = false;
		                $scope.upload.errorMsg = ERROR_NOTICE_FILE_FORMAT;
		                console.log($scope.upload.errorMsg);
		            }
		        }
	    	}   
	    }


	    $scope.$on('noticeAdded', function(event, notice) {

			console.log('Notifier# noticeAdded - HANDLER');
			notice.createdat = moment(notice.createdat).format(MOMENT_DISPLAY_DATE_TIME);
			
	      	$scope.$apply(function() {

		        notice.new = true;
			    $scope.notices.unshift(notice);
			});

			$timeout(function() {
			    delete notice.new;
		    }, 2000);
	    });


		$scope.removeNotice = function(nid) {

			bootbox.confirm("Are you sure?", function(result) {
  				if(result) {

					var data = {nid: nid};
					AdminNotice.markRemove({}, data).$promise.then(function(res) {
						console.log(res);
						if(res && res.status === 'suc' && res.message === 'removed') {

						} else {

							var alertMessage = {
								value: ERROR_UNKNOWN,
								type: 'success'
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


		$scope.publishNotice = function(meantfor) {

			$scope.compose.successMsg = '';
			$scope.compose.errorMsg = '';
	    	$scope.compose.errorCode = 0;

	    	if(!$scope.compose.title) {
	    		$scope.compose.errorMsg = ERROR_NOTICE_EMPTY_TITLE;
	    		$scope.compose.errorCode = 1;

	    	}
	    	if(!$scope.compose.desc) {
	    		$scope.compose.errorMsg = ERROR_NOTICE_EMPTY_CONTENT;
	    		if($scope.compose.errorCode == 1) {
	    			$scope.compose.errorCode = 3;
	    		} else {
	    			$scope.compose.errorCode = 2;
	    		}
	    	}

	    	if($scope.compose.errorCode == 0) {

	    		$scope.isUploading = true;
	    		var data = {
	    			title: $scope.compose.title,
	    			desc: $scope.compose.desc,
	    			validfor: $scope.compose.validFor,
	    			meantfor: meantfor
	    		};

	    		AdminNotice.publish({}, data).$promise.then(function(res) {
	    			console.log(res)
	    			$scope.isUploading = false;

	    			if(res && res.status === 'suc' && res.message === 'added') {

	    				$scope.clearForm();
	    				$scope.compose.hasPosted = true;
	    				$scope.compose.successMsg = SUC_NOTICE_POSTED;

	    			} else {
	    				$scope.compose.errorMsg = ERROR_UNKNOWN;
	    			}

	    		}, function(err) {
	    			var message = getErrorVal(err);
	    			$scope.compose.errorMsg = message;
					$scope.isUploading = false;

				});
	    	}
		}


		$scope.$on('noticeRemoved', function(event, nid) {

			console.log('Notifier# noticeRemoved - HANDLER');
			
			var notice;
	      	$scope.$apply(function() {
				
				for(var i=0 ; i<$scope.notices.length ; i++) {

					notice = $scope.notices[i];
					if(notice.nid === nid) {
						$scope.notices.splice(i, 1);
						break;
					}
				}
			});
	    });

		function populateNotices(callback) {

			var notices = [];
			var data = {search: $scope.searchText.title};

			AdminNotice.getAll({}, data).$promise.then(function(res) {
				console.log(res);

				if(res && res.status === 'suc') {

					notices = res.data;
					if(notices) {

						for(var i=0 ; i<notices.length ; i++) {

                      		if(notices[i].createdat) {
                      			//notices[i].createdat = moment(notices[i].createdat).format("dddd, MMMM Do YYYY, h:mm:ss a");
                       			notices[i].createdat = moment(notices[i].createdat).format(MOMENT_DISPLAY_DATE_TIME);
                   			}
                   			if(notices[i].expiry) {
                       			notices[i].expiry = moment(notices[i].expiry).format(MOMENT_DISPLAY_DATE);
                   			}
                   			if(notices[i].title && notices[i].title.length > 50) {
                   				notices[i].title = notices[i].title.substring(0, TITLE_LENGTH_NOTICE) + '...';
                   			}
                      		if(notices[i].contentshort && notices[i].contentshort.length > 50) {
                       			notices[i].contentshort =  notices[i].contentshort.substring(0, CONTENT_LENGTH_NOTICE) + '...';
                   			}
               			}
               			callback(notices);
					} else {
						callback(notices);
					}

				} else {

					callback(notices);
					var alertMessage = {
						value: ERROR_UNKNOWN,
						type: 'danger'
					};
					$rootScope.$broadcast('showAlertBox', alertMessage);
				}

			}, function(err) {
				var message = getErrorVal(err);
				callback(notices);
				var alertMessage = {
					value: message,
					type: 'danger'
				};
				$rootScope.$broadcast('showAlertBox', alertMessage);
			});
		}

		function populateNoticesChunk(callback) {

			var notices = [];
			var data = {recSkip: $scope.recSkip, search: $scope.searchText.title};

			AdminNotice.getChunk({}, data).$promise.then(function(res) {
				console.log(res);

				if(res && res.status === 'suc') {

					notices = res.data;
					if(notices) {

						for(var i=0 ; i<notices.length ; i++) {

                      		if(notices[i].createdat) {
                      			//notices[i].createdat = moment(notices[i].createdat).format("dddd, MMMM Do YYYY, h:mm:ss a");
                       			notices[i].createdat = moment(notices[i].createdat).format(MOMENT_DISPLAY_DATE_TIME);
                   			}
                   			if(notices[i].expiry) {
                       			notices[i].expiry = moment(notices[i].expiry).format(MOMENT_DISPLAY_DATE);
                   			}
                   			if(notices[i].title && notices[i].title.length > 50) {
                   				notices[i].title = notices[i].title.substring(0, TITLE_LENGTH_NOTICE) + '...';
                   			}
                      		if(notices[i].contentshort && notices[i].contentshort.length > 50) {
                       			notices[i].contentshort =  notices[i].contentshort.substring(0, CONTENT_LENGTH_NOTICE) + '...';
                   			}
               			}
               			callback(notices);
					} else {
						callback(notices);
					}

				} else {
					callback(notices);
					var alertMessage = {
						value: ERROR_UNKNOWN,
						type: 'danger'
					};
					$rootScope.$broadcast('showAlertBox', alertMessage);
				}

			}, function(err) {
				var message = getErrorVal(err);
				callback(notices);
				var alertMessage = {
					value: message,
					type: 'danger'
				};
				$rootScope.$broadcast('showAlertBox', alertMessage);
			});
		}

	}]);

adminApp
	.filter('selectedOptionFilterNotices', function () {
  		return function (items, scope) {
  			
  			var filtered = [];

  			if(scope.selectedOption === 'All') {
  				filtered = items;
  			} else {
  				angular.forEach(items, function(item) {
  					
	  				if(scope.selectedOption === 'Composed') {
	  					if(typeof item.contenturl === 'undefined' ||
	  						item.contenturl === null ||
	  						item.contenturl === '') {
	  						filtered.push(item);
	  					}
	  				} else if(scope.selectedOption === 'Uploaded') {
	  					if(typeof item.contenturl !== 'undefined' &&
	  						item.contenturl !== null &&
	  						item.contenturl !== '') {
	  						filtered.push(item);
	  					}
	  				}
	  			});
  			}

    		return filtered;
  		};
	});

adminApp
	.filter('unique', function() {
	   return function(collection, keyname) {
	      var output = [], 
	          keys = [];

	      angular.forEach(collection, function(item) {
	          var key = item[keyname];
	          if(keys.indexOf(key) === -1) {
	              keys.push(key);
	              output.push(item);
	          }
	      });

	      return output;
	   };
	});