/******************************************************************************
 *
 *  auth.js - data service for AUTHENTICATION
 *
 *****************************************************************************/

var mongoose = require('mongoose');
var fs = require('fs');
var notifier = require('./notifier');
var moment = require('moment');
var helper = require('../helper.js');
var header = require('../header.js');
var mailer = require('../mailer.js');
var telkonlogger = require('../logger');

var User = require('../models/user.js');
var Society = require('../models/society.js');
var Notification = require('../models/notification.js');
var Enquire = require('../models/enquire.js');

module.exports = {

	getPing							: getPing,
	postRegisterForm				: postRegisterForm,
	postRegisterSys					: postRegisterSys,
	postRegisterAdmin				: postRegisterAdmin,
	getLoginGoogleUrl				: getLoginGoogleUrl,
	postRegisterGoogle				: postRegisterGoogle,
	postRecover						: postRecover,
	getLoginForm 					: getLoginForm,
	postLoginForm 					: postLoginForm,
	postLoginSys					: postLoginSys,
	postDeviceLoginForm 			: postDeviceLoginForm,
	postEnquireAdd					: postEnquireAdd
	

};


////////////////////


/* NOT IMPLEMENTED ROUTES */
function notImplemented(req, res, next) {
  next(new Error(
    'Data service method for ' + req.method + ' ' + req.url+ ' is not implemented'
  ));
}


/* GET /auth/ping */
function getPing(req, res, next) {
	res.send('pong');
}


/* POST /auth/register/form */
function postRegisterForm(req, res, next) {

	var email = req.body.email;
	var password = req.body.password;
	var query = {};
	var projection = {};
	
	var params = [];
	params.push(email);
	params.push(password);

	if(helper.validateParams(params) == false) {
		
		res.status(400).json({
			message: 'error_invalidparams'
		});
		telkonlogger.logErr(req, res, 'Invalid parameters');

	} else {

		if(helper.validateEmail(email) == false) {

			res.status(200).json({
				status: 'suc',
				message: 'error_invalidemail'
			});
			telkonlogger.logFatal(req, res, 'Invalid Email ID - ' + email);

		} else if(password.length < 6) {

			res.status(200).json({
				status: 'suc',
				message: 'error_invalidpassword'
			});
			telkonlogger.logFatal(req, res, 'Password length < 6');

		} else {

			/* Check if the USER exists */
			query = {email: email};
			projection = {
				_id: 1,
				uid: 1,
				password: 1
			};

			User.findOne(query, projection, function(err, user) {
				if(err) {
					
					res.status(500).json({
						message: 'error_queryuser'
					});
					telkonlogger.logErr(req, res, err.message);

				} else {

					if( typeof user === 'undefined' ||
						user === null ||
						user === {}) {

						/* Email ID is available, register it now */
						var newUser = {};
						newUser._id = new mongoose.Types.ObjectId;
						newUser.role = 2;
						newUser.email = email;
						newUser.password = password;

						helper.generateUid(function(uid) {

							if(!uid) {

								res.status(500).json({
									message: 'error_createuid'
								});
								telkonlogger.logErr(req, res, 'Unable to create new UID');

							} else {

								newUser.uid = uid;

								new User(newUser).save(function(err) {
									if(err){

										res.status(500).json({
											message: 'error_newuser'
										});
										telkonlogger.logErr(req, res, err.message);

									} else {

										var newNotification = {};
										newNotification._id = new mongoose.Types.ObjectId;
										newNotification.uid = newUser.uid;
													
										new Notification(newNotification).save(function(err) {
											if(err){

												res.status(500).json({
													message: 'error_newnotification'
												});
												telkonlogger.logErr(req, res, err.message);

											} else {

												/* User has been registsred. Log him in, too */
												notifier.userRegistered(newUser.uid);
												req.session.uid = newUser.uid;
												res.status(200).json({
													status: 'suc',
													message: 'registered'
												});
												telkonlogger.logSuc(req, res, 'Member registered successfully - ' + email);
											}
										});
									}
								});
							}
						});

					} else {

						/* Email is already registered */
						res.status(200).json({
							status: 'suc',
							message: 'error_unavailable'
						});
						telkonlogger.logSuc(req, res, 'Email ID is already registered ' + email);

					}
				}
			});
		}
	}
}


