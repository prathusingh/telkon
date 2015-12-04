/******************************************************************************
 *
 *  header.js - HEADER file containing the globals
 *
 *****************************************************************************/


var gcm_server_key = "AIzaSyAoZ1uuMDYHFNTeBlM5jQf9AtkWJAbStjE";
var ua_device = 'Telkon App';
var sys_key = 'nonoHnNIUBIHIBNknlnlLKNlnNnNLnkNNnLLnl987B7B9b79h98bg9B978B9JBJbJBJbIGGBKPWQWESXI';
var oauth2 = {
	CLIENT_ID: '17816415120-15n69db7dm24tjd6bc68f79icff84sm7.apps.googleusercontent.com',
	CLIENT_SECRET: '9-Kffv6qjHdTR-_ppAqNAfro',
	REDIRECT_URL: 'http://localhost:3000/oauth2callback',
	params: {
    	access_type: 'offline', // will return a refresh token
    	scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile' // can be a space-delimited string or an array of scopes
  	}
}

var mail = {
	telkon: {
		username: 'telkonin@gmail.com',
		password: 'wELCOME$123321#'
	},
	help: {
		username: 'help.telkon@gmail.com',
		password: 'UmarAmna#123'
	},
	care: {
		username: 'care.telkon@gmail.com',
		password: 'UmarAmna#123'
	},
	noreply: {
		username: 'noreply.telkon@gmail.com',
		password: 'UmarAmna#123'
	},
	info: {
		username: 'info.telkon@gmail.com',
		password: 'telkonInfo#123'
	},
	master: {
		username: 'master.telkon@gmail.com',
		password: 'UmarAmna#123'
	},
	feedback: {
		username: 'feedback.telkon@gmail.com',
		password: 'UmarAmna#123'
	}
}

var recLimit = {
	member: {
		notices: 10,
		complaints: 10,
		classifieds: 12,
		contacts: 10,
		forums: 8,
		forumcomments: 6,
		notifications: 5,
		members: 12,
		clubs: 10,
		clubmembers: 10,
		clubevents: 6,
		societymembers: 10,
		societyclubs: 10,
		userclubs: 10
	},
	admin: {
		notices: 10,
		complaints: 10,
		members: 10,
		notifications: 5
	},
}

var logs = {
	isOn: true,
	client: 'client',
	dev: 'dev',
	morgan: 'morgan'
}

module.exports.gcm_server_key = gcm_server_key;
module.exports.ua_device = ua_device;
module.exports.sys_key = sys_key;
module.exports.oauth2 = oauth2;
module.exports.mail = mail;
module.exports.recLimit = recLimit;
module.exports.logs = logs;


/***********************************  END  ***********************************/