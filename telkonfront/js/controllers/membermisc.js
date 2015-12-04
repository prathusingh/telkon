'use strict';

var memberApp = angular.module('memberApp');


memberApp
	.controller('MembersCtrl', ['$rootScope', '$scope', '$timeout', 'MemberSidenav',
		function($rootScope, $scope, $timeout, MemberSidenav) {

		$scope.members = [];
		$scope.searchText = '';
		$scope.pageLoading = true;
		$scope.recSkip = 0;
		$scope.isLoadingMore = false;
		$scope.isLoadCompleted = false;


		$scope.loadMore = function() {

			if($scope.isLoadCompleted) return;
			if($scope.isLoadingMore) return;

			$scope.recSkip++;
			console.log($scope.recSkip);
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


		$scope.refreshMembers = function() {

			$scope.pageLoading = true;
			$scope.recSkip = 0;
			$scope.isLoadCompleted = false;
			$scope.searchText = '';
			
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


		$scope.refreshMembers();

		function populateMembersChunk(callback) {

			var members = [];
			var data = {recSkip: $scope.recSkip, search: $scope.searchText};

			MemberSidenav.getMembersChunk({}, data).$promise.then(function(res) {
				console.log(res);
				if(res && res.status === 'suc' && res.data) {

					members = res.data;

					if(members) {

						var d;
						for(var i=0 ; i<members.length ; i++) {
                   			
                   			if(members[i].residencetype == 0) {
                   				members[i].residencetype = 'Owner';
                   			} else if(members[i].residencetype == 1) {
                   				members[i].residencetype = 'Tenant';
                   			}

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
	.controller('UserPageCtrl', ['$rootScope', '$scope', '$routeParams', '$location', '$window','$timeout', 'MemberMisc',
		function($rootScope, $scope, $routeParams, $location, $window, $timeout, MemberMisc) {

		$scope.userid = $routeParams.userid;
		$scope.user = {};
		$scope.pageLoading = false;

		/* Clubs */
		$scope.clubs = [];
		$scope.searchTextClubs = '';
		$scope.errMsgClubs = ''
		$scope.recSkipClubs = 0;
		$scope.isLoadingClubs = false;
		$scope.isLoadClubsCompleted = false;
		$scope.searchText = {};
		$scope.searchText.members = '';
		$scope.searchText.clubs = '';
		$scope.isSearch = {};
		$scope.isSearch.clubs = false;


		$scope.refreshPage = function() {

			$scope.pageLoading = true;
			$scope.isLoadingClubs = true;
			$scope.isLoadClubsCompleted = false;

			$scope.recSkipClubs = 0;
			$scope.searchText.clubs = '';

			populateUser(function(user) {
				$scope.user = user;
				$scope.pageLoading = false;
			});

			populateClubsChunk(function(clubs) {
				$scope.clubs = clubs;
				$scope.isLoadingClubs = false;
			});

		}

		$scope.refreshPage();

		$scope.loadMoreClubs = function() {

			if($scope.isLoadClubsCompleted) return;
			if($scope.isLoadingClubs) return;

			$scope.recSkipClubs++;
			console.log($scope.recSkipClubs);
			$scope.isLoadingClubs = true;

			populateClubsChunk(function(clubs) {
			
				if(!clubs || clubs.length == 0) {
					$scope.isLoadClubsCompleted = true;
				} else {
					for(var i=0; i<clubs.length; i++) {
						$scope.clubs.push(clubs[i]);
					}
				}
		
				$scope.isLoadingClubs = false;

			});
		}

		$scope.searchClubs = function() {

			$scope.isSearch.clubs = false;
			$scope.isLoadingClubs = true;
			$scope.recSkipClubs = 0;
			$scope.isLoadClubsCompleted = false;

			populateClubsChunk(function(clubs) {
			
				$scope.clubs = clubs;
				$scope.isLoadingClubs = false;

				if(!$scope.searchText.clubs) {
					$scope.isSearch.clubs = false;
				} else {
					$scope.isSearch.clubs = true;	
				}

			});
		}

		$scope.navigateToSociety = function() {
			$window.location.href = HOST + '/member#/society/' + $scope.user.socid;
		}

		$scope.navigateToClub = function(clubid) {
			$window.location.href = HOST + '/member#/clubpage/' + clubid;
		}

		function populateUser(callback) {

			var user = {};

			var data = {userid: $scope.userid};

			console.log(data);
			MemberMisc.getUser({}, data).$promise.then(function(res) {
				console.log(res);

				if(res && res.status === 'suc' && res.data) {

					user = res.data;

					if(user.imagedp) {
						user.imagedp = AWS_URL.IMAGEDP + user.imagedp;
					}

					callback(user);

				} else {

					callback(user);
					var alertMessage = {
						value: ERROR_UNKNOWN,
						type: 'danger'
					};
					$rootScope.$broadcast('showAlertBox', alertMessage);
				}

			}, function(err) {
				var message = getErrorVal(err);
				callback(user);
				var alertMessage = {
					value: message,
					type: 'danger'
				};
				$rootScope.$broadcast('showAlertBox', alertMessage);

			});
		}

		function populateClubsChunk(callback) {

			var clubs = [];

			var data = {
				userid: $scope.userid,
				recSkip: $scope.recSkipClubs,
				search: $scope.searchText.clubs
			};

			MemberMisc.getUserClubsChunk({}, data).$promise.then(function(res) {
				console.log(res);

				if(res && res.status === 'suc' && res.data) {

					clubs = res.data;

					if(clubs && clubs.length>0) {
						for(var i=0; i<clubs.length; i++) {
							if(clubs[i].imagedp) {
								clubs[i].imagedp = AWS_URL.IMAGEDP + clubs[i].imagedp;
							}
						}
					}

					callback(clubs);

				} else {
					callback(clubs);
					$scope.errMsg = ERROR_UNKNOWN;
				}

			}, function(err) {
				var message = getErrorVal(err);
				callback(clubs);
				$scope.errMsg = message;
			});
		}
	}]);


memberApp
	.controller('SocietyPageCtrl', ['$rootScope', '$scope', '$routeParams', '$location', '$window', '$timeout', 'MemberMisc',
		function($rootScope, $scope, $routeParams, $location, $window, $timeout, MemberMisc) {

		$scope.societyid = $routeParams.societyid;
		$scope.society = {};
		$scope.pageLoading = false;

		$scope.clubs = [];
		$scope.isLoadingClubs = false;

		/* Members */
		$scope.members = [];
		$scope.searchTextMembers = '';
		$scope.errMsgMembers = ''
		$scope.recSkipMembers = 0;
		$scope.isLoadingMembers = false;
		$scope.isLoadMembersCompleted = false;

		/* Clubs */
		$scope.clubs = [];
		$scope.searchTextClubs = '';
		$scope.errMsgClubs = ''
		$scope.recSkipClubs = 0;
		$scope.isLoadingClubs = false;
		$scope.isLoadClubsCompleted = false;

		$scope.searchText = {};
		$scope.searchText.members = '';
		$scope.searchText.clubs = '';

		$scope.isSearch = {};
		$scope.isSearch.clubs = false;
		$scope.isSearch.members = false;

		$scope.refreshPage = function() {

			$scope.pageLoading = true;
			$scope.isLoadingMembers = true;
			$scope.isLoadMembersCompleted = false;
			$scope.isLoadingClubs = true;
			$scope.isLoadClubsCompleted = false;

			$scope.recSkipClubs = 0;
			$scope.recSkipMembers = 0;
			$scope.searchText.members = '';
			$scope.searchText.clubs = '';

			populateSociety(function(society) {
				$scope.society = society;
				$scope.pageLoading = false;
			});

			populateMembersChunk(function(members) {
				$scope.members = members;
				$scope.isLoadingMembers = false;
			});

			populateClubsChunk(function(clubs) {
				$scope.clubs = clubs;
				$scope.isLoadingClubs = false;
			});
		}

		$scope.refreshPage();

		$scope.navigateToUser = function(uid) {
			$window.location.href = HOST + '/member#/user/' + uid;
		}

		$scope.navigateToSociety = function(socid) {
			$window.location.href = HOST + '/member#/society/' + socid;
		}

		$scope.navigateToClub = function(clubid) {
			$window.location.href = HOST + '/member#/clubpage/' + clubid;
		}

		$scope.navigateToClubmembers = function() {
			$window.location.href = HOST + '/member#/clubmembers/' + $scope.clubid;
		}

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

		$scope.loadMoreClubs = function() {

			if($scope.isLoadClubsCompleted) return;
			if($scope.isLoadingClubs) return;

			$scope.recSkipClubs++;
			console.log($scope.recSkipClubs);
			$scope.isLoadingClubs = true;

			populateClubsChunk(function(clubs) {
			
				if(!clubs || clubs.length == 0) {
					$scope.isLoadClubsCompleted = true;
				} else {
					for(var i=0; i<clubs.length; i++) {
						$scope.clubs.push(clubs[i]);
					}
				}
		
				$scope.isLoadingClubs = false;

			});
		}

		$scope.searchClubs = function() {

			$scope.isSearch.clubs = false;
			$scope.isLoadingClubs = true;
			$scope.recSkipClubs = 0;
			$scope.isLoadClubsCompleted = false;

			populateClubsChunk(function(clubs) {
			
				$scope.clubs = clubs;
				$scope.isLoadingClubs = false;
				
				if(!$scope.searchText.clubs) {
					$scope.isSearch.clubs = false;
				} else {
					$scope.isSearch.clubs = true;	
				}

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

		function populateSociety(callback) {

			var society = {};

			var data = {societyid: $scope.societyid};

			console.log(data);
			MemberMisc.getSociety({}, data).$promise.then(function(res) {
				console.log(res);

				if(res && res.status === 'suc' && res.data) {

					society = res.data;

					if(society) {

						if(society.imagedp) {
							society.imagedp = AWS_URL.IMAGEDP + society.imagedp;
						}
					}

					callback(society);

				} else {

					callback(society);
					var alertMessage = {
						value: ERROR_UNKNOWN,
						type: 'danger'
					};
					$rootScope.$broadcast('showAlertBox', alertMessage);
				}

			}, function(err) {
				var message = getErrorVal(err);
				callback(society);
				var alertMessage = {
					value: message,
					type: 'danger'
				};
				$rootScope.$broadcast('showAlertBox', alertMessage);

			});
		}

		function populateMembersChunk(callback) {

			var members = [];

			var data = {
				societyid: $scope.societyid,
				recSkip: $scope.recSkipMembers,
				search: $scope.searchText.members
			};

			MemberMisc.getSocietyMembersChunk({}, data).$promise.then(function(res) {
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
					$scope.errMsg = ERROR_UNKNOWN;
				}

			}, function(err) {
				var message = getErrorVal(err);
				callback(members);
				$scope.errMsg = message;
			});
		}

		function populateClubsChunk(callback) {

			var clubs = [];

			var data = {
				societyid: $scope.societyid,
				recSkip: $scope.recSkipClubs,
				search: $scope.searchText.clubs
			};

			MemberMisc.getSocietyClubsChunk({}, data).$promise.then(function(res) {
				console.log(res);

				if(res && res.status === 'suc' && res.data) {

					clubs = res.data;

					if(clubs && clubs.length>0) {
						for(var i=0; i<clubs.length; i++) {
							if(clubs[i].imagedp) {
								clubs[i].imagedp = AWS_URL.IMAGEDP + clubs[i].imagedp;
							}
						}
					}

					callback(clubs);

				} else {
					callback(clubs);
					$scope.errMsg = ERROR_UNKNOWN;
				}

			}, function(err) {
				var message = getErrorVal(err);
				callback(clubs);
				$scope.errMsg = message;
			});
		}

	}]);

memberApp
	.controller('SocietyMembersCtrl', ['$rootScope', '$scope', '$timeout', '$routeParams', 'MemberMisc',
		function($rootScope, $scope, $timeout, $routeParams, MemberMisc) {

		$scope.clubid = $routeParams.clubid;
		$scope.members = [];
		$scope.searchText = '';
		$scope.pageLoading = true;
		$scope.recSkip = 0;
		$scope.isLoadingMore = false;
		$scope.isLoadCompleted = false;


		$scope.loadMore = function() {

			if($scope.isLoadCompleted) return;
			if($scope.isLoadingMore) return;

			$scope.recSkip++;
			console.log($scope.recSkip);
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


		$scope.refreshMembers = function() {

			$scope.pageLoading = true;
			$scope.recSkip = 0;
			$scope.isLoadCompleted = false;
			$scope.searchText = '';
			
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

		$scope.refreshMembers();

		function populateMembersChunk(callback) {

			var members = [];
			var data = {clubid: $scope.clubid, recSkip: $scope.recSkip, search: $scope.searchText};

			MemberMisc.getSocietyMembersChunk({}, data).$promise.then(function(res) {
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