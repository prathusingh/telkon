/******************************************************************************
 *
 *  member.js - data service for MEMBER
 *
 *****************************************************************************/

var mongoose = require('mongoose');
var moment = require("moment");
var async = require('async');

var User = require('../models/user.js');
var Society = require('../models/society.js');
var Notice = require('../models/notice.js');
var Complaint = require('../models/complaint.js');
var Classified = require('../models/classified.js');
var Contact = require('../models/contact.js');
var Forum = require('../models/forum.js');
var Club = require('../models/club.js');
var ClubPost = require('../models/clubpost.js');
var Notification = require('../models/notification.js');
var Feedback = require('../models/feedback.js');
var Support = require('../models/support.js');

var notifier = require('./notifier');
var staticData = require('../static.js');
var helper = require('../helper.js');
var header = require('../header.js');
var mailer = require('../mailer.js');
var telkonlogger = require('../logger');

var RECORD_LIMIT_NOTICES = 2 || header.recLimit.member.notices;
var RECORD_LIMIT_COMPLAINTS = 2 || header.recLimit.member.complaints;
var RECORD_LIMIT_CLASSIFIEDS = 2 || header.recLimit.member.classifieds;
var RECORD_LIMIT_CONTACTS = 10 || header.recLimit.member.contacts;
var RECORD_LIMIT_FORUMS = 6 || header.recLimit.member.forums;
var RECORD_LIMIT_FORUM_COMMENTS = 4 || header.recLimit.member.forumcomments;
var RECORD_LIMIT_NOTIFICATION = 5 || header.recLimit.member.notifications;
var RECORD_LIMIT_MEMBERS = 2 || header.recLimit.member.members;
var RECORD_LIMIT_CLUBS = 20 || header.recLimit.member.clubs;
var RECORD_LIMIT_CLUB_MEMBERS = 2 || header.recLimit.member.clubmembers;
var RECORD_LIMIT_CLUB_EVENTS = 2 || header.recLimit.member.clubevents;
var RECORD_LIMIT_CLUB_POSTS = 2;
var RECORD_LIMIT_SOCIETY_MEMBERS = 2 || header.recLimit.member.societymembers;
var RECORD_LIMIT_SOCIETY_CLUBS = 2 || header.recLimit.member.societyclubs;
var RECORD_LIMIT_USER_CLUBS = 10 || header.recLimit.member.userclubs;

module.exports = {

	notImplemented					: notImplemented,

	/* SET UP */
	postPersonal					: postPersonal,

	/* PROFILE */
	postProfileBoot					: postProfileBoot,
	postName 						: postName,
	postProfileData 				: postProfileData,
	postUpdateGcmid					: postUpdateGcmid,
	postUpdateName					: postUpdateName,
	postUpdateAboutme				: postUpdateAboutme,
	postUpdatePhone					: postUpdatePhone,
	postUpdateImageDp				: postUpdateImageDp,
	postProfileSocietyInfo			: postProfileSocietyInfo,
	postResetPassword				: postResetPassword,
	postLogout						: postLogout,
	postSuspend						: postSuspend,
	postDelete						: postDelete,
	
	/* NOTICE */
	postNotices						: postNotices,
	postNoticesChunk				: postNoticesChunk,
	postNotice						: postNotice,
	postNoticeRead					: postNoticeRead,
	postNoticeSave      		  	: postNoticeSave,
	postNoticeUnsave		 	   	: postNoticeUnsave,

	/* COMPLAINT */
	postComplaints					: postComplaints,
	postComplaintsChunk				: postComplaintsChunk,
	postComplaintTypes				: postComplaintTypes,
	postComplaint 					: postComplaint,
	postComplaintTimeline			: postComplaintTimeline,
	postComplaintEscalate			: postComplaintEscalate,
	postComplaintRemove				: postComplaintRemove,
	postComplaintAdd				: postComplaintAdd,
	postComplaintComment 			: postComplaintComment,

	/* CLASSIFIED */
	postClassifieds   				: postClassifieds,
	postClassifiedsChunk			: postClassifiedsChunk,
	postClassifiedTypes				: postClassifiedTypes,
	postClassified 					: postClassified,
	postClassifiedRead 				: postClassifiedRead,
	postClassifiedSave      		: postClassifiedSave,
	postClassifiedUnsave			: postClassifiedUnsave,
	postClassifiedAdd				: postClassifiedAdd,

	/* CONTACT */
	postContacts					: postContacts,
	postContactsByCateogory			: postContactsByCateogory,

	/* FORUM */
	postForums						: postForums,
	postForumsChunk					: postForumsChunk,
	postForum 						: postForum,
	postForumCommentsChunk			: postForumCommentsChunk,
	postForumRead					: postForumRead,
	postForumFavorite				: postForumFavorite,
	postForumUnfavorite				: postForumUnfavorite,
	postForumAdd					: postForumAdd,
	postForumCommentAdd				: postForumCommentAdd,
	postForumEmo 					: postForumEmo,

	/* CLUB */
	postClubs 						: postClubs,
	postClubsChunk					: postClubsChunk,
	postClub 						: postClub,
	postClubMembersChunk			: postClubMembersChunk,
	postClubMemberRemove			: postClubMemberRemove,
	postClubEventsChunk				: postClubEventsChunk,
	postClubEventAdd				: postClubEventAdd,
	postClubPostsChunk				: postClubPostsChunk,
	postClubPost 					: postClubPost,
	postClubPostAdd					: postClubPostAdd,
	getClubCategories				: getClubCategories,
	postClubAdd						: postClubAdd,
	postClubRemove					: postClubRemove,
	postClubSubscribe				: postClubSubscribe,
	postClubUnsubscribe				: postClubUnsubscribe,
	postClubUpdateName				: postClubUpdateName,
	postClubUpdateImagedp			: postClubUpdateImagedp,

	/* SIDENAV */
	postMyClubs						: postMyClubs,
	postMyClubRemove				: notImplemented,
	postFamily						: postFamily,
	postFamilyReport				: postFamilyReport,
	postMembersChunk				: postMembersChunk,
	postMyClassifieds 				: postMyClassifieds,
	postMyClassifiedRemove 			: postMyClassifiedRemove,
	postMyForums					: postMyForums,
	postMyForumRemove				: postMyForumRemove,
	postSavedNotices				: postSavedNotices,
	postSavedClassifieds			: postSavedClassifieds,

	/* NOTIFICATION */
	postNotifications				: postNotifications,
	postNotificationsChunk			: postNotificationsChunk,
	postNotificationsCleartotal		: postNotificationsCleartotal,

	/* FEEDBACK */
	postFeedbacks					: postFeedbacks,
	postFeedbackAdd					: postFeedbackAdd,

	/* RULES */
	postRules						: postRules,

	/* USER */
	postUser 						: postUser,
	postUserClubsChunk				: postUserClubsChunk,

	/* SOCIETY */
	postSociety 					: postSociety,
	postSocietyMembersChunk			: postSocietyMembersChunk,
	postSocietyClubsChunk			: postSocietyClubsChunk,

	/* SUPPORT*/
	postSupportAdd					: postSupportAdd
};


////////////////////

/* NOT IMPLEMENTED ROUTES */
function notImplemented(req, res, next) {
	next(new Error(
    	'Data service method for ' + req.method + ' ' + req.url+ ' is not implemented'
  	));
}


/* POST /member/profile/personal */
function postPersonal(req, res, next) {

	var uid = req.uid;
	var socid = req.socid;

	var name = req.body.name;
	var phone = req.body.phone;

	var query = {};
	var projection = {};

	var params = [];
	params.push(name);
	params.push(phone);

	if(helper.validateParams(params) == false) {
		
		res.status(400).json({
			message: 'error_invalidparams'
		});
		telkonlogger.logErr(req, res, 'Invalid parameters');

	} else {
		
		query = {
			uid: uid,
			socid: socid
		};

		User.findOne(query, function(err, user){
			if(err) {
					
				res.status(500).json({
					message: 'error_queryuser'
				});
				telkonlogger.logErr(req, res, err.message);

			} else {
					
				user.name = name;
				user.phone = phone;

				user.save(function(err) {

					if(err) {

						res.status(500).json({
							message: 'error_saveuser'
						});
						telkonlogger.logErr(req, res, err.message);

					} else {

						res.status(200).json({
							status: 'suc',
							message: 'updated'
						});
						telkonlogger.logSuc(req, res, 'Updated successfully');

					}
				});

			}
		});
	}
}


/* POST /member/profile/name */
function postName(req, res, next) {

	res.status(200).json({
		status: 'suc',
		data: req.user.name || ''
	});
	telkonlogger.logSuc(req, res, 'Data sent successfully');
}


/* POST /member/profile/boot */
function postProfileBoot(req, res, next) {

	var role = req.user.role;
	var mode = 0;
	if(role === 7 || role === 8) {
		mode = 1;
	}

	var data = {
		name: req.user.name || '',
		mode: mode,
		imagedp: req.user.imagedp || ''
	}

	res.status(200).json({
		status: 'suc',
		data: data
	});
	telkonlogger.logSuc(req, res, 'Data sent successfully');
}


/* POST /member/profile/data */
function postProfileData(req, res, next) {

	var user = req.user;

	var data = {
		uid: user.uid,
		socid: user.socid,
		name: user.name,
		email: user.email,
		residencetype: user.residencetype,
		phone: user.phone,
		flat: user.flat,
		societyname: user.societyname,
		city: user.city,
		imagedp: user.imagedp
	}

	res.status(200).json({
		status: 'suc',
		data: data
	});
	telkonlogger.logSuc(req, res, 'Data sent successfully');
}


/* POST /member/update/gcmid */
function postUpdateGcmid(req, res, next) {

	var uid = req.uid;
	var gcmid = req.body.gcmid;

	var params = [];
	params.push(gcmid);

	if(helper.validateParams(params) == false) {
		
		res.status(400).json({
			message: 'error_invalidparams'
		});
		telkonlogger.logErr(req, res, 'Invalid parameters');

	} else {

		User.update({
			uid: uid
		}, {
			gcmid: gcmid

		}, function(err){

			if(err) {

				res.status(500).json({
					message: 'error_updateuser'
				});
				telkonlogger.logErr(req, res, err.message);

			} else {

				res.status(200).json({
					status: 'suc',
					message: 'updated'
				});
				telkonlogger.logSuc(req, res, 'Updated successfully');
			}
		});
	}
}


/* POST /member/profile/update/name */
function postUpdateName(req, res, next) {

	var uid = req.uid;
	var name = req.body.name;

	var params = [];
	params.push(name);

	if(helper.validateParams(params) == false) {
		
		res.status(400).json({
			message: 'error_invalidparams'
		});
		telkonlogger.logErr(req, res, 'Invalid parameters');

	} else {

		//name = helper.toTitleCase(name);
		User.update({
			uid: uid
		}, {
			name: name

		}, function(err){
			if(err) {

				res.status(500).json({
					message: 'error_updateuser'
				});
				telkonlogger.logErr(req, res, err.message);

			} else {

				res.status(200).json({
					status: 'suc',
					message: 'updated'
				});
				telkonlogger.logSuc(req, res, 'Updated successfully');
			}
		});
	}
}


/* POST /member/profile/update/aboutme */
function postUpdateAboutme(req, res, next) {

	var uid = req.uid;
	var aboutme = req.body.aboutme;

	var params = [];
	params.push(aboutme);

	if(helper.validateParams(params) == false) {
		
		res.status(400).json({
			message: 'error_invalidparams'
		});
		telkonlogger.logErr(req, res, 'Invalid parameters');

	} else {

		aboutme = helper.capitalizeFirstLetter(aboutme);
		User.update({
			uid: uid
		}, {
			aboutme: aboutme

		}, function(err){
			if(err) {

				res.status(500).json({
					message: 'error_updateuser'
				});
				telkonlogger.logErr(req, res, err.message);

			} else {

				res.status(200).json({
					status: 'suc',
					message: 'updated'
				});
				telkonlogger.logSuc(req, res, 'Updated successfully');
			}
		});
	}
}


/* POST /member/profile/update/phone */
function postUpdatePhone(req, res, next) {

	var uid = req.uid;
	var phone = req.body.phone;

	var params = [];
	params.push(phone);

	if(helper.validateParams(params) == false) {
		
		res.status(400).json({
			message: 'error_invalidparams'
		});
		telkonlogger.logErr(req, res, 'Invalid parameters');

	} else {

		User.update({
			uid: uid
		}, {
			phone: phone
		}, function(err){

			if(err) {

				console.log(err);
				res.status(500).json({
					message: 'error_updateuser'
				});
				telkonlogger.logErr(req, res, err.message);

			} else {

				res.status(200).json({
					status: 'suc',
					message: 'updated'
				});
				telkonlogger.logSuc(req, res, 'Updated successfully');
			}
		});
	}
}


/* POST /member/profile/update/imagedp */
function postUpdateImageDp(req, res, next) {

	var uid = req.uid;
	var imagedp = req.body.imagedp;

	var params = [];
	params.push(imagedp);

	if(helper.validateParams(params) == false) {
		
		res.status(400).json({
			message: 'error_invalidparams'
		});
		telkonlogger.logErr(req, res, 'Invalid parameters');

	} else {

		User.update({
			uid: uid
		}, {
			imagedp: imagedp
		}, function(err){

			if(err) {

				res.status(500).json({
					message: 'error_updateuser'
				});
				telkonlogger.logErr(req, res, err.message);

			} else {

				res.status(200).json({
					status: 'suc',
					message: 'updated'
				});
				telkonlogger.logSuc(req, res, 'Updated successfully');
			}
		});
	}
}


/* POST /member/profile/society/info */
function postProfileSocietyInfo(req, res, next) {

	var socid = req.socid;

	var query = {
		socid: socid
	}
	var projection = {
		_id: 0,
		societyname: 1,
		societycode: 1,
		locality: 1,
		city: 1,
		pincode: 1,
		societyrules: 1,
		flatsample: 1,
		layoutphase: 1,
		layouttower: 1,
		layoutblock: 1,
		layoutflats: 1
	}

	Society.findOne(query, projection, function(err, data) {

		if(err) {

			res.status(500).json({
				message: 'error_querysociety'
			});
			telkonlogger.logErr(req, res, err.message);

		} else {

			res.status(200).json({
				status: 'suc',
				data: data || {}
			});
			telkonlogger.logSuc(req, res, 'Data sent successfully');
		}
	});
}


/* POST /member/profile/reset/password */
function postResetPassword(req, res, next) {

	var uid = req.uid;
	var oldp = req.body.oldp;
	var newp = req.body.newp;

	var params = [];
	params.push(oldp);
	params.push(newp);

	if(helper.validateParams(params) == false) {
		
		res.status(400).json({
			message: 'error_invalidparams'
		});
		telkonlogger.logErr(req, res, 'Invalid parameters');

	} else {

		var query = {
			uid: uid
		};

		User.findOne(query, function(err, user){
			
			if(err) {

				res.status(500).json({
					message: 'error_queryuser'
				});
				telkonlogger.logErr(req, res, err.message);

			} else {

				if(oldp !== user.password) {

					res.status(200).json({
						status: 'suc',
						message: 'error_incorrect'
					});
					telkonlogger.logSuc(req, res, 'Password incorrect');

				} else {
					user.password = newp;
					user.save(function(err){
						if(err) {

							res.status(500).json({
								message: 'error_saveuser'
							});
							telkonlogger.logErr(req, res, err.message);

						} else {

							res.status(200).json({
								status: 'suc',
								message: 'reset'
							});
							telkonlogger.logSuc(req, res, 'Updated successfully');

						}
					});
				}
			}
		});
	}
}


/* POST /member/logout */
function postLogout(req, res, next) {

	req.session.uid = null;
	req.session.google = false;
  	req.session.destroy(function(err) {

	  	res.status(200).json({
		    status: 'suc',
		    message: 'loggedout'
	  	});
	  	telkonlogger.logSuc(req, res, 'Logged out successfully');

	});
}


/* POST /member/suspend */
function postSuspend(req, res, next) {

	var uid = req.uid;
	var socid = req.socid;

	var query = {
		uid: uid,
		isactive: true
	};

	User.findOne(query, function(err, user) {

		if(err) {

			res.status(500).json({
				message: 'error_queryuser'
			});
			telkonlogger.logErr(req, res, err.message);

		} else {

			var role = user.role;
			if(role == 7 || role == 8) {
				
				/* User is also an Admin */
				if(role == 7) {
					user.role = 5;
				} else if(role == 8) {
					user.role = 6;
				}

				user.reported = [];
				user.isreported = false;
				user.reportedby = [];
				user.noticesread = null;
				user.classifiedsread = []
				user.myclassifieds = [];
				user.savednotices = [];
				user.savedclassifieds = [];
				user.updates = [];
				user.membersince = null;

				user.save(function(err) {

					if(err) {
						
						res.status(500).json({
							message: 'error_saveuser'
						});
						telkonlogger.logErr(req, res, err.message);

					} else {

						req.session.uid = null;
			  			req.session.destroy(function(err) {
						});
						res.status(200).json({
							status: 'suc',
							message: 'suspended'
						});
						telkonlogger.logSuc(req, res, 'Account suspended successfully - ' + req.user.email);
					}

				});

			} else {

				user.flat = null;
				user.socid = null;
				user.societyname = null;
				user.city = null;
				user.role = 2;
				user.residencetype = null;
				user.reported = [];
				user.isreported = false;
				user.reportedby = [];
				user.noticesread = null;
				user.classifiedsread = []
				user.myclassifieds = [];
				user.savednotices = [];
				user.savedclassifieds = [];
				user.updates = [];
				user.membersince = null;

				user.save(function(err) {

					if(err) {
						
						res.status(500).json({
							message: 'error_saveuser'
						});
						telkonlogger.logErr(req, res, err.message);

					} else {

						query = {uid: uid};
						Notification.findOneAndRemove(query, function(err) {

							if(err) {

								res.status(500).json({
									message: 'error_removenotification'
								});
								telkonlogger.logErr(req, res, err.message);

							} else {

								req.session.uid = null;
					  			req.session.destroy(function(err) { });
								res.status(200).json({
									status: 'suc',
									message: 'suspended'
								});
								telkonlogger.logSuc(req, res, 'Account suspended successfully - ' + req.user.email);

							}
						});
					}
				});
			}
		}
	});
}


