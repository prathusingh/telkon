/******************************************************************************
 *
 *  user.js - data service for DEVICE
 *
 *****************************************************************************/

var mongoose = require('mongoose');
var moment = require('moment');
var helper = require('../helper.js');
var header = require('../header.js');
var mailer = require('../mailer.js');
var staticData = require('../static.js');
var telkonlogger = require('../logger');
var notifier = require('./notifier');

var User = require('../models/user.js');
var Society = require('../models/society.js');
var Notice = require('../models/notice.js');
var Complaint = require('../models/complaint.js');
var Classified = require('../models/classified.js');
var Contact = require('../models/contact.js');
var OtherSociety = require('../models/othersociety.js');

module.exports = {

	notImplemented		 				: notImplemented,
	postGetCities 						: postGetCities,
	postGetSocietiesByCity				: postGetSocietiesByCity,
	postGetLocalitiesByWord				: postGetLocalitiesByWord,
	postDetails	 						: postDetails,
	postNewDetails 						: postNewDetails,
	postPersonal						: postPersonal,
	postOfficial						: postOfficial,
	postCreateSociety					: postCreateSociety,
	postProfileData						: postProfileData,
	postSuspend							: postSuspend,
	postLogout							: postLogout
};


////////////////////

/* NOT IMPLEMENTED ROUTES */
function notImplemented(req, res, next){
	next(new Error(
    	'Data service method for ' + req.method + ' ' + req.url+ ' is not implemented'
  	));
}


/* POST /user/cities */
function postGetCities(req, res, next) {

	var cities = staticData.cities.member;

	res.status(200).json({
		status: 'suc',
		data: cities
	});
	telkonlogger.logSuc(req, res, 'Data sent successfully');
}


