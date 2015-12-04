/******************************************************************************
 *
 *  app.js - Main application file
 *
 *****************************************************************************/


/* Get the tools */
var express = require('express');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var path = require('path');
var fs = require('fs');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var multer  = require('multer');
var cors = require('cors');
var serveStatic = require('serve-static');
var apiRoutes = require('./routes/api');
var userRoutes = require('./routes/user');
var deviceRoutes = require('./routes/device');
var authRoutes = require('./routes/auth');
var memberRoutes = require('./routes/member');
var adminRoutes = require('./routes/admin');
var sysRoutes = require('./routes/sys');
var header = require('./header');
var config = require('./config');
var mailer = require('./mailer');
var telkonlogger = require('./logger');
var app = express();

/* Set the Configuration */
var SERVER_HOST = config.server.host;
var SERVER_PORT = config.server.port;
var DB_URI = config.db.uri;
var DB_HOST = config.db.host;
var DB_PORT = config.db.port;
var DB_NAME = config.db.name;
var LOG_FILE_NAME = header.logs.morgan;
var CORS_WHITE_LIST = config.cors;

/* Get required data from header file */
var UA_DEVICE = header.ua_device;

/* Set up middlewares */
app.use(logger('dev'));   // Must be included for telkonlogger
app.use(session({
    secret: '1234',
    store: new MongoStore({
        uri: DB_URI,
        //host: DB_HOST,
        //port: DB_PORT,
        db: DB_NAME,
        //ttl: 14 * 24 * 60 * 60, // = 14 days
        autoRemove: 'interval',
        autoRemoveInterval: 60 // In minutes
    }),
    resave: true,
    saveUninitialized: false
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(serveStatic(path.join(__dirname, 'public')));

/* CORS */
var whitelist = CORS_WHITE_LIST;

var corsOptionsDelegate = function(req, callback){
  var corsOptions;
  if(whitelist.indexOf(req.header('Origin')) !== -1){
    corsOptions = { origin: true, credentials: true }; // reflect (enable) the requested origin in the CORS response 
  }else{
    corsOptions = { origin: false }; // disable CORS for this request 
  }
  callback(null, corsOptions); // callback expects two parameters: error and options 
};

app.use(cors(corsOptionsDelegate));


app.use('/auth', authRoutes);
app.use('/member', memberRoutes);
app.use('/admin',  adminRoutes);
app.use('/api', apiRoutes);
app.use('/device', deviceRoutes);
app.use('/user', userRoutes);
app.use('/sys', sysRoutes);

app.get('/gcmtest', function(req, res, next) {
  
  var GCM_SERVER_KEY = 'AIzaSyCi3-gO_hsqxxUIyvcxFnKxgLu-XZYH2K4';
  var GCM_TEST_REGID = 'APA91bGu4Lo4rqOS7GLkh5g1Vla1GOlGFMOgzCA1LtqGrgxGE31-xLNHAX8Pabn6zmQ4R9sk2LbNyBZgmr3Y33txSOYLHBZQ2zVIj87yAPWUnSE78Q31GNYABOUSyl0czmb6hb7Q6H-4';

  var gcm = require('node-gcm');
  var message = new gcm.Message();
  var message = new gcm.Message({
      collapseKey: 'demo',
      delayWhileIdle: true,
      timeToLive: 3,
      data: {
          key1: 'message1',
          key2: 'message2'
      }
  });
   
  // Set up the sender with you API key 
  var sender = new gcm.Sender(GCM_SERVER_KEY);
   
  // Add the registration IDs of the devices you want to send to 
  var registrationIds = [];
  registrationIds.push(GCM_TEST_REGID);

  sender.send(message, registrationIds, 10, function (err, result) {
    if(err) {
      console.error(err);
      res.status(200).json({
        status: 'suc',
        message: 'error_gcm'
      });
    }
    else {
      res.status(200).json({
        status: 'suc',
        message: 'notified'
      });
    }
  });

});

/* Catch 404 and forward to error handler */
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/* No stack traces leaked to user */
app.use(function(err, req, res, next){

  	res.status(err.status || 500)
    .send({ 
    	status: 'dif',
    	message: err.message
    });
    telkonlogger.logErr(req, res, err.message);
});

module.exports = app;

/***********************************  END  ***********************************/
