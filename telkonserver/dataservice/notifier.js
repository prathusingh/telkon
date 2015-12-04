/******************************************************************************
 *
 *  notifier.js - NOTIFIER service for Telkon
 *
 *****************************************************************************/

var updator = require('../updator');
var gcm = require('../gcm');
var telkonlogger = require('../logger');
var io;

module.exports = {
    listen                          : listen,

    /* NOTICE*/
    noticeAdded                     : noticeAdded,
    noticeRemoved                   : noticeRemoved,

    /* COMPLAINT */
    complaintAdded	             	: complaintAdded,
    complaintStatusChanged          : complaintStatusChanged,
    complaintRemovedByMember        : complaintRemovedByMember,
    complaintRemovedByAdmin         : complaintRemovedByAdmin,

    /* CLASSIFIED */
    classifiedAdded                 : classifiedAdded,
    classifiedRemoved               : classifiedRemoved,

    /* FORUM */
    forumAdded                      : forumAdded,
    forumRemoved                    : forumRemoved,
    forumCommentAdded               : forumCommentAdded,
    forumCounter                    : forumCounter,
    forumEmoticonUpdate             : forumEmoticonUpdate,

    /* CONTACT */

    /* CLUB */
    clubAdded                       : clubAdded,
    clubEventAdded                  : clubEventAdded,
    clubPostAdded                   : clubPostAdded,

    /* FAMILY */
    familyMemberReported            : familyMemberReported,

    /* MEMBER */
    memberAdded                     : memberAdded,
    memberRemovedByAdmin            : memberRemovedByAdmin,
    memberBlockedByAdmin            : memberBlockedByAdmin,
    memberUnblockedByAdmin          : memberUnblockedByAdmin,
    memberCleanedByAdmin            : memberCleanedByAdmin,

    /* USER */
    userRegistered                  : userRegistered,

    /* FEEDBACK */
    feedbackAdded                   : feedbackAdded,

    /* SUPPORT*/
    supportAdded                    : supportAdded,

    /* OTHERSOCIETY */
    othersocietyAdded               : othersocietyAdded
};

	
//////////

function listen(server) {
    io = require('socket.io')(server);

    io.sockets.on('connection', function (socket) {
		console.log('connection');

    	socket.on('memberConnected', function (user) {
    		console.log('Notifier#memberConnected');

            var role = user.role;
            var residencetype = user.residencetype;

            if(role == 4 || role == 7 || role == 8) {
                socket.join("member_" + user.socid);
                socket.join("flat_"+ user.socid + "_" + user.flat);
                socket.join("member");
            }
            if(residencetype == 0) {
                socket.join("owner_" + user.socid);
            } else if(residencetype == 1) {
                socket.join("tenant_" + user.socid);
            }
        });

        socket.on('adminConnected', function (user) {
            console.log('Notifier#adminConnected');

            var role = user.role;
            if(role == 5 || role == 6 || role == 7 || role == 8) {
                socket.join("admin_" + user.socid);
                socket.join("admin");

                if(role == 6 || role == 8) {
                    socket.join("superadmin_" + user.socid);
                    socket.join("superadmin");
                }
            }
        });

        socket.on('sysConnected', function (user) {
            console.log('Notifier#sysConnected');

            var role = user.role;
            if(role == 0) {
                socket.join("sys");
            }
        });

        socket.on('guestConnected', function (user) {
            console.log('Notifier#guestConnected');

            var role = user.role;
            if(role == 1 || role == 2 || role == 3) {
                socket.join("guest");
            }
        });
    		
    });

    io.sockets.on('disconnect', function (socket) {
    	console.log('Notifier#disconnect');
    });

    io.sockets.on('reconnect', function (socket) {
        console.log('Notifier#reconnect');
    });
}


function noticeAdded(notice) {

    var meantfor = notice.meantfor;
    
    io.sockets.in('admin_' + notice.socid).emit('noticeAdded', notice);

    if(meantfor == 0) {
        io.sockets.in('owner_' + notice.socid).emit('noticeAdded', notice);
    } else if(meantfor == 1) {
        io.sockets.in('tenant_' + notice.socid).emit('noticeAdded', notice);
    } else if(meantfor == 2) {
        io.sockets.in('member_' + notice.socid).emit('noticeAdded', notice);
    }
    updator.noticeAddedUpdate(notice, function() {});
    console.log('Notifier#noticeAdded: ' + notice.title);
}

