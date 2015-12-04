/******************************************************************************
 *
 *  database.js - Start DB
 *
 *****************************************************************************/

var mongoose = require('mongoose');
var DB_URI = require('../config').db.uri;


//////////////////////

var start = function (cb) {

    console.log('Connecting to MongoDb at ', DB_URI);

    mongoose.connect(DB_URI, function(err, db) {
        if(err) {
            console.error('MongoDb connection failed; is your MongoDb server running?\n' + err.message);
            process.exit(1); // We're cooked. Terminate.
        }

        require('./mongoDbInit').load(function(err){
            if(err) {
                console.error('MongoDb initialization failed.\n' + err.message);
                process.exit(1); // We're cooked. Terminate.
            }
            cb();
        });
    });
    return;
}

module.exports.start = start;

/***********************************  END  ***********************************/