/* POST /member/delete */
function postDelete(req, res, next) {

	var uid = req.uid;
	var socid = req.socid;

	var query = {
		uid: uid,
		isactive: true
	};

	User.findOneAndRemove(query, function(err) {

		if(err) {

			res.status(500).json({
				message: 'error_removeuser'
			});
			telkonlogger.logErr(req, res, err.message);

		} else {

			query = {uid: uid};
			Notification.findOneAndRemove(query, function(err) {

				if(err) {

					res.status(500).json({
						message: 'error_removenotification'
					});
					telkonlogger.logErr(req, res, err.message);

				} else {

					req.session.uid = null;
		  			req.session.destroy(function(err) { });
					res.status(200).json({
						status: 'suc',
						message: 'deleted'
					});
					telkonlogger.logSuc(req, res, 'Account deleted successfully - ' + req.user.email);
				}
			});
		}
	});
}


/* POST /member/notices */
function postNotices(req, res, next) {

	var uid = req.uid;
	var socid = req.socid;
	var meantfor = req.user.residencetype;
	var noticefor = [];
	noticefor.push(2);
	noticefor.push(meantfor);

	var search = req.body.search || '';
	var searchReg = new RegExp(search, 'g');

	var query = {
		socid: socid,
		$or: [
			{title: { $regex: searchReg, $options: "i" }}
		],
		expiry: {$gte: moment()},
		meantfor: { $in: noticefor},
		isactive: true
	};
	var projection = {
		_id: 0,
		nid: 1,
		title: 1,
		contentshort: 1,
		createdat: 1
	};
	var paginate = {
		sort:
		{
			_id: -1
		},
		limit: RECORD_LIMIT_NOTICES
	};

	Notice.find(query, projection, paginate, function(err, data) {

		if(err) {

			res.status(500).json({
				message: 'error_querynotice'
			});
			telkonlogger.logErr(req, res, err.message);

		} else {

			query = {uid: uid};
			projection = {
				_id: 0,
				savednotices: 1,
				noticesread: 1
			};

			User.findOne(query, projection, function(err, user) {

				if(err) {

					res.status(500).json({
						message: 'error_queryuser'
					});
					telkonlogger.logErr(req, res, err.message);

				} else {

					res.status(200).json({
						status: 'suc',
						data: {
							notices: data || [],
							noticesread: user.noticesread || [],
							savednotices: user.savednotices || []
						}
					});
					telkonlogger.logSuc(req, res, 'Data sent successfully');
				}
			});
		}

	});
}


/* POST /admin/notices/chunk */
function postNoticesChunk(req, res, next) {

	var uid = req.uid;
	var socid = req.socid;
	var recSkip = req.body.recSkip || 0;
	var search = req.body.search || '';
	var searchReg = new RegExp(search, 'g');

	var objID = new mongoose.Types.ObjectId;
	var query = {
		socid: socid,
		$or: [
			{title: { $regex: searchReg, $options: "i" }}
		],
		expiry: {$gte: moment()},
		isactive: true
	};
	var projection = {
		_id: 0,
		nid: 1,
		title: 1,
		contentshort: 1,
		createdat: 1
	};
	var paginate = {
		sort:
		{
			_id: -1
		},
		skip: recSkip*RECORD_LIMIT_NOTICES,
		limit: RECORD_LIMIT_NOTICES
	};

	Notice.find(query, projection, paginate, function(err, data) {

		if(err) {

			res.status(500).json({
				message: 'error_querynotice'
			});
			telkonlogger.logErr(req, res, err.message);

		} else {

			res.status(200).json({
				status: 'suc',
				data: data || []
			});
			telkonlogger.logSuc(req, res, 'Data sent successfully');
		}

	});
}


/* POST /member/notice */
function postNotice(req, res, next) {

	var uid = req.uid;
	var socid = req.socid;
	var nid = req.body.nid;

	var params = [];
	params.push(nid);

	if(helper.validateParams(params) == false) {
		
		res.status(400).json({
			message: 'error_invalidparams'
		});
		telkonlogger.logErr(req, res, 'Invalid parameters');

	} else {

		var query = {
			nid: nid,
			socid: socid
		};
		var projection = {
			_id: 0,
			nid: 1,
			title: 1,
			desc: 1,
			socid: 1,
			contenturl: 1,
			createdat: 1,
			byname: 1,
			byposition: 1,
			bydepartment: 1,
			bysocietyname: 1
		};

		Notice.findOne(query, projection, function(err, data) {

			if(err) {

				res.status(500).json({
					message: 'error_querynotice'
				});
				telkonlogger.logErr(req, res, err.message);

			} else {

				res.status(200).json({
					status: 'suc',
					data: data || {}
				});
				telkonlogger.logSuc(req, res, 'Data sent successfully');
			}
		});
	}	
}

//TODO: Check if Notice exists?
/* POST /member/notice/read */
function postNoticeRead(req, res, next) {

	var uid = req.uid;
	var socid = req.socid;
	var nid = req.body.nid;

	var params = [];
	params.push(nid);

	if(helper.validateParams(params) == false) {
		
		res.status(400).json({
			message: 'error_invalidparams'
		});
		telkonlogger.logErr(req, res, 'Invalid parameters');

	} else {

		var query = {uid: uid};
		var projection = {
			_id: 0,
			noticesread: 1
		};

		User.findOne(query, function(err, user) {
					
			if(err) {

				res.status(500).json({
					message: 'error_queryuser'
				});
				telkonlogger.logErr(req, res, err.message);

			} else {
		
				if(user.noticesread) {
					if(user.noticesread.indexOf(nid) != -1) {

						res.status(403).json({
							message: 'error_fatal'
						});
						telkonlogger.logFatal(req, res, 'Nid is already present in noticesread');

					} else {

						user.noticesread.push(nid);
						user.save(function(err) {

							if(!err) {
								res.status(200).json({
									status: 'suc',
									message: 'marked'
								});
								telkonlogger.logSuc(req, res, 'Marked successfully');
							}

						});
					}

				} else {

					user.noticesread = [];
					user.noticesread.push(nid);

					user.save(function(err) {

						if(!err) {
							res.status(200).json({
								status: 'suc',
								message: 'marked'
							});
							telkonlogger.logSuc(req, res, 'Marked successfully');
						}
					});
				}
			}
		});
	}	
}

//TODO: Check if Notice exists?
/* POST /member/notice/save */
function postNoticeSave(req, res, next) {

	var uid = req.uid;
	var socid = req.socid;
	var nid = req.body.nid;

	var params = [];
	params.push(nid);

	if(helper.validateParams(params) == false) {
		
		res.status(400).json({
			message: 'error_invalidparams'
		});
		telkonlogger.logErr(req, res, 'Invalid parameters');

	} else {

		var query = {uid: uid};
		var projection = {
			_id: 0,
			savednotices: 1
		};

		User.findOne(query, function(err, user) {
					
			if(err) {

				res.status(500).json({
					message: 'error_queryuser'
				});
				telkonlogger.logErr(req, res, err.message);

			} else {

				if(user.savednotices) {
					if(user.savednotices.indexOf(nid) != -1) {

						res.status(403).json({
							message: 'error_fatal'
						});
						telkonlogger.logFatal(req, res, 'Already present in savednotices');

					} else {

						user.savednotices.push(nid);
						user.save(function(err) {

							res.status(200).json({
								status: 'suc',
								message: 'saved'
							});
							telkonlogger.logSuc(req, res, 'Saved successfully');

						});
					}
				} else {

					user.savednotices = [];
					user.savednotices.push(nid);
					user.save(function(err) {

						res.status(200).json({
							status: 'suc',
							message: 'saved'
						});
						telkonlogger.logSuc(req, res, 'Saved successfully');

					});
				}
			}
		});
	}	
}

//TODO: Check if Notice exists?
/* POST /member/notice/unsave */
function postNoticeUnsave(req, res, next) {

	var uid = req.uid;
	var socid = req.socid;
	var nid = req.body.nid;

	var params = [];
	params.push(nid);

	if(helper.validateParams(params) == false) {
		
		res.status(400).json({
			message: 'error_invalidparams'
		});
		telkonlogger.logErr(req, res, 'Invalid parameters');

	} else {

		var query = {uid: uid};
		var projection = {
			_id: 0,
			savednotices: 1
		};

		User.findOne(query, function(err, user) {
					
			if(err) {

				res.status(500).json({
					message: 'error_queryuser'
				});
				telkonlogger.logErr(req, res, err.message);

			} else {
		
				if(user.savednotices) {

					var index = user.savednotices.indexOf(nid);
					if(index == -1) {

						res.status(403).json({
							message: 'error_fatal'
						});
						telkonlogger.logFatal(req, res, 'Not present in savednotices');

					} else {

						user.savednotices.splice(index, 1);
						user.save(function(err) {

							res.status(200).json({
								status: 'suc',
								message: 'unsaved'
							});
							telkonlogger.logSuc(req, res, 'Unsaved successfully');

						});
					}

				} else {

					res.status(403).json({
						message: 'error_fatal'
					});
					telkonlogger.logFatal(req, res, 'Not present in savednotices');
				}					
			}
		});
	}	
}


/* POST /member/complaints */
function postComplaints(req, res, next) {

	var flat = req.user.flat;
	var socid = req.socid;

	var query = {
		byflat: flat,
		socid: socid,
		isremovedbymember: false
	};
	var projection = {
		_id: 0,
		compid: 1,
		category: 1,
		subject: 1,
		currentstatus: 1,
		isescalationreq: 1,
		createdat: 1
	};
	var paginate = {
		sort: {_id:-1},
		limit: RECORD_LIMIT_COMPLAINTS
	};

	Complaint.find(query, projection, paginate, function(err, data) {

		if(err) {

			res.status(500).json({
				message: 'error_querycomplaint'
			});
			telkonlogger.logErr(req, res, err.message);

		} else {

			res.status(200).json({
				status: 'suc',
				data: data || []
			});
			telkonlogger.logSuc(req, res, 'Data sent successfully');
		}
	});
}


/* POST /member/complaints/chunk */
function postComplaintsChunk(req, res, next) {

	var flat = req.user.flat;
	var socid = req.socid;
	var recSkip = req.body.recSkip || 0;

	var query = {
		byflat: flat,
		socid: socid,
		isremovedbymember: false
	};
	var projection = {
		_id: 0,
		compid: 1,
		category: 1,
		subject: 1,
		currentstatus: 1,
		isescalationreq: 1,
		createdat: 1
	};
	var paginate = {
		sort: {_id:-1},
		skip: recSkip*RECORD_LIMIT_COMPLAINTS,
		limit: RECORD_LIMIT_COMPLAINTS
	};

	Complaint.find(query, projection, paginate, function(err, data) {

		if(err) {

			res.status(500).json({
				message: 'error_querycomplaint'
			});
			telkonlogger.logErr(req, res, err.message);

		} else {

			res.status(200).json({
				status: 'suc',
				data: data || []
			});
			telkonlogger.logSuc(req, res, 'Data sent successfully');
		}
	});
}


/* POST /member/complaint/types */
function postComplaintTypes(req, res, next) {

	var complaintTypes = staticData.complaintTypes;

	res.status(200).json({
		status: 'suc',
		data: complaintTypes || []
	});
	telkonlogger.logSuc(req, res, 'Data sent successfully');
}


/* POST /member/complaint */
function postComplaint(req, res, next) {

	var flat = req.user.flat;
	var socid = req.socid;
	var compid = req.body.compid;

	var params = [];
	params.push(compid);

	if(helper.validateParams(params) == false) {
		
		res.status(400).json({
			message: 'error_invalidparams'
		});
		telkonlogger.logErr(req, res, 'Invalid parameters');

	} else {

		var query = {
			byflat: flat,
			socid: socid,
			compid: compid
		};
		var projection = {
			_id: 0,
			compid: 1,
			category: 1,
			subject: 1,
			desc: 1,
			currentstatus: 1,
			isescalationreq: 1,
			timeline: 1,
			createdat: 1
		};

		Complaint.findOne(query, projection, function(err, data) {

			if(err) {

				res.status(500).json({
					message: 'error_querycomplaint'
				});
				telkonlogger.logErr(req, res, err.message);

			} else {

				res.status(200).json({
					status: 'suc',
					data: data || {}
				});
				telkonlogger.logSuc(req, res, 'Data sent successfully');
			}
		});
	}		
}


/* POST /member/complaint/timeline */
function postComplaintTimeline(req, res, next) {

	var flat = req.user.flat;
	var socid = req.socid;
	var compid = req.body.compid;

	var params = [];
	params.push(compid);

	if(helper.validateParams(params) == false) {
		
		res.status(400).json({
			message: 'error_invalidparams'
		});
		telkonlogger.logErr(req, res, 'Invalid parameters');

	} else {

		var query = {
			byflat: flat,
			socid: socid,
			compid: compid
		};
		var projection = {
			_id: 0,
			timeline: 1
		};

		Complaint.findOne(query, projection, function(err, data) {

			if(err) {

				res.status(500).json({
					message: 'error_querycomplaint'
				});
				telkonlogger.logErr(req, res, err.message);

			} else {

				var timeline = {};
				if(data) {
					timeline = data.timeline;
				}
				res.status(200).json({
					status: 'suc',
					data: timeline
				});
				telkonlogger.logSuc(req, res, 'Data sent successfully');
			}
		});
	}		
}


/* POST /member/complaint/escalate */
function postComplaintEscalate(req, res, next) {

	var uid = req.uid;
	var flat = req.user.flat;
	var socid = req.socid;
	var compid = req.body.compid;

	var params = [];
	params.push(compid);

	if(helper.validateParams(params) == false) {
		
		res.status(400).json({
			message: 'error_invalidparams'
		});
		telkonlogger.logErr(req, res, 'Invalid parameters');

	} else {

		var query = {
			byflat: flat,
			socid: socid,
			compid: compid
		};

		Complaint.findOne(query, function(err, complaint) {
					
			if(err) {

				res.status(500).json({
					message: 'error_querycomplaint'
				});
				telkonlogger.logErr(req, res, err.message);

			} else {
		
				if(!complaint) {

					res.status(403).json({
						message: 'error_fatal'
					});
					telkonlogger.logFatal(req, res, 'Not present in db');

				} else {

					if(complaint.isescalationreq || complaint.currentstatus === 'Resolved') {

						res.status(403).json({
							message: 'error_fatal'
						});
						telkonlogger.logFatal(req, res, 'Already escalated/resolved');

					} else {

						var d = new Date();
						var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

						var timelineObj = {};
						timelineObj.day = days[d.getDay()];
						timelineObj.complaintstatus = "Escalation Requested";
						timelineObj.comments = "The esacalation of the complaint is requested.";

						complaint.currentstatus = "Escalation Requested";
						complaint.timeline.push(timelineObj);
						complaint.isescalationreq = true;
						complaint.escalationreqby = uid;
						complaint.save(function(err) {

							if(err) {

								res.status(500).json({
									message: 'error_savecomplaint'
								});
								telkonlogger.logErr(req, res, err.message);

							} else {

								notifier.complaintStatusChanged(complaint);
								res.status(200).json({
									status: 'suc',
									message: 'escalated'
								});
								telkonlogger.logSuc(req, res, 'Updated successfully');

							}
						});
					}
				}					
			}
		});
	}	
}