function noticeRemoved(nid, socid, meantfor) {

    io.sockets.in('admin_' + socid).emit('noticeRemoved', nid);

    if(meantfor == 0) {
        io.sockets.in('owner_' + socid).emit('noticeRemoved', nid);
    } else if(meantfor == 1) {
        io.sockets.in('tenant_' + socid).emit('noticeRemoved', nid);
    } else if(meantfor == 2) {
        io.sockets.in('member_' + socid).emit('noticeRemoved', nid);
    }
    console.log('Notifier#noticeRemoved: '+ nid);
}

function complaintAdded(complaint) {
    
    io.sockets.in('admin_' + complaint.socid).emit('complaintAdded', complaint);
    io.sockets.in('flat_' + complaint.socid + '_' + complaint.byflat).emit('complaintAdded', complaint);
    updator.complaintAddedUpdate(complaint, function() {});
	console.log('Notifier#complaintAdded: ' + complaint.subject);
}



function complaintStatusChanged(complaint) {
    
    io.sockets.in('admin_' + complaint.socid).emit('complaintStatusChanged', complaint.compid, complaint.currentstatus);
    io.sockets.in('flat_' + complaint.socid + '_' + complaint.byflat).emit('complaintStatusChanged', complaint.compid, complaint.currentstatus);
    updator.complaintStatusUpdate(complaint, function() {});
    console.log('Notifier#complaintStatusChanged: ' + complaint.subject);
}

function complaintRemovedByMember(complaint) {
    
    if(!complaint.isremovedbyadmin && !complaint.isresolved) {
        io.sockets.in('admin_' + complaint.socid).emit('complaintRemovedByMember', complaint.compid);
    }
    io.sockets.in('flat_' + complaint.socid + '_' + complaint.byflat).emit('complaintRemovedByMember', complaint.compid);
    updator.complaintRemovedByMemberUpdate(complaint, function() {});
    console.log('Notifier#complaintRemovedByMember: ' + complaint.subject);
}

function complaintRemovedByAdmin(complaint) {
    
    io.sockets.in('admin_' + complaint.socid).emit('complaintRemovedByAdmin', complaint.compid);
    if(!complaint.isremovedbymember) {
        io.sockets.in('flat_' + complaint.socid + '_' + complaint.byflat).emit('complaintRemovedByAdmin', complaint.compid);
    }
    updator.complaintRemovedByAdminUpdate(complaint, function() {});
    console.log('Notifier#complaintRemovedByAdmin: ' + complaint.subject);
}


function classifiedAdded(classified) {
	
	io.sockets.in('member').emit('classifiedAdded', classified);
    updator.classifiedAddedUpdate(classified, function() {});
    console.log('Notifier#classifiedAdded - ' + classified.title);
}

function classifiedRemoved(cid) {
    io.sockets.in('member').emit('classifiedRemoved', cid);
    console.log('Notifier#classifiedRemoved: '+ cid);
}

function forumAdded(forum) {
    
    if(forum.forumtype == 0) {
        io.sockets.in('member_' + forum.socid).emit('forumAdded', forum);
        gcm.sendMessage(5, 500, forum, function() {});
    } else if(forum.forumtype == 1) {
        io.sockets.in('member').emit('forumAdded', forum);    
        gcm.sendMessage(5, 501, forum, function() {});
    }
    updator.forumAddedUpdate(forum, function() {});
    console.log('Notifier#forumAdded - ' + forum.title);
}

function forumRemoved(fid, socid, forumtype) {
    if(forumtype == 0) {
        io.sockets.in('member_' + socid).emit('forumRemoved', fid);
    } else if(forumtype == 1) {
        io.sockets.in('member').emit('forumRemoved', fid);
    }
    console.log('Notifier#forumRemoved: '+ fid);
}

function forumCommentAdded(forum, newComment) {
    
    var fid = forum.fid;
    var socid = forum.socid;
    var forumtype = forum.forumtype;
    var title = forum.title;

    if(forumtype == 0) {
        io.sockets.in('member_' + socid).emit('forumCommentAdded', fid, title, newComment);    
    } else if(forumtype == 1) {
        io.sockets.in('member').emit('forumCommentAdded', fid, title, newComment);
    }
    updator.forumCommentUpdate(forum, newComment, function() {});
    console.log('Notifier#forumCommentAdded - ' + fid);
}