/* POST /auth/register/sys */
function postRegisterSys(req, res, next) {

	var email = req.body.email;
	var password = req.body.password;
	var key = req.body.key;
	var query = {};
	var projection = {};

	var params = [];
	params.push(email);
	params.push(password);
	params.push(key);

	if(helper.validateParams(params) == false) {
		
		res.status(400).json({
			message: 'error_invalidparams'
		});
		telkonlogger.logErr(req, res, 'Invalid parameters');

	} else {

		if(helper.validateEmail(email) == false) {

			res.status(200).json({
				status: 'suc',
				message: 'error_invalidemail'
			});
			telkonlogger.logFatal(req, res, 'Invalid Email ID - ' + email);

		} else if(password.length < 6) {

			res.status(200).json({
				status: 'suc',
				message: 'error_invalidpassword'
			});
			telkonlogger.logFatal(req, res, 'Password length < 6');

		} else {

			var SYS_KEY = header.sys_key;

			if(key !== SYS_KEY) {

				res.status(200).json({
					status: 'suc',
					message: 'error_invalidkey'
				});
				telkonlogger.logFatal(req, res, 'Invalid key - ' + key);

			} else {

				/* Check if the USER exists */

				query = {email: email};
				projection = {
					_id: 1,
					uid: 1,
					password: 1
				};

				User.findOne(query, projection, function(err, user) {
					if(err) {
						
						res.status(500).json({
							message: 'error_queryuser'
						});
						telkonlogger.logErr(req, res, err.message);

					} else {

						if( typeof user === 'undefined' ||
							user === null ||
							user === {}) {

							/* Email ID is available, register it now */
							var newUser = {};
							newUser._id = new mongoose.Types.ObjectId;
							newUser.role = 0;
							newUser.email = email;
							newUser.password = password;

							helper.generateUid(function(uid) {

								if(!uid) {

									res.status(500).json({
										message: 'error_createuid'
									});
									telkonlogger.logErr(req, res, 'Unable to create new UID');

								} else {

									newUser.uid = uid;

									new User(newUser).save(function(err) {
										if(err){

											res.status(500).json({
												message: 'error_newuser'
											});
											telkonlogger.logErr(req, res, err.message);

										} else {

											var newNotification = {};
											newNotification._id = new mongoose.Types.ObjectId;
											newNotification.uid = newUser.uid;
														
											new Notification(newNotification).save(function(err) {
												if(err){

													res.status(500).json({
														message: 'error_newnotification'
													});
													telkonlogger.logErr(req, res, err.message);

												} else {

													req.session.uid = newUser.uid;
													res.status(200).json({
														status: 'suc',
														message: 'registered'
													});
													telkonlogger.logSuc(req, res, 'Sys registered successfully - ' + email);
												}
											});
										}
									});
								}
							});

						} else {

							/* Email is already registered */
							res.status(200).json({
								status: 'suc',
								message: 'error_unavailable'
							});
							telkonlogger.logSuc(req, res, 'Email ID is already registered ' + email);
							
						}
					}
				});

			}
		}
	}
}


