/******************************************************************************
 *
 *  device.js - routes for DEVICE
 *
 *****************************************************************************/

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var User = require('../models/user.js');

var device = require('../dataservice/device');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.post('/formRegister', device.postFormRegister);

router.use(function(req, res, next){

	var uid = req.headers.authtoken;

	if(typeof uid === 'undefined') {

		/* Unauthorised */
		next(new Error(
			'unauthorised'
		));

	} else {

		User.findOne({uid: uid}, {_id:1}, function(err, user){
			if(err) {
				next(new Error(
		    		'error'
		  		));
			} else {
				if(typeof user === 'undefined' || 
					user == null || 
					user == {}) {

						/* Security Breach */
						next(new Error(
							'security'
						));

				} else {
					req.session.uid = uid;
					next();
				}
			}
		});

	}
	
})


/* SOCIETY API */
router.get('/societies/city/:city', device.getSocietiesByCity);

/* USER API */
//router.get('/user/:uid', device.getUserById);
router.get('/user/email/:email', device.getUserByEmail);
router.get('/notices', device.getNotices);

router.post('/resetpassword', device.resetPassword);

router.post('/details', device.postDetails);


/* NOTICE API */
router.get('/notice/:nid', device.getNoticeById);
router.get('/notices/society/:socid', device.getNoticesBySocietyId);

module.exports = router;

/***********************************  END  ***********************************/