/* POST /member/complaint/remove */
function postComplaintRemove(req, res, next) {

	var uid = req.uid;
	var flat = req.user.flat;
	var socid = req.socid;
	var compid = req.body.compid;

	var params = [];
	params.push(compid);

	if(helper.validateParams(params) == false) {
		
		res.status(400).json({
			message: 'error_invalidparams'
		});
		telkonlogger.logErr(req, res, 'Invalid parameters');

	} else {

		var query = {
			byflat: flat,
			socid: socid,
			compid: compid
		};

		Complaint.findOne(query, function(err, complaint) {
					
			if(err) {

				res.status(500).json({
					message: 'error_querycomplaint'
				});
				telkonlogger.logErr(req, res, err.message);

			} else {
		
				if(typeof complaint === 'undefined' ||
					complaint === null ||
					complaint === {}) {

					res.status(403).json({
						message: 'error_fatal'
					});
					telkonlogger.logFatal(req, res, 'Not present in db');

				} else {

					if(complaint.isremovedbymember) {

						res.status(403).json({
							message: 'error_fatal'
						});
						telkonlogger.logFatal(req, res, 'Already removed by member');

					} else {

						var d = new Date();
						var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

						timelineObj = {};
						timelineObj.day = days[d.getDay()];
						timelineObj.complaintstatus = "Removed by Member";
						timelineObj.comments = "This complaint has been removed by the member.";

						complaint.timeline.push(timelineObj);
						complaint.isremovedbymember = true;
						complaint.currentstatus = "Removed by Member";
						complaint.removedbymember = uid;
						if(complaint.isremovedbyadmin) {
						
							complaint.remove(function(err) {

								if(err) {

									res.status(500).json({
										message: 'error_savecomplaint'
									});
									telkonlogger.logErr(req, res, err.message);

								} else {

									notifier.complaintRemovedByMember(complaint);
									res.status(200).json({
										status: 'suc',
										message: 'removed'
									});
									telkonlogger.logSuc(req, res, 'Removed successfully');
								}
							});

						} else {

							complaint.save(function(err) {

								if(err) {

									res.status(500).json({
										message: 'error_savecomplaint'
									});
									telkonlogger.logErr(req, res, err.message);

								} else {

									notifier.complaintRemovedByMember(complaint);
									res.status(200).json({
										status: 'suc',
										message: 'removed'
									});
									telkonlogger.logSuc(req, res, 'Updated successfully');
								}
							});

						}
					}
				}					
			}
		});
	}	
}


/* POST /member/complaint/add */
function postComplaintAdd(req, res, next) {

	var uid = req.uid;
	var socid = req.socid;

	var user = req.user;
	var flat = user.flat;
	var name = user.name;
	var email = user.email;
	var phone = user.phone;

	var category = req.body.category;
	var subject = req.body.subject;
	var desc = req.body.desc;

	var params = [];
	params.push(category);
	params.push(subject);
	params.push(desc);

	if(helper.validateParams(params) == false) {
		
		res.status(400).json({
			message: 'error_invalidparams'
		});
		telkonlogger.logErr(req, res, 'Invalid parameters');

	} else {

		var d = new Date();
		var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
		
		var newComplaint = {};
		newComplaint.timeline = [];
		timelineObj = {};
		newComplaint._id = new mongoose.Types.ObjectId;
		newComplaint.socid = socid;
		newComplaint.uid = uid;
		newComplaint.category = category;
		newComplaint.subject = subject;
		newComplaint.currentstatus = "Registered";
		newComplaint.desc = desc;
		timelineObj.day = days[d.getDay()];
		timelineObj.complaintstatus = "Registered";
		timelineObj.comments = "The complaint has been registered with us. We are working on it.";
		newComplaint.timeline.push(timelineObj);
		newComplaint.byname = user.name;
		newComplaint.byflat = user.flat;
		newComplaint.byemail = user.email;
		newComplaint.byphone = user.phone;
		newComplaint.byimagedp = user.imagedp;
		newComplaint.byresidencetype = user.residencetype;

		helper.generateUniqueId(Complaint, function(compid) {

			if(!compid) {

				res.status(500).json({
					message: 'error_createcompid'
				});
				telkonlogger.logErr(req, res, 'Unable to create new COMPID');

			} else {

				newComplaint.compid = compid;

				new Complaint(newComplaint).save(function(err) {

					if(err) {

						res.status(500).json({
							message: 'error_savecomplaint'
						});
						telkonlogger.logErr(req, res, err.message);

					} else {

						notifier.complaintAdded(newComplaint);
						res.status(200).json({
							status: 'suc',
							message: 'added'
						});
						telkonlogger.logSuc(req, res, 'Added successfully');
					}
				});
			}
		});
	}
}


/* POST /member/complaint/comment */
function postComplaintComment(req, res, next) {

	var uid = req.uid;
	var flat = req.user.flat;
	var socid = req.socid;

	var compid = req.body.compid;
	var comments = req.body.comments;

	var params = [];
	params.push(compid);
	params.push(comments);

	if(helper.validateParams(params) == false) {
		
		res.status(400).json({
			message: 'error_invalidparams'
		});
		telkonlogger.logErr(req, res, 'Invalid parameters');

	} else {

		var query = {
			byflat: flat,
			socid: socid,
			compid: compid
		};

		Complaint.findOne(query, function(err, complaint) {
					
			if(err) {

				res.status(500).json({
					message: 'error_querycomplaint'
				});
				telkonlogger.logErr(req, res, err.message);

			} else {
		
				if(!complaint) {

					res.status(403).json({
						message: 'error_fatal'
					});
					telkonlogger.logFatal(req, res, 'Not present in db');

				} else {

					if(complaint.currentstatus === 'Resolved' ||
						complaint.isremovedbyadmin ||
						complaint.isremovedbymember) {

						res.status(403).json({
							message: 'error_fatal'
						});
					telkonlogger.logFatal(req, res, 'Already resolved/removed');

					} else {

						var d = new Date();
						var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
						var timelineObj = {};
						timelineObj.complaintstatus = 'Member Commented';
						timelineObj.day = days[d.getDay()];
						timelineObj.comments = comments;

						complaint.timeline.push(timelineObj);
						complaint.currentstatus = 'Member Commented';
						complaint.save(function(err) {

							if(err) {

								res.status(500).json({
									message: 'error_savecomplaint'
								});
								telkonlogger.logErr(req, res, err.message);

							} else {

								res.status(200).json({
									status: 'suc',
									message: 'commented'
								});
								telkonlogger.logSuc(req, res, 'Commented successfully');
							}
						});
					}
				}
			}
		});
	}
}


/* POST /member/classifieds */
function postClassifieds(req, res, next) {

	var uid = req.uid;
	var socid = req.socid;
	var search = req.body.search || '';
	var searchReg = new RegExp(search, 'g');

	var query = {
		$or: [
			{title: { $regex: searchReg, $options: "i" }},
			{category: { $regex: searchReg, $options: "i" }},
			{byemail: { $regex: searchReg, $options: "i" }},
			{byname: { $regex: searchReg, $options: "i" }},
			{bysocietyname: { $regex: searchReg, $options: "i" }},
			{bycity: { $regex: searchReg, $options: "i" }}
		],
		isactive: true
	};
	var projection = {
		_id: 0,
		cid: 1,
		title: 1,
		category: 1,
		byname: 1,
		byemail: 1,
		byphone: 1,
		bycity: 1,
		byimagedp: 1,
		bysocietyname: 1,
		createdat: 1
	};
	var paginate = {
		sort:
		{
			_id: -1
		},
		limit: RECORD_LIMIT_CLASSIFIEDS
	};

	Classified.find(query, projection, paginate, function(err, data) {

		if(err) {

			res.status(500).json({
				message: 'error_queryclassified'
			});
			telkonlogger.logErr(req, res, err.message);

		} else {

			query = {uid: uid};
			projection = {
				_id: 0,
				savedclassifieds: 1,
				classifiedsread: 1
			};

			User.findOne(query, projection, function(err, user) {

				if(err) {

					res.status(500).json({
						message: 'error_queryuser'
					});
					telkonlogger.logErr(req, res, err.message);

				} else {

					res.status(200).json({
						status: 'suc',
						data: {
							classifieds: data || [],
							classifiedsread: user.classifiedsread || [],
							savedclassifieds: user.savedclassifieds || []
						}
					});
					telkonlogger.logSuc(req, res, 'Data sent successfully');
				}
			});
		}
	});
}


/* POST /member/classifieds/chunk */
function postClassifiedsChunk(req, res, next) {

	var uid = req.uid;
	var socid = req.socid;
	var recSkip = req.body.recSkip || 0;
	var search = req.body.search || '';
	var searchReg = new RegExp(search, 'g');

	var query = {
		$or: [
			{title: { $regex: searchReg, $options: "i" }},
			{category: { $regex: searchReg, $options: "i" }},
			{byemail: { $regex: searchReg, $options: "i" }},
			{byname: { $regex: searchReg, $options: "i" }},
			{bysocietyname: { $regex: searchReg, $options: "i" }},
			{bycity: { $regex: searchReg, $options: "i" }}
		],
		isactive: true
	};
	var projection = {
		_id: 0,
		cid: 1,
		title: 1,
		category: 1,
		byname: 1,
		byemail: 1,
		byphone: 1,
		bycity: 1,
		byimagedp: 1,
		bysocietyname: 1,
		createdat: 1
	};
	var paginate = {
		sort:
		{
			_id: -1
		},
		skip: recSkip*RECORD_LIMIT_CLASSIFIEDS,
		limit: RECORD_LIMIT_CLASSIFIEDS
	};

	Classified.find(query, projection, paginate, function(err, data) {

		if(err) {

			res.status(500).json({
				message: 'error_queryclassified'
			});
			telkonlogger.logErr(req, res, err.message);

		} else {

			res.status(200).json({
				status: 'suc',
				data: data
			});
			telkonlogger.logSuc(req, res, 'Data sent successfully');
		}
	});
}


/* POST /member/classified/types */
function postClassifiedTypes(req, res, next) {

	var classifiedTypes = staticData.classifiedTypes;

	res.status(200).json({
		status: 'suc',
		data: classifiedTypes || []
	});
	telkonlogger.logSuc(req, res, 'Data sent successfully');
}


/* POST /member/classified */
function postClassified(req, res, next) {

	var uid = req.uid;
	var socid = req.socid;
	var cid = req.body.cid;

	var params = [];
	params.push(cid);

	if(helper.validateParams(params) == false) {
		
		res.status(400).json({
			message: 'error_invalidparams'
		});
		telkonlogger.logErr(req, res, 'Invalid parameters');

	} else {

		var query = {cid: cid};
		var projection = {
			_id: 0,
			cid: 1,
			title: 1,
			category: 1,
			details: 1,
			createdat: 1,
			byname: 1,
			byemail: 1,
			byphone: 1,
			bycity: 1,
			byimagedp: 1,
			bysocietyname: 1
		};

		Classified.findOne(query, projection, function(err, data) {

			if(err) {

				res.status(500).json({
					message: 'error_queryclassified'
				});
				telkonlogger.logErr(req, res, err.message);

			} else {

				res.status(200).json({
					status: 'suc',
					data: data || {}
				});
				telkonlogger.logSuc(req, res, 'Data sent successfully');
			}
		});
	}	
}


/* POST /member/classified/read */
function postClassifiedRead(req, res, next) {

	var uid = req.uid;
	var socid = req.socid;
	var cid = req.body.cid;

	var params = [];
	params.push(cid);

	if(helper.validateParams(params) == false) {
		
		res.status(400).json({
			message: 'error_invalidparams'
		});
		telkonlogger.logErr(req, res, 'Invalid parameters');

	} else {

		var query = {uid: uid};

		User.findOne(query, function(err, user) {
					
			if(err) {

				res.status(500).json({
					message: 'error_queryclassified'
				});
				telkonlogger.logErr(req, res, err.message);

			} else {
		
				if(user.classifiedsread) {
					if(user.classifiedsread.indexOf(cid) != -1) {

						res.status(403).json({
							message: 'error_fatal'
						});
						telkonlogger.logFatal(req, res, 'Already present in classifiedsread');

					} else {

						user.classifiedsread.push(cid);
						user.save(function(err) {

							res.status(200).json({
								status: 'suc',
								message: 'marked'
							});
							telkonlogger.logSuc(req, res, 'Marked successfully');

						});
					}
				} else {
					user.classifiedsread = [];
					user.classifiedsread.push(cid);
					user.save(function(err) {

						res.status(200).json({
							status: 'suc',
							message: 'marked'
						});
						telkonlogger.logSuc(req, res, 'Marked successfully');
					});
				}
			}
		});
	}	
}


/* POST /member/classified/save */
function postClassifiedSave(req, res, next) {

	var uid = req.uid;
	var socid = req.socid;
	var cid = req.body.cid;

	var params = [];
	params.push(cid);

	if(helper.validateParams(params) == false) {
		
		res.status(400).json({
			message: 'error_invalidparams'
		});
		telkonlogger.logErr(req, res, 'Invalid parameters');

	} else {

		var query = {uid: uid};

		User.findOne(query, function(err, user) {
					
			if(err) {

				res.status(500).json({
					message: 'error_queryuser'
				});
				telkonlogger.logErr(req, res, err.message);

			} else {
		
				if(user.savedclassifieds) {
					if(user.savedclassifieds.indexOf(cid) != -1) {

						res.status(403).json({
							message: 'error_fatal'
						});
						telkonlogger.logFatal(req, res, 'Already present in savedclassifieds');

					} else {

						user.savedclassifieds.push(cid);
						user.save(function(err) {

							if(err) {

								res.status(500).json({
									message: 'error_saveuser'
								});
								telkonlogger.logErr(req, res, err.message);

							} else {
								res.status(200).json({
									status: 'suc',
									message: 'saved'
								});
								telkonlogger.logSuc(req, res, 'Saved successfully');
							}
						});
					}
				} else {

					user.savedclassifieds = [];
					user.savedclassifieds.push(cid);
					user.save(function(err) {

						if(err) {

							res.status(500).json({
								message: 'error_saveuser'
							});
							telkonlogger.logErr(req, res, err.message);

						} else {
							res.status(200).json({
								status: 'suc',
								message: 'saved'
							});
							telkonlogger.logSuc(req, res, 'Saved successfully');
						}
					});
				}
			}
		});
	}	
}


/* POST /member/classified/unsave */
function postClassifiedUnsave(req, res, next) {

	var uid = req.uid;
	var socid = req.socid;
	var cid = req.body.cid;

	var params = [];
	params.push(cid);

	if(helper.validateParams(params) == false) {
		
		res.status(400).json({
			message: 'error_invalidparams'
		});
		telkonlogger.logErr(req, res, 'Invalid parameters');

	} else {

		var query = {uid: uid};

		User.findOne(query, function(err, user) {
					
			if(err) {

				res.status(500).json({
					message: 'error_queryuser'
				});
				telkonlogger.logErr(req, res, err.message);

			} else {
		
				if(user.savedclassifieds) {
					var index = user.savedclassifieds.indexOf(cid);
					if(index == -1) {

						res.status(403).json({
							message: 'error_fatal'
						});
						telkonlogger.logFatal(req, res, 'Not present in savedclassifieds');

					} else {

						user.savedclassifieds.splice(index, 1);
						user.save(function(err) {

							if(err) {

								res.status(500).json({
									message: 'error_saveuser'
								});
								telkonlogger.logErr(req, res, err.message);

							} else {
								res.status(200).json({
									status: 'suc',
									message: 'unsaved'
								});
								telkonlogger.logSuc(req, res, 'Unsaved successfully');
							}
						});
					}
				} else {
					res.status(403).json({
						message: 'error_fatal'
					});
					telkonlogger.logFatal(req, res, 'Not present in savedclassifieds');
				}
			}
		});
	}	
}


/* POST /member/classified/add */
function postClassifiedAdd(req, res, next) {

	var uid = req.uid;
	var socid = req.socid;
	var user = req.user;

	var category = req.body.category;
	var title = req.body.title;
	var details = req.body.details;

	var params = [];
	params.push(category);
	params.push(title);
	params.push(details);

	if(helper.validateParams(params) == false) {
		
		res.status(400).json({
			message: 'error_invalidparams'
		});
		telkonlogger.logErr(req, res, 'Invalid parameters');

	} else {
		
		var newClassified = {};
		newClassified._id = new mongoose.Types.ObjectId;
		newClassified.socid = socid;
		newClassified.uid = uid;
		newClassified.category = category;
		newClassified.title = title;
		newClassified.details = details;
		newClassified.byname = user.name;
		newClassified.byflat = user.flat;
		newClassified.byemail = user.email;
		newClassified.byphone = user.phone;
		newClassified.bysocietyname = user.societyname;
		newClassified.bycity = user.city;
		newClassified.byimagedp = user.imagedp;

		helper.generateUniqueId(Classified, function(cid) {

			if(!cid) {

				res.status(500).json({
					message: 'error_createcid'
				});
				telkonlogger.logErr(req, res, 'Unable to create new CID');

			} else {

				newClassified.cid = cid;

				new Classified(newClassified).save(function(err) {

					if(err) {

						res.status(500).json({
							message: 'error_saveclassified'
						});
						telkonlogger.logErr(req, res, err.message);

					} else {

						notifier.classifiedAdded(newClassified);
						res.status(200).json({
							status: 'suc',
							message: 'added'
						});
						telkonlogger.logSuc(req, res, 'Added successfully');
					}
				});
			}
		});
	}
}


/* POST /member/contacts */
function postContacts(req, res, next) {

	var socid = req.socid;

	var query = {
		socid: socid,
		isactive: true
	};
	var projection = {};

	Contact.find(query, projection, function(err, data) {

		if(err) {

			res.status(500).json({
				message: 'error_querycontact'
			});
			telkonlogger.logErr(req, res, err.message);

		} else {

			res.status(200).json({
				status: 'suc',
				data: data || []
			});
			telkonlogger.logSuc(req, res, 'Data sent successfully');
		}

	});
}


