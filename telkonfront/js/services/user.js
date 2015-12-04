'use strict';

var websiteApp = angular.module('websiteApp');

websiteApp
	.factory('User', function($resource) {

  		return $resource(
  			rootUrl + '/auth/login/form',
  			{},
  			{
  				login: {
  					method: 'POST',
  					url: rootUrl + '/auth/login/form',
  				},
          getGoogleAuthUrl: {
            method: 'GET',
            url: rootUrl + '/auth/login/google/url',
          },
          googlelogin: {
            method: 'POST',
            url: rootUrl + '/auth/login/google',
          },
  				register: {
  					method: 'POST',
  					url: rootUrl + '/auth/register/form',
  				},
          registerAdmin: {
            method: 'POST',
            url: rootUrl + '/auth/register/admin',
          },
          createSociety: {
            method: 'POST',
            url: rootUrl + '/user/create/society',
          },
          recover: {
            method: 'POST',
            url: rootUrl + '/auth/recover',
          },
          logout: {
            method: 'POST',
            url: rootUrl + '/user/logout'
          },
          getCities: {
            method: 'GET',
            url: rootUrl + '/user/cities'
          },
          getSocieties: {
            method: 'POST',
            url: rootUrl + '/user/societies/:city',
            params: {city: '@city'}
          },
          postPersonal: {
              method: 'POST',
              url: rootUrl + '/user/personal'
          },
          postOfficial: {
              method: 'POST',
              url: rootUrl + '/user/official',
          },
          details: {
            method: 'POST',
            url: rootUrl + '/user/details'
          },
          profile: {
            method: 'POST',
            url: rootUrl + '/user/profile'
          },
          newDetails: {
            method: 'POST',
            url: rootUrl + '/user/new/details'
          },
          suspend: {
            method: 'POST',
            url: rootUrl + '/user/suspend'
          }
  			});
	});