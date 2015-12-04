/******************************************************************************
 *
 *  api.js - routes for API
 *
 *****************************************************************************/

var express = require('express');
var router = express.Router();

var User = require('../models/user.js');

var api = require('../dataservice/api');

/* SOCIETY API */
router.get('/cities', api.postGetCities);
router.get('/societies', api.getSocieties);
router.get('/societies/name/:name', api.getSocietiesByName);
router.get('/societies/city/:city', api.getSocietiesByCity);
router.get('/society/socid/:socid', api.getSocietyBySocid);


/* USER API */
router.get('/users', api.getUsers);
router.get('/users/socid/:socid', api.getUsersBySocid);
router.get('/users/role/:role', api.getUsersByRole);
router.get('/user/uid/:uid', api.getUserByUid);
router.get('/user/email/:email', api.getUserByEmail);


/* NOTICE API */
router.get('/notices', api.getNotices);
router.get('/notice/uid/:uid', api.getNoticesByUid);
router.get('/notice/email/:email', api.getNoticesByEmail);
router.get('/notices/socid/:socid', api.getNoticesBySocid);
router.get('/notice/nid/:nid', api.getNoticeByNid);


/* COMPLAINT API */
router.get('/complaints', api.getComplaints);
router.get('/complaints/uid/:uid', api.getComplaintsByUid);
router.get('/complaints/email/:email', api.getComplaintsByEmail);
router.get('/complaints/socidflat/:socid/:flat', api.getComplaintsBySocidAndFlat);
router.get('/complaints/socid/:socid', api.getComplaintsBySocid);
router.get('/complaint/compid/:compid', api.getComplaintByCompid);


/* CLASSIFIED API */
router.get('/classifieds', api.getClassifieds);
router.get('/classifieds/uid/:uid', api.getClassifiedsByUid);
router.get('/classifieds/email/:email', api.getClassifiedsByEmail);
router.get('/classifieds/socid/:socid', api.getClassifiedsBySocid);
router.get('/classified/cid/:cid', api.getClassifiedByCid);


/* CONTACT API */


/* FORUM API */
router.get('/forums', api.getForums);
router.get('/forums/uid/:uid', api.getForumsByUid);
router.get('/forums/email/:email', api.getForumsByEmail);
router.get('/forums/socid/:socid', api.getForumsBySocid);
router.get('/forum/fid/:fid', api.getForumByFid);

/* ADMIN */
router.get('/admins', api.getAdmins);
router.get('/admins/socid/:socid', api.getAdminsBySocid);
router.get('/admins/socidrole/:socid/:role', api.getAdminsBySocidAndRole);
router.get('/admins/uid/:uid', api.getAdminByUid);
router.get('/admins/email/:email', api.getAdminByEmail);


/* CLUB */
router.get('/clubs/:search', api.getClubs);   // recSkip

/* ENQUIRE */
router.get('/enquires', api.getEnquires);
router.get('/enquires/email/:email', api.getEnquiresByEmail);

module.exports = router;

/***********************************  END  ***********************************/