/* POST /member/contacts/category */
function postContactsByCateogory(req, res, next) {

	var socid = req.socid;
	var category = req.body.category;

	var params = [];
	params.push(category);

	if(helper.validateParams(params) == false) {
		
		res.status(400).json({
			message: 'error_invalidparams'
		});
		telkonlogger.logErr(req, res, 'Invalid parameters');

	} else {

		var query = {};
		var projection = {};
		var paginate = {}

		if(category == 1 || category == 2) {

			query = {socid: socid};
			projection = {
				pincode: 1
			};

			Society.findOne(query, projection, function(err, society) {

				if(err) {

					res.status(500).json({
						message: 'error_querysociety'
					});
					telkonlogger.logErr(req, res, err.message);

				} else {

					var pincode = society.pincode;
					var categories = [
						
					];

					query = {
						category: category,
						pincode: pincode,
						isactive: true
					};
					projection = {
						name: 1,
						email: 1,
						phone: 1,
						servicetype: 1,
						location: 1,
						position: 1,
						flat: 1
					};
					paginate = {
						sort: {_id: -1}
					}

					Contact.find(query, projection, paginate, function(err, data) {

						if(err) {

							res.status(500).json({
								message: 'error_querycontact'
							});
							telkonlogger.logErr(req, res, err.message);

						} else {

							res.status(200).json({
								status: 'suc',
								data: data || []
							});
							telkonlogger.logSuc(req, res, 'Data sent successfully');
						}

					});
				}
			});

		} else {

			query = {
				socid: socid,
				category: category,
				isactive: true
			};
			projection = {
				name: 1,
				email: 1,
				phone: 1,
				servicetype: 1,
				location: 1,
				position: 1,
				flat: 1
			};
			paginate = {
				sort: {name: 1, location: 1}
			}

			Contact.find(query, projection, paginate, function(err, data) {

				if(err) {

					res.status(500).json({
						message: 'error_querycontact'
					});
					telkonlogger.logErr(req, res, err.message);

				} else {

					res.status(200).json({
						status: 'suc',
						data: data || []
					});
					telkonlogger.logSuc(req, res, 'Data sent successfully');
				}
			});
		}			
	}
}


/* POST /member/forums */
function postForums(req, res, next) {

	var uid = req.uid;
	var socid = req.socid;
	var search = req.body.search || '';
	var searchReg = new RegExp(search, 'g');

	var query = {
		$or: [
			{title: { $regex: searchReg, $options: "i" }},
			{byemail: { $regex: searchReg, $options: "i" }},
			{byname: { $regex: searchReg, $options: "i" }},
			{bysocietyname: { $regex: searchReg, $options: "i" }},
			{bycity: { $regex: searchReg, $options: "i" }}
		],
		isactive: true
	};
	var projection = {
		_id: 0,
		fid: 1,
		uid: 1,
		socid: 1,
		title: 1,
		details: 1,
		byname: 1,
		bysocietyname: 1,
		bycity: 1,
		byimagedp: 1,
		lastact: 1,
		forumtype: 1,
		emo: 1,
		totalcomments: 1,
		totalviews: 1,
		createdat: 1
	};
	var paginate = {
		sort:
		{
			lastact: -1
		},
		limit: RECORD_LIMIT_FORUMS
	};

	Forum.find(query, projection, paginate, function(err, data) {

		if(err) {

			res.status(500).json({
				message: 'error_queryforum'
			});
			telkonlogger.logErr(req, res, err.message);

		} else {

			var forums = [];
			if(data && data.length > 0) {
				for(var i=0; i<data.length; i++) {
					if(data[i].forumtype == 0) {
						if(data[i].socid === socid) {
							forums.push(data[i]);
						}
					} else {
						forums.push(data[i]);
					}
				}
			}

			query = {uid: uid};
			projection = {
				_id: 0,
				favoriteforums: 1,
				forumsread: 1,
				forumsfeeling: 1,
				forumsfeelingemo: 1
			};

			User.findOne(query, projection, function(err, user) {

				if(err) {

					res.status(500).json({
						message: 'error_queryuser'
					});
					telkonlogger.logErr(req, res, err.message);

				} else {

					res.status(200).json({
						status: 'suc',
						data: {
							forums: forums || [],
							forumsread: user.forumsread || [],
							favoriteforums: user.favoriteforums || [],
							forumsfeeling: user.forumsfeeling || [],
							forumsfeelingemo: user.forumsfeelingemo || []
						}
					});
					telkonlogger.logSuc(req, res, 'Data sent successfully');
				}
			});
		}

	});
}


/* POST /member/forums/chunk */
function postForumsChunk(req, res, next) {

	var uid = req.uid;
	var socid = req.socid;
	var recSkip = req.body.recSkip || 0;
	var search = req.body.search || '';
	var searchReg = new RegExp(search, 'g');

	var query = {
		$or: [
			{title: { $regex: searchReg, $options: "i" }},
			{byemail: { $regex: searchReg, $options: "i" }},
			{byname: { $regex: searchReg, $options: "i" }},
			{bysocietyname: { $regex: searchReg, $options: "i" }},
			{bycity: { $regex: searchReg, $options: "i" }}
		],
		isactive: true
	};
	var projection = {
		_id: 0,
		fid: 1,
		uid: 1,
		socid: 1,
		title: 1,
		details: 1,
		byname: 1,
		bysocietyname: 1,
		bycity: 1,
		byimagedp: 1,
		lastact: 1,
		emo: 1,
		forumtype: 1,
		totalcomments: 1,
		totalviews: 1,
		createdat: 1
	};
	var paginate = {
		sort:
		{
			lastact: -1
		},
		skip: recSkip*RECORD_LIMIT_FORUMS,
		limit: RECORD_LIMIT_FORUMS
	};

	Forum.find(query, projection, paginate, function(err, data) {

		if(err) {

			res.status(500).json({
				message: 'error_queryforum'
			});
			telkonlogger.logErr(req, res, err.message);

		} else {

			var forums = [];
			if(data && data.length > 0) {
				for(var i=0; i<data.length; i++) {
					if(data[i].forumtype == 0) {
						if(data[i].socid === socid) {
							forums.push(data[i]);
						}
					} else {
						forums.push(data[i]);
					}
				}
			}
				
			res.status(200).json({
				status: 'suc',
				data: forums || []
			});
			telkonlogger.logSuc(req, res, 'Data sent successfully');
		}

	});
}


/* POST /member/forum */
function postForum(req, res, next) {

	var uid = req.uid;
	var socid = req.socid;
	var fid = req.body.fid;
	var count = req.body.count;

	var params = [];
	params.push(fid);

	if(helper.validateParams(params) == false) {
		
		res.status(400).json({
			message: 'error_invalidparams'
		});
		telkonlogger.logErr(req, res, 'Invalid parameters');

	} else {

		var query = {fid: fid};
		var projection = {
			_id: 0,
			fid: 1,
			uid: 1,
			socid: 1,
			title: 1,
			details: 1,
			byname: 1,
			bysocietyname: 1,
			totalviews: 1,
			totalcomments: 1,
			emo: 1,
			forumtype: 1,
			bycity: 1,
			byimagedp: 1,
			createdat: 1
		};

		Forum.findOne(query, projection, function(err, data) {

			if(err) {

				res.status(500).json({
					message: 'error_queryforum'
				});
				telkonlogger.logErr(req, res, err.message);

			} else {

				if(data) {

					if(!data.totalviews) {
						data.totalviews = 0;
					}

					if(count) {
						data.totalviews += 1;
						notifier.forumCounter(fid, socid, data.forumtype);
					}

					var hasEmoted = false;
					var forumsfeeling = req.user.forumsfeeling;
					var forumsfeelingemo = req.user.forumsfeelingemo;
					var userinfo = {};

					var index = forumsfeeling.indexOf(fid);
					if(index != -1) {
						userinfo.hasEmoted = true
						userinfo.emo = forumsfeelingemo[index];
					}

					res.status(200).json({
						status: 'suc',
						data: {
							forum: data || {},
							userinfo: userinfo || {}
						}
					});
					telkonlogger.logSuc(req, res, 'Data sent successfully');

					Forum.findOne(query, function(err, data) {

						if(!err) {

							if(!data.totalviews) {
								data.totalviews = 0;
							}

							if(count) {
								data.totalviews += 1;
							}
							data.save();
						}
					});

				} else {

					res.status(200).json({
						status: 'suc',
						data: {
							forum: {},
							userinfo: {}
						}
					});
					telkonlogger.logSuc(req, res, 'Data sent successfully');

				}
			}
		});
	}	
}


/* POST /member/forum/comments/chunk */
function postForumCommentsChunk(req, res, next) {

	var uid = req.uid;
	var socid = req.socid;
	var fid = req.body.fid;
	var recSkip = req.body.recSkip || 0;

	var params = [];
	params.push(fid);

	if(helper.validateParams(params) == false) {
		
		res.status(400).json({
			message: 'error_invalidparams'
		});
		telkonlogger.logErr(req, res, 'Invalid parameters');

	} else {

		var query = {fid: fid};
		var projection = {
			_id: 0,
			fid: 1,
			comments: 1
		};

		Forum.aggregate(
			{$match: query},
			{$project: projection},
			{$unwind: '$comments'},
			{$sort: {"comments.date": -1}},
			{$skip: parseInt(recSkip) * RECORD_LIMIT_FORUM_COMMENTS},
			{$limit: RECORD_LIMIT_FORUM_COMMENTS},
		function(err, comments) {

			if(err) {

				res.status(500).json({
					message: 'error_queryforum'
				});
				telkonlogger.logErr(req, res, err.message);

			} else {

				res.status(200).json({
					status: 'suc',
					data: comments || []
				});
				telkonlogger.logSuc(req, res, 'Data sent successfully');
			}
		});
	}
}


/* POST /member/forum/read */
function postForumRead(req, res, next) {

	var uid = req.uid;
	var socid = req.socid;
	var fid = req.body.fid;

	var params = [];
	params.push(fid);

	if(helper.validateParams(params) == false) {
		
		res.status(400).json({
			message: 'error_invalidparams'
		});
		telkonlogger.logErr(req, res, 'Invalid parameters');

	} else {

		var query = {uid: uid};

		User.findOne(query, function(err, user) {
					
			if(err) {

				res.status(500).json({
					message: 'error_queryuser'
				});
				telkonlogger.logErr(req, res, err.message);

			} else {
		
				if(user.forumsread) {

					if(user.forumsread.indexOf(fid) != -1) {

						res.status(403).json({
							message: 'error_fatal'
						});
						telkonlogger.logFatal(req, res, 'Already present in forumsread');

					} else {

						user.forumsread.push(fid);
						user.save(function(err) {

							res.status(200).json({
								status: 'suc',
								message: 'marked'
							});
							telkonlogger.logSuc(req, res, 'Marked successfully');

						});
					}
				} else {

					user.forumsread = [];

					user.forumsread.push(fid);
					user.save(function(err) {

						res.status(200).json({
							status: 'suc',
							message: 'marked'
						});
						telkonlogger.logSuc(req, res, 'Marked successfully');

					});
				}
					
				
			}
		});
	}	
}


/* POST /member/forum/favorite */
function postForumFavorite(req, res, next) {

	var uid = req.uid;
	var socid = req.socid;
	var fid = req.body.fid;

	var params = [];
	params.push(fid);

	if(helper.validateParams(params) == false) {
		
		res.status(400).json({
			message: 'error_invalidparams'
		});
		telkonlogger.logErr(req, res, 'Invalid parameters');

	} else {

		var query = {uid: uid};

		User.findOne(query, function(err, user) {
					
			if(err) {

				res.status(500).json({
					message: 'error_queryuser'
				});
				telkonlogger.logErr(req, res, err.message);

			} else {
		
				if(user.favoriteforums) {
					if(user.favoriteforums.indexOf(fid) != -1) {

						res.status(403).json({
							message: 'fatal'
						});
						telkonlogger.logFatal(req, res, 'Already present in favoriteforums');

					} else {

						user.favoriteforums.push(fid);
						user.save(function(err) {

							if(err) {

								res.status(500).json({
									message: 'error_saveuser'
								});
								telkonlogger.logErr(req, res, err.message);

							} else {

								res.status(200).json({
									status: 'suc',
									message: 'marked'
								});
								telkonlogger.logSuc(req, res, 'Marked successfully');
							}
						});
					}

				} else {

					user.favoriteforums = [];

					user.favoriteforums.push(fid);
					user.save(function(err) {

						if(err) {
							
							res.status(500).json({
								message: 'error_saveuser'
							});
							telkonlogger.logErr(req, res, err.message);

						} else {

							res.status(200).json({
								status: 'suc',
								message: 'marked'
							});
							telkonlogger.logSuc(req, res, 'Marked successfully');
						}
					});
				}
			}
		});
	}	
}


/* POST /member/forum/unfavorite */
function postForumUnfavorite(req, res, next) {

	var uid = req.uid;
	var socid = req.socid;
	var fid = req.body.fid;

	var params = [];
	params.push(fid);

	if(helper.validateParams(params) == false) {
		
		res.status(400).json({
			message: 'error_invalidparams'
		});
		telkonlogger.logErr(req, res, 'Invalid parameters');

	} else {

		var query = {uid: uid};

		User.findOne(query, function(err, user) {
					
			if(err) {

				res.status(500).json({
					message: 'error_queryuser'
				});
				telkonlogger.logErr(req, res, err.message);

			} else {
		
				if(user.favoriteforums) {
					var index = user.favoriteforums.indexOf(fid);
					if(index == -1) {

						res.status(403).json({
							message: 'error_fatal'
						});
						telkonlogger.logFatal(req, res, 'Not present in favoriteforums');

					} else {

						user.favoriteforums.splice(index, 1);
						user.save(function(err) {

							if(err) {

								res.status(500).json({
									message: 'error_saveuser'
								});
								telkonlogger.logErr(req, res, err.message);

							} else {

								res.status(200).json({
									status: 'suc',
									message: 'unmarked'
								});
								telkonlogger.logSuc(req, res, 'Unmarked successfully');
							}
						});
					}

				} else {

					res.status(403).json({
						message: 'error_fatal'
					});
					telkonlogger.logFatal(req, res, 'Not present in favoriteforums');
				}
			}
		});
	}	
}


/* POST /member/forum/add */
function postForumAdd(req, res, next) {

	var uid = req.uid;
	var socid = req.socid;

	var title = req.body.title;
	var details = req.body.details;
	var forumtype = req.body.forumtype;

	var params = [];
	params.push(title);
	params.push(details);
	params.push(forumtype);

	if(helper.validateParams(params) == false) {
		
		res.status(400).json({
			message: 'error_invalidparams'
		});
		telkonlogger.logErr(req, res, 'Invalid parameters');

	} else {
		
		var newForum = {};
		newForum._id = new mongoose.Types.ObjectId;
		newForum.socid = socid;
		newForum.uid = uid;
		newForum.title = title;
		newForum.details = details;
		newForum.forumtype = forumtype;

		var user = req.user;
		newForum.byname = user.name;
		newForum.byflat = user.flat;
		newForum.byemail = user.email;
		newForum.byphone = user.phone;
		newForum.bysocietyname = user.societyname;
		newForum.bycity = user.city;
		newForum.byimagedp = user.imagedp;
		newForum.emo = {};
		newForum.emo.angry = 0;
		newForum.emo.evil = 0;
		newForum.emo.love = 0;
		newForum.emo.confused = 0;
		newForum.emo.laugh = 0;
		newForum.emo.tongue = 0;

		helper.generateUniqueId(Forum, function(fid) {

			if(!fid) {

				res.status(500).json({
					message: 'error_createfid'
				});
				telkonlogger.logErr(req, res, 'Unable to create new FID');

			} else {

				newForum.fid = fid;
				new Forum(newForum).save(function(err) {

					if(err) {

						res.status(500).json({
							message: 'error_saveforum'
						});
						telkonlogger.logErr(req, res, err.message);

					} else {

						notifier.forumAdded(newForum);
						res.status(200).json({
							status: 'suc',
							message: 'added'
						});
						telkonlogger.logSuc(req, res, 'Added successfully');
					}
				});
			}
		});
	}
}


/* POST /member/forum/comment */
function postForumCommentAdd(req, res, next) {

	var uid = req.uid;
	var socid = req.socid;
	var fid = req.body.fid;
	var value = req.body.value;
	var opinion = req.body.opinion;

	var params = [];
	params.push(fid);
	params.push(value);
	params.push(opinion);

	if(helper.validateParams(params) == false) {
		
		res.status(400).json({
			message: 'error_invalidparams'
		});
		telkonlogger.logErr(req, res, 'Invalid parameters');

	} else {

		var query = {fid: fid};

		Forum.findOne(query, function(err, data) {
					
			if(err) {

				res.status(500).json({
					message: 'error_queryforum'
				});
				telkonlogger.logErr(req, res, err.message);

			} else {
		
				if(typeof data === 'undefined' ||
					data === null ||
					data === {}) {

					res.status(403).json({
						message: 'error_fatal'
					});
					telkonlogger.logFatal(req, res, 'Not present in db');

				} else {

					if(!data.comments) {
						data.comments = [];
					}

					var newComment = {};
					var user = req.user;
					newComment.value = value;
					newComment.opinion = opinion;
					newComment.uid = uid;
					newComment.societyid = socid;
					newComment.byname = user.name;
					newComment.bysocietyname = user.societyname;
					newComment.bycity = user.city;
					newComment.byimagedp = user.imagedp;
					data.comments.push(newComment);
					data.lastact = moment();
					data.totalcomments += 1;

					data.save(function(err) {

						if(err) {

							res.status(500).json({
								message: 'error_saveforum'
							});
							telkonlogger.logErr(req, res, err.message);

						} else {

							notifier.forumCommentAdded(data, newComment);
							res.status(200).json({
								status: 'suc',
								message: 'commented'
							});
							telkonlogger.logSuc(req, res, 'Commented successfully');
						}
					});
				}
			}
		});
	}	
}


