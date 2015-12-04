'use strict';

var adminApp = angular.module('adminApp');

adminApp
	.controller('ComplaintsCtrl', ['$rootScope', '$scope', '$timeout', 'AdminComplaint',
		function($rootScope, $scope, $timeout, AdminComplaint) {

		$scope.selectedOption = "All";
		$scope.viewOptions = ["All", "Resolved", "Unresolved"];
		$scope.complaints = [];
		$scope.searchText = '';
		$scope.complaintShow = {};
		$scope.complaintShowModal = false;
		$scope.pageLoading = true;
		$scope.dataLoading = true;
		$scope.statusMessage = '';
		$scope.timelineMsg = '';
		$scope.dataShowMsg = '';
		$scope.dataShowErr = 0;
		$scope.recSkip = 0;
		$scope.isLoadingMore = false;
		$scope.isLoadCompleted = false;
		$scope.isShowUpdating = false;


		$scope.loadMore = function() {

			if($scope.isLoadCompleted) return;
			if($scope.isLoadingMore) return;

			$scope.recSkip++;
			console.log($scope.recSkip);
			$scope.isLoadingMore = true;

			populateComplaintsChunk(function(complaints) {
			
				if(!complaints || complaints.length == 0) {
					$scope.isLoadCompleted = true;
				} else {
					for(var i=0; i<complaints.length; i++) {
						$scope.complaints.push(complaints[i]);
					}
				}

				$scope.isLoadingMore = false;

			});
		}


		$scope.refreshComplaints = function() {

			$scope.pageLoading = true;
			$scope.recSkip = 0;
			$scope.isLoadCompleted = false;
			$scope.searchText = '';
			
			populateComplaints(function(newComplaints) {

				$scope.pageLoading = false;
				$scope.complaints = newComplaints;
				$scope.changeShowOption($scope.selectedOption);
			});
		}

		$scope.searchComplaints = function() {

			$scope.pageLoading = true;
			$scope.recSkip = 0;
			$scope.isLoadCompleted = false;
			
			populateComplaints(function(newComplaints) {

				$scope.pageLoading = false;
				$scope.complaints = newComplaints;
				$scope.changeShowOption($scope.selectedOption);
			});
		}

		$scope.refreshComplaints();


		$scope.clickComplaint = function(compid) {

			$scope.dataShowMsg = '';
			$scope.statusMessage = '';
			$scope.dataShowErr = 0;
			$scope.complaintShow = {};
			$scope.dataLoading = true;
			$scope.timelineMsg = '';

			var data = {compid: compid};
			AdminComplaint.getOne({}, data).$promise.then(function(res) {
				console.log(res);
				if(res && res.status === 'suc') {
						
					$scope.complaintShow = res.data;

					if($scope.complaintShow) {
						$scope.complaintShow.createdat = moment($scope.complaintShow.createdat).format("DD MMM YYYY");

						for(var i=0 ; i<$scope.complaintShow.timeline.length ; i++) {
							$scope.complaintShow.timeline[i].date = moment($scope.complaintShow.timeline[i].date).format("DD MMM YYYY");
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
			AdminComplaint.getTimeline({}, data).$promise.then(function(res) {
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


		$scope.removeComplaint = function(compid) {

			bootbox.confirm("Are you sure?", function(result) {
  				if(result) {

					var data = {compid: compid}
					AdminComplaint.markRemove({}, data).$promise.then(function(res) {
						console.log(res);
						if(res && res.status === 'suc' && res.message === 'removed') {

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


		$scope.escalateComplaint = function(compid) {

			var data = {compid: compid}
			AdminComplaint.markEscalate({}, data).$promise.then(function(res) {
				console.log(res);
				if(res && res.status === 'suc' && res.message === 'escalated') {
							
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


		$scope.processingComplaint = function(compid) {

			var data = {compid: compid}
			AdminComplaint.markProcessing({}, data).$promise.then(function(res) {
				console.log(res);
				if(res && res.status === 'suc' && res.message === 'processing') {
							
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


		$scope.resolvedComplaint = function(compid) {

			var data = {compid: compid}
			AdminComplaint.markResolved({}, data).$promise.then(function(res) {
				console.log(res);
				if(res && res.status === 'suc' && res.message === 'resolved') {
							
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


		$scope.$on('complaintAdded', function(event, complaint) {

			console.log('Notifier# complaintAdded - HANDLER');
			complaint.createdat = moment(complaint.createdat).format(MOMENT_DISPLAY_DATE);
			console.log(complaint);
			
	      	$scope.$apply(function() {

		        complaint.new = true;
			    $scope.complaints.unshift(complaint);
			});

			$timeout(function() {
			    delete complaint.new;
		    }, 2000);
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
						if(status === 'Escalated') {
							complaint.isescalated = true;
						}
						complaint.new = true;
						break;
					}
				}
			});

			$timeout(function() {
			    delete complaint.new;
		    }, 2000);
	    });


		$scope.$on('complaintRemovedByMember', function(event, compid) {

			console.log('Notifier# complaintRemovedByMember - HANDLER');
			
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
					$scope.complaintShow.currentstatus = "Removed by Member";

	      		}

				for(var i=0 ; i<$scope.complaints.length ; i++) {

					complaint = $scope.complaints[i];
					if(complaint.compid === compid) {

						complaint.currentstatus = "Removed by Member";
						complaint.new = true;
						break;
					}
				}
			});

			$timeout(function() {
			    delete complaint.new;
		    }, 2000);
	    });


		$scope.$on('complaintRemovedByAdmin', function(event, compid) {

			console.log('Notifier# complaintRemovedByAdmin - HANDLER');
			
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


		function populateComplaints(callback) {

			var complaints = [];
			var data = {search: $scope.searchText};

			AdminComplaint.getAll({}, data).$promise.then(function(res) {
				console.log(res);
				if(res && res.status === 'suc' && res.data) {

					complaints = res.data;

					var d;
					if(complaints) {
						for(var i=0 ; i<complaints.length ; i++) {
	                     	if(complaints[i].createdat) {
	                     		d = complaints[i].createdat;
	                       		complaints[i].createdat = moment(d).format(MOMENT_DISPLAY_DATE);
	                   		}
	                   		if(complaints[i].byflat) {
	           	        		complaints[i].byflat = complaints[i].byflat.toUpperCase();
	                      	}
						}
					}
					
					callback(complaints);

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
			var data = {recSkip: $scope.recSkip, search: $scope.searchText};

			AdminComplaint.getChunk({}, data).$promise.then(function(res) {
				console.log(res);
				if(res && res.status === 'suc' && res.data) {

					complaints = res.data;

					var d;
					if(complaints) {
						for(var i=0 ; i<complaints.length ; i++) {
	                     	if(complaints[i].createdat) {
	                     		d = complaints[i].createdat;
	                       		complaints[i].createdat = moment(d).format(MOMENT_DISPLAY_DATE);
	                   		}
	                   		if(complaints[i].byflat) {
	           	        		complaints[i].byflat = complaints[i].byflat.toUpperCase();
	                      	}
						}
					}
					
					callback(complaints);

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


adminApp
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


adminApp
	.filter('searchFilterComplaints', function () {
  		return function (items, scope) {
 			
  			var filtered = [];

  			if(scope.searchText === '') {
  				filtered = items;
  			} else {

  				angular.forEach(items, function(item) {

	  				if(item.byflat.toLowerCase().indexOf(scope.searchText.toLowerCase()) != -1 ||
	  					item.subject.toLowerCase().indexOf(scope.searchText.toLowerCase()) != -1) {
	  					filtered.push(item);
	  				}
	  			});
  			}

    		return filtered;
  		};
	});