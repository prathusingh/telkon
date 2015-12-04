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
                   				members[i].imagedp = rootUrl + members[i].imagedp;
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