/******************************************************************************
 *
 *  auth.js - routes for AUTHentication
 *
 *****************************************************************************/

var express = require('express');
var router = express.Router();

var service = require('../dataservice/auth');

router.get('/ping', service.getPing);
router.post('/register/form', service.postRegisterForm);
router.post('/register/sys', service.postRegisterSys);
router.post('/register/admin', service.postRegisterAdmin);
router.get('/login/google/url', service.getLoginGoogleUrl);
router.post('/register/google', service.postRegisterGoogle);
router.post('/recover', service.postRecover);
router.get('/login/form', service.getLoginForm);
router.post('/login/form', service.postLoginForm);
router.post('/login/sys', service.postLoginSys);
router.post('/device/login/form', service.postDeviceLoginForm);
router.post('/enquire/add', service.postEnquireAdd); 	// name, email, message


module.exports = router;

/***********************************  END  ***********************************/