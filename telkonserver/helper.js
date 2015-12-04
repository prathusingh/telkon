/******************************************************************************
 *
 *  helper.js - Helper Functions
 *
 *****************************************************************************/

var moment = require("moment");

var Society = require('./models/society.js');
var User = require('./models/user.js');
var Notice = require('./models/notice.js');
var Complaint = require('./models/complaint.js');
var Classified = require('./models/classified.js');
var Contact = require('./models/contact.js');
var Poll = require('./models/poll.js');
var Forum = require('./models/forum.js');
var Notification = require('./models/notification.js');
var Club = require('./models/club.js');
var ClubPost = require('./models/clubpost.js');

var ID_GENERATE_TRY = 5;
module.exports = {

  /* Generate IDs */
  generateUniqueId          : generateUniqueId,
  generateUid               : generateUid,
  generateSocid             : generateSocid,
  generateSocietyCode       : generateSocietyCode,
  generateNid               : generateNid,
  generateCompid            : generateCompid,
  generateCid               : generateCid,
  generateContactid         : generateContactid,
  generateFid               : generateFid,
  generatePollid            : generatePollid,
  generateClubid            : generateClubid,
  generateClubpostid        : generateClubpostid,
  generateEventid           : generateEventid,
  generatePassword          : generatePassword,

  /* String Manipulation */
  toTitleCase               : toTitleCase,
  capitalizeFirstLetter     : capitalizeFirstLetter,

  /* Validation */
  validateParams            : validateParams,
  validateEmail             : validateEmail,
  validatePhone             : validatePhone,

  /* Operation on Object/Array*/
  getFieldFromData          : getFieldFromData,
  mergeObjects              : mergeObjects,

  /* Others */
  sortSkipTake              : sortSkipTake

};


////////////////////

/* NOT IMPLEMENTED ROUTES */
function notImplemented(req, res, next) {
  next(new Error(
    'Data service method for ' + req.method + ' ' + req.url+ ' is not implemented'
  ));
}


function generateUid(callback) {
  
  var uid = '';
  var idtry = 0;

  loop(false, function(uid) {
    callback(uid);
  });

  function loop(isFound, callback) {

    uid = generateRandomString(32);
    var query = {uid: uid};
    getId(isFound, query, Notice, function(err, isFound) {

      idtry++;

      if(err) {
        callback(null);
      } else {
        if (!isFound) {
          if(idtry >= ID_GENERATE_TRY) {
            callback(null);
            return;
          }
          loop(isFound, callback);
        }
        else {
          callback(uid);
          return;
        }
      }
    });
  }
}


function generateSocid(callback) {

  var socid = '';
  var idtry = 0;

  loop(false, function(socid) {
    callback(socid);
  });

  function loop(isFound, callback) {

    socid = generateRandomString(32);
    var query = {socid: socid};
    getId(isFound, query, Society, function(err, isFound) {

      idtry++;

      if(err) {
        callback(null);
      } else {
        if (!isFound) {
          if(idtry >= ID_GENERATE_TRY) {
            callback(null);
            return;
          }
          loop(isFound, callback);
        }
        else {
          callback(socid);
          return;
        }
      }
    });
  }
}


function generateSocietyCode(city, callback) {

  var societycode = '';
  var base = '';
  var id = '';
  var isFound = false;
  var query = {};
  var idtry = 0;
  
  city = city.toLowerCase();

  if(city === 'bangalore' || city === 'bengaluru') base += 'BLR';
  else if(city === 'delhi' || city === 'new delhi') base += 'DEL';
  else if(city === 'noida') base += 'NDA';
  else if(city === 'mumbai' || city === 'bombay') base += 'MUM';
  else if(city === 'pune') base += 'PUN';
  else if(city === 'hyderabad') base += 'HYD';
  else if(city === 'kolkata' || city === 'calcutta') base += 'KOL';
  else if(city === 'chennai') base += 'CHE';
  else if(city === 'gurgaon') base += 'GGN';
  else if(city === 'chandigarh') base += 'CGH';
  else return null;

  loop(false, function(societycode) {
    callback(societycode);
  });

  function loop(isFound, callback) {

    id = generateRandomNumber(5);
    societycode = base + id;
    var query = {
      city: city,
      societycode: societycode
    };
    getId(isFound, query, Society, function(err, isFound) {

      idtry++;

      if(err) {
        callback(null);
      } else {
        if (!isFound) {
          if(idtry >= ID_GENERATE_TRY) {
            callback(null);
            return;
          }
          loop(isFound, callback);
        }
        else {
          callback(societycode);
          return;
        }
      }
    });
  }
}