/* POST /auth/register/admin */
function postRegisterAdmin(req, res, next) {

	var email = req.body.email;
	var password = req.body.password;
	var query = {};
	var projection = {};

	var params = [];
	params.push(email);
	params.push(password);

	if(helper.validateParams(params) == false) {
		
		res.status(400).json({
			message: 'error_invalidparams'
		});
		telkonlogger.logErr(req, res, 'Invalid parameters');

	} else {

		if(helper.validateEmail(email) == false) {

			res.status(200).json({
				status: 'suc',
				message: 'error_invalidemail'
			});
			telkonlogger.logFatal(req, res, 'Invalid Email ID - ' + email);

		} else if(password.length < 6) {

			res.status(200).json({
				status: 'suc',
				message: 'error_invalidpassword'
			});
			telkonlogger.logFatal(req, res, 'Password length < 6');

		} else {

			/* Check if the USER exists */

			query = {email: email};
			projection = {
				_id: 1,
				uid: 1,
				password: 1
			};

			User.findOne(query, projection, function(err, user){
				if(err) {
					
					res.status(500).json({
						message: 'error_queryuser'
					});
					telkonlogger.logErr(req, res, err.message);

				} else {

					if( typeof user === 'undefined' ||
						user === null ||
						user === {}) {

						/* Email ID is available, register it now */
						var newUser = {};
						newUser._id = new mongoose.Types.ObjectId;
						newUser.email = email;
						newUser.password = password;
						newUser.role = 3;

						helper.generateUid(function(uid) {

							if(!uid) {

								res.status(500).json({
									message: 'error_createuid'
								});
								telkonlogger.logErr(req, res, 'Unable to create new UID');

							} else {

								newUser.uid = uid;

								new User(newUser).save(function(err) {
									if(err){

										res.status(500).json({
											message: 'error_newuser'
										});
										telkonlogger.logErr(req, res, err.message);

									} else {

										var newNotification = {};
										newNotification._id = new mongoose.Types.ObjectId;
										newNotification.uid = newUser.uid;
													
										new Notification(newNotification).save(function(err) {
											if(err){

												res.status(500).json({
													message: 'error_newnotification'
												});
												telkonlogger.logErr(req, res, err.message);

											} else {

												req.session.uid = newUser.uid;
												res.status(200).json({
													status: 'suc',
													message: 'registered'
												});
												telkonlogger.logSuc(req, res, 'Admin registered successfully - ' + email);
											}
										});
									}
								});
							}
						});

					} else {

						/* Email is already registered */
						res.status(200).json({
							status: 'suc',
							message: 'error_unavailable'
						});
						telkonlogger.logSuc(req, res, 'Email ID is already registered ' + email);
					}
				}
			});
		}
	}
}


/* GET /auth/login/google/url */
function getLoginGoogleUrl(req, res, next) {


	var readline = require('readline');

	var gapi = require('googleapis');
	var OAuth2Client = gapi.auth.OAuth2;

	var CLIENT_ID = header.oauth2.CLIENT_ID;
	var CLIENT_SECRET = header.oauth2.CLIENT_SECRET;
	var REDIRECT_URL = header.oauth2.REDIRECT_URL;
	var params = header.oauth2.params;

	var oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);

	var url = oauth2Client.generateAuthUrl(params);

	res.status(200).json({
		status: 'suc',
		data: url
	});
	telkonlogger.logSuc(req, res, 'Data sent successfully');
}