/* POST /member/forum/emo */
function postForumEmo(req, res, next) {

	var uid = req.uid;
	var socid = req.socid;
	var fid = req.body.fid;
	var emotype = req.body.emotype;

	var params = [];
	params.push(fid);
	params.push(emotype);

	if(helper.validateParams(params) == false) {
		
		res.status(400).json({
			message: 'error_invalidparams'
		});
		telkonlogger.logErr(req, res, 'Invalid parameters');

	} else {

		var query = {
			fid: fid,
			isactive: true
		};

		Forum.findOne(query, function(err, forum) {

			if(err) {

				res.status(500).json({
					message: 'error_queryforum'
				});
				telkonlogger.logErr(req, res, err.message);

			} else {

				query = {uid: uid, socid: socid};
				User.findOne(query, function(err, user) {
					
					if(err) {

						res.status(500).json({
							message: 'error_queryuser'
						});
						telkonlogger.logErr(req, res, err.message);

					} else {
				
						var data = {};
						if(!user.forumsfeeling) {
							user.forumsfeeling = [];
							user. forumsfeelingemo = [];
						}
						if(user.forumsfeeling.indexOf(fid) != -1) {

							res.status(403).json({
								message: 'error_fatal'
							});
							telkonlogger.logFatal(req, res, 'Already present in forumsfeeling');

						} else {

							user.forumsfeeling.push(fid);
							user. forumsfeelingemo.push(emotype);
							user.save(function(err) {

								if(err) {

									res.status(500).json({
										message: 'error_saveuser'
									});
									telkonlogger.logErr(req, res, err.message);

								} else {

									if(emotype == 1) forum.emo.laugh++;
									else if(emotype == 2) forum.emo.tongue++;
									else if(emotype == 3) forum.emo.love++;
									else if(emotype == 4) forum.emo.confused++;
									else if(emotype == 5) forum.emo.angry++;
									else if(emotype == 6) forum.emo.evil++;
									else {

										res.status(400).json({
											message: 'error_invalidemo'
										});
										telkonlogger.logErr(req, res, err.message);
										return;
									}

									forum.save(function(err) {

										if(err) {

											res.status(500).json({
												message: 'error_saveforum'
											});
											telkonlogger.logErr(req, res, err.message);

										} else {

											notifier.forumEmoticonUpdate(forum, emotype);
											res.status(200).json({
												status: 'suc',
												message: 'emoted'
											});
											telkonlogger.logSuc(req, res, 'Emoted successfully');
										}
									});
								}
							});
						}
					}
				});
			}			
		});
	}	
}


/* POST /member/clubs */
function postClubs(req, res, next) {

	var uid = req.uid;
	var socid = req.socid;
	var clubtype = req.body.clubtype;
	var recSkip = req.body.recSkip || 0;
	var search = req.body.search || '';
	var searchReg = new RegExp(search, 'g');

	var params = [];
	params.push(clubtype);

	if(helper.validateParams(params) == false) {
		
		res.status(400).json({
			message: 'error_invalidparams'
		});
		telkonlogger.logErr(req, res, 'Invalid parameters');

	} else {

		var query = {
			clubtype: clubtype,
			$or: [
				{name: { $regex: searchReg, $options: "i" }},
				{category: { $regex: searchReg, $options: "i" }},
				{bysocietyname: { $regex: searchReg, $options: "i" }},
				{bycity: { $regex: searchReg, $options: "i" }}
			],
			isactive: true
		};

		if (clubtype == 0) {
			query.socid = socid;
		}

		var projection = {
			_id: 0,
			clubid: 1,
			socid: 1,
			name: 1,
			details: 1,
			imagedp: 1,
			membercount: 1,
			byname: 1,
			bysocietyname: 1,
			bylocality: 1,
			bycity: 1,
			byimagedp: 1,
			createdat: 1
		};

		var paginate = {
			sort:
			{
				_id: -1
			},
			limit: RECORD_LIMIT_CLUBS
		};

		Club.find(query, projection, paginate, function(err, data) {

			if(err) {

				res.status(500).json({
					message: 'error_queryclub'
				});
				telkonlogger.logErr(req, res, err.message);

			} else {

				query = {uid: uid};
				projection = {
					_id: 0,
					subscribedclubs: 1,
					clubsadmin: 1
				};

				User.findOne(query, projection, function(err, user) {

					if(err) {

						res.status(500).json({
							message: 'error_queryclub'
						});
						telkonlogger.logErr(req, res, err.message);

					} else {

						res.status(200).json({
							status: 'suc',
							data: {
								clubs: data || [],
								subscribedclubs: user.subscribedclubs || [],
								clubsadmin: user.clubsadmin || []
							}
						});
						telkonlogger.logSuc(req, res, 'Data sent successfully');
					}
				});
			}
		});
	}
}


/* POST /member/clubs/chunk */
function postClubsChunk(req, res, next) {

	var uid = req.uid;
	var socid = req.socid;
	var clubtype = req.body.clubtype;
	var recSkip = req.body.recSkip || 0;
	var search = req.body.search || '';
	var searchReg = new RegExp(search, 'g');

	var params = [];
	params.push(clubtype);

	if(helper.validateParams(params) == false) {
		
		res.status(400).json({
			message: 'error_invalidparams'
		});
		telkonlogger.logErr(req, res, 'Invalid parameters');

	} else {

		var query = {
			clubtype: clubtype,
			$or: [
				{name: { $regex: searchReg, $options: "i" }},
				{category: { $regex: searchReg, $options: "i" }},
				{bysocietyname: { $regex: searchReg, $options: "i" }},
				{bycity: { $regex: searchReg, $options: "i" }},
			],
			isactive: true
		};

		if (clubtype == 0) {
			query.socid = socid;
		}

		var projection = {
			_id: 0,
			clubid: 1,
			socid: 1,
			name: 1,
			details: 1,
			imagedp: 1,
			membercount: 1,
			byname: 1,
			bysocietyname: 1,
			bylocality: 1,
			bycity: 1,
			byimagedp: 1,
			createdat: 1
		};

		var paginate = {
			sort:
			{
				_id: -1
			},
			skip: recSkip*RECORD_LIMIT_CLUBS,
			limit: RECORD_LIMIT_CLUBS
		};

		Club.find(query, projection, paginate, function(err, data) {

			if(err) {

				res.status(500).json({
					message: 'error_queryclub'
				});
				telkonlogger.logErr(req, res, err.message);

			} else {

				res.status(200).json({
					status: 'suc',
					data: data || []
				});
				telkonlogger.logSuc(req, res, 'Data sent successfully');
			}
		});
	}
}


/* POST /member/club */
function postClub(req, res, next) {

	var uid = req.uid;
	var socid = req.socid;
	var user = req.user;

	var clubid = req.body.clubid;
	var query = {};
	var projection = {};
	var paginate = {};

	var params = [];
	params.push(clubid);

	if(helper.validateParams(params) == false) {
		
		res.status(400).json({
			message: 'error_invalidparams'
		});
		telkonlogger.logErr(req, res, 'Invalid parameters');

	} else {

		query = {clubid: clubid};
		projection = {
			_id: 0,
			clubid: 1,
			socid: 1,
			name: 1,
			category: 1,
			clubtype: 1,
			details: 1,
			imagedp: 1,
			membercount: 1,
			members: 1,
			byname: 1,
			bysocietyname: 1,
			bylocality: 1,
			bycity: 1,
			byimagedp: 1,
			createdat: 1
		}

		Club.findOne(query, projection, function(err, data) {

			if(err) {

				res.status(500).json({
					message: 'error_queryclub'
				});
				telkonlogger.logErr(req, res, err.message);

			} else {

				var info = {};
				if(data) {

					if(user.subscribedclubs && user.subscribedclubs.indexOf(clubid) != -1) {
						info.issubscribed = true;
					} else {
						info.issubscribed = false;
					}
					if(user.clubscreated && user.clubscreated.indexOf(clubid) != -1) {
						info.iscreated = true;
					} else {
						info.iscreated = false;
					}
					if(user.clubsadmin && user.clubsadmin.indexOf(clubid) != -1) {
						info.isadmin = true;
					} else {
						info.isadmin = false;
					}

					res.status(200).json({
						status: 'suc',
						data: {
							club: data || {},
							info: info || {}
						}
					});
					telkonlogger.logSuc(req, res, 'Data sent successfully');

				} else {

					res.status(200).json({
						status: 'suc',
						data: {
							club: {},
							info: {}
						}
					});
					telkonlogger.logSuc(req, res, 'Data sent successfully');
				}
			}
		});
	}	
}


// to be verified
/* POST /member/club/members/chunk */
function postClubMembersChunk(req, res, next) {

	var uid = req.uid;
	var socid = req.socid;
	var clubid = req.body.clubid;
	var recSkip = req.body.recSkip || 0;
	var search = req.body.search || '';
	var searchReg = new RegExp(search, 'g');
	var query = {};
	var projection = {};
	var paginate = {};

	var params = [];
	params.push(clubid);

	if(helper.validateParams(params) == false) {
		
		res.status(400).json({
			message: 'error_invalidparams'
		});
		telkonlogger.logErr(req, res, 'Invalid parameters');

	} else {

		var user = req.user;

		/* Give away all the members for now, but later, use clubscope */

		query = {
			clubid: clubid
		};

		projection = {
			_id: 1,
			members: 1
		};

		Club.findOne(query, projection, function(err, club) {

			if(err) {

				res.status(500).json({
					message: 'error_queryclub'
				});
				telkonlogger.logErr(req, res, err.message);

			} else {

				if(club && club.members) {

					var members = [];
					var memberLength = club.members.length;

					for(var i=recSkip*RECORD_LIMIT_CLUB_MEMBERS; i<((recSkip+1)*(RECORD_LIMIT_CLUB_MEMBERS)); i++) {
						if(club.members[i]) {
							members.push(club.members[i]);
						} else {
							break;
						}
					}

					var roles = [
						4, 7, 8, 9
					];

					query = {
						uid: { $in: members },
						role: { $in: roles },
						$or: [
							{name: { $regex: searchReg, $options: "i" }},
							{societyname: { $regex: searchReg, $options: "i" }}
						]
					};

					projection = {
						_id: 0,
						uid: 1,
						socid: 1,
						name: 1,
						imagedp: 1,
						aboutme: 1,
						societyname: 1,
						city: 1
					};

					paginate = {
						sort:
						{
							name: 1
						},
						skip: recSkip*RECORD_LIMIT_CLUB_MEMBERS,
						limit: RECORD_LIMIT_CLUB_MEMBERS
					};

					User.find(query, projection, function(err, data) {

						if(err) {

							res.status(500).json({
								message: 'error_queryuser'
							});
							telkonlogger.logErr(req, res, err.message);

						} else {

							res.status(200).json({
								status: 'suc',
								data: data || []
							});
							telkonlogger.logSuc(req, res, 'Data sent successfully');

						}
					});

				} else {

					res.status(200).json({
						status: 'suc',
						data: []
					});
					telkonlogger.logSuc(req, res, 'Data sent successfully');
				}
			}

		});
	}
}


/* POST /member/club/member/remove */
function postClubMemberRemove(req, res, next) {

	var uid = req.uid;
	var socid = req.socid;
	var clubid = req.body.clubid;
	var memberuid = req.body.memberuid;

	var query = {};
	var projection = {};
	var paginate = {};

	var params = [];
	params.push(clubid);
	params.push(memberuid);

	if(helper.validateParams(params) == false) {
		
		res.status(400).json({
			message: 'error_invalidparams'
		});
		telkonlogger.logErr(req, res, 'Invalid parameters');

	} else {

		if(uid === memberuid) {

			res.status(200).json({
				status: 'suc',
				message: 'error_self'
			});
			telkonlogger.logSuc(req, res, 'Cannot remove self');

		} else {

			query = {clubid: clubid};

			Club.findOne(query, function(err, club) {

				if(err) {

					res.status(500).json({
						message: 'error_queryclub'
					});
					telkonlogger.logErr(req, res, err.message);

				} else {

					if(!club) {

						res.status(200).json({
							status: 'suc',
							message: 'error_norecord'
						});
						telkonlogger.logSuc(req, res, 'No such record');

					} else {

						if(club.admins && club.admins.indexOf(uid) == -1) {

							res.status(200).json({
								status: 'suc',
								message: 'error_denied'
							});
							telkonlogger.logSuc(req, res, 'Permission denied');

						} else {

							if(club.members) {

								var uidIndex = club.members.indexOf(memberuid);
								if(uidIndex == -1) {
									res.status(403).json({
										message: 'fatal'
									});
									telkonlogger.logFatal(req, res, 'Not present in members');
								} else {
									club.members.splice(uidIndex, 1);
									club.save(function(err) {
										if(err) {

											res.status(500).json({
												message: 'error_saveuser'
											});
											telkonlogger.logErr(req, res, err.message);

										} else {

											query = {uid: memberuid};

											User.findOne(query, function(err, user) {
														
												if(err) {

													res.status(500).json({
														message: 'error_queryuser'
													});
													telkonlogger.logErr(req, res, err.message);

												} else {
											
													if(user.subscribedclubs) {
														var index = user.subscribedclubs.indexOf(clubid);
														if(index == -1) {

															res.status(403).json({
																message: 'error_fatal'
															});
															telkonlogger.logFatal(req, res, 'Not present in subscribedclubs');

														} else {

															user.subscribedclubs.splice(index, 1);
															user.save(function(err) {

																if(err) {

																	res.status(500).json({
																		message: 'error_saveuser'
																	});
																	telkonlogger.logErr(req, res, err.message);

																} else {

																	res.status(200).json({
																		status: 'suc',
																		message: 'unsubscribed'
																	});
																	telkonlogger.logSuc(req, res, 'Unsubscribed successfully');
																}
															});
														}

													} else {

														res.status(403).json({
															message: 'error_fatal'
														});
														telkonlogger.logFatal(req, res, 'Not present in clubs');
													}
												}
											});
										}
									});
								}

							} else {
								res.status(403).json({
									message: 'error_fatal'
								});
								telkonlogger.logFatal(req, res, 'Not present in clubs');
							}
						}
					}
				}
			});
		}
	}
}


/* POST /member/club/events/chunk */
function postClubEventsChunk(req, res, next) {

	var uid = req.uid;
	var socid = req.socid;
	var user = req.user;

	var clubid = req.body.clubid;
	var recSkip = req.body.recSkip || 0;
	var query = {};
	var projection = {};
	var paginate = {};

	var params = [];
	params.push(clubid);

	if(helper.validateParams(params) == false) {
		
		res.status(400).json({
			message: 'error_invalidparams'
		});
		telkonlogger.logErr(req, res, 'Invalid parameters');

	} else {

		query = {
			clubid: clubid,
			isactive: true
		};

		projection = {
			_id: 0,
			events: 1
		};

		Club.aggregate(
			{$match: query},
			{$project: projection},
			{$unwind: '$events'},
			{$sort: {"events._id": -1}},
			{$skip: parseInt(recSkip) * RECORD_LIMIT_CLUB_EVENTS},
			{$limit: RECORD_LIMIT_CLUB_EVENTS},

		function(err, events) {

			if(err) {

				res.status(500).json({
					message: 'error_queryclub'
				});
				telkonlogger.logErr(req, res, err.message);

			} else {

				res.status(200).json({
					status: 'suc',
					data: events || []
				});
				telkonlogger.logSuc(req, res, 'Data sent successfully');
			}
		});
	}
}


/* POST /member/club/event/add */
function postClubEventAdd(req, res, next) {

	var uid = req.uid;
	var socid = req.socid;

	var query = {};
	var projection = {};
	var paginate = {};

	var clubid = req.body.clubid;
	var date = req.body.date;
	var title = req.body.title;
	var details = req.body.details;
	var venue = req.body.venue || '';
	var image = req.body.image;

	var params = [];
	params.push(clubid);
	params.push(date);
	params.push(title);
	params.push(details);

	if(helper.validateParams(params) == false) {
		
		res.status(400).json({
			message: 'error_invalidparams'
		});
		telkonlogger.logErr(req, res, 'Invalid parameters');

	} else {

		query = {clubid: clubid};

		Club.findOne(query, function(err, club) {

			if(err) {

				res.status(500).json({
					message: 'error_queryclub'
				});
				telkonlogger.logErr(req, res, err.message);

			} else {

				if(club) {

					if(club.admins && club.admins.indexOf(uid) != -1) {

						var newEvent = {};
						newEvent._id = new mongoose.Types.ObjectId;
						newEvent.uid = uid;
						newEvent.socid = req.socid;
						newEvent.date = date;
						newEvent.title = title;
						newEvent.venue = venue;
						newEvent.details = details;
						newEvent.image = image;
						newEvent.byname = req.user.name;
						newEvent.byemail = req.user.email;
						newEvent.byphone = req.user.phone;

						helper.generateUniqueId(Club, function(eventid) {

				  			if(!eventid) {

				  				res.status(500).json({
									message: 'error_createeventid'
								});
								telkonlogger.logErr(req, res, 'Unable to create new EVENTID');

				  			} else {

				  				newEvent.eventid = eventid;
				  				if(!club.events) {
									club.events = [];
								}

								club.events.push(newEvent);

						  		club.save(function(err) {

									if(err) {

										res.status(500).json({
											message: 'error_newclub'
										});
										telkonlogger.logErr(req, res, err.message);

									} else {

										notifier.clubEventAdded(club.clubtype, club.socid, newEvent);
										res.status(200).json({
											status: 'suc',
											message: 'added'
										});
										telkonlogger.logSuc(req, res, 'Added successfully');
									}
								});
				  			}
						});

					} else {
						res.status(200).json({
							status: 'suc',
							message: 'error_denied'
						});
						telkonlogger.logSuc(req, res, 'Permission denied');
					}

				} else {

					res.status(200).json({
						status: 'suc',
						message: 'error_norecord'
					});
					telkonlogger.logSuc(req, res, 'No such record');

				}
			}
		});
	}
}


