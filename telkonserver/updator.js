/******************************************************************************
 *
 *  updator.js - UPDATOR service for Telkon
 *
 *****************************************************************************/

var User = require('./models/user.js');
var Notification = require('./models/notification.js');

var moment = require('moment');
var helper = require('./helper.js');


module.exports = {

  memberAddedUpdate                     : memberAddedUpdate,
  noticeAddedUpdate                     : noticeAddedUpdate,
  complaintAddedUpdate                  : complaintAddedUpdate,
  complaintStatusUpdate                 : complaintStatusUpdate,
  complaintRemovedByMemberUpdate        : complaintRemovedByMemberUpdate,
  complaintRemovedByAdminUpdate         : complaintRemovedByAdminUpdate,
  classifiedAddedUpdate                 : classifiedAddedUpdate,
  contactAddedUpdate                    : notImplemented,
  forumAddedUpdate                      : forumAddedUpdate,
  forumCommentUpdate                    : forumCommentUpdate,
  forumEmoticonUpdate                   : forumEmoticonUpdate,
  clubAddedUpdate                       : clubAddedUpdate,
  clubPostAddedUpdate                   : notImplemented,
  clubPostCommentAddedUpdate            : notImplemented,
  clubEventAddedUpdate                  : notImplemented,
  clubMemberAddedUpdate                 : notImplemented

};


////////////////////

/* NOT IMPLEMENTED ROUTES */
function notImplemented() {
    console.log('Data service method for is not implemented');
}

function memberAddedUpdate(user, callback) {

  var uid = user.uid;
  var socid = user.socid;
  var name = user.name;
  var email = user.email;
  var query = {};
  var projection = {};

  var newInfo = {};
  newInfo.infoid = uid;
  newInfo.infotype = 6;
  newInfo.infovalue = 600;
  newInfo.infodata = name || email;

  console.log(user);
  console.log(newInfo);

  memberUpdate();
  adminUpdate();

  function memberUpdate() {

    var roles = [4, 7, 8];
    var query = {
      isactive: true,
      socid: socid,
      role: {$in: roles}
    };
          
    projection = {
      _id: 0,
      uid: 1
    }

    User.find(query, projection, function(err, users) {

      if(err) {

        return -1;

      } else {

        if(users) {

          var userids = [];
          for(var i=0; i<users.length; i++) {
            if(users[i].uid) userids.push(users[i].uid);
          }

          query = {
            uid: {$in: userids}
          };
          
          Notification.find(query, {}, function(err, data) {
            if(err) {

              return -1;

            } else {

              if(data) {

                for(var i=0; i<data.length; i++) {

                  data[i].info.push(newInfo);
                  data[i].total += 1;
                  data[i].save(function(err) {
                    if (err) console.log(err);
                  });
                }
              }
            }
          });
        }
      }
    });
  }

  function adminUpdate() {

    var roles = [5, 6];
    var query = {
      isactive: true,
      socid: socid,
      role: {$in: roles}
    };
      
    var projection = {
      _id: 0,
      uid: 1
    }

    User.find(query, projection, function(err, users) {

      if(err) {

        return -1;

      } else {

        if(users) {

          var userids = [];
          for(var i=0; i<users.length; i++) {
            if(users[i].uid) userids.push(users[i].uid);
          }

          query = {
            uid: {$in: userids},
            uid: {$ne: uid}
          };
          
          Notification.find(query, {}, function(err, data) {
            if(err) {

              return -1;

            } else {

              if(data) {

                for(var i=0; i<data.length; i++) {

                  data[i].info.push(newInfo);
                  data[i].total += 1;
                  data[i].save(function(err) {
                    if (err) console.log(err);
                  });
                }
              }
            }
          });
        }
      }
    });
  }
}

