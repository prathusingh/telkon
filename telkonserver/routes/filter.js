/******************************************************************************
 *
 *  filter.js - The FILTER function
 *
 *****************************************************************************/

var express = require('express');
var router = express.Router();
var User = require('../models/user.js');
var service = require('../dataservice/auth');

exports.apply = function(req, res, next) {

    var isSecuredOn = true;

    var ua;

    if(req.headers['device']) {
        ua = "Mobile Application: Telkon App Android/";
    } else {
        ua = req.headers['user-agent'];
    }

    var uid;
    var socid;
    var flat;

    if ( (/(Telkon App)/).test(ua) &&
        (/(Android)/).test(ua)) {

        /* Request from DEVICE */

        req.isDevice = true;
        uid = req.headers.auth;

    } else {

        /* Request from BROWSER */

        uid = req.session.uid;

    }

    if(typeof uid === 'undefined' ||
        uid == null ||
        uid === '') {

        /* Unauthorised */
        res.status(403).json({
            status: 'suc',
            message: 'unauthorised'
        });

    } else {

        var query = {uid: uid};
        var projection = {
            _id: 1,
            socid: 1,
            flat: 1,
            societyname: 1,
            city: 1,
            role: 1,
            name: 1,
            residencetype: 1,
            phone: 1,
            email: 1,
            position: 1,
            department: 1,
            imagedp: 1,
            updates: 1
        };

        User.findOne(query, {}, function(err, user) {
              if(err) {

                  res.status(500).json({
                      message: 'error_queryuser'
                  });

              } else {

                  if( typeof user === 'undefined' ||
                      user === null ||
                      user === {}) {

                      /* Security Breach */
                      res.status(403).json({
                        status: 'suc',
                        message: 'fatal'
                       });
                      
                  } else {

                      var baseUrl = req.baseUrl;
                      var role = user.role;

                      if(baseUrl === '/member' && 
                        (role !== 4 &&  role !== 7 && role !== 8)) {

                          if(role === 'block') {
                              res.status(403).json({
                                status: 'suc',
                                message: 'unauthorisedfilter-block'
                            });
                          } else {
                              res.status(403).json({
                                status: 'suc',
                                message: 'unauthorisedfilter'
                            });
                          }
                            
                      } else if(baseUrl === '/admin' && 
                                (role !== 5 && role !== 6 && role !== 7 && role !== 8)) {

                          res.status(403).json({
                              status: 'suc',
                              message: 'unauthorisedfilter'
                          });
                      } else if(baseUrl === '/sys' && role !== 0) {
                          res.status(403).json({
                              status: 'suc',
                              message: 'unauthorisedfilter'
                          });
                      } else {
                          req.uid = uid;
                          req.socid = user.socid;
                          req.user = user;
                          next();
                      }
                          
                  }
              }

        });
    }
}

/***********************************  END  ***********************************/