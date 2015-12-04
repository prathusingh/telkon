/******************************************************************************
 *
 *  userService.js - data service for USER
 *
 *****************************************************************************/

var Model = require('../../models/user.js');

module.exports = {

	getAllUsers 				: getAllUsers,
	getUsersByQuery	 	 		: getUsersByQuery,
	getSingleUser				: getSingleUser,
	formRegister				: formRegister,
	details						: details
};


////////////////////

/* NOT IMPLEMENTED ROUTES */
function notImplemented(req, res, next){
  next(new Error(
    'Data service method for ' + req.method + ' ' + req.url+ ' is not implemented'
  ));
}

function getAllUsers(projection, callback) {

	Model.find({}, projection, function(err, data) {
		callback(data);
	});
}

function getUsersByQuery(query, projection, callback) {

	Model.find(query, projection, function(err, data) {
		callback(data);
	});
}

function getSingleUser(query, projection, callback) {

	Model.findOne(query, projection, function(err, data) {
		callback(data);
	});
}

function formRegister(user, callback) {

	console.log(user);

	new Model(user).save(function(err) {
		if(err) {
			console.log(0);
			callback(0);
		} else {
			console.log(1);
			callback(1);
		}
	});
}

function details(query, details, callback) {

	Model.findOne(query, details, function(err, data) {
		if(err) {
			callback(0);
		} else {
			callback(1);
		}
	});
}

/***********************************  END  ***********************************/