/* POST /member/club/posts/chunk */
function postClubPostsChunk(req, res, next) {

	var uid = req.uid;
	var socid = req.socid;
	var user = req.user;

	var clubid = req.body.clubid;
	var recSkip = req.body.recSkip || 0;
	var query = {};
	var projection = {};
	var paginate = {};

	var params = [];
	params.push(clubid);

	if(helper.validateParams(params) == false) {
		
		res.status(400).json({
			message: 'error_invalidparams'
		});
		telkonlogger.logErr(req, res, 'Invalid parameters');

	} else {

		query = {
			clubid: clubid,
			isactive: true
		};

		projection = {
			_id: 0,
			clubpostid: 1,
			clubid: 1,
			uid: 1,
			socid: 1,
			byname: 1,
			byimagedp: 1,
			title: 1,
			details: 1,
			createdat: 1
		};

		paginate = {
			sort: 
			{
				_id: -1
			},
			skip: recSkip*RECORD_LIMIT_CLUB_POSTS,
			limit: RECORD_LIMIT_CLUB_POSTS
		}

		ClubPost.find(query, projection, paginate, function(err, data) {

			if(err) {

				res.status(500).json({
					message: 'error_queryclubpost'
				});
				telkonlogger.logErr(req, res, err.message);

			} else {

				res.status(200).json({
					status: 'suc',
					data: data || []
				});
				telkonlogger.logSuc(req, res, 'Data sent successfully');
			}
		});
	}
}


/* POST /member/clubpost */
function postClubPost(req, res, next) {

	var uid = req.uid;
	var socid = req.socid;
	var user = req.user;

	var clubpostid = req.body.clubpostid;
	var query = {};
	var projection = {};
	var paginate = {};

	var params = [];
	params.push(clubpostid);

	if(helper.validateParams(params) == false) {
		
		res.status(400).json({
			message: 'error_invalidparams'
		});
		telkonlogger.logErr(req, res, 'Invalid parameters');

	} else {

		query = {clubpostid: clubpostid};
		projection = {
			_id: 0,
			clubpostid: 1,
			clubid: 1,
			socid: 1,
			name: 1,
			category: 1,
			clubtype: 1,
			details: 1,
			imagedp: 1,
			membercount: 1,
			members: 1,
			byname: 1,
			bysocietyname: 1,
			bylocality: 1,
			bycity: 1,
			byimagedp: 1,
			createdat: 1
		}

		ClubPost.findOne(query, projection, function(err, data) {

			if(err) {

				res.status(500).json({
					message: 'error_queryclub'
				});
				telkonlogger.logErr(req, res, err.message);

			} else {

				var info = {};
				if(data) {

					var clubid = data.clubid;

					if(user.subscribedclubs && user.subscribedclubs.indexOf(clubid) != -1) {
						info.issubscribed = true;
					} else {
						info.issubscribed = false;
					}
					if(user.clubscreated && user.clubscreated.indexOf(clubid) != -1) {
						info.iscreated = true;
					} else {
						info.iscreated = false;
					}
					if(user.clubsadmin && user.clubsadmin.indexOf(clubid) != -1) {
						info.isadmin = true;
					} else {
						info.isadmin = false;
					}

					res.status(200).json({
						status: 'suc',
						data: {
							club: data || {},
							info: info || {}
						}
					});
					telkonlogger.logSuc(req, res, 'Data sent successfully');

				} else {

					res.status(200).json({
						status: 'suc',
						data: {
							club: {},
							info: {}
						}
					});
					telkonlogger.logSuc(req, res, 'Data sent successfully');
				}
			}
		});
	}	
}


/* POST /member/club/post/add */
function postClubPostAdd(req, res, next) {

	var uid = req.uid;
	var socid = req.socid;

	var query = {};
	var projection = {};
	var paginate = {};

	var clubid = req.body.clubid;
	var title = req.body.title;
	var details = req.body.details;

	var params = [];
	params.push(clubid);
	params.push(title);
	params.push(details);

	if(helper.validateParams(params) == false) {
		
		res.status(400).json({
			message: 'error_invalidparams'
		});
		telkonlogger.logErr(req, res, 'Invalid parameters');

	} else {

		query = {
			clubid: clubid,
			isactive: true
		};

		Club.findOne(query, function(err, club) {

			if(err) {

				res.status(500).json({
					message: 'error_queryclub'
				});
				telkonlogger.logErr(req, res, err.message);

			} else {

				if(club) {

					var subscribedclubs = req.user.subscribedclubs;
					if(subscribedclubs && subscribedclubs.indexOf(clubid) != -1) {

						var newClubPost = {};
						newClubPost._id = new mongoose.Types.ObjectId;
						newClubPost.clubid = clubid;
						newClubPost.uid = uid;
						newClubPost.socid = socid;
						newClubPost.title = title;
						newClubPost.details = details;
						newClubPost.byimagedp = req.user.imagedp;
						newClubPost.byname = req.user.name;
						newClubPost.byemail = req.user.email;
						newClubPost.byphone = req.user.phone;
						newClubPost.bysocietyname = req.user.societyname;

						helper.generateUniqueId(ClubPost, function(clubpostid) {

				  			if(!clubpostid) {

				  				res.status(500).json({
									message: 'error_createclubpostid'
								});
								telkonlogger.logErr(req, res, 'Unable to create new CLUBPOSTID');

				  			} else {

				  				newClubPost.clubpostid = clubpostid;

								new ClubPost(newClubPost).save(function(err) {

									if(err) {

										res.status(500).json({
											message: 'error_newclubpost'
										});
										telkonlogger.logErr(req, res, err.message);

									} else {

										notifier.clubPostAdded(club.clubtype, club.socid, newClubPost);
										res.status(200).json({
											status: 'suc',
											message: 'added'
										});
										telkonlogger.logSuc(req, res, 'Added successfully');
									}
								});
							}
						});

					} else {
						res.status(200).json({
							status: 'suc',
							message: 'error_denied'
						});
						telkonlogger.logSuc(req, res, 'Permission denied');
					}

				} else {

					res.status(200).json({
						status: 'suc',
						message: 'error_norecord'
					});
					telkonlogger.logSuc(req, res, 'No such record');
				}
			}
		});
	}
}


/* POST /member/club/categories */
function getClubCategories(req, res, next) {

	var clubTypes = staticData.clubTypes;

	res.status(200).json({
		status: 'suc',
		data: clubTypes || []
	});
	telkonlogger.logSuc(req, res, 'Data sent successfully');
}


/* POST /member/club/add */
function postClubAdd(req, res, next) {

	var uid = req.uid;
	var socid = req.socid;
	var clubtype = req.body.clubtype;
	var category = req.body.category;
	var name = req.body.name;
	var details = req.body.details;
	var imagedp = req.body.imagedp;

	var params = [];
	params.push(clubtype);
	params.push(category);
	params.push(name);
	params.push(details);

	if(helper.validateParams(params) == false) {
		
		res.status(400).json({
			message: 'error_invalidparams'
		});
		telkonlogger.logErr(req, res, 'Invalid parameters');

	} else {

		if(clubtype == 0 || clubtype == 1) {

			var newClub = {};
			newClub._id = new mongoose.Types.ObjectId;
			newClub.uid = uid;
			newClub.socid = socid;
			newClub.clubtype = clubtype;
			newClub.category = category;
			newClub.name = name;
			newClub.lowercasename = name.toLowerCase();
			newClub.details = details;
			newClub.imagedp = imagedp;
			newClub.bysocietyname = req.user.societyname;
			newClub.bylocality = req.user.locality;
			newClub.pincode = req.user.pincode;
			newClub.bycity = req.user.city;
			newClub.admins = [];
			newClub.members = [];
			newClub.admins.push(uid);
			newClub.members.push(uid);
			newClub.membercount = 1;

			helper.generateUniqueId(Club, function(clubid) {

	  			if(!clubid) {

	  				res.status(500).json({
						message: 'error_createclubid'
					});
					telkonlogger.logErr(req, res, 'Unable to create new CLUBID');

	  			} else {

	  				newClub.clubid = clubid;
	  				new Club(newClub).save(function(err) {

						if(err) {

							res.status(500).json({
								message: 'error_newclub'
							});
							telkonlogger.logErr(req, res, err.message);

						} else {

							query = {uid: uid};

							User.findOne(query, function(err, user) {

								if(err) {

									res.status(500).json({
										message: 'error_queryuser'
									});
									telkonlogger.logErr(req, res, err.message);

								} else {

									if(!user.subscribedclubs) {
										user.subscribedclubs = [];
									}

									user.subscribedclubs.push(clubid);
									user.clubscreated.push(clubid);
									user.clubsadmin.push(clubid);

									user.save(function(err) {

										if(err) {

											res.status(500).json({
												message: 'error_saveuser'
											});
											telkonlogger.logErr(req, res, err.message);

										} else {

											notifier.clubAdded(newClub);
											res.status(200).json({
												status: 'suc',
												message: 'added',
												data: clubid
											});
											telkonlogger.logSuc(req, res, 'Added successfully');
										}
									});
								}
							});
						}
					});
	  			}
			});

		} else {

			res.status(200).json({
				status: 'suc',
				message: 'error_invalidtype'
			});
			telkonlogger.logSuc(req, res, 'Invalid clubtype - ' + clubtype);

		}
	}
}


/* POST /member/club/remove */
function postClubRemove(req, res, next) {

	var uid = req.uid;
	var socid = req.socid;
	var clubid = req.body.clubid;

	var params = [];
	params.push(clubid);

	if(helper.validateParams(params) == false) {

		res.status(400).json({
			message: 'error_invalidparams'
		});
		telkonlogger.logErr(req, res, 'Invalid parameters');

	} else {


		// Check - uid should be an admin

		var query = {clubid: clubid, socid: socid};

		Club.findOneAndRemove(query, function(err, data) {

			if(err) {

				res.status(500).json({
					message: 'error_removeclub'
				});
				telkonlogger.logErr(req, res, err.message);

			} else {

				if(!data) {

					res.status(200).json({
						status: 'suc',
						message: 'error_norecord'
					});
					telkonlogger.logSuc(req, res, 'No such record');

				} else {

					//notifier.noticeRemoved(nid, socid, notice.meantfor);
					res.status(200).json({
						status: 'suc',
						message: 'removed'
					});
					telkonlogger.logSuc(req, res, 'Removed successfully');
				}
			}
		});			
	}
}


// TODO: City should be same
/* POST /member/club/subscribe */
function postClubSubscribe(req, res, next) {

	var uid = req.uid;
	var socid = req.socid;
	var clubid = req.body.clubid;
	var query = {};
	var projection = {};
	var paginate = {};

	var params = [];
	params.push(clubid);

	if(helper.validateParams(params) == false) {

		res.status(400).json({
			message: 'error_invalidparams'
		});
		telkonlogger.logErr(req, res, 'Invalid parameters');

	} else {

		query = {clubid: clubid};

		Club.findOne(query, function(err, club) {

			if(err) {

				res.status(500).json({
					message: 'error_queryclub'
				});
				telkonlogger.logErr(req, res, err.message);

			} else {

				if(!club) {

					res.status(200).json({
						status: 'suc',
						message: 'error_norecord'
					});
					telkonlogger.logSuc(req, res, 'No such record');

				} else {

					if(club.members) {
						if(club.members.indexOf(uid) != -1) {
							res.status(403).json({
								message: 'fatal'
							});
							telkonlogger.logFatal(req, res, 'Already present in members');
						} else {
							club.members.push(uid);
							club.membercount++;
							club.save(function(err) {
								if(err) {

									res.status(500).json({
										message: 'error_saveuser'
									});
									telkonlogger.logErr(req, res, err.message);

								} else {
									query = {uid: uid};

									User.findOne(query, function(err, user) {

										if(err) {

											res.status(500).json({
												message: 'error_queryuser'
											});
											telkonlogger.logErr(req, res, err.message);

										} else {

											if(user.subscribedclubs) {
												if(user.subscribedclubs.indexOf(clubid) != -1) {

													res.status(403).json({
														message: 'fatal'
													});
													telkonlogger.logFatal(req, res, 'Already present in subscribedclubs');

												} else {

													user.subscribedclubs.push(clubid);
													user.save(function(err) {

														if(err) {

															res.status(500).json({
																message: 'error_saveuser'
															});
															telkonlogger.logErr(req, res, err.message);

														} else {

															res.status(200).json({
																status: 'suc',
																message: 'subscribed'
															});
															telkonlogger.logSuc(req, res, 'Subscribed successfully');
														}
													});
												}

											} else {

												user.subscribedclubs = [];

												user.subscribedclubs.push(clubid);
												user.save(function(err) {

													if(err) {
														
														res.status(500).json({
															message: 'error_saveuser'
														});
														telkonlogger.logErr(req, res, err.message);

													} else {

														res.status(200).json({
															status: 'suc',
															message: 'subscribed'
														});
														telkonlogger.logSuc(req, res, 'Subscribed successfully');
													}
												});
											}
										}
									});
								}
							});
						}

					} else {

						club.members = [];
						club.members.push(uid);
						club.membercount++;
						club.save(function(err) {
							if(err) {

								res.status(500).json({
									message: 'error_saveuser'
								});
								telkonlogger.logErr(req, res, err.message);

							} else {
								query = {uid: uid};

								User.findOne(query, function(err, user) {

									if(err) {

										res.status(500).json({
											message: 'error_queryuser'
										});
										telkonlogger.logErr(req, res, err.message);

									} else {

										if(user.subscribedclubs) {
											if(user.subscribedclubs.indexOf(clubid) != -1) {

												res.status(403).json({
													message: 'fatal'
												});
												telkonlogger.logFatal(req, res, 'Already present in subscribedclubs');

											} else {

												user.subscribedclubs.push(clubid);
												user.save(function(err) {

													if(err) {

														res.status(500).json({
															message: 'error_saveuser'
														});
														telkonlogger.logErr(req, res, err.message);

													} else {

														res.status(200).json({
															status: 'suc',
															message: 'subscribed'
														});
														telkonlogger.logSuc(req, res, 'Subscribed successfully');
													}
												});
											}

										} else {

											user.subscribedclubs = [];

											user.subscribedclubs.push(clubid);
											user.save(function(err) {

												if(err) {
													
													res.status(500).json({
														message: 'error_saveuser'
													});
													telkonlogger.logErr(req, res, err.message);

												} else {

													res.status(200).json({
														status: 'suc',
														message: 'subscribed'
													});
													telkonlogger.logSuc(req, res, 'Subscribed successfully');
												}
											});
										}
									}
								});
							}
						});
					}
				}
			}
		});
	}
}


/* POST /member/club/unsubscribe */
function postClubUnsubscribe(req, res, next) {

	var uid = req.uid;
	var socid = req.socid;
	var clubid = req.body.clubid;
	var query = {};
	var projection = {};
	var paginate = {};

	var params = [];
	params.push(clubid);

	if(helper.validateParams(params) == false) {
		
		res.status(400).json({
			message: 'error_invalidparams'
		});
		telkonlogger.logErr(req, res, 'Invalid parameters');

	} else {

		query = {clubid: clubid};

		Club.findOne(query, function(err, club) {

			if(err) {

				res.status(500).json({
					message: 'error_queryclub'
				});
				telkonlogger.logErr(req, res, err.message);

			} else {

				if(!club) {

					res.status(200).json({
						status: 'suc',
						message: 'error_norecord'
					});
					telkonlogger.logSuc(req, res, 'No such record');

				} else {

					if(club.members) {

						var uidIndex = club.members.indexOf(uid);
						if(uidIndex == -1) {
							res.status(403).json({
								message: 'fatal'
							});
							telkonlogger.logFatal(req, res, 'Not present in members');
						} else {
							club.members.splice(uidIndex, 1);
							club.membercount--;
							club.save(function(err) {
								if(err) {

									res.status(500).json({
										message: 'error_saveuser'
									});
									telkonlogger.logErr(req, res, err.message);

								} else {

									query = {uid: uid};

									User.findOne(query, function(err, user) {
												
										if(err) {

											res.status(500).json({
												message: 'error_queryuser'
											});
											telkonlogger.logErr(req, res, err.message);

										} else {
									
											if(user.subscribedclubs) {
												var index = user.subscribedclubs.indexOf(clubid);
												if(index == -1) {

													res.status(403).json({
														message: 'error_fatal'
													});
													telkonlogger.logFatal(req, res, 'Not present in subscribedclubs');

												} else {

													user.subscribedclubs.splice(index, 1);
													user.save(function(err) {

														if(err) {

															res.status(500).json({
																message: 'error_saveuser'
															});
															telkonlogger.logErr(req, res, err.message);

														} else {

															res.status(200).json({
																status: 'suc',
																message: 'unsubscribed'
															});
															telkonlogger.logSuc(req, res, 'Unsubscribed successfully');
														}
													});
												}

											} else {

												res.status(403).json({
													message: 'error_fatal'
												});
												telkonlogger.logFatal(req, res, 'Not present in clubs');
											}
										}
									});
								}
							});
						}

					} else {						

						res.status(403).json({
							message: 'error_fatal'
						});
						telkonlogger.logFatal(req, res, 'Not present in members');
					}
				}
			}
		});
	}
}


