'use strict';

var memberApp = angular.module('memberApp');

memberApp
	.directive('stopEvent', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            element.bind('click', function (e) {
                e.stopPropagation();
            });
        }
    };
 });


memberApp
	.controller('ForumsCtrl', ['$rootScope', '$scope', '$timeout', '$window', 'MemberForum',
		function($rootScope, $scope, $timeout, $window, MemberForum) {


		/* Filter Options*/
		$scope.viewOptions = ["All", "Favorite", "Non Favorite", "Public", "Private"];
		$scope.selectedOption = $scope.viewOptions[0];

		/* Forum Data*/
		$scope.forums = [];
		$scope.forumsread = [];
		$scope.favoriteforums = [];
		$scope.forumsfeeling = [];
		$scope.forumsfeelingemo = [];
		$scope.pageLoading = false;
		$scope.errorCode = 0;
		$scope.searchText = '';
		$scope.recSkip = 0;
		$scope.isLoadingMore = false;
		$scope.isLoadCompleted = false;

		/* New Forum */
		$scope.title = '';
		$scope.newforum = {};
		$scope.newforum.title = '';
		$scope.newforum.details = '';
		$scope.newforum.forumtype = 1;
		$scope.addErr = 0;
		$scope.addMessage = '';
		$scope.isPosting = false;

		/* New Comment */
		$scope.obj = {};
		$scope.obj.newComment = '';

		$scope.refreshForums = function() {

			$scope.pageLoading = true;
			$scope.recSkip = 0;
			$scope.isLoadCompleted = false;
			$scope.searchText = '';

			populateForums(function(forums, forumsread, favoriteforums, forumsfeeling, forumsfeelingemo) {
			
				/*for(var i=0; i<forums.length; i++) {
					$scope.forums.push(forums);
				}*/
				$scope.forums = forums;
				$scope.forumsread = forumsread;
				$scope.favoriteforums = favoriteforums;
				$scope.forumsfeeling = forumsfeeling;
				$scope.forumsfeelingemo = forumsfeelingemo;
				$scope.changeShowOption($scope.selectedOption);
				$scope.pageLoading = false;

			});
		}

		$scope.searchForums = function() {

			$scope.pageLoading = true;
			$scope.recSkip = 0;
			$scope.isLoadCompleted = false;

			populateForums(function(forums, forumsread, favoriteforums, forumsfeeling, forumsfeelingemo) {
			
				$scope.forums = forums;
				$scope.forumsread = forumsread;
				$scope.favoriteforums = favoriteforums;
				$scope.forumsfeeling = forumsfeeling;
				$scope.forumsfeelingemo = forumsfeelingemo;
				$scope.changeShowOption($scope.selectedOption);
				$scope.pageLoading = false;

			});
		}

		$scope.clearForm = function() {
			$scope.obj.newComment = '';
			$scope.forumShowMsg = '';
			$scope.errorCode = 0;
			$scope.addMessage = '';
			$scope.commentMessage = '';
		}

		$scope.loadMore = function() {

			if($scope.isLoadCompleted) return;
			if($scope.isLoadingMore) return;

			$scope.recSkip++;
			console.log($scope.recSkip);
			$scope.isLoadingMore = true;

			populateForumsChunk(function(forums) {
			
				if(!forums || forums.length == 0) {
					$scope.isLoadCompleted = true;
				} else {
					for(var i=0; i<forums.length; i++) {
						$scope.forums.push(forums[i]);
					}
				}

				$scope.isLoadingMore = false;

			});
		}

		$scope.refreshForums();

		$scope.changeShowOption = function(newOption) {
			$scope.selectedOption = newOption;
		}

		$scope.navigateToUser = function(uid) {
			$window.location.href = HOST + '/member#/user/' + uid;
		}

		$scope.navigateToSociety = function(socid) {
			$window.location.href = HOST + '/member#/society/' + socid;
		}

		$scope.navigateToForum = function(fid) {
			$window.location.href = HOST + '/member#/forumpage/' + fid;	
		}

		$scope.markFavorite  = function(fid) {

			var data = {fid: fid};
			var index = $scope.favoriteforums.indexOf(fid);

			if(index == -1) {
				MemberForum.markFav({}, data).$promise.then(function(res) {
					console.log(res);
					if(res && res.status === 'suc' && res.message === 'marked') {
						$scope.favoriteforums.splice(index, 0, fid);
						var alertMessage = {
							value: SUC_FORUM_MARKED_FAV,
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

		$scope.unmarkFavorite  = function(fid) {

			var data = {fid: fid};
			var index = $scope.favoriteforums.indexOf(fid);

			if(index != -1) {

				MemberForum.unmarkFav({}, data).$promise.then(function(res) {
					console.log(res);
					if(res && res.status === 'suc' && res.message === 'unmarked') {
						$scope.favoriteforums.splice(index, 1);
						var alertMessage = {
							value: SUC_FORUM_MARKED_UNFAV,
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

		$scope.postEmoticon = function(fid, emotype) {

			var index = $scope.forumsfeeling.indexOf(fid);
			if(index == -1) {

				var data = {fid: fid, emotype: emotype};

				MemberForum.postEmoticon({}, data).$promise.then(function(res) {
					console.log(res);
					if(res && res.status === 'suc' && res.message === 'emoted') {

						$scope.forumsfeeling.splice($scope.forumsfeeling.length, 0, fid);
						$scope.forumsfeelingemo.splice($scope.forumsfeelingemo.length, 0, emotype);
						var alertMessage = {
							value: SUC_FORUM_EMOTED,
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

		$scope.postForum = function(forumtype) {

			$scope.addErr = 0;
			$scope.addMessage = '';
			$scope.isPosting = false;

			if(!$scope.newforum.title) {
				$scope.addErr = 1;
				$scope.addMessage = ERROR_FORUM_EMPTY_TITLE;
			} else if(!$scope.newforum.details) {
				$scope.addErr = 2;
				$scope.addMessage = ERROR_FORUM_EMPTY_DETAILS;
			} else {

				var data = {};
				data.title = $scope.newforum.title;
				data.details = $scope.newforum.details;
				data.forumtype = forumtype;
				$scope.isPosting = true;
				$scope.addErr = 0;
				$scope.addMessage = '';

				MemberForum.addNew({}, data).$promise.then(function(res) {
					console.log(res);
					if(res && res.status === 'suc' && res.message === 'added') {

						$scope.isPosting = false;
						$scope.newforum.title = '';
						$scope.newforum.details = '';
						$scope.addErr = 0;
						$scope.addMessage = SUC_FORUM_POSTED;

					} else {

						$scope.isPosting = false;
						$scope.addErr = -1;
						$scope.addMessage = ERROR_UNKNOWN;
					}
				}, function(err) {
					console.log(err);
					var message = getErrorVal(err);
					$scope.addMessage = message;
					$scope.addErr = -1;
					$scope.isPosting = false;

				});
			}
		}

		$scope.$on('forumAdded', function(event, forum) {

			console.log('Notifier# forumAdded - HANDLER');
			if(!forum.lastact) {
				forum.lastact = moment();
			}

			forum.lastact = moment(forum.lastact).fromNow();
			
			if(forum.byimagedp) {
				forum.byimagedp = AWS_URL.IMAGEDP + forum.byimagedp;	
			}
			
			
			if(forum.details && forum.details.length > 100) {
				forum.details = forum.details.substring(0, 100) + '...';
			}

	      	$scope.$apply(function() {
		        forum.new = true;
			    $scope.forums.unshift(forum);
			    
			});
	    });

		$scope.$on('forumCounter', function(event, fid) {

			console.log('Notifier# forumCounter - HANDLER');
			
	      	$scope.$apply(function() {

	      		if($scope.forumShow && $scope.forumShow.fid === fid) {
	      			$scope.forumShow.totalviews++;
	      		}

	      		var f;
				for(var i=0; i<$scope.forums.length; i++) {

					f = $scope.forums[i];
		      		if(f.fid === fid) {
		      			f.totalviews++;
		      			break;
		      		}
		      	}
		    });
	    });

		$scope.$on('forumEmoticonUpdate', function(event, fid, emotype) {

			console.log('Notifier# forumEmoticonUpdate - HANDLER');
			
	      	$scope.$apply(function() {

	      		if($scope.forumShow && 
	      			$scope.forumShow.fid === fid) {

	      			if(emotype == 1) $scope.forumShow.emo.laugh++;
	      			else if(emotype == 2) $scope.forumShow.emo.tongue++;
	      			else if(emotype == 3) $scope.forumShow.emo.love++;
	      			else if(emotype == 4) $scope.forumShow.emo.confused++;
	      			else if(emotype == 5) $scope.forumShow.emo.angry++;
	   				else if(emotype == 6) $scope.forumShow.emo.evil++;
	      		}

	      		var f;
	      		for(var i=0; i<$scope.forums.length; i++) {

	      			f = $scope.forums[i];
	      			if(f.fid === fid) {

	      				if(emotype == 1) f.emo.laugh++;
	      				else if(emotype == 2) f.emo.tongue++;
	      				else if(emotype == 3) f.emo.love++;
	      				else if(emotype == 4) f.emo.confused++;
	      				else if(emotype == 5) f.emo.angry++;
	      				else if(emotype == 6) f.emo.evil++;
						//f.lastact = moment().fromNow();
	      				f.new = true;
	      				//$scope.forums.splice(i, 1);
	      				//$scope.forums.unshift(f);
	      				break;
	      			}
	      		}
			});
	    });

		$scope.$on('forumRemoved', function(event, fid) {

			console.log('Notifier# forumRemoved - HANDLER');
			
			var forum;
	      	$scope.$apply(function() {
				
				for(var i=0 ; i<$scope.forums.length ; i++) {

					forum = $scope.forums[i];
					if(forum.fid === fid) {
						$scope.forums.splice(i, 1);
						break;
					}
				}
			});
	    });

		function populateForums(callback) {

			var forums = [];
			var forumsread = [];
			var favoriteforums = [];
			var forumsfeeling = [];
			var forumsfeelingemo = [];

			var data = {search: $scope.searchText};

			console.log(data);
			MemberForum.getAll({}, data).$promise.then(function(res) {
				console.log(res);

				if(res && res.status === 'suc' && res.data) {

					forums = res.data.forums;
					forumsread = res.data.forumsread;
					favoriteforums = res.data.favoriteforums;
					forumsfeeling = res.data.forumsfeeling;
					forumsfeelingemo = res.data.forumsfeelingemo;

					if(forums) {

						for(var i=0 ; i<forums.length ; i++) {

                      		if(forums[i].lastact) {
        	           			forums[i].lastact = moment(forums[i].lastact).fromNow();
                      		}
                      		if(forums[i].byimagedp) {
                      			forums[i].byimagedp = AWS_URL.IMAGEDP + forums[i].byimagedp;
                      		}

                      		if(forums[i].details && forums[i].details.length > 100) {
								forums[i].details = forums[i].details.substring(0, 100) + '...';
							}
                  		}
					}
					callback(forums, forumsread, favoriteforums, forumsfeeling, forumsfeelingemo);
				} else {

					callback(forums, forumsread, favoriteforums, forumsfeeling, forumsfeelingemo);
					var alertMessage = {
						value: ERROR_UNKNOWN,
						type: 'danger'
					};
					$rootScope.$broadcast('showAlertBox', alertMessage);
				}

			}, function(err) {
				var message = getErrorVal(err);
				callback(forums, forumsread, favoriteforums, forumsfeeling, forumsfeelingemo);
				var alertMessage = {
					value: message,
					type: 'danger'
				};
				$rootScope.$broadcast('showAlertBox', alertMessage);

			});
		}

		function populateForumsChunk(callback) {

			var forums = [];

			var data = {recSkip: $scope.recSkip, search: $scope.searchText};

			console.log(data);
			MemberForum.getChunk({}, data).$promise.then(function(res) {
				console.log(res);

				if(res && res.status === 'suc') {

					forums = res.data;

					if(forums) {

						for(var i=0 ; i<forums.length ; i++) {
                   			/*if(forums[i].createdat) {
        	           			forums[i].createdat = moment(forums[i].createdat).format("DD MMM YYYY");
                      		}*/
                      		if(forums[i].lastact) {
        	           			forums[i].lastact = moment(forums[i].lastact).fromNow();
                      		}
                      		if(forums[i].byimagedp) {
                      			forums[i].byimagedp = AWS_URL.IMAGEDP + forums[i].byimagedp;
                      		}
                      		if(forums[i].details && forums[i].details.length > 100) {
								forums[i].details = forums[i].details.substring(0, 100) + '...';
							}
                  		}
					}
					callback(forums);
				} else {
					callback(forums);
					var alertMessage = {
						value: ERROR_UNKNOWN,
						type: 'danger'
					};
					$rootScope.$broadcast('showAlertBox', alertMessage);
				}

			}, function(err) {
				var message = getErrorVal(err);
				callback(forums);
				var alertMessage = {
					value: message,
					type: 'danger'
				};
				$rootScope.$broadcast('showAlertBox', alertMessage);

			});
		}
	}]);


memberApp
	.controller('ForumPageCtrl', ['$rootScope', '$scope', '$timeout', '$window', '$routeParams', 'MemberForum',
		function($rootScope, $scope, $timeout, $window, $routeParams, MemberForum) {

		/* Forum */
		$scope.fid = $routeParams.fid;
		$scope.forum = {};
		$scope.pageLoading = false;
		$scope.forumShowMsg = '';
		$scope.errorCode = 0;

		/* User-specific info */
		$scope.userinfo = {};

		/* Comments */
		$scope.comments = [];
		$scope.recSkipComments = 0;
		$scope.isLoadingMoreComments = false;
		$scope.isLoadCompletedComments = false;
		
		/* New comment */
		$scope.newComment = {};
		$scope.newComment.val = '';
		$scope.newComment.msg = '';
		$scope.newComment.ecode = 1;
		$scope.newComment.isCommenting = false;

		$scope.dataShowMsg = '';
		$scope.dataShowErr = 0;

		
		$scope.refreshPage = function() {

			$scope.pageLoading = true;

			populateForum(function(forum, userinfo) {
			
				$scope.forum = forum;
				$scope.userinfo = userinfo;
				$scope.pageLoading = false;

			});
		}

		$scope.refreshPage();

		$scope.loadComments = function(fid) {

			if ($scope.isLoadCompletedComments) return;
			if ($scope.isLoadingMoreComments) return;
			
			$scope.isLoadingMoreComments = true;
			loadMoreComments(fid, function(comments) {

				$scope.recSkipComments++;
				$scope.isLoadingMoreComments = false;

				if(!comments || comments.length == 0) {
					$scope.isLoadCompletedComments = true;
				} else {
					if($scope.comments) {
						for(var i=0; i<comments.length; i++) {
							$scope.comments.unshift(comments[i]);
						}
					}
				}
			});
		}

		$scope.navigateToUser = function(uid) {
			$window.location.href = HOST + '/member#/user/' + uid;
		}

		$scope.navigateToSociety = function(socid) {
			$window.location.href = HOST + '/member#/society/' + socid;
		}

		$scope.markFavorite  = function(fid) {

			var data = {fid: fid};
			var index = $scope.favoriteforums.indexOf(fid);

			if(index == -1) {
				MemberForum.markFav({}, data).$promise.then(function(res) {
					console.log(res);
					if(res && res.status === 'suc' && res.message === 'marked') {
						$scope.favoriteforums.splice(index, 0, fid);
						var alertMessage = {
							value: SUC_FORUM_MARKED_FAV,
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

		$scope.unmarkFavorite  = function(fid) {

			var data = {fid: fid};
			var index = $scope.favoriteforums.indexOf(fid);

			if(index != -1) {

				MemberForum.unmarkFav({}, data).$promise.then(function(res) {
					console.log(res);
					if(res && res.status === 'suc' && res.message === 'unmarked') {
						$scope.favoriteforums.splice(index, 1);
						var alertMessage = {
							value: SUC_FORUM_MARKED_UNFAV,
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

		$scope.postEmoticon = function(fid, emotype) {

			if(!$scope.userinfo.hasEmoted) {

				var data = {fid: fid, emotype: emotype};

				MemberForum.postEmoticon({}, data).$promise.then(function(res) {
					console.log(res);
					if(res && res.status === 'suc' && res.message === 'emoted') {

						//$scope.forumsfeeling.splice($scope.forumsfeeling.length, 0, fid);
						//$scope.forumsfeelingemo.splice($scope.forumsfeelingemo.length, 0, emotype);
						$scope.userinfo.emo = emotype;
						$scope.userinfo.hasEmoted = true;
						var alertMessage = {
							value: SUC_FORUM_EMOTED,
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

	    $scope.$on('forumCommentAdded', function(event, fid, newComment) {

			console.log('Notifier# forumCommentAdded - HANDLER');
			
			if($scope.forum.fid === fid) {

				$scope.$apply(function() {

		      		if(newComment.byimagedp) {
		      			newComment.byimagedp = AWS_URL.IMAGEDP + newComment.byimagedp;
		      		}

		      		if(newComment.date) {
		      			newComment.date = moment(newComment.date).fromNow();
		      		} else {
		     			newComment.date = moment().fromNow();
		     		}

		      		if($scope.forum.totalcomments) {
		      			$scope.forum.totalcomments++;
		      		}

		      		$scope.comments.push(newComment);
		
				});
			}
	    });

		$scope.$on('forumEmoticonUpdate', function(event, fid, emotype) {

			console.log('Notifier# forumEmoticonUpdate - HANDLER');
			
	      	$scope.$apply(function() {

	      		if($scope.forum && 
	      			$scope.forum.fid === fid) {

	      			if(emotype == 1) $scope.forum.emo.laugh++;
	      			else if(emotype == 2) $scope.forum.emo.tongue++;
	      			else if(emotype == 3) $scope.forum.emo.love++;
	      			else if(emotype == 4) $scope.forum.emo.confused++;
	      			else if(emotype == 5) $scope.forum.emo.angry++;
	   				else if(emotype == 6) $scope.forum.emo.evil++;
	      		}
			});
	    });

		$scope.$on('forumRemoved', function(event, fid) {

			console.log('Notifier# forumRemoved - HANDLER');
			
			var forum;
	      	$scope.$apply(function() {
				
				for(var i=0 ; i<$scope.forums.length ; i++) {

					forum = $scope.forums[i];
					if(forum.fid === fid) {
						$scope.forums.splice(i, 1);
						break;
					}
				}
			});
	    });

		function loadMoreComments(fid, callback) {

			var data = [];
			var comments = [];
			var data = {fid: fid, recSkip: $scope.recSkipComments};

			console.log($scope.recSkipComments);
			MemberForum.getCommentsChunk({}, data).$promise.then(function(res) {
				console.log(res);
				if(res && res.status === 'suc' && res.data) {

					data = res.data;
					if(data) {

						var c={};
						for(var i=0 ; i<data.length ; i++) {

							c = data[i].comments;

							if(c) {
								if(c.date) {
									//if(moment(c.date).duration().subtract())
									//c.date = moment.duration().subtract(3, 'd');
									c.date = moment(c.date).fromNow();
									//c.date = moment(c.date).format('DD MMM YYYY - HH:MM:ss')	
								}
								if(c.value) {
									c.value = c.value.replace(/(\r\n|\r|\n)/g, '\n');	
								}
								if(c.byimagedp) {
									c.byimagedp = AWS_URL.IMAGEDP + c.byimagedp;
								}
								comments.push(c);
							}
						}
					}
					callback(comments);

				} else {

					callback(comments);
					console.log("Bad Request");
				}

			}, function(err) {
				console.log(err);
				callback(comments);
			});
		}

		$scope.postComment = function(fid, opinion) {

			$scope.newComment.isCommenting = true;
			$scope.newComment.msg = '';
			$scope.newComment.ecode = 0;

			if(!$scope.newComment.val) {

				$scope.newComment.msg = ERROR_FORUM_EMPTY_NEW_COMMENT;
				$scope.newComment.ecode = 1;
				$scope.newComment.isCommenting = false;

			} else {

				var data = {fid: fid, value: $scope.newComment.val, opinion: opinion};
				MemberForum.postComment({}, data).$promise.then(function(res) {
					console.log(res);
					if(res && res.status === 'suc' && res.message === 'commented') {
						$scope.newComment.val = '';
					} else {
						$scope.newComment.msg = ERROR_UNKNOWN;
						$scope.newComment.ecode = -1;
					}
					$scope.newComment.isCommenting = false;

				}, function(err) {
					var message = getErrorVal(err);
					$scope.newComment.ecode = -1;
					$scope.newComment.msg = message;
					$scope.newComment.isCommenting = false;
				});

			}
		}

		function populateForum(callback) {

			var forum = {};
			var userinfo = {};

			var data = {fid: $scope.fid, count: true};

			MemberForum.getOne({}, data).$promise.then(function(res) {
				console.log(res);
				if(res && res.status === 'suc') {
						
					forum = res.data.forum;
					userinfo = res.data.userinfo;

					if(forum) {

						forum.comments = [];
						$scope.loadComments(forum.fid);

						forum.createdat = moment(forum).format(MOMENT_DISPLAY_DATE);

						if(!forum.lastact) {
							forum.lastact = moment().fromNow();
						} else {
							forum.lastact = moment(forum).fromNow();
						}

						if(forum.byimagedp) {
							forum.byimagedp = AWS_URL.IMAGEDP + forum.byimagedp;
						}

						if(forum.details) {
							forum.details = forum.details.replace(/(\r\n|\r|\n)/g, '\n');
						}

					} else {
						$scope.dataShowMsg = ERROR_DATA_NOT_FOUND;
						$scope.dataShowErr = -1;
					}

					callback(forum, userinfo);
				} else {
					$scope.dataShowMsg = ERROR_UNKNOWN;
					$scope.dataShowErr = -1;
				}
				callback(forum, userinfo);
				$scope.dataLoading = false;

			}, function(err) {
				var message = getErrorVal(err);
				callback(forum, userinfo);
				$scope.dataShowMsg = message;
				$scope.dataShowErr = -1;
				$scope.dataLoading = false;
			});
		}
}]);


memberApp
	.controller('MyForumsCtrl', ['$rootScope', '$scope', '$timeout', 'MemberForum',
		function($rootScope, $scope, $timeout, MemberForum) {

		$scope.myforums = [];
		$scope.forumsread = [];
		$scope.favoriteforums = [];
		$scope.forumsfeeling = [];
		$scope.forumsfeelingemo = [];
		$scope.myForumShow = {};
		$scope.myForumShow.comments = [];
		$scope.pageLoading = false;
		$scope.dataLoading = false;
		$scope.obj = {};
		$scope.obj.newComment = '';
		$scope.commentErr = 0;
		$scope.isCommenting = false;
		$scope.commentMessage = '';
		$scope.errorCode = 0;
		$scope.myForumShow = {};
		$scope.myForumShowMessage = '';
		$scope.commentMessage = '';
		$scope.recSkipComments = 0;
		$scope.isLoadingMoreComments = false;
		$scope.isLoadCompletedComments = false;
		$scope.dataShowMsg = '';
		$scope.dataShowErr = 0;
		$scope.commentErr = 0;


		$scope.refreshMyForums = function() {

			$scope.pageLoading = true;
			populateMyForums(function(forums, forumsread, favoriteforums, forumsfeeling, forumsfeelingemo) {
				
				$scope.myforums = forums;
				$scope.forumsread = forumsread;
				$scope.favoriteforums = favoriteforums;
				$scope.forumsfeeling = forumsfeeling;
				$scope.forumsfeelingemo = forumsfeelingemo;
				$scope.pageLoading = false;
			});
		}

		$scope.refreshMyForums();

		$scope.clickMyForum = function(forum) {

			var fid = forum.fid;
			$scope.myForumShowMessage = '';
			$scope.myForumShow = {};
			$scope.dataLoading = true;
			$scope.commentMessage = '';
			$scope.errorCode = 0;
			$scope.recSkipComments = 0;
			$scope.isLoadCompletedComments = false;
			$scope.dataShowMsg = '';
			$scope.dataShowErr = 0;
			
			if(forum.new) {
				$timeout(function() {
			    	delete forum.new;
		    	}, 2000);
			}

			var data = {fid: fid, count: true};

			MemberForum.getMyForumOne({}, data).$promise.then(function(res) {
				console.log(res);

				if(res && res.status === 'suc') {
						
					$scope.myForumShow = res.data;
					if($scope.myForumShow) {

						$scope.myForumShow.comments = [];
						$scope.loadComments($scope.myForumShow.fid);

						$scope.myForumShow.createdat = moment($scope.myForumShow).format(MOMENT_DISPLAY_DATE);

						if(!$scope.myForumShow.lastact) {
							$scope.myForumShow.lastact = moment().fromNow();
						} else {
							$scope.myForumShow.lastact = moment($scope.myForumShow).fromNow();
						}

						if($scope.myForumShow.byimagedp) {
							$scope.myForumShow.byimagedp = AWS_URL.IMAGEDP + $scope.myForumShow.byimagedp;
						}

						if($scope.myForumShow.details) {
							$scope.myForumShow.details = $scope.myForumShow.details.replace(/(\r\n|\r|\n)/g, '\n');
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
				var message = getErrorVal(err);
				$scope.dataShowMsg = message;
				$scope.dataShowErr = -1;
				$scope.dataLoading = false;
			});
		}

		$scope.loadComments = function(fid) {

			if ($scope.isLoadCompletedComments) return;
			if ($scope.isLoadingMoreComments) return;
			
			$scope.isLoadingMoreComments = true;
			loadMoreComments(fid, function(comments) {

				$scope.recSkipComments++;
				$scope.isLoadingMoreComments = false;

				if(!comments || comments.length == 0) {
					$scope.isLoadCompletedComments = true;
				} else {
					if($scope.myForumShow && $scope.myForumShow.comments) {
						for(var i=0; i<comments.length; i++) {
							$scope.myForumShow.comments.unshift(comments[i]);
						}
					}
				}
			});
		}

		function loadMoreComments(fid, callback) {

			var resp = [];
			var comments = [];
			var data = {fid: fid, recSkip: $scope.recSkipComments};

			console.log($scope.recSkipComments);
			MemberForum.getMyForumCommentsChunk({}, data).$promise.then(function(res) {
				console.log(res);
				if(res && res.status === 'suc' && res.data) {

					resp = res.data;
					if(resp) {

						var c={};
						for(var i=0 ; i<resp.length ; i++) {

							c = resp[i].comments;

							if(c) {
								if(c.date) {
									//if(moment(c.date).duration().subtract())
									//c.date = moment.duration().subtract(3, 'd');
									c.date = moment(c.date).fromNow();
									//c.date = moment(c.date).format('DD MMM YYYY - HH:MM:ss')	
								}
								if(c.value) {
									c.value = c.value.replace(/(\r\n|\r|\n)/g, '\n');	
								}
								if(c.byimagedp) {
									c.byimagedp = AWS_URL.IMAGEDP + c.byimagedp;
								}
								comments.push(c);
							}
						}
					}
					callback(comments);

				} else {

					callback(comments);
					console.log("Bad Request");
				}

			}, function(err) {
				console.log(err);
				callback(comments);
			});

		}

		$scope.removeForum = function(fid) {

			bootbox.confirm("Are you sure?", function(result) {
  				if(result) {
					var data = {fid: fid};
					MemberForum.markMyForumRemove({}, data).$promise.then(function(res) {

						console.log(res);
						if(res && res.status === 'suc' && res.message === 'removed') {

							var alertMessage = {
								value: SUC_MYFORUMS_REMOVED,
								type: 'success'
							};

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

		function updateMyForumShow(fid, count, callback) {

			var myForumShow = {};
			var data = {fid: fid, count: count};
			MemberForum.getMyForumOne({}, data).$promise.then(function(res) {
				console.log(res);
				if(res && res.status === 'suc' && res.data) {
						
					$scope.dataLoading = false;
					myForumShow = res.data;

					if(myForumShow.createdat) {
						myForumShow.createdat = moment(myForumShow.createdat).format("DD MMM YYYY");	
					}

					if(!myForumShow.lastact) {
						myForumShow.lastact = moment().fromNow();
					}

					if(myForumShow.details) {
						myForumShow.details = myForumShow.details.replace(/(\r\n|\r|\n)/g, '\n');
					}

					if(myForumShow.byimagedp) {
						myForumShow.byimagedp = AWS_URL.IMAGEDP + myForumShow.byimagedp;
					}

					if(myForumShow.comments) {
						for(var i=0 ; i<myForumShow.comments.length ; i++) {
							myForumShow.comments[i].date = moment(myForumShow.comments[i].date).fromNow();
							myForumShow.comments[i].value = myForumShow.comments[i].value.replace(/(\r\n|\r|\n)/g, '\n');
							myForumShow.comments[i].byimagedp = AWS_URL.IMAGEDP + myForumShow.comments[i].byimagedp;
						}
					}
					myForumShow.totalcomments = i+1;
					callback(myForumShow);

				} else {

					callback(myForumShow);
					console.log("Bad Request");
				}

			}, function(err) {
				console.log(err);
				callback(myForumShow);
			});
		}


		$scope.postComment = function(fid, opinion) {

			$scope.isCommenting = true;
			$scope.commentMessage = '';
			$scope.commentErr = 0;

			if(!$scope.obj.newComment) {

				$scope.commentMessage = ERROR_FORUM_EMPTY_NEW_COMMENT;
				$scope.commentErr = 1;
				$scope.isCommenting = false;

			} else {

				var data = {fid: fid, value: $scope.obj.newComment, opinion: opinion};
				MemberForum.postComment({}, data).$promise.then(function(res) {
					console.log(res);
					if(res && res.status === 'suc' && res.message === 'commented') {
						$scope.obj.newComment = '';
					} else {
						$scope.commentMessage = ERROR_UNKNOWN;
						$scope.commentErr = -1;
					}
					$scope.isCommenting = false;

				}, function(err) {
					var message = getErrorVal(err);
					$scope.commentErr = -1;
					$scope.commentMessage = message;
					$scope.isCommenting = false;
				});

			}
		}

		$scope.postEmoticon = function(fid, emotype) {

			var index = $scope.forumsfeeling.indexOf(fid);
			if(index == -1) {

				var data = {fid: fid, emotype: emotype};

				console.log(data);
				MemberForum.postEmoticon({}, data).$promise.then(function(res) {
					console.log(res);
					if(res && res.status === 'suc' && res.message === 'emoted') {

						$scope.forumsfeeling.splice($scope.forumsfeeling.length, 0, fid);
						$scope.forumsfeelingemo.splice($scope.forumsfeelingemo.length, 0, emotype);
						var alertMessage = {
							value: SUC_FORUM_EMOTED,
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


		$scope.$on('forumCommentAdded', function(event, fid, newComment) {

			console.log('Notifier# forumCommentAdded - HANDLER');
			
	      	$scope.$apply(function() {

	      		if($scope.myForumShow && $scope.myForumShow.fid === fid) {

	      			if(newComment.byimagedp) {
	      				newComment.byimagedp = AWS_URL.IMAGEDP + newComment.byimagedp;
	      			}

	      			if(newComment.date) {
	      				newComment.date = moment(newComment.date).fromNow();
	      			} else {
	      				newComment.date = moment().fromNow();
	      			}

	      			if(!$scope.myForumShow.newComments) {
	      				$scope.myForumShow.newComments = [];
	      			}

	      			if($scope.myForumShow.totalcomments) {
	      				$scope.myForumShow.totalcomments++;
	      			}

	      			$scope.myForumShow.comments.push(newComment);
	      		}

	      		var f;
	      		for(var i=0; i<$scope.myforums.length; i++) {

		      		f = $scope.myforums[i];
		      		if(f.fid === fid) {

						f.lastact = moment().fromNow();
		      			f.totalcomments++;
		      			f.new = true;
		      			$scope.myforums.splice(i, 1);
		      			$scope.myforums.unshift(f);
		      			break;
		      		}
		      	}
			});
	    });


		$scope.$on('forumEmoticonUpdate', function(event, fid, emotype) {

			console.log('Notifier# forumEmoticonUpdate - HANDLER');
			
	      	$scope.$apply(function() {

	      		if($scope.myForumShow && 
	      			$scope.myForumShow.fid === fid) {

	      			if(emotype == 1) $scope.myForumShow.emo.laugh++;
	      			else if(emotype == 2) $scope.myForumShow.emo.tongue++;
	      			else if(emotype == 3) $scope.myForumShow.emo.love++;
	      			else if(emotype == 4) $scope.myForumShow.emo.confused++;
	      			else if(emotype == 5) $scope.myForumShow.emo.angry++;
	   				else if(emotype == 6) $scope.myForumShow.emo.evil++;
	      		}

			});
	    });

		$scope.$on('forumRemoved', function(event, fid) {

			console.log('Notifier# forumRemoved - HANDLER');
			
			var forum;
	      	$scope.$apply(function() {
				
				for(var i=0 ; i<$scope.myforums.length ; i++) {

					forum = $scope.myforums[i];
					if(forum.fid === fid) {
						$scope.myforums.splice(i, 1);
						break;
					}
				}
			});
	    });


		$scope.$on('forumCounter', function(event, fid) {

			console.log('Notifier# forumCounter - HANDLER');
			
	      	$scope.$apply(function() {

	      		if($scope.myForumShow && $scope.myForumShow.fid === fid) {
	      			$scope.myForumShow.totalviews++;
	      		}

	      		var f;
				for(var i=0; i<$scope.myforums.length; i++) {

					f = $scope.myforums[i];
		      		if(f.fid === fid) {
		      			f.totalviews++;
		      			break;
		      		}
		      	}
		    });
	    });


		function populateMyForums(callback) {

			var forums = [];
			var forumsread = [];
			var favoriteforums = [];
			var forumsfeeling = [];
			var forumsfeelingemo = [];

			MemberForum.getMyForums({},{}).$promise.then(function(res) {
				console.log(res);
				if(res && res.status === 'suc' && res.data) {

					forums = res.data.forums;
					forumsread = res.data.forumsread;
					favoriteforums = res.data.favoriteforums;
					forumsfeeling = res.data.forumsfeeling;
					forumsfeelingemo = res.data.forumsfeelingemo;

					for(var i=0 ; i<forums.length ; i++) {

						if(forums[i].createdat) {
        	       			forums[i].createdat = moment(forums[i].createdat).format('DD MMM YYYY');
                   		}

						if(forums[i].lastact) {
        	       			forums[i].lastact = moment(forums[i].lastact).fromNow();
                   		}
                  	}
					callback(forums, forumsread, favoriteforums, forumsfeeling, forumsfeelingemo);
				
				} else {

					callback(forums, forumsread, favoriteforums, forumsfeeling, forumsfeelingemo);
					var alertMessage = {
						value: ERROR_UNKNOWN,
						type: 'danger'
					};
					$rootScope.$broadcast('showAlertBox', alertMessage);
				}

			}, function(err) {
				var message = getErrorVal(err);
				callback(forums, forumsread, favoriteforums, forumsfeeling, forumsfeelingemo);
				var alertMessage = {
					value: message,
					type: 'danger'
				};
				$rootScope.$broadcast('showAlertBox', alertMessage);
			});
		}
	}]);


memberApp
	.filter('selectedOptionFilterForums', function () {
  		return function (items, scope) {
  			
  			var filtered = [];

  			if(scope.selectedOption === scope.viewOptions[0]) {
  				filtered = items;
  			} else {
  				angular.forEach(items, function(item) {
	  				if(scope.selectedOption === scope.viewOptions[1]) {
	  					if(scope.favoriteforums.indexOf(item.fid) != -1) {
	  						filtered.push(item);
	  					}
	  				} else if(scope.selectedOption === scope.viewOptions[2]) {
	  					if(scope.favoriteforums.indexOf(item.fid) == -1) {
	  						filtered.push(item);
	  					}
	  				} else if(scope.selectedOption === scope.viewOptions[3]) {
	  					if(item.forumtype == 1) {
	  						filtered.push(item);
	  					}
	  				} else if(scope.selectedOption === scope.viewOptions[4]) {
	  					if(item.forumtype == 0) {
	  						filtered.push(item);
	  					}
	  				}

	  			});
  			}

    		return filtered;
  		};
	});


memberApp
	.filter('searchFilterForums', function () {
  		return function (items, scope) {
 			
  			var filtered = [];

  			if(scope.searchText === '') {
  				filtered = items;
  			} else {

  				angular.forEach(items, function(item) {

	  				if(item && ((item.title && item.title.toLowerCase().indexOf(scope.searchText.toLowerCase()) != -1) ||
	  					(item.bysocietyname && item.bysocietyname.toLowerCase().indexOf(scope.searchText.toLowerCase()) != -1) ||
	  					(item.bycity && item.bycity.toLowerCase().indexOf(scope.searchText.toLowerCase()) != -1) ||
	  					(item.byname && item.byname.toLowerCase().indexOf(scope.searchText.toLowerCase()) != -1))) {

	  					filtered.push(item);
	  				}
	  			});
  			}

    		return filtered;
  		};
	});



	

