/******************************************************************************
 *
 *  device.js - data service for API
 *
 *****************************************************************************/

var societyService = require('./services/societyService');
var userService = require('./services/userService');
var noticeService = require('./services/noticeService');
var helper = require('../helper.js');
var staticData = require('../static.js');

var Society = require('../models/society.js');
var User = require('../models/user.js');
var Notice = require('../models/notice.js');
var Complaint = require('../models/complaint.js');
var Classified = require('../models/classified.js');
var Contact = require('../models/contact.js');
var Forum = require('../models/forum.js');
var Enquire = require('../models/enquire.js');
var Club = require('../models/club.js');

module.exports = {

	/* SOCIETY */
	postGetCities 					: postGetCities,
	getSocieties 					: getSocieties,
	getSocietiesByName				: getSocietiesByName,
	getSocietiesByCity				: getSocietiesByCity,
	getSocietyBySocid	 			: getSocietyBySocid,
	
	/* USER */
	getUsers						: getUsers,
	getUsersBySocid	 				: getUsersBySocid,
	getUsersByRole	 				: getUsersByRole,
	getUserByUid	 				: getUserByUid,
	getUserByEmail					: getUserByEmail,

	/* NOTICE */
	getNotices 						: getNotices,
	getNoticesByUid	 				: getNoticesByUid,
	getNoticesByEmail				: getNoticesByEmail,
	getNoticesBySocid				: getNoticesBySocid,
	getNoticeByNid					: getNoticeByNid,

	/* COMPLAINT */
	getComplaints 					: getComplaints,
	getComplaintsByUid				: getComplaintsByUid,
	getComplaintsByEmail			: getComplaintsByEmail,
	getComplaintsBySocidAndFlat		: getComplaintsBySocidAndFlat,
	getComplaintsBySocid			: getComplaintsBySocid,
	getComplaintByCompid			: getComplaintByCompid,

	/* CLASSIFIED */
	getClassifieds 					: getClassifieds,
	getClassifiedsByUid				: getClassifiedsByUid,
	getClassifiedsByEmail			: getClassifiedsByEmail,
	getClassifiedsBySocid			: getClassifiedsBySocid,
	getClassifiedByCid 				: getClassifiedByCid,

	/* FORUM */
	getForums						: getForums,
	getForumsByUid					: getForumsByUid,
	getForumsByEmail				: getForumsByEmail,
	getForumsBySocid				: getForumsBySocid,
	getForumByFid					: getForumByFid,

	/* ADMIN */
	getAdmins						: getAdmins,
	getAdminsBySocid				: getAdminsBySocid,
	getAdminsBySocidAndRole			: getAdminsBySocidAndRole,
	getAdminByUid					: getAdminByUid,
	getAdminByEmail					: getAdminByEmail,

	/* CLUB */
	getClubs						: getClubs,

	/* ENQUIRE */
	getEnquires						: getEnquires,
	getEnquiresByEmail				: getEnquiresByEmail


};


////////////////////

/* NOT IMPLEMENTED ROUTES */
function notImplemented(req, res, next){
  next(new Error(
    'Data service method for ' + req.method + ' ' + req.url+ ' is not implemented'
  ));
}


/* POST /api/cities */
function postGetCities(req, res, next) {

	var cities = staticData.cities;

	res.status(200).json({
		status: 'suc',
		data: cities || []
	});
}


/* GET /api/societies */
function getSocieties(req, res, next) {

	var query = {};
	var projection = {};

	Society.find(query, projection, function(err, data) {

		if(err) {

			res.status(500).json({
				message: 'error_querysociety'
			});

		} else {

			res.status(200).json({
				status: 'suc',
				data: data || []
			});
		}
	});
}


/* GET /api/societies/name/:name */
function getSocietiesByName(req, res, next) {

	var name = req.params.name;
	var myreg = new RegExp(name, 'g');
	var query = {
		societyname: { $regex: myreg, $options: "i" }
	};
	var projection = {};

	Society.find(query, projection, function(err, data) {

		if(err) {

			res.status(500).json({
				message: 'error_querysociety'
			});

		} else {

			res.status(200).json({
				status: 'suc',
				data: data || []
			});
		}
	});
}