/* POST /member/myclubs */
function postMyClubs(req, res, next) {

	var uid = req.uid;

	var query = {};
	var projection = {};
	var paginate = {};

	query = {uid: uid};
	projection = {
		_id: 0,
		subscribedclubs: 1,
		clubscreated: 1
	}

	User.findOne(query, projection, function(err, user) {

		if(err) {

			res.status(500).json({
				message: 'error_queryuser'
			});
			telkonlogger.logErr(req, res, err.message);

		} else {

			if(user.subscribedclubs && user.subscribedclubs.length > 0) {

				var userClubs = [];
				for(var i=0; i<user.subscribedclubs.length; i++) {
					userClubs.push(user.subscribedclubs[i]);
				}

				if(user.clubscreated && user.clubscreated.length > 0) {

					for(var i=0; i<user.clubscreated.length; i++) {
						userClubs.push(user.clubscreated[i]);
					}
				}

				query = {
					clubid: {$in: userClubs},
					isactive: true
				};

				projection = {
					_id: 0,
					clubid: 1,
					clubtype: 1,
					name: 1,
					details: 1,
					imagedp: 1,
					byname: 1,
					bysocietyname: 1,
					bylocality: 1,
					bycity: 1,
					byimagedp: 1,
					createdat: 1
				};

				var paginate = {
					sort:
					{
						_id: -1
					}
				};

				Club.find(query, projection, paginate, function(err, data) {

					if(err) {

						res.status(500).json({
							message: 'error_queryclub'
						});
						telkonlogger.logErr(req, res, err.message);

					} else {

						res.status(200).json({
							status: 'suc',
							data: {
								myclubs : data || [],
								clubscreated: user.clubscreated || []
							}
						});
						telkonlogger.logSuc(req, res, 'Data sent successfully');
					}
				});


			} else {

				res.status(200).json({
					status: 'suc',
					data: {
						myclubs : [],
						clubscreated: []
					}
				});
				telkonlogger.logSuc(req, res, 'Data sent successfully');
			}

		}

	});			
}


/* POST /member/club/update/name */
function postClubUpdateName(req, res, next) {

	var uid = req.uid;
	var clubid = req.body.clubid;
	var name = req.body.name;

	var params = [];
	params.push(name);

	if(helper.validateParams(params) == false) {
		
		res.status(400).json({
			message: 'error_invalidparams'
		});
		telkonlogger.logErr(req, res, 'Invalid parameters');

	} else {

		if(user.clubsadmin && (user.clubsadmin.indexOf(clubid) != -1)) {

			Club.update({
				clubid: clubid
			}, {
				name: name

			}, function(err){
				if(err) {

					res.status(500).json({
						message: 'error_updateclub'
					});
					telkonlogger.logErr(req, res, err.message);

				} else {

					res.status(200).json({
						status: 'suc',
						message: 'updated'
					});
					telkonlogger.logSuc(req, res, 'Updated successfully');
				}
			});

		} else {

			res.status(200).json({
				status: 'suc',
				message: 'error_denied'
			});
			telkonlogger.logSuc(req, res, 'Permission denied');

		}

	}
}


/* POST /member/club/update/imagedp */
function postClubUpdateImagedp(req, res, next) {

	var uid = req.uid;
	var user = req.user;
	var clubid = req.body.clubid;
	var imagedp = req.body.imagedp;

	var params = [];
	params.push(imagedp);
	params.push(clubid);

	if(helper.validateParams(params) == false) {
		
		res.status(400).json({
			message: 'error_invalidparams'
		});
		telkonlogger.logErr(req, res, 'Invalid parameters');

	} else {

		if(user.clubsadmin && (user.clubsadmin.indexOf(clubid) != -1)) {

			Club.update({
				clubid: clubid
			}, {
				imagedp: imagedp

			}, function(err){
				if(err) {

					res.status(500).json({
						message: 'error_updateclub'
					});
					telkonlogger.logErr(req, res, err.message);

				} else {

					res.status(200).json({
						status: 'suc',
						message: 'updated'
					});
					telkonlogger.logSuc(req, res, 'Updated successfully');
				}
			});

		} else {

			res.status(200).json({
				status: 'suc',
				message: 'error_denied'
			});
			telkonlogger.logSuc(req, res, 'Permission denied');
		}
	}
}


/* POST /member/family */
function postFamily(req, res, next) {

	var uid = req.uid;
	var socid = req.socid;
	var flat = req.user.flat;

	var query = {
		uid: { $ne: uid},
		flat: flat,
		socid: socid,
		isblocked: false,
		//residencetype: req.user.residencetype,
		isactive: true
	};
	var projection = {
		_id: 0,
		uid: 1,
		name: 1,
		email: 1,
		imagedp: 1,
		isreported: 1,
		reportedby: 1,
		phone: 1
	};

	User.find(query, projection, function(err, data) {

		if(err) {

			res.status(500).json({
				message: 'error_queryuser'
			});
			telkonlogger.logErr(req, res, err.message);

		} else {
					
			res.status(200).json({
				status: 'suc',
				data: data || []
			});
			telkonlogger.logSuc(req, res, 'Data sent successfully');
		}
	});
}

// TODO: Not working - Unable to save familymember
/* POST /member/family/report */
function postFamilyReport(req, res, next) {

	var uid = req.uid;
	var socid = req.socid;

	var reportuid = req.body.reportuid;
	var query = {};

	var params = [];
	params.push(reportuid);

	if(helper.validateParams(params) == false) {
		
		res.status(400).json({
			message: 'error_invalidparams'
		});
		telkonlogger.logErr(req, res, 'Invalid parameters');

	} else {

		query = {
			uid: uid,
			socid: socid,
			isactive: true
		};

		User.findOne(query, function(err, user) {

			if(err) {

				res.status(500).json({
					message: 'error_queryuser'
				});
				telkonlogger.logErr(req, res, err.message);

			} else {

				user.reported.push(reportuid);
				user.save(function(err) {

					if(err) {

						res.status(500).json({
							message: 'error_saveuser'
						});
						telkonlogger.logErr(req, res, err.message);

					} else {

						query = {
							uid: reportuid,
							socid: socid,
							flat: user.flat,
							residencetype: user.residencetype,
							isactive: true
						};

						User.findOne(query, function(err, familymember) {

							if(err) {

								res.status(500).json({
									message: 'error_queryuser'
								});
								telkonlogger.logErr(req, res, err.message);

							} else {

								if(typeof familymember === 'undefined' ||
									familymember === null ||
									familymember === '') {

									res.status(403).json({
										message: 'error_fatal'
									});
									telkonlogger.logFatal(req, res, 'Not present in db');

								} else {

									if(user.flat === familymember.flat) {

										familymember.isreported = true;
										familymember.reportedby.push(uid);

										familymember.save(function(err) {

											if(err) {

												res.status(500).json({
													message: 'error_saveuser'
												});
												telkonlogger.logErr(req, res, err.message);

											} else {

												notifier.familyMemberReported(reportuid, socid, familymember.flat);
												res.status(200).json({
													status: 'suc',
													message: 'reported'
												});
												telkonlogger.logSuc(req, res, 'Reported successfully');
											}
										});

									} else {

										res.status(403).json({
											message: 'error_fatal'
										});
										telkonlogger.logFatal(req, res, 'Not a flatmate');
									}
										
								}
							}

						});

					}
				});
											
			}
		});			

	}
}


/* POST /member/members/chunk */
function postMembersChunk(req, res, next) {

	var uid = req.uid;
	var socid = req.socid;
	var recSkip = req.body.recSkip || 0;
	var search = req.body.search || '';
	var searchReg = new RegExp(search, 'g');

	var roles = [
		4, 7, 8, 9
	]
	var query = {
		role: { $in: roles },
		socid: socid,
		$or: [
			{flat: { $regex: searchReg, $options: "i" }},
			{name: { $regex: searchReg, $options: "i" }}
		],
		isremoved: false,
		isactive: true
	};
	var projection = {
		_id: 0,
		uid: 1,
		flat: 1,
		name: 1,
		isblocked: 1,
		isreported: 1,
		residencetype: 1,
		email: 1,
		phone: 1,
		imagedp: 1,
		membersince: 1,
		createdat: 1
	};
	var paginate = {
		sort:
		{
			name: 1,
			email: 1
		},
		skip: recSkip*RECORD_LIMIT_MEMBERS,
		limit: RECORD_LIMIT_MEMBERS
	};

	User.find(query, projection, paginate, function(err, data) {

		if(err) {

			res.status(500).json({
				message: 'error_queryuser'
			});
			telkonlogger.logErr(req, res, err.message);

		} else {

			res.status(200).json({
				status: 'suc',
				data: data || []
			});
			telkonlogger.logSuc(req, res, 'Data sent successfully');
		}
	});
}


/* POST /member/myclassifieds */
function postMyClassifieds(req, res, next) {

	var uid = req.uid;
	var socid = req.socid;

	var query = {
		uid: uid,
		socid: socid,
		isactive: true
	};
	var projection = {
		_id: 0,
		cid: 1,
		title: 1,
		category: 1,
		byemail: 1,
		byphone: 1,
		createdat: 1
	};
	var sort = {sort:{_id:-1}};

	Classified.find(query, projection, sort, function(err, data) {

		if(err) {

			res.status(500).json({
				status: 'suc',
				message: 'error'
			});
			telkonlogger.logErr(req, res, err.message);

		} else {

			res.status(200).json({
				status: 'suc',
				data: data || []
			});
			telkonlogger.logSuc(req, res, 'Data sent successfully');
		}
	});
}


/* POST /member/myclassified/remove */
function postMyClassifiedRemove(req, res, next) {


	var uid = req.uid;
	var socid = req.socid;
	var cid = req.body.cid;

	var params = [];
	params.push(cid);

	if(helper.validateParams(params) == false) {
		
		res.status(400).json({
			message: 'error_invalidparams'
		});

	} else {

		var query = {
			uid: uid,
			cid: cid,
			socid: socid,
			isactive: true
		};

		Classified.findOneAndRemove(query, function(err) {
					
			if(err) {

				res.status(500).json({
					message: 'error_removeclassified'
				});
				telkonlogger.logErr(req, res, err.message);

			} else {
		
				notifier.classifiedRemoved(cid);
				res.status(200).json({
					status: 'suc',
					message: 'removed'
				});
				telkonlogger.logSuc(req, res, 'Removed successfully');
			}
		});
	}	
}


/* POST /member/myforums */
function postMyForums(req, res, next) {

	var uid = req.uid;
	var socid = req.socid;

	var query = {
		uid: uid,
		socid: socid,
		isactive: true
	};
	var projection = {
		_id: 0,
		fid: 1,
		title: 1,
		forumtype: 1,
		bysocietyname: 1,
		lastact: 1,
		byimagedp: 1,
		totalcomments: 1,
		createdat: 1
	};
	var sort = {sort:{_id:-1}};

	Forum.find(query, projection, sort, function(err, data) {

		if(err) {

			res.status(500).json({
				message: 'error_queryforum'
			});
			telkonlogger.logErr(req, res, err.message);

		} else {

			query = {uid: uid};
			projection = {
				_id: 0,
				favoriteforums: 1,
				forumsread: 1,
				forumsfeeling: 1,
				forumsfeelingemo: 1
			};

			User.findOne(query, projection, function(err, user) {

				if(err) {

					res.status(500).json({
						message: 'error_queryuser'
					});
					telkonlogger.logErr(req, res, err.message);

				} else {

					res.status(200).json({
						status: 'suc',
						data: {
							forums: data || [],
							forumsread: user.forumsread || [],
							favoriteforums: user.favoriteforums || [],
							forumsfeeling: user.forumsfeeling || [],
							forumsfeelingemo: user.forumsfeelingemo || []
						}
					});
					telkonlogger.logSuc(req, res, 'Data sent successfully');
				}
			});

		}

	});
}


/* POST /member/myorum/remove */
function postMyForumRemove(req, res, next) {


	var uid = req.uid;
	var socid = req.socid;
	var fid = req.body.fid;

	var params = [];
	params.push(fid);

	if(helper.validateParams(params) == false) {
		
		res.status(400).json({
			message: 'error_invalidparams'
		});
		telkonlogger.logErr(req, res, 'Invalid parameters');

	} else {

		var query = {
			uid: uid,
			fid: fid,
			socid: socid,
			isactive: true
		};

		Forum.findOne(query, function(err, forum) {
					
			if(err) {
				res.status(500).json({
					message: 'error_queryforum'
				});
				telkonlogger.logErr(req, res, err.message);

			} else {

				forum.remove(function(err) {

					if(err) {
						res.status(500).json({
							message: 'error_removeforum'
						});
						telkonlogger.logErr(req, res, err.message);

					} else {

						notifier.forumRemoved(fid, forum.socid, forum.forumtype);
						res.status(200).json({
							status: 'suc',
							message: 'removed'
						});
						telkonlogger.logSuc(req, res, 'Removed successfully');
					}
				})
						
			}
		});
	}	
}


/* POST /member/savednotices */
function postSavedNotices(req, res, next) {

	var uid = req.uid;
	var socid = req.socid;

	var query = {
		uid: uid,
		isactive: true
	};
	var projection = {
		_id: 0,
		savednotices: 1
	};

	User.findOne(query, projection, function(err, user) {

		if(err) {

			res.status(500).json({
				message: 'error_queryuser'
			});
			telkonlogger.logErr(req, res, err.message);

		} else {

			query = {
				nid: { $in: user.savednotices},
				socid: socid
			};
			projection = {
				_id: 0,
				nid: 1,
				title: 1,
				contentshort: 1,
				createdat: 1
			};

			var sort = {sort:{_id:-1}};
			Notice.find(query, projection, sort, function(err, data) {

				if(err) {

					res.status(500).json({
						message: 'error_querynotice'
					});
					telkonlogger.logErr(req, res, err.message);

				} else {

					res.status(200).json({
						status: 'suc',
						data: data || []
					});
					telkonlogger.logSuc(req, res, 'Data sent successfully');
				}
			});
		}

	});
}


/* POST /member/savedclassifieds */
function postSavedClassifieds(req, res, next) {

	var uid = req.uid;
	var socid = req.socid;

	var query = {
		uid: uid,
		isactive: true
	};
	var projection = {
		_id: 0,
		savedclassifieds: 1
	};

	User.findOne(query, projection, function(err, user) {

		if(err) {

			res.status(500).json({
				message: 'error_queryuser'
			});
			telkonlogger.logErr(req, res, err.message);

		} else {

			query = {
				cid: { $in: user.savedclassifieds},
				isactive: true
			};
			projection = {
				_id: 0,
				cid: 1,
				title: 1,
				category: 1,
				byemail: 1,
				byphone: 1,
				createdat: 1
			};

			var sort = {sort:{_id:-1}};
			Classified.find(query, projection, function(err, data) {

				if(err) {

					res.status(500).json({
						message: 'error_queryclassified'
					});
					telkonlogger.logErr(req, res, err.message);

				} else {

					res.status(200).json({
						status: 'suc',
						data: data || []
					});
					telkonlogger.logSuc(req, res, 'Data sent successfully');
				}
			});
		}

	});
}


/* POST /member/notifications */
function postNotifications(req, res, next) {

	var  uid = req.uid;

	var query = {
		uid: uid
	};
	var projection = {
		_id: 0,
		total: 1,
		info: 1
	};
	Notification.aggregate(
		{$match: query},
		{$project: projection},
		{$unwind: '$info'},
		{$sort: {"info.date": -1}},
		{$limit: RECORD_LIMIT_NOTIFICATION},
	function(err, noti) {

		if(err) {

			res.status(500).json({
				message: 'error_querynotification'
			});
			telkonlogger.logErr(req, res, err.message);

		} else {

			var total = 0;
			if(noti && noti[0]) {
				total = noti[0].total;
			}

			if(noti) {

				getNotificationData(noti, function(data) {
					res.status(200).json({
						status: 'suc',
						data: {
							total: total,
							notifications: data || []
						}
					});
					telkonlogger.logSuc(req, res, 'Data sent successfully');
				});
					
			} else {

				res.status(200).json({
					status: 'suc',
					data: {
						total: total,
						notifications: []
					}
				});
				telkonlogger.logSuc(req, res, 'Data sent successfully');
			}
		}
	});
}