/* POST /user/societies/:city */
function postGetSocietiesByCity(req, res, next) {

	var city = req.params.city;

	var params = [];
	params.push(city);

	if(helper.validateParams(params) == false) {
			
		res.status(400).json({
			message: 'error_invalidparams'
		});
		telkonlogger.logErr(req, res, 'Invalid parameters');

	} else {

		var query = {city: city};
		var projection = {
			_id: 0,
			socid: 1,
			societyname: 1,
			societycode: 1,
			locality: 1,
			flatsample: 1
		};
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


/* POST /user/localities/:word */
function postGetLocalitiesByWord(req, res, next) {

	var word = req.params.word;
	var reg = new RegExp(word, 'g');

	var params = [];
	params.push(word);

	if(helper.validateParams(params) == false) {
			
		res.status(400).json({
			message: 'error_invalidparams'
		});
		telkonlogger.logErr(req, res, 'Invalid parameters');

	} else {

		var query = {
			locality: { $regex: reg, $options: "i" }
		};
		var projection = {
			_id: 0,
			socid: 1,
			societyname: 1,
			flatsample: 1
		};

		Society.find(query, projection, function(err, data) {
			
			if(err) {

				res.status(500).json({
					message: 'error_querysociety'
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


/* POST /user/details */
function postDetails(req, res, next) {

	var uid = req.uid;

	var flat = req.body.flat;
	var residencetype = req.body.residencetype;
	var socid = req.body.socid;
	var city = req.body.city;

	var query = {};
	var projection = {};

	var params = [];
	params.push(flat);
	params.push(residencetype);
	params.push(socid);
	params.push(city);

	if(helper.validateParams(params) == false) {
			
		res.status(400).json({
			message: 'error_invalidparams'
		});
		telkonlogger.logErr(req, res, 'Invalid parameters');

	} else {
		
		var role = req.user.role;

		if(role != 2) {

			res.status(403).json({
				message: 'error_fatal'
			});
			telkonlogger.logFatal(req, res, 'User is not a guestmember');

		} else {

			query = {uid: uid};

			User.findOne(query, function(err, user) {

				if(err) {

					res.status(500).json({
						status: 'suc',
						message: 'error'
					});
					telkonlogger.logErr(req, res, err.message);

				} else {

					flat = flat.replace(/[\. !@#$%^&*()<>?{}+,:-]+/g, "");
					flat = flat.toUpperCase();
						
					user.flat = flat;
					user.residencetype = residencetype;
					user.city = city;
					user.socid = socid;
					user.role = 4;
					user.membersince = moment();

					query = {socid: socid};
					projection = {
						_id: 0,
						societyname: 1
					};

					Society.findOne(query, function(err, society) {
							
						if(err) {
								
							res.status(500).json({
								message: 'error_querysociety'
							});
							telkonlogger.logErr(req, res, err.message);

						} else {

							if( typeof society === 'undefined' ||
								society === null ||
								society === {}) {

								/* FATAL: Society is not supported yet */
								res.status(403).json({
									status: 'suc',
									message: 'error_fatal',
								});
								telkonlogger.logFatal(req, res, 'Society is not present in db');

							} else {

								society.totalmembers = society.totalmembers + 1;
								if(residencetype == 0) {
									society.totalowners = society.totalowners + 1;
								}
								else if(residencetype == 0) {
									society.totaltenants = society.totaltenants + 1;
								}

								society.save(function(err) {
								});

								user.societyname = society.societyname;
								req.session.socid = socid;

								user.save(function(err) {
										
									if(err) {

										res.status(500).json({
											message: 'error_saveuser'
										});
										telkonlogger.logErr(req, res, err.message);

									} else {

										var notiData = {
											socid: user.socid,
											uid: user.uid,
											email: user.email,
											name: user.name
										}
										notifier.memberAdded(notiData);
										res.status(200).json({
											status: 'suc',
											message: 'registered',
											data: {}
										});
										telkonlogger.logSuc(req, res, 'Updated successfully');
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


/* POST /user/new/details */
function postNewDetails(req, res, next) {

	var uid = req.uid;

	var societyname = req.body.societyname;
	var city = req.body.city;

	var query = {};
	var projection = {};

	var params = [];
	params.push(societyname);
	params.push(city);

	if(helper.validateParams(params) == false) {
			
		res.status(400).json({
			message: 'error_invalidparams'
		});
		telkonlogger.logErr(req, res, 'Invalid parameters');

	} else {
		
		var role = req.user.role;

		if(role != 2) {

			res.status(403).json({
				message: 'error_fatal'
			});
			telkonlogger.logFatal(req, res, 'User is not a guestmember');

		} else {
			
			query = {uid: uid};

			User.findOne(query, function(err, user){
				
				if(err) {
						
					res.status(500).json({
						message: 'error_queryuser'
					});
					telkonlogger.logErr(req, res, err.message);

				} else {

					societyname = helper.toTitleCase(societyname);
					city = helper.toTitleCase(city);

					var user = req.user;
					var newOtherSociety = {};

					newOtherSociety._id = new mongoose.Types.ObjectId;
					newOtherSociety.uid = user.uid;
					newOtherSociety.byname = user.name;
					newOtherSociety.byemail = user.email;
					newOtherSociety.byphone = user.phone;
					
					newOtherSociety.societyname = societyname;
					newOtherSociety.city = city;

					new OtherSociety(newOtherSociety).save(function(err) {

						if(err) {

							res.status(500).json({
								message: 'error_newothersociety'
							});
							telkonlogger.logErr(req, res, err.message);

						} else {

							var telkonEmail = header.mail.telkon.username;
							var mailOptions = {};
							var mailList = [];
							mailList.push(telkonEmail);

							mailOptions['to'] = mailList;
							mailOptions['subject'] =  '[OtherSociety] ' + newOtherSociety.societyname;

							mailOptions['text'] = 	'New society creation request has been received\n'+
													'Name: ' + newOtherSociety.byname + '\n' +
													'Email: ' + newOtherSociety.byemail + '\n' +
													'Phone: ' + newOtherSociety.byphone + '\n' +
													'Society: ' + newOtherSociety.societyname + '\n' +
													'City: ' + newOtherSociety.city + '\n';
													
							mailOptions['html'] = 	'<p>New Feedback/Suggestion has been received</p>' +
													'<p>' +
														'Name: ' + newOtherSociety.byname + '<br>' +
														'Email: ' + newOtherSociety.byemail + '<br>' +
														'Phone: ' + newOtherSociety.byphone + '<br>' +
														'Society: ' + newOtherSociety.societyname + '<br>' +
														'City: ' + newOtherSociety.city + '<br>' +
													'</p>'

							mailer.infoSendMail(mailList, mailOptions, function(err, info) { });
							notifier.othersocietyAdded(newOtherSociety);
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


/* POST /user/personal */
function postPersonal(req, res, next) {

	var uid = req.uid;

	var name = req.body.name;
	var phone = req.body.phone;

	var query = {};

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
			uid: uid
		};

		User.findOne(query, function(err, user){
			
			if(err) {
					
				res.status(500).json({
					message: 'error_queryuser'
				});
				telkonlogger.logErr(req, res, err.message);

			} else {

				/* Update the User profile */
				user.phone = phone;
				user.name = helper.toTitleCase(name);

				user.save(function(err) {

					if(err) {

						res.status(500).json({
							message: 'error_saveuser'
						});
						telkonlogger.logErr(req, res, err.message);

					} else {

						/* Updated the details successfully */
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


/* POST /user/official */
function postOfficial(req, res, next) {

	var uid = req.uid;

	var name = req.body.name;
	var phone = req.body.phone;
	var position = req.body.position;
	var department = req.body.department;

	var query = {};

	var params = [];
	params.push(name);

	if(helper.validateParams(params) == false) {
			
		res.status(400).json({
			message: 'error_invalidparams'
		});
		telkonlogger.logErr(req, res, 'Invalid parameters');

	} else {
		
		query = {
			uid: uid
		};

		name = helper.toTitleCase(name);
		position = helper.toTitleCase(position);
		//department = helper.cap(department);

		User.findOne(query, function(err, user){
			
			if(err) {
					
				res.status(500).json({
					message: 'error_queryuser'
				});
				telkonlogger.logErr(req, res, err.message);

			} else {

				user.name = name;
				user.phone = phone;
				user.position = position;
				user.department = department;

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


/* POST /create/society */
function postCreateSociety(req, res, next) {

	var uid = req.uid;

	var societyname = req.body.societyname;
	var pincode = req.body.pincode;
	var locality = req.body.locality;
	var city = req.body.city;

	var query = {};
	var projection = {};

	var params = [];
	params.push(societyname);
	params.push(pincode);
	params.push(locality);
	params.push(city);

	if(helper.validateParams(params) == false) {
			
		res.status(400).json({
			message: 'error_invalidparams'
		});
		telkonlogger.logErr(req, res, 'Invalid parameters');

	} else {

		if(req.socid) {

			/* Not Allowed - A user can be admin of only one society at a time */
            res.status(200).json({
                status: 'suc',
                message: 'error_notallowed'
            });
            telkonlogger.logSuc(req, res, 'Already admin of other society');

		} else {

			societyname = helper.toTitleCase(societyname);

			var newSociety = {};
			newSociety._id = new mongoose.Types.ObjectId;
			newSociety.createdby = uid;
			newSociety.societyname = societyname;
			newSociety.pincode = pincode;
			newSociety.locality = locality;
			newSociety.city = city;
			newSociety.issupported = true;
			newSociety.supportlevel = 0;

			helper.generateSocid(function(socid) {

				if(!socid) {
					res.status(500).json({
						message: 'error_createsocid'
					});
					telkonlogger.logErr(req, res, 'Unable to create new SOCID');

					return;

				} else {

					newSociety.socid = socid;
					helper.generateSocietyCode(city, function(societycode) {

						if(!societycode) {

							res.status(500).json({
								message: 'error_createsocietycode'
							});
							telkonlogger.logErr(req, res, 'Unable to create new SOC CODE');

						} else {
							
							newSociety.societycode = societycode;
							new Society(newSociety).save(function(err) {
											
								if(err){
										
									res.status(500).json({
										status: 'suc',
										message: 'error_newsociety'
									});
									telkonlogger.logErr(req, res, err.message);

								} else {

									User.update({
										uid: uid
									}, {
										role: 6,
										socid: newSociety.socid,
										societyname: newSociety.societyname,
										city: newSociety.city,
										adminsince: moment()

									}, function(err) {

										if(err) {

											res.status(500).json({
												message: 'error_updateuser'
											});
											telkonlogger.logErr(req, res, err.message);

										} else {
/*
											var newNotice = {};
											newNotice._id = new mongoose.Types.ObjectId;
											newNotice.title = 'Welcome to TELKON';
											newNotice.desc = 'Greetings!\n\n';
											newNotice.validfor = validfor;
											newNotice.meantfor = meantfor;
											newNotice.byname = user.name;
											newSociety.issupported = true;
											newSociety.supportlevel = 0;
*/

											res.status(200).json({
												status: 'suc',
												message: 'created'
											});
											telkonlogger.logSuc(req, res, 'Created successfully - ' + societyname + ', ' + city);
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
}


/* POST /user/profile/data */
function postProfileData(req, res, next) {

	var user = req.user;

	var data = {
		name: user.name,
		email: user.email,
		residencetype: user.residencetype,
		phone: user.phone,
		flat: user.flat,
		societyname: user.societyname,
		city: user.city
	}

	res.status(200).json({
		status: 'suc',
		data: data
	});
	telkonlogger.logSuc(req, res, 'Data sent successfully');
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
	  	telkonlogger.logSuc(req, res, 'Logged out successfully');

	});
}


/* POST /user/suspend */
function postSuspend(req, res, next) {

	var uid = req.uid;
	var socid = req.socid;

	var query = {
		uid: uid,
		socid: socid,
		isactive: true
	};

	User.findOneAndRemove(query, function(err) {

		if(err) {

			res.status(500).json({
				message: 'error_queryuser'
			});
			telkonlogger.logErr(req, res, err.message);

		} else {

			query = {uid: uid};
			Notification.findOneAndRemove(query, function(err) {
				req.session.uid = null;
	  			req.session.destroy(function(err) {
				});
				res.status(200).json({
					status: 'suc',
					message: 'suspended'
				});
				telkonlogger.logSuc(req, res, 'Account suspended successfully - ' + req.user.email);

			});
		}
	});
}


/***********************************  END  ***********************************/