/******************************************************************************
 *
 *  societyService.js - data service for SOCIETY
 *
 *****************************************************************************/

var Model = require('../../models/society.js');

module.exports = {

	getAllSocieties 			: getAllSocieties,
	getSocietiesByQuery			: getSocietiesByQuery,
	getSingleSociety	 		: getSingleSociety
};


////////////////////

/* NOT IMPLEMENTED ROUTES */
function notImplemented(req, res, next){
  next(new Error(
    'Data service method for ' + req.method + ' ' + req.url+ ' is not implemented'
  ));
}

function getAllSocieties(projection, callback) {

	Model.find({}, projection, function(err, data){
		callback(data);
	});
}

function getSocietiesByQuery(query, projection, callback) {

	Model.find(query, projection, function(err, data){
		callback(data);
	});
}

function getSingleSociety(query, projection, callback) {

	Model.findOne(query, projection, function(err, data){
		callback(data);
	});
}

/***********************************  END  ***********************************/