'use strict';

var memberApp = angular.module('memberApp');

memberApp
	.controller('ClubsCtrl', ['$rootScope', '$scope', '$window', 'MemberClub',
		function($rootScope, $scope, $window, MemberClub) {

		$scope.clubpageLink = '/member#/clubpage/';
		$scope.selectedOption = "All";
		$scope.viewOptions = ["All", "Subcribed", "Non Subcribed"];
		$scope.clubs = [];
		$scope.subscribedclubs = [];
		$scope.clubsadmin = [];
		$scope.tabs = [
			"INTRA SOCIETY",
			"INTER SOCIETY"
		];
		$scope.message = '';
		$scope.selectedTab = 0;
		$scope.searchText = '';
		$scope.clubTypeMsg = '';
		$scope.clubTypes = [];
		$scope.clubTypesLoading = false;

		/* New Club */
		$scope.newClub = {};
		$scope.name = '';
		$scope.categorySelected = '';
		$scope.isCreatingNew = false;
		$scope.details = '';
		$scope.pageLoading = false;
		$scope.dataLoading = true;
		$scope.recSkip = 0;
		$scope.isLoadingMore = false;
		$scope.isLoadCompleted = false;

		$scope.refreshClubs = function(clubtype) {

			$scope.pageLoading = true;
			$scope.recSkip = 0;
			$scope.isLoadCompleted = false;
			$scope.searchText = '';

			populateClubs(clubtype, function(clubs, subscribedclubs, clubsadmin) {

				$scope.pageLoading = false;
				$scope.clubs = clubs;
				$scope.subscribedclubs = subscribedclubs;
				$scope.clubsadmin = clubsadmin;
				$scope.changeShowOption($scope.selectedOption);

			});
		}

		$scope.changeTab = function(tab) {

			$scope.pageLoading = true;
			$scope.selectedTab = tab;
			
			var clubtype;
			if(tab == 0) {
				clubtype = 0;
			} else if(tab == 1) {
				clubtype = 1;
			}
			$scope.refreshClubs(clubtype);
		}

		$scope.changeTab(0);

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

		$scope.changeShowOption = function(newOption) {
			$scope.selectedOption = newOption;
		}
		

		$scope.searchClubs = function() {

			$scope.pageLoading = true;
			$scope.recSkip = 0;
			$scope.isLoadCompleted = false;

			populateClubs(clubtype, function(clubs, subscribedclubs, clubsadmin) {

				$scope.pageLoading = false;
				$scope.clubs = clubs;
				$scope.subscribedclubs = subscribedclubs;
				$scope.clubsadmin = clubsadmin;
				$scope.changeShowOption($scope.selectedOption);

			});
		}

		$scope.clearForm = function() {

			$scope.newClub = {};
			$scope.name = '';
			$scope.categorySelected = '';
			$scope.details = '';
			$scope.addMessage = '';
			$scope.addErr = 0;
		}

		$scope.navigateToUser = function(uid) {
			$window.location.href = HOST + '/member#/user/' + uid;
		}

		$scope.navigateToSociety = function(socid) {
			$window.location.href = HOST + '/member#/society/' + socid;
		}

		$scope.getClubTypes = function() {

			$scope.clubTypeMsg = '';
			$scope.clubTypesLoading = true;

			MemberClub.getTypes({}).$promise.then(function(res) {
				console.log(res);
				if(res && res.status === 'suc' && res.data) {
					$scope.clubTypes = res.data;
				} else {
					$scope.clubTypeMsg = ERROR_CLUB_TYPES;
				}
				$scope.clubTypesLoading = false;
			}, function(err) {
				$scope.clubTypeMsg = ERROR_CLUB_TYPES;
				$scope.clubTypesLoading = false;
			});
		}

		$scope.subscribeClub = function(clubid) {

			$scope.message = '';

			var data = {clubid: clubid};
			console.log(data);
			MemberClub.markSubscribe({}, data).$promise.then(function(res) {
				console.log(res);
				if(res && res.status === 'suc' && res.message === 'subscribed') {

					$scope.subscribedclubs.push(clubid);
					$scope.message = SUC_CLUB_SUBSCRIBED;
					var alertMessage = {
						value: $scope.message,
						type: 'success'
					};
					$rootScope.$broadcast('showAlertBox', alertMessage);

				} else {

					$scope.message = ERROR_UNKNOWN;
					var alertMessage = {
						value: $scope.message,
						type: 'danger'
					};
					$rootScope.$broadcast('showAlertBox', alertMessage);
				}
			}, function(err) {
					
				var message = getErrorVal(err);
				$scope.message = message;
				var alertMessage = {
					value: $scope.message,
					type: 'danger'
				};
				$rootScope.$broadcast('showAlertBox', alertMessage);
			});
		}

		$scope.createClub = function(clubtype) {

			if(!$scope.newClub.name) {
				$scope.addErr = 1;
				$scope.addMessage = ERROR_CLUB_EMPTY_NAME;
			} else if(!$scope.categorySelected) {
				$scope.addErr = 2;
				$scope.addMessage = ERROR_CLUB_EMPTY_CATEGORY;
			} else if(!$scope.newClub.details) {
				$scope.addErr = 3;
				$scope.addMessage = ERROR_CLUB_EMPTY_DETAILS;
			} else {

				var data = {};
				data.clubtype = clubtype;
				data.category = $scope.categorySelected;
				data.name = $scope.newClub.name;
				data.details = $scope.newClub.details;

				$scope.addMessage = '';
				$scope.addErr = 0;
				$scope.isCreatingNew = true;

				MemberClub.addNew({}, data).$promise.then(function(res) {
					console.log(res);
					if(res && res.status === 'suc' && res.message === 'added') {

						$scope.clubsadmin.push(res.data);
						$scope.subscribedclubs.push(res.data);
						$scope.isCreatingNew = false;
						$scope.categorySelected = '';
						$scope.newClub.name = '';
						$scope.newClub.details = '';
						$scope.addMessage = SUC_CLUB_CREATED;

					} else {

						$scope.isCreatingNew = false;
						$scope.addMessage = ERROR_UNKNOWN;
						$scope.addErr = -1;

						var alertMessage = {
							value: ERROR_UNKNOWN,
							type: 'danger'
						};
						$rootScope.$broadcast('showAlertBox', alertMessage);
					}
				}, function(err) {
					
					var message = getErrorVal(err);
					$scope.addMessage = message;
					$scope.addErr = -1;
					$scope.isCreatingNew = false;

				});

			}			
		}


		$scope.$on('clubAdded', function(event, club) {

			console.log('Notifier# clubAdded - HANDLER');
			if(!club.createdat) {
				club.createdat = moment();
			}
			club.createdat = moment(club.createdat).format(MOMENT_DISPLAY_DATE);

			if(club.imagedp) {
				club.imagedp = AWS_URL.IMAGEDP + club.imagedp;
			}

			if(club.details && club.details.length > 100) {
				club.details = club.details.substring(0, 100) + '...';
			}
			
			
	      	$scope.$apply(function() {
		        club.new = true;
			    $scope.clubs.unshift(club);
			    
			});
	    });

		function populateClubs(clubtype, callback) {

			var clubs = [];
			var subscribedclubs = [];
			var clubsadmin = [];
			var data = {clubtype: clubtype, search: $scope.searchText};

			MemberClub.getAll({}, data).$promise.then(function(res) {
				console.log(res);

				if(res && res.status === 'suc' && res.data) {

					var clubs = res.data.clubs;
					var subscribedclubs = res.data.subscribedclubs
					var clubsadmin = res.data.clubsadmin;

					if(clubs) {

						for(var i=0 ; i<clubs.length ; i++) {
                      		if(clubs[i].createdat) {
                       			clubs[i].createdat = moment(clubs[i].createdat).format(MOMENT_DISPLAY_DATE);
                   			}

                   			if(clubs[i].imagedp) {
								clubs[i].imagedp = AWS_URL.IMAGEDP + clubs[i].imagedp;
							}

                   			if(clubs[i].details && clubs[i].details.length > 100) {
                   				clubs[i].details = clubs[i].details.substring(0, 100) + '...';
                   			}
                  		}
					}

					callback(clubs, subscribedclubs, clubsadmin);
				} else {

					callback(clubs, subscribedclubs, clubsadmin);
					var alertMessage = {
						value: ERROR_UNKNOWN,
						type: 'danger'
					};
					$rootScope.$broadcast('showAlertBox', alertMessage);
				}
			}, function(err) {
				var message = getErrorVal(err);
				callback(clubs, subscribedclubs, clubsadmin);
				var alertMessage = {
					value: message,
					type: 'danger'
				};
				$rootScope.$broadcast('showAlertBox', alertMessage);
			});
		}
	}]);