function noticeAddedUpdate(notice, callback) {

  var socid = notice.socid;
  var nid = notice.nid;
  var meantfor = notice.meantfor;
  var query = {};
  var projection = {};

  memberUpdate();
  adminUpdate();

  function memberUpdate() {

    var roles = [4, 7, 8];
    query = {
      isactive: true,
      socid: socid,
      role: {$in: roles}
    };
    if(meantfor != 2) {
      query.residencetype = meantfor;
    }
      
    projection = {
      _id: 0,
      uid: 1
    }

    User.find(query, projection, function(err, users) {

      if(err) {

        return -1;

      } else {

        if(users) {

          var userids = [];
          for(var i=0; i<users.length; i++) {
            if(users[i].uid) userids.push(users[i].uid);
          }

          query = {
            uid: {$in: userids}
          };
          
          Notification.find(query, {}, function(err, data) {
            if(err) {

              return -1;

            } else {

              if(data) {

                var newInfo = {};
                newInfo.infoid = nid;
                newInfo.infotype = 1;
                newInfo.infovalue = 100;
                newInfo.infodata = notice.title;

                for(var i=0; i<data.length; i++) {

                  data[i].info.push(newInfo);
                  data[i].total += 1;
                  data[i].save(function(err) {
                    if (err) console.log(err);
                  });

                }

              }
            }
          });
        }
      }
    });
  }

  function adminUpdate() {

    var socid = notice.socid;
    var nid = notice.nid;

    var roles = [5, 6];
    var query = {
      isactive: true,
      socid: socid,
      role: {$in: roles}
    };
      
    var projection = {
      _id: 0,
      uid: 1
    }

    User.find(query, projection, function(err, users) {

      if(err) {

        return -1;

      } else {

        if(users) {

          var userids = [];
          for(var i=0; i<users.length; i++) {
            if(users[i].uid) userids.push(users[i].uid);
          }

          query = {
            uid: {$in: userids}
          };
          
          Notification.find(query, {}, function(err, data) {
            if(err) {

              return -1;

            } else {

              if(data) {

                var newInfo = {};
                newInfo.infoid = nid;
                newInfo.infotype = 1;
                newInfo.infovalue = 100;
                newInfo.infodata = notice.title;

                for(var i=0; i<data.length; i++) {

                  data[i].info.push(newInfo);
                  data[i].total += 1;
                  data[i].save(function(err) {
                    if (err) console.log(err);
                  });

                }

              }
            }
          });
        }
      }
    });
  }
}

function complaintAddedUpdate(complaint, callback) {

  var socid = complaint.socid;
  var compid = complaint.compid;
  var byflat = complaint.byflat;
  var query = {};
  var projection = {};

  memberUpdate();
  adminUpdate();

  function memberUpdate() {

    var roles = [4, 7, 8];
    query = {
      isactive: true,
      socid: socid,
      flat: byflat,
      role: {$in: roles}
    };
    projection = {
      _id: 0,
      uid: 1
    }

    User.find(query, projection, function(err, users) {

      if(err) {

        return -1;

      } else {

        if(users) {
          var userids = [];
          for(var i=0; i<users.length; i++) {
            if(users[i].uid) userids.push(users[i].uid);
          }

          query = {
            uid: {$in: userids}
          };
          
          Notification.find(query, {}, function(err, data) {
            if(err) {

              return -1;

            } else {

              if(data) {
                var newInfo = {};
                newInfo.infoid = compid;
                newInfo.infotype = 2;
                newInfo.infovalue = 200;
                newInfo.infodata = complaint.subject;

                for(var i=0; i<data.length; i++) {

                  data[i].info.push(newInfo);
                  data[i].total += 1;
                  data[i].save(function(err) {
                    if (err) console.log(err);
                  });

                }

              }
            }
          });
        }
      }
    });
  }

  function adminUpdate() {

    var roles = [5, 6];
    var query = {
      isactive: true,
      socid: socid,
      role: {$in: roles}
    };
      
    var projection = {
      _id: 0,
      uid: 1
    }

    User.find(query, projection, function(err, users) {

      if(err) {

        return -1;

      } else {

        if(users) {
          var userids = [];
          for(var i=0; i<users.length; i++) {
            if(users[i].uid) userids.push(users[i].uid);
          }

          query = {
            uid: {$in: userids}
          };
          
          Notification.find(query, {}, function(err, data) {
            if(err) {

              return -1;

            } else {

              if(data) {
                var newInfo = {};
                newInfo.infoid = compid;
                newInfo.infotype = 2;
                newInfo.infovalue = 200;
                newInfo.infodata = complaint.subject;

                for(var i=0; i<data.length; i++) {

                  data[i].info.push(newInfo);
                  data[i].total += 1;
                  data[i].save(function(err) {
                    if (err) console.log(err);
                  });

                }

              }
            }
          });
        }
      }
    });
  }
}

