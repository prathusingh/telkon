'use strict';

var memberApp = angular.module('memberApp');

memberApp
	.controller('ComplaintsCtrl', ['$rootScope', '$scope', '$timeout', 'MemberComplaint',
		function($rootScope, $scope, $timeout, MemberComplaint) {

		$scope.selectedOption = "All";
		$scope.viewOptions = ["All", "Resolved", "Unresolved"];
		$scope.complaints = [];
		$scope.complaintTypes = [];
		$scope.complaintShow = null;
		$scope.complaintShowModal = false;
		$scope.categorySelected = '';
		$scope.subject = '';
		$scope.desc = '';
		$scope.pageLoading = true;
		$scope.dataLoading = false;
		$scope.dataShowMsg = '';
		$scope.dataShowErr = 0;
		$scope.complaintTypeMsg= '';
		$scope.errorCode = 0;
		$scope.addMessage = '';
		$scope.statusMessage = '';
		$scope.timelineMsg = '';
		$scope.recSkip = 0;
		$scope.isLoadingMore = false;
		$scope.isLoadCompleted = false;
		$scope.isShowUpdating = false;
		$scope.society = {};
		$scope.searchText = '';

		function requestBroadcastSocietyData() {
			$rootScope.$broadcast('requestBroadcastSocietyData');
		}

		requestBroadcastSocietyData();

		$scope.loadMore = function() {

			if($scope.isLoadCompleted) return;
			if($scope.isLoadingMore) return;

			$scope.recSkip++;
			$scope.isLoadingMore = true;

			populateComplaintsChunk(function(complaints) {
			
				if(!complaints || complaints.length == 0) {
					$scope.isLoadCompleted = true;
				}

				for(var i=0; i<complaints.length; i++) {
					$scope.complaints.push(complaints[i]);
				}

				$scope.isLoadingMore = false;

			});

		}

		$scope.refreshComplaints = function() {

			$scope.pageLoading = true;
			$scope.recSkip = 0;

			populateComplaints(function(newComplaints) {

				$scope.pageLoading = false;
				$scope.complaints = newComplaints;
				$scope.changeShowOption($scope.selectedOption);
			});
		}

		$scope.refreshComplaints();

		$scope.clearForm = function() {
			$scope.categorySelected = '';
			$scope.subject = '';
			$scope.desc = '';
			$scope.complaintShowMsg = '';
			$scope.errorCode = 0;
			$scope.addMessage = '';
			$scope.dataShowErr = 0;
			$scope.dataShowMsg = '';
			$scope.statusMessage = '';
		}


		$scope.clickComplaint = function(complaint) {

			var compid = complaint.compid;
			$scope.dataShowMsg = '';
			$scope.statusMessage = '';
			$scope.dataShowErr = 0;
			$scope.complaintShow = {};
			$scope.dataLoading = true;
			$scope.timelineMsg = '';

			$timeout(function() {
				if(complaint.new)
					delete complaint.new;
			}, 2000);

			var data = {compid: compid};
			MemberComplaint.getOne({}, data).$promise.then(function(res) {
				console.log(res);
				if(res && res.status === 'suc') {
						
					$scope.complaintShow = res.data;

					if($scope.complaintShow) {
						$scope.complaintShow.createdat = moment($scope.complaintShow.createdat).format(MOMENT_DISPLAY_DATE);

						for(var i=0 ; i<$scope.complaintShow.timeline.length ; i++) {
							$scope.complaintShow.timeline[i].date = moment($scope.complaintShow.timeline[i].date).format(MOMENT_DISPLAY_DATE);
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

		/* Updates the TIMELINE */
		function updateComplaintShow(compid, callback) {

			if($scope.complaintShow && $scope.complaintShow.compid !== compid) return;

			var data = {compid: compid};
			$scope.isShowUpdating = true;
			$scope.timelineMsg = '';
			MemberComplaint.getTimeline({}, data).$promise.then(function(res) {
				console.log(res);
				if(res && res.status === 'suc') {
						
					$scope.complaintShow.timeline = res.data;

					if($scope.complaintShow.timeline) {

						for(var i=0 ; i<$scope.complaintShow.timeline.length ; i++) {
							$scope.complaintShow.timeline[i].date = moment($scope.complaintShow.timeline[i].date).format(MOMENT_DISPLAY_DATE);
						}	
					} else {
						var alertMessage = {
							value: ERROR_DATA_NOT_FOUND,
							type: 'danger'
						};
						$rootScope.$broadcast('showAlertBox', alertMessage);						
					}
					callback(true);
				} else {
					callback(false);
				}
			}, function(err) {
				callback(false);
			});
		}

		$scope.changeShowOption = function(newOption) {
			$scope.selectedOption = newOption;
		}

		$scope.getComplaintTypes = function() {

			$scope.complaintTypeMsg = '';
			MemberComplaint.getTypes({}).$promise.then(function(res) {
				console.log(res);
				if(res && res.status === 'suc' && res.data) {
					$scope.complaintTypes = res.data;
				} else {
					$scope.complaintTypeMsg = ERROR_COMPLAINT_TYPES;
				}
			}, function(err) {
				$scope.complaintTypeMsg = ERROR_COMPLAINT_TYPES;
			});
		}

		$scope.removeComplaint = function(complaint) {

			$scope.statusMessage = ''
			bootbox.confirm("Are you sure?", function(result) {
  				if(result) {
					var data = {compid: complaint.compid}
					MemberComplaint.markRemove({}, data).$promise.then(function(res) {
						console.log(res);
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

		$scope.escalateComplaint = function(complaint) {

			$scope.statusMessage = ''
			var data = {compid: complaint.compid}
			MemberComplaint.markEscalate({}, data).$promise.then(function(res) {
				console.log(res);
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

		$scope.registerComplaint = function() {

			if(!$scope.categorySelected) {
				$scope.errorCode = 1;
				$scope.addMessage = ERROR_COMPLAINT_EMPTY_CATEGORY;
			} else if(!$scope.subject) {
				$scope.errorCode = 2;
				$scope.addMessage = ERROR_COMPLAINT_EMPTY_SUBJECT;
			} else if(!$scope.desc) {
				$scope.errorCode = 3;
				$scope.addMessage = ERROR_COMPLAINT_EMPTY_DESC;
			} else {

				var data = {};
				data.category = $scope.categorySelected;
				data.subject = $scope.subject;
				data.desc = $scope.desc;
				$scope.addMessage = '';
				$scope.errorCode = 0;
				$scope.dataLoading = true;

				MemberComplaint.addNew({}, data).$promise.then(function(res) {
					console.log(res);
					if(res && res.status === 'suc' && res.message === 'added') {

						$scope.dataLoading = false;
						$scope.categorySelected = '';
						$scope.subject = '';
						$scope.desc = '';
						$scope.addMessage = SUC_COMPLAINT_REGISTERED;

					} else {

						$scope.dataLoading = false;
						$scope.addMessage = ERROR_UNKNOWN;
						$scope.errorCode = -1;

						var alertMessage = {
							value: ERROR_UNKNOWN,
							type: 'danger'
						};
						$rootScope.$broadcast('showAlertBox', alertMessage);
					}
				}, function(err) {
					
					var message = getErrorVal(err);
					$scope.addMessage = message;
					$scope.errorCode = -1;
					$scope.dataLoading = false;

				});

			}			
		}

		$scope.showSupport = function() {
			$rootScope.$broadcast('showMemberSupport');
		}
		
		$scope.$on('complaintAdded', function(event, complaint) {

			console.log('Notifier# complaintAdded - HANDLER');
			complaint.createdat = moment(complaint.createdat).format(MOMENT_DISPLAY_DATE);
			
	      	$scope.$apply(function() {

		        complaint.new = true;
			    $scope.complaints.unshift(complaint);
			});
	    });

		$scope.$on('complaintStatusChanged', function(event, compid, status) {

			console.log('Notifier# complaintStatusChanged - HANDLER');
			
			var complaint;
	      	$scope.$apply(function() {

	      		if($scope.complaintShow && 
	      			$scope.complaintShow.compid === compid) {

	      			$scope.isShowUpdating = true;
	      			updateComplaintShow(compid, function(status) {

	      				$scope.isShowUpdating = false;
	      				if(!status) {
	      					$scope.timelineMsg = ERROR_COMPLAINT_TIMELINE_UPDATE;
	      				}
	      			});
	      			$scope.complaintShow.currentstatus = status;
	      			if(status === 'Escalation Requested') {
						$scope.complaintShow.isescalationreq = true;
					} else if(status === 'Escalated') {
						$scope.complaintShow.isescalated = true;
					} else if(status === 'Resolved') {
						$scope.complaintShow.isresolved = true;
					}

	      		}

				for(var i=0 ; i<$scope.complaints.length ; i++) {

					complaint = $scope.complaints[i];
					if(complaint.compid === compid) {

						complaint.currentstatus = status;
						if(status === 'Escalation Requested') {
							complaint.isescalationreq = true;
						}
						complaint.new = true;
						break;
					}
				}
			});
	    });

		$scope.$on('complaintRemovedByMember', function(event, compid) {

			console.log('Notifier# complaintRemovedByMember - HANDLER');
			
			var complaint;
	      	$scope.$apply(function() {
				
				for(var i=0 ; i<$scope.complaints.length ; i++) {

					complaint = $scope.complaints[i];
					if(complaint.compid === compid) {

						$scope.complaints.splice(i, 1);
						break;
					}
				}
			});
	    });

	    $scope.$on('complaintRemovedByAdmin', function(event, compid) {

			console.log('Notifier# complaintRemovedByAdmin - HANDLER');
			
			var complaint;
	      	$scope.$apply(function() {
				
				if($scope.complaintShow && 
	      			$scope.complaintShow.compid === compid) {

					$scope.isShowUpdating = true;
					updateComplaintShow(compid, function(status) {

		      			$scope.isShowUpdating = false;
		   				if(!status) {
		     				$scope.timelineMsg = ERROR_COMPLAINT_TIMELINE_UPDATE;
		      			}
		      		});
					$scope.complaintShow.status = 'Removed by Admin';

	      		}
	      		
				for(var i=0 ; i<$scope.complaints.length ; i++) {

					complaint = $scope.complaints[i];
					if(complaint.compid === compid) {

						complaint.currentstatus = "Removed by Admin";
						complaint.new = true;
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

		function populateComplaints(callback) {

			var complaints = [];
			MemberComplaint.getAll({}).$promise.then(function(res) {
				console.log(res);
				if(res && res.status === 'suc' && res.data) {

					complaints = res.data;

					if(complaints) {

						var d;
						for(var i=0 ; i<complaints.length ; i++) {
             	  			if(complaints[i].createdat) {
                      			d = complaints[i].createdat;
                        		complaints[i].createdat = moment(d).format(MOMENT_DISPLAY_DATE);
                      		}
                  		}
                  		callback(complaints);

					}

				} else {
					callback(complaints);
					var alertMessage = {
						value: ERROR_UNKNOWN,
						type: 'danger'
					};
					$rootScope.$broadcast('showAlertBox', alertMessage);
				}

			}, function(err) {
				var message = getErrorVal(err);
				callback(complaints);
				var alertMessage = {
					value: message,
					type: 'danger'
				};
				$rootScope.$broadcast('showAlertBox', alertMessage);

			});
		}

		function populateComplaintsChunk(callback) {

			var complaints = [];
			var data = {recSkip: $scope.recSkip};
			MemberComplaint.getChunk({}, data).$promise.then(function(res) {
				console.log(res);
				if(res && res.status === 'suc' && res.data) {

					complaints = res.data;

					if(complaints) {

						var d;
						for(var i=0 ; i<complaints.length ; i++) {
             	  			if(complaints[i].createdat) {
                      			d = complaints[i].createdat;
                        		complaints[i].createdat = moment(d).format(MOMENT_DISPLAY_DATE);
                      		}
                  		}
                  		callback(complaints);

					}

				} else {
					callback(complaints);
					var alertMessage = {
						value: ERROR_UNKNOWN,
						type: 'danger'
					};
					$rootScope.$broadcast('showAlertBox', alertMessage);
				}

			}, function(err) {
				var message = getErrorVal(err);
				callback(complaints);
				var alertMessage = {
					value: message,
					type: 'danger'
				};
				$rootScope.$broadcast('showAlertBox', alertMessage);

			});
		}

	}]);


memberApp
	.filter('selectedOptionFilterComplaints', function () {
  		return function (items, scope) {
  			
  			var filtered = [];

  			if(scope.selectedOption === 'All') {
  				filtered = items;
  			} else {
  				angular.forEach(items, function(item) {
	  				if(scope.selectedOption === 'Resolved') {
	  					if(item.currentstatus === 'Resolved') {
	  						filtered.push(item);
	  					}
	  				} else if(scope.selectedOption !== 'Resolved') {
	  					if(item.currentstatus !== 'Resolved') {
	  						filtered.push(item);
	  					}
	  				}
	  			});
  			}

  			
    		return filtered;
  		};
	});

memberApp
	.filter('searchFilterComplaints', function () {
  		return function (items, scope) {
 			
  			var filtered = [];

  			if(scope.searchText === '') {
  				filtered = items;
  			} else {

  				angular.forEach(items, function(item) {

  					console.log(item);
	  				if(item && ((item.subject && item.subject.toLowerCase().indexOf(scope.searchText.toLowerCase())) != -1 ||
	  					(item.category && item.category.toLowerCase().indexOf(scope.searchText.toLowerCase())) != -1)) {

	  					filtered.push(item);
	  				}
	  			});
  			}

    		return filtered;
  		};

	});