/* GET /api/societies/city/:city */
function getSocietiesByCity(req, res, next) {

	var city = req.params.city;
	var cityreg = new RegExp(city, 'g');

	var query = {
		city: { $regex: cityreg, $options: "i" }
	};
	var projection = {};

	Society.find(query, projection, function(err, data) {

		if(err) {

			res.status(500).json({
				message: 'error'
			});

		} else {

			res.status(200).json({
				status: 'suc',
				data: data || []
			});
		}
	});
}


/* GET /api/societies/city/:city/locality/:locality */
function getSocietiesByCityAndLocality(req, res, next) {

	var city = req.params.city;
	var locality = req.params.locality;

	var cityreg = new RegExp(city, 'g');
	var localityreg = new RegExp(locality, 'g');

	var query = {
		city: { $regex: cityreg, $options: "i" },
		locality: { $regex: localityreg, $options: "i" }
	};
	var projection = {};

	Society.find(query, projection, function(err, data) {

		if(err) {

			res.status(500).json({
				message: 'error'
			});

		} else {

			res.status(200).json({
				status: 'suc',
				data: data || []
			});
		}
	});
}


/* GET /api/society/socid/:socid */
function getSocietyBySocid(req, res, next) {

	var socid = req.params.socid;
	var query = {socid: socid};
	var projection = {};

	Society.findOne(query, projection, function(err, data) {

		if(err) {

			res.status(500).json({
				message: 'error_querysociety'
			});

		} else {

			res.status(200).json({
				status: 'suc',
				data: data || {}
			});
		}
	});
}


/* GET /api/users */
function getUsers(req, res, next) {

	var query = {};
	var projection = {};

	User.find(query, projection, function(err, data) {

		if(err) {

			res.status(500).json({
				message: 'error_queryuser'
			});

		} else {

			res.status(200).json({
				status: 'suc',
				data: data || []
			});
		}
	});
}


/* GET /api/users/socid/:socid */
function getUsersBySocid(req, res, next) {

	var socid = req.params.socid;
	var query = {socid: socid};
	var projection = {};

	User.find(query, projection, function(err, data) {

		if(err) {

			res.status(500).json({
				message: 'error_queryuser'
			});

		} else {

			res.status(200).json({
				status: 'suc',
				data: data || []
			});
		}
	});
}


/* GET /api/users/role/:role */
function getUsersByRole(req, res, next) {

	var role = req.params.role;
	var query = {role: role};
	var projection = {};

	User.find(query, projection, function(err, data) {

		if(err) {

			res.status(500).json({
				message: 'error_queryuser'
			});

		} else {

			res.status(200).json({
				status: 'suc',
				data: data || []
			});
		}
	});
}


/* GET /api/user/uid/:uid */
function getUserByUid(req, res, next) {

	var uid = req.params.uid;
	var query = {uid: uid};
	var projection = {};

	User.findOne(query, projection, function(err, data) {

		if(err) {

			res.status(500).json({
				message: 'error_queryuser'
			});

		} else {

			res.status(200).json({
				status: 'suc',
				data: data || {}
			});
		}
	});
}


/* GET /api/user/email/:email */
function getUserByEmail(req, res, next) {

	var email = req.params.email;
	var query = {email: email};
	var projection = {};

	User.findOne(query, projection, function(err, data) {

		if(err) {

			res.status(500).json({
				message: 'error_queryuser'
			});

		} else {

			res.status(200).json({
				status: 'suc',
				data: data || {}
			});
		}
	});
}


/* GET /api/notices */
function getNotices(req, res, next) {

	var query = {};
	var projection = {};

	Notice.find(query, projection, function(err, data) {

		if(err) {

			res.status(500).json({
				message: 'error_querynotice'
			});

		} else {

			res.status(200).json({
				status: 'suc',
				data: data || []
			});
		}
	});
}


/* GET /api/notices/uid/:uid */
function getNoticesByUid(req, res, next) {

	var uid = req.params.uid;
	var query = {uid: uid};
	var projection = {};

	Notice.find(query, projection, function(err, data) {

		if(err) {

			res.status(500).json({
				message: 'error_querynotice'
			});

		} else {

			res.status(200).json({
				status: 'suc',
				data: data || []
			});
		}
	});
}