function complaintStatusUpdate(complaint, callback) {

  var socid = complaint.socid;
  var compid = complaint.compid;
  var byflat = complaint.byflat;
  var query = {};
  var projection = {};

  memberUpdate();
  adminUpdate();

  function memberUpdate() {

    var roles = [4, 7, 8];
    query = {
      isactive: true,
      socid: socid,
      flat: byflat,
      role: {$in: roles}
    };
      
    projection = {
      _id: 0,
      uid: 1
    }

    User.find(query, projection, function(err, users) {

      if(err) {

        return -1;

      } else {

        if(users) {
          var userids = [];
          for(var i=0; i<users.length; i++) {
            if(users[i].uid) userids.push(users[i].uid);
          }

          query = {
            uid: {$in: userids}
          };
          
          Notification.find(query, {}, function(err, data) {
            if(err) {

              return -1;

            } else {

              if(data) {
                var newInfo = {};
                newInfo.infoid = compid;
                newInfo.infotype = 2;
                newInfo.infovalue = 201;
                newInfo.infodata = complaint.subject;

                for(var i=0; i<data.length; i++) {

                  data[i].info.push(newInfo);
                  data[i].total += 1;
                  data[i].save(function(err) {
                    if (err) console.log(err);
                  });

                }

              }
            }
          });
        }
      }
    });
  }

  function adminUpdate() {

    var roles = [5, 6];
    query = {
      isactive: true,
      socid: socid,
      role: {$in: roles}
    };
      
    projection = {
      _id: 0,
      uid: 1
    }

    User.find(query, projection, function(err, users) {

      if(err) {

        return -1;

      } else {

        if(users) {
          var userids = [];
          for(var i=0; i<users.length; i++) {
            if(users[i].uid) userids.push(users[i].uid);
          }

          query = {
            uid: {$in: userids}
          };
          
          Notification.find(query, {}, function(err, data) {
            if(err) {

              return -1;

            } else {

              if(data) {
                var newInfo = {};
                newInfo.infoid = compid;
                newInfo.infotype = 2;
                newInfo.infovalue = 201;
                newInfo.infodata = complaint.subject;

                for(var i=0; i<data.length; i++) {

                  data[i].info.push(newInfo);
                  data[i].total += 1;
                  data[i].save(function(err) {
                    if (err) console.log(err);
                  });

                }

              }
            }
          });
        }
      }
    });
  }
}

function complaintRemovedByMemberUpdate(complaint, callback) {

  var socid = complaint.socid;
  var compid = complaint.compid;
  var byflat = complaint.byflat;
  var query = {};
  var projection = {};

  memberUpdate();
  if(!complaint.isremovedbyadmin && !complaint.isresolved) {
    adminUpdate();
  }
  

  function memberUpdate() {

    var roles = [4, 7, 8];
    query = {
      isactive: true,
      socid: socid,
      flat: byflat,
      role: {$in: roles}
    };
      
    projection = {
      _id: 0,
      uid: 1
    }

    User.find(query, projection, function(err, users) {

      if(err) {

        return -1;

      } else {

        if(users) {
          var userids = [];
          for(var i=0; i<users.length; i++) {
            if(users[i].uid) userids.push(users[i].uid);
          }

          query = {
            uid: {$in: userids}
          };
          
          Notification.find(query, {}, function(err, data) {
            if(err) {

              return -1;

            } else {

              if(data) {
                var newInfo = {};
                newInfo.infoid = compid;
                newInfo.infotype = 2;
                newInfo.infovalue = 205;
                newInfo.infodata = complaint.subject;

                for(var i=0; i<data.length; i++) {

                  data[i].info.push(newInfo);
                  data[i].total += 1;
                  data[i].save(function(err) {
                    if (err) console.log(err);
                  });

                }

              }
            }
          });
        }
      }
    });
  }

  function adminUpdate() {

    var roles = [5, 6];
    query = {
      isactive: true,
      socid: socid,
      role: {$in: roles}
    };
      
    projection = {
      _id: 0,
      uid: 1
    }

    User.find(query, projection, function(err, users) {

      if(err) {

        return -1;

      } else {

        if(users) {
          var userids = [];
          for(var i=0; i<users.length; i++) {
            if(users[i].uid) userids.push(users[i].uid);
          }

          query = {
            uid: {$in: userids}
          };
          
          Notification.find(query, {}, function(err, data) {
            if(err) {

              return -1;

            } else {

              if(data) {
                var newInfo = {};
                newInfo.infoid = compid;
                newInfo.infotype = 2;
                newInfo.infovalue = 205;
                newInfo.infodata = complaint.subject;

                for(var i=0; i<data.length; i++) {

                  data[i].info.push(newInfo);
                  data[i].total += 1;
                  data[i].save(function(err) {
                    if (err) console.log(err);
                  });

                }

              }
            }
          });
        }
      }
    });
  }  
}

