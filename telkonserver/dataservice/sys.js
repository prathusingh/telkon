/******************************************************************************
 *
 *  sys.js - data service for SYS
 *
 *****************************************************************************/

var mongoose = require('mongoose');
var notifier = require('./notifier');
var moment = require("moment");
var async = require('async');
var helper = require('../helper.js');
var staticData = require('../static.js');
var mailer = require('../mailer.js');

var Society = require('../models/society.js');
var User = require('../models/user.js');
var Notice = require('../models/notice.js');
var Complaint = require('../models/complaint.js');
var Classified = require('../models/classified.js');
var Contact = require('../models/contact.js');
var Forum = require('../models/forum.js');
var Notification = require('../models/notification.js');
var Enquire = require('../models/enquire.js');
var Feedback = require('../models/feedback.js');
var Support = require('../models/support.js');
var Poll = require('../models/poll.js');
var Club = require('../models/club.js');
var OtherSociety = require('../models/othersociety.js');


module.exports = {

	/* PROFILE */
	postUpdateName					: postUpdateName,
	postUpdatePhone					: postUpdatePhone,
	postUpdatePosition				: postUpdatePosition,
	postUpdateDepartment			: postUpdateDepartment,
	postClearName					: postClearName,
	postClearPosition				: postClearPosition,
	postClearDepartment				: postClearDepartment,
	postResetPassword				: postResetPassword,
	getProfileData					: getProfileData,
	postLogout						: postLogout,

	/* SOCIETY */
	postGetCities 					: postGetCities,
	getSocieties 					: getSocieties,
	getSocietiesByName				: getSocietiesByName,
	getSocietiesByCity				: getSocietiesByCity,
	getSocietiesByCityAndLocality	: getSocietiesByCityAndLocality,
	getSocietyBySocid	 			: getSocietyBySocid,
	postCreateSociety				: postCreateSociety,
	postCreateSocietyMultiple		: postCreateSocietyMultiple,
	postSocietyUpdateIssupported	: postSocietyUpdateIssupported,
	postSocietyUpdateFlatSample		: postSocietyUpdateFlatSample,
	postSocietyUpdateLayoutFlats	: postSocietyUpdateLayoutFlats,
	postSocietyUpdateImagedp		: postSocietyUpdateImagedp,
	
	/* ADMIN */
	getAdmins						: getAdmins,
	getAdminsBySocid				: getAdminsBySocid,
	getAdminsBySocidAndRole			: getAdminsBySocidAndRole,
	getAdminByUid					: getAdminByUid,
	getAdminByEmail					: getAdminByEmail,
	postAdminAdd					: postAdminAdd,
	postAdminRemove					: postAdminRemove,

	/* USER */
	getUsers						: getUsers,
	getUsersBySocid	 				: getUsersBySocid,
	getUsersByRole	 				: getUsersByRole,
	getUserByUid	 				: getUserByUid,
	getUserByEmail					: getUserByEmail,
	getUserByName					: getUserByName,
	postUserRemove					: postUserRemove,

	/* NOTICE */
	getNotices 						: getNotices,
	getNoticesByUid	 				: getNoticesByUid,
	getNoticesBySocid				: getNoticesBySocid,
	getNoticesByEmail				: getNoticesByEmail,
	getNoticeByNid					: getNoticeByNid,
	postNoticeCompose				: postNoticeCompose,
	postNoticeUpload				: postNoticeUpload,
	postNoticeRemove				: postNoticeRemove,

	/* COMPLAINT */
	getComplaints 					: getComplaints,
	getComplaintsBySocid			: getComplaintsBySocid,
	getComplaintsByUid				: getComplaintsByUid,
	getComplaintsByEmail			: getComplaintsByEmail,
	getComplaintsBySocidAndFlat		: getComplaintsBySocidAndFlat,
	getComplaintByCompid			: getComplaintByCompid,
	postComplaintRemove				: postComplaintRemove,

	/* CLASSIFIED */
	getClassifieds 					: getClassifieds,
	getClassifiedsByUid				: getClassifiedsByUid,
	getClassifiedsByEmail			: getClassifiedsByEmail,
	getClassifiedsBySocid			: getClassifiedsBySocid,
	getClassifiedByCid 				: getClassifiedByCid,
	postClassifiedRemove			: postClassifiedRemove,
	postClassifiedAdd				: postClassifiedAdd,

	/* CONTACT */
	getContacts						: getContacts,
	getContactsByPincode			: getContactsByPincode,
	getContactsByPincodeAndCategory : getContactsByPincodeAndCategory,
	getContactsBySocidAndCategory	: getContactsBySocidAndCategory,
	postContactAdd					: postContactAdd,

	/* FORUM */
	getForums						: getForums,
	getForumsByUid					: getForumsByUid,
	getForumsByEmail				: getForumsByEmail,
	getForumsBySocid				: getForumsBySocid,
	getForumByFid					: getForumByFid,

	/* ENQUIRE */
	getEnquires						: getEnquires,
	getEnquiresByEmail				: getEnquiresByEmail,
	getEnquiresByName				: getEnquiresByName,

	/* FEEDBACK */
	getFeedbacks					: getFeedbacks,
	getFeedbacksBySocid				: getFeedbacksBySocid,
	getFeedbacksByEmail				: getFeedbacksByEmail,
	getFeedbacksByName				: getFeedbacksByName,
	getFeedbacksByUid				: getFeedbacksByUid,

	/* SUPPORT */
	getSupports						: getSupports,
	getSupportsBySocid				: getSupportsBySocid,
	getSupportsByEmail				: getSupportsByEmail,
	getSupportsByName				: getSupportsByName,
	getSupportsBySocietyname		: getSupportsBySocietyname,
	getSupportsByCity 				: getSupportsByCity,
	getSupportsByUid				: getSupportsByUid,

	/* OTHER SOCIETY */
	getOtherSocietiesByCity 		: getOtherSocietiesByCity,

	/* MASTER */
	postMaster						: postMaster
	

};


////////////////////

/* NOT IMPLEMENTED ROUTES */
function notImplemented(req, res, next){
  next(new Error(
    'Data service method for ' + req.method + ' ' + req.url+ ' is not implemented'
  ));
}


/* POST /sys/profile/update/name */
function postUpdateName(req, res, next) {

	var uid = req.uid;
	var name = req.body.name;

	var params = [];
	params.push(name);

	if(helper.validateParams(params) == false) {
		
		res.status(400).json({
			message: 'error_invalidparams'
		});

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

			} else {

				res.status(200).json({
					status: 'suc',
					message: 'updated'
				});
			}
		});
	}
}


/* POST /sys/profile/update/phone */
function postUpdatePhone(req, res, next) {

	var uid = req.uid;
	var phone = req.body.phone;

	var params = [];
	params.push(phone);

	if(helper.validateParams(params) == false) {
		
		res.status(400).json({
			message: 'error_invalidparams'
		});

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

			} else {

				/* Updated phone successfully*/
				res.status(200).json({
					status: 'suc',
					message: 'updated'
				});
			}
		});
	}
}