/* POST /auth/register/google */
function postRegisterGoogle(req, res, next) {

	var code = req.body.code;
	var query = {};
	var projection = {};

	var readline = require('readline');

	var google = require('googleapis');
	var OAuth2Client = google.auth.OAuth2;
	var auth = google.oauth2('v2');
	var plus = google.plus('v1');

	var CLIENT_ID = header.oauth2.CLIENT_ID;
	var CLIENT_SECRET = header.oauth2.CLIENT_SECRET;
	var REDIRECT_URL = header.oauth2.REDIRECT_URL;

	var oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);

	function getAccessToken(oauth2Client, callback) {

	    oauth2Client.getToken(code, function(err, tokens) {
	    	if(err) {
					
				res.status(500).json({
					message: 'error_googlecode'
				});
				telkonlogger.logErr(req, res, err.message);
				return;
	    	}
	      	oauth2Client.setCredentials(tokens);
	      	callback();
	    });
	}

	getAccessToken(oauth2Client, function() {

	    auth.userinfo.v2.me.get({ userId: 'email', auth: oauth2Client }, function(err, profile) {

			if (err) {

				res.status(500).json({
					message: 'error_googleaccess'
				});
				telkonlogger.logErr(req, res, err.message);

			} else {

			    if(profile) {

		    		query = {email: profile.email}
					projection = {
						_id: 0,
						uid: 1,
						password: 1,
						isblocked: 1,
						isremoved: 1,
						flat: 1,
						role: 1,
						socid: 1
					}

					User.findOne(query, function(err, user) {

						if(err) {

							res.status(500).json({
								message: 'error_queryuser'
							});
							telkonlogger.logErr(req, res, err.message);

					    } else {

					    	if(user) {

					    		/* Genuine USER - Log in */
								req.session.uid = user.uid;
								user.password = null;
								res.status(200).json({
									status: 'suc',
									message: 'loggedin',
									data : user
								});
								telkonlogger.logSuc(req, res, 'Logged in successfully');

					    	} else {
					  			signUpWithGoogle(profile);
					    	}

					    }

		    		});

				} else {

				   	res.status(200).json({
						status: 'suc',
						message: 'error_googlenotreg'
					});
					telkonlogger.logSuc(req, res, 'No google account');
				}
	  		}
	  	});
	});

	function signUpWithGoogle(profile) {

		var email = profile.email;
		var name = profile.name;
		var imageurl = profile.picture;


		var params = [];
		params.push(email);

		if(helper.validateParams(params) == false) {
			
			res.status(400).json({
				message: 'error_invalidparams'
			});
			telkonlogger.logErr(req, res, 'Invalid parameters');

		} else {

			if(helper.validateEmail(email) == false) {

				res.status(200).json({
					status: 'suc',
					message: 'error_invalidemail'
				});
				telkonlogger.logFatal(req, res, 'Invalid Email ID - ' + email);

			} else {

				var newUser = {};
				newUser._id = new mongoose.Types.ObjectId;
				newUser.role = 2;
				newUser.imageurl = imageurl;
				newUser.email = email;
				newUser.name = name;

				helper.generateUid(function(uid) {

					if(!uid) {

						res.status(500).json({
							message: 'error_createuid'
						});
						telkonlogger.logErr(req, res, 'Unable to create new UID');

					} else {

						newUser.uid = uid;

						new User(newUser).save(function(err) {
							if(err){

								res.status(500).json({
									message: 'error_newuser'
								});
								telkonlogger.logErr(req, res, err.message);

							} else {

								var newNotification = {};
								newNotification._id = new mongoose.Types.ObjectId;
								newNotification.uid = newUser.uid;
											
								new Notification(newNotification).save(function(err) {
									if(err){

										res.status(500).json({
											message: 'error_newnotification'
										});
										telkonlogger.logErr(req, res, err.message);

									} else {

										req.session.uid = newUser.uid;
										res.status(200).json({
											status: 'suc',
											message: 'registered'
										});
										telkonlogger.logSuc(req, res, 'Member registered successfully - ' + email);
									}
								});
							}
						});
					}
				});
			}
		}
	}
}