/* GET /api/notices/email/:email */
function getNoticesByEmail(req, res, next) {

	var email = req.params.email;
	var query = {byemail: email};
	var projection = {};

	Notice.find(query, projection, function(err, data) {

		if(err) {

			res.status(500).json({
				message: 'error_querynotice'
			});

		} else {

			res.status(200).json({
				status: 'suc',
				data: data || []
			});
		}
	});
}

/* GET /api/notices/socid/:socid */
function getNoticesBySocid(req, res, next) {

	var socid = req.params.socid;
	var query = {socid: socid};
	var projection = {};

	Notice.find(query, projection, function(err, data) {

		if(err) {

			res.status(500).json({
				message: 'error_querynotice'
			});

		} else {

			res.status(200).json({
				status: 'suc',
				data: data || []
			});
		}
	});
}


/* GET /api/notice/nid/:nid */
function getNoticeByNid(req, res, next) {

	var nid = req.params.nid;
	var query = {nid: nid};
	var projection = {};

	Notice.findOne(query, projection, function(err, data) {

		if(err) {

			res.status(500).json({
				message: 'error_querynotice'
			});

		} else {

			res.status(200).json({
				status: 'suc',
				data: data || {}
			});
		}
	});
}


/* GET /api/complaints */
function getComplaints(req, res, next) {

	var query = {};
	var projection = {};

	Complaint.find(query, projection, function(err, data) {

		if(err) {

			res.status(500).json({
				message: 'error_querycomplaint'
			});

		} else {

			res.status(200).json({
				status: 'suc',
				data: data || []
			});
		}
	});
}


/* GET /api/complaints/uid/:uid */
function getComplaintsByUid(req, res, next) {

	var uid = req.params.uid;
	var query = {uid: uid};
	var projection = {};

	Complaint.find(query, projection, function(err, data) {

		if(err) {

			res.status(500).json({
				message: 'error_querycomplaint'
			});

		} else {

			res.status(200).json({
				status: 'suc',
				data: data || []
			});
		}
	});
}


/* GET /api/complaints/email/:email */
function getComplaintsByEmail(req, res, next) {

	var email = req.params.email;
	var query = {byemail: email};
	var projection = {};

	Complaint.find(query, projection, function(err, data) {

		if(err) {

			res.status(500).json({
				message: 'error_querycomplaint'
			});

		} else {

			res.status(200).json({
				status: 'suc',
				data: data || []
			});
		}
	});
}


