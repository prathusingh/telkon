'use strict';

var othersApp = angular.module('othersApp');

othersApp
	.factory('Other', function($resource) {

  		return $resource(
  			rootUrl + '/auth/login/form',
  			{},
  			{
          logout: {
            method: 'POST',
            url: rootUrl + '/user/logout'
          },
          suspend: {
            method: 'POST',
            url: rootUrl + '/user/suspend'
          },
          getProfileData: {
                method: 'POST',
                url: apiRootUrl + '/profile/data'
            },
  			});
	});