/* POST /auth/recover */
function postRecover(req, res, next) {

	var email = req.body.email;
	var uid = req.headers.auth;
	var query = {};
	var params = [];

	if(req.isDevice) {
		
		params.push(uid);

		if(helper.validateParams(params) == false) {

			res.status(400).json({
				message: 'error_invalidparams'
			});
			telkonlogger.logErr(req, res, 'Invalid parameters');
			return;

		} else {
			query.uid = uid;
		}

	} else {
		
		params.push(email);

		if(helper.validateParams(params) == false) {

			res.status(400).json({
				message: 'error_invalidparams'
			});
			telkonlogger.logErr(req, res, 'Invalid parameters');
			return;

		} else {

			if(helper.validateEmail(email) == false) {

				res.status(200).json({
					status: 'suc',
					message: 'error_invalidemail'
				});
				telkonlogger.logFatal(req, res, 'Invalid Email ID - ' + email);

				return;
			} else {
				query.email = email;
			}
		}
	}

	User.findOne(query, function(err, user) {
		if(err) {

			res.status(500).json({
				message: 'error_queryuser'
			});
			telkonlogger.logErr(req, res, err.message);

		} else {

			if(typeof user === 'undefined' ||
				user === null ||
				user === {}) {

				res.status(200).json({
					status: 'suc',
					message: 'error_nouser'
				});
				telkonlogger.logSuc(req, res, 'No user found - ' + email);

			} else {

				/* Change user's password in db */
				var newPassword = helper.generatePassword();
				user.password = newPassword;
				user.save(function(err) {

					if(err) {

						res.status(500).json({
							message: 'error_saveuser'
						});
						telkonlogger.logErr(req, res, err.message);

					} else {

						/* Notify user via email */
						var mailOptions = {};
						var mailList = [];
						mailList.push(user.email);

						mailOptions['to'] = mailList;
						mailOptions['subject'] =  'Password Reset';
						mailOptions['text'] = 'Please use the following password for login\npassword: ' + newPassword;
						mailOptions['html'] = '<p>Please use the following password for login</p>' +
				    							'<p>New Password: <b>' + newPassword + '</b></p>';

						mailer.masterSendMail(mailList, mailOptions, function(err, info) {

							if(err) {
								console.log(err);
								res.status(500).json({
									message: 'error_mailer'
								});
								telkonlogger.logErr(req, res, err.message);

							} else {

							    res.status(200).json({
									status: 'suc',
									message: 'mailed'
								});
								telkonlogger.logSuc(req, res, 'Password mailed successfully');
							}
						});
					}
				});
			}
		}
	});
}


/* GET /auth/login/form */
function getLoginForm(req, res, next) {

	var uid = req.session.uid;
	var params = [];
	params.push(uid);

	if(helper.validateParams(params) == false) {
		
		res.status(403).json({
			message: 'error_unauthenticated'
		});
		telkonlogger.logSuc(req, res, 'User is not authenticated');

	} else {

	    var query = {uid: uid};
	    var projection = {
	    	_id: 0,
	    	role: 1,
	    	isblocked: 1,
	    	isremoved: 1,
	    	uid: 1,
	    	socid: 1,
	    	residencetype: 1,
	    	flat: 1
	    };

	    User.findOne(query, projection, function(err, user){
			if(err) {
					
				res.status(500).json({
					message: 'error_queryuser'
				});
				telkonlogger.logErr(req, res, err.message);

			} else {

				if( typeof user === 'undefined' ||
					user == null ||
					user == {}) {

					res.status(401).json({
						message: 'error_unauthorized'
					});
					telkonlogger.logSuc(req, res, 'User is not authorised');

				} else {

					if(user.role == 4 || user.role == 7 || user.role == 8) {
						query = {socid: user.socid}
						projection = {
							_id: 0,
							issupported: 1,
							supportlevel: 1
						};

						Society.findOne(query, projection, function(err, society) {

							if(err) {
					
								res.status(500).json({
									message: 'error_querysociety'
								});
								telkonlogger.logErr(req, res, err.message);

							} else {

								user.issupported = society.issupported;
								user.supportlevel = society.supportlevel;

								res.status(200).json({
						        	status: 'suc',
						            message: 'authorised',
						            data: {
						            	user: user,
						            	society: society
						            }
						        });
						        telkonlogger.logSuc(req, res, 'Data sent successfully');
							}
						});

					} else {
						res.status(200).json({
				        	status: 'suc',
				            message: 'authorised',
				            data: user
				        });
				        telkonlogger.logSuc(req, res, 'Data sent successfully');
					}
				}
			}
		});
    }
}


