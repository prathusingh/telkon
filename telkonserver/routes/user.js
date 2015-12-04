/******************************************************************************
 *
 *  user.js - routes for USER
 *
 *****************************************************************************/

var express = require('express');
var router = express.Router();

var service = require('../dataservice/user');


router.use('', require('./filter.js').apply);

router.get('/cities', service.postGetCities);
router.post('/societies/:city', service.postGetSocietiesByCity);
router.post('/localities/:word', service.postGetLocalitiesByWord);
router.post('/details', service.postDetails);	 // flat, societyname, city, residencetype
router.post('/new/details', service.postNewDetails);	 // societyname, city
router.post('/personal', service.postPersonal);	 // name, phone
router.post('/official', service.postOfficial);	 // name, phone, position, department
router.post('/create/society', service.postCreateSociety);
router.post('/profile/data', service.postProfileData);
router.post('/suspend', service.postSuspend);
router.post('/logout', service.postLogout);

module.exports = router;

/***********************************  END  ***********************************/