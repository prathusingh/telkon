/******************************************************************************
 *
 *  member.js - routes for MEMBER
 *
 *****************************************************************************/

var express = require('express');
var router = express.Router();
var multer = require('multer');
var fs = require('fs');
var service = require('../dataservice/member');

router.use('', require('./filter.js').apply);


/* NOTICE */
router.post('/notices', service.postNotices);
router.post('/notices/chunk', service.postNoticesChunk);  // recSkip
router.post('/notice', service.postNotice);		// nid
router.post('/notice/read', service.postNoticeRead);	// nid
router.post('/notice/save', service.postNoticeSave);	// nid
router.post('/notice/unsave', service.postNoticeUnsave);	// nid

router.post('/notices/time/:time', service.notImplemented);



/* COMPLAINT */
router.post('/complaints', service.postComplaints);
router.post('/complaints/chunk', service.postComplaintsChunk);   // recSkip
router.post('/complaint/types', service.postComplaintTypes);
router.post('/complaint', service.postComplaint);	// compid
router.post('/complaint/timeline', service.postComplaintTimeline); // compid
router.post('/complaint/escalate', service.postComplaintEscalate); 	// compid
router.post('/complaint/remove', service.postComplaintRemove);	// compid
router.post('/complaint/add', service.postComplaintAdd);	// category, subject, desc
router.post('/complaint/comment', service.postComplaintComment);	// compid, comments


router.post('/complaints/time/:time', service.notImplemented);



/* CLASSIFIED */
router.post('/classifieds', service.postClassifieds);
router.post('/classifieds/chunk', service.postClassifiedsChunk);
router.post('/classified/types', service.postClassifiedTypes);
router.post('/classified', service.postClassified);		// cid
router.post('/classified/read', service.postClassifiedRead);	// cid
router.post('/classified/save', service.postClassifiedSave);	// cid
router.post('/classified/unsave', service.postClassifiedUnsave);	// cid
router.post('/classified/add', service.postClassifiedAdd);	// category, title, details

router.post('/classifieds/time/:time', service.notImplemented);


/* CONTACT */
router.post('/contacts', service.postContacts);
router.post('/contacts/category', service.postContactsByCateogory);

/* FORUM */
router.post('/forums', service.postForums);
router.post('/forums/chunk', service.postForumsChunk);   // recSkip
router.post('/forum/comments/chunk', service.postForumCommentsChunk);   // recSkip
router.post('/forum', service.postForum);		// fid
router.post('/forum/read', service.postForumRead);	// fid
router.post('/forum/favorite', service.postForumFavorite);	// fid
router.post('/forum/unfavorite', service.postForumUnfavorite);	// fid
router.post('/forum/add', service.postForumAdd);	// title, details
router.post('/forum/comment/add', service.postForumCommentAdd);	// fid, value
router.post('/forum/emo', service.postForumEmo);	// fid, emotype


/* CLUB */
router.post('/clubs', service.postClubs);   // recSkip, clubtype
router.post('/clubs/chunk', service.postClubsChunk);   // clubtype, recSkip
router.post('/club', service.postClub);   // clubid
router.post('/club/members/chunk', service.postClubMembersChunk);   // clubid
router.post('/club/member/remove', service.postClubMemberRemove);   // clubid, memberuid
router.post('/club/events/chunk', service.postClubEventsChunk);   // clubid
router.post('/club/event/add', service.postClubEventAdd);   // date, title, details, venue, image
router.post('/club/posts/chunk', service.postClubPostsChunk);   // clubid
router.post('/club/post', service.postClubPost);   // clubpostid
router.post('/club/post/add', service.postClubPostAdd);   // title, details
router.get('/club/categories', service.getClubCategories);
router.post('/club/add', service.postClubAdd);   // clubtype, category, name, details, imagedp
router.post('/club/remove', service.postClubRemove);   // clubid
router.post('/club/subscribe', service.postClubSubscribe);   // clubid
router.post('/club/unsubscribe', service.postClubUnsubscribe);   // clubid
router.post('/club/update/name', service.postClubUpdateName);   // name
router.post('/club/update/imagedp', service.postClubUpdateImagedp);   // imagedp


/* SIDENAVS */
router.post('/myforums', service.postMyForums);
router.post('/myforum/remove', service.postMyForumRemove);  // fid
router.post('/myclubs', service.postMyClubs);
router.post('/myclub/remove', service.postMyClubRemove);  // clubid
router.post('/family', service.postFamily);
router.post('/family/report', service.postFamilyReport);	// reportuid
router.post('/members/chunk', service.postMembersChunk); // recSkip
router.post('/myclassifieds', service.postMyClassifieds);
router.post('/myclassified/remove', service.postMyClassifiedRemove);	// cid
router.post('/savednotices', service.postSavedNotices);
router.post('/savedclassifieds', service.postSavedClassifieds);
router.post('/rules', service.postRules);


/* PROFILE */
router.post('/profile/boot', service.postProfileBoot);
router.post('/profile/name', service.postName);	//	name
router.post('/profile/data', service.postProfileData);	//	name, address, tor, email, phone
router.post('/profile/update/gcmid', service.postUpdateGcmid);	// gcmid
router.post('/profile/update/name', service.postUpdateName);	//	name
router.post('/profile/update/aboutme', service.postUpdateAboutme);  //  aboutme
router.post('/profile/update/phone', service.postUpdatePhone);	//	phone
router.post('/profile/society/info', service.postProfileSocietyInfo);
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
}), service.postUpdateImageDp);	//	image
router.post('/profile/reset/password', service.postResetPassword);	//	oldp, newp
router.post('/delete', service.postDelete);
router.post('/suspend', service.postSuspend);
router.post('/logout', service.postLogout);


/* NOTIFICATION */
router.post('/notifications', service.postNotifications);
router.post('/notifications/chunk', service.postNotificationsChunk);
router.post('/notifications/cleartotal', service.postNotificationsCleartotal);

/* FEEDBACK */
router.post('/feedbacks', service.postFeedbacks);
router.post('/feedback/add', service.postFeedbackAdd);

/* SUPPORT */
router.post('/support/add', service.postSupportAdd);

/* USER */
router.post('/user', service.postUser);
router.post('/user/clubs/chunk', service.postUserClubsChunk);

/* SOCIETY */
router.post('/society', service.postSociety);
router.post('/society/members/chunk', service.postSocietyMembersChunk);
router.post('/society/clubs/chunk', service.postSocietyClubsChunk);

/* SET UP*/
router.post('/profile/personal', service.postPersonal);	//	name, phone



module.exports = router;

/***********************************  END  ***********************************/