/* POST /auth/login/form */
function postLoginForm(req, res, next) {

	var email = req.body.email;
	var password = req.body.password;

	var params = [];
	params.push(email);
	params.push(password);

	if(helper.validateParams(params) == false) {
		
		res.status(400).json({
			message: 'error_invalidparams'
		});
		telkonlogger.logErr(req, res, 'Invalid parameters');

	} else {

		if(helper.validateEmail(email) == false) {

			res.status(200).json({
				status: 'suc',
				message: 'error_invalidemail'
			});
			telkonlogger.logFatal(req, res, 'Invalid Email ID - ' + email);

		} else {

			/* Check if the USER exists */

			var query = {email: email};
			var projection = {
				_id: 0,
				uid: 1,
				password: 1,
				isblocked: 1,
				isremoved: 1,
				flat: 1,
				role: 1,
				residencetype: 1,
				socid: 1
			}

			User.findOne(query, projection, function(err, user){

				if(err) {
					
					res.status(500).json({
						message: 'error_queryuser'
					});
					telkonlogger.logErr(req, res, err.message);

				} else {

					if( typeof user === 'undefined' ||
						user == null ||
						user == {}) {

						/* USER does not exist */
						res.status(200).json({
							status: 'suc',
							message: 'error_nouser'
						});
						telkonlogger.logSuc(req, res, 'No such user - ' + email);

					} else {

						if(user.password !== password) {

							/* Incorrect Credentials */
							res.status(200).json({
								status: 'suc',
								message: 'error_incorrect'
							});
							//user.wrongattempt += 1;
							//user.save();
							telkonlogger.logSuc(req, res, 'Password incorrect');

						} else {

							/* Genuine USER - Log in */

							//var hour = 3600000;
							//req.session.cookie.expires = new Date(Date.now() + hour);
							//req.session.cookie.maxAge = hour;
							req.session.uid = user.uid;
							user.password = null;
							res.status(200).json({
								status: 'suc',
								message: 'loggedin',
								data : user
							});
							telkonlogger.logSuc(req, res, 'Logged in successfully');
						}
					}
				}
			});
		}
	}
}


/* POST /auth/login/sys */
function postLoginSys(req, res, next) {

	var buf = new Buffer(req._readableState.buffer);
	console.log(JSON.stringify(buf));
	var email = req.body.email;
	var password = req.body.password;
	var key = req.body.key;
	var query = {};
	var projection = {};
	var SYS_KEY = header.sys_key;

	var params = [];
	params.push(email);
	params.push(password);
	params.push(key);

	if(helper.validateParams(params) == false) {
		
		res.status(400).json({
			message: 'error_invalidparams'
		});
		telkonlogger.logErr(req, res, 'Invalid parameters');

	} else {

		if(helper.validateEmail(email) == false) {

			res.status(200).json({
				status: 'suc',
				message: 'error_invalidemail'
			});
			telkonlogger.logFatal(req, res, 'Invalid Email ID - ' + email);

		} else {

			if(key !== SYS_KEY) {

				res.status(200).json({
					status: 'suc',
					message: 'error_invalidkey'
				});
				telkonlogger.logFatal(req, res, 'Invalid key - ' + key);

			} else {

				/* Check if the USER exists */

				query = {email: email};
				projection = {
					_id: 0,
					uid: 1,
					password: 1,
					isblocked: 1,
					isremoved: 1,
					flat: 1,
					role: 1,
					socid: 1
				}

				User.findOne(query, projection, function(err, user){

					if(err) {
						
						res.status(500).json({
							message: 'error_queryuser'
						});
						telkonlogger.logErr(req, res, err.message);

					} else {

						if( typeof user === 'undefined' ||
							user == null ||
							user == {}) {

							/* USER does not exist */
							res.status(200).json({
								status: 'suc',
								message: 'error_nouser'
							});
							telkonlogger.logSuc(req, res, 'No such user - ' + email);

						} else {

							if(user.password !== password) {

								/* Incorrect Credentials */
								res.status(200).json({
									status: 'suc',
									message: 'error_incorrect'
								});
								telkonlogger.logSuc(req, res, 'Password incorrect');

							} else {

								/* Genuine USER - Log in */
								req.session.uid = user.uid;
								user.password = null;

								res.status(200).json({
									status: 'suc',
									message: 'loggedin',
									data : user
								});
								telkonlogger.logSuc(req, res, 'Logged in successfully');
							}
						}
					}
				});
			}
		}
	}
}


