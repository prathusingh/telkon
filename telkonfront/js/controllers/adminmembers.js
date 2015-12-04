'use strict';

var adminApp = angular.module('adminApp');

adminApp
	.controller('MemberListCtrl', ['$rootScope', '$scope', '$timeout', 'AdminMember', 'AdminComplaint',
		function($rootScope, $scope, $timeout, AdminMember, AdminComplaint) {

		$scope.selectedOption = "All";
		$scope.viewOptions = ["All", "Members", "Reported", "Blocked"];
		$scope.members = [];
		$scope.searchText = '';
		$scope.memberShow = {};
		$scope.memberShowModal = false;
		$scope.pageLoading = true;
		$scope.dataLoading = true;
		$scope.complaintsLoading = true;
		$scope.memberDetailsMsg = '';
		$scope.memberComplaintsMsg = '';
		$scope.complaints = [];
		$scope.reportedby = [];
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
			
			populateMembers(function(members) {

				$scope.pageLoading = false;
				$scope.members = members;
				$scope.changeShowOption($scope.selectedOption);
			});
		}

		$scope.searchMembers = function() {

			$scope.pageLoading = true;
			$scope.recSkip = 0;
			$scope.isLoadCompleted = false;
			
			populateMembers(function(members) {

				$scope.pageLoading = false;
				$scope.members = members;
				$scope.changeShowOption($scope.selectedOption);
			});
		}


		$scope.refreshMembers();


		$scope.changeShowOption = function(newOption) {
			$scope.selectedOption = newOption;
		}


		$scope.clickMember = function(memberuid, flat) {

			$scope.dataLoading = true;
			$scope.memberDetailsMsg = '';
			$scope.memberComplaintsMsg = '';
			var data = {memberuid: memberuid};

			AdminMember.getOne({}, data).$promise.then(function(res) {
				console.log(res);
				if(res && res.status === 'suc' && res.data && res.data.member) {
						
					$scope.dataLoading = false;
					$scope.memberShow = res.data.member;

					if($scope.memberShow) {
						$scope.memberShow.membersince = moment($scope.memberShow.membersince).format(MOMENT_DISPLAY_DATE);
						if($scope.memberShow.residencetype == 0) {
	                   		$scope.memberShow.residencetype = 'Owner';
	                   	} else if($scope.memberShow.residencetype == 1) {
	                   		$scope.memberShow.residencetype = 'Tenant';
	                   	}
	                   	if($scope.memberShow.imagedp) {
	                   		$scope.memberShow.imagedp = AWS_URL.IMAGEDP + $scope.memberShow.imagedp;
	                   	}
						if(res.data.reportedby) {
							$scope.reportedby = res.data.reportedby;
						}
					}

				} else {
					
					$scope.dataLoading = false;
					$scope.memberDetailsMsg = ERROR_MEMBER_DETAILS_RETRIEVAL;

				}
			}, function(err) {
				
				$scope.dataLoading = false;
				$scope.memberDetailsMsg = ERROR_MEMBER_DETAILS_RETRIEVAL;
			});

			$scope.complaintsLoading = true;
			$scope.complaints = [];
			data = {flat: flat.toUpperCase()};
			AdminMember.getComplaints({}, data).$promise.then(function(res) {
				console.log(res);
				if(res && res.status === 'suc' && res.data) {
						
					var complaints = [];
					var d;
					complaints = res.data;
					for(var i=0 ; i<complaints.length ; i++) {
                   		if(complaints[i].createdat) {
                   			d = complaints[i].createdat;
        	           		complaints[i].createdat = moment(d).format(MOMENT_DISPLAY_DATE);

        	           		var timeline = complaints[i].timeline;
        	           		var date;
        	           		for(var j=0 ; j<timeline.length ; j++) {
                   				if(timeline[j].date) {
                   					date = timeline[j].date;
        	           				timeline[j].date = moment(date).format(MOMENT_DISPLAY_DATE);
                  				}
                  			}
                  			complaints[i].timeline = timeline;
                  				
                  		}
                  	}
                  	$scope.complaintsLoading = false;
               		$scope.complaints = complaints;

				} else {
					$scope.memberComplaintsMsg  = ERROR_MEMBER_COMPLAINTS_RETRIEVAL;
					$scope.complaintsLoading = false;
				}
			}, function(err) {
				
				$scope.complaintsLoading = false;
				$scope.memberComplaintsMsg = ERROR_MEMBER_COMPLAINTS_RETRIEVAL;
			});
		}

		$scope.removeMember = function(memberuid) {

			bootbox.confirm("Are you sure?", function(result) {
	  			if(result) {
					var data = {memberuid: memberuid}
					AdminMember.markRemove({}, data).$promise.then(function(res) {
						console.log(res);
						if(res && res.status === 'suc') {
							if(res.message === 'removed') {

							} else if(res.message === 'error_self') {
								var alertMessage = {
									value: ERROR_MEMBER_REMOVE_SELF,
									type: 'danger'
								};
								$rootScope.$broadcast('showAlertBox', alertMessage);
							} else if(res.message === 'error_denied') {
								var alertMessage = {
									value: 'Permission Denied',
									type: 'danger'
								};
								$rootScope.$broadcast('showAlertBox', alertMessage);
							} else {
								var alertMessage = {
									value: ERROR_UNKNOWN,
									type: 'danger'
								};
								$rootScope.$broadcast('showAlertBox', alertMessage);
							}
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

		$scope.blockMember = function(memberuid) {

			bootbox.confirm("Are you sure?", function(result) {
	  			if(result) {
					var data = {memberuid: memberuid}
					AdminMember.markBlock({}, data).$promise.then(function(res) {
						console.log(res);

						if(res && res.status === 'suc') {
							if(res.message === 'blocked') {

							} else if(res.message === 'error_self') {
								var alertMessage = {
									value: ERROR_MEMBER_BLOCK_SELF,
									type: 'danger'
								};
								$rootScope.$broadcast('showAlertBox', alertMessage);
							} else {
								var alertMessage = {
									value: ERROR_UNKNOWN,
									type: 'danger'
								};
								$rootScope.$broadcast('showAlertBox', alertMessage);
							}
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

		$scope.unblockMember = function(memberuid) {

			bootbox.confirm("Are you sure?", function(result) {
	  			if(result) {
					var data = {memberuid: memberuid}
					AdminMember.markUnblock({}, data).$promise.then(function(res) {
						console.log(res);
						if(res && res.status === 'suc') {
							if(res.message === 'unblocked') {

							} else if(res.message === 'error_self') {
								var alertMessage = {
									value: ERROR_MEMBER_UNBLOCK_SELF,
									type: 'danger'
								};
								$rootScope.$broadcast('showAlertBox', alertMessage);
							} else {
								var alertMessage = {
									value: ERROR_UNKNOWN,
									type: 'danger'
								};
								$rootScope.$broadcast('showAlertBox', alertMessage);
							}
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

		$scope.cleanMember = function(memberuid) {

			bootbox.confirm("Are you sure?", function(result) {
	  			if(result) {
					var data = {memberuid: memberuid}
					AdminMember.markClean({}, data).$promise.then(function(res) {
						console.log(res);
						if(res && res.status === 'suc') {
							if(res.message === 'cleaned') {

							} else if(res.message === 'error_self') {
								var alertMessage = {
									value: ERROR_MEMBER_CLEAN_SELF,
									type: 'danger'
								};
								$rootScope.$broadcast('showAlertBox', alertMessage);
							} else {
								var alertMessage = {
									value: ERROR_UNKNOWN,
									type: 'danger'
								};
								$rootScope.$broadcast('showAlertBox', alertMessage);
							}
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

		$scope.$on('memberRemovedByAdmin', function(event, uid) {

			console.log('Notifier# memberRemovedByAdmin - HANDLER');
			console.log(uid);
			
	      	$scope.$apply(function() {

	      		var member = {};
	      		for(var i=0 ; i<$scope.members.length ; i++) {

					member = $scope.members[i];
					if(member.uid === uid) {

						$scope.members.splice(i, 1);
						break;
					}

				}
			});
	    });

	    $scope.$on('memberBlockedByAdmin', function(event, uid) {

			console.log('Notifier# memberBlockedByAdmin - HANDLER');
			console.log(uid);
			
	      	$scope.$apply(function() {

	      		var member = {};
	      		for(var i=0 ; i<$scope.members.length ; i++) {

					member = $scope.members[i];
					if(member.uid === uid) {

						$scope.members[i].isblocked = true;
						break;
					}

				}
			});
	    });

		$scope.$on('memberUnblockedByAdmin', function(event, uid) {

			console.log('Notifier# memberUnblockedByAdmin - HANDLER');
			console.log(uid);
			
	      	$scope.$apply(function() {

	      		var member = {};
	      		for(var i=0 ; i<$scope.members.length ; i++) {

					member = $scope.members[i];
					if(member.uid === uid) {

						$scope.members[i].isblocked = false;
						break;
					}

				}
			});
	    });

	    $scope.$on('memberCleanedByAdmin', function(event, uid) {

			console.log('Notifier# memberCleanedByAdmin - HANDLER');
			console.log(uid);
			
	      	$scope.$apply(function() {

	      		var member = {};
	      		for(var i=0 ; i<$scope.members.length ; i++) {

					member = $scope.members[i];
					if(member.uid === uid) {

						$scope.members[i].isreported = false;
						$scope.members[i].reportedby = [];
						break;
					}

				}
			});
	    });

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
			
			if($scope.memberShow.flat !== complaint.byflat) return;

			if(complaint) {
				if(complaint.createdat) {
					complaint.createdat = moment(complaint.createdat).format(MOMENT_DISPLAY_DATE);	
				} else {
					complaint.createdat = moment().format(MOMENT_DISPLAY_DATE);	
				}
				
				if(complaint.timeline[0] && complaint.timeline[0].date) {
					complaint.timeline[0].date = complaint.createdat;
				}
			}				
			
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

	      		var data = {compid: compid};
	      		AdminComplaint.getOne({}, data, function(res) {

	      			console.log(res);
	      			if(res && res.status === 'suc' && res.data) {

	      				for(var i=0 ; i<$scope.complaints.length ; i++) {

							complaint = $scope.complaints[i];
							if(complaint.compid === compid) {

								complaint.currentstatus = status;
								if(status === 'Escalation Requested') {
									complaint.isescalationreq = true;
								} else if(status === 'Escalated') {
									complaint.isescalated = true;
								} else if(status === 'Resolved') {
									complaint.isresolved = true;
								}

								var item = res.data.timeline.pop();
								item.date = moment(item.date).format(MOMENT_DISPLAY_DATE);
								complaint.timeline.push(item);

								complaint.new = true;
								break;
							}
						}
	      			}
	      		});			
				
			});

			$timeout(function() {
			    delete complaint.new;
		    }, 2000);
	    });


		$scope.$on('complaintRemovedByMember', function(event, compid) {

			console.log('Notifier# complaintRemovedByMember - HANDLER');
			
			var complaint;
	      	$scope.$apply(function() {

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


		$scope.$on('familyMemberReported', function(event, reportuid) {

			console.log('Notifier# familyMemberReported - HANDLER');
			console.log(reportuid);
			
			var member;
	      	$scope.$apply(function() {

	      		for(var i=0 ; i<$scope.members.length ; i++) {

					member = $scope.members[i];
					if(member.uid === reportuid) {
						member.isreported = true;
						break;
					}
				}
			});
	    });


		function populateMembers(callback) {

			var members = [];
			var data = {search: $scope.searchText};

			AdminMember.getAll({}, data).$promise.then(function(res) {
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
				console.log(err);
				var message = getErrorVal(err);
				callback(members);
				var alertMessage = {
					value: message,
					type: 'danger'
				};
				$rootScope.$broadcast('showAlertBox', alertMessage);
			});
		}

		function populateMembersChunk(callback) {

			var members = [];
			var data = {recSkip: $scope.recSkip, search: $scope.searchText};

			AdminMember.getChunk({}, data).$promise.then(function(res) {
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


adminApp
	.filter('searchFilterMembers', function () {
  		return function (items, scope) {
 			
  			var filtered = [];

  			if(scope.searchText === '') {
  				filtered = items;
  			} else {

  				angular.forEach(items, function(item) {

	  				if ((item.flat && item.flat.toLowerCase().indexOf(scope.searchText.toLowerCase()) != -1) ||
	  					(item.email && item.email.toLowerCase().indexOf(scope.searchText.toLowerCase()) != -1) ||
	  					(item.name && item.name.toLowerCase().indexOf(scope.searchText.toLowerCase()) != -1)) {

	  						filtered.push(item);
	  				}
	  			});
  			}

    		return filtered;
  		};

	});

adminApp
	.filter('selectedOptionFilterMembers', function () {
  		return function (items, scope) {
  			
  			var filtered = [];

  			if(scope.selectedOption === 'All') {
  				filtered = items;
  			} else {
  				angular.forEach(items, function(item) {
	  				if(scope.selectedOption === 'Members') {
	  					if(!item.isreported && !item.isblocked) {
	  						filtered.push(item);
	  					}
	  				} else if(scope.selectedOption === 'Reported') {
	  					if(item.isreported) {
	  						filtered.push(item);
	  					}
	  				} else if(scope.selectedOption === 'Blocked') {
	  					if(item.isblocked) {
	  						filtered.push(item);
	  					}
	  				}
	  			});
  			}

  			
    		return filtered;
  		};
	});
