'use strict';

var adminApp = angular.module('adminApp');

adminApp
	.controller('PollsCtrl', ['$rootScope', '$scope', '$timeout', 'AdminPoll',
		function($rootScope, $scope, $timeout, AdminPoll) {

		$scope.validForValues = [
			1, 2, 5, 7, 10, 15, 30
		];
		$scope.selectedOption = "All";
		$scope.viewOptions = ["All", "Open", "Closed"];
		$scope.polls = [];
		$scope.pollShow = {};
		$scope.pollShowMsg = '';
		$scope.successMsg = '';
		$scope.errorMsg = '';
		$scope.title = '';
		$scope.validfor = $scope.validForValues[0];
		$scope.desc = '';
		$scope.meantfor = 2;
		$scope.itemTypes = [
			{val: 0, text: "Single Selection"},
			{val: 1, text: "Multiple Selection"},
			{val: 2, text: "Text Input"}
		];
		$scope.pollItems = [];
		$scope.errorCode = 0;
		$scope.pageLoading = true;
		$scope.dataLoading = false;

		$scope.refreshPolls = function() {

			$scope.pageLoading = true;
			populatePolls(function(polls) {

				$scope.pageLoading = false;
				$scope.polls = polls;
				//$scope.changeShowOption($scope.selectedOption);
			});
		}

		$scope.addPollItem = function() {

			$scope.errorMsg = '';
		   	$scope.inserted = {
		     	id: $scope.pollItems.length+1,
		     	itemtype: '',
		     	desc: '',
		     	values: ''
		    };
			$scope.pollItems.push($scope.inserted);

	  	}

		$scope.refreshPolls();
		$scope.addPollItem();

		$scope.clearForm = function() {

			$scope.successMsg = '';
			$scope.errorMsg = '';
			$scope.title = '';
			$scope.desc = '';
			$scope.meantfor = 2;
			$scope.validfor = $scope.validForValues[0];
			$scope.pollItems = [];
			$scope.addPollItem();
		}

		$scope.removeItem = function(index) {
			
			if($scope.pollItems.length == 1) {
				$scope.errorMsg = 'Atleast 1 Item must be present';
			} else {
				$scope.pollItems.splice(index, 1);
				if($scope.pollItems.length == 0) {
					$scope.pollItems = [];
					$scope.addPollItem();
				}
			}

		}

		$scope.changeItemType = function(type) {

			console.log(type);
		}

		$scope.showPoll = function(pollid) {

			$scope.dataLoading = true;
			$scope.pollShowMsg = '';
			var data = {pollid: pollid};
				
			AdminPoll.getOne({}, data).$promise.then(function(res) {

				console.log(res);
				$scope.dataLoading = false;
				if(res && res.status === 'suc' && res.data) {

					$scope.pollShow = res.data.polls;
					
					$scope.pollShow.createdat = moment($scope.pollShow.createdat).format("DD MMM YYYY");
					$scope.pollShow.expiry = moment($scope.pollShow.expiry).format("DD MMM YYYY");

					if($scope.pollShow.meantfor == 2) {
	                   	$scope.pollShow.meantfor = 'Both';
	                   	if(res.data.society) $scope.pollShow.totalmembers = res.data.society.totalmembers;
                   	} else if($scope.pollShow.meantfor == 0) {
	           			$scope.pollShow.meantfor = 'Owners';
	           			if(res.data.society) $scope.pollShow.totalmembers = res.data.society.totalowners;
               		} else if($scope.pollShow.meantfor == 1) {
	                   	$scope.pollShow.meantfor = 'Tenants';
	                   	if(res.data.society) $scope.pollShow.totalmembers = res.data.society.totaltenants;
                   	}
                   	if ($scope.pollShow.items[0].votes) $scope.pollShow.totalvoted = $scope.pollShow.items[0].votes.length

				} else {
					$scope.errorMsg = 'Failed to retrieve the poll details';
				}

			}, function(err) {

				console.log(err);
				$scope.dataLoading = false;
				$scope.errorMsg = 'Failed to retrieve the poll details';
			});
		}

		$scope.launchPoll = function() {

			if(!$scope.title) {
				$scope.errorMsg = 'Please enter a Title';
				$scope.errorCode = 1;
			} else if(!$scope.desc) {
				$scope.errorMsg = 'Please enter the Description';
				$scope.errorCode = 2;
			} else if($scope.pollItems.length == 0) {
				$scope.errorMsg = 'Create atleast one Item';
			} else {

				var data = {
					title: $scope.title,
					desc: $scope.desc,
					validfor: $scope.validfor,
					meantfor: $scope.meantfor,
					items: $scope.pollItems
				}

				console.log(data);

				AdminPoll.launchPoll({}, data, function(res) {

					console.log(res);

					if(res && res.status === 'suc' && res.message === 'added') {

	    			} else {

	    				$scope.errorMsg = 'Unknown Error!';
	    				var alertMessage = {
							value: 'Unknown Error!',
							type: 'danger'
						};
						$rootScope.$broadcast('showAlertBox', alertMessage);

	    			}

	    		}, function(err) {

	    			console.log(err);
	    			$scope.errorMsg = 'Server Problem!';
					var alertMessage = {
						value: 'Server Error!',
						type: 'danger'
					};
					$rootScope.$broadcast('showAlertBox', alertMessage);

				});

			}


		}

		function populatePolls(callback) {

			var polls = [];
			AdminPoll.getAll({}).$promise.then(function(res) {
				console.log(res);

				if(res && res.status === 'suc' && res.data) {

					polls = res.data;
					if(typeof polls !== 'undefined' &&
						polls !== []) {

						for(var i=0 ; i<polls.length ; i++) {

                      		if(typeof polls[i].createdat !== 'undefined') {
                       			polls[i].createdat = moment(polls[i].createdat).format("DD MMM YYYY");
                   			}
                   			if(typeof polls[i].expiry !== 'undefined') {
                       			polls[i].expiry = moment(polls[i].expiry).format("DD MMM YYYY");
                   			}
                      		if(typeof polls[i].desc !== 'undefined' &&
                      			polls[i].desc.length > 50) {
                       			polls[i].desc =  polls[i].desc.substring(0, 50) + '...';
                   			}
               			}
               			callback(polls);
					}

				} else {

					callback(polls);
					var alertMessage = {
						value: 'Unknown Error!',
						type: 'danger'
					};
					$rootScope.$broadcast('showAlertBox', alertMessage);
				}

			}, function(err) {
				
				callback(polls);
				var alertMessage = {
					value: 'Server Error!',
					type: 'danger'
				};
				$rootScope.$broadcast('showAlertBox', alertMessage);
			});
		}

	}]);

adminApp
	.filter('selectedOptionFilterPolls', function () {
  		return function (items, scope) {
  			
  			var filtered = [];

  			if(scope.selectedOption === 'All') {
  				filtered = items;
  			} else {
  				angular.forEach(items, function(item) {
  					
	  				if(scope.selectedOption === 'Closed') {
	  					if(item.iscompleted) {
	  						filtered.push(item);
	  					}
	  				} else if(scope.selectedOption === 'Open') {
	  					if(!item.iscompleted) {
	  						filtered.push(item);
	  					}
	  				}
	  			});
  			}

    		return filtered;
  		};
	});