/* POST /sys/profile/update/position */
function postUpdatePosition(req, res, next) {

	var uid = req.uid;
	var position = req.body.position;

	var params = [];
	params.push(position);

	if(helper.validateParams(params) == false) {
		
		res.status(400).json({
			message: 'error_invalidparams'
		});

	} else {

		position = helper.toTitleCase(position);
		User.update({
			uid: uid
		}, {
			position: position
		}, function(err){

			if(err) {

				res.status(500).json({
					message: 'error_updateuser'
				});

			} else {

				res.status(200).json({
					status: 'suc',
					message: 'updated'
				});
			}
		});
	}
}


/* POST /sys/profile/update/department */
function postUpdateDepartment(req, res, next) {

	var uid = req.uid;
	var department = req.body.department;

	var params = [];
	params.push(department);

	if(helper.validateParams(params) == false) {
		
		res.status(400).json({
			message: 'error_invalidparams'
		});

	} else {

		department = helper.toTitleCase(department);

		User.update({
			uid: uid
		}, {
			department: department
		}, function(err){

			if(err) {

				res.status(500).json({
					message: 'error_updateuser'
				});

			} else {

				res.status(200).json({
					status: 'suc',
					message: 'updated'
				});
			}
		});
	}
}



/* POST /sys/profile/clear/name */
function postClearName(req, res, next) {

	var uid = req.uid;

	User.update({
		uid: uid
	}, {
		name: null
	}, function(err){

		if(err) {

			res.status(500).json({
				message: 'error_updateuser'
			});

		} else {

			res.status(200).json({
				status: 'suc',
				message: 'cleared'
			});
		}
	});
}


/* POST /sys/profile/clear/position */
function postClearPosition(req, res, next) {

	var uid = req.uid;

	User.update({
		uid: uid
	}, {
		position: null
	}, function(err){

		if(err) {

			res.status(500).json({
				message: 'error_updateuser'
			});

		} else {

			res.status(200).json({
				status: 'suc',
				message: 'cleared'
			});
		}
	});
}


/* POST /sys/profile/clear/department */
function postClearDepartment(req, res, next) {

	var uid = req.uid;

	User.update({
		uid: uid
	}, {
		department: null
	}, function(err){

		if(err) {

			res.status(500).json({
				message: 'error_updateuser'
			});

		} else {

			res.status(200).json({
				status: 'suc',
				message: 'cleared'
			});
		}
	});
}


/* POST /sys/profile/reset/password */
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

	} else {

		/* Verify the User's password*/
		var query = {
			uid: uid
		};

		User.findOne(query, function(err, user){
			
			if(err) {

				res.status(500).json({
					message: 'error_queryuser'
				});

			} else {

				if(oldp !== user.password) {

					res.status(200).json({
						status: 'suc',
						message: 'error_incorrect'
					});

				} else {
					user.password = newp;
					user.save(function(err){
						if(err) {

							res.status(500).json({
								message: 'error_saveuser'
							});

						} else {

							res.status(200).json({
								status: 'suc',
								message: 'reset'
							});

						}
					});
				}

			}

		});
	}
}


/* GET /sys/profile/data */
function getProfileData(req, res, next) {

	res.status(200).json({
		status: 'suc',
		data: req.user || []
	});
}


/* POST /sys/cities */
function postGetCities(req, res, next) {

	var cities = staticData.cities;

	res.status(200).json({
		status: 'suc',
		data: cities || []
	});
}


