/******************************************************************************
 *
 *  guest.js - data service for DEVICE
 *
 *****************************************************************************/

var mongoose = require('mongoose');
var helper = require('../helper.js');

var User = require('../models/user.js');
var Society = require('../models/society.js');
var Notice = require('../models/notice.js');
var Complaint = require('../models/complaint.js');
var Classified = require('../models/classified.js');
var Contact = require('../models/contact.js');

module.exports = {

	getUsers 					: notImplemented,
	getUserById	 				: notImplemented,
	getUserByEmail 				: notImplemented,
	postUser 	 				: notImplemented,
	postUpdateName				: notImplemented,
	postUpdatePhone				: notImplemented,
	postResetPassword			: notImplemented,
	postDetails 				: notImplemented,
	postUpdateRegid				: notImplemented,
	getSocietiesByCity			: notImplemented,
	getUpdates					: notImplemented,
	getDataByType				: notImplemented,
	postReadByType				: notImplemented,
	postLogout					: notImplemented
};


////////////////////

/* NOT IMPLEMENTED ROUTES */
function notImplemented(req, res, next){
	next(new Error(
    	'Data service method for ' + req.method + ' ' + req.url+ ' is not implemented'
  	));
}

/***********************************  END  ***********************************/