function forumCounter(fid, socid, forumtype) {
    
    if(forumtype == 0) {
        io.sockets.in('member_' + socid).emit('forumCounter', fid);
    } else if(forumtype == 1) {
        io.sockets.in('member').emit('forumCounter', fid);
    }
    console.log('Notifier#forumCounter - ' + fid);
}

function forumEmoticonUpdate(forum, emotype) {
    
    var fid = forum.fid;
    var socid = forum.socid;
    var forumtype = forum.forumtype;
    var title = forum.title;

    console.log(emotype);

    if(forumtype == 0) {
        io.sockets.in('member_' + socid).emit('forumEmoticonUpdate', fid, title, emotype);
    } else if(forumtype == 1) {
        io.sockets.in('member').emit('forumEmoticonUpdate', fid, title, emotype);
    }
    updator.forumEmoticonUpdate(forum, function() {});
    console.log('Notifier#forumEmoticonUpdate - ' + fid);
}


function clubAdded(club) {

    if(club.clubtype == 0) {
        io.sockets.in('member_' + club.socid).emit('clubAdded', club);
    } else if(club.clubtype == 1) {
        io.sockets.in('member').emit('clubAdded', club);
    }
    updator.clubAddedUpdate(club, function() {});
    console.log('Notifier#clubAdded - ' + club.name );
}

function clubEventAdded(clubtype, socid, newEvent) {

    if(clubtype == 0) {
        io.sockets.in('member_' + socid).emit('clubEventAdded', newEvent);    
    } else if(clubtype == 1) {
        io.sockets.in('member').emit('clubEventAdded', newEvent);
    }
    //updator.forumCommentUpdate(forum, newComment, function() {});
    console.log('Notifier#clubEventAdded - ' + newEvent.title);
}

function clubPostAdded(clubtype, socid, newPost) {

    if(clubtype == 0) {
        io.sockets.in('member_' + socid).emit('clubPostAdded', newPost);    
    } else if(clubtype == 1) {
        io.sockets.in('member').emit('clubPostAdded', newPost.title);
    }
    //updator.forumCommentUpdate(forum, newComment, function() {});
    console.log('Notifier#clubPostAdded - ' + newPost.title );
}

function memberAdded(user) {

    io.sockets.in('admin_' + user.socid).emit('memberAdded', user);
    io.sockets.in('member_' + user.socid).emit('memberAdded', user);
    updator.memberAddedUpdate(user, function() {});
    console.log('Notifier#memberAdded: ' + user.email);
}


function familyMemberReported(reportuid, socid, flat) {
    
    io.sockets.in('admin_' + socid).emit('familyMemberReported', reportuid);
    io.sockets.in('flat_' + socid + '_' + flat).emit('familyMemberReported', reportuid);
    console.log('Notifier#familyMemberReported: ' + flat);
}

function memberRemovedByAdmin(uid, socid) {
    
    io.sockets.in('admin_' + socid).emit('memberRemovedByAdmin', uid);
    console.log('Notifier#memberRemovedByAdmin: ' + uid);
}

function memberBlockedByAdmin(uid, socid) {
    
    io.sockets.in('admin_' + socid).emit('memberBlockedByAdmin', uid);
    console.log('Notifier#memberBlockedByAdmin: ' + uid);
}

function memberUnblockedByAdmin(uid, socid, flat) {
    
    io.sockets.in('admin_' + socid).emit('memberUnblockedByAdmin', uid);
    console.log('Notifier#memberUnblockedByAdmin: ' + flat);
}

function memberCleanedByAdmin(uid, socid, flat) {
    
    io.sockets.in('admin_' + socid).emit('memberCleanedByAdmin', uid);
    console.log('Notifier#memberCleanedByAdmin: ' + flat);
}


function userRegistered(uid) {
    console.log('Notifier#userRegistered: ' + uid);
}


function pollAdded(poll) {
    
    io.sockets.in('member').emit('classifiedAdded', classified);
    console.log('Notifier#classifiedAdded - ' + classified.title);
}

function feedbackAdded(feedback) {
    
    console.log('Notifier#feedbackAdded - ' + feedback.byemail);
}

function supportAdded(support) {
    
    console.log('Notifier#supportAdded - ' + support.byemail);
}

function othersocietyAdded(othersociety) {
    
    console.log('Notifier#othersocietyAdded - ' + othersociety.byemail);
}