/* GET /sys/societies */
function getSocieties(req, res, next) {

	var query = {};
	var projection = {};
	var paginate = {
		sort:
		{
			societyname: 1
		}
	};

	Society.find(query, projection, paginate, function(err, data) {

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


/* GET /sys/societies/name/:name */
function getSocietiesByName(req, res, next) {

	var name = req.params.name;
	var myreg = new RegExp(name, 'g');
	var query = {
		societyname: { $regex: myreg, $options: "i" }
	};
	var projection = {};
	var paginate = {
		sort:
		{
			societyname: 1
		}
	};

	Society.find(query, projection, paginate, function(err, data) {

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


/* GET /sys/societies/city/:city */
function getSocietiesByCity(req, res, next) {

	var city = req.params.city;
	var cityreg = new RegExp(city, 'g');

	var query = {
		city: { $regex: cityreg, $options: "i" }
	};
	var projection = {};
	var paginate = {
		sort:
		{
			societyname: 1
		}
	};

	Society.find(query, projection, paginate, function(err, data) {

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


/* GET /sys/societies/city/:city/locality/:locality */
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
	var paginate = {
		sort:
		{
			societyname: 1
		}
	};

	Society.find(query, projection, paginate, function(err, data) {

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


/* GET /sys/society/socid/:socid */
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


/* POST /sys/create/society */
function postCreateSociety(req, res, next) {

	var uid = req.uid;

	var societyname = req.body.societyname;
	var pincode = req.body.pincode;
	var locality = req.body.locality;
	var city = req.body.city;
	var issupported = req.body.issupported;
	var supportlevel = req.body.supportlevel;
	var flatsample = req.body.flatsample; 	// optional
	var layoutflats = req.body.layoutflats; 	// optional

	var params = [];
	params.push(societyname);
	params.push(pincode);
	params.push(locality);
	params.push(city);
	params.push(issupported);
	params.push(supportlevel);

	if(helper.validateParams(params) == false) {
		
		res.status(400).json({
			message: 'error_invalidparams'
		});

	} else {

		var newSociety = {};
		newSociety._id = new mongoose.Types.ObjectId;
		newSociety.createdby = uid;
		newSociety.societyname = helper.capitalizeFirstLetter(societyname.trim());
		newSociety.pincode = pincode.trim();
		newSociety.layoutflats = layoutflats;
		newSociety.locality = helper.capitalizeFirstLetter(locality.trim());
		newSociety.city = helper.capitalizeFirstLetter(city.trim());
		newSociety.issupported = issupported;
		newSociety.supportlevel = supportlevel;

		if(flatsample) {
			flatsample = flatsample.trim().replace(/[\. !@#$%^&*()<>?{}+,:-]+/g, "");
			flatsample = flatsample.toUpperCase();
		}
		newSociety.flatsample = flatsample;

		helper.generateSocid(function(socid) {

			if(!socid) {
				res.status(500).json({
					message: 'error_createsocid'
				});
				return;

			} else {

				newSociety.socid = socid;
				helper.generateSocietyCode(city, function(societycode) {

					if(!societycode) {

						res.status(500).json({
							message: 'error_createsocietycode'
						});
						return;

					} else {
						
						newSociety.societycode = societycode;
						
						new Society(newSociety).save(function(err) {
											
							if(err){
										
								res.status(500).json({
									message: 'error_savesociety'
								});
								return;

							} else {

								res.status(200).json({
									status: 'suc',
									message: 'created'
								});
								return;
							}

						});
					}
				});
			}
		});
				
	}
}


/* POST /sys/create/society/multiple */
function postCreateSocietyMultiple(req, res, next) {

	var uid = req.uid;
	//var societies = req.body.societies;
	var ibuf = req._readableState.buffer;

	var societies = ibuf.toString();

	console.log(Object.prototype.toString.call(list));

	var params = [];
	params.push(societies);

	if(helper.validateParams(params) == false) {
		
		res.status(400).json({
			message: 'error_invalidparams'
		});

	} else {

		var list = JSON.parse(societies);

		if(Object.prototype.toString.call(list) !== '[object Array]') {

			res.status(400).json({
				message: 'error_invalidparams_notarray'
			});

		} else {

			var error = [];

			async.each(list, function(society, callback) {
				
				var newSociety = {};
				var societyname = society.societyname;
				var locality = society.locality;
				var city = society.city;
				var pincode = society.pincode;
				var issupported = society.issupported;
				var supportlevel = society.supportlevel;
				var flatsample = society.flatsample; 	// optional
				var layoutflats = society.layoutflats; 	// optional

				var params = [];
				params.push(societyname);
				params.push(locality);
				params.push(city);
				params.push(pincode);
				params.push(issupported);
				params.push(supportlevel);

				if(helper.validateParams(params) == false) {
					callback();
				} else {

					newSociety = {};
					newSociety._id = new mongoose.Types.ObjectId;
					newSociety.createdby = uid;
					newSociety.societyname = helper.capitalizeFirstLetter(societyname.trim());
					newSociety.pincode = pincode.trim();
					newSociety.locality = helper.capitalizeFirstLetter(locality.trim());
					newSociety.city = helper.capitalizeFirstLetter(city.trim());
					newSociety.issupported = issupported;
					newSociety.supportlevel = supportlevel;
					newSociety.layoutflats = layoutflats;

					if(flatsample) {
						flatsample = flatsample.trim().replace(/[\. !@#$%^&*()<>?{}+,:-]+/g, "");
						flatsample = flatsample.toUpperCase();
					}
					newSociety.flatsample = flatsample;

					helper.generateSocid(function(socid) {

						if(!socid) {
							callback('Unable to create new SOCID');
						} else {

							newSociety.socid = socid;
							helper.generateSocietyCode(city, function(societycode) {

								if(!societycode) {
									callback('Unable to create new SOCIETY CODE');
								} else {
										
									newSociety.societycode = societycode;
										
									new Society(newSociety).save(function(err) {
															
										if(err) {
											callback(err);
										} else {
											callback();
										}
									});
								}
							});
						}
					});

				}
			}, function(err) {

				if(err) {
					res.status(500).json({
						message: 'error_newsociety'
					});
				} else {
					res.status(200).json({
						status: 'suc',
						message: 'createdmultiple'
					});
				}
			});
		}
	}
}


/* POST /admin/society/update/issupported */
function postSocietyUpdateIssupported(req, res, next) {

	var uid = req.uid;
	var socid = req.body.socid;
	var issupported = req.body.issupported;

	var params = [];
	params.push(socid);
	params.push(issupported);

	if(helper.validateParams(params) == false) {
		
		res.status(400).json({
			message: 'error_invalidparams'
		});

	} else {

		Society.update({
			socid: socid
		}, {
			issupported: issupported
		}, function(err, recs){

			if(err) {

				res.status(500).json({
					message: 'error_updatesociety'
				});

			} else {

				if(recs == 0) {
					res.status(200).json({
						status: 'suc',
						message: 'nosociety'
					});
				} else {
					res.status(200).json({
						status: 'suc',
						message: 'updated'
					});
				}

				
			}
		});
	}
}


/* POST /admin/society/update/flatsample */
function postSocietyUpdateFlatSample(req, res, next) {

	var uid = req.uid;
	var socid = req.body.socid;
	var flatsample = req.body.flatsample;

	var params = [];
	params.push(socid);
	params.push(flatsample);

	if(helper.validateParams(params) == false) {
		
		res.status(400).json({
			message: 'error_invalidparams'
		});

	} else {

		flatsample = flatsample.trim().replace(/[\. !@#$%^&*()<>?{}+,:-]+/g, "");
		flatsample = flatsample.toUpperCase();

		Society.update({

			socid: socid

		}, {

			flatsample: flatsample

		}, function(err, recs) {

			if(err) {

				res.status(500).json({
					message: 'error_updatesociety'
				});

			} else {

				if(recs == 0) {
					res.status(200).json({
						status: 'suc',
						message: 'nosociety'
					});
				} else {
					res.status(200).json({
						status: 'suc',
						message: 'updated'
					});
				}
			}
		});
	}
}


/* POST /admin/society/update/layoutflats */
function postSocietyUpdateLayoutFlats(req, res, next) {

	var uid = req.uid;
	var socid = req.body.socid;
	var layoutflats = req.body.layoutflats;

	var params = [];
	params.push(socid);
	params.push(layoutflats);

	if(helper.validateParams(params) == false) {
		
		res.status(400).json({
			message: 'error_invalidparams'
		});

	} else {

		Society.update({
			socid: socid
		}, {

			layoutflats: layoutflats

		}, function(err, recs) {

			if(err) {

				res.status(500).json({
					message: 'error_updatesociety'
				});

			} else {

				if(recs == 0) {
					res.status(200).json({
						status: 'suc',
						message: 'nosociety'
					});
				} else {
					res.status(200).json({
						status: 'suc',
						message: 'updated'
					});
				}
			}
		});
	}
}


/* POST /admin/society/update/imagedp */
function postSocietyUpdateImagedp(req, res, next) {

	var uid = req.uid;
	var socid = req.body.socid;

	var params = [];
	params.push(socid);

	if(helper.validateParams(params) == false) {
		
		res.status(400).json({
			message: 'error_invalidparams'
		});

	} else {

		var imagedp = socid + '.png';

		Society.update({
			socid: socid
		}, {
			imagedp: imagedp
		}, function(err, recs) {

			if(err) {

				res.status(500).json({
					message: 'error_updatesociety'
				});

			} else {

				if(recs == 0) {
					res.status(200).json({
						status: 'suc',
						message: 'nosociety'
					});
				} else {
					res.status(200).json({
						status: 'suc',
						message: 'updated'
					});
				}
			}
		});
	}
}


/* POST /sys/admins */
function getAdmins(req, res, next) {

	var roles = [
		5, 6, 7, 8
	];
	var query = {
		role: { $in: roles },
		isactive: true
	};
	var projection = {};
	var paginate = {
		sort:
		{
			_id: -1
		}
	};

	User.find(query, projection, paginate, function(err, data) {

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


/* POST /sys/admins/socid/:socid */
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
	var paginate = {
		sort:
		{
			_id: -1
		}
	};

	User.find(query, projection, paginate, function(err, data) {

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


/* POST /sys/admins/socidrole/:socid/:role */
function getAdminsBySocidAndRole(req, res, next) {

	var socid = req.params.socid;
	var role = req.params.role;
	var query = {
		role: role,
		socid: socid,
		isactive: true
	};
	var projection = {};
	var paginate = {
		sort:
		{
			_id: -1
		}
	};

	User.find(query, projection, paginate, function(err, data) {

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


/* POST /sys/admins/uid/:uid */
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


/* POST /sys/admin/email/:email */
function getAdminByEmail(req, res, next) {

	var email = req.params.email;
	var emailreg = new RegExp(email, 'g');

	var roles = [
		5, 6, 7, 8
	];
	var query = {
		role: { $in: roles },
		email: { $regex: emailreg, $options: "i" },
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


/* POST /sys/admin/add */
function postAdminAdd(req, res, next) {

	var uid = req.uid;
	var myrole = req.user.role;

	var email = req.body.email;
	var role = req.body.role;
	var socid = req.body.socid;
	var supportlevel = req.body.supportlevel;
	var password = req.body.password; 	// optional
	var name = req.body.name; 	// optional
	var phone = req.body.phone; 	// optional
	var position = req.body.position; 	// optional
	var department = req.body.department; 	// optional
	var ismail = req.body.ismail || true; 	// optional

	if(ismail === 'false') ismail = false;
	else ismail = true;

	var params = [];
	params.push(email);
	params.push(role);
	params.push(socid);
	params.push(supportlevel);

	if(helper.validateParams(params) == false) {
		
		res.status(400).json({
			message: 'error_invalidparams'
		});

	} else {

		if(helper.validateEmail(email) == false) {

			res.status(400).json({
				message: 'error_invalidemailformat'
			});

		} else {

			if(myrole == 0) {

				var query = {
					email: email,
					isactive: true
				};

				User.findOne(query, function(err, user) {

					if(err) {

						res.status(500).json({
							message: 'error_queryuser'
						});

					} else {

						if(user) {

							var userrole = user.role;

							if(userrole == 1 || userrole == 2 || userrole == 3) {

								user.role = role;
								user.position = position;
								user.department = department;
								user.name = name;
								user.phone = phone;
								user.adminsince = moment();

								Society.findOne({socid: socid}, function(err, society) {

									if(err) {

										res.status(500).json({
											message: 'error_querysociety'
										});

									} else {

										user.socid = society.socid;
										user.societyname = society.societyname;
										user.city = society.city;

										user.save(function(err) {
											
											if(err) {

												res.status(500).json({
													message: 'error_saveuser'
												});

											} else {

												society.issupported = true;
												society.supportlevel = supportlevel;

												society.save(function(err) {

													if(err) {

														res.status(500).json({
															message: 'error_savesociety'
														});

													} else {

														res.status(200).json({
															status: 'suc',
															message: 'added'
														});
													}
												});
											}
										});
									}
								});
										
							} else {

								if(user.socid !== socid) {

									/* User is ADMIN/MEMBER of another society */
									res.status(200).json({
										status: 'suc',
										message: 'error_notallowed'
									});

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

									} else if(userrole == 4) {

										if(role == 6) {
											user.role = 8;
										} else if(role == 5) {
											user.role = 7;
										}

										user.position = position;
										user.department = department;
										user.adminsince = moment();

										user.save(function(err) {
												
											if(err) {

												res.status(500).json({
													message: 'error_saveuser'
												});

											} else {

												Society.update({
													socid: socid
												}, {
													issupported: true,
													supportlevel: supportlevel
												}, function(err, society) {

													if(err) {

														res.status(500).json({
															message: 'error_savesociety'
														});
												
													} else {

														res.status(200).json({
															status: 'suc',
															message: 'added'
														});
													}
												});
											}
										});

									} else if(userrole == 9) {

										res.status(200).json({
											status: 'suc',
											message: 'error_blocked'
										});

									} else {

										/* Invalid Request - DISCARD */
										res.status(403).json({
											message: 'error_invalidrole'
										});

									}

								}
										
							}

						} else {

							/* User does not exist - Invite to join */
							var newUser = {};
							newUser._id = new mongoose.Types.ObjectId;
							newUser.email = email;
							newUser.socid = socid;
							newUser.role = role;
							newUser.adminsince = moment();
							newUser.position = position;
							newUser.department = department;
							newUser.name = name;
							newUser.phone = phone;

							if(password) {
								newPassword = password;
							} else {
								newPassword = helper.generatePassword();
							}
							
							newUser.password = newPassword;
							

							Society.findOne({socid: socid}, function(err, society) {

								if(err) {

									res.status(500).json({
										message: 'error_querysociety'
									});

								} else {

									newUser.societyname = society.societyname;
									newUser.city = society.city;

									helper.generateUid(function(uid) {

										if(!uid) {

										} else {

											newUser.uid = uid;
											new User(newUser).save(function(err) {

												if(err){

													res.status(500).json({
														message: 'error_saveuser'
													});

												} else {

													society.issupported = true;
													society.supportlevel = supportlevel;

													society.save(function(err) {

														if(err) {

															res.status(500).json({
																message: 'error_savesociety'
															});

														} else {

															if(ismail) {

																var mailOptions = {};
																var mailList = [];
																mailList.push(email);

																mailOptions['to'] = mailList;
																mailOptions['subject'] =  'Admin Invite - Telkon';
																mailOptions['text'] = 	'Hi\n'+
																						'You have been invited to be an ADMIN of your society.\n' +
																						'Please use your email ID and the following password to log in to your account.\n\n' +
																						'Password: ' + newPassword + '\n\n' +
																						'Visit http://www.telkon.in\n\n'
																mailOptions['html'] = '<p>Hi</p>' +
																						'<p>You have been invited to be an <b>ADMIN</b> of your society.<br>' +
																						'Please use your email ID and the following password to log in to your account.</p><br>' +
																						'<p>Password: <b>' + newPassword + '</b></p><br>' +
																						'<p>Visit http://www.telkon.in\n\n</p>'


																mailer.telkonSendMail(mailList, mailOptions, function(error, info) {
																    
																    if(error) {
																       	
																		res.status(500).json({
																			message: 'error_mailer'
																		});

																    } else {

																		res.status(200).json({
																			status: 'suc',
																			message: 'invited'
																		});
																    }
																});

															} else {

																res.status(200).json({
																	status: 'suc',
																	message: 'invited_nomail'
																});
															}
														}
													});
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
			}
		}
	}
}


/* POST /sys/admin/remove */
function postAdminRemove(req, res, next) {

	var uid = req.uid;
	var socid = req.body.socid;
	var myrole = req.user.role;
	var email = req.body.email;

	var params = [];
	params.push(socid);
	params.push(email);

	if(helper.validateParams(params) == false) {
		
		res.status(400).json({
			message: 'error_invalidparams'
		});

	} else {

		if(myrole == 0) {

			var roles = [
				5, 6, 7, 8
			];
			var query = {
				email: email,
				role: { $in: roles },
				socid: socid,
				isactive: true
			};

			User.findOne(query, function(err, user) {

				if(err) {

					res.status(500).json({
						message: 'error_queryuser'
					});

				} else {

					if(typeof user === 'undefined' ||
						user === null ||
						user === {}) {

						res.status(403).json({
							message: 'error_fatal'
						});

					} else {

						var userrole = user.role;
						if(userrole === 7 || userrole === 8) {
							user.role = 4;
						} else {
							user.role = 2;
							user.socid = null;
							user.city = null;
							user.societyname = null;
						}

						user.adminsince = null;
						user.save(function(err) {

							if(err) {

								res.status(500).json({
									message: 'error_saveuser'
								});

							} else {

								res.status(200).json({
									status: 'suc',
									message: 'removed'
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

		}

	}
}


/* GET /sys/users */
function getUsers(req, res, next) {

	var query = {};
	var projection = {};
	var paginate = {
		sort:
		{
			_id: -1
		}
	};

	User.find(query, projection, paginate, function(err, data) {

		if(err) {

			res.status(500).json({
				status: 'suc',
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


/* GET /sys/users/socid/:socid */
function getUsersBySocid(req, res, next) {

	var socid = req.params.socid;
	var query = {socid: socid};
	var projection = {};
	var paginate = {
		sort:
		{
			_id: -1
		}
	};

	User.find(query, projection, paginate, function(err, data) {

		if(err) {

			res.status(500).json({
				status: 'suc',
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


/* GET /sys/users/role/:role */
function getUsersByRole(req, res, next) {

	var role = req.params.role;
	var query = {role: role};
	var projection = {};
	var paginate = {
		sort:
		{
			_id: -1
		}
	};

	User.find(query, projection, paginate, function(err, data) {

		if(err) {

			res.status(500).json({
				status: 'suc',
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


/* GET /sys/user/uid/:uid */
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


/* GET /sys/user/email/:email */
function getUserByEmail(req, res, next) {

	var email = req.params.email;
	var emailreg = new RegExp(email, 'g');

	var query = {
		email: { $regex: emailreg, $options: "i" }
	};
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


/* GET /sys/user/name/:name */
function getUserByName(req, res, next) {

	var name = req.params.name;
	var namereg = new RegExp(name, 'g');

	var query = {
		name: { $regex: namereg, $options: "i" }
	};
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


/* POST /sys/user/remove */
function postUserRemove(req, res, next) {

	var email = req.body.email;

	var params = [];
	params.push(email);

	if(helper.validateParams(params) == false) {
		
		res.status(400).json({
			message: 'error_invalidparams'
		});

	} else {

		var query = {
			email: email
		};

		User.findOneAndRemove(query, function(err, rec) {

			if(err) {

				res.status(500).json({
					message: 'error_removeuser'
				});

			} else {

				if(!rec) {
					res.status(200).json({
						status: 'suc',
						message: 'nouser'
					});
				} else {
					res.status(200).json({
						status: 'suc',
						message: 'removed'
					});
				}
			}
		});
	}
}

/* GET /sys/notices */
function getNotices(req, res, next) {

	var query = {};
	var projection = {};
	var paginate = {
		sort:
		{
			_id: -1
		}
	};

	Notice.find(query, projection, paginate, function(err, data) {

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


/* GET /sys/notices/uid/:uid */
function getNoticesByUid(req, res, next) {

	var uid = req.params.uid;
	var query = {uid: uid};
	var projection = {};
	var paginate = {
		sort:
		{
			_id: -1
		}
	};

	Notice.find(query, projection, paginate, function(err, data) {

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


/* GET /sys/notices/socid/:socid */
function getNoticesBySocid(req, res, next) {

	var socid = req.params.socid;
	var query = {socid: socid};
	var projection = {};
	var paginate = {
		sort:
		{
			_id: -1
		}
	};

	Notice.find(query, projection, paginate, function(err, data) {

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


/* GET /sys/notices/email/:email */
function getNoticesByEmail(req, res, next) {

	var email = req.params.email;
	var emailreg = new RegExp(email, 'g');

	var query = {
		byemail: { $regex: emailreg, $options: "i" }
	};
	var projection = {};
	var paginate = {
		sort:
		{
			_id: -1
		}
	};

	Notice.find(query, projection, paginate, function(err, data) {

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


/* GET /sys/notice/nid/:nid */
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


/* POST /sys/notice/compose */
function postNoticeCompose(req, res, next) {

	var uid = req.uid;

	var title = req.body.title;
	var desc = req.body.desc;
	var validfor = req.body.validfor;
	var meantfor = req.body.meantfor;
	var socid = req.body.socid;

	var name = req.body.name; 	// optional
	var email = req.body.email; 	// optional
	var position = req.body.position; 	// optional
	var department = req.body.department; 	// optional

	var params = [];
	params.push(title);
	params.push(desc);
	params.push(validfor);
	params.push(meantfor);
	params.push(socid);

	if(helper.validateParams(params) == false) {
		
		res.status(400).json({
			message: 'error_invalidparams'
		});

	} else {

		title = helper.capitalizeFirstLetter(title);
		desc = helper.capitalizeFirstLetter(desc);
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
		newNotice.byname = name || user.name;
		newNotice.byemail = email || user.email;
		newNotice.byposition = position || user.position;
		newNotice.bydepartment = department || user.department;
		newNotice.uid = req.uid;
		newNotice.socid = socid;
		var date = moment();
  		newNotice.createdat = date;
  		newNotice.expiry = moment(date).add(validfor, 'days');
  		if(desc.length < 50) {
			newNotice.contentshort = desc;
		} else {
			newNotice.contentshort = desc.substring(0, 50);
		}

  		helper.generateNid(function(nid) {

  			if(!nid) {

  				res.status(500).json({
					message: 'error_createnid'
				});

  			} else {

  				newNotice.nid = nid;
  				new Notice(newNotice).save(function(err) {

					if(err) {

						res.status(500).json({
							message: 'error_savenotice'
						});

					} else {

						notifier.noticeAdded(newNotice);
						res.status(200).json({
							status: 'suc',
							message: 'added'
						});
					}
				});
  			}
  		});
	}
}


/* POST /sys/notice/upload */
function postNoticeUpload(req, res, next) {

	var data = req.body.data;
	data = JSON.parse(data);
	var title = data.title;
	var desc = data.desc;
	var validfor = data.validfor;

	if(typeof title === 'undefined' ||
		title === null ||
		title === '' ||
		typeof desc === 'undefined' ||
		desc === null ||
		desc === '' ||
		typeof validfor === 'undefined' ||
		validfor === null ||
		validfor === '' ||
		typeof socid === 'undefined' ||
		socid === null ||
		socid === '') {

		/* Invalid Request - DISCARD */
		res.status(400).json({
			status: 'suc',
			message: 'invalid'
		});

	} else {

		if(!req.files) {

			/* Invalid Request - DISCARD */
			res.status(400).json({
				status: 'suc',
				message: 'invalid'
			});

		} else {

			title = helper.capitalizeFirstLetter(title);
			desc = helper.capitalizeFirstLetter(desc);
			if(validfor == 0) {
				validfor = 365;
			}
			var user = req.user;
			newNotice = {};
			newNotice._id = new mongoose.Types.ObjectId;
			newNotice.title = title;
			newNotice.desc = desc;
			newNotice.validfor = validfor;
			newNotice.contenturl = req.files.file.name;
			newNotice.byname = user.name;
			newNotice.byposition = user.position;
			newNotice.bydepartment = user.department;
			newNotice.uid = req.uid;
			newNotice.socid = socid;
			var date = moment();
	  		newNotice.createdat = date;
	  		newNotice.expiry = moment(date).add(validfor, 'days');

			if(desc.length < 50) {
				newNotice.contentshort = desc;
			} else {
				newNotice.contentshort = desc.substring(0, 50);
			}

			helper.generateNid(function(nid) {

	  			if(!nid) {

	  				res.status(500).json({
						status: 'suc',
						message: 'error_nidcreate'
					});

	  			} else {

	  				newNotice.nid = nid;
	  				new Notice(newNotice).save(function(err) {

						if(err) {

							console.log(err);
							/* System Error */
							res.status(500).json({
								status: 'suc',
								message: 'error'
							});

						} else {

							notifier.noticeAdded(newNotice);
							res.status(200).json({
								status: 'suc',
								message: 'added'
							});
						}
					});

	  			}

			});
		}
	}	
}


/* POST /sys/notice/remove */
function postNoticeRemove(req, res, next) {

	var socid = req.body.socid;
	var nid = req.body.nid;

	var params = [];
	params.push(nid);
	params.push(socid);

	if(helper.validateParams(params) == false) {
		
		res.status(400).json({
			message: 'error_invalidparams'
		});

	} else {

		var query = {
			nid: nid,
			socid: socid
		};

		Notice.findOneAndRemove(query, function(err, rec) {

			if(err) {

				res.status(500).json({
					message: 'error_removenotice'
				});

			} else {

				if(!rec) {
					res.status(200).json({
						status: 'suc',
						message: 'nonotice'
					});
				} else {
					res.status(200).json({
						status: 'suc',
						message: 'removed'
					});
				}
			}
		});
	}
}


/* GET /sys/complaints */
function getComplaints(req, res, next) {

	var query = {};
	var projection = {};
	var paginate = {
		sort:
		{
			_id: -1
		}
	};

	Complaint.find(query, projection, paginate, function(err, data) {

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


/* GET /sys/complaints/uid/:uid */
function getComplaintsByUid(req, res, next) {

	var uid = req.params.uid;
	var query = {uid: uid};
	var projection = {};
	var paginate = {
		sort:
		{
			_id: -1
		}
	};

	Complaint.find(query, projection, paginate, function(err, data) {

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


/* GET /sys/complaints/email/:email */
function getComplaintsByEmail(req, res, next) {

	var email = req.params.email;
	var emailreg = new RegExp(email, 'g');

	var query = {
		byemail: { $regex: emailreg, $options: "i" }
	};
	var projection = {};
	var paginate = {
		sort:
		{
			_id: -1
		}
	};

	Complaint.find(query, projection, paginate, function(err, data) {

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


/* GET /sys/complaints/socid/:socid/flat/:flat */
function getComplaintsBySocidAndFlat(req, res, next) {

	var socid = req.params.socid;
	var flat = req.params.flat;
	flat = flat.replace(/[\. !@#$%^&*()<>?{}+,:-]+/g, "");
	flat = flat.toUpperCase();

	var query = {byflat: flat, socid: socid};
	var projection = {};
	var paginate = {
		sort:
		{
			_id: -1
		}
	};

	Complaint.find(query, projection, paginate, function(err, data) {

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


/* GET /sys/complaints/socid/:socid */
function getComplaintsBySocid(req, res, next) {

	var socid = req.params.socid;
	var query = {socid: socid};
	var projection = {};
	var paginate = {
		sort:
		{
			_id: -1
		}
	};

	Complaint.find(query, projection, paginate, function(err, data) {

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


/* GET /sys/complaint/compid/:compid */
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


/* POST /sys/complaint/remove */
function postComplaintRemove(req, res, next) {

	var socid = req.body.socid;
	var compid = req.body.compid;

	var params = [];
	params.push(compid);
	params.push(socid);

	if(helper.validateParams(params) == false) {
		
		res.status(400).json({
			message: 'error_invalidparams'
		});

	} else {

		var query = {
			compid: compid,
			socid: socid
		};

		Complaint.findOneAndRemove(query, function(err, rec) {

			if(err) {

				res.status(500).json({
					message: 'error_removecompaint'
				});

			} else {

				if(!rec) {
					res.status(200).json({
						status: 'suc',
						message: 'nocomplaint'
					});
				} else {
					res.status(200).json({
						status: 'suc',
						message: 'removed'
					});
				}
			}
		});
	}
}


/* GET /sys/classifieds */
function getClassifieds(req, res, next) {

	var query = {};
	var projection = {};
	var paginate = {
		sort:
		{
			_id: -1
		}
	};

	Classified.find(query, projection, paginate, function(err, data) {

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


/* GET /sys/classifieds/uid/:uid */
function getClassifiedsByUid(req, res, next) {

	var uid = req.params.uid;
	var query = {uid: uid};
	var projection = {};
	var paginate = {
		sort:
		{
			_id: -1
		}
	};

	Classified.find(query, projection, paginate, function(err, data) {

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


/* GET /sys/classifieds/email/:email */
function getClassifiedsByEmail(req, res, next) {

	var email = req.params.email;
	var emailreg = new RegExp(email, 'g');

	var query = {
		byemail: { $regex: emailreg, $options: "i" }
	};
	var projection = {};
	var paginate = {
		sort:
		{
			_id: -1
		}
	};

	Classified.find(query, projection, paginate, function(err, data) {

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


/* GET /sys/classifieds/socid/:socid */
function getClassifiedsBySocid(req, res, next) {

	var socid = req.params.socid;
	var query = {socid: socid};
	var projection = {};
	var paginate = {
		sort:
		{
			_id: -1
		}
	};

	Classified.find(query, projection, paginate, function(err, data) {

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


/* GET /sys/classified/cid/:cid */
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


/* POST /sys/classified/remove */
function postClassifiedRemove(req, res, next) {

	var cid = req.body.cid;

	var params = [];
	params.push(cid);

	if(helper.validateParams(params) == false) {
		
		res.status(400).json({
			message: 'error_invalidparams'
		});

	} else {

		var query = {
			cid: cid
		};

		Classified.findOneAndRemove(query, function(err, rec) {

			if(err) {

				res.status(500).json({
					message: 'error_removeclassified'
				});

			} else {

				if(!rec) {
					res.status(200).json({
						status: 'suc',
						message: 'noclassified'
					});
				} else {
					notifier.classifiedRemoved(cid);
					res.status(200).json({
						status: 'suc',
						message: 'removed'
					});
				}
			}
		});
	}
}


/* POST /sys/classified/add */
function postClassifiedAdd(req, res, next) {

	var uid = req.uid;

	var category = req.body.category;
	var title = req.body.title;
	var details = req.body.details;
	var email = req.body.email;

	var name = req.body.name; 	// optional
	var phone = req.body.phone; 	// optional

	var societyname = req.body.societyname; 	// optional
	var city = req.body.city; 	// optional

	var params = [];
	params.push(category);
	params.push(title);
	params.push(details);
	params.push(email);

	if(helper.validateParams(params) == false) {
		
		res.status(400).json({
			message: 'error_invalidparams'
		});

	} else {
		
		var newClassified = {};
		newClassified._id = new mongoose.Types.ObjectId;
		newClassified.uid = uid;
		newClassified.category = category;
		newClassified.title = title;
		newClassified.details = details;
		newClassified.byname = name;
		newClassified.byemail = email;
		newClassified.byphone = phone;
		newClassified.bysocietyname = societyname;
		newClassified.bycity = city;

		helper.generateCid(function(cid) {

			if(!cid) {

				res.status(500).json({
					message: 'error_createcid'
				});

			} else {

				newClassified.cid = cid;

				new Classified(newClassified).save(function(err) {

					if(err) {

						res.status(500).json({
							message: 'error_newclassified'
						});

					} else {

						notifier.classifiedAdded(newClassified);
						res.status(200).json({
							status: 'suc',
							message: 'added'
						});
					}
				});
			}
		});
	}
}


/* GET /sys/contacts */
function getContacts(req, res, next) {

	var query = {};
	var projection = {};
	var paginate = {
		sort:
		{
			_id: -1
		}
	};

	Contact.find(query, projection, paginate, function(err, data) {

		if(err) {

			res.status(500).json({
				message: 'error_querycontact'
			});

		} else {

			res.status(200).json({
				status: 'suc',
				data: data || []
			});
		}
	});
}


/* GET /sys/contacts/pincode/:pincode */
function getContactsByPincode(req, res, next) {

	var pincode = req.params.pincode;
	var query = {pincode: pincode};
	var projection = {};
	var paginate = {
		sort:
		{
			_id: -1
		}
	};

	Contact.find(query, projection, paginate, function(err, data) {

		if(err) {

			res.status(500).json({
				message: 'error_querycontact'
			});

		} else {

			res.status(200).json({
				status: 'suc',
				data: data || []
			});
		}
	});
}


/* GET /sys/contacts/pincode/:pincode/category/:category */
function getContactsByPincodeAndCategory(req, res, next) {

	var pincode = req.params.pincode;
	var category = req.params.category;
	var query = {pincode: pincode, category: category};
	var projection = {};
	var paginate = {
		sort:
		{
			_id: -1
		}
	};

	Contact.find(query, projection, paginate, function(err, data) {

		if(err) {

			res.status(500).json({
				message: 'error_querycontact'
			});

		} else {

			res.status(200).json({
				status: 'suc',
				data: data || []
			});
		}
	});
}


/* GET /sys/contacts/socid/:socid/category/:category */
function getContactsBySocidAndCategory(req, res, next) {

	var socid = req.params.socid;
	var category = req.params.category;
	var query = {socid: socid, category: category};
	var projection = {};
	var paginate = {
		sort:
		{
			_id: -1
		}
	};

	Contact.find(query, projection, paginate, function(err, data) {

		if(err) {

			res.status(500).json({
				message: 'error_querycontact'
			});

		} else {

			res.status(200).json({
				status: 'suc',
				data: data || []
			});
		}
	});
}


/* POST /sys/contact/add */
function postContactAdd(req, res, next) {

	var uid = req.uid;

	var category = req.body.category;
	var title = req.body.title;
	var details = req.body.details;
	var email = req.body.email;

	var name = req.body.name; 	// optional
	var phone = req.body.phone; 	// optional

	var societyname = req.body.societyname; 	// optional
	var city = req.body.city; 	// optional

	var params = [];
	params.push(category);
	params.push(title);
	params.push(details);
	params.push(email);

	if(helper.validateParams(params) == false) {
		
		res.status(400).json({
			message: 'error_invalidparams'
		});

	} else {
		
		var newClassified = {};
		newClassified._id = new mongoose.Types.ObjectId;
		newClassified.uid = uid;
		newClassified.category = category;
		newClassified.title = title;
		newClassified.details = details;
		newClassified.byname = name;
		newClassified.byemail = email;
		newClassified.byphone = phone;
		newClassified.bysocietyname = societyname;
		newClassified.bycity = city;

		helper.generateCid(function(cid) {

			if(!cid) {

				res.status(500).json({
					message: 'error_createcid'
				});

			} else {

				newClassified.cid = cid;

				new Classified(newClassified).save(function(err) {

					if(err) {

						res.status(500).json({
							message: 'error_newclassified'
						});

					} else {

						notifier.classifiedAdded(newClassified);
						res.status(200).json({
							status: 'suc',
							message: 'added'
						});
					}
				});
			}
		});
	}
}


/* GET /sys/forums */
function getForums(req, res, next) {

	var query = {};
	var projection = {};
	var paginate = {
		sort:
		{
			_id: 1
		}
	};

	Forum.find(query, projection, paginate, function(err, data) {

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


/* GET /sys/forums/uid/:uid */
function getForumsByUid(req, res, next) {

	var uid = req.params.uid;
	var query = {uid: uid};
	var projection = {};
	var paginate = {
		sort:
		{
			_id: 1
		}
	};

	Forum.find(query, projection, paginate, function(err, data) {

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


/* GET /sys/forums/email/:email */
function getForumsByEmail(req, res, next) {

	var email = req.params.email;
	var emailreg = new RegExp(email, 'g');

	var query = {
		byemail: { $regex: emailreg, $options: "i" }
	};
	var projection = {};
	var paginate = {
		sort:
		{
			_id: 1
		}
	};

	Forum.find(query, projection, paginate, function(err, data) {

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


/* GET /sys/forums/socid/:socid */
function getForumsBySocid(req, res, next) {

	var socid = req.params.socid;
	var query = {socid: socid};
	var projection = {};
	var paginate = {
		sort:
		{
			_id: 1
		}
	};

	Forum.find(query, projection, paginate, function(err, data) {

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


/* GET /sys/forum/fid/:fid */
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


/* POST /sys/enquires */
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


/* POST /sys/enquires/email/:email */
function getEnquiresByEmail(req, res, next) {

	var email = req.params.email;
	var emailreg = new RegExp(email, 'g');

	var query = {
		byemail: { $regex: emailreg, $options: "i" }
	};
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


/* POST /sys/enquires/name/:name */
function getEnquiresByName(req, res, next) {

	var name = req.params.name;
	var namereg = new RegExp(name, 'g');
	
	var query = {
		byname: { $regex: namereg, $options: "i" }
	};
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


/* POST /sys/feedbacks */
function getFeedbacks(req, res, next) {

	var query = {};
	var projection = {};
	var sort = {sort:{_id:-1}};

	Feedback.find(query, projection, sort, function(err, data) {

		if(err) {

			res.status(500).json({
				message: 'error_queryfeedback'
			});

		} else {

			res.status(200).json({
				status: 'suc',
				data: data || []
			});
		}

	});
}


/* POST /sys/feedbacks/socid/:socid */
function getFeedbacksBySocid(req, res, next) {

	var socid = req.params.socid;
	var query = {socid: socid};
	var projection = {};
	var sort = {sort:{_id:-1}};

	Feedback.find(query, projection, sort, function(err, data) {

		if(err) {

			res.status(500).json({
				message: 'error_queryfeedback'
			});

		} else {

			res.status(200).json({
				status: 'suc',
				data: data || []
			});
		}

	});
}


/* POST /sys/feedbacks/email/:email */
function getFeedbacksByEmail(req, res, next) {

	var email = req.params.email;
	var emailreg = new RegExp(email, 'g');

	var query = {
		byemail: { $regex: emailreg, $options: "i" }
	};
	var projection = {};
	var sort = {sort:{_id:-1}};

	Feedback.find(query, projection, sort, function(err, data) {

		if(err) {

			res.status(500).json({
				message: 'error_queryfeedback'
			});

		} else {

			res.status(200).json({
				status: 'suc',
				data: data || []
			});
		}

	});
}


/* POST /sys/feedbacks/name/:name */
function getFeedbacksByName(req, res, next) {

	var name = req.params.name;
	var namereg = new RegExp(name, 'g');
	
	var query = {
		byname: { $regex: namereg, $options: "i" }
	};
	var projection = {};
	var sort = {sort:{_id:-1}};

	Feedback.find(query, projection, sort, function(err, data) {

		if(err) {

			res.status(500).json({
				message: 'error_queryfeedback'
			});

		} else {

			res.status(200).json({
				status: 'suc',
				data: data || []
			});
		}

	});
}


/* POST /sys/feedbacks/uid/:uid */
function getFeedbacksByUid(req, res, next) {

	var uid = req.params.uid;

	var query = {uid: uid};
	var projection = {};
	var sort = {sort:{_id:-1}};

	Feedback.find(query, projection, sort, function(err, data) {

		if(err) {

			res.status(500).json({
				message: 'error_queryfeedback'
			});

		} else {

			res.status(200).json({
				status: 'suc',
				data: data || []
			});
		}

	});
}


/* POST /sys/supports */
function getSupports(req, res, next) {

	var query = {};
	var projection = {};
	var sort = {sort:{_id:-1}};

	Support.find(query, projection, sort, function(err, data) {

		if(err) {

			res.status(500).json({
				message: 'error_querysupport'
			});

		} else {

			res.status(200).json({
				status: 'suc',
				data: data || []
			});
		}

	});
}


/* POST /sys/supports/socid/:socid */
function getSupportsBySocid(req, res, next) {

	var socid = req.params.socid;
	var query = {socid: socid};
	var projection = {};
	var sort = {sort:{_id:-1}};

	Support.find(query, projection, sort, function(err, data) {

		if(err) {

			res.status(500).json({
				message: 'error_querysupport'
			});

		} else {

			res.status(200).json({
				status: 'suc',
				data: data || []
			});
		}

	});
}


/* POST /sys/supports/email/:email */
function getSupportsByEmail(req, res, next) {

	var email = req.params.email;
	var emailreg = new RegExp(email, 'g');

	var query = {
		byemail: { $regex: emailreg, $options: "i" }
	};
	var projection = {};
	var sort = {sort:{_id:-1}};

	Support.find(query, projection, sort, function(err, data) {

		if(err) {

			res.status(500).json({
				message: 'error_querysupport'
			});

		} else {

			res.status(200).json({
				status: 'suc',
				data: data || []
			});
		}

	});
}


/* POST /sys/supports/name/:name */
function getSupportsByName(req, res, next) {

	var name = req.params.name;
	var namereg = new RegExp(name, 'g');
	
	var query = {
		byname: { $regex: namereg, $options: "i" }
	};
	var projection = {};
	var sort = {sort:{_id:-1}};

	Support.find(query, projection, sort, function(err, data) {

		if(err) {

			res.status(500).json({
				message: 'error_querysupport'
			});

		} else {

			res.status(200).json({
				status: 'suc',
				data: data || []
			});
		}

	});
}


/* POST /sys/supports/societyname/:societyname */
function getSupportsBySocietyname(req, res, next) {

	var societyname = req.params.societyname;
	var namereg = new RegExp(societyname, 'g');
	
	var query = {
		bysocietyname: { $regex: namereg, $options: "i" }
	};
	var projection = {};
	var sort = {sort:{_id:-1}};

	Support.find(query, projection, sort, function(err, data) {

		if(err) {

			res.status(500).json({
				message: 'error_querysupport'
			});

		} else {

			res.status(200).json({
				status: 'suc',
				data: data || []
			});
		}

	});
}


/* POST /sys/supports/city/:city */
function getSupportsByCity(req, res, next) {

	var city = req.params.city;
	var cityreg = new RegExp(city, 'g');
	
	var query = {
		bycity: { $regex: cityreg, $options: "i" }
	};
	var projection = {};
	var sort = {sort:{_id:-1}};

	Support.find(query, projection, sort, function(err, data) {

		if(err) {

			res.status(500).json({
				message: 'error_querysupport'
			});

		} else {

			res.status(200).json({
				status: 'suc',
				data: data || []
			});
		}

	});
}


/* POST /sys/supports/uid/:uid */
function getSupportsByUid(req, res, next) {

	var uid = req.params.uid;

	var query = {uid: uid};
	var projection = {};
	var sort = {sort:{_id:-1}};

	Support.find(query, projection, sort, function(err, data) {

		if(err) {

			res.status(500).json({
				message: 'error_queryfeedback'
			});

		} else {

			res.status(200).json({
				status: 'suc',
				data: data || []
			});
		}

	});
}


/* POST /sys/othersocieties/city/:city */
function getOtherSocietiesByCity(req, res, next) {

	var city = req.params.city;
	var cityreg = new RegExp(city, 'g');
	
	var query = {
		city: { $regex: cityreg, $options: "i" }
	};
	var projection = {};
	var sort = {sort:{_id:-1}};

	OtherSociety.find(query, projection, sort, function(err, data) {

		if(err) {

			res.status(500).json({
				message: 'error_queryothersociety'
			});

		} else {

			res.status(200).json({
				status: 'suc',
				data: data || []
			});
		}
	});
}


/* POST /user/logout */
function postLogout(req, res, next) {

	req.session.uid = null;
	req.session.google = false;
  	req.session.destroy(function(err) {

	  	res.status(200).json({
		    status: 'suc',
		    message: 'loggedout'
	  	});

	});
}


/*
	Model:
		1. Society
		2. User
		3. Notice
		4. Complaint
		5. Classified
		6. Contact
		7. Forum
		8. Notification
		9. Enquire
		10. Feedback
		11. Poll
		12. Club

	Action:
		1. find
		2. findOne
		3. findOneAndUpdate
		4. findOneAndRemove
*/
/* GET /sys/master */
function postMaster(req, res, next) {

	var uid = req.uid;

	var ModelCode = req.body.Model;
	var Action = req.body.Action;
	var Query = req.body.Query || null;
	var Projection = req.body.Projection || null;
	var Paginate = req.body.Paginate || null;

	if(Query) Query = JSON.parse(Query);
	if(Projection) Projection = JSON.parse(Projection);
	if(Paginate) Paginate = JSON.parse(Paginate);

	var Model;
	if(ModelCode == 1) Model = Society;
	else if(ModelCode == 2) Model = User;
	else if(ModelCode == 3) Model = Notice;
	else if(ModelCode == 4) Model = Complaint;
	else if(ModelCode == 5) Model = Classified;
	else if(ModelCode == 6) Model = Contact;
	else if(ModelCode == 7) Model = Forum;
	else if(ModelCode == 8) Model = Notification;
	else if(ModelCode == 9) Model = Enquire;
	else if(ModelCode == 10) Model = Feedback;
	else if(ModelCode == 11) Model = Poll;
	else if(ModelCode == 12) Model = Club;
	else if(ModelCode == 13) Model = Support;
	else if(ModelCode == 14) Model = OtherSociety;
	else {
		res.status(500).json({
			message: 'error_invalidmodel'
		});
		return;
	}

	if(Action == 1) {

		Model.find(Query, Projection, Paginate, function(err, data) {
			if(err) {
				res.status(500).json({
					message: 'error_find'
				});
			} else {
				res.status(200).json({
					status: 'suc',
					data: data || [],
				});
			}
		});

	} else if(Action == 2) {

		Model.findOne(Query, Projection, Paginate, function(err, data) {
			if(err) {
				res.status(500).json({
					message: 'error_findOne'
				});
			} else {
				res.status(200).json({
					status: 'suc',
					data: data || {},
				});
			}
		});

	} else if(Action == 3) {

		Model.findOneAndUpdate(Query, function(err) {
			if(err) {
				res.status(500).json({
					message: 'error_findOneAndUpdate'
				});
			} else {
				res.status(200).json({
					status: 'suc',
					data: 'updated',
				});
			}
		});

	} else if(Action == 4) {

		Model.findOneAndRemove(Query, function(err) {
			if(err) {
				res.status(500).json({
					message: 'error_findOneAndRemove'
				});
			} else {
				res.status(200).json({
					status: 'suc',
					data: 'removed',
				});
			}
		});

	} else {

		res.status(500).json({
			message: 'error_invalidaction'
		});
	}
}


/***********************************  END  ***********************************/