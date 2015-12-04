/******************************************************************************
 *
 *  admin.js - routes for ADMIN
 *
 *****************************************************************************/

var express = require('express');
var router = express.Router();
var multer = require('multer');
var fs = require('fs');
var service = require('../dataservice/admin');

/* CORS */
var whitelist = ['http://localhost:3000', 'http://ec2-52-1-140-5.compute-1.amazonaws.com:8080'];
var corsOptionsDelegate = function(req, callback){
  var corsOptions;
  if(whitelist.indexOf(req.header('Origin')) !== -1){
    corsOptions = { origin: true, credentials: true }; // reflect (enable) the requested origin in the CORS response 
  }else{
    corsOptions = { origin: false }; // disable CORS for this request 
  }
  callback(null, corsOptions); // callback expects two parameters: error and options 
};

router.use('', require('./filter.js').apply);


/* NOTICE */
router.post('/notices', service.postNotices);
router.post('/notices/chunk', service.postNoticesChunk);  // recSkip
router.post('/notice', service.postNotice);		// nid
router.post('/notice/compose', service.postNoticeCompose);
router.post('/notice/upload', multer({
  dest: './public/uploads/notice',
  rename: function (fieldname, filename, req, res) {
    return req.uid + '_' +  Date.now()
  },
  changeDest: function(dest, req, res) {
    var stat = null;
    dest = dest + '/' + req.socid;
    try {
        // using fs.statSync; NOTE that fs.existsSync is now deprecated; fs.accessSync could be used but is only nodejs >= v0.12.0
        stat = fs.statSync(dest);
    } catch(err) {
        // for nested folders, look at npm package "mkdirp"
        fs.mkdirSync(dest);
    }

    if (stat && !stat.isDirectory()) {
        // Woh! This file/link/etc already exists, so isn't a directory. Can't save in it. Handle appropriately.
        throw new Error('Directory cannot be created because an inode of a different type exists at "' + dest + '"');
    }
    return dest;
  }
}), service.postNoticeUpload);
router.post('/notice/remove', service.postNoticeRemove);

router.post('/notices/time/:time', service.notImplemented);

/* COMPLAINT */
router.post('/complaints', service.postComplaints);
router.post('/complaints/chunk', service.postComplaintsChunk);
router.post('/complaint', service.postComplaint);	// compid
router.post('/complaint/timeline', service.postComplaintTimeline); // compid
router.post('/complaint/escalate', service.postComplaintEscalate); 	// compid
router.post('/complaint/processing', service.postComplaintProcessing); 	// compid
router.post('/complaint/resolved', service.postComplaintResolved); 	// compid
router.post('/complaint/remove', service.postComplaintRemove);	// compid
router.post('/complaint/comment', service.postComplaintComment);	// compid

router.post('/complaints/time/:time', service.notImplemented);



/* CLASSIFIED */
router.post('/classifieds', service.postClassifieds);
router.post('/classified', service.postClassified);		// cid

router.post('/classifieds/time/:time', service.notImplemented);


/* CONTACT */
router.post('/contacts', service.postContacts);
router.post('/contacts/category', service.postContactsByCateogory);
router.post('/contact/add', service.postContactAddByCategory);
router.post('/contact/remove', service.postContactRemove);
router.post('/contact/update', service.postContactUpdate);


/* MEMBERS */
router.post('/members', service.postMembers);
router.post('/members/chunk', service.postMembersChunk); // recSkip
router.post('/member', service.postMember);		// uid
router.post('/member/complaints', service.postMemberComplaints);		// uid
router.post('/member/remove', service.postMemberRemove); 	// uid
router.post('/member/block', service.postMemberBlock);  // uid
router.post('/member/unblock', service.postMemberUnblock);  // uid
router.post('/member/clean', service.postMemberClean);  // uid


/* POLL */
router.post('/polls', service.postPolls);
router.post('/poll', service.postPoll);
router.post('/poll/add', service.postPollAdd);
router.post('/poll/remove', service.postPollRemove);


/* PROFILE */
router.post('/profile/boot', service.postProfileBoot);
router.post('/profile/name', service.postName);	//	name
router.post('/profile/data', service.postProfileData);	//	name, address, tor, email, phone
router.post('/profile/update/name', service.postUpdateName);	//	name
router.post('/profile/update/phone', service.postUpdatePhone);	//	phone
router.post('/profile/update/position', service.postUpdatePosition);  //  position
router.post('/profile/update/department', service.postUpdateDepartment);  //  department
router.post('/profile/reset/password', service.postResetPassword);	//	oldp, newp
router.post('/profile/becomemember', service.postBecomeMember); //  flat
router.post('/profile/update/imagedp', service.postUpdateImageDp);  // imagedp
router.post('/profile/update/imagedp', multer({
  dest: './public/uploads/imagedp',
  rename: function (fieldname, filename, req, res) {
    return req.uid + '.png'
  },
  changeDest: function(dest, req, res) {
    var stat = null;
    //dest = dest + '/' + req.socid;
    try {
        // using fs.statSync; NOTE that fs.existsSync is now deprecated; fs.accessSync could be used but is only nodejs >= v0.12.0
        stat = fs.statSync(dest);
    } catch(err) {
        // for nested folders, look at npm package "mkdirp"
        fs.mkdirSync(dest);
    }

    if (stat && !stat.isDirectory()) {
        // Woh! This file/link/etc already exists, so isn't a directory. Can't save in it. Handle appropriately.
        throw new Error('Directory cannot be created because an inode of a different type exists at "' + dest + '"');
    }
    return dest;
  }
}), service.postUpdateImageDp); //  image

/* SOCIETY */
router.post('/society/info', service.postSocietyInfo);
router.post('/society/update/flatsample', service.postUpdateFlatSample);  //  flatsample
router.post('/society/update/layoutflats', service.postUpdateLayoutFlats);  //  layoutflats
router.post('/society/update/layout', service.postUpdateLayout);


/* ADMIN */
router.post('/admins', service.postAdmins);
router.post('/admin', service.postAdmin);   // uid
router.post('/admin/add', service.postAdminAdd);   // email, role
router.post('/admin/remove', service.postAdminRemove);   // uid


/* NOTIFICATION */
router.post('/notifications', service.postNotifications);
router.post('/notifications/chunk', service.postNotificationsChunk);
router.post('/notifications/cleartotal', service.postNotificationsCleartotal);

/* RULES */
router.post('/rules', service.postRules);
router.post('/rules/edit', service.postRulesEdit);

/* ISSUES */
//router.post('/issues/chunk', service.postIssues);
//router.post('/issue', service.postIssue);
//router.post('/issue/add', service.postIssueAdd);

router.post('/dual', service.postDual);
router.post('/delete', service.postDelete);
router.post('/suspend', service.postSuspend);
router.post('/logout', service.postLogout);

////////////////////

/* NOT IMPLEMENTED ROUTES */
function notImplemented(req, res, next) {
	next(new Error(
    	'Data service method for ' + req.method + ' ' + req.url+ ' is not implemented'
  	));
}


module.exports = router;

/***********************************  END  ***********************************/