function complaintRemovedByAdminUpdate(complaint, callback) {

  var socid = complaint.socid;
  var compid = complaint.compid;
  var byflat = complaint.byflat;
  var byresidencetype = complaint.byresidencetype;
  var currentstatus = complaint.currentstatus;
  var query = {};
  var projection = {};

  if(!complaint.isremovedbymember) {
    memberUpdate();
  }
  adminUpdate();

  function memberUpdate() {

    var roles = [4, 7, 8];
    query = {
      isactive: true,
      socid: socid,
      flat: byflat,
      role: {$in: roles}
    };
      
    projection = {
      _id: 0,
      uid: 1
    }

    if(currentstatus !== 'Removed by Member' && currentstatus !== 'Resolved') {

      User.find(query, projection, function(err, users) {

        if(err) {

          return -1;

        } else {

          if(users) {
            var userids = [];
            for(var i=0; i<users.length; i++) {
              if(users[i].uid) userids.push(users[i].uid);
            }

            query = {
              uid: {$in: userids}
            };
            
            Notification.find(query, {}, function(err, data) {
              if(err) {

                return -1;

              } else {

                if(data) {
                  var newInfo = {};
                  newInfo.infoid = compid;
                  newInfo.infotype = 2;
                  newInfo.infovalue = 206;
                  newInfo.infodata = complaint.subject;

                  for(var i=0; i<data.length; i++) {

                    data[i].info.push(newInfo);
                    data[i].total += 1;
                    data[i].save(function(err) {
                      if (err) console.log(err);
                    });

                  }

                }
              }
            });
          }
        }
      });
    }
  }

   function adminUpdate() {

    var roles = [5, 6, 7, 8];
    query = {
      isactive: true,
      socid: socid,
      role: {$in: roles}
    };
      
    projection = {
      _id: 0,
      uid: 1
    }

    if(currentstatus !== 'Removed by Admin' && currentstatus !== 'Resolved') {

      User.find(query, projection, function(err, users) {

        if(err) {

          return -1;

        } else {

          if(users) {
            var userids = [];
            for(var i=0; i<users.length; i++) {
              if(users[i].uid) userids.push(users[i].uid);
            }

            query = {
              uid: {$in: userids}
            };
            
            Notification.find(query, {}, function(err, data) {
              if(err) {

                return -1;

              } else {

                if(data) {
                  var newInfo = {};
                  newInfo.infoid = compid;
                  newInfo.infotype = 2;
                  newInfo.infovalue = 206;
                  newInfo.infodata = complaint.subject;

                  for(var i=0; i<data.length; i++) {

                    data[i].info.push(newInfo);
                    data[i].total += 1;
                    data[i].save(function(err) {
                      if (err) console.log(err);
                    });

                  }

                }
              }
            });
          }
        }
      });
    }
  }
}

function classifiedAddedUpdate(classified, callback) {

  var cid = classified.cid;
  var query = {};
  var projection = {};

  memberUpdate();

  function memberUpdate() {

    var roles = [4, 7, 8];
    query = {
      isactive: true,
      role: {$in: roles}
    };
      
    projection = {
      _id: 0,
      uid: 1
    }

    User.find(query, projection, function(err, users) {

      if(err) {

        return -1;

      } else {

        if(users) {
          var userids = [];
          for(var i=0; i<users.length; i++) {
            if(users[i].uid) userids.push(users[i].uid);
          }

          query = {
            uid: {$in: userids}
          };
          
          Notification.find(query, {}, function(err, data) {
            if(err) {

              return -1;

            } else {

              if(data) {
                var newInfo = {};
                newInfo.infoid = cid;
                newInfo.infotype = 3;
                newInfo.infovalue = 300;
                newInfo.infodata = classified.title;

                for(var i=0; i<data.length; i++) {

                  data[i].info.push(newInfo);
                  data[i].total += 1;
                  data[i].save(function(err) {
                    if (err) console.log(err);
                  });

                }

              }
            }
          });
        }
      }
    });
  }
}

