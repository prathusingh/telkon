/******************************************************************************
 *
 *  admin.js - data service for ADMIN
 *
 *****************************************************************************/

var mongoose = require('mongoose');
var notifier = require('./notifier');
var updator = require('../updator');
var moment = require("moment");
var helper = require('../helper.js');
var header = require('../header.js');
var mailer = require('../mailer.js');
var telkonlogger = require('../logger');

var User = require('../models/user.js');
var Society = require('../models/society.js');
var Notice = require('../models/notice.js');
var Complaint = require('../models/complaint.js');
var Classified = require('../models/classified.js');
var Contact = require('../models/contact.js');
var Poll = require('../models/poll.js');
var Notification = require('../models/notification.js');


var RECORD_LIMIT_NOTICES = header.recLimit.admin.notices;
var RECORD_LIMIT_COMPLAINTS = header.recLimit.admin.complaints;
var RECORD_LIMIT_NOTIFICATION = header.recLimit.admin.notifications;
var RECORD_LIMIT_MEMBERS = header.recLimit.admin.members;


module.exports = {

	notImplemented					: notImplemented,

	/* PROFILE */
	postProfileBoot					: postProfileBoot,
	postName 						: postName,
	postProfileData 				: postProfileData,
	postUpdateName					: postUpdateName,
	postUpdatePhone					: postUpdatePhone,
	postUpdatePosition				: postUpdatePosition,
	postUpdateDepartment			: postUpdateDepartment,
	postUpdateImageDp				: postUpdateImageDp,
	postResetPassword				: postResetPassword,
	postBecomeMember				: postBecomeMember,
	postLogout						: postLogout,
	postSuspend						: postSuspend,
	postDelete						: postDelete,
	
	/* NOTICE */
	postNotices						: postNotices,
	postNoticesChunk				: postNoticesChunk,
	postNotice						: postNotice,
	postNoticeCompose				: postNoticeCompose,
	postNoticeUpload				: postNoticeUpload,
	postNoticeRemove				: postNoticeRemove,

	/* COMPLAINT */
	postComplaints					: postComplaints,
	postComplaintsChunk				: postComplaintsChunk,
	postComplaint 					: postComplaint,
	postComplaintTimeline			: postComplaintTimeline,
	postComplaintEscalate			: postComplaintEscalate,
	postComplaintProcessing 		: postComplaintProcessing,
	postComplaintResolved			: postComplaintResolved,
	postComplaintRemove				: postComplaintRemove,
	postComplaintComment			: postComplaintComment,

	/* CLASSIFIED */
	postClassifieds   				: postClassifieds,
	postClassified 					: postClassified,

	/* CONTACT */
	postContacts					: postContacts,
	postContactsByCateogory			: postContactsByCateogory,
	postContactAddByCategory		: postContactAddByCategory,
	postContactRemove				: postContactRemove,
	postContactUpdate				: postContactUpdate,

	/* MEMBERS */
	postMembers						: postMembers,
	postMembersChunk				: postMembersChunk,
	postMember						: postMember,
	postMemberComplaints			: postMemberComplaints,
	postMemberRemove				: postMemberRemove,
	postMemberBlock 				: postMemberBlock,
	postMemberUnblock				: postMemberUnblock,
	postMemberClean					: postMemberClean,

	/* POLLS */
	postPolls						: postPolls,
	postPoll 						: postPoll,
	postPollAdd 					: postPollAdd,
	postPollRemove 					: notImplemented,

	/* SOCIETY */
	postSocietyInfo					: postSocietyInfo,
	postUpdateFlatSample			: postUpdateFlatSample,
	postUpdateLayoutFlats			: postUpdateLayoutFlats,
	postUpdateLayout				: postUpdateLayout,

	/* ADMIN */
	postAdmins						: postAdmins,
	postAdmin 						: postAdmin,
	postAdminAdd					: postAdminAdd,
	postAdminRemove					: postAdminRemove,

	/* NOTIFICATION */
	postNotifications 				: postNotifications,
	postNotificationsChunk 			: postNotificationsChunk,
	postNotificationsCleartotal		: postNotificationsCleartotal,

	/* RULES */
	postRules						: postRules,
	postRulesEdit					: postRulesEdit,

	postDual						: notImplemented
};


////////////////////

/* NOT IMPLEMENTED ROUTES */
function notImplemented(req, res, next) {
	next(new Error(
    	'Data service method for ' + req.method + ' ' + req.url+ ' is not implemented'
  	));
}


/* POST /admin/profile */
function postProfile(req, res, next) {

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

		User.findOne(query, function(err, user) {

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


/* POST /admin/profile/name */
function postName(req, res, next) {

	res.status(200).json({
		status: 'suc',
		data: req.user.name || ''
	});
	telkonlogger.logSuc(req, res, 'Data sent successfully');
}


/* POST /admin/profile/boot */
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
		data: data || []
	});
	telkonlogger.logSuc(req, res, 'Data sent successfully');
}


/* POST /admin/profile/data */
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
		data: data || []
	});
	telkonlogger.logSuc(req, res, 'Data sent successfully');
}


/* POST /admin/profile/update/name */
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

		name = helper.toTitleCase(name);
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


/* POST /admin/profile/update/phone */
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