/* POST /auth/device/login/form */
function postDeviceLoginForm(req, res, next) {

	var email = req.body.email;
	var password = req.body.password;
	var query = {};
	var projection = {};

	var params = [];
	params.push(email);
	params.push(password);

	if(helper.validateParams(params) == false) {
		
		res.status(400).json({
			message: 'error_invalidparams'
		});

	} else {

		if(helper.validateEmail(email) == false) {

			res.status(200).json({
				status: 'suc',
				message: 'error_invalidemail'
			});

		} else if(password.length < 6) {

			res.status(200).json({
				status: 'suc',
				message: 'error_invalidpassword'
			});

		} else {

			/* Check if the USER exists */

			query = {email: email};
			projection = {
				_id: 1,
				uid: 1,
				password: 1
			};

			User.findOne(query, projection, function(err, user) {
				if(err) {
					
					res.status(500).json({
						message: 'error_queryuser'
					});

				} else {

					if( typeof user === 'undefined' ||
						user == null ||
						user == {}) {

						/* USER does not exist, create one */
						var newUser = {};
						newUser._id = new mongoose.Types.ObjectId;
						newUser.uid = helper.generateID();
						newUser.email = email;
						newUser.role = 4;
						newUser.password = password;

						new User(newUser).save(function(err){
							if(err){

								res.status(500).json({
									message: 'error_newuser'
								});

							} else {

								var newNotification = {};
								newNotification._id = new mongoose.Types.ObjectId;
								newNotification.uid = newUser.uid;
													
								new Notification(newNotification).save(function(err) {
									if(err){

										res.status(500).json({
											message: 'error_newnotification'
										});

									} else {

										Society.find({}, {_id:0, socid:1, societyname:1, city:1}, function(err, societies){
											if(err) {

												res.status(500).json({
													message: 'error_querysociety'
												});

											} else {

												//req.session.uid = newUser.email;
												res.status(200).json({
													status: 'suc',
													message: 'created',
													data: {
														auth: newUser.uid,
														societies: societies
													}
												});
											}
										});
									}
								});
							}
						});


					} else {

						if(user.password !== password) {

							/* Incorrect Credentials */
							res.status(401).json({
								status: 'suc',
								message: 'error_incorrect'
							});

						} else {

							/* Genuine USER - Log in */
							//req.session.uid = user.uid;
							res.status(200).json({
								status: 'suc',
								message: 'loggedin',
								data: {
									auth: user.uid
								}
							});

						}
						
					}
				}
			});
		}
	}
}


/* POST /user/enquire/add */
function postEnquireAdd(req, res, next) {

	var name = req.body.name;
	var email = req.body.email;
	var message = req.body.message;

	var params = [];
	params.push(email);

	if(helper.validateParams(params) == false) {
		
		res.status(400).json({
			message: 'error_invalidparams'
		});
		telkonlogger.logErr(req, res, 'Invalid parameters');

	} else {

		if(helper.validateEmail(email) == false) {

			res.status(200).json({
				status: 'suc',
				message: 'error_invalidemail'
			});
			telkonlogger.logFatal(req, res, 'Invalid Email ID - ' + email);

		} else {

			var newEnquiry = {};
			newEnquiry._id = new mongoose.Types.ObjectId;
			newEnquiry.byname = name || 'Empty';
			newEnquiry.byemail = email;
			newEnquiry.message = message || 'Empty';

			new Enquire(newEnquiry).save(function(err) {

				if(err) {
					res.status(500).json({
						message: 'error_newenquiry'
					});
					telkonlogger.logErr(req, res, err.message);

				} else {
					res.status(200).json({
						status: 'suc',
						message: 'sent'
					});
					telkonlogger.logSuc(req, res, 'Added successfully');
				}
			});
		}
	}
}


/***********************************  END  ***********************************/