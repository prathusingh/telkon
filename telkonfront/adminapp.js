'use strict';

var adminApp = angular.module('adminApp', [
  'ngRoute',
  'ngResource',
  'ngSanitize',
  'angularFileUpload',
  'ngUpload',
  'xeditable',
  'infinite-scroll',
  'ngImgCrop'
]);

adminApp
	.config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {

		$httpProvider.defaults.withCredentials = true;
		
	  	$routeProvider
	  		.when('/', {
	  			templateUrl: "viewadmin/notices.html"
	  		})
	  		.when('/notices', {
	  			templateUrl: "viewadmin/notices.html"
	  		})
	  		.when('/noticecompose', {
	  			templateUrl: "viewadmin/noticecompose.html"
	  		})
	  		.when('/complaints', {
	  			templateUrl: "viewadmin/complaints.html"
	  		})
	  		//.when('/classifieds', {
	  			//templateUrl: "viewadmin/classifieds.html"
	  		//})
	  		.when('/contacts', {
	  			templateUrl: "viewadmin/contacts.html"
	  		})
	  		.when('/members', {
	  			templateUrl: "viewadmin/members.html"
	  		})
	  		/*.when('/polls', {
	  			templateUrl: "viewadmin/polls.html"
	  		})*/
	  		.when('/admins', {
	  			templateUrl: "viewadmin/admins.html"
	  		})
	  		.when('/rules', {
	  			templateUrl: "viewadmin/rules.html"
	  		})
	  		.when('/guide', {
	  			templateUrl: "viewadmin/guide.html"
	  		})
	  		.when('/profile', {
	  			templateUrl: "viewadmin/profile.html"
	  		})
	  		.when('/settings', {
	  			templateUrl: "viewadmin/settings.html"
	  		})
	  		.when('/switch', {
	  			controller : function(){
        			window.location.replace('/member#/');
    			},
    			template : "<div></div>"
	  		})
	  		.when('/becomemember', {
	  			templateUrl: "viewadmin/becomemember.html"
	  		})
	  		.when('/info', {
	  			templateUrl: "viewadmin/info.html"
	  		})
	  		.when('/reset', {
	  			templateUrl: "viewadmin/reset.html"
	  		})
	  		.when('/account', {
	  			templateUrl: "viewadmin/account.html"
	  		})
	  		.otherwise({
	  			redirectTo: '/notices'
	  		})
	  	}
	])
	.run(function($rootScope, $location, $document, $window, Admin, editableOptions) {

		authenticateAdmin();
		editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'

		var connected = false;
		const RETRY_INTERVAL = 10000;
		var timeout;

		function authenticateAdmin() {

			var socket;

			Admin.get({}).$promise.then(function(res) {
				console.log(res);
				if(res && res.status === 'suc' && res.message === 'authorised' && res.data) {

					var role;
					var user;

					if(res.data.role) {
						user = res.data;
					} else {
						user = res.data.user;
					}
					
					role = user.role;
					
					if(user.isremoved) {
						$window.location.href = HOST + '/others#/removed';
					} else if(user.isblocked) {
						$window.location.href = HOST + '/others#/blocked';
					} else {

						if(role == 5 || role == 6 || role == 7 || role == 8) {

							socket = window.io.connect(rootUrl);
							socket.emit('adminConnected', user);
							broadcastEvents(socket);
							$rootScope.$broadcast('bodyPageLoaderHide');
							
						} else {
							$window.location.href = HOST + '/app#/login';
						}
					}

				} else {
					$rootScope.$broadcast('bodyPageLoaderHide');
					$window.location.href = HOST + '/app#/login';
				}
			}, function(err) {
				console.log(err);
				$window.location.href = HOST + '/app#/login';
			});
		}

		var retryConnectOnFailure = function(retryInMilliseconds) {
			setTimeout(function() {
				if (!connected) {
					$.get(rootUrl + '/auth/ping', function(data) {
						connected = true;
						//$window.location.href = HOST + '/app#/login';
						//window.location.href = unescape(window.location.pathname);
					});
					retryConnectOnFailure(retryInMilliseconds);
				}
			}, retryInMilliseconds);
		}

		function broadcastEvents(socket) {

			socket.on('connect', function() {
				//connected = true;
				clearTimeout(timeout);
				console.log("<b>Connected to server.</b>");
			});

			socket.on('disconnect', function() {
			  connected = false;
			  console.log('disconnected');
			  console.log("<b>Disconnected! Trying to automatically to reconnect in " +
			                RETRY_INTERVAL/1000 + " seconds.</b>");
			  retryConnectOnFailure(RETRY_INTERVAL);
			});

			/* NOTICE */
			socket.on('noticeAdded', function (notice) {

	        	console.log('Notifier# noticeAdded');
	        	$rootScope.$broadcast('noticeAdded', notice);
	        	var alertMessage = {
					value: 'Notice Uploaded!',
					type: 'success'
				};
				$rootScope.$broadcast('showAlertBox', alertMessage);
				$rootScope.$broadcast('notificationCounter');
				$rootScope.$broadcast('newNotificationItem', 'Notice', 'A new notice has been posted.', notice);
	        });

	        socket.on('noticeRemoved', function (nid) {

	        	console.log('Notifier# noticeRemoved');
	        	$rootScope.$broadcast('noticeRemoved', nid);
	        	var alertMessage = {
					value: 'Notice Removed!',
					type: 'success'
				};
				$rootScope.$broadcast('showAlertBox', alertMessage);
	        });


			/* COMPLAINT */
			socket.on('complaintAdded', function (complaint) {

	        	console.log('Notifier# complaintAdded');
	        	$rootScope.$broadcast('complaintAdded', complaint);
	        	var message = {
					value: 'Complaint Registered!',
					type: 'success'
				};
				$rootScope.$broadcast('showAlertBox', message);
				$rootScope.$broadcast('notificationCounter');
				$rootScope.$broadcast('newNotificationItem', 'Complaint', 'A new complaint has been registered.', complaint);
	        });

	        socket.on('complaintStatusChanged', function (compid, status) {

	        	console.log('Notifier# complaintStatusChanged');
	        	$rootScope.$broadcast('complaintStatusChanged', compid, status);
	        	var alertMessage = {
					value: status,
					type: 'success'
				};
				$rootScope.$broadcast('showAlertBox', alertMessage);
				$rootScope.$broadcast('notificationCounter');
				$rootScope.$broadcast('newNotificationItem', 'Complaint', 'Complaint status has been changed.', compid);
	        });

	        socket.on('complaintRemovedByMember', function (compid) {

	        	console.log('Notifier# complaintRemovedByMember');
	        	$rootScope.$broadcast('complaintRemovedByMember', compid);
	        	var alertMessage = {
					value: "Removed by Member",
					type: 'success'
				};
				$rootScope.$broadcast('showAlertBox', alertMessage);
				$rootScope.$broadcast('notificationCounter');
				$rootScope.$broadcast('newNotificationItem', 'Complaint', 'Complaint removed by member.', compid);
	        });

	        socket.on('complaintRemovedByAdmin', function (complaint) {

	        	console.log('Notifier# complaintRemovedByAdmin');
	        	$rootScope.$broadcast('complaintRemovedByAdmin', complaint);
	        	var alertMessage = {
					value: 'Complaint Removed',
					type: 'success'
				};
				$rootScope.$broadcast('showAlertBox', alertMessage);
				$rootScope.$broadcast('newNotificationItem', 'Complaint', 'Complaint removed by admin.', complaint);
	        });
	        

	        /* CLASSIFIED */
	        socket.on('classifiedAdded', function (classified) {

	        	console.log('Notifier# classifiedAdded');
	        	$rootScope.$broadcast('classifiedAdded', classified);
	        });

	        /* MEMBER */
	        socket.on('memberAdded', function (user) {

	        	console.log('Notifier# memberAdded');
	        	console.log(user);
	        	$rootScope.$broadcast('notificationCounter');
	        	$rootScope.$broadcast('newNotificationItem', 'Member', (user.name || user.email) + ' has joined.', user);
	        });
	        
	        socket.on('familyMemberReported', function (reportuid) {

	        	console.log('Notifier# familyMemberReported');
	        	$rootScope.$broadcast('familyMemberReported', reportuid);
	        	var alertMessage = {
					value: 'Member Reported',
					type: 'success'
				};
				$rootScope.$broadcast('showAlertBox', alertMessage);	
	        });

	        socket.on('memberRemovedByAdmin', function (uid) {

	        	console.log('Notifier# memberRemovedByAdmin');
	        	$rootScope.$broadcast('memberRemovedByAdmin', uid);
	        	var alertMessage = {
					value: 'Member Removed!',
					type: 'success'
				};
				$rootScope.$broadcast('showAlertBox', alertMessage);
	        });

	        socket.on('memberBlockedByAdmin', function (uid) {

	        	console.log('Notifier# memberBlockedByAdmin');
	        	$rootScope.$broadcast('memberBlockedByAdmin', uid);
	        	var alertMessage = {
					value: 'Member Blocked!',
					type: 'success'
				};
				$rootScope.$broadcast('showAlertBox', alertMessage);
	        });

	        socket.on('memberUnblockedByAdmin', function (uid) {

	        	console.log('Notifier# memberUnblockedByAdmin');
	        	$rootScope.$broadcast('memberUnblockedByAdmin', uid);
	        	var alertMessage = {
					value: 'Member Unblocked!',
					type: 'success'
				};
				$rootScope.$broadcast('showAlertBox', alertMessage);
	        });

	        socket.on('memberCleanedByAdmin', function (uid) {

	        	console.log('Notifier# memberCleanedByAdmin');
	        	$rootScope.$broadcast('memberCleanedByAdmin', uid);
	        	var alertMessage = {
					value: 'Member Cleaned',
					type: 'success'
				};
				$rootScope.$broadcast('showAlertBox', alertMessage);
	        });

	    }

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

adminApp
	.directive('file', function() {
		
	return {
		restrict: 'AE',
		scope: {
			file: '@'
		},
		link: function(scope, el, attrs) {
			el.bind('change', function(event) {
				var files = event.target.files;
				var file = files[0];
				scope.file = file;
				scope.$parent.file = file;
				scope.$apply();
			});
		}
	};
});