/* POST /admin/profile/update/position */
function postUpdatePosition(req, res, next) {

	var uid = req.uid;
	var position = req.body.position;

	var params = [];
	params.push(position);

	if(helper.validateParams(params) == false) {
		
		res.status(400).json({
			message: 'error_invalidparams'
		});
		telkonlogger.logErr(req, res, 'Invalid parameters');

	} else {

		User.update({
			uid: uid
		}, {
			position: position
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


/* POST /admin/profile/update/department */
function postUpdateDepartment(req, res, next) {

	var uid = req.uid;
	var department = req.body.department;

	var params = [];
	params.push(department);

	if(helper.validateParams(params) == false) {
		
		res.status(400).json({
			message: 'error_invalidparams'
		});
		telkonlogger.logErr(req, res, 'Invalid parameters');

	} else {

		User.update({
			uid: uid
		}, {
			department: department
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
					message: 'error'
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


/* POST /admin/profile/reset/password */
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

		User.findOne({uid: uid}, {_id:1, password:1}, function(err, user){
			
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


/* POST /admin/profile/becomemember */
function postBecomeMember(req, res, next) {

	var uid = req.uid;
	var flat = req.body.flat;
	var residencetype = req.body.residencetype;

	var params = [];
	params.push(flat);
	params.push(residencetype);

	if(helper.validateParams(params) == false) {
		
		res.status(400).json({
			message: 'error_invalidparams'
		});
		telkonlogger.logErr(req, res, 'Invalid parameters');

	} else {

		var role = req.user.role;

		if(role == 4 || role == 7 || role == 8) {

			/* User is a already a member*/
			res.status(403).json({
				message: 'error_fatal'
			});
			telkonlogger.logFatal(req, res, 'Already a member');

		} else if(role != 5 && role != 6) {

			/* Only ADMIN can raise such a request */
			res.status(403).json({
				message: 'error_fatal'
			});
			telkonlogger.logFatal(req, res, 'Not an admin');

		} else {

			var newRole;
			flat = flat.replace(/[\. !@#$%^&*()<>?{}+,:-]+/g, "");
			flat = flat.toUpperCase();

			if(role == 5) newRole = 7;
			else if(role == 6) newRole = 8;

			User.update({
				uid: uid
			}, {
				flat: flat,
				residencetype: residencetype,
				role: newRole,
				membersince: moment()
			}, function(err){
				if(err) {

					res.status(500).json({
						message: 'error_updateuser'
					});
					telkonlogger.logErr(req, res, err.message);

				} else {

					res.status(200).json({
						status: 'suc',
						message: 'becamemember'
					});
					telkonlogger.logSuc(req, res, 'Updated successfully');
				}
			});
		}
	}
}

// TODO: Add hasExpired: Boolean in Notice Model and send it in this call
/* POST /admin/notices */
function postNotices(req, res, next) {

	var uid = req.uid;
	var socid = req.socid;
	var search = req.body.search || '';
	var searchReg = new RegExp(search, 'g');

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
		contenturl: 1,
		meantfor: 1,
		createdat: 1,
		todate: 1
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

			res.status(200).json({
				status: 'suc',
				data: data || []
			});
			telkonlogger.logSuc(req, res, 'Data sent successfully');
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
		contenturl: 1,
		meantfor: 1,
		createdat: 1,
		todate: 1
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


/* POST /admin/notice */
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
			socid: socid,
			isactive: true
		};
		var projection = {
			_id: 0,
			nid: 1,
			socid: 1,
			title: 1,
			desc: 1,
			contenturl: 1,
			createdat: 1,
			meantfor: 1,
			byname: 1,
			byposition: 1,
			bydepartment: 1,
			bysocietyname: 1,
			expiry: 1
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


/* POST /admin/notice/compose */
function postNoticeCompose(req, res, next) {

	var uid = req.uid;
	var socid = req.socid;

	var title = req.body.title;
	var desc = req.body.desc;
	var validfor = req.body.validfor;
	var meantfor = req.body.meantfor;

	var params = [];
	params.push(title);
	params.push(desc);
	params.push(validfor);
	params.push(meantfor);

	if(helper.validateParams(params) == false) {
		
		res.status(400).json({
			message: 'error_invalidparams'
		});
		telkonlogger.logErr(req, res, 'Invalid parameters');

	} else {

		title = helper.capitalizeFirstLetter(title.trim());
		desc = helper.capitalizeFirstLetter(desc.trim());
		if(validfor == 0) {
			validfor = 365;
		}
		var user = req.user;
		newNotice = {};
		newNotice._id = new mongoose.Types.ObjectId;
		newNotice.title = title;
		newNotice.desc = desc;
		newNotice.validfor = validfor;
		newNotice.meantfor = meantfor;
		newNotice.byname = user.name;
		newNotice.byemail = user.email;
		newNotice.byposition = user.position;
		newNotice.bydepartment = user.department;
		newNotice.bysocietyname = user.societyname;
		newNotice.uid = req.uid;
		newNotice.socid = req.socid;
		var date = moment();
  		newNotice.createdat = date;
  		newNotice.expiry = moment(date).add(validfor, 'days');
		newNotice.contentshort = desc;

		helper.generateNid(function(nid) {

  			if(!nid) {

  				res.status(500).json({
					message: 'error_createnid'
				});
				telkonlogger.logErr(req, res, 'Unable to create new NID');

  			} else {

  				newNotice.nid = nid;
  				new Notice(newNotice).save(function(err) {

					if(err) {

						res.status(500).json({
							message: 'error_newnotice'
						});
						telkonlogger.logErr(req, res, err.message);

					} else {

						notifier.noticeAdded(newNotice);
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


/* POST /admin/notice/upload */
function postNoticeUpload(req, res, next) {

	var data = req.body.data;
	data = JSON.parse(data);
	var title = data.title;
	var desc = data.desc;
	var validfor = data.validfor;
	var meantfor = data.meantfor;


	var params = [];
	params.push(title);
	params.push(desc);
	params.push(validfor);
	params.push(meantfor);

	if(helper.validateParams(params) == false) {
		
		res.status(400).json({
			message: 'error_invalidparams'
		});
		telkonlogger.logErr(req, res, 'Invalid parameters');

	} else {

		if(!req.files || !req.files.file) {

			res.status(400).json({
				message: 'error_invalidfile'
			});
			telkonlogger.logErr(req, res, 'Invalid file');

		} else {

			title = helper.capitalizeFirstLetter(title.trim());
			desc = helper.capitalizeFirstLetter(desc.trim());
			if(validfor == 0) {
				validfor = 365;
			}
			var user = req.user;
			var filepath = req.files.file.path;
			newNotice = {};
			newNotice._id = new mongoose.Types.ObjectId;
			newNotice.title = title;
			newNotice.desc = desc;
			newNotice.validfor = validfor;
			newNotice.meantfor = meantfor;
			if(filepath) filepath = filepath.replace(/\\/g, '/');
			newNotice.contenturl = filepath.substring(filepath.indexOf('public/') + 6);
			newNotice.byname = user.name;
			newNotice.byemail = user.email;
			newNotice.byposition = user.position;
			newNotice.bydepartment = user.department;
			newNotice.bysocietyname = user.societyname;
			newNotice.uid = req.uid;
			newNotice.socid = req.socid;

			var date = moment();
	  		newNotice.createdat = date;
	  		newNotice.expiry = moment(date).add(validfor, 'days');
			newNotice.contentshort = desc;

			helper.generateNid(function(nid) {

	  			if(!nid) {

	  				res.status(500).json({
						message: 'error_createnid'
					});
					telkonlogger.logErr(req, res, 'Unable to create new NID');

	  			} else {

	  				newNotice.nid = nid;
	  				new Notice(newNotice).save(function(err) {

						if(err) {

							res.status(500).json({
								message: 'error_newnotice'
							});
							telkonlogger.logErr(req, res, err.message);

						} else {

							notifier.noticeAdded(newNotice);
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
}


/* POST /admin/notice/remove */
function postNoticeRemove(req, res, next) {

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

		var query = {nid: nid, socid: socid};

		Notice.findOne(query, function(err, notice) {

			if(err) {

				res.status(500).json({
					message: 'error_querynotice'
				});
				telkonlogger.logErr(req, res, err.message);

			} else {

				notice.remove(function(err) {

					if(err) {

						res.status(500).json({
							message: 'error_rmemovenotice'
						});
						telkonlogger.logErr(req, res, err.message);

					} else {

						notifier.noticeRemoved(nid, socid, notice.meantfor);
						res.status(200).json({
							status: 'suc',
							message: 'removed'
						});
						telkonlogger.logSuc(req, res, 'Removed successfully');
					}
				});			
			}
		});
	}
}


/* POST /admin/complaints */
function postComplaints(req, res, next) {

	var socid = req.socid;
	var search = req.body.search || '';
	var searchReg = new RegExp(search, 'g');

	var query = {
		socid: socid,
		$or: [
			{byflat: { $regex: searchReg, $options: "i" }},
			{subject: { $regex: searchReg, $options: "i" }}
		],
		isremovedbyadmin: false
	};
	var projection = {
		_id: 0,
		compid: 1,
		category: 1,
		subject: 1,
		byflat: 1,
		currentstatus: 1,
		isescalated: 1,
		isescalationreq: 1,
		createdat: 1
	};
	var paginate = {
		sort:
		{
			_id: -1
		},
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


/* POST /admin/complaints/chunk */
function postComplaintsChunk(req, res, next) {

	var socid = req.socid;
	var recSkip = req.body.recSkip || 0;
	var search = req.body.search || '';
	var searchReg = new RegExp(search, 'g');

	var query = {
		socid: socid,
		$or: [
			{byflat: { $regex: searchReg, $options: "i" }},
			{subject: { $regex: searchReg, $options: "i" }}
		],
		isremovedbyadmin: false
	};
	var projection = {
		_id: 0,
		compid: 1,
		category: 1,
		subject: 1,
		byflat: 1,
		currentstatus: 1,
		isescalated: 1,
		isescalationreq: 1,
		createdat: 1
	};
	var paginate = {
		sort:
		{
			_id: -1
		},
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


/* POST /admin/complaint */
function postComplaint(req, res, next) {

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
			isescalated: 1,
			isresolved: 1,
			isremovedbymember: 1,
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
					data: timeline || []
				});
				telkonlogger.logSuc(req, res, 'Data sent successfully');
			}
		});
	}		
}


/* POST /admin/complaint/escalate */
function postComplaintEscalate(req, res, next) {

	var uid = req.uid;
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

					if(complaint.isescalated ||
						complaint.currentstatus === 'Resolved' ||
						complaint.currentstatus === 'Escalated') {

						res.status(403).json({
							message: 'error_fatal'
						});
						telkonlogger.logFatal(req, res, 'Already escalated/removed');

					} else {

						var d = new Date();
						var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

						var timelineObj = {};
						//timelineObj.date = d;
						timelineObj.day = days[d.getDay()];
						timelineObj.complaintstatus = "Escalated";
						timelineObj.comments = "The complaint has been escalated.";
						
						complaint.currentstatus = "Escalated";
						complaint.timeline.push(timelineObj);
						complaint.isescalated = true;
						complaint.escalatedby = uid;

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


/* POST /admin/complaint/processing */
function postComplaintProcessing(req, res, next) {

	var uid = req.uid;
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

					if(complaint.currentstatus === 'Resolved' ||
						complaint.currentstatus === 'Processing') {

						res.status(403).json({
							message: 'error_fatal'
						});
						telkonlogger.logFatal(req, res, 'Already resolved/processing');

					} else {

						var d = new Date();
						var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

						var timelineObj = {};
						//timelineObj.date = d;
						timelineObj.day = days[d.getDay()];
						timelineObj.complaintstatus = "Processing";
						timelineObj.comments = "We are processing the complaint from our end.";
						
						complaint.currentstatus = "Processing";
						complaint.timeline.push(timelineObj);
						complaint.escalatedby = uid;

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
									message: 'processing'
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


/* POST /admin/complaint/resolved */
function postComplaintResolved(req, res, next) {

	var uid = req.uid;
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

					if(complaint.currentstatus === 'Resolved') {

						res.status(403).json({
							message: 'error_fatal'
						});
						telkonlogger.logFatal(req, res, 'Already resolved');

					} else {

						var d = new Date();
						var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

						var timelineObj = {};
						//timelineObj.date = d;
						timelineObj.day = days[d.getDay()];
						timelineObj.complaintstatus = "Resolved";
						timelineObj.comments = "The complaint has been resolved.";
						
						complaint.currentstatus = "Resolved";
						complaint.isresolved = true;
						complaint.timeline.push(timelineObj);

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
									message: 'resolved'
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


/* POST /admin/complaint/remove */
function postComplaintRemove(req, res, next) {

	var uid = req.uid;
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

					res.status(500).json({
						message: 'error_fatal'
					});
					telkonlogger.logFatal(req, res, 'Not present in db');

				} else {

					if(complaint.isremovedbyadmin) {

						res.status(403).json({
							message: 'error_fatal'
						});
						telkonlogger.logFatal(req, res, 'Already removed by admin');

					} else {

						var d = new Date();
						var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

						timelineObj = {};
						timelineObj.day = days[d.getDay()];
						timelineObj.complaintstatus = "Removed by Admin";
						timelineObj.comments = "This complaint has been removed by the admin.";

						complaint.timeline.push(timelineObj);

						complaint.currentstatus = "Removed by Admin";
						complaint.isremovedbyadmin = true;
						complaint.removedbyadmin = uid;
						if(complaint.isremovedbymember) {
							
							complaint.remove(function(err) {

								if(err) {

									res.status(500).json({
										message: 'error_removecomplaint'
									});
									telkonlogger.logErr(req, res, err.message);

								} else {

									notifier.complaintRemovedByAdmin(complaint);
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

									notifier.complaintRemovedByAdmin(complaint);
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


/* POST /admin/complaint/comment */
function postComplaintComment(req, res, next) {

	var uid = req.uid;
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

					if(complaint.currentstatus === 'Resolved' || 
						complaint.isremovedbymember ||
						complaint.isremovedbyadmin) {

						res.status(403).json({
							message: 'error_fatal'
						});
						telkonlogger.logFatal(req, res, 'Already resolved/removed');

					} else {

						var d = new Date();
						var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
						var timelineObj = {};
						timelineObj.complaintstatus = 'Admin Commented';
						timelineObj.day = days[d.getDay()];
						timelineObj.comments = helper.capitalizeFirstLetter(comments);

						complaint.timeline.push(timelineObj);
						complaint.currentstatus = 'Admin Commented';
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


/* POST /admin/classifieds */
function postClassifieds(req, res, next) {

	var uid = req.uid;
	var socid = req.socid;

	var query = {
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


/* POST /admin/classified */
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

		var query = {
			socid: socid,
			cid: cid
		};
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
			bysocietyname: 1
		};

		Classified.findOne(query, projection, function(err, data) {

			if(err) {

				res.status(500).json({
					message: 'error'
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


/* POST /admin/contacts */
function postContacts(req, res, next) {

	var socid = req.socid;

	var query = {socid: socid, isactive: true};
	var projection = {};
	var paginate = {
		sort: {_id: -1}
	}

	Contact.find(query, projection, sort, function(err, data) {

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


/* POST /admin/contacts/category */
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

		var query = {
			socid: socid,
			category: category,
			isactive: true
		};
		var projection = {
			name: 1,
			email: 1,
			phone: 1,
			servicetype: 1,
			contactid: 1,
			location: 1,
			position: 1,
			flat: 1
		};
		var paginate = {
			sort: {_id: -1}
		}

		if(category != 1) {
			paginate = {
				sort: {name: 1, location: 1}
			}
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


/* POST /admin/contact/add */
function postContactAddByCategory(req, res, next) {

	var uid = req.uid;
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

		if(category == 1) {

			var servicetype = req.body.servicetype;
			var name = req.body.name;
			var phone = req.body.phone;

			params = [];
			params.push(servicetype);
			params.push(name);
			params.push(phone);

			if(helper.validateParams(params) == false) {
				
				res.status(400).json({
					message: 'error_invalidparams'
				});
				telkonlogger.logErr(req, res, 'Invalid parameters');

			} else {

				var newContact = {};
				newContact._id = new mongoose.Types.ObjectId;
				newContact.servicetype = servicetype;
				newContact.name = helper.toTitleCase(name.trim());
				newContact.phone = phone;
				newContact.uid = uid;
				newContact.socid = socid;
				newContact.category = category;
				if(req.body.email) {
					newContact.email = req.body.email;
				}
				var date = moment();
		  		newContact.createdat = date;
		  		newContact.updatedon = date;

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

						newContact.pincode = society.pincode;

						helper.generateContactid(function(contactid) {

							if(!contactid) {

								res.status(500).json({
									message: 'error_createcontactid'
								});
								telkonlogger.logErr(req, res, 'Unable to create new CONTACTID');

							} else {

								newContact.contactid = contactid;

								new Contact(newContact).save(function(err) {

									if(err) {

										res.status(500).json({
											message: 'error_savecontact'
										});
										telkonlogger.logErr(req, res, err.message);

									} else {

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
				});

			}

		} else if(category == 3) {
			
			var position = req.body.position;
			var name = req.body.name;
			var phone = req.body.phone;

			params = [];
			params.push(position);
			params.push(name);
			params.push(phone);

			if(helper.validateParams(params) == false) {
				
				res.status(400).json({
					message: 'error_invalidparams'
				});
				telkonlogger.logErr(req, res, 'Invalid parameters');

			} else {

				var newContact = {};
				newContact._id = new mongoose.Types.ObjectId;
				newContact.position = position;
				newContact.name = helper.toTitleCase(name);
				newContact.phone = phone;
				newContact.uid = uid;
				newContact.socid = socid;
				newContact.category = category;
				if(req.body.email) {
					newContact.email = req.body.email;
				}
				if(req.body.flat) {
					newContact.flat = req.body.flat;
				}
				var date = moment();
		  		newContact.createdat = date;
		  		newContact.updatedon = date;

				helper.generateContactid(function(contactid) {

					if(!contactid) {

						res.status(500).json({
							message: 'error_createcontactid'
						});
						telkonlogger.logErr(req, res, 'Unable to create new CONTACTID');

					} else {

						newContact.contactid = contactid;

						new Contact(newContact).save(function(err) {

							if(err) {

								res.status(500).json({
									status: 'suc',
									message: 'error_savecontact'
								});
								telkonlogger.logErr(req, res, err.message);

							} else {

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

		} else if(category == 4) {
			
			var location = req.body.location;
			var phone = req.body.phone;

			params = [];
			params.push(location);
			params.push(phone);

			if(helper.validateParams(params) == false) {
				
				res.status(400).json({
					message: 'error_invalidparams'
				});
				telkonlogger.logErr(req, res, 'Invalid parameters');

			} else {

				var newContact = {};
				newContact._id = new mongoose.Types.ObjectId;
				newContact.location = location;
				newContact.phone = phone;
				newContact.uid = uid;
				newContact.socid = socid;
				newContact.category = category;
				var date = moment();
		  		newContact.createdat = date;
		  		newContact.updatedon = date;

				helper.generateContactid(function(contactid) {

					if(!contactid) {

						res.status(500).json({
							message: 'error_createcontactid'
						});
						telkonlogger.logErr(req, res, 'Unable to create new CONTACTID');

					} else {

						newContact.contactid = contactid;

						new Contact(newContact).save(function(err) {

							if(err) {

								res.status(500).json({
									message: 'error_savecontact'
								});
								telkonlogger.logErr(req, res, err.message);

							} else {

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

		} else {
			
			res.status(200).json({
				status:  'suc',
				message: 'error_invalidcategory'
			});
			telkonlogger.logFatal(req, res, 'Invalid category');

		}
	}
}


/* POST /admin/contact/remove */
function postContactRemove(req, res, next) {

	var socid = req.socid;

	var contactid = req.body.contactid;
	var category = req.body.category;

	var params = [];
	params.push(contactid);
	params.push(category);

	if(helper.validateParams(params) == false) {
		
		res.status(400).json({
			message: 'error_invalidparams'
		});
		telkonlogger.logErr(req, res, 'Invalid parameters');

	} else {

		var query = {
			contactid: contactid,
			socid: socid,
			isactive: true
		}

		Contact.findOneAndRemove(query, function(err) {
			
			if(err) {

				res.status(500).json({
					message: 'error_removecontact'
				});
				telkonlogger.logErr(req, res, err.message);

			} else {

				res.status(200).json({
					status: 'suc',
					message: 'removed'
				});
				telkonlogger.logSuc(req, res, 'Removed successfully');
			}
		});
	}
}


/* POST /admin/contact/update */
function postContactUpdate(req, res, next) {

	var socid = req.socid;

	var contactid = req.body.contactid;
	var category = req.body.category;

	var params = [];
	params.push(contactid);
	params.push(category);

	if(helper.validateParams(params) == false) {
		
		res.status(400).json({
			message: 'error_invalidparams'
		});
		telkonlogger.logErr(req, res, 'Invalid parameters');

	} else {

		var query = {
			contactid: contactid,
			socid: socid,
			category: category,
			isactive: true
		}

		var newData = {};

		var name = req.body.name;
		if(name) newData.name = helper.toTitleCase(name);
		if(req.body.phone) newData.phone = req.body.phone;
		if(req.body.servicetype) newData.servicetype = req.body.servicetype;
		if(req.body.email) newData.email = req.body.email;
		if(req.body.position) newData.position = req.body.position;
		if(req.body.location) newData.location = req.body.location;
		if(req.body.flat) newData.flat = req.body.flat;
		
		newData.updatedon = moment();
		
		Contact.update(query, newData, function(err){
			if(err) {

				res.status(500).json({
					message: 'error_updatecontact'
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


/* POST /admin/members */
function postMembers(req, res, next) {

	var uid = req.uid;
	var socid = req.socid;
	var search = req.body.search || '';
	var searchReg = new RegExp(search, 'g');

	var roles = [
		4, 7, 8, 9
	]
	var query = {
		role: { $in: roles },
		socid: socid,
		$or: [
			{email: { $regex: searchReg, $options: "i" }},
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
		membersince: 1,
		createdat: 1
	};
	var paginate = {
		sort:
		{
			_id: -1
		},
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


/* POST /admin/members/chunk */
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
			{email: { $regex: searchReg, $options: "i" }},
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
		membersince: 1,
		createdat: 1
	};
	var paginate = {
		sort:
		{
			_id: -1
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
				data: data || {}
			});
			telkonlogger.logSuc(req, res, 'Data sent successfully');
		}
	});
}


/* POST /admin/member */
function postMember(req, res, next) {

	var uid = req.uid;
	var socid = req.socid;
	var memberuid = req.body.memberuid;

	var params = [];
	params.push(memberuid);

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
			uid: memberuid,
			role: {$in: roles},
			socid: socid,
			isactive: true
		};
		var projection = {
			_id: 0,
			uid: 1,
			flat: 1,
			name: 1,
			role: 1,
			residencetype: 1,
			email: 1,
			isblocked: 1,
			isreported: 1,
			reportedby: 1,
			phone: 1,
			membersince: 1,
			imagedp: 1,
			createdat: 1
		};

		User.findOne(query, projection, function(err, user) {

			if(err) {

				res.status(500).json({
					message: 'error_queryuser'
				});
				telkonlogger.logErr(req, res, err.message);

			} else {

				if(user) {

					if(user.isreported) {

						query = {
							uid: {
								$in: user.reportedby
							},
							isactive: 1
						}
						projection = {
							uid: 1,
							name: 1,
							flat: 1,
							email: 1,
							imagedp: 1,
							phone: 1
						}

						User.find(query, projection, function(err, members) {

							if(err) {

								res.status(500).json({
									message: 'error_queryuser'
								});
								telkonlogger.logErr(req, res, err.message);

							} else {

								res.status(200).json({
									status: 'suc',
									data: {
										member: user || {},
										reportedby: members || []
									}
								});
								telkonlogger.logSuc(req, res, 'Data sent successfully');
							}
						});

					} else {

						res.status(200).json({
							status: 'suc',
							data: {
								member: user || {},
								reportedby: []
							}
						});
						telkonlogger.logSuc(req, res, 'Data sent successfully');

					}

	
				} else {

					res.status(200).json({
						status: 'suc',
						data: {
							member: [],
							reportedby: []
						}
					});
					telkonlogger.logSuc(req, res, 'Data sent successfully');
				}
			}
		});
	}
}


/* POST /admin/member/complaints */
function postMemberComplaints(req, res, next) {

	var uid = req.uid;
	var socid = req.socid;
	var flat = req.body.flat;

	var params = [];
	params.push(flat);

	if(helper.validateParams(params) == false) {
		
		res.status(400).json({
			message: 'error_invalidparams'
		});
		telkonlogger.logErr(req, res, 'Invalid parameters');

	} else {

		flat = flat.toUpperCase();

		var query = {
			byflat: flat,
			socid: socid,
			isremovedbyadmin: false,
			isactive: true
		};
		var projection = {
			_id: 0,
			compid: 1,
			category: 1,
			subject: 1,
			desc: 1,
			currentstatus: 1,
			isescalationreq: 1,
			isescalated: 1,
			isremovedbymember: 1,
			isresolved: 1,
			timeline: 1,
			createdat: 1
		};
		var sort = {sort:{_id:-1}};


		Complaint.find(query, projection, sort, function(err, data) {

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
}


/* POST /admin/member/remove */
function postMemberRemove(req, res, next) {

	var uid = req.uid;
	var socid = req.socid;
	var myrole = req.user.role;
	var memberuid = req.body.memberuid;

	var params = [];
	params.push(memberuid);

	if(helper.validateParams(params) == false) {

		res.status(400).json({
			message: 'error_invalidparams'
		});
		telkonlogger.logErr(req, res, 'Invalid parameters');

	} else {

		/* Only a SUPERADMIN can remove a member */
		if(myrole == 6 || myrole == 8) {

			if(memberuid === uid) {

				res.status(200).json({
					status: 'suc',
					message: 'error_self'
				});
				telkonlogger.logSuc(req, res, 'Cannot remove self');

			} else {

				var roles = [
					4, 7, 8, 9
				];
				var query = {
					uid: memberuid,
					role: { $in: roles },
					isremoved: false,
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

						params = [];
						params.push(user);

						if(helper.validateParams(params) == false) {

							res.status(403).json({
								message: 'error_fatal'
							});
							telkonlogger.logFatal(req, res, 'Not present in db');

						} else {

							user.isremoved = true;

							if(typeof user.removedfrom === 'undefined' ||
								user.removedfrom === null ||
								user.removedfrom === []) {

								user.removedfrom = [];
							}
							user.removedfrom.push(socid);
							
							if(typeof user.removenum !== 'undefined') {
								user.removenum += 1;
							} else {
								user.removenum = 1;
							}

							user.save(function(err) {

								if(err) {

									res.status(500).json({
										message: 'error_queryuser'
									});
									telkonlogger.logErr(req, res, err.message);

								} else {

									notifier.memberRemovedByAdmin(memberuid, socid);
									res.status(200).json({
										status: 'suc',
										message: 'removed'
									});
									telkonlogger.logSuc(req, res, 'Removed successfully');
								}
							});
						}
					}
				});
			}

		} else {

			res.status(200).json({
				status: 'suc',
				message: 'error_denied'
			});
			telkonlogger.logSuc(req, res, 'Permission denied');
		}
	}
}


/* POST /admin/member/block */
function postMemberBlock(req, res, next) {

	var uid = req.uid;
	var socid = req.socid;
	var memberuid = req.body.memberuid;

	var params = [];
	params.push(memberuid);

	if(helper.validateParams(params) == false) {

		res.status(400).json({
			message: 'error_invalidparams'
		});
		telkonlogger.logErr(req, res, 'Invalid parameters');

	} else {

		if(uid === memberuid) {

			/* Admin cannot block itself */
			res.status(200).json({
				status: 'suc',
				message: 'error_self'
			});
			telkonlogger.logSuc(req, res, 'Cannot block self');

		} else {

			var roles = [
				4, 7, 8
			];
			var query = {
				uid: memberuid,
				role: { $in: roles },
				isblocked: false,
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

					if(typeof user === 'undefined' ||
						user === null ||
						user === {}) {

						res.status(403).json({
							message: 'error_fatal'
						});
						telkonlogger.logFatal(req, res, 'Not present in db');

					} else {

						user.isblocked = true;
						user.role = 9;
						user.blockedby = uid;

						user.save(function(err) {

							if(err) {

								res.status(500).json({
									message: 'error_saveuser'
								});
								telkonlogger.logErr(req, res, err.message);

							} else {

								notifier.memberBlockedByAdmin(memberuid, socid);
								res.status(200).json({
									status: 'suc',
									message: 'blocked'
								});
								telkonlogger.logSuc(req, res, 'Blocked successfully');
							}
						});
					}
				}
			});
		}
	}
}


/* POST /admin/member/unblock */
function postMemberUnblock(req, res, next) {

	var uid = req.uid;
	var socid = req.socid;
	var memberuid = req.body.memberuid;

	var params = [];
	params.push(memberuid);

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
			uid: memberuid,
			role: { $in: roles },
			isblocked: true,
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

				if(typeof user === 'undefined' ||
					user === null ||
					user === {}) {

					res.status(403).json({
						message: 'error_fatal'
					});
					telkonlogger.logFatal(req, res, 'Not present in db');

				} else {

					user.isblocked = false;
					user.role = 4;
					user.save(function(err) {

						if(err) {

							res.status(500).json({
								message: 'error_saveuser'
							});
							telkonlogger.logErr(req, res, err.message);

						} else {

							notifier.memberUnblockedByAdmin(memberuid, socid, user.flat);
							res.status(200).json({
								status: 'suc',
								message: 'unblocked'
							});
							telkonlogger.logSuc(req, res, 'Unblocked successfully');
						}
					});
				}
			}
		});
	}
}


/* POST /admin/member/clean */
function postMemberClean(req, res, next) {

	var uid = req.uid;
	var socid = req.socid;
	var memberuid = req.body.memberuid;

	var params = [];
	params.push(memberuid);

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
			uid: memberuid,
			role: { $in: roles },
			isreported: true,
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

				if(typeof user === 'undefined' ||
					user === null ||
					user === {}) {

					res.status(403).json({
						message: 'error_fatal'
					});
					telkonlogger.logFatal(req, res, 'Not present in db');

				} else {

					user.isreported = false;
					user.reportedby = [];
					user.save(function(err) {

						if(err) {

							res.status(500).json({
								message: 'error_saveuser'
							});
							telkonlogger.logErr(req, res, err.message);

						} else {

							notifier.memberCleanedByAdmin(memberuid, socid, user.flat);
							res.status(200).json({
								status: 'suc',
								message: 'cleaned'
							});
							telkonlogger.logSuc(req, res, 'Cleaned successfully');
						}
					});
				}
			}
		});
	}
}


/* POST /admin/polls */
function postPolls(req, res, next) {

	var uid = req.uid;
	var socid = req.socid;

	var query = {
		socid: socid,
		isactive: true
	};
	var projection = {
		_id: 0,
		pollid: 1,
		uid: 1,
		title: 1,
		desc: 1,
		category: 1,
		meantfor: 1,
		iscompleted: 1,
		createdat: 1,
		expiry: 1
	};
	var sort = {sort:{_id:-1}};

	Poll.find(query, {}, sort, function(err, data) {

		if(err) {

			res.status(500).json({
				message: 'error_querypoll'
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


/* POST /admin/poll */
function postPoll(req, res, next) {

	var uid = req.uid;
	var socid = req.socid;
	var pollid = req.body.pollid;

	var params = [];
	params.push(pollid);

	if(helper.validateParams(params) == false) {
		
		res.status(400).json({
			message: 'error_invalidparams'
		});
		telkonlogger.logErr(req, res, 'Invalid parameters');

	} else {

		var query = {
			pollid: pollid,
			socid: socid,
			isactive: true
		};
		var projection = {
			pollid: 1,
			title: 1,
			desc: 1,
			items: 1,
			expiry: 1,
			meantfor: 1,
			iscompleted: 1,
			validfor: 1,
			createdat: 1
			
		};

		Poll.findOne(query, projection, function(err, polls) {

			if(err) {

				res.status(500).json({
					message: 'error_querypoll'
				});
				telkonlogger.logErr(req, res, err.message);

			} else {

				query = {
					socid: socid
				};
				projection = {
					totalmembers: 1,
					totalowners: 1,
					totaltenants: 1
				};

				Society.findOne(query, projection, function(err, society) {

					if(err) {

						res.status(500).json({
							status: 'suc',
							message: 'error_querysociety'
						});
						telkonlogger.logErr(req, res, err.message);

					} else {

						var data = {polls: polls, society: society};
						res.status(200).json({
							status: 'suc',
							data: data
						});
						telkonlogger.logSuc(req, res, 'Data sent successfully');
					}
				});
			}
		});
	}
}


/* POST /admin/poll/create */
function postPollAdd(req, res, next) {

	var uid = req.uid;
	var socid = req.socid;

	var title = req.body.title;
	var desc = req.body.desc;
	var validfor = req.body.validfor;
	var meantfor = req.body.meantfor;
	var items = req.body.items;

	var params = [];
	params.push(title);
	params.push(desc);
	params.push(validfor);
	params.push(meantfor);
	params.push(items);

	if(helper.validateParams(params) == false) {
		
		res.status(400).json({
			message: 'error_invalidparams'
		});
		telkonlogger.logErr(req, res, 'Invalid parameters');

	} else {

		title = helper.capitalizeFirstLetter(title);
		desc = helper.capitalizeFirstLetter(desc);
		if(validfor == 0) {
			validfor = 365;
		}


		//items = JSON.parse(items);

		var user = req.user;
		newPoll = {};
		newPoll._id = new mongoose.Types.ObjectId;
		newPoll.pollid = helper.generatePollid();
		newPoll.uid = req.uid;
		newPoll.socid = req.socid;
		newPoll.title = title;
		newPoll.desc = desc;
		newPoll.items = items;
		newPoll.validfor = validfor;
		newPoll.meantfor = meantfor;
		newPoll.byname = user.name;
		newPoll.byphone = user.phone;
		newPoll.byemail = user.email;
		newPoll.byposition = user.position;
		newPoll.bydepartment = user.department;
		newPoll.bysocietyname = user.societyname;

		var date = moment();
  		newPoll.createdat = date;
  		newPoll.expiry = moment(date).add(validfor, 'days');

		new Poll(newPoll).save(function(err) {

			if(err) {

				telkonlogger.logErr(req, res, err.message);
				res.status(500).json({
					message: 'error_newpoll'
				});

			} else {

				// NOTIFIER()
				res.status(200).json({
					status: 'suc',
					message: 'added'
				});
				telkonlogger.logSuc(req, res, 'Added successfully');
			}
		});

	}
}


/* POST /admin/society/info */
function postSocietyInfo(req, res, next) {

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


/* POST /admin/society/update/flatsample */
function postUpdateFlatSample(req, res, next) {

	var uid = req.uid;
	var socid = req.socid;
	var flatsample = req.body.flatsample;

	var params = [];
	params.push(flatsample);

	if(helper.validateParams(params) == false) {
		
		res.status(400).json({
			message: 'error_invalidparams'
		});
		telkonlogger.logErr(req, res, 'Invalid parameters');

	} else {

		flatsample = flatsample.replace(/[\. !@#$%^&*()<>?{}+,:-]+/g, "");
		flatsample = flatsample.toUpperCase();

		Society.update({
			socid: socid
		}, {
			flatsample: flatsample
		}, function(err){

			if(err) {

				res.status(500).json({
					message: 'error_updatesociety'
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


/* POST /admin/society/update/layoutflats */
function postUpdateLayoutFlats(req, res, next) {

	var uid = req.uid;
	var socid = req.socid;
	var layoutflats = req.body.layoutflats;

	var params = [];
	params.push(layoutflats);

	if(helper.validateParams(params) == false) {
		
		res.status(400).json({
			message: 'error_invalidparams'
		});
		telkonlogger.logErr(req, res, 'Invalid parameters');

	} else {

		Society.update({
			socid: socid
		}, {
			layoutflats: layoutflats
		}, function(err){

			if(err) {

				res.status(500).json({
					message: 'error_querysociety'
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


/* POST /admin/society/update/layout */
function postUpdateLayout(req, res, next) {

	var uid = req.uid;
	var socid = req.socid;
	var layoutphase = req.body.layoutphase;
	var layouttower = req.body.layouttower;
	var layoutblock = req.body.layoutblock;
	var layoutflats = req.body.layoutflats;

	Society.update({
		socid: socid
	}, {
		layoutphase: layoutphase || 0,
		layouttower: layouttower || 0,
		layoutblock: layoutblock || 0,
		layoutflats: layoutflats || 0

	}, function(err){

		if(err) {

			res.status(500).json({
				message: 'error_updatesociety'
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


/* POST /admin/admins */
function postAdmins(req, res, next) {

	var uid = req.uid;
	var socid = req.socid;

	var roles = [
		5, 6, 7, 8
	];
	var query = {
		role: { $in: roles },
		socid: socid,
		isactive: true
	};
	var projection = {
		_id: 0,
		uid: 1,
		role: 1,
		flat: 1,
		name: 1,
		email: 1,
		phone: 1,
		adminsince: 1,
		createdat: 1
	};
	var sort = {sort:{_id:-1}};

	User.find(query, projection, sort, function(err, data) {

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


/* POST /admin/admin */
function postAdmin(req, res, next) {

	var uid = req.uid;
	var socid = req.socid;
	var adminuid = req.body.adminuid;

	var params = [];
	params.push(adminuid);

	if(helper.validateParams(params) == false) {
		
		res.status(400).json({
			message: 'error_invalidparams'
		});

	} else {

		var query = {
			uid: adminuid,
			socid: socid,
			isactive: true
		};
		var projection = {
			_id: 0,
			uid: 1,
			name: 1,
			role: 1,
			email: 1,
			phone: 1,
			adminsince: 1,
			imagedp: 1,
			createdat: 1
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
					data: user || {}
				});
				telkonlogger.logSuc(req, res, 'Data sent successfully');
			}
		});
	}
}


/* POST /admin/admin/add */
function postAdminAdd(req, res, next) {

	var uid = req.uid;
	var socid = req.socid;
	var myrole = req.user.role;
	var email = req.body.email;
	var role = req.body.role;

	var params = [];
	params.push(email);
	params.push(role);

	if(helper.validateParams(params) == false) {
		
		res.status(400).json({
			message: 'error_invalidparams'
		});
		telkonlogger.logErr(req, res, 'Invalid parameters');

	} else {

		if(helper.validateEmail(email) == false) {

			res.status(200).json({
				status: 'suc',
				message: 'error_invalidemail'
			});
			telkonlogger.logWarn(req, res, 'Invalid email');

		} else {

			/* Only a SUPERADMIN can add an admin */
			if(myrole == 6 || myrole == 8) {

				var query = {
					email: email,
					isactive: true
				};

				User.findOne(query, function(err, user) {

					if(err) {

						res.status(500).json({
							message: 'error_queryuser'
						});
						telkonlogger.logErr(req, res, err.message);

					} else {

						if(user) {

							var userrole = user.role;

							if(userrole == 1 || userrole == 2 || userrole == 3) {

								user.role = role;
								user.adminsince = moment();
								user.socid = req.user.socid;
								user.societyname = req.user.societyname;
								user.city = req.user.city;

								user.save(function(err) {
										
									if(err) {

										res.status(500).json({
											message: 'error_saveuser'
										});
										telkonlogger.logErr(req, res, err.message);

									} else {

										res.status(200).json({
											status: 'suc',
											message: 'added'
										});
										telkonlogger.logSuc(req, res, 'Added successfully');
									}
								});

							} else {

								if(user.socid !== socid) {

									/* User is ADMIN/MEMBER of another society */
									res.status(200).json({
										status: 'suc',
										message: 'error_notallowed'
									});
									telkonlogger.logSuc(req, res, 'Already admin of other society');

								} else {

									if((userrole == 5 ||
										userrole == 6 ||
										userrole == 7 ||
										userrole == 8)) {

										/* User is already an ADMIN of the society */
										res.status(200).json({
											status: 'suc',
											message: 'error_repeat'
										});
										telkonlogger.logSuc(req, res, 'Already an admin');

									} else if(userrole == 4) {

										if(role == 6) {
											user.role = 8;
										} else if(role == 5) {
											user.role = 7;
										}

										user.adminsince = moment();
										user.save(function(err) {
											
											if(err) {

												res.status(500).json({
													message: 'error_saveuser'
												});
												telkonlogger.logErr(req, res, err.message);

											} else {

												res.status(200).json({
													status: 'suc',
													message: 'added'
												});
												telkonlogger.logSuc(req, res, 'Added successfully');
											}
										});

									} else if(userrole == 9) {

										res.status(200).json({
											status: 'suc',
											message: 'error_blocked'
										});
										telkonlogger.logSuc(req, res, 'User is blocked');

									} else {

										res.status(403).json({
											message: 'error_invalidrole'
										});
										telkonlogger.logFatal(req, res, 'Invalid role');
									}
								}
							}

						} else {

							/* User does not exist - Invite to join */
							var newUser = {};
							newUser._id = new mongoose.Types.ObjectId;
							newUser.email = email;
							newUser.socid = socid;
							newUser.societyname = req.user.societyname;
							newUser.city = req.user.city;
							newUser.role = role;
							newPassword = helper.generatePassword();
							newUser.password = newPassword;
							newUser.adminsince = moment();

							helper.generateUid(function(uid) {

								if(!uid) {

									res.status(500).json({
										message: 'error_createuid'
									});
									telkonlogger.logErr(req, res, 'Unable to create new UID');

								} else {

									newUser.uid = uid;

									new User(newUser).save(function(err) {
										if(err){

											res.status(500).json({
												message: 'error_saveuser'
											});
											telkonlogger.logErr(req, res, err.message);

										} else {

											var mailOptions = {};
											var mailList = [];
											mailList.push(email);

											mailOptions['to'] = mailList;
											mailOptions['subject'] =  'Admin Invite - Telkon';
											mailOptions['text'] = 	'Hi\n'+
																	'You have been invited to be an ADMIN of your society.\n' +
																	'Please use your email ID and the following password to log in to your account.\n\n' +
																	'Password: ' + newPassword + '\n\n' +
																	'Visit http://www.telkon.in\n\n';
											mailOptions['html'] = '<p>Hi</p>' +
																	'<p>You have been invited to be an <b>ADMIN</b> of your society.<br>' +
																	'Please use your email ID and the following password to log in to your account.</p><br>' +
																	'<p>Password: <b>' + newPassword + '</b></p><br>' +
																	'<p>Visit http://www.telkon.in\n\n</p>'

											mailer.masterSendMail(mailList, mailOptions, function(err, info) {

												if(err) {
											       	
													res.status(500).json({
														message: 'error_mailer'
													});
													telkonlogger.logErr(req, res, err.message);

											    } else {

											        res.status(200).json({
														status: 'suc',
														message: 'invited'
													});
													telkonlogger.logSuc(req, res, 'Invited');
											    }
											});
										}
									});
								}
							});
						}
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
}


/* POST /admin/admin/remove */
function postAdminRemove(req, res, next) {

	var uid = req.uid;
	var socid = req.socid;
	var myrole = req.user.role;
	var adminuid = req.body.adminuid;

	var params = [];
	params.push(adminuid);

	if(helper.validateParams(params) == false) {
		
		res.status(400).json({
			message: 'error_invalidparams'
		});
		telkonlogger.logErr(req, res, 'Invalid parameters');

	} else {

		if(uid === adminuid) {

			res.status(200).json({
				status: 'suc',
				message: 'error_self'
			});
			telkonlogger.logSuc(req, res, 'Cannot remove self');

		} else {

			/* Only a SUPERADMIN can remove an admin */
			if(myrole == 6 || myrole == 8) {

				var roles = [
					5, 6, 7, 8
				];
				var query = {
					uid: adminuid,
					role: { $in: roles },
					socid: socid,
					isactive: true
				};

				User.findOne(query, function(err, user) {

					if(err) {

						res.status(500).json({
							message: 'error'
						});
						telkonlogger.logErr(req, res, err.message);

					} else {

						if(typeof user === 'undefined' ||
							user === null ||
							user === {}) {

							res.status(403).json({
								status: 'suc',
								message: 'fatal'
							});
							telkonlogger.logFatal(req, res, 'Not present in db');

						} else {

							var userrole = user.role;
							if(userrole === 7 || userrole === 8) {
								user.role = 4;
							} else {
								user.role = 2;
							}

							user.save(function(err) {

								if(err) {

									res.status(500).json({
										message: 'error'
									});
									telkonlogger.logErr(req, res, err.message);

								} else {

									res.status(200).json({
										status: 'suc',
										message: 'removed'
									});
									telkonlogger.logSuc(req, res, 'Removed successfully');
								}
							});
						}
					}
				});

			} else {

				res.status(200).json({
					status: 'suc',
					message: 'denied'
				});
				telkonlogger.logSuc(req, res, 'Permission denied');
			}
		}
	}
}


/* POST /admin/notifications */
function postNotifications(req, res, next) {

	var  uid = req.uid;

	Notification.aggregate(
		{$match: {uid: uid}},
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
						info: []
					}
				});
				telkonlogger.logSuc(req, res, 'Data sent successfully');
			}
		}
	});
}


/* POST /admin/notifications/chunk */
function postNotificationsChunk(req, res, next) {

	var  uid = req.uid;
	var recSkip = req.body.recSkip || 0;

	Notification.aggregate(
		{$match: {uid: uid}},
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
							total: noti.total || 0,
							notifications: data || []
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


/* POST /admin/notifications/cleartotal */
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

			} else if(info.infotype == 6) { 	// Member
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
			}
		}
		callback(items);
}


/* POST /admin/rules */
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

/* POST /admin/rules/edit */
function postRulesEdit(req, res, next) {

	var uid = req.uid;
	var socid = req.socid;
	var societyrules = req.body.societyrules;

	var params = [];
	params.push(societyrules);

	if(helper.validateParams(params) == false) {
		
		res.status(400).json({
			message: 'error_invalidparams'
		});
		telkonlogger.logErr(req, res, 'Invalid parameters');

	} else {

		Society.update({
			socid: socid
		}, {
			societyrules: societyrules
		}, function(err){
			if(err) {

				res.status(500).json({
					message: 'error_updatesociety'
				});
				telkonlogger.logErr(req, res, err.message);

			} else {

				res.status(200).json({
					status: 'suc',
					message: 'edited'
				});
				telkonlogger.logSuc(req, res, 'Edited successfully');
			}
		});
	}
}

/* POST /admin/logout */
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


/* POST /admin/suspend */
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

				/* User is also a MEMBER */
				user.role = 4;
				user.position = null;
				user.department = null;

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

				user.remove(function(err) {

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


/* POST /admin/delete */
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


/***********************************  END  ***********************************/