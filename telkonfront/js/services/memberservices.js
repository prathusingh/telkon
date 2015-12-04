'use strict';

var apiRootUrl = rootUrl + '/member';

var memberApp = angular.module('memberApp');

memberApp
  .factory('Member', function($resource) {

      return $resource(
        rootUrl + '/auth/login/form',
          {},
          {
            getUser: {
              method: 'POST',
              url: apiRootUrl + '/user'
            },
            getUserClubs: {
              method: 'POST',
              url: apiRootUrl + '/user/clubs'
            },
            getSociety: {
              method: 'POST',
              url: apiRootUrl + '/society'
            },
            getSocietyMembers: {
              method: 'POST',
              url: apiRootUrl + '/society/members'
            },
            getSocietyClubs: {
              method: 'POST',
              url: apiRootUrl + '/society/clubs'
            }
          }
        );
   });


memberApp
  .factory('MemberNotice', function ($resource) {

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
        markRead: {
          method: 'POST',
          url: apiRootUrl + '/notice/read'
        },
        markSave: {
          method: 'POST',
          url: apiRootUrl + '/notice/save'
        },
        markUnsave: {
          method: 'POST',
          url: apiRootUrl + '/notice/unsave'
        },

        /* SAVED NOTICES */
        getSavedNotices: {
          method: 'POST',
          url: apiRootUrl + '/savednotices'
        },
        getSavedNoticeOne: {
          method: 'POST',
          url: apiRootUrl + '/notice'
        },
        markSavedNoticeRemove: {
          method: 'POST',
          url: apiRootUrl + '/notice/unsave'
        }
      }
    );
  });


memberApp
  .factory('MemberComplaint', function ($resource) {

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
        getTypes: {
          method: 'POST',
          url: apiRootUrl + '/complaint/types'
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
        markRemove: {
          method: 'POST',
          url: apiRootUrl + '/complaint/remove'
        },
        addNew: {
          method: 'POST',
          url: apiRootUrl + '/complaint/add'
        }
      }
    );
  });


memberApp
  .factory('MemberClassified', function ($resource) {

    return $resource(
      null, {},
      {
        getAll: {
          method: 'POST',
          url: apiRootUrl + '/classifieds'
        },
        getChunk: {
          method: 'POST',
          url: apiRootUrl + '/classifieds/chunk'
        },
        getTypes: {
          method: 'POST',
          url: apiRootUrl + '/classified/types'
        },
        getOne: {
          method: 'POST',
          url: apiRootUrl + '/classified'
        },
        markRead: {
          method: 'POST',
          url: apiRootUrl + '/classified/read'
        },
        markSave: {
          method: 'POST',
          url: apiRootUrl + '/classified/save'
        },
        markUnsave: {
          method: 'POST',
          url: apiRootUrl + '/classified/unsave'
        },
        addNew: {
          method: 'POST',
          url: apiRootUrl + '/classified/add'
        },

        /* MY CLASSIFIEDS */
        getMyClassifieds: {
          method: 'POST',
          url: apiRootUrl + '/myclassifieds'
        },
        getMyClassifiedOne: {
          method: 'POST',
          url: apiRootUrl + '/classified'
        },
        markMyClassifiedRemove: {
          method: 'POST',
          url: apiRootUrl + '/myclassified/remove'
        },

        /* SAVED CLASSIFIEDS */
        getSavedClassifieds: {
          method: 'POST',
          url: apiRootUrl + '/savedclassifieds'
        },
        getSavedClassifiedOne: {
          method: 'POST',
          url: apiRootUrl + '/classified'
        },
        markSavedClassifiedRemove: {
          method: 'POST',
          url: apiRootUrl + '/classified/unsave'
        }
      }
    );
  });


memberApp
  .factory('MemberContact', function ($resource) {

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
        }
      }
    );
  });


memberApp
  .factory('MemberForum', function ($resource) {

    return $resource(
      null, {},
      {
        getAll: {
          method: 'POST',
          url: apiRootUrl + '/forums'
        },
        getChunk: {
          method: 'POST',
          url: apiRootUrl + '/forums/chunk'
        },
        getOne: {
          method: 'POST',
          url: apiRootUrl + '/forum'
        },
        getCommentsChunk: {
          method: 'POST',
          url: apiRootUrl + '/forum/comments/chunk'
        },
        markRead: {
          method: 'POST',
          url: apiRootUrl + '/forum/read'
        },
        markFav: {
          method: 'POST',
          url: apiRootUrl + '/forum/favorite'
        },
        unmarkFav: {
          method: 'POST',
          url: apiRootUrl + '/forum/unfavorite'
        },
        addNew: {
          method: 'POST',
          url: apiRootUrl + '/forum/add'
        },
        postComment: {
          method: 'POST',
          url: apiRootUrl + '/forum/comment/add'
        },
        postEmoticon: {
          method: 'POST',
          url: apiRootUrl + '/forum/emo'
        },

        /* My FORUMS */
        getMyForums: {
          method: 'POST',
          url: apiRootUrl + '/myforums'
        },
        getMyForumOne: {
          method: 'POST',
          url: apiRootUrl + '/forum'
        },
        getMyForumCommentsChunk: {
          method: 'POST',
          url: apiRootUrl + '/forum/comments/chunk'
        },
        markMyForumRemove: {
          method: 'POST',
          url: apiRootUrl + '/myforum/remove'
        },
        postComment: {
          method: 'POST',
          url: apiRootUrl + '/forum/comment/add'
        },
        postEmoticon: {
          method: 'POST',
          url: apiRootUrl + '/forum/emo'
        },
      }
    );
  });


