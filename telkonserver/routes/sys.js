/******************************************************************************
 *
 *  sys.js - routes for SYS
 *
 *****************************************************************************/

var express = require('express');
var router = express.Router();
var multer = require('multer');
var fs = require('fs');

var service = require('../dataservice/sys');


router.use('', require('./filter.js').apply);

/* PROFILE */
router.get('/profile/data', service.getProfileData);
router.post('/profile/update/name', service.postUpdateName);	//	name
router.post('/profile/update/phone', service.postUpdatePhone);	//	phone
router.post('/profile/update/position', service.postUpdatePosition);	//	position
router.post('/profile/update/department', service.postUpdateDepartment);	//	department
router.post('/profile/clear/name', service.postClearName);
router.post('/profile/clear/position', service.postClearPosition);
router.post('/profile/clear/department', service.postClearDepartment);
router.post('/profile/reset/password', service.postResetPassword);	//	oldp, newp

router.post('/logout', service.postLogout);

/* SOCIETY */
router.get('/cities', service.postGetCities);
router.get('/societies', service.getSocieties);
router.get('/societies/name/:name', service.getSocietiesByName);
router.get('/societies/city/:city', service.getSocietiesByCity);
router.get('/societies/city/:city/locality/:locality', service.getSocietiesByCityAndLocality);
router.get('/society/socid/:socid', service.getSocietyBySocid);
router.post('/create/society', service.postCreateSociety);
router.post('/create/society/multiple', service.postCreateSocietyMultiple);
router.post('/society/update/issupported', service.postSocietyUpdateIssupported);  //  socide, issupported
router.post('/society/update/flatsample', service.postSocietyUpdateFlatSample);  //  socid, flatsample
router.post('/society/update/layoutflats', service.postSocietyUpdateLayoutFlats);  //  socid, layoutflats
router.post('/society/update/imagedp', service.postSocietyUpdateImagedp);  //  imagedp

/* USER */
router.get('/users', service.getUsers);
router.get('/users/socid/:socid', service.getUsersBySocid);
router.get('/users/role/:role', service.getUsersByRole);
router.get('/user/uid/:uid', service.getUserByUid);
router.get('/user/email/:email', service.getUserByEmail);
router.get('/user/name/:name', service.getUserByName);
router.post('/user/remove', service.postUserRemove);

/* NOTICE */
router.get('/notices', service.getNotices);
router.get('/notices/uid/:uid', service.getNoticesByUid);
router.get('/notices/socid/:socid', service.getNoticesBySocid);
router.get('/notices/email/:email', service.getNoticesByEmail);
router.get('/notice/nid/:nid', service.getNoticeByNid);
router.post('/notice/compose', service.postNoticeCompose);
router.post('/notice/upload', multer({
  dest: './public/uploads/notice',
  rename: function (fieldname, filename) {
    return filename.replace(/\W+/g, '-').toLowerCase() + Date.now()
  },
  changeDest: function(dest, req, res) {
    var stat = null;
    dest = dest + '/' + req.socid;
    try {
        // using fs.statSync; NOTE that fs.existsSync is now deprecated; fs.accessSync could be used but is only nodejs >= v0.12.0
        stat = fs.statSync(dest);
    } catch(err) {
        // for nested folders, look at npm package "mkdirp"
        fs.mkdirSync(dest);
    }

    if (stat && !stat.isDirectory()) {
        // Woh! This file/link/etc already exists, so isn't a directory. Can't save in it. Handle appropriately.
        throw new Error('Directory cannot be created because an inode of a different type exists at "' + dest + '"');
    }
    return dest;
  }
}), service.postNoticeUpload);
router.post('/notice/remove', service.postNoticeRemove);

/* COMPLAINT */
router.get('/complaints', service.getComplaints);
router.get('/complaints/uid/:uid', service.getComplaintsByUid);
router.get('/complaints/email/:email', service.getComplaintsByEmail);
router.get('/complaints/socid/:socid/flat/:flat', service.getComplaintsBySocidAndFlat);
router.get('/complaints/socid/:socid', service.getComplaintsBySocid);
router.get('/complaint/compid/:compid', service.getComplaintByCompid);
router.post('/complaint/remove', service.postComplaintRemove);

/* CLASSIFIED */
router.get('/classifieds', service.getClassifieds);
router.get('/classifieds/uid/:uid', service.getClassifiedsByUid);
router.get('/classifieds/email/:email', service.getClassifiedsByEmail);
router.get('/classifieds/socid/:socid', service.getClassifiedsBySocid);
router.get('/classified/cid/:cid', service.getClassifiedByCid);
router.post('/classified/remove', service.postClassifiedRemove);
router.post('/classified/add', service.postClassifiedAdd);

/* CONTACT */
router.get('/contacts', service.getContacts);
router.get('/contacts/pincode/:pincode', service.getContactsByPincode);
router.get('/contacts/pincode/:pincode/category/:category', service.getContactsByPincodeAndCategory);
router.get('/contacts/socid/:socid/category/:category', service.getContactsBySocidAndCategory);
router.post('/contact/add', service.postContactAdd);


/* FORUM */
router.get('/forums', service.getForums);
router.get('/forums/uid/:uid', service.getForumsByUid);
router.get('/forums/email/:email', service.getForumsByEmail);
router.get('/forums/socid/:socid', service.getForumsBySocid);
router.get('/forum/fid/:fid', service.getForumByFid);


/* ADMIN */
router.get('/admins', service.getAdmins);
router.get('/admins/socid/:socid', service.getAdminsBySocid);
router.get('/admins/socidrole/:socid/:role', service.getAdminsBySocidAndRole);
router.get('/admin/uid/:uid', service.getAdminByUid);
router.get('/admin/email/:email', service.getAdminByEmail);
router.post('/admin/add', service.postAdminAdd);   // email, role, socid
router.post('/admin/remove', service.postAdminRemove);   // uid, socid

/* ENQUIRE */
router.get('/enquires', service.getEnquires);
router.get('/enquires/email/:email', service.getEnquiresByEmail);
router.get('/enquires/name/:name', service.getEnquiresByName);

/* FEEDBACK */
router.get('/feedbacks', service.getFeedbacks);
router.get('/feedbacks/socid/:socid', service.getFeedbacksBySocid);
router.get('/feedbacks/email/:email', service.getFeedbacksByEmail);
router.get('/feedbacks/name/:name', service.getFeedbacksByName);
router.get('/feedbacks/uid/:uid', service.getFeedbacksByUid);

/* SUPPORT */
router.get('/supports', service.getSupports);
router.get('/supports/socid/:socid', service.getSupportsBySocid);
router.get('/supports/email/:email', service.getSupportsByEmail);
router.get('/supports/name/:name', service.getSupportsByName);
router.get('/supports/societyname/:societyname', service.getSupportsBySocietyname);
router.get('/supports/city/:city', service.getSupportsByCity);
router.get('/supports/uid/:uid', service.getSupportsByUid);

/* SUPPORT */
router.get('/getOtherSocietiesByCity/city/:city', service.getOtherSocietiesByCity);

/* MASTER */
router.post('/master', service.postMaster);


module.exports = router;

/***********************************  END  ***********************************/