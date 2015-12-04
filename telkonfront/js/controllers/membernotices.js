'use strict';

var memberApp = angular.module('memberApp');

memberApp
	.controller('NoticesCtrl', ['$rootScope', '$scope', '$timeout', '$sce', 'MemberNotice',
		function($rootScope, $scope, $timeout, $sce, MemberNotice) {


		$scope.selectedOption = "All";
		$scope.viewOptions = ["All", "Read", "Unread"];
		$scope.notices = [];
		$scope.noticesread = [];
		$scope.savednotices = [];
		$scope.noticeShow = {};
		$scope.dataShowMsg = '';
		$scope.dataShowErr = 0;
		$scope.pageLoading = true;
		$scope.dataLoading = true;
		$scope.recSkip = 0;
		$scope.isLoadingMore = false;
		$scope.isLoadCompleted = false;
		$scope.searchText = {};
		$scope.searchText.title = '';
		$scope.society = {};

		function requestBroadcastSocietyData() {
			$rootScope.$broadcast('requestBroadcastSocietyData');
		}

		requestBroadcastSocietyData();

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

			populateNotices(function(notices, noticesread, savednotices) {

				$scope.pageLoading = false;
				$scope.notices = notices;
				$scope.noticesread = noticesread;
				$scope.savednotices = savednotices;
				$scope.changeShowOption($scope.selectedOption);

			});
		}

		$scope.searchNotices = function() {

			$scope.pageLoading = true;
			$scope.recSkip = 0;
			$scope.isLoadCompleted = false;

			populateNotices(function(notices, noticesread, savednotices) {

				$scope.pageLoading = false;
				$scope.notices = notices;
				$scope.noticesread = noticesread;
				$scope.savednotices = savednotices;
				$scope.changeShowOption($scope.selectedOption);

			});
		}

		$scope.refreshNotices();

		$scope.showNoticeDetails = function(notice) {

			$scope.dataLoading = true;
			$scope.noticeShow = notice;
			$scope.dataShowMsg = '';
			$scope.dataShowErr = 0;
			var nid = notice.nid;
			var data = {nid: nid};
				
			MemberNotice.getOne({}, data).$promise.then(function(res) {
				console.log(res);
				$scope.dataLoading = false;
				if(res && res.status === 'suc' && res.data) {

					$scope.noticeShow = res.data;

					if($scope.noticeShow.createdat) {
						$scope.noticeShow.createdat = moment($scope.noticeShow.createdat).format(MOMENT_DISPLAY_DATE);
					}
					
					if($scope.noticesread && $scope.noticesread.indexOf(nid) == -1) {
						MemberNotice.markRead({}, data, function(res) {
							$scope.noticesread.push(nid);
						});
					}

					if($scope.noticeShow.contenturl) {
						var noticeShowUrl = GOOGLE_DOC_URL + rootUrl + $scope.noticeShow.contenturl + "&embedded=true";
						$scope.noticeShow.url = $sce.trustAsResourceUrl(noticeShowUrl);
					}

				} else {
					$scope.noticeShowMsg = ERROR_UNKNOWN;
				}
			}, function(err) {
				var message = getErrorVal(err);
				$scope.dataShowMsg = message;
				$scope.dataShowErr = -1;
				$scope.dataLoading = false;
			});
		}

		$scope.saveNotice = function() {

			var nid = $scope.noticeShow.nid;
			if($scope.savednotices.indexOf(nid) == -1) {

				var data = {nid: nid};
				MemberNotice.markSave({}, data).$promise.then(function(res) {
					console.log(res)
					if(res && res.status === 'suc' && res.message === 'saved') {

						var alertMessage = {
							value: SUC_NOTICE_SAVED,
							type: 'success'
						};
						$rootScope.$broadcast('showAlertBox', alertMessage);
						$scope.savednotices.push(nid);

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

		$scope.unsaveNotice = function() {

			var nid = $scope.noticeShow.nid;
			var index = $scope.savednotices.indexOf(nid);

			if(index != -1) {

				bootbox.confirm("Are you sure?", function(result) {
  					if(result) {
						var data = {nid: nid}
						MemberNotice.markUnsave({}, data).$promise.then(function(res) {
							console.log(res)
							if(res && res.status === 'suc' && res.message === 'unsaved') {

								var alertMessage = {
									value: SUC_NOTICE_UNSAVED,
									type: 'success'
								};
								$rootScope.$broadcast('showAlertBox', alertMessage);
								$scope.savednotices.splice(index, 1);
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

		$scope.showSupport = function() {
			$rootScope.$broadcast('showMemberSupport');
		}

		$scope.changeShowOption = function(newOption) {
			$scope.selectedOption = newOption;
		}

		$scope.$on('noticeAdded', function(event, notice) {

			console.log('Notifier# noticeAdded - HANDLER');

			if(notice && !notice.createdat) {
				notice.createdat = moment();
			}

			notice.createdatshow = {};
			notice.createdatshow.date = moment(notice.createdat).format('D');
            notice.createdatshow.month = moment(notice.createdat).format('MMM YYYY');
			notice.createdat = moment(notice.createdat).format(MOMENT_DISPLAY_DATE);

			if(notice.contentshort &&
				notice.contentshort.length > 100) {
				notice.contentshort =  notice.contentshort.substring(0, 100) + '...';
			}

	      	$scope.$apply(function() {

		        notice.new = true;
			    $scope.notices.unshift(notice);
			});

			$timeout(function() {
			    delete notice.new;
		    }, 2000);
	    });

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

		$scope.$on('societySupportInfo', function(event, society) {
			
			console.log('Notifier# societySupportInfo - HANDLER');

			$timeout(function() {
				$scope.$apply(function() {
			        $scope.society = society;
			        console.log(society);
				});
			});
		});

		function populateNotices(callback) {

			var notices = [];
			var noticesread = [];
			var savednotices = [];
			var data = {search: $scope.searchText.title};

			MemberNotice.getAll({}, data).$promise.then(function(res) {
				console.log(res);

				if(res && res.status === 'suc' && res.data) {

					var notices = res.data.notices;
					var noticesread = res.data.noticesread
					var savednotices = res.data.savednotices;

					if(notices) {

						for(var i=0 ; i<notices.length ; i++) {
                      		if(notices[i].createdat) {
                      			notices[i].createdatshow = {};
                      			notices[i].createdatshow.date = moment(notices[i].createdat).format('D');
                      			notices[i].createdatshow.month = moment(notices[i].createdat).format('MMM YYYY');
                       			notices[i].createdat = moment(notices[i].createdat).format(MOMENT_DISPLAY_DATE);
                   			}
                      		if(notices[i].contentshort &&
                      			notices[i].contentshort.length > 100) {
                       			notices[i].contentshort =  notices[i].contentshort.substring(0, 100) + '...';
                   			}

                  		}
					}

					callback(notices, noticesread, savednotices);
				} else {

					callback(notices, noticesread, savednotices);
					var alertMessage = {
						value: ERROR_UNKNOWN,
						type: 'danger'
					};
					$rootScope.$broadcast('showAlertBox', alertMessage);
				}
			}, function(err) {
				var message = getErrorVal(err);
				callback(notices, noticesread, savednotices);
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

			MemberNotice.getChunk({}, data).$promise.then(function(res) {
				console.log(res);

				if(res && res.status === 'suc') {

					notices = res.data;
					if(notices) {

						for(var i=0 ; i<notices.length ; i++) {
                      		if(typeof notices[i].createdat !== 'undefined') {
                      			notices[i].createdatshow = {};
                      			notices[i].createdatshow.date = moment(notices[i].createdat).format('D');
                      			notices[i].createdatshow.month = moment(notices[i].createdat).format('MMM YYYY');
                       			notices[i].createdat = moment(notices[i].createdat).format(MOMENT_DISPLAY_DATE);
                   			}
                      		if(typeof notices[i].contentshort !== 'undefined' &&
                      			notices[i].contentshort.length > 100) {
                       			notices[i].contentshort =  notices[i].contentshort.substring(0, 100) + '...';
                   			}

                  		}
					}
					callback(notices);

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


memberApp
	.controller('SavedNoticesCtrl', ['$rootScope', '$scope', '$timeout', '$sce', 'MemberNotice',
		function($rootScope, $scope, $timeout, $sce, MemberNotice) {

		$scope.savednotices = [];
		$scope.savedNoticeShow = null;
		$scope.noticeShowMsg = '';
		$scope.pageLoading = true;
		$scope.dataLoading = true;
		$scope.dataShowMsg = '';
		$scope.dataShowErr = 0;

		populateSavedNotices(function(notices) {

			$scope.pageLoading = false;
			$scope.savednotices = notices;
		});


		$scope.refreshSavedNotices = function() {

			$scope.pageLoading = true;
			populateSavedNotices(function(notices) {

				$scope.pageLoading = false;
				$scope.savednotices = notices;
			});
		}

		$scope.clickSavedNotice = function(notice) {

			$scope.dataLoading = true;
			$scope.dataShowMsg = '';
			$scope.dataShowErr = 0;

			var data = {nid: notice.nid};
			MemberNotice.getSavedNoticeOne({}, data).$promise.then(function(res) {
				
				console.log(res);
				if(res && res.status === 'suc') {
					$scope.savedNoticeShow = res.data;

					if($scope.savedNoticeShow) {

						if($scope.savedNoticeShow.contenturl) {
							var noticeShowUrl = GOOGLE_DOC_URL + rootUrl + $scope.savedNoticeShow.contenturl + "&embedded=true";
							$scope.savedNoticeShow.url = $sce.trustAsResourceUrl(noticeShowUrl);
						}

						if($scope.savedNoticeShow.createdat) {
							$scope.savedNoticeShow.createdat = moment($scope.savedNoticeShow.createdat).format(MOMENT_DISPLAY_DATE);
						}

					} else {

						$scope.dataShowMsg = ERROR_DATA_NOT_FOUND;
						$scope.dataShowErr = -1;
					}
						
				} else {
					$scope.dataShowMsg = ERROR_UNKNOWN;
					$scope.dataShowErr = -1;
				}
				$scope.dataLoading = false;

			}, function(err) {
				var message =  getErrorVal(err);
				$scope.dataShowMsg = message;
				$scope.dataShowErr = -1;
				$scope.dataLoading = false;
			});
		}

		$scope.removeSavedNotice = function(notice) {

			bootbox.confirm("Are you sure?", function(result) {
  				if(result) {
					var data = {nid: notice.nid};
					MemberNotice.markSavedNoticeRemove({}, data).$promise.then(function(res) {

						console.log(res);
						if(res && res.status === 'suc' && res.message === 'unsaved') {

							var index = $scope.savednotices.indexOf(notice);
							$scope.savednotices.splice(index, 1);

							var alertMessage = {
								value: SUC_SAVEDNOTICES_REMOVED,
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
						$scope.statusMessage = message;
						var alertMessage = {
							value: message,
							type: 'danger'
						};
						$rootScope.$broadcast('showAlertBox', alertMessage);
					});
				}
			});
		}

		function populateSavedNotices(callback) {

			var notices = [];
			MemberNotice.getSavedNotices({},{}).$promise.then(function(res) {
				console.log(res);
				if(res && res.status === 'suc' && res.data) {

					notices = res.data;
					for(var i=0 ; i<notices.length ; i++) {

                   		if(notices[i].createdat) {
            	       		notices[i].createdat = moment(notices[i].createdat).format(MOMENT_DISPLAY_DATE);
                      	}
                  	}
					callback(notices);

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
				$scope.statusMessage = message;
				var alertMessage = {
					value: message,
					type: 'danger'
				};
				$rootScope.$broadcast('showAlertBox', alertMessage);
				callback(notices);

			});
		}
	}]);


memberApp
	.filter('selectedOptionFilterNotices', function () {
  		return function (items, scope) {
  			
  			var filtered = [];

  			if(scope.selectedOption === 'All') {
  				filtered = items;
  			} else {
  				angular.forEach(items, function(item) {
	  				if(scope.selectedOption === 'Read') {
	  					if(scope.noticesread.indexOf(item.nid) != -1) {
	  						filtered.push(item);
	  					}
	  				} else if(scope.selectedOption === 'Unread') {
	  					if(scope.noticesread.indexOf(item.nid) == -1) {
	  						filtered.push(item);
	  					}
	  				}
	  			});
  			}

    		return filtered;
  		};
	});
