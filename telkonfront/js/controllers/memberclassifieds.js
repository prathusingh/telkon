'use strict';

var memberApp = angular.module('memberApp');

memberApp
	.controller('ClassifiedsCtrl', ['$rootScope', '$scope', '$timeout', 'MemberClassified',
		function($rootScope, $scope, $timeout, MemberClassified) {


		$scope.selectedOption = "All";
		$scope.viewOptions = ["All", "Read", "Unread"];
		$scope.classifieds = [];
		$scope.classifiedsDummy = [];
		$scope.classifiedsRead = [];
		$scope.savedClassifieds = [];
		$scope.classifiedShow = null;
		$scope.classifiedTypes = ["Others"];
		$scope.classifiedTypesLoading = true;
		$scope.categorySelected = '';
		$scope.title = '';
		$scope.details = '';
		$scope.searchText = '';
		$scope.pageLoading = true;
		$scope.dataLoading = false;
		$scope.classifiedShowMsg = '';
		$scope.errorCode = 0;
		$scope.addMessage = '';
		$scope.recSkip = 0;
		$scope.isLoadingMore = false;
		$scope.isLoadCompleted = false;
		$scope.dataShowMsg = '';
		$scope.dataShowErr = 0;


		$scope.refreshClassifieds = function() {

			$scope.pageLoading = true;
			$scope.recSkip = 0;
			$scope.isLoadCompleted = false;
			$scope.searchText = '';

			populateClassifieds(function(classifieds, classifiedsread, savedclassifieds) {
			
				$scope.classifiedsDummy = classifieds;
				//console.log($scope.classifiedsDummy);
				$scope.classifieds = classifieds;
				$scope.classifiedsRead = classifiedsread;
				$scope.savedClassifieds = savedclassifieds;
				$scope.changeShowOption($scope.selectedOption);
				$scope.pageLoading = false;

			});
		}
		
		$scope.searchClassifieds = function() {

			$scope.pageLoading = true;
			$scope.recSkip = 0;
			$scope.isLoadCompleted = false;

			populateClassifieds(function(classifieds, classifiedsread, savedclassifieds) {
			
				$scope.classifieds = classifieds;
				$scope.classifiedsread = classifiedsread;
				$scope.savedclassifieds = savedclassifieds;
				$scope.changeShowOption($scope.selectedOption);
				$scope.pageLoading = false;

			});
		}

		$scope.clearForm = function() {
			$scope.categorySelected = '';
			$scope.title = '';
			$scope.details = '';
			$scope.classifiedShowMsg = '';
			$scope.errorCode = 0;
			$scope.addMessage = '';
		}

		$scope.$watch('classifieds', function(val) {
  			//$scope.classifieds = [].concat.apply([], val);
  			console.log(val);
		}, true); // deep watch

		$scope.loadMore = function() {
		
			if($scope.isLoadCompleted) return;
			if($scope.isLoadingMore) return;

			$scope.recSkip++;
			console.log($scope.recSkip);
			$scope.isLoadingMore = true;

			populateClassifiedsChunk(function(classifieds) {
			
				if(!classifieds || classifieds.length == 0) {
					$scope.isLoadCompleted = true;
				} else {
					for(var i=0; i<classifieds.length; i++) {
						//console.log(classifieds[i]);
						$scope.classifieds.push(classifieds[i]);
					}
				}

				//$scope.$apply(function() {

					
					//$scope.$apply();
					//$scope.classifieds = [];
					//$scope.classifieds = chunk($scope.classifiedsDummy, 2);
				//});

				$scope.isLoadingMore = false;

			});
		
		}

		$scope.refreshClassifieds();

		$scope.clickClassified = function(cid) {

			$scope.classifiedShow = null;
			$scope.dataLoading = true;
			$scope.dataShowMsg = '';
			$scope.dataShowErr = 0;

			var data = {cid: cid};

			MemberClassified.getOne({}, data).$promise.then(function(res) {
				console.log(res);
				if(res && res.status === 'suc') {
					if(res.data) {

						$scope.classifiedShow = res.data;

						if($scope.classifiedShow.createdat) {
							$scope.classifiedShow.createdat = moment($scope.classifiedShow.createdat).format(MOMENT_DISPLAY_DATE);
						}
						
						if($scope.classifiedShow.byimagedp) {
							$scope.classifiedShow.byimagedp = AWS_URL.IMAGEDP + $scope.classifiedShow.byimagedp;
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

			if($scope.classifiedsRead.indexOf(cid) == -1) {
				$scope.classifiedsRead.push(cid);

				MemberClassified.markRead({}, data).$promise.then(function(res) {
					console.log(res);
				});
			}
		}

		$scope.saveClassified = function() {

			var cid = $scope.classifiedShow.cid;

			if($scope.savedClassifieds.indexOf(cid) == -1) {

				var data = {cid: cid}

				MemberClassified.markSave({}, data).$promise.then(function(res) {
					console.log(res);

					if(res && res.status === 'suc' && res.message === 'saved') {

						var alertMessage = {
							value: SUC_CLASSIFIED_SAVED,
							type: 'success'
						};
						$rootScope.$broadcast('showAlertBox', alertMessage);
						$scope.savedClassifieds.push(cid);

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

		$scope.unsaveClassified = function() {

			var cid = $scope.classifiedShow.cid;
			var index = $scope.savedClassifieds.indexOf(cid);

			if(index != -1) {

				bootbox.confirm("Are you sure?", function(result) {
  					if(result) {
						var data = {cid: cid}
						MemberClassified.markUnsave({}, data).$promise.then(function(res) {
							console.log(res)
							if(res && res.status === 'suc' && res.message === 'unsaved') {

								var alertMessage = {
									value: SUC_CLASSIFIED_UNSAVED,
									type: 'success'
								};
								$rootScope.$broadcast('showAlertBox', alertMessage);
								$scope.savedClassifieds.splice(index, 1);
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
		}

		$scope.getClassifiedTypes = function() {

			MemberClassified.getTypes({}).$promise.then(function(res) {
				console.log(res);
				if(res && res.status === 'suc' && res.data) {
					$scope.classifiedTypes = res.data;
					$scope.classifiedTypesLoading = false;
				} else {
					$scope.addMessage = ERROR_CLASSIFIED_TYPES;
					$scope.classifiedTypesLoading = false;
				}
			}, function(err) {
				console.log(err);
				$scope.addMessage = ERROR_CLASSIFIED_TYPES;
				$scope.classifiedTypesLoading = false;
			});
		}


		$scope.changeShowOption = function(newOption) {
			$scope.selectedOption = newOption;
		}


		$scope.postClassified = function() {


			$scope.dataLoading = true;
			$scope.errorCode = 0;
			$scope.addMessage = '';

			if(!$scope.categorySelected) {
				$scope.errorCode = 1;
				$scope.addMessage = ERROR_COMPLAINT_EMPTY_CATEGORY;
				$scope.dataLoading = false;
			} else if(!$scope.title) {
				$scope.errorCode = 2;
				$scope.addMessage = ERROR_COMPLAINT_EMPTY_TITLE;
				$scope.dataLoading = false;
			} else if(!$scope.details) {
				$scope.errorCode = 3;
				$scope.addMessage = ERROR_COMPLAINT_EMPTY_DETAILS;
				$scope.dataLoading = false;
			} else {

				var data = {};
				data.category = $scope.categorySelected;
				data.title = $scope.title;
				data.details = $scope.details;

				MemberClassified.addNew({}, data).$promise.then(function(res) {
					console.log(res);
					if(res && res.status === 'suc' && res.message === 'added') {

						$scope.dataLoading = false;
						$scope.categorySelected = '';
						$scope.title = '';
						$scope.details = '';
						$scope.addMessage = SUC_CLASSIFIED_POSTED;

					} else {

						$scope.dataLoading = false;
						$scope.errorCode = -1;
						$scope.addMessage = ERROR_UNKNOWN;

					}
				}, function(err) {
					var message = getErrorVal(err);
					$scope.addMessage = message;
					$scope.errorCode = -1;
					$scope.dataLoading = false;
					
				});
			}
		}

		$scope.$on('classifiedAdded', function(event, classified) {

			console.log('Notifier# complaintAdded - HANDLER');
			
			if(classified.createdat) {
				classified.createdat = moment(classified.createdat).format(MOMENT_DISPLAY_DATE);
			}

			if(classified.byimagedp) {
				classified.byimagedp = AWS_URL.IMAGEDP + classified.byimagedp;
			}
			
	      	$scope.$apply(function() {

		        classified.new = true;
		        $scope.classifieds.unshift(classified);
			    
			});

			$timeout(function() {
			    delete classified.new;
		    }, 2000);
	    });

	    $scope.$on('classifiedRemoved', function(event, cid) {

			console.log('Notifier# classifiedRemoved - HANDLER');
			
			var classified;
	      	$scope.$apply(function() {
				
				for(var i=0 ; i<$scope.classifieds.length ; i++) {

					classified = $scope.classifieds[i];
					if(classified.cid === cid) {
						$scope.classifieds.splice(i, 1);
						break;
					}
				}
			});
	    });

		function populateClassifieds(callback) {

			var classifieds = [];
			var classifiedsread = [];
			var savedclassifieds = [];

			var data = {search: $scope.searchText};

			MemberClassified.getAll({}, data).$promise.then(function(res) {
				console.log(res);

				if(res && res.status === 'suc' && res.data) {

					classifieds = res.data.classifieds;
					classifiedsread = res.data.classifiedsread
					savedclassifieds = res.data.savedclassifieds;

					if(classifieds) {

						for(var i=0 ; i<classifieds.length ; i++) {
                   			if(classifieds[i].createdat) {
        	           			classifieds[i].createdat = moment(classifieds[i].createdat).format(MOMENT_DISPLAY_DATE);
                      		}

                      		if(classifieds[i].byimagedp) {
        	           			classifieds[i].byimagedp = AWS_URL.IMAGEDP + classifieds[i].byimagedp;
                      		}
                  		}
					}
					callback(classifieds, classifiedsread, savedclassifieds);
				} else {

					callback(classifieds, classifiedsread, savedclassifieds);
					var alertMessage = {
						value: ERROR_UNKNOWN,
						type: 'danger'
					};
					$rootScope.$broadcast('showAlertBox', alertMessage);
				}

			}, function(err) {
				var message = getErrorVal(err);
				callback(classifieds, classifiedsread, savedclassifieds);
				var alertMessage = {
					value: message,
					type: 'danger'
				};
				$rootScope.$broadcast('showAlertBox', alertMessage);
			});
		}

		function populateClassifiedsChunk(callback) {

			var classifieds = [];

			var data = {recSkip: $scope.recSkip, search: $scope.searchText};
			MemberClassified.getChunk({}, data).$promise.then(function(res) {
				console.log(res);

				if(res && res.status === 'suc' && res.data) {

					classifieds = res.data;

					if(classifieds) {

						for(var i=0 ; i<classifieds.length ; i++) {
                   			if(classifieds[i].createdat) {
        	           			classifieds[i].createdat = moment(classifieds[i].createdat).format(MOMENT_DISPLAY_DATE);
                      		}

                      		if(classifieds[i].byimagedp) {
        	           			classifieds[i].byimagedp = AWS_URL.IMAGEDP + classifieds[i].byimagedp;
                      		}
                  		}
					}
					callback(classifieds);
				} else {

					callback(classifieds);
					var alertMessage = {
						value: ERROR_UNKNOWN,
						type: 'danger'
					};
					$rootScope.$broadcast('showAlertBox', alertMessage);
				}

			}, function(err) {
				var message = getErrorVal(err);
				callback(classifieds);
				var alertMessage = {
					value: message,
					type: 'danger'
				};
				$rootScope.$broadcast('showAlertBox', alertMessage);
			});
		}
	}]);


memberApp
	.controller('MyClassifiedsCtrl', ['$rootScope', '$scope', '$timeout', 'MemberClassified',
		function($rootScope, $scope, $timeout, MemberClassified) {

		$scope.myclassifieds = [];
		$scope.myClassifiedShow = null;
		$scope.dataShowMsg = '';
		$scope.dataShowErr = 0;
		$scope.pageLoading = true;
		$scope.dataLoading = true;

		populateMyClassifieds(function(classifieds) {

			$scope.pageLoading = false;
			$scope.myclassifieds = classifieds;

		});


		$scope.refreshMyClassifieds = function() {

			$scope.pageLoading = true;
			populateMyClassifieds(function(classifieds) {

				$scope.pageLoading = false;
				$scope.myclassifieds = classifieds;
			});

		}

		$scope.clickMyClassified = function(classified) {

			$scope.dataLoading = true;
			$scope.dataShowMsg = '';
			$scope.dataShowErr = 0;

			var data = {cid: classified.cid};
			MemberClassified.getMyClassifiedOne({}, data).$promise.then(function(res) {

				console.log(res);
				if(res && res.status === 'suc' && res.data) {

					$scope.myClassifiedShow= res.data;
					$scope.myClassifiedShow.createdat = moment($scope.myClassifiedShow.createdat).format(MOMENT_DISPLAY_DATE);

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

		$scope.removeMyClassified = function(classified) {

			bootbox.confirm("Are you sure?", function(result) {
  				if(result) {
					var data = {cid: classified.cid};
					MemberClassified.markMyClassifiedRemove({}, data).$promise.then(function(res) {

						console.log(res);
						if(res && res.status === 'suc' && res.message === 'removed') {

							var alertMessage = {
								value: SUC_MYCLASSIFIED_REMOVED,
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
			});
		}

		$scope.$on('classifiedRemoved', function(event, cid) {

			console.log('Notifier# classifiedRemoved - HANDLER');
			
			var classified;
	      	$scope.$apply(function() {
				
				for(var i=0 ; i<$scope.myclassifieds.length ; i++) {

					classified = $scope.myclassifieds[i];
					if(classified.cid === cid) {
						$scope.myclassifieds.splice(i, 1);
						break;
					}
				}
			});
	    });



		function populateMyClassifieds(callback) {

			var classifieds = [];
			MemberClassified.getMyClassifieds({},{}).$promise.then(function(res) {
				console.log(res);
				if(res && res.status === 'suc' && res.data) {

					classifieds = res.data;
					for(var i=0 ; i<classifieds.length ; i++) {
                   		if(typeof classifieds[i].createdat !== 'undefined') {
                        	classifieds[i].createdat = moment(classifieds[i].createdat).format(MOMENT_DISPLAY_DATE);
                      	}
                  	}
					callback(classifieds);
				
				} else {

					callback(classifieds);
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
				callback(classifieds);
			});
		}
	}]);


memberApp
	.controller('SavedClassifiedsCtrl', ['$rootScope', '$scope', '$timeout', 'MemberClassified',
		function($rootScope, $scope, $timeout, MemberClassified) {

		$scope.savedclassifieds = [];
		$scope.savedClassifiedShow = null;
		$scope.pageLoading = true;
		$scope.dataLoading = true;
		$scope.dataShowMsg = '';
		$scope.dataShowErr = 0;

		populateSavedClassifieds(function(classifieds) {

			$scope.pageLoading = false;
			$scope.savedclassifieds = classifieds;
		});


		$scope.refreshSavedClassifieds = function() {

			$scope.pageLoading = true;
			populateSavedClassifieds(function(classifieds) {

				$scope.pageLoading = false;
				$scope.savedclassifieds = classifieds;
			});

		}

		$scope.clickSavedClassified = function(cid) {

			$scope.dataLoading = true;
			$scope.dataShowMsg = '';
			$scope.dataShowErr = 0;

			var data = {cid: cid};
			MemberClassified.getSavedClassifiedOne({}, data).$promise.then(function(res) {

				console.log(res);
				if(res && res.status === 'suc') {

					$scope.savedClassifiedShow= res.data;

					if($scope.savedClassifiedShow) {

						if($scope.savedClassifiedShow.createdat) {
							$scope.savedClassifiedShow.createdat = moment($scope.savedClassifiedShow.createdat).format(MOMENT_DISPLAY_DATE);
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
				var message =  getErrorVal(err);
				$scope.dataShowMsg = message;
				$scope.dataShowErr = -1;
				$scope.dataLoading = false;
			});
		}

		$scope.removeSavedClassified = function(classified) {

			bootbox.confirm("Are you sure?", function(result) {
  				if(result) {
					var data = {cid: classified.cid};
					MemberClassified.markSavedClassifiedRemove({}, data).$promise.then(function(res) {

						console.log(res);
						if(res && res.status === 'suc' && res.message === 'unsaved') {

							var index = $scope.savedclassifieds.indexOf(classified);
							$scope.savedclassifieds.splice(index, 1);

							var alertMessage = {
								value: SUC_SAVEDCLASSIFIEDS_REMOVED,
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
						var message =  getErrorVal(err);
						$scope.dataShowMsg = message;
						$scope.dataShowErr = -1;
						$scope.dataLoading = false;	
						var alertMessage = {
							value: message,
							type: 'danger'
						};
						$rootScope.$broadcast('showAlertBox', alertMessage);
					});
				}
			});

		}


		function populateSavedClassifieds(callback) {

			var classifieds = [];
			MemberClassified.getSavedClassifieds({},{}).$promise.then(function(res) {
				console.log(res);
				if(res && res.status === 'suc' && res.data) {

					classifieds = res.data;
					for(var i=0 ; i<classifieds.length ; i++) {
                      	if(classifieds[i].createdat) {
                        	classifieds[i].createdat = moment(classifieds[i].createdat).format(MOMENT_DISPLAY_DATE);
                      	}
                  	}
					callback(classifieds);

				} else {

					callback(classifieds);
					var alertMessage = {
						value: 'Unknown Error!',
						type: 'danger'
					};
					$rootScope.$broadcast('showAlertBox', alertMessage);
				}

			}, function(err) {
				var message =  getErrorVal(err);
				var alertMessage = {
					value: message,
					type: 'danger'
				};
				$rootScope.$broadcast('showAlertBox', alertMessage);
				callback(classifieds);
			});
		}	
	}]);


memberApp
	.filter('selectedOptionFilterClassifieds', function () {
  		return function (items, scope) {
  			
  			var filtered = [];

  			if(scope.selectedOption === 'All') {
  				filtered = items;
  			} else {
  				angular.forEach(items, function(item) {
	  				if(scope.selectedOption === 'Read') {
	  					if(scope.classifiedsRead.indexOf(item.cid) != -1) {
	  						filtered.push(item);
	  					}
	  				} else if(scope.selectedOption === 'Unread') {
	  					if(scope.classifiedsRead.indexOf(item.cid) == -1) {
	  						filtered.push(item);
	  					}
	  				} else if(item.type === scope.selectedOption) {
	  					filtered.push(item);
	  				}

	  			});
  			}
  			
    		return filtered;
  		};
	});


memberApp
	.filter('searchFilterClassifieds', function () {
  		return function (items, scope) {
 			
  			var filtered = [];

  			if(scope.searchText === '') {
  				filtered = items;
  			} else {

  				angular.forEach(items, function(item) {

	  				if(item && ((item.title &&item.title.toLowerCase().indexOf(scope.searchText.toLowerCase())) != -1 ||
	  					(item.category && item.category.toLowerCase().indexOf(scope.searchText.toLowerCase())) != -1)) {

	  					filtered.push(item);
	  				}
	  			});
  			}

    		return filtered;
  		};
	});





	

