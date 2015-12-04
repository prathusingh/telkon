/******************************************************************************
 *
 *  device.js - data service for DEVICE
 *
 *****************************************************************************/

var mongoose = require('mongoose');

var societyService = require('./services/societyService');
var userService = require('./services/userService');
var noticeService = require('./services/noticeService');
var helper = require('../helper.js');

var User = require('../models/user.js');
var Society = require('../models/society.js');
var Notice = require('../models/notice.js');



module.exports = {

	getSocietiesByCity 			: getSocietiesByCity,
	getUserById	 				: getUserById,
	getUserByEmail 				: getUserByEmail,
	getNoticeById 	 			: getNoticeById,
	getNoticesBySocietyId		: getNoticesBySocietyId,
	resetPassword				: resetPassword,
	postFormRegister			: postFormRegister,
	postDetails					: postDetails,
	getNotices 					: getNotices,
	postUpdateProfile			: postUpdateProfile
};


////////////////////

/* NOT IMPLEMENTED ROUTES */
function notImplemented(req, res, next){
	next(new Error(
    	'Data service method for ' + req.method + ' ' + req.url+ ' is not implemented'
  	));
}


/* GET /device/societies/city/:city */
function getSocietiesByCity(req, res, next) {

	var query = {};
	var projection = {_id: 0, societyname: 1, socid: 1};

	var city = req.params.city;

	if(typeof city === 'undefined') {
		next(new Error(
    		'invalid'
  		));
	} else {

		query.city = city;

		societyService.getSocietiesByQuery(query, projection, function(data) {
			res.status(200).json({
				status: 'suc',
				data: data
			});
		});
	}
}

/* GET /device/user/email/:email */
function getUserByEmail(req, res, next) {

	var query = {};
	var projection = {_id:1, flat:1, socid:1, city:1, email:1, name: 1, phone:1};

	var email = req.params.email;

	if(typeof email === 'undefined') {
		next(new Error(
    		'invalid'
  		));
	} else {

		query.email = email;

		userService.getSingleUser(query, projection, function(data) {
			res.status(200).json({
				status: 'suc',
				data: data
			});
		});
	}
}

/* GET /device/user/:uid */
function getUserById(req, res, next) {

	var query = {};
	var projection = {_id:0, flat:1, socid:1, city:1, email:1, name: 1, phone:1};

	var uid = req.params.uid;

	if(typeof uid === 'undefined') {
		next(new Error(
    		'invalid'
  		));
	} else {

		query.uid = uid;

		userService.getSingleUser(query, projection, function(data) {
			res.status(200).json({
				status: 'suc',
				data: data
			});
		});
	}
}

/* GET /device/notice/:nid */
function getNoticeById(req, res, next) {

	var query = {};
	var projection = {_id:0, title:1, contentshort:1, contenturl:1, byname:1, nyposition:1, bysocietyname:1, fromdate:1, todate:1};

	var nid = req.params.nid;

	if(typeof nid === 'undefined') {
		next(new Error(
    		'invalid'
  		));
	} else {

		query.nid = nid;

		noticeService.getSingleNotice(query, projection, function(data) {
			res.status(200).json({
				status: 'suc',
				data: data
			});
		});
	}
}


/* GET /device/notices/society/:socid */
function getNoticesBySocietyId(req, res, next) {

	var query = {};
	var projection = {_id:0, title:1, contentshort:1, contenturl:1, byname:1, nyposition:1, bysocietyname:1, fromdate:1, todate:1};

	var socid = req.params.socid;

	if(typeof socid === 'undefined') {
		next(new Error(
    		'invalid'
  		));
	} else {

		query.socid = socid;

		noticeService.getNoticesByQuery(query, projection, function(data) {
			res.status(200).json({
				status: 'suc',
				data: data
			});
		});
	}
}

/* POST /device/resetpassword */
function resetPassword(req, res, next) {

	res.status(200).json('suc');
}


/* POST /formRegister */
function postFormRegister(req, res, next) {

	var email = req.body.email;
	var password = req.body.password;

	if(typeof email === 'undefined' ||
		typeof password === 'undefined') {
		next(new Error(
    		'invalid'
  		));
	} else {

		var query = {};
		var projection = {_id:0, flat:1, socid:1, city:1, email:1, name: 1, phone:1, password:1};

		query.email = email;

		userService.getSingleUser(query, projection, function(data) {

			if(data == null) {

				/* Create a new USER */

				var user = {};

				user._id = new mongoose.Types.ObjectId;
				user.uid = generateID();
				user.email = email;
				user.password = password;

				userService.formRegister(user, function(status){
					if(status == 1) {
						res.status(200).json({
							status: 'suc',
							authtoken: user.uid
						});
					} else {
						next(new Error(
		    				'error'
		  				));
					}
				});
			} else {

				/* USER already exists */

				/* Authenticate with password */
				if(data.password === password) {
					res.json({
						status: 'suc',
						data: data
					});
				} else {
					/* Wrong Password */
					next(new Error(
		    			'unauthorised'
		  			));
				}
			}
		});
	}
}


/* POST /details */
function postDetails(req, res, next) {

	var city = req.body.city;
	var socid = req.body.socid;
	var flat = req.body.flat;
	var regid = req.body.regid;

	var uid = req.headers.authtoken;

	if(typeof city === 'undefined' || 
		typeof socid === 'undefined' || 
		typeof flat === 'undefined' ||
		typeof regid === 'undefined' ||
		typeof uid === 'undefined') {

		next(new Error(
    		'invalid'
  		));
	} else {

		var query = {uid: uid};
		var projection = {_id:1, flat:1, socid:1, city:1, regid:1};

		User.findOne(query, projection, function(err, user) {

			if(err) {
				next(new Error(
    				'error'
  				));
			} else {
				if(user == null) {

					/* Fatal Error */
					next(new Error(
			    		'fatal'
			  		));

				} else {

					if(typeof user.city !== 'undefined' ||
						typeof user.socid !== 'undefined' ||
						typeof user.flat !== 'undefined' ||
						typeof user.regid !== 'undefined') {

						/* Fatal Error */
						next(new Error(
				    		'fatal'
			  			));

					} else {

						/* Update the USER record */

						user.city = city;
						user.socid = socid;
						user.flat = flat;
						user.regid = regid;

						user.save(function(err){
							if(err) {
								next(new Error(
	    							'error'
	  							));
							} else {
								res.status(200).json({
									status: 'suc',
									data: {}
								});
							}
						});
					}

					
				}
			}

				
		});
	}
}

/* POST /profile */
function postUpdateProfile(req, res, next) {


}

/* POST /notices */
function getNotices(req, res, next) {

	var uid = req.headers.authtoken;

	if(typeof uid === 'undefined') {

		/* Fatal Error */
		next(new Error(
			'fatal'
		));

	} else {

		var queryUser = {uid: uid};
		var projectionUser = {_id:0, socid:1};

		User.findOne(queryUser, projectionUser, function(err, user){
			if(err) {
				next(new Error(
					'error'
				));
			} else {

				var queryNotice = {socid: user.socid};
				var projectionNotice = {_id:0, nid:1, title:1, contentshort:1, contenturl:1, byname:1, bydepartment:1, byposition:1, societyname:1, fromdate:1, todate:1};
				
				Notice.find(queryNotice, projectionNotice, function(err, notices){
					if(err) {
						next(new Error(
							'error'
						));
					} else {
						res.status(200).json({
							status: 'suc',
							data: notices
						});
					}
				});
			}
		})
	}
}

function generateID() {
	var timestamp = new Date().getUTCMilliseconds();
	return timestamp + "";
}

/***********************************  END  ***********************************/