/* GET /api/complaints/socidflat/:socid/:flat */
function getComplaintsBySocidAndFlat(req, res, next) {

	var socid = req.params.socid;
	var flat = req.params.flat;
	flat = flat.replace(/[\. !@#$%^&*()<>?{}+,:-]+/g, "");
	flat = flat.toUpperCase();

	var query = {byflat: flat, socid: socid};
	var projection = {};

	Complaint.find(query, projection, function(err, data) {

		if(err) {

			res.status(500).json({
				message: 'error_querycomplaint'
			});

		} else {

			res.status(200).json({
				status: 'suc',
				data: data || []
			});
		}
	});
}


/* GET /api/complaints/socid/:socid */
function getComplaintsBySocid(req, res, next) {

	var socid = req.params.socid;
	var query = {socid: socid};
	var projection = {};

	Complaint.find(query, projection, function(err, data) {

		if(err) {

			res.status(500).json({
				message: 'error_querycomplaint'
			});

		} else {

			res.status(200).json({
				status: 'suc',
				data: data || []
			});
		}
	});
}


/* GET /api/complaint/compid/:compid */
function getComplaintByCompid(req, res, next) {

	var compid = req.params.compid;
	var query = {compid: compid};
	var projection = {};

	Complaint.findOne(query, projection, function(err, data) {

		if(err) {

			res.status(500).json({
				message: 'error_querycomplaint'
			});

		} else {

			res.status(200).json({
				status: 'suc',
				data: data || {}
			});
		}
	});
}


/* GET /api/classifieds */
function getClassifieds(req, res, next) {

	var query = {};
	var projection = {};

	Classified.find(query, projection, function(err, data) {

		if(err) {

			res.status(500).json({
				message: 'error_queryclassified'
			});

		} else {

			res.status(200).json({
				status: 'suc',
				data: data || []
			});
		}
	});
}


/* GET /api/classifieds/uid/:uid */
function getClassifiedsByUid(req, res, next) {

	var uid = req.params.uid;
	var query = {uid: uid};
	var projection = {};

	Classified.find(query, projection, function(err, data) {

		if(err) {

			res.status(500).json({
				message: 'error_queryclassified'
			});

		} else {

			res.status(200).json({
				status: 'suc',
				data: data || []
			});
		}
	});
}


/* GET /api/classifieds/email/:email */
function getClassifiedsByEmail(req, res, next) {

	var email = req.params.email;
	var query = {byemail: email};
	var projection = {};

	Classified.find(query, projection, function(err, data) {

		if(err) {

			res.status(500).json({
				message: 'error_queryclassified'
			});

		} else {

			res.status(200).json({
				status: 'suc',
				data: data || []
			});
		}
	});
}


/* GET /api/classifieds/socid/:socid */
function getClassifiedsBySocid(req, res, next) {

	var socid = req.params.socid;
	var query = {socid: socid};
	var projection = {};

	Classified.find(query, projection, function(err, data) {

		if(err) {

			res.status(500).json({
				message: 'error_queryclassified'
			});

		} else {

			res.status(200).json({
				status: 'suc',
				data: data || []
			});
		}
	});
}


/* GET /api/classified/cid/:cid */
function getClassifiedByCid(req, res, next) {

	var cid = req.params.cid;
	var query = {cid: cid};
	var projection = {};

	Classified.findOne(query, projection, function(err, data) {

		if(err) {

			res.status(500).json({
				message: 'error_queryclassified'
			});

		} else {

			res.status(200).json({
				status: 'suc',
				data: data || {}
			});
		}
	});
}


/* GET /api/forums */
function getForums(req, res, next) {

	var query = {};
	var projection = {};

	Forum.find(query, projection, function(err, data) {

		if(err) {

			res.status(500).json({
				message: 'error_queryforum'
			});

		} else {

			res.status(200).json({
				status: 'suc',
				data: data || []
			});
		}
	});
}


/* GET /api/forums/uid/:uid */
function getForumsByUid(req, res, next) {

	var uid = req.params.uid;
	var query = {uid: uid};
	var projection = {};

	Forum.find(query, projection, function(err, data) {

		if(err) {

			res.status(500).json({
				message: 'error_queryforum'
			});

		} else {

			res.status(200).json({
				status: 'suc',
				data: data || []
			});
		}
	});
}


/* GET /api/forums/email/:email */
function getForumsByEmail(req, res, next) {

	var email = req.params.email;
	var query = {byemail: email};
	var projection = {};

	Forum.find(query, projection, function(err, data) {

		if(err) {

			res.status(500).json({
				message: 'error_queryforum'
			});

		} else {

			res.status(200).json({
				status: 'suc',
				data: data || []
			});
		}
	});
}


/* GET /api/forums/socid/:socid */
function getForumsBySocid(req, res, next) {

	var socid = req.params.socid;
	var query = {socid: socid};
	var projection = {};

	Forum.find(query, projection, function(err, data) {

		if(err) {

			res.status(500).json({
				message: 'error_queryforum'
			});

		} else {

			res.status(200).json({
				status: 'suc',
				data: data || []
			});
		}
	});
}


/* GET /api/forum/fid/:fid */
function getForumByFid(req, res, next) {

	var fid = req.params.fid;
	var query = {fid: fid};
	var projection = {};

	Forum.findOne(query, projection, function(err, data) {

		if(err) {

			res.status(500).json({
				message: 'error_queryforum'
			});

		} else {

			res.status(200).json({
				status: 'suc',
				data: data || {}
			});
		}
	});
}


/* POST /api/admins */
function getAdmins(req, res, next) {

	var roles = [
		5, 6, 7, 8
	];
	var query = {
		role: { $in: roles },
		isactive: true
	};
	var projection = {};

	var sort = {sort:{_id:-1}};

	User.find(query, projection, sort, function(err, data) {

		if(err) {

			res.status(500).json({
				message: 'error_queryuser'
			});

		} else {

			res.status(200).json({
				status: 'suc',
				data: data || []
			});
		}

	});
}


/* POST /api/admins/socid/:socid */
function getAdminsBySocid(req, res, next) {

	var socid = req.params.socid;
	var roles = [
		5, 6, 7, 8
	];
	var query = {
		role: { $in: roles },
		socid: socid,
		isactive: true
	};
	var projection = {};

	var sort = {sort:{_id:-1}};

	User.find(query, projection, sort, function(err, data) {

		if(err) {

			res.status(500).json({
				message: 'error_queryuser'
			});

		} else {

			res.status(200).json({
				status: 'suc',
				data: data || []
			});
		}

	});
}


/* POST /api/admins/socidrole/:socid/:role */
function getAdminsBySocidAndRole(req, res, next) {

	var socid = req.params.socid;
	var role = req.params.role;
	var query = {
		role: role,
		socid: socid,
		isactive: true
	};
	var projection = {};

	var sort = {sort:{_id:-1}};

	User.find(query, projection, sort, function(err, data) {

		if(err) {

			res.status(500).json({
				message: 'error_queryuser'
			});

		} else {

			res.status(200).json({
				status: 'suc',
				data: data || []
			});
		}

	});
}


/* POST /api/admins/uid/:uid */
function getAdminByUid(req, res, next) {

	var uid = req.params.uid;
	var roles = [
		5, 6, 7, 8
	];
	var query = {
		role: { $in: roles },
		uid: uid,
		isactive: true
	};
	var projection = {};

	var sort = {sort:{_id:-1}};

	User.findOne(query, projection, sort, function(err, data) {

		if(err) {

			res.status(500).json({
				message: 'error_queryuser'
			});

		} else {

			res.status(200).json({
				status: 'suc',
				data: data || {}
			});
		}

	});
}


/* POST /api/admins/email/:email */
function getAdminByEmail(req, res, next) {

	var email = req.params.email;
	var roles = [
		5, 6, 7, 8
	];
	var query = {
		role: { $in: roles },
		email: email,
		isactive: true
	};
	var projection = {};

	var sort = {sort:{_id:-1}};

	User.findOne(query, projection, sort, function(err, data) {

		if(err) {

			res.status(500).json({
				message: 'error_queryuser'
			});

		} else {

			res.status(200).json({
				status: 'suc',
				data: data || {}
			});
		}

	});
}


/* GET /api/clubs/:search */
function getClubs(req, res, next) {

	var uid = req.uid;
	var socid = req.socid;
	//var clubtype = req.body.clubtype;
	var recSkip = req.body.recSkip || 0;
	var search = req.params.search || '';
	var searchReg = new RegExp(search, 'g');

	var query = {
		$or: [
			{name: { $regex: searchReg, $options: "i" }},
			{category: { $regex: searchReg, $options: "i" }},
			{bysocietyname: { $regex: searchReg, $options: "i" }},
			{bycity: { $regex: searchReg, $options: "i" }}
		],
		isactive: true
	};

	var paginate = {
		sort:
		{
			name: 1
		}
	};

	Club.find(query, {}, paginate, function(err, data) {

		if(err) {

			res.status(500).json({
				message: 'error_queryclub'
			});

		} else {

			res.status(200).json({
				status: 'suc',
				data: data || []
			});
		}
	});
}


/* POST /api/enquires */
function getEnquires(req, res, next) {

	var query = {};
	var projection = {};
	var sort = {sort:{_id:-1}};

	Enquire.find(query, projection, sort, function(err, data) {

		if(err) {

			res.status(500).json({
				message: 'error_queryenquire'
			});

		} else {

			res.status(200).json({
				status: 'suc',
				data: data || []
			});
		}

	});
}


/* POST /api/enquires/email/:email */
function getEnquiresByEmail(req, res, next) {

	var email = req.params.email;

	var query = {email: email};
	var projection = {};
	var sort = {sort:{_id:-1}};

	Enquire.find(query, projection, sort, function(err, data) {

		if(err) {

			res.status(500).json({
				message: 'error_queryenquire'
			});

		} else {

			res.status(200).json({
				status: 'suc',
				data: data || []
			});
		}

	});
}

/***********************************  END  ***********************************/