function generateUniqueId(Model, callback) {
  
  var id = '';
  var idtry = 0;

  loop(false, function(id) {
    callback(id);
  });

  function loop(isFound, callback) {

    id = generateRandomString(32);
    
    var query = {};
         if(Model === User)       query.uid = id;
    else if(Model === Society)    query.socid = id;
    else if(Model === Notice)     query.nid = id;
    else if(Model === Complaint)  query.compid = id;
    else if(Model === Classified) query.cid = id;
    else if(Model === Contact)    query.contactid = id;
    else if(Model === Forum)      query.fid = id;
    else if(Model === Club)       query.clubid = id;

    getId(isFound, query, Model, function(err, isFound) {

      idtry++;
      
      if(err) {
        callback(null);
      } else {
        if (!isFound) {
          if(idtry >= ID_GENERATE_TRY) {
            callback(null);
            return;
          }
          loop(isFound, callback);
        }
        else {
          callback(id);
          return;
        }
      }
    });
  }
}


function generateNid(callback) {
  
  var nid = '';
  var idtry = 0;

  loop(false, function(nid) {
    callback(nid);
  });

  function loop(isFound, callback) {

    nid = generateRandomString(32);
    var query = {nid: nid};
    getId(isFound, query, Notice, function(err, isFound) {

      idtry++;

      if(err) {
        callback(null);
      } else {
        if (!isFound) {
          if(idtry >= ID_GENERATE_TRY) {
            callback(null);
            return;
          }
          loop(isFound, callback);
        }
        else {
          callback(nid);
          return;
        }
      }
    });
  }
}


function generateCompid(callback) {
  
  var compid = '';
  var idtry = 0;

  loop(false, function(compid) {
    callback(compid);
  });

  function loop(isFound, callback) {

    compid = generateRandomString(32);
    var query = {compid: compid};
    getId(isFound, query, Complaint, function(err, isFound) {

      idtry++;

      if(err) {
        callback(null);
      } else {
        if (!isFound) {
          if(idtry >= ID_GENERATE_TRY) {
            callback(null);
            return;
          }
          loop(isFound, callback);
        }
        else {
          callback(compid);
          return;
        }
      }
    });
  }
}


function generateCid(callback) {
  
  var cid = '';
  var idtry = 0;

  loop(false, function(cid) {
    callback(cid);
  });

  function loop(isFound, callback) {

    cid = generateRandomString(32);
    var query = {cid: cid};
    getId(isFound, query, Classified, function(err, isFound) {

      idtry++;

      if(err) {
        callback(null);
      } else {
        if (!isFound) {
          if(idtry >= ID_GENERATE_TRY) {
            callback(null);
            return;
          }
          loop(isFound, callback);
        }
        else {
          callback(cid);
          return;
        }
      }
    });
  }
}


function generateContactid(callback) {
  
  var contactid = '';
  var idtry = 0;

  loop(false, function(contactid) {
    callback(contactid);
  });

  function loop(isFound, callback) {

    contactid = generateRandomString(32);
    var query = {contactid: contactid};
    getId(isFound, query, Contact, function(err, isFound) {

      idtry++;

      if(err) {
        callback(null);
      } else {
        if (!isFound) {
          if(idtry >= ID_GENERATE_TRY) {
            callback(null);
            return;
          }
          loop(isFound, callback);
        }
        else {
          callback(contactid);
          return;
        }
      }
    });
  }
}


function generateFid(callback) {
  
  var fid = '';
  var idtry = 0;

  loop(false, function(fid) {
    callback(fid);
  });

  function loop(isFound, callback) {

    fid = generateRandomString(32);
    var query = {fid: fid};
    getId(isFound, query, Classified, function(err, isFound) {

      idtry++;

      if(err) {
        callback(null);
      } else {
        if (!isFound) {
          if(idtry >= ID_GENERATE_TRY) {
            callback(null);
            return;
          }
          loop(isFound, callback);
        }
        else {
          callback(fid);
          return;
        }
      }
    });
  }
}


function generatePollid(callback) {
  
  var pollid = '';
  var idtry = 0;

  loop(false, function(pollid) {
    callback(pollid);
  });

  function loop(isFound, callback) {

    pollid = generateRandomString(32);
    var query = {pollid: pollid};
    getId(isFound, query, Poll, function(err, isFound) {

      idtry++;

      if(err) {
        callback(null);
      } else {
        if (!isFound) {
          if(idtry >= ID_GENERATE_TRY) {
            callback(null);
            return;
          }
          loop(isFound, callback);
        }
        else {
          callback(pollid);
          return;
        }
      }
    });
  }
}