/* POST /member/notifications/chunk */
function postNotificationsChunk(req, res, next) {

	var  uid = req.uid;
	var recSkip = req.body.recSkip || 0;

	var query = {
		uid: uid
	};
	var projection = {
		_id: 0,
		info: 1
	};

	Notification.aggregate(
		{$match: {uid: uid}},
		{$project: projection},
		{$unwind: '$info'},
		{$sort: {"info.date": -1}},
		{$skip: parseInt(recSkip) * RECORD_LIMIT_NOTIFICATION},
		{$limit: RECORD_LIMIT_NOTIFICATION},
	function(err, noti) {

		if(err) {

			res.status(500).json({
				message: 'error_querynotification'
			});
			telkonlogger.logErr(req, res, err.message);

		} else {

			if(noti) {

				getNotificationData(noti, function(data) {
					res.status(200).json({
						status: 'suc',
						data: {
							total: noti.total,
							notifications: data
						}
					});
					telkonlogger.logSuc(req, res, 'Data sent successfully');
				});
					

			} else {

				res.status(200).json({
					status: 'suc',
					data: {
						total: 0,
						info: []
					}
				});
				telkonlogger.logSuc(req, res, 'Data sent successfully');
			}
		}
	});
}


function getNotificationData(noti, callback) {

		var items = [];
		var item = {};
		var info = {};
		var query = {};
		var projection = {};

		
		for(var i=0; i<noti.length; i++) {

			info = noti[i].info;
			item = {};
			item.infoid = info.infoid;
			item.infotype = info.infotype;
			item.date = info.date;
			if(info.infotype == 1) { 	// Notice
				item.title = 'Notice';
				if(info.infovalue == 100) {
					item.message = info.infodata + 'New notice';
				}
				items.push(item);

			} else if(info.infotype == 2) { 	// Complaint
				item.title = 'Complaint';

				if(info.infovalue == 200) {
					item.message = info.infodata + ' : New complant';
				} else if(info.infovalue == 201) {
					item.message = info.infodata + ' : Status changed';
				} else if(info.infovalue == 202) {
					item.message = info.infodata + ' : Status changed by admin.';
				} else if(info.infovalue == 203) {
					item.message = info.infodata + ' : New comment by member';
				} else if(info.infovalue == 204) {
					item.message = info.infodata + ' : New comment by admin';
				} else if(info.infovalue == 205) {
					item.message = info.infodata + ' : Removed by member';
				} else if(info.infovalue == 206) {
					item.message = info.infodata + ' : Removed by admin';
				}
				items.push(item);

			} else if(info.infotype == 3) { 	// Classified
				item.title = 'Classified';
				if(info.infovalue == 300) {
					item.message = info.infodata + ' : New classified';
				}
				items.push(item);

			} else if(info.infotype == 4) { 	// Contact
				item.title = 'Contact';
				if(info.infovalue == 401) {
					item.message = info.infodata + ' : New SERVICE contact added';
				} else if(info.infovalue == 402) {
					item.message = info.infodata + ' : New AROUND ME contact added';
				} else if(info.infovalue == 403) {
					item.message = info.infodata + ' : New RWA contact added';
				} else if(info.infovalue == 404) {
					item.message = info.infodata + ' : New INTERCOM contact added';
				}
				items.push(item);

			} else if(info.infotype == 5) { 	// Forum
				item.title = 'Forum';
				if(info.infovalue == 500) {
					item.message = info.infodata + ': New private forum';
				} else if(info.infovalue == 501) {
					item.message = info.infodata + ': New public forum';
				} else if(info.infovalue == 502) {
					item.message = info.infodata + ': New comment';
				} else if(info.infovalue == 503) {
					item.message = info.infodata + ': New emoticon';
				}
				items.push(item);

			} else if(info.infotype == 6) { 	// Member
				item.title = 'Member';
				if(info.infovalue == 600) {
					item.message = info.infodata + ': has joined';
				} else if(info.infovalue == 601) {
					item.message = info.infodata + ': has changed display picture';
				} else if(info.infovalue == 602) {
					item.message = info.infodata + ': has updated name';
				} else if(info.infovalue == 603) {
					item.message = info.infodata + ': has changed the society';
				}
				items.push(item);

			} else if(info.infotype == 7) { 	// Club
				item.title = 'Club';
				console.log(info);
				if(info.infovalue == 700) {
					item.message = info.infodata + ': New CLOSED club';
				} else if(info.infovalue == 701) {
					item.message = info.infodata + ': New OPEN club';
				} else if(info.infovalue == 702) {
					item.message = info.infodata + ': New post';
				} else if(info.infovalue == 703) {
					item.message = info.infodata + ': New comment';
				} else if(info.infovalue == 704) {
					item.message = info.infodata + ': New event';
				} else if(info.infovalue == 705) {
					item.message = info.infodata + ': has joined club';
				}

				items.push(item);
			}
		}
		callback(items);
}

/* POST /member/notifications/cleartotal */
function postNotificationsCleartotal(req, res, next) {

	var uid = req.uid;

	Notification.update({
		uid: uid
	}, {
		total: 0
	}, function(err){

		if(err) {

			res.status(500).json({
				message: 'error_updatenotification'
			});
			telkonlogger.logErr(req, res, err.message);

		} else {

			res.status(200).json({
				status: 'suc',
				message: 'updated'
			});
			telkonlogger.logSuc(req, res, 'Updated successfully');
		}
	});
}


/* POST /member/feedbacks */
function postFeedbacks(req, res, next) {

	var uid = req.user.uid;

	var query = {
		uid: uid
	};
	var projection = {
		_id: 0,
		message: 1,
		createdat: 1
	};
	var paginate = {
		sort: {_id:-1}
	};

	Feedback.find(query, projection, paginate, function(err, data) {

		if(err) {

			res.status(500).json({
				message: 'error_queryfeedback'
			});
			telkonlogger.logErr(req, res, err.message);

		} else {

			res.status(200).json({
				status: 'suc',
				data: data || []
			});
			telkonlogger.logSuc(req, res, 'Data sent successfully');
		}
	});
}


/* POST /member/feedback/add */
function postFeedbackAdd(req, res, next) {

	var uid = req.uid;
	var socid = req.socid;

	var message = req.body.message;

	var params = [];
	params.push(message);

	if(helper.validateParams(params) == false) {
		
		res.status(400).json({
			message: 'error_invalidparams'
		});
		telkonlogger.logErr(req, res, 'Invalid parameters');

	} else {
		
		var newFeedback = {};
		newFeedback._id = new mongoose.Types.ObjectId;
		newFeedback.uid = uid;
		newFeedback.byname = req.user.name;
		newFeedback.byemail = req.user.email;
		newFeedback.byphone = req.user.phone;
		newFeedback.byrole = req.user.role;
		newFeedback.bysocietyname = req.user.societyname;
		newFeedback.bycity = req.user.city;
		newFeedback.byimagedp = req.user.imagedp;
		newFeedback.message = message;

		new Feedback(newFeedback).save(function(err) {

			if(err) {

				res.status(500).json({
					message: 'error_newfeedback'
				});
				telkonlogger.logErr(req, res, err.message);

			} else {

				var feedbackEmail = header.mail.feedback.username;
				var mailOptions = {};
				var mailList = [];
				mailList.push(feedbackEmail);

				mailOptions['to'] = mailList;
				mailOptions['subject'] =  newFeedback.bysocietyname;

				mailOptions['text'] = 	'New Feedback/Suggestion has been received\n'+
											'Name: ' + newFeedback.byname + '\n' +
											'Email: ' + newFeedback.byemail + '\n' +
											'Society: ' + newFeedback.bysocietyname + '\n' +
											'City: ' + newFeedback.bycity + '\n' +
											'Phone: ' + newFeedback.byphone + '\n' +
											'Role: ' + newFeedback.byrole + '\n' +
											'Messsage: ' + newFeedback.message + '\n';
				mailOptions['html'] = 	'<p>New Feedback/Suggestion has been received</p>' +
										'<p>' +
											'Name: ' + newFeedback.byname + '<br>' +
											'Email: ' + newFeedback.byemail + '<br>' +
											'Society: ' + newFeedback.bysocietyname + '<br>' +
											'City: ' + newFeedback.bycity + '<br>' +
											'Phone: ' + newFeedback.byphone + '<br>' +
											'Role: ' + newFeedback.byrole + '<br>' +
											'Messsage: ' + newFeedback.message + '<br>' +
										'</p>'

				mailer.infoSendMail(mailList, mailOptions, function(err, info) { });
				notifier.feedbackAdded(newFeedback);
				res.status(200).json({
					status: 'suc',
					message: 'added'
				});
				telkonlogger.logSuc(req, res, 'Added successfully');
			}
		});
	}
}


/* POST /member/rules */
function postRules(req, res, next) {

	var socid = req.socid;
	var query = {socid: socid};
	var projection = {
		_id: 1,
		societyrules: 1
	};

	Society.findOne(query, projection, function(err, data) {

		if(err) {

			res.status(500).json({
				message: 'error_querysociety'
			});
			telkonlogger.logErr(req, res, err.message);

		} else {

			if(data) {
				res.status(200).json({
					status: 'suc',
					data: data.societyrules || ''
				});
				telkonlogger.logSuc(req, res, 'Data sent successfully');
			} else {
				res.status(200).json({
					status: 'suc',
					data: ''
				});
				telkonlogger.logSuc(req, res, 'Data sent successfully');
			}
				
		}
	});
}


/* POST /member/support/add */
function postSupportAdd(req, res, next) {

	var uid = req.uid;
	var socid = req.socid;

	var message = req.body.message || 'No Message';
		
	var newSupport = {};
	newSupport._id = new mongoose.Types.ObjectId;
	newSupport.uid = uid;
	newSupport.byname = req.user.name;
	newSupport.byemail = req.user.email;
	newSupport.byphone = req.user.phone;
	newSupport.byrole = req.user.role;
	newSupport.bysocietyname = req.user.societyname;
	newSupport.bycity = req.user.city;
	newSupport.byimagedp = req.user.imagedp;
	newSupport.message = message;

	new Support(newSupport).save(function(err) {

		if(err) {

			res.status(500).json({
				message: 'error_newfeedback'
			});
			telkonlogger.logErr(req, res, err.message);

		} else {

			notifier.supportAdded(newSupport);
			res.status(200).json({
				status: 'suc',
				message: 'added'
			});
			telkonlogger.logSuc(req, res, 'Added successfully');
		}
	});
}

/* POST /member/user */
function postUser(req, res, next) {

	var uid = req,uid;
	var socid = req.socid;

	var userid = req.body.userid;

	var params = [];
	params.push(userid);

	if(helper.validateParams(params) == false) {
		
		res.status(400).json({
			message: 'error_invalidparams'
		});
		telkonlogger.logErr(req, res, 'Invalid parameters');

	} else {

		var query = {
			uid: userid
		};
		var projection = {
			_id: 1,
			uid: 1,
			socid: 1,
			name: 1,
			imagedp: 1,
			societyname: 1,
			city: 1,
			aboutme: 1
		};

		User.findOne(query, projection, function(err, data) {

			if(err) {

				res.status(500).json({
					message: 'error_queryuser'
				});
				telkonlogger.logErr(req, res, err.message);

			} else {

				res.status(200).json({
					status: 'suc',
					data: data || {}
				});
				telkonlogger.logSuc(req, res, 'Data sent successfully');
			}
		});
	}
}


/* POST /member/user/clubs/chunk */
function postUserClubsChunk(req, res, next) {

	var uid = req,uid;
	var socid = req.socid;
	var userid = req.body.userid;
	var recSkip = req.body.recSkip || 0;
	var search = req.body.search || '';
	var searchReg = new RegExp(search, 'g');

	var params = [];
	params.push(userid);

	if(helper.validateParams(params) == false) {
		
		res.status(400).json({
			message: 'error_invalidparams'
		});
		telkonlogger.logErr(req, res, 'Invalid parameters');

	} else {

		var query = {
			uid: userid
		};
		var projection = {
			_id: 1,
			subscribedclubs: 1
		};

		User.findOne(query, projection, function(err, data) {

			if(err) {

				res.status(500).json({
					message: 'error_queryuser'
				});
				telkonlogger.logErr(req, res, err.message);

			} else {

				if(data && data.subscribedclubs && data.subscribedclubs.length > 0) {

					var clubs = [];
					for(var i=0; i<data.subscribedclubs.length; i++) {
						clubs.push(data.subscribedclubs[i]);
					}

					query = {
						clubid: { $in: clubs },
						$or: [
							{name: { $regex: searchReg, $options: "i" }}
						]
					}
					projection = {
						_id: 0,
						clubid: 1,
						name: 1,
						details: 1,
						imagedp: 1,
						membercount: 1,
						byname: 1,
						bysocietyname: 1,
						bylocality: 1,
						bycity: 1,
						byimagedp: 1,
						createdat: 1
					};
					var paginate = {
						sort:
						{
							_id: -1
						},
						skip: recSkip*RECORD_LIMIT_USER_CLUBS,
						limit: RECORD_LIMIT_USER_CLUBS
					};

					Club.find(query, projection, paginate, function(err, clubdata) {

						if(err) {

							res.status(500).json({
								message: 'error_queryclub'
							});
							telkonlogger.logErr(req, res, err.message);

						} else {

							res.status(200).json({
								status: 'suc',
								data: clubdata || []
							});
							telkonlogger.logSuc(req, res, 'Data sent successfully');

						}

					});

				} else {
					res.status(200).json({
						status: 'suc',
						data: []
					});
					telkonlogger.logSuc(req, res, 'Data sent successfully');
				}
			}
		});
	}
}


/* POST /member/society */
function postSociety(req, res, next) {

	var uid = req,uid;
	var socid = req.socid;

	var societyid = req.body.societyid;

	var params = [];
	params.push(societyid);

	if(helper.validateParams(params) == false) {
		
		res.status(400).json({
			message: 'error_invalidparams'
		});
		telkonlogger.logErr(req, res, 'Invalid parameters');

	} else {

		var query = {
			socid: societyid
		};
		var projection = {
			_id: 1,
			socid: 1,
			societyname: 1,
			societycode: 1,
			locality: 1,
			city: 1,
			imagedp: 1,
			pincode: 1
		};

		Society.findOne(query, projection, function(err, data) {

			if(err) {

				res.status(500).json({
					message: 'error_queryuser'
				});
				telkonlogger.logErr(req, res, err.message);

			} else {

				res.status(200).json({
					status: 'suc',
					data: data || {}
				});
				telkonlogger.logSuc(req, res, 'Data sent successfully');
			}
		});
	}
}


/* POST /member/society/members/chunk */
function postSocietyMembersChunk(req, res, next) {

	var uid = req,uid;
	var socid = req.socid;
	var recSkip = req.body.recSkip || 0;
	var search = req.body.search || '';
	var searchReg = new RegExp(search, 'g');
	var societyid = req.body.societyid;

	var params = [];
	params.push(societyid);

	if(helper.validateParams(params) == false) {
		
		res.status(400).json({
			message: 'error_invalidparams'
		});
		telkonlogger.logErr(req, res, 'Invalid parameters');

	} else {

		var roles = [
			4, 7, 8, 9
		];

		var query = {
			socid: societyid,
			role: { $in: roles },
			$or: [
				{name: { $regex: searchReg, $options: "i" }},
				{societyname: { $regex: searchReg, $options: "i" }}
			]
		};
		var projection = {
			_id: 1,
			uid: 1,
			imagedp: 1,
			name: 1,
			societyname: 1,
			city: 1
		};
		var paginate = {
			sort:
			{
				_id: -1
			},
			skip: recSkip*RECORD_LIMIT_SOCIETY_MEMBERS,
			limit: RECORD_LIMIT_SOCIETY_MEMBERS
		};

		User.find(query, projection, paginate, function(err, data) {

			if(err) {

				res.status(500).json({
					message: 'error_queryuser'
				});
				telkonlogger.logErr(req, res, err.message);

			} else {

				res.status(200).json({
					status: 'suc',
					data: data || []
				});
				telkonlogger.logSuc(req, res, 'Data sent successfully');
			}
		});
	}
}


/* POST /member/society/clubs/chunk */
function postSocietyClubsChunk(req, res, next) {

	var uid = req,uid;
	var socid = req.socid;
	var societyid = req.body.societyid;
	var recSkip = req.body.recSkip || 0;
	var search = req.body.search || '';
	var searchReg = new RegExp(search, 'g');

	var params = [];
	params.push(societyid);

	if(helper.validateParams(params) == false) {
		
		res.status(400).json({
			message: 'error_invalidparams'
		});
		telkonlogger.logErr(req, res, 'Invalid parameters');

	} else {

		var query = {
			socid: societyid,
			$or: [
				{name: { $regex: searchReg, $options: "i" }}
			]
		};
		var projection = {
			_id: 0,
			clubid: 1,
			name: 1,
			details: 1,
			imagedp: 1,
			membercount: 1,
			byname: 1,
			bysocietyname: 1,
			bylocality: 1,
			bycity: 1,
			byimagedp: 1,
			createdat: 1
		};
		var paginate = {
			sort:
			{
				_id: -1
			},
			skip: recSkip*RECORD_LIMIT_SOCIETY_CLUBS,
			limit: RECORD_LIMIT_SOCIETY_CLUBS
		};

		Club.find(query, projection, paginate, function(err, data) {

			if(err) {

				res.status(500).json({
					message: 'error_queryclub'
				});
				telkonlogger.logErr(req, res, err.message);

			} else {

				res.status(200).json({
					status: 'suc',
					data: data || []
				});
				telkonlogger.logSuc(req, res, 'Data sent successfully');
			}
		});
	}
}

/***********************************  END  ***********************************/