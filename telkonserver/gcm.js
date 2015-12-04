/******************************************************************************
 *
 *  gcm.js - Google Cloud Messaging service for Telkon
 *
 *****************************************************************************/

var User = require('./models/user.js');
var Society = require('./models/society.js');
var Notice = require('./models/notice.js');
var Complaint = require('./models/complaint.js');
var Classified = require('./models/classified.js');
var Contact = require('./models/contact.js');
var Poll = require('./models/poll.js');
var Forum = require('./models/forum.js');
var Club = require('./models/club.js');
var Notification = require('./models/notification.js');

var moment = require('moment');
var helper = require('./helper.js');
var header = require('./header.js');
var gcm = require('node-gcm');

var GCM_SERVER_KEY = 'AIzaSyCi3-gO_hsqxxUIyvcxFnKxgLu-XZYH2K4';
var GCM_TEST_REGID = 'APA91bGu4Lo4rqOS7GLkh5g1Vla1GOlGFMOgzCA1LtqGrgxGE31-xLNHAX8Pabn6zmQ4R9sk2LbNyBZgmr3Y33txSOYLHBZQ2zVIj87yAPWUnSE78Q31GNYABOUSyl0czmb6hb7Q6H-4';
var memberRoles = [4, 7, 8];
var adminRoles = [5, 6, 7, 8];

module.exports = {

  sendMessage                 : sendMessage

};


////////////////////

/* NOT IMPLEMENTED ROUTES */
function notImplemented() {
    console.log('Data service method for is not implemented');
}


function sendMessage(type, action, rec) {

    var regids = [];
    var users = [];
    var data = {};

    var Model = null;

    var query = {};
    var projection = {};

    var message = new gcm.Message();
    message.collapseKey = 'demo';
    message.delayWhileIdle = true;
    message.timeToLive = 3;

    var sender = new gcm.Sender(GCM_SERVER_KEY);

    projection = {
        _id: 0,
        gcmid: 1
    }

    /* Set Model and query based on type */
    if(type == 1) {
        Model = Notice;
        query = {
          uid: rec.socid
        }
        data.infoid = rec.nid;

    } else if(type == 2) {
        Model = Complaint;
        query = {
          $or: [
              {
                  $and: [{uid: rec.socid}, {flat: rec.flat}, {role: {$in: memberRoles}}]
              },
              {
                  $and: [{uid: rec.socid}, {role: {$in: adminRoles}}]
              }
            ]
        };
        data.infoid = rec.compid;

    } else if(type == 3) {
        Model = Classified;
        query = {
            role: {$in: memberRoles}
        };
        data.infoid = rec.cid;

    } else if(type == 4) {
        Model = Contact;

    } else if(type == 5) {
        Model = Forum;
        query = {
            role: {$in: memberRoles}
        };
        if(rec.forumtype == 0)  {
            query.socid = rec.socid;
        }
        data.infoid = rec.fid;

    } else if(type == 6) {
        Model = Member;
        query = {
            socid: rec.socid,
            role: {$in: memberRoles}
        };
        data.infoid = rec.uid;

    } else if(type == 7) {
        Model = Club;
        query = {
            role: {$in: memberRoles}
        };
        if(rec.clubtype == 0)  {
            query.socid = rec.socid;
        }
        data.infoid = rec.clubid;
    }
    
    /* Set Message Text based on action */
    data.text = getAptMessageText(action, rec);
    message.data = data;

    User.find(query, projection, function(err, data) {

        if(err) {
          console.log(err);
            return -1;
        } else {

            helper.getFieldFromData(data, 1, 0, 1000, function(retData) {
                
                regids = retData;
                if(regids) {

                    console.log(regids);
                    sender.send(message, regids, 10, function (err, result) {

                        console.log('send')
                        if(err) {
                          console.log(err);
                            return -1;
                        }
                        else {
                            console.log(result);
                            return 0;
                        }
                    });
                }
            });
        }
    });

}

function getAptMessageText(action, rec) {

    var textMsg = '';

    if(action == 100) {   // New Notice
        textMsg = 'New notice - ' + rec.title;
    } else if(action == 200) {   // New Complaint
        textMsg = 'New complaint - ' + rec.subject;
    } else if(action == 201 || action == 202) {
        textMsg = 'Complaint status changed - ' + rec.subject;
    } else if(action == 203 || action == 204) {
        textMsg = 'Comment on complaint - ' + rec.subject;
    } else if(action == 205 || action == 206) {
        textMsg = 'Complaint removed - ' + rec.subject;
    } else if(action == 300) {
        textMsg = 'New classified - ' + rec.title;
    } else if(action == 500) {
        textMsg = 'New private forum - ' + rec.title;
    } else if(action == 501) {
        textMsg = 'New public forum - ' + rec.title;
    } else if(action == 502) {
        textMsg = 'New comment on forum - ' + rec.title;
    } else if(action == 503) {
        textMsg = 'New emoticon on forum - ' + rec.title;
    } else if(action == 600) {
        textMsg = 'New member joined - ' + (rec.name || req.email);
    } else if(action == 601) {
        textMsg = (rec.name || req.email) + ' has changed profile image';
    } else if(action == 602) {
        textMsg = (rec.name || req.email) + ' has changed name';
    } else if(action == 603) {
        textMsg = (rec.name || req.email) + ' has changed society';
    } else if(action == 700) {
        textMsg = 'New closed club - ' + rec.name;
    } else if(action == 701) {
        textMsg = 'New open club - ' + rec.name;
    } else if(action == 702) {
        textMsg = 'New post in club - ' + rec.name;
    } else if(action == 703) {
        textMsg = 'New comment on club post - ' + rec.name;
    } else if(action == 704) {
        textMsg = 'New event in club - ' + rec.name;
    } else if(action == 705) {
        textMsg = 'New member joined club - ' + rec.name;
    }

    return textMsg;
}

/***********************************  END  ***********************************/