memberApp
	.controller('MyClubsCtrl', ['$rootScope', '$scope', '$timeout', 'MemberClub',
		function($rootScope, $scope, $timeout, MemberClub) {

		$scope.selectedOption = "All";
		$scope.viewOptions = ["All", "Intra Society", "Inter Society", "Member", "Admin"];
		$scope.clubs = [];
		$scope.clubscreated = [];
		$scope.pageLoading = false;

		$scope.refreshClubs = function() {

			$scope.pageLoading = true;

			populateClubs(function(clubs, clubscreated) {

				$scope.pageLoading = false;
				$scope.clubs = clubs;
				$scope.clubscreated = clubscreated;
				console.log($scope.clubscreated);
				$scope.changeShowOption($scope.selectedOption);

			});
		}

		$scope.refreshClubs();

		$scope.changeShowOption = function(newOption) {
			$scope.selectedOption = newOption;
		}

		function populateClubs(callback) {

			var clubs = [];
			var clubscreated = [];
			var data = {search: $scope.searchText};

			MemberClub.getMyClubs({}, data).$promise.then(function(res) {
				console.log(res);

				if(res && res.status === 'suc' && res.data) {

					var clubs = res.data.myclubs;
					var clubscreated = res.data.clubscreated;

					if(clubs) {

						for(var i=0 ; i<clubs.length ; i++) {
                      		if(clubs[i].createdat) {
                       			clubs[i].createdat = moment(clubs[i].createdat).format(MOMENT_DISPLAY_DATE);
                   			}

                   			if(clubs[i].imagedp) {
								clubs[i].imagedp = AWS_URL.IMAGEDP + clubs[i].imagedp;	
							}

							if(clubs[i].clubtype == 0) {
								clubs[i].clubtype = 'Intra Society'
							} else if(clubs[i].clubtype == 1) {
								clubs[i].clubtype = 'Inter Society'
							}

							if(clubscreated && clubscreated.length>0 && clubscreated.indexOf(clubs[i].clubid) != -1) {
								clubs[i].isAdmin = true;
							} else {
								clubs[i].isAdmin = false;
							}

                   			if(clubs[i].details && clubs[i].details.length > 100) {
                   				clubs[i].details = clubs[i].details.substring(0, 100) + '...';
                   			}
                  		}
					}

					callback(clubs, clubscreated);
				} else {

					callback(clubs, clubscreated);
					var alertMessage = {
						value: ERROR_UNKNOWN,
						type: 'danger'
					};
					$rootScope.$broadcast('showAlertBox', alertMessage);
				}
			}, function(err) {
				var message = getErrorVal(err);
				callback(clubs, clubscreated);
				var alertMessage = {
					value: message,
					type: 'danger'
				};
				$rootScope.$broadcast('showAlertBox', alertMessage);
			});
		}
	}]);


