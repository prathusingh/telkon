/******************************************************************************
 *
 *  logger.js - LOGGER service for Telkon
 *
 *****************************************************************************/

var log = require('imagemin-log');
var morgan = require('morgan');
var fs = require('fs');
var moment = require('moment');
var header = require('./header.js');


var LOG_FILE_NAME = header.logs.client;
var LOG_FILE_NAME_DEV = header.logs.dev;
var LOG_IS_ON = header.logs.isOn;

var log_file = fs.createWriteStream(__dirname + '/logs/' + LOG_FILE_NAME + '.log', {flags : 'a'});
var log_file_dev = fs.createWriteStream(__dirname + '/public/devlogs/' + LOG_FILE_NAME_DEV + '.log', {flags : 'a'});


function logMessage(req, res, message, type) {

  if(!LOG_IS_ON) return;
  
  var info= '';
  if(type != 5) {
    info = getReqInfo(req, res);  
  }

  var TAG = '';

  if(type == 0) TAG = 'SUC';
  else if(type == 1) TAG = 'INFO';
  else if(type == 2) TAG = 'INFO';
  else if(type == 3) TAG = 'FATAL';
  else if(type == 4) TAG = 'ERROR';
  else if(type == 5) TAG = 'SYSTEM';

  log_file.write(TAG + ': ' + info + ' ==> ' + message + '\n');
  logDev(req, res, TAG + ': ' + info + ' ==> ' + message + '\n');

}


module.exports = {

  logSuc                    : logSuc,
  logInfo                   : logInfo,
  logWarn                   : logWarn,
  logFatal                  : logFatal,
  logErr                    : logErr,
  logDev                    : logDev,
  logSys                    : logSys

};

////////////////////

/* NOT IMPLEMENTED ROUTES */
function notImplemented(req, res, next) {
  next(new Error(
    'Data service method for ' + req.method + ' ' + req.url + ' is not implemented'
  ));
}


function logSuc(req, res, message) {
  logMessage(req, res, message, 0);
}

function logInfo(req, res, message) {
  logMessage(req, res, message, 1);
}

function logWarn(req, res, message) {
  logMessage(req, res, message, 2);
}

function logFatal(req, res, message) {
  logMessage(req, res, message, 3);
}

function logErr(req, res, message) {
  logMessage(req, res, message, 4);
}

function logDev(req, res, message) {
  log_file_dev.write(message);
}

function logSys(message) {
  logMessage(null, null, message, 5);
}
////////////////////




function getReqInfo(req, res) {

  var info = '';

  if(req && res) {

    var method = req.method || 'METHOD';
    var url = req.originalUrl || req.url || 'URL';
    var ip = getip(req) || 'IP'; 
    var useragent = req.headers['user-agent'] || 'USER-AGENT';
    var date = moment().format('lll') || 'DATE';
    var restime = getResponseTime(req, res) || 'RESPONSE-TIME';
    var status = res._header ? res.statusCode : 'RESPONSE-STATUS';
    var uid = req.uid || 'AUTH';

    info = date + ' * '
      + ip + ' * '
      + uid + ' * '
      +  method + ' * '
      + url + ' * '
      + status + ' * '
      + restime + ' ms';
      //+ useragent;
  }
  
  return info;
}


function getip(req) {
  return req.ip
    || req._remoteAddress
    || (req.connection && req.connection.remoteAddress)
    || undefined;
}

function getResponseTime(req, res) {
  if (!res._header || !req._startAt) return '';
  var diff = process.hrtime(req._startAt);
  var ms = diff[0] * 1e3 + diff[1] * 1e-6;
  return ms.toFixed(3);
}

/***********************************  END  ***********************************/
