/******************************************************************************
 *
 *  noticeService.js - data service for NOTICE
 *
 *****************************************************************************/

var Model = require('../../models/notice.js');

module.exports = {

	getAllNotices 				: getAllNotices,
	getNoticesByQuery			: getNoticesByQuery,
	getSingleNotice	 			: getSingleNotice
};


////////////////////

/* NOT IMPLEMENTED ROUTES */
function notImplemented(req, res, next){
  next(new Error(
    'Data service method for ' + req.method + ' ' + req.url+ ' is not implemented'
  ));
}

function getAllNotices(projection, callback) {

	Model.find({}, projection, function(err, data){
		callback(data);
	});
}

function getNoticesByQuery(query, projection, callback) {

	Model.find(query, projection, function(err, data){
		callback(data);
	});
}

function getSingleNotice(query, projection, callback) {

	Model.findOne(query, projection, function(err, data){
		callback(data);
	});
}

/***********************************  END  ***********************************/