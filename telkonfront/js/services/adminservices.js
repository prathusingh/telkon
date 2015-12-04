'use strict';

var apiRootUrl = rootUrl + '/admin';
var adminApp = angular.module('adminApp');

adminApp
  .factory('Admin', function($resource) {

      return $resource(
        rootUrl + '/auth/login/form',
          {},
          {}
        );
   });

adminApp
  .factory('AdminNotice', function ($resource) {

    // broadcastEvents();

    return $resource(
      null, {},
      {
        getAll: {
          method: 'POST',
          url: apiRootUrl + '/notices'
        },
        getChunk: {
          method: 'POST',
          url: apiRootUrl + '/notices/chunk'
        },
        getOne: {
          method: 'POST',
          url: apiRootUrl + '/notice'
        },
        publish: {
          method: 'POST',
          url: apiRootUrl + '/notice/compose'
        },
        markRemove: {
          method: 'POST',
          url: apiRootUrl + '/notice/remove'
        }
      }
    );
  });


adminApp
  .factory('AdminComplaint', function ($resource) {

    // broadcastEvents();

    return $resource(
      null, {},
      {
        getAll: {
          method: 'POST',
          url: apiRootUrl + '/complaints'
        },
        getChunk: {
          method: 'POST',
          url: apiRootUrl + '/complaints/chunk'
        },
        getOne: {
          method: 'POST',
          url: apiRootUrl + '/complaint'
        },
        getTimeline: {
          method: 'POST',
          url: apiRootUrl + '/complaint/timeline'
        },
        markEscalate: {
          method: 'POST',
          url: apiRootUrl + '/complaint/escalate'
        },
        markProcessing: {
          method: 'POST',
          url: apiRootUrl + '/complaint/processing'
        },
        markResolved: {
          method: 'POST',
          url: apiRootUrl + '/complaint/resolved'
        },
        markRemove: {
          method: 'POST',
          url: apiRootUrl + '/complaint/remove'
        },
        addComment: {
          method: 'POST',
          url: apiRootUrl + '/complaint/comment'
        }
      }
    );
  });

adminApp
  .factory('AdminContact', function ($resource) {

    return $resource(
      null, {},
      {
        getContacts: {
          method: 'POST',
          url: apiRootUrl + '/contacts'
        },
        getContactsByCategory: {
          method: 'POST',
          url: apiRootUrl + '/contacts/category'
        },
        addContact: {
          method: 'POST',
          url: apiRootUrl + '/contact/add'
        },
        updateContact: {
          method: 'POST',
          url: apiRootUrl + '/contact/update'
        },
        removeContact: {
          method: 'POST',
          url: apiRootUrl + '/contact/remove'
        },
      }
    );
  });

adminApp
  .factory('AdminProfile', function ($resource) {

    return $resource(
      null, {},
      {
        getBootData: {
          method: 'POST',
          url: apiRootUrl + '/profile/boot'
        },
        getName: {
          method: 'POST',
          url: apiRootUrl + '/profile/name'
        },
        updateName: {
          method: 'POST',
          url: apiRootUrl + '/profile/update/name'
        },
        updatePhone: {
          method: 'POST',
          url: apiRootUrl + '/profile/update/phone'
        },
        updatePosition: {
          method: 'POST',
          url: apiRootUrl + '/profile/update/position'
        },
        updateDepartment: {
          method: 'POST',
          url: apiRootUrl + '/profile/update/department'
        },
        updateImagedp: {
          method: 'POST',
          url: apiRootUrl + '/profile/update/imagedp'
        },
        getProfileData: {
          method: 'POST',
          url: apiRootUrl + '/profile/data'
        },
        getSocietyInfo: {
          method: 'POST',
          url: apiRootUrl + '/society/info'
        },
        updateFlatsample: {
          method: 'POST',
          url: apiRootUrl + '/society/update/flatsample'
        },
        updateLayoutflats: {
          method: 'POST',
          url: apiRootUrl + '/society/update/layoutflats'
        },
        resetPassword: {
          method: 'POST',
          url: apiRootUrl + '/profile/reset/password'
        },
        becomeMember: {
          method: 'POST',
          url: apiRootUrl + '/profile/becomemember'
        },
        logout: {
          method: 'POST',
          url: apiRootUrl + '/logout',
        },
        suspendAccount: {
          method: 'POST',
          url: apiRootUrl + '/suspend',
        },
        deleteAccount: {
          method: 'POST',
          url: apiRootUrl + '/delete',
        }
      }
    );
  });

adminApp
  .factory('AdminMember', function ($resource) {

    return $resource(
      null, {},
      {
        getAll: {
          method: 'POST',
          url: apiRootUrl + '/members'
        },
        getChunk: {
          method: 'POST',
          url: apiRootUrl + '/members/chunk'
        },
        getOne: {
          method: 'POST',
          url: apiRootUrl + '/member'
        },
        getComplaints: {
          method: 'POST',
          url: apiRootUrl + '/member/complaints'
        },
        markRemove: {
          method: 'POST',
          url: apiRootUrl + '/member/remove'
        },
        markBlock: {
          method: 'POST',
          url: apiRootUrl + '/member/block'
        },
        markUnblock: {
          method: 'POST',
          url: apiRootUrl + '/member/unblock'
        },
        markClean: {
          method: 'POST',
          url: apiRootUrl + '/member/clean'
        }
      }
    );
  });

adminApp
  .factory('AdminAdmin', function ($resource) {

    return $resource(
      null, {},
      {
        getAll: {
          method: 'POST',
          url: apiRootUrl + '/admins'
        },
        getOne: {
          method: 'POST',
          url: apiRootUrl + '/admin'
        },
        addAdmin: {
          method: 'POST',
          url: apiRootUrl + '/admin/add'
        },
        removeAdmin: {
          method: 'POST',
          url: apiRootUrl + '/admin/remove'
        }
      }
    );
  });

adminApp
  .factory('AdminPoll', function ($resource) {

    return $resource(
      null, {},
      {
        getAll: {
          method: 'POST',
          url: apiRootUrl + '/polls'
        },
        getOne: {
          method: 'POST',
          url: apiRootUrl + '/poll'
        },
        launchPoll: {
          method: 'POST',
          url: apiRootUrl + '/poll/add'
        },
        removePoll: {
          method: 'POST',
          url: apiRootUrl + '/poll/remove'
        }
      }
    );
  });

adminApp
  .factory('AdminNotification', function ($resource) {

    return $resource(
      null, {},
      {
        getAll: {
          method: 'POST',
          url: apiRootUrl + '/notifications'
        },
        getChunk: {
          method: 'POST',
          url: apiRootUrl + '/notifications/chunk'
        },
        clearTotal: {
          method: 'POST',
          url: apiRootUrl + '/notifications/cleartotal'
        }
      }
    );
  });

adminApp
  .factory('AdminRules', function ($resource) {

    return $resource(
      null, {},
      {
        getAll: {
          method: 'POST',
          url: apiRootUrl + '/rules'
        },
        edit: {
          method: 'POST',
          url: apiRootUrl + '/rules/edit'
        }
      }
    );
  });
