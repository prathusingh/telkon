'use strict';

var memberApp = angular.module('memberApp');

memberApp
	.controller('NotificationCtrl', ['$rootScope', '$scope', '$location', '$timeout', 'MemberNotification',
		 function($rootScope, $scope, $location, $timeout, MemberNotification) {
		
		
		$scope.notifications = [];
		$scope.total = 0;
		$scope.loadErrMsg = '';
		$scope.notificationLoading = true;
		$scope.recSkip = 0;
		$scope.isLoadingMore = false;
		$scope.isLoadCompleted = false;

		$scope.viewOptions = [
			"Forums",
			"Clubs",
			"Notices",
			//"Complaints",
			"Classifieds",
			"Contacts",
		];

		$scope.viewSideOptions = [
			"Home",
			"My Forums",
			"My Clubs",
			"My Classifieds",
			"Society Members",
			"Saved Notices",
			"Saved Classifieds"
		];

		$scope.changeShowOption = function(newOption) {
			$rootScope.$broadcast('newTabSelected', newOption);
		}

		$scope.clearTotal = function() {
			$timeout(clearNotificationTotal, 4000);
		}
		
		$scope.refreshNotifications = function() {

			$scope.notificationLoading = true;
			$scope.isLoadCompleted = false;
			$scope.recSkip = 0;

			populateNotifications(function(notifications, total) {
 
				$scope.notifications = notifications;
				$scope.total = total;
				$scope.notificationLoading = false;
				//$scope.clearTotal();
			});
		}

		$scope.loadMore = function() {

			if($scope.isLoadCompleted) return;
			if($scope.isLoadingMore) return;

			$scope.recSkip++;
			$scope.isLoadingMore = true;

			populateNotificationsChunk(function(notifications) {
			
				if(!notifications || notifications.length == 0) {
					$scope.isLoadCompleted = true;
				}

				for(var i=0; i<notifications.length; i++) {
					$scope.notifications.push(notifications[i]);
				}

				$scope.isLoadingMore = false;

			});
		}

		$scope.refreshNotifications();

		$scope.showNotificationDetails = function(url) {

			if(url) {
				$location.path(url);
			}
		}

		$scope.$on('notificationCounter', function(event) {
			console.log('Notifier# notificationCounter - HANDLER');

			$scope.total++;
		});

		$scope.$on('newNotificationItem', function(event, title, message, data) {

			console.log('Notifier# newNotificationItem - HANDLER');
			
			var item = {};
			item.title = title;
			item.message = message;
			item.date = moment().fromNow();

			if(title === 'Notice') {
				item.infoid = data.nid;
			} else if(title === 'Complaint') {
				item.infoid = data.compid;
			}
			else if(title === 'Classified') {
				item.infoid = data.cid;
			}
			else if(title === 'Contact') {
				item.infoid = data.contactid;
			}
			else if(title === 'Forum') {
				item.infoid = data.fid;
			}
			else if(title === 'Member') {
				item.infoid = data.uid;
			}
			else if(title === 'Club') {
				item.infoid = data.clubid;
			}
			
			item = setNotificationUrl(item);

			item.new = true;
	      	$scope.$apply(function() {

	      		$scope.notifications.unshift(item);
	      		$timeout(function() {
			    	delete item.new;
		    	}, 2000);
			});
	    });

		function populateNotifications(callback) {

			var notifications = [];
			var total = [];

			MemberNotification.getAll({}).$promise.then(function(res) {
				console.log(res);

				if(res && res.status === 'suc' && res.data) {

					notifications = res.data.notifications;
					total = res.data.total;

					console.log(total);
					if(notifications) {

						for(var i=0 ; i<notifications.length ; i++) {

							if(notifications[i]) {
								notifications[i] = setNotificationUrl(notifications[i]);
	                      		if(notifications[i].date) {
	        	           			notifications[i].date = moment(notifications[i].date).fromNow();
	                      		}
	                      		if(notifications[i].byimagedp) {
	                      			notifications[i].byimagedp = rootUrl + notifications[i].byimagedp;
	                      		}
	                      	}
                  		}
					}
					callback(notifications, total);
				} else {

					callback(notifications, total);
					$scope.loadErrMsg = ERROR_UNKNOWN;
				}

			}, function(err) {
				var message = getErrorVal(err);
				$scope.loadErrMsg = message;
				callback(notifications, total);
			});
		}

		function populateNotificationsChunk(callback) {

			var notifications = [];

			var data = {recSkip: $scope.recSkip};
			MemberNotification.getChunk({}, data).$promise.then(function(res) {
				console.log(res);

				if(res && res.status === 'suc') {

					notifications = res.data.notifications;

					if(notifications) {

						for(var i=0 ; i<notifications.length ; i++) {

							if(notifications[i]) {
								notifications[i] = setNotificationUrl(notifications[i]);

	                      		if(notifications[i].date) {
	        	           			notifications[i].date = moment(notifications[i].date).fromNow();
	                      		}
							}
                  		}
					}
					callback(notifications);
				} else {

					callback(notifications);
					var alertMessage = {
						value: ERROR_UNKNOWN,
						type: 'danger'
					};
					$rootScope.$broadcast('showAlertBox', alertMessage);
				}

			}, function(err) {
				var message = getErrorVal(err);
				callback(notifications);
				var alertMessage = {
					value: message,
					type: 'danger'
				};
				$rootScope.$broadcast('showAlertBox', alertMessage);
			});
		}

		function setNotificationUrl(noti) {

			var title = noti.title;
			if(title === 'Notice') {
				noti.infotype = 1;
				noti.url = "/notices";
				noti.tab = $scope.viewOptions[2];
			} else if(title === 'Complaint') {
				noti.infotype = 2;
				noti.url = "/complaints";
				noti.tab = $scope.viewOptions[2];
			}
			else if(title === 'Classified') {
				noti.infotype = 3;
				noti.url = "/classifieds";
				noti.tab = $scope.viewOptions[3];
			}
			else if(title === 'Contact') {
				noti.infotype = 4;
				noti.url = "/contacts";
				noti.tab = $scope.viewOptions[4];
			}
			else if(title === 'Forum') {
				noti.infotype = 5;
				noti.url = "/forumpage/" + noti.infoid;
				noti.tab = $scope.viewOptions[0];
			}
			else if(title === 'Member') {
				noti.infotype = 6;
				noti.url = "/user/" + noti.infoid;
				noti.tab = null;
			}
			else if(title === 'Club') {
				noti.infotype = 7;
				noti.url = "/clubpage/" + noti.infoid;
				noti.tab = $scope.viewOptions[1];
			}
			return noti;
		}

		function clearNotificationTotal() {

			MemberNotification.clearTotal({}).$promise.then(function(res) {
				$scope.total = 0;
			});
		}

	}]);

