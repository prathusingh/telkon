'use strict';

var memberApp = angular.module('memberApp', [
  'ngRoute',
  'ngResource',
  'ngSanitize',
  'xeditable',
  'infinite-scroll',
  'angularFileUpload',
  'ngEmbed',
  'ngImgCrop'
]);

memberApp
	.config(['$routeProvider', '$httpProvider',
		function($routeProvider, $httpProvider) {

		$httpProvider.defaults.withCredentials = true;
		
	  	$routeProvider
	  		.when('/notices', {
	  			templateUrl: "viewmember/notices.html"
	  		})
	  		.when('/complaints', {
	  			templateUrl: "viewmember/complaints.html"
	  		})
	  		.when('/classifieds', {
	  			templateUrl: "viewmember/classifieds.html"
	  		})
	  		.when('/contacts', {
	  			templateUrl: "viewmember/contacts.html"
	  		})
	  		.when('/forums', {
	  			templateUrl: "viewmember/forums.html"
	  		})
	  		.when('/forumpage/:fid', {
	  			templateUrl: "viewmember/forumpage.html"
	  		})
	  		.when('/clubs', {
	  			templateUrl: "viewmember/clubs.html"
	  		})
	  		.when('/clubpage/:clubid', {
	  			templateUrl: "viewmember/clubpage.html"
	  		})
	  		.when('/clubpost/:clubpostid', {
	  			templateUrl: "viewmember/clubpostpage.html"
	  		})
	  		.when('/clubmembers/:clubid', {
	  			templateUrl: "viewmember/clubmembers.html"
	  		})
	  		.when('/user/:userid', {
	  			templateUrl: "viewmember/userpage.html"
	  		})
	  		.when('/society/:societyid', {
	  			templateUrl: "viewmember/societypage.html"
	  		})
	  		.when('/family', {
	  			templateUrl: "viewmember/family.html"
	  		})
	  		.when('/members', {
	  			templateUrl: "viewmember/members.html"
	  		})
	  		.when('/societymembers/:socid', {
	  			templateUrl: "viewmember/societymembers.html"
	  		})
	  		.when('/myclassifieds', {
	  			templateUrl: "viewmember/myclassifieds.html"
	  		})
	  		.when('/myforums', {
	  			templateUrl: "viewmember/myforums.html"
	  		})
	  		.when('/myclubs', {
	  			templateUrl: "viewmember/myclubs.html"
	  		})
	  		.when('/savednotices', {
	  			templateUrl: "viewmember/savednotices.html"
	  		})
	  		.when('/savedclassifieds', {
	  			templateUrl: "viewmember/savedclassifieds.html"
	  		})
	  		.when('/comingsoon', {
	  			templateUrl: "viewmember/comingsoon.html"
	  		})
	  		.when('/rules', {
	  			templateUrl: "viewmember/rules.html"
	  		})
	  		.when('/guide', {
	  			templateUrl: "viewmember/guide.html"
	  		})
	  		.when('/profile', {
	  			templateUrl: "viewmember/profile.html"
	  		})
	  		.when('/info', {
	  			templateUrl: "viewmember/info.html"
	  		})
	  		.when('/settings', {
	  			templateUrl: "viewmember/settings.html"
	  		})
	  		.when('/switch', {
	  			controller : function(){
        			window.location.replace('/admin#/');
    			}, 
    			template : "<div></div>"
	  		})
	  		.when('/reset', {
	  			templateUrl: "viewmember/reset.html"
	  		})
	  		.when('/account', {
	  			templateUrl: "viewmember/account.html"
	  		})
	  		.otherwise({
	  			redirectTo: '/forums'
	  		})
	  	}
	])
	.run(function($rootScope, $location, $window, $timeout, Member, editableOptions) {

		authenicateMember();
		editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'

		var connected = false;
		const RETRY_INTERVAL = 10000;
		var timeout;

		function authenicateMember() {

			var socket;

			Member.get({}).$promise.then(function(res) {
				console.log(res);
				if(res && res.status === 'suc' && res.message === 'authorised' && res.data) {
					
					var user = res.data.user;

					if(user.isremoved) {
						$window.location.href = HOST + '/others#/removed';
					} else if(user.isblocked) {
						$window.location.href = HOST + '/others#/blocked';
					} else {
						
						var role = user.role;
						if(role == 4 || role == 7 || role == 8) {

							var society = res.data.society;
							socket = window.io.connect(rootUrl);
							socket.emit('memberConnected', user);
							broadcastEvents(socket, user);
							$rootScope.$broadcast('societySupportData', society);
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

		function broadcastEvents(socket, user) {

			socket.on('connect', function() {
				//connected = true;
				socket.emit('memberConnected', user);
				clearTimeout(timeout);
				console.log("<b>Connected to server.</b>");
			});

			socket.on('disconnect', function() {
			  connected = false;
			  console.log('Disconnected! Trying to automatically reconnect in ' +
			                RETRY_INTERVAL/1000 + ' seconds.');
			  retryConnectOnFailure(RETRY_INTERVAL);
			});


			/* NOTICE */
			socket.on('noticeAdded', function (notice) {

	        	console.log('Notifier# noticeAdded');
	        	$rootScope.$broadcast('noticeAdded', notice);
	        	var message = {
					value: 'New Notice',
					type: 'success'
				};
				$rootScope.$broadcast('showAlertBox', message);
				$rootScope.$broadcast('notificationCounter');
				$rootScope.$broadcast('newNotificationItem', 'Notice', 'A new notice has been posted.', notice);
	        });

			socket.on('noticeRemoved', function (nid) {

	        	console.log('Notifier# noticeRemoved');
	        	$rootScope.$broadcast('noticeRemoved', nid);
	        	var alertMessage = {
					value: 'Notice Removed',
					type: 'danger'
				};
				$rootScope.$broadcast('showAlertBox', alertMessage);
	        });

			/* COMPLAINT */
			socket.on('complaintAdded', function (complaint) {

	        	console.log('Notifier# complaintAdded');
	        	$rootScope.$broadcast('complaintAdded', complaint);
	        	var message = {
					value: 'Complaint Registered',
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
					value: 'Complaint Removed',
					type: 'success'
				};
				$rootScope.$broadcast('showAlertBox', alertMessage);
				$rootScope.$broadcast('newNotificationItem', 'Complaint', 'Complaint removed by member.', compid);
	        });

	        socket.on('complaintRemovedByAdmin', function (compid) {

	        	console.log('Notifier# complaintRemovedByAdmin');
	        	$rootScope.$broadcast('complaintRemovedByAdmin', compid);
	        	var alertMessage = {
					value: "Removed by Admin",
					type: 'danger'
				};
				$rootScope.$broadcast('showAlertBox', alertMessage);
				$rootScope.$broadcast('notificationCounter');
				$rootScope.$broadcast('newNotificationItem', 'Complaint', 'Complaint removed by admin.', compid);
	        });
	        

	        /* CLASSIFIED */
	        socket.on('classifiedAdded', function (classified) {

	        	console.log('Notifier# classifiedAdded');
	        	$rootScope.$broadcast('classifiedAdded', classified);
	        	var message = {
					value: 'Classified Posted',
					type: 'success'
				};
				$rootScope.$broadcast('showAlertBox', message);
				$rootScope.$broadcast('notificationCounter');
				$rootScope.$broadcast('newNotificationItem', 'Classified', 'A new classified has been posted', classified);
	        });

	        socket.on('classifiedRemoved', function (cid) {

	        	console.log('Notifier# classifiedRemoved');
	        	$rootScope.$broadcast('classifiedRemoved', cid);
	        });


	        /* FORUM */
	        socket.on('forumAdded', function (forum) {

	        	console.log('Notifier# forumAdded');
	        	$rootScope.$broadcast('forumAdded', forum);
	        	var message = {
					value: 'Forum Posted',
					type: 'success'
				};
				$rootScope.$broadcast('showAlertBox', message);
				$rootScope.$broadcast('notificationCounter');

				var t = '';
				if(forum.forumtype == 0) t='private';
				else if(forum.forumtype == 1) t='public';
				$rootScope.$broadcast('newNotificationItem', 'Forum', 'A new ' + t + ' forum has been posted.', forum);
	        });

	        socket.on('forumCommentAdded', function (fid, title, newComment) {

	        	console.log('Notifier# forumCommentAdded');

	        	var data = {};
	        	data.fid = fid;

	        	$rootScope.$broadcast('forumCommentAdded', fid, newComment);
	        	var message = {
					value: 'New Comment',
					type: 'success'
				};
				$rootScope.$broadcast('showAlertBox', message);
				$rootScope.$broadcast('notificationCounter');
				$rootScope.$broadcast('newNotificationItem', 'Forum', title + ' : New comment', data);
	        });

	        socket.on('forumRemoved', function (fid) {

	        	console.log('Notifier# forumRemoved');
	        	$rootScope.$broadcast('forumRemoved', fid);
	        	var message = {
					value: 'Forum Removed',
					type: 'success'
				};
				$rootScope.$broadcast('showAlertBox', message);

	        });

	        socket.on('forumCounter', function (fid) {

	        	console.log('Notifier# forumCounter');
	        	$rootScope.$broadcast('forumCounter', fid);
	        });

	        socket.on('forumEmoticonUpdate', function (fid, title, emotype) {

	        	console.log('Notifier# forumEmoticonUpdate');
	        	
	        	var data = {};
	        	data.fid = fid;
	        	$rootScope.$broadcast('forumEmoticonUpdate', fid, emotype);
	        	$rootScope.$broadcast('notificationCounter');
	        	$rootScope.$broadcast('newNotificationItem', 'Forum', title + ' : New emoticon', data);

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
					value: 'Member Removed',
					type: 'danger'
				};
				$rootScope.$broadcast('showAlertBox', alertMessage);
	        });

	        /* CLUB */
	        socket.on('clubAdded', function (club) {

	        	console.log('Notifier# clubAdded');
	        	$rootScope.$broadcast('clubAdded', club);
	        	var message = {
					value: 'New club created ',
					type: 'success'
				};
				$rootScope.$broadcast('showAlertBox', message);
				$rootScope.$broadcast('notificationCounter');

				var t = '';
				if(club.clubscope == 1) t='OPEN';
				else t='CLOSED';
				$rootScope.$broadcast('newNotificationItem', 'Club', club.name + ' : New ' + t + ' club', club);
				
	        });

	        socket.on('clubEventAdded', function (newEvent) {

	        	console.log('Notifier# clubEventAdded');
	        	$rootScope.$broadcast('clubEventAdded', newEvent);
	        	var message = {
					value: 'New event added ',
					type: 'success'
				};
				$rootScope.$broadcast('showAlertBox', message);
				//$rootScope.$broadcast('notificationCounter');
	        });

	        socket.on('clubPostAdded', function (post) {

	        	console.log('Notifier# clubPostAdded');
	        	$rootScope.$broadcast('clubPostAdded', post);
	        	var message = {
					value: 'New post added ',
					type: 'success'
				};
				$rootScope.$broadcast('showAlertBox', message);
				//$rootScope.$broadcast('notificationCounter');
	        });

	    }
	});


memberApp
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


memberApp
	.directive('siteHeader', function () {
    return {
        restrict: 'E',
        template: '<span class="fa fa-reply"></span>',
        scope: {
            back: '@back',
            /*forward: '@forward',*/
            icons: '@icons'
        },
        link: function(scope, element, attrs) {
            $(element[0]).on('click', function() {
                history.back();
                scope.$apply();
            });
            /*$(element[1]).on('click', function() {
                history.forward();
                scope.$apply();
            });*/
        }
    };
});


memberApp.
	directive('file', function() {
		
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