memberApp
  .factory('MemberClub', function ($resource) {

    return $resource(
      null, {},
      {

        /* CLUBS */
        getAll: {
          method: 'POST',
          url: apiRootUrl + '/clubs'
        },
        getChunk: {
          method: 'POST',
          url: apiRootUrl + '/clubs/chunk'
        },
        getOne: {
          method: 'POST',
          url: apiRootUrl + '/club'
        },
        markSubscribe: {
          method: 'POST',
          url: apiRootUrl + '/club/subscribe'
        },
        unmarkSubscribe: {
          method: 'POST',
          url: apiRootUrl + '/club/unsubscribe'
        },
        getTypes: {
          method: 'GET',
          url: apiRootUrl + '/club/categories'
        },
        addNew: {
          method: 'POST',
          url: apiRootUrl + '/club/add'
        },

        /* CLUB PAGE */
        getMembersChunk:{
          method: 'POST',
          url: apiRootUrl + '/club/members/chunk'
        },
        getEventsChunk: {
          method: 'POST',
          url: apiRootUrl + '/club/events/chunk'
        },
        getPostsChunk: {
          method: 'POST',
          url: apiRootUrl + '/club/posts/chunk'
        },
        addNewEvent: {
          method: 'POST',
          url: apiRootUrl + '/club/event/add'
        },
        addNewPost: {
          method: 'POST',
          url: apiRootUrl + '/club/post/add'
        },
        updatePageImagedp: {
          method: 'POST',
          url: apiRootUrl + '/club/update/imagedp'
        },

        /* CLUB MEMBERS */
        getMembersChunk: {
          method: 'POST',
          url: apiRootUrl + '/club/members/chunk'
        },

        /* My CLUBS */
        getMyClubs: {
          method: 'POST',
          url: apiRootUrl + '/myclubs'
        }
      }
    );
  });

memberApp
  .factory('MemberSidenav', function ($resource) {

    return $resource(
      null, {},
      {

        /* MEMBERS */
        getMembersChunk: {
          method: 'POST',
          url: apiRootUrl + '/members/chunk'
        }
      }
    );
  });


memberApp
  .factory('MemberProfile', function ($resource) {

    return $resource(
      null, {},
      {

        /* PROFILE */
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
        updateAboutme: {
          method: 'POST',
          url: apiRootUrl + '/profile/update/aboutme'
        },
        updatePhone: {
          method: 'POST',
          url: apiRootUrl + '/profile/update/phone'
        },
        updateImagedp: {
          method: 'POST',
          url: apiRootUrl + '/profile/update/imagedp'
        },
        getProfileData: {
          method: 'POST',
          url: apiRootUrl + '/profile/data'
        },

        /* FAMILY */
        getFamily: {
          method: 'POST',
          url: apiRootUrl + '/family'
        },
        reportFamily: {
          method: 'POST',
          url: apiRootUrl + '/family/report'
        },

        /* SOCIETY INFO */
        getSocietyInfo: {
          method: 'POST',
          url: apiRootUrl + '/profile/society/info'
        },

        /* RESET PASSWORD */
        resetPassword: {
          method: 'POST',
          url: apiRootUrl + '/profile/reset/password'
        },

        /* LOGOUT */
        logout: {
          method: 'POST',
          url: apiRootUrl + '/logout',
        },

        /* ACCOUNT */
        suspendAccount: {
          method: 'POST',
          url: apiRootUrl + '/suspend',
        },
        deleteAccount: {
          method: 'POST',
          url: apiRootUrl + '/delete',
        },
        supportAdd: {
          method: 'POST',
          url: apiRootUrl + '/support/add',
        },

        /* COMING SOON */
        feedbackAdd: {
          method: 'POST',
          url: apiRootUrl + '/feedback/add'
        }
      }
    );
  });

memberApp
  .factory('MemberNotification', function ($resource) {

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


memberApp
  .factory('MemberMisc', function ($resource) {

    return $resource(
      null, {},
      {

        /* USER */
        getUser: {
          method: 'POST',
          url: apiRootUrl + '/user'
        },
        getUserClubsChunk: {
          method: 'POST',
          url: apiRootUrl + '/user/clubs/chunk'
        },

        /* SOCIETY */
        getSociety: {
          method: 'POST',
          url: apiRootUrl + '/society'
        },
        getSocietyMembersChunk: {
          method: 'POST',
          url: apiRootUrl + '/society/members/chunk'
        },
        getSocietyClubsChunk: {
          method: 'POST',
          url: apiRootUrl + '/society/clubs/chunk'
        }
      }
    );
  });