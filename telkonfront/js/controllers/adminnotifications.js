'use strict';

var adminApp = angular.module('adminApp');

adminApp
	.controller('NotificationCtrl', ['$rootScope', '$scope', '$location', '$timeout', 'AdminNotification',
		 function($rootScope, $scope, $location, $timeout, AdminNotification) {
		
		
		$scope.notifications = [];
		$scope.total = 0;
		$scope.notificationLoading = true;
		$scope.recSkip = 0;
		$scope.isLoadingMore = false;
		$scope.isLoadCompleted = false;

		$scope.clearTotal = function() {
			$timeout(clearNotificationTotal, 4000);
		}

		$scope.refreshNotifications = function() {

			$scope.notificationLoading = true;
			$scope.isLoadCompleted = false;
			$scope.recSkip = 0;

			populateNotifications(function(notifications, total) {
			
				/*for(var i=0; i<forums.length; i++) {
					$scope.forums.push(forums);
				}*/
				$scope.notifications = notifications;
				$scope.total = total;
				$scope.notificationLoading = false;
				//$scope.clearTotal();
				console.log($scope.total);

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
			
			if(title === 'Classified' || title === 'Forum') return;

			var item = {};
			item.title = title;
			item.message = message;
			item.date = moment().fromNow();
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

			AdminNotification.getAll({}).$promise.then(function(res) {
				console.log(res);

				if(res && res.status === 'suc' && res.data) {

					notifications = res.data.notifications;
					total = res.data.total;

					var blackListIndex = [];
					if(notifications) {

						for(var i=0 ; i<notifications.length ; i++) {

                      		if(notifications[i]) {

                      			if(notifications[i].title === 'Classified' || notifications[i].title === 'Forum') {
                      				console.log(i + ' ' + notifications[i].title)
                      				blackListIndex.push(i);
									continue;
								}
								
                      			notifications[i] = setNotificationUrl(notifications[i]);

	                      		if(notifications[i].date) {
	        	           			notifications[i].date = moment(notifications[i].date).fromNow();
	                      		}
	                      		if(notifications[i].byimagedp) {
	                      			notifications[i].byimagedp = rootUrl + notifications[i].byimagedp;
	                      		}
                      		}
	                      		
                  		}

                  		console.log(blackListIndex);
                  		if(blackListIndex) {
                  			for(var i=blackListIndex.length; i>0; i--) {
                  				notifications.splice(blackListIndex[i-1], 1);
	                  		}
                  		}
	                  		
					}
					callback(notifications, total);
				} else {

					callback(notifications, total);
					var alertMessage = {
						value: 'Unknown Error!',
						type: 'danger'
					};
					$rootScope.$broadcast('showAlertBox', alertMessage);
				}

			}, function(err) {
				
				console.log(err);
				callback(notifications, total);
				var alertMessage = {
					value: 'Server Error!',
					type: 'danger'
				};
				$rootScope.$broadcast('showAlertBox', alertMessage);
			});
		}

		function populateNotificationsChunk(callback) {

			var notifications = [];

			var data = {recSkip: $scope.recSkip};
			AdminNotification.getChunk({}, data).$promise.then(function(res) {
				console.log(res);

				if(res && res.status === 'suc') {

					notifications = res.data.notifications;

					if(notifications) {

						var blackListIndex = [];
						for(var i=0 ; i<notifications.length ; i++) {

							if(notifications[i]) {

								if(notifications[i].title === 'Classified' || notifications[i].title === 'Forum') {
									console.log(i + ' ' + notifications[i].title)
                      				blackListIndex.push(i);
									continue;
								}

								notifications[i] = setNotificationUrl(notifications[i]);

								if(notifications[i].date) {
        	           				notifications[i].date = moment(notifications[i].date).fromNow();
                      			}
							}
                  		}

                  		console.log(blackListIndex);
                  		if(blackListIndex) {
                  			for(var i=blackListIndex.length; i>0; i--) {
                  				notifications.splice(blackListIndex[i-1], 1);
	                  		}
                  		}

					}
					callback(notifications);
				} else {

					callback(notifications);
					var alertMessage = {
						value: 'Unknown Error!',
						type: 'danger'
					};
					$rootScope.$broadcast('showAlertBox', alertMessage);
				}

			}, function(err) {
				
				console.log(err);
				callback(notifications);
				var alertMessage = {
					value: 'Server Error!',
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
			}
			else if(title === 'Complaint') {
				noti.infotype = 2;
				noti.url = "/complaints";
			}
			else if(title === 'Classified') {
				noti.infotype = 3;
				noti.url = "/classifieds";
			}
			else if(title === 'Contact') {
				noti.infotype = 4;
				noti.url = "/contacts";
			}
			else if(title === 'Forum') {
				noti.infotype = 5;
				noti.url = "/forums";
			}
			else if(title === 'Member') {
				noti.infotype = 6;
				noti.url = "/members";
			}
			return noti;
		}

		function clearNotificationTotal() {

			AdminNotification.clearTotal({}).$promise.then(function(res) {
				$scope.total = 0;
			});
		}

	}]);