function generateClubid(callback) {
  
  var clubid = '';
  var idtry = 0;

  loop(false, function(clubid) {
    callback(clubid);
  });

  function loop(isFound, callback) {

    clubid = generateRandomString(32);
    var query = {clubid: clubid};
    getId(isFound, query, Club, function(err, isFound) {

      idtry++;

      if(err) {
        callback(null);
      } else {
        if (!isFound) {
          if(idtry >= ID_GENERATE_TRY) {
            callback(null);
            return;
          }
          loop(isFound, callback);
        }
        else {
          callback(clubid);
          return;
        }
      }
    });
  }
}


function generateClubpostid(callback) {
  
  var clubpostid = '';
  var idtry = 0;

  loop(false, function(clubpostid) {
    callback(clubpostid);
  });

  function loop(isFound, callback) {

    clubpostid = generateRandomString(32);
    var query = {clubpostid: clubpostid};
    getId(isFound, query, ClubPost, function(err, isFound) {

      idtry++;

      if(err) {
        callback(null);
      } else {
        if (!isFound) {
          if(idtry >= ID_GENERATE_TRY) {
            callback(null);
            return;
          }
          loop(isFound, callback);
        }
        else {
          callback(clubpostid);
          return;
        }
      }
    });
  }
}

function generateEventid(callback) {
  
  var eventid = '';
  var idtry = 0;

  loop(false, function(eventid) {
    callback(eventid);
  });

  function loop(isFound, callback) {

    eventid = generateRandomString(32);
    var query = {eventid: eventid};
    getId(isFound, query, Club, function(err, isFound) {

      idtry++;

      if(err) {
        callback(null);
      } else {
        if (!isFound) {
          if(idtry >= ID_GENERATE_TRY) {
            callback(null);
            return;
          }
          loop(isFound, callback);
        }
        else {
          callback(eventid);
          return;
        }
      }
    });
  }
}

function generatePassword() {
  var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 8; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}


function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

function toFirstLetterCap(str) {
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1);});
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


function validateParams(params) {

  var p;
  for(var i=0; i<params.length; i++) {
    
    if(typeof params[i] === 'undefined' ||
      params[i] === null ||
      params[i] === {} ||
      params[i] === [] ||
      params[i] === '') {
      return false;
    }
  }
  return true;
}


function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}


function validatePhone(phone) { 
   
  if(isNaN(phone)) {
    return false;
  } else if(phone.length != 10) {
    return false;
  }
  return true;
}


function sortSkipTake(req) {
    // copy the Questions collection so we can sort the copy
    var quests  = questions.slice();

    var sort = req.query.sort;

    if (sort === 'votes'){
        quests.sort(function(a, b){
            return a.voteCount < b.voteCount ? 1 : -1;
        });
    }

    else if (sort === 'time') {
        quests.sort(function(a, b){
            return a.created < b.created ? -1 : 1;
        });
    }

    var skip = +req.query.offset || 0 ;
    var take = +req.query.limit  || quests.length ;

    return quests.slice(skip, skip + take);
}


function mergeObjects(obj1, obj2) {
    var obj3 = {};
    for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
    for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
    return obj3;
}


function generateRandomNumber(digits) {
  var text = "";
    var possible = "0123456789";

    for( var i=0; i < digits; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}


function generateRandomString(length) {
  var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_";

    for( var i=0; i < length; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function getId(isFound, query, Model, callback) {

  Model.find(query, function(err, data) {

    if(err) {
      res.status(500).json({
        status: 'suc',
        message: 'error'
      });
      callback(err, true);
      return;
    } else {
      if(!data || data.length == 0) {
        callback(null, true);
        return;
      } else {
        callback(null, false);
        return;
      }
    }
  });
}


function getFieldFromData(data, fieldtype, offset, limit, callback) {

    var retData = [];
    var numOfMembers;

    if(!data) {
        return retData;
    }

    if(offset<0 || offset>data.length) {
        return retData;
    }

    for(var i=offset; i<offset+limit; i++) {

        if(data[i]) {

            if(fieldtype == 0) {
                if(data[i].uid) {
                    retData.push(data[i].uid);
                }
            } else if(fieldtype == 1) {
                if(data[i].gcmid) {
                    retData.push(data[i].gcmid);
                }
            }

        }
    }

    callback(retData);
}

/***********************************  END  ***********************************/