memberApp
	.controller('ClubPageCtrl', ['$rootScope', '$scope', '$routeParams', '$timeout', '$window', 'MemberClub',
		function($rootScope, $scope, $routeParams, $timeout, $window, MemberClub) {

		/* Helper */
		$scope.creds = AWS_S3_CRED;
		$scope.imagedpWidth = IMAGEDP_WIDTH.CLUBPAGE;

		/* Club */
		$scope.clubid = $routeParams.clubid;
		$scope.club = {};
		$scope.userinfo = {};
		$scope.pageLoading = false;

		/* Events */
		$scope.events = [];
		$scope.eventsMsg = '';
		$scope.isLoadingEvents = false;
		$scope.isEventsCompleted = false;
		$scope.recSkipEvents = 0;
		$scope.newEvent = {};
		$scope.newEvent.title = '';
		$scope.newEvent.date = '';
		$scope.newEvent.venue = '';
		$scope.newEvent.details = '';
		$scope.newEvent.addErr = 0;
		$scope.newEvent.addMsg = '';
		$scope.newEvent.isCreatingNew = false;

		/* Posts */
		$scope.posts = [];
		$scope.postsMsg = '';
		$scope.isLoadingPosts = false;
		$scope.isPostsCompleted = false;
		$scope.recSkipPosts = 0;
		$scope.newPost = {};
		$scope.newPost.title = '';
		$scope.newPost.details = '';
		$scope.newPost.addErr = 0;
		$scope.newPost.addMsg = '';
		$scope.newPost.isCreatingNew = false;

		/* Imagedp Upload */
		$scope.imageUpload = {};
		$scope.imageUpload.fileName = '';
		$scope.imageUpload.isUploading = false;
		$scope.imageUpload.addMsg = '';
		$scope.imageUpload.addErr = 0;
		$scope.myImage = '';
    	$scope.myCroppedImage = '';

		/* Members */
		$scope.members = [];
		$scope.searchTextMembers = '';
		$scope.errMsgMembers = ''
		$scope.recSkipMembers = 0;
		$scope.isLoadingMembers = false;
		$scope.isLoadMembersCompleted = false;

		$scope.searchText = {};
		$scope.searchText.members = '';

		$scope.isSearch = {};
		$scope.isSearch.members = false;

		$scope.refreshClubPage = function() {

			$scope.pageLoading = true;
			
			$scope.recSkipPosts = 0;
			$scope.recSkipEvents = 0;
			$scope.recSkipMembers = 0;

			$scope.isLoadingEvents = true;
			$scope.isLoadingPosts = true;
			$scope.isLoadingMembers = true;

			$scope.isEventsCompleted = false;
			$scope.isPostsCompleted = false;
			$scope.isLoadMembersCompleted = false;

			$scope.searchTextMembers = '';

			populateClubInfo(function(club, userinfo, members) {
				$scope.club = club;
				$scope.userinfo = userinfo;
				$scope.pageLoading = false;
			});

			populateMembersChunk(function(members) {
				$scope.members = members;
				$scope.isLoadingMembers = false;
			});

			populateEventsChunk(function(events) {
				$scope.events = events;
				$scope.isLoadingEvents = false;
			});

			populatePostsChunk(function(posts) {
				$scope.posts = posts;
				$scope.isLoadingPosts = false;
			});
		}

		$scope.refreshClubPage();

		var handleFileSelect=function(evt) {
	      	var file = evt.currentTarget.files[0];
	      	var reader = new FileReader();
	     	reader.onload = function (evt) {
	        	$scope.$apply(function($scope) {
	          		$scope.myImage = evt.target.result;
	        	});
	      	};
	     	reader.readAsDataURL(file);
    	};
    	angular.element(document.querySelector('#fileInput')).on('change',handleFileSelect);

    	$scope.loadMoreMembers = function() {

			if($scope.isLoadMembersCompleted) return;
			if($scope.isLoadingMembers) return;

			$scope.recSkipMembers++;
			console.log($scope.recSkipMembers);
			$scope.isLoadingMembers = true;

			populateMembersChunk(function(members) {
			
				if(!members || members.length == 0) {
					$scope.isLoadMembersCompleted = true;
				} else {
					for(var i=0; i<members.length; i++) {
						$scope.members.push(members[i]);
					}
				}
		
				$scope.isLoadingMembers = false;

			});
		}

		$scope.loadMoreEvents = function() {

			$scope.isLoadingEvents = true;
			$scope.recSkipEvents++;
			console.log($scope.recSkipEvents);

			populateEventsChunk(function(events) {

				if(events && events.length>0) {
					for(var i=0; i<events.length; i++) {
						$scope.events.push(events[i]);
					}
				} else {
					$scope.isEventsCompleted = true;
				}
				$scope.isLoadingEvents = false;
			});
		}

		$scope.loadMorePosts = function() {

			$scope.isLoadingPosts = true;
			$scope.recSkipPosts++;
			console.log($scope.recSkipPosts);

			populatePostsChunk(function(posts) {

				if(posts && posts.length>0) {
					for(var i=0; i<posts.length; i++) {
						$scope.posts.push(posts[i]);
					}
				} else {
					$scope.isPostsCompleted = true;
				}
				$scope.isLoadingPosts = false;
			});
		}

		$scope.searchMembers = function() {

			$scope.isSearch.members = false;
			$scope.isLoadingMembers = true;
			$scope.recSkipMembers = 0;
			$scope.isLoadClubsCompleted = false;

			populateMembersChunk(function(members) {
			
				$scope.members = members;
				$scope.isLoadingMembers = false;
				
				if(!$scope.searchText.members) {
					$scope.isSearch.members = false;
				} else {
					$scope.isSearch.members = true;	
				}

			});
		}

		$scope.clearForm = function() {

			/* Events */
			$scope.eventsMsg = '';
			$scope.newEvent = {};
			$scope.newEvent.title = '';
			$scope.newEvent.date = '';
			$scope.newEvent.venue = '';
			$scope.newEvent.details = '';
			$scope.newEvent.addErr = 0;
			$scope.newEvent.addMsg = '';
			$scope.newEvent.isCreatingNew = false;

			/* Posts */
			$scope.postsMsg = '';
			$scope.newPost = {};
			$scope.newPost.title = '';
			$scope.newPost.details = '';
			$scope.newPost.addErr = 0;
			$scope.newPost.addMsg = '';
			$scope.newPost.isCreatingNew = false;
		}

		$scope.subscribeClub = function() {

			$scope.message = '';

			var data = {clubid: $scope.clubid};
			console.log(data);
			MemberClub.markSubscribe({}, data).$promise.then(function(res) {
				console.log(res);
				if(res && res.status === 'suc' && res.message === 'subscribed') {

					$scope.userinfo.issubscribed = true;
					var alertMessage = {
						value: SUC_CLUB_SUBSCRIBED,
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

		$scope.postAddNewEvent = function() {

			if(!$scope.newEvent.title) {
				$scope.newEvent.addErr = 1;
				$scope.newEvent.addMsg = ERROR_CLUB_EVENT_EMPTY_TITLE;
			} else if(!$scope.newEvent.date) {
				$scope.newEvent.addErr = 2;
				$scope.newEvent.addMsg = ERROR_CLUB_EVENT_EMPTY_DATE;
			} else if(!testDate($scope.newEvent.date)) {
				$scope.newEvent.addErr = 2;
				$scope.newEvent.addMsg = ERROR_CLUB_EVENT_INVALID_DATE;
			} else if(!$scope.newEvent.details) {
				$scope.newEvent.addErr = 3;
				$scope.newEvent.addMsg = ERROR_CLUB_EVENT_EMPTY_DETAILS;
			} else {

				$scope.newEvent.date = moment(new Date($scope.newEvent.date));
				var data = {};
				data.clubid = $scope.clubid;
				data.title = $scope.newEvent.title;
				data.date = $scope.newEvent.date;
				data.venue = $scope.newEvent.venue;
				data.details = $scope.newEvent.details;
				
				console.log(data);

				$scope.newEvent.addMsg = '';
				$scope.newEvent.addErr = 0;
				$scope.newEvent.isCreatingNew = true;

				MemberClub.addNewEvent({}, data).$promise.then(function(res) {
					console.log(res);
					if(res && res.status === 'suc' && res.message === 'added') {

						$scope.newEvent.isCreatingNew = false;

						/*
						$scope.isLoadingEvents = true;
						populateEventsChunk(function(events) {
							$scope.events = events;
							$scope.isLoadingEvents = false;
						});
						*/

						$scope.newEvent.title = '';
						$scope.newEvent.date = '';
						$scope.newEvent.venue = '';
						$scope.newEvent.details = '';
						$scope.newEvent.addErr = 0;
						$scope.newEvent.addMsg = '';
						$scope.newEvent.addMsg = SUC_EVENT_ADDED;


					} else {

						$scope.newEvent.isCreatingNew = false;
						$scope.newEvent.addMsg = ERROR_UNKNOWN;
						$scope.newEvent.addErr = -1;

						var alertMessage = {
							value: ERROR_UNKNOWN,
							type: 'danger'
						};
						$rootScope.$broadcast('showAlertBox', alertMessage);
					}
				}, function(err) {
					
					var message = getErrorVal(err);
					$scope.newEvent.addMsg = message;
					$scope.newEvent.addErr = -1;
					$scope.newEvent.isCreatingNew = false;

				});

			}			
		}

		$scope.postAddNewPost = function() {

			console.log('postAddNewPost')
			if(!$scope.newPost.title) {
				$scope.newPost.addErr = 1;
				$scope.newPost.addMsg = ERROR_CLUB_EVENT_EMPTY_TITLE;
			} else if(!$scope.newPost.details) {
				$scope.newPost.addErr = 2;
				$scope.newPost.addMsg = ERROR_CLUB_EVENT_EMPTY_DETAILS;
			} else {

				var data = {};
				data.clubid = $scope.clubid;
				data.title = $scope.newPost.title;
				data.details = $scope.newPost.details;
				
				console.log(data);

				$scope.newPost.addMsg = '';
				$scope.newPost.addErr = 0;
				$scope.newPost.isCreatingNew = true;

				MemberClub.addNewPost({}, data).$promise.then(function(res) {
					console.log(res);
					if(res && res.status === 'suc') {

						$scope.newPost.isCreatingNew = false;
						if(res.message === 'added') {
							$scope.newPost.title = '';
							$scope.newPost.details = '';
							$scope.newPost.addMsg = SUC_CLUB_POST_ADDED;

						} else if(res.message === 'error_denied') {
							$scope.newPost.addMsg = ERROR_CLUB_POST_ADD_DENIED;
							$scope.newPost.addErr = -1;
						}

					} else {

						$scope.newPost.isCreatingNew = false;
						$scope.newPost.addMsg = ERROR_UNKNOWN;
						$scope.newPost.addErr = -1;

						var alertMessage = {
							value: ERROR_UNKNOWN,
							type: 'danger'
						};
						$rootScope.$broadcast('showAlertBox', alertMessage);
					}
				}, function(err) {
					
					var message = getErrorVal(err);
					$scope.newPost.addMsg = message;
					$scope.newPost.addErr = -1;
					$scope.newPost.isCreatingNew = false;

				});

			}			
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

		$scope.$on('clubEventAdded', function(event, newEvent) {

			console.log('Notifier# clubEventAdded - HANDLER');
			
			if(newEvent.date) {
				newEvent.eventday = moment(newEvent.date).format('D');
				newEvent.eventmonth = moment(newEvent.date).format('MMM YYYY');
			}
			if(newEvent.details && newEvent.details.length > 50) {
				newEvent.details = newEvent.details.substring(0, 50) + '...';
			}

	      	$scope.$apply(function() {
			    $scope.events.unshift(newEvent);
			});
	    });

		$scope.$on('clubPostAdded', function(event, post) {

			console.log('Notifier# clubPostAdded - HANDLER');
			
			post.itemcolor = convertDigitToWord($scope.posts.length);

			if(post.createdat) {
				post.createdat = moment(post.createdat).format(MOMENT_DISPLAY_DATE_TIME);
			} else {
				post.createdat = moment().format(MOMENT_DISPLAY_DATE_TIME);
			}

			if(post.byimagedp) {
				post.byimagedp = AWS_URL.IMAGEDP + post.byimagedp;
			}
								
			if(post.details && post.details.length > 100) {
				post.details = post.details.substring(0, 100) + '...';
			}

	      	$scope.$apply(function() {
			    $scope.posts.unshift(post);
			});
	    });

		$scope.navigateToUser = function(uid) {
			$window.location.href = HOST + '/member#/user/' + uid;
		}

		$scope.navigateToSociety = function(socid) {
			$window.location.href = HOST + '/member#/society/' + socid;
		}

		$scope.navigateToClubmembers = function() {
			$window.location.href = HOST + '/member#/clubmembers/' + $scope.clubid;
		}

		$scope.navigateToClubpost = function(clubpostid) {
			$window.location.href = HOST + '/member#/clubpost/' + clubpostid;
		}

		function updateImagedpName() {

			var data = {
				clubid: $scope.clubid,
				imagedp: $scope.imageUpload.fileName
			};

			MemberClub.updatePageImagedp({}, data).$promise.then(function(res) {
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

		function populateMembersChunk(callback) {

			var members = [];

			var data = {
				clubid: $scope.clubid,
				recSkip: $scope.recSkipMembers,
				search: $scope.searchText.members
			};

			console.log(data);

			MemberClub.getMembersChunk({}, data).$promise.then(function(res) {
				console.log(res);

				if(res && res.status === 'suc' && res.data) {

					members = res.data;

					if(members && members.length>0) {
						for(var i=0; i<members.length; i++) {
							if(members[i].imagedp) {
								members[i].imagedp = AWS_URL.IMAGEDP + members[i].imagedp;
							}
						}
					}

					callback(members);

				} else {
					callback(members);
					$scope.errMsgMembers = ERROR_UNKNOWN;
				}

			}, function(err) {
				var message = getErrorVal(err);
				callback(members);
				$scope.errMsgMembers = message;
			});
		}

		function populateClubInfo(callback) {

			var club = [];
			var userinfo = [];
			var members = [];

			var data = {clubid: $scope.clubid};

			MemberClub.getOne({}, data).$promise.then(function(res) {
				console.log(res);

				if(res && res.status === 'suc' && res.data) {

					club = res.data.club;
					userinfo = res.data.info;
					members = res.data.members;

					if(club) {

						if(club.createdat) {
							club.createdat = moment(club.createdat).format(MOMENT_DISPLAY_DATE);
						}

						if(club.clubtype == 0) {
							club.clubtype = 'Intra Society';
						} else if(club.clubtype == 1) {
							club.clubtype = 'Inter Society';
						}

						if(club.category) {
							
						}

						if(club.imagedp) {
							club.imagedp = AWS_URL.IMAGEDP + club.imagedp;
						}
					}

					if(members) {

						for(var i=0; i<members.length; i++) {
							if(members[i].imagedp) {
								members[i].imagedp = AWS_URL.IMAGEDP + members[i].imagedp;
							}
						}
					}

					callback(club, userinfo, members);
				} else {

					callback(club, userinfo, members);
					var alertMessage = {
						value: ERROR_UNKNOWN,
						type: 'danger'
					};
					$rootScope.$broadcast('showAlertBox', alertMessage);
				}

			}, function(err) {
				var message = getErrorVal(err);
				callback(club, userinfo, members);
				var alertMessage = {
					value: message,
					type: 'danger'
				};
				$rootScope.$broadcast('showAlertBox', alertMessage);

			});
		}

		function populateEventsChunk(callback) {

			var resp = [];
			var events = [];
			var data = {
				clubid: $scope.clubid,
				recSkip: $scope.recSkipEvents
			};

			MemberClub.getEventsChunk({}, data).$promise.then(function(res) {
				console.log(res);

				if(res && res.status === 'suc' && res.data) {

					resp = res.data;

					if(resp) {

						var c={};
						for(var i=0 ; i<resp.length ; i++) {

							c = resp[i].events;

							if(c) {
								if(c.date) {

									c.eventday = moment(c.date).format('D');
						            c.eventmonth = moment(c.date).format('MMM YYYY');
								}
								if(c.details && c.details.length > 50) {
									c.details = c.details.substring(0, 50) + '...';
								}

								events.push(c);
							}
						}
					}

					callback(events);
				} else {

					callback(events);
					$scope.eventsMsg = ERROR_UNKNOWN;
				}

			}, function(err) {
				var message = getErrorVal(err);
				callback(events);
				$scope.eventsMsg = message;

			});
		}

		function populatePostsChunk(callback) {

			var resp = [];
			var posts = [];
			var data = {
				clubid: $scope.clubid,
				recSkip: $scope.recSkipPosts
			};

			MemberClub.getPostsChunk({}, data).$promise.then(function(res) {
				console.log(res);

				if(res && res.status === 'suc' && res.data) {

					posts = res.data;

					for(var i=0 ; i<posts.length ; i++) {

						if(posts[i]) {

							posts[i].itemcolor = convertDigitToWord(i+1);

							if(posts[i].createdat) {
								posts[i].createdat = moment(posts[i].createdat).format(MOMENT_DISPLAY_DATE_TIME);
							}

							if(posts[i].byimagedp) {
								posts[i].byimagedp = AWS_URL.IMAGEDP + posts[i].byimagedp;
							}
								
							if(posts[i].details && posts[i].details.length > 100) {
								posts[i].details = posts[i].details.substring(0, 100) + '...';
							}
						}
					}
					callback(posts);

				} else {

					callback(posts);
					$scope.postsMsg = ERROR_UNKNOWN;
				}

			}, function(err) {
				var message = getErrorVal(err);
				callback(posts);
				$scope.postsMsg = message;

			});
		}
	}]);


memberApp
	.controller('ClubpostPageCtrl', ['$rootScope', '$scope', '$routeParams', '$timeout', '$window', 'MemberClub',
		function($rootScope, $scope, $routeParams, $timeout, $window, MemberClub) {

		/* Forum */
		$scope.clubpostid = $routeParams.clubpostid;
		$scope.clubpost = {};
		$scope.pageLoading = false;
		$scope.postShowMsg = '';

		$scope.dataShowMsg = '';
		$scope.dataShowErr = 0;

		/* User-specific info */
		$scope.userinfo = {};

		$scope.refreshPage = function() {

			$scope.pageLoading = true;

			populatePost(function(post, userinfo) {
			
				$scope.post = post;
				$scope.userinfo = userinfo;
				$scope.pageLoading = false;

			});
		}

		$scope.refreshPage();

		function populatePost(callback) {

			var post = {};
			var userinfo = {};

			var data = {clubpostid: $scope.clubpostid, count: true};

			MemberClub.getOne({}, data).$promise.then(function(res) {
				console.log(res);
				if(res && res.status === 'suc') {
						
					club = res.data.club;
					userinfo = res.data.userinfo;

					if(club) {

						post.createdat = moment(post).format(MOMENT_DISPLAY_DATE);

						if(post.byimagedp) {
							post.byimagedp = AWS_URL.IMAGEDP + post.byimagedp;
						}

					} else {
						$scope.dataShowMsg = ERROR_DATA_NOT_FOUND;
						$scope.dataShowErr = -1;
					}

					callback(post, userinfo);
				} else {
					$scope.dataShowMsg = ERROR_UNKNOWN;
					$scope.dataShowErr = -1;
				}
				callback(post, userinfo);
				$scope.dataLoading = false;

			}, function(err) {
				var message = getErrorVal(err);
				callback(post, userinfo);
				$scope.dataShowMsg = message;
				$scope.dataShowErr = -1;
				$scope.dataLoading = false;
			});
		}


	}]);			


memberApp
	.controller('ClubMembersCtrl', ['$rootScope', '$scope', '$timeout', '$window', '$routeParams', 'MemberClub',
		function($rootScope, $scope, $timeout, $window, $routeParams, MemberClub) {

		/* Club */
		$scope.clubid = $routeParams.clubid;
		$scope.club = {};
		$scope.userinfo = {};
		$scope.pageLoading = true;

		/* Members */
		$scope.members = [];
		$scope.searchText = '';
		$scope.pageLoading = true;
		$scope.recSkipMembers = 0;
		$scope.isLoadingMembers = false;
		$scope.isLoadMembers = false;


		$scope.loadMore = function() {

			if($scope.isLoadCompleted) return;
			if($scope.isLoadingMore) return;

			$scope.recSkipMembers++;
			console.log($scope.recSkipMembers);
			$scope.isLoadingMore = true;

			populateMembersChunk(function(members) {
			
				if(!members || members.length == 0) {
					$scope.isLoadCompleted = true;
				} else {
					for(var i=0; i<members.length; i++) {
						$scope.members.push(members[i]);
					}
				}
		
				$scope.isLoadingMore = false;

			});
		}


		$scope.refreshPage = function() {

			$scope.recSkipMembers = 0;
			$scope.pageLoading = true;
			$scope.isLoadingMembers = true;
			$scope.searchText = '';
			
			populateClubInfo(function(club, userinfo, members) {

				$scope.club = club;
				$scope.userinfo = userinfo;
			});

			populateMembersChunk(function(members) {

				$scope.pageLoading = false;
				$scope.members = members;
				//$scope.changeShowOption($scope.selectedOption);
			});
		}

		$scope.searchMembers = function() {

			$scope.pageLoading = true;
			$scope.recSkip = 0;
			$scope.isLoadCompleted = false;
			


			populateMembersChunk(function(members) {

				$scope.pageLoading = false;
				$scope.members = members;
				//$scope.changeShowOption($scope.selectedOption);
			});
		}

		$scope.refreshPage();

		$scope.navigateToUser = function(uid) {
			$window.location.href = HOST + '/member#/user/' + uid;
		}

		$scope.navigateToSociety = function(socid) {
			$window.location.href = HOST + '/member#/society/' + socid;
		}

		$scope.navigateToClubmembers = function() {
			$window.location.href = HOST + '/member#/clubmembers/' + $scope.clubid;
		}

		function populateClubInfo(callback) {

			var club = [];
			var userinfo = [];
			var members = [];

			var data = {clubid: $scope.clubid};

			MemberClub.getOne({}, data).$promise.then(function(res) {
				console.log(res);

				if(res && res.status === 'suc' && res.data) {

					club = res.data.club;
					userinfo = res.data.info;
					members = res.data.members;

					if(club) {

						if(club.createdat) {
							club.createdat = moment(club.createdat).format(MOMENT_DISPLAY_DATE);
						}

						if(club.clubtype == 0) {
							club.clubtype = 'Intra Society';
						} else if(club.clubtype == 1) {
							club.clubtype = 'Inter Society';
						}

						if(club.category) {
							
						}

						if(club.imagedp) {
							club.imagedp = AWS_URL.IMAGEDP + club.imagedp;
						}
					}

					callback(club, userinfo, members);
				} else {

					callback(club, userinfo, members);
					var alertMessage = {
						value: ERROR_UNKNOWN,
						type: 'danger'
					};
					$rootScope.$broadcast('showAlertBox', alertMessage);
				}

			}, function(err) {
				var message = getErrorVal(err);
				callback(club, userinfo, members);
				var alertMessage = {
					value: message,
					type: 'danger'
				};
				$rootScope.$broadcast('showAlertBox', alertMessage);

			});
		}

		function populateMembersChunk(callback) {

			var members = [];
			var data = {clubid: $scope.clubid, recSkip: $scope.recSkipMembers, search: $scope.searchText};

			MemberClub.getMembersChunk({}, data).$promise.then(function(res) {
				console.log(res);
				if(res && res.status === 'suc' && res.data) {

					members = res.data;

					if(members) {

						var d;
						for(var i=0 ; i<members.length ; i++) {

                   			if(members[i].imagedp) {
                   				members[i].imagedp = AWS_URL.IMAGEDP + members[i].imagedp;
                   			}

               			}
               			callback(members);
					}

				} else {
					callback(members);
					var alertMessage = {
						value: ERROR_UNKNOWN,
						type: 'danger'
					};
					$rootScope.$broadcast('showAlertBox', alertMessage);
				}

			}, function(err) {
				var message = getErrorVal(err);
				callback(members);
				var alertMessage = {
					value: message,
					type: 'danger'
				};
				$rootScope.$broadcast('showAlertBox', alertMessage);
			});
		}
	}]);


memberApp
	.filter('searchFilterContacts', function () {
  		return function (items, scope) {
 			
  			var filtered = [];

  			if(scope.searchText === '') {
  				filtered = items;
  			} else {

  				angular.forEach(items, function(item) {

	  				if((item.servicetype && item.servicetype.toLowerCase().indexOf(scope.searchText.toLowerCase()) != -1) ||
	  					(item.name && item.name.toLowerCase().indexOf(scope.searchText.toLowerCase()) != -1) ||
	  					(item.position && item.position.toLowerCase().indexOf(scope.searchText.toLowerCase()) != -1) ||
	  					(item.location && item.location.toLowerCase().indexOf(scope.searchText.toLowerCase()) != -1) ||
	  					(item.email && item.email.toLowerCase().indexOf(scope.searchText.toLowerCase()) != -1)) {
	  					filtered.push(item);
	  				}
	  			});
  			}

    		return filtered;
  		};
	});


function convertDigitToWord(digit) {

	if(digit>7) digit %= 7;

	if(digit == 1) {
		return "one";
	} else if(digit == 2) {
		return "two";
	} else if(digit == 3) {
		return "three";
	} else if(digit == 4) {
		return "four";
	} else if(digit == 5) {
		return "five";
	} else if(digit == 6) {
		return "six";
	} else if(digit == 0) {
		return "seven";
	}
}