function forumAddedUpdate(forum, callback) {

  var fid = forum.fid;
  var forumtype = forum.forumtype;
  var socid = forum.socid;
  var query = {};
  var projection = {};

  memberUpdate();

  function memberUpdate() {

    var roles = [4, 7, 8];
    query = {
      isactive: true,
      role: {$in: roles}
    };
    if(forumtype == 0) {  // Private Forum
      query.socid = socid;
    }

    projection = {
      _id: 0,
      uid: 1
    }

    User.find(query, projection, function(err, users) {

      if(err) {

        return -1;

      } else {

        if(users) {
          var userids = [];
          for(var i=0; i<users.length; i++) {
            if(users[i].uid) userids.push(users[i].uid);
          }

          query = {
            uid: {$in: userids}
          };
          
          Notification.find(query, {}, function(err, data) {
            if(err) {

              return -1;

            } else {

              if(data) {
                var newInfo = {};
                newInfo.infoid = fid;
                newInfo.infotype = 5;
                if(forumtype == 0) newInfo.infovalue = 500;
                else if(forumtype == 1) newInfo.infovalue = 501;
                newInfo.infodata = forum.title;

                for(var i=0; i<data.length; i++) {

                  data[i].info.push(newInfo);
                  data[i].total += 1;
                  data[i].save(function(err) {
                    if (err) console.log(err);
                  });

                }

              }
            }
          });
        }
      }
    });
  }
}

function forumCommentUpdate(forum, newComment, callback) {

  var fid = forum.fid;
  var forumtype = forum.forumtype;
  var socid = forum.socid;

  var roles = [4, 7, 8];
  var query = {
    isactive: true,
    role: {$in: roles}
  };
  if(forumtype == 0) {  // Private Forum
    query.socid = socid;
  }

  var projection = {
    _id: 0,
    uid: 1
  }

  User.find(query, projection, function(err, users) {

    if(err) {

      return -1;

    } else {

      if(users) {
        var userids = [];
        for(var i=0; i<users.length; i++) {
          if(users[i].uid) userids.push(users[i].uid);
        }

        query = {
          uid: {$in: userids}
        };
        
        Notification.find(query, {}, function(err, data) {
          if(err) {

            return -1;

          } else {

            if(data) {
              var newInfo = {};
              newInfo.infoid = fid;
              newInfo.infotype = 5;
              newInfo.infovalue = 502;
              newInfo.infodata = forum.title;

              for(var i=0; i<data.length; i++) {

                data[i].info.push(newInfo);
                data[i].total += 1;
                data[i].save(function(err) {
                  if (err) console.log(err);
                });

              }

            }
          }
        });
      }
    }
  });
}

function forumEmoticonUpdate(forum, callback) {

  var fid = forum.fid;
  var forumtype = forum.forumtype;
  var socid = forum.socid;

  var query = {isactive: true};
  if(forumtype == 0) {  // Private Forum
    query.socid = socid;
  }

  var projection = {
    _id: 0,
    uid: 1
  }

  User.find(query, projection, function(err, users) {

    if(err) {

      return -1;

    } else {

      if(users) {
        var userids = [];
        for(var i=0; i<users.length; i++) {
          if(users[i].uid) userids.push(users[i].uid);
        }

        query = {
          uid: {$in: userids}
        };
        
        Notification.find(query, {}, function(err, data) {
          if(err) {

            return -1;

          } else {

            if(data) {
              var newInfo = {};
              newInfo.infoid = fid;
              newInfo.infotype = 5;
              newInfo.infovalue = 503;
              newInfo.infodata = forum.title;

              for(var i=0; i<data.length; i++) {

                data[i].info.push(newInfo);
                data[i].total += 1;
                data[i].save(function(err) {
                  if (err) console.log(err);
                });

              }

            }
          }
        });
      }
    }
  });
}

function clubAddedUpdate(club, callback) {

  var clubid = club.clubid;
  var clubscope = club.clubscope;
  var socid = club.socid;
  var query = {};
  var projection = {};

  memberUpdate();

  function memberUpdate() {

    var roles = [4, 7, 8];
    query = {
      isactive: true,
      role: {$in: roles}
    };
    if(clubscope == 0) {  // closed club
      query.socid = socid;
    }

    projection = {
      _id: 0,
      uid: 1
    }

    User.find(query, projection, function(err, users) {

      if(err) {

        return -1;

      } else {

        if(users) {
          var userids = [];
          for(var i=0; i<users.length; i++) {
            if(users[i].uid) userids.push(users[i].uid);
          }

          query = {
            uid: {$in: userids}
          };
          
          Notification.find(query, {}, function(err, data) {
            if(err) {

              return -1;

            } else {

              if(data) {
                var newInfo = {};
                newInfo.infoid = clubid;
                newInfo.infotype = 7;
                if(clubscope == 1) newInfo.infovalue = 701;
                else newInfo.infovalue = 701;
                newInfo.infodata = club.name;

                for(var i=0; i<data.length; i++) {

                  data[i].info.push(newInfo);
                  data[i].total += 1;
                  data[i].save(function(err) {
                    if (err) console.log(err);
                  });
                }
              }
            }
          });
        }
      }
    });
  }
}

/***********************************  END  ***********************************/
