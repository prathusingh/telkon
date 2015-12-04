/******************************************************************************
 *
 *  mongoDbInit.js - Initialize Mongo DB with Smaple Data
 *
 *****************************************************************************/

module.exports.load = load;

var async = require('async');

var Society = require('../models/society.js');
var User = require('../models/user.js');
var Notice = require('../models/notice.js');
var Complaint = require('../models/complaint.js');
var Classified = require('../models/classified.js');
var Contact = require('../models/contact.js');
var Poll = require('../models/poll.js');
var Forum = require('../models/forum.js');
var Notification = require('../models/notification.js');
var Feedback = require('../models/feedback.js');
var Enquire = require('../models/enquire.js');
var Support = require('../models/support.js');
var Club = require('../models/club.js');


//////////////////////

function load(callback) {

    


    callback();
    return;




    if (process.env.NODE_ENV === 'production') {
        // DO NOT RE-INITIALIZE PRODUCTION DB
        callback();
        return;
    }

    // Remove all existing question
    console.log('Clearing database');
    async.parallel([
        function(callback) {
            Society.remove({}, function(err) {
                if (err) {
                    console.log('Error in removing Society');
                } else {
                    callback();
                }
            });
        },
        function(callback) {
            User.remove({}, function(err) {
                if (err) {
                    console.log('Error in removing User');
                } else {
                    callback();
                }
            });
        },
        function(callback) {
            Notice.remove({}, function(err) {
                if (err) {
                    console.log('Error in removing Notice');
                } else {
                    callback();
                }
            });
        },
        function(callback) {
            Complaint.remove({}, function(err) {
                if (err) {
                    console.log('Error in removing Complaint');
                } else {
                    callback();
                }
            });
        },
        function(callback) {
            Classified.remove({}, function(err) {
                if (err) {
                    console.log('Error in removing Classified');
                } else {
                    callback();
                }
            });
        },
        function(callback) {
            Contact.remove({}, function(err) {
                if (err) {
                    console.log('Error in removing Contact');
                } else {
                    callback();
                }
            });
        },
        function(callback) {
            Poll.remove({}, function(err) {
                if (err) {
                    console.log('Error in removing Poll');
                } else {
                    callback();
                }
            });
        },
        function(callback) {
            Forum.remove({}, function(err) {
                if (err) {
                    console.log('Error in removing Forum');
                } else {
                    callback();
                }
            });
        },
        function(callback) {
            Notification.remove({}, function(err) {
                if (err) {
                    console.log('Error in removing Notification');
                } else {
                    callback();
                }
            });
        },
        function(callback) {
            Feedback.remove({}, function(err) {
                if (err) {
                    console.log('Error in removing Feedback');
                } else {
                    callback();
                }
            });
        },
        function(callback) {
            Enquire.remove({}, function(err) {
                if (err) {
                    console.log('Error in removing Enquire');
                } else {
                    callback();
                }
            });
        },
        function(callback) {
            Support.remove({}, function(err) {
                if (err) {
                    console.log('Error in removing Support');
                } else {
                    callback();
                }
            });
        },
        function(callback) {
            Club.remove({}, function(err) {
                if (err) {
                    console.log('Error in removing Club');
                } else {
                    callback();
                }
            });
        }

    ],

    function(err, results) {
        if(err) {
            console.log('Error in clearing database');
        } else {






            callback();
            return;






            initialize(callback);
        }
    });
}

// Initialize with sample data
function initialize(callback){
    
    console.log('Init\'ing database');

    async.parallel([    
        function(callback) {
            var societies = require('./sampleData/societies').societies;

            var bulk = Society.collection.initializeUnorderedBulkOp();
            var count = societies.length;
            for (var i = 0; i < count; i++) {
                bulk.insert(societies[i]);
            }

            bulk.execute(function(err){
                if (err){
                    callback(err);
                    return;
                }

            callback();
            });
        },
        function(callback) {
            var users = require('./sampleData/users').users;

            var bulk = User.collection.initializeUnorderedBulkOp();
            var count = users.length;
            for (var i = 0; i < count; i++) {
                bulk.insert(users[i]);
            }

            bulk.execute(function(err){
                if (err){
                    callback(err);
                    return;
                }

            callback();
            });
        },
        function(callback) {
            var notices = require('./sampleData/notices').notices;

            var bulk = Notice.collection.initializeUnorderedBulkOp();
            var count = notices.length;
            for (var i = 0; i < count; i++) {
                bulk.insert(notices[i]);
            }

            bulk.execute(function(err){
                if (err){
                    callback(err);
                    return;
                }

            callback();
            });
        },
        function(callback) {
            var complaints = require('./sampleData/complaints').complaints;

            var bulk = Complaint.collection.initializeUnorderedBulkOp();
            var count = complaints.length;
            for (var i = 0; i < count; i++) {
                bulk.insert(complaints[i]);
            }

            bulk.execute(function(err){
                if (err){
                    callback(err);
                    return;
                }

            callback();
            });
        },
        function(callback) {
            var classifieds = require('./sampleData/classifieds').classifieds;

            var bulk = Classified.collection.initializeUnorderedBulkOp();
            var count = classifieds.length;
            for (var i = 0; i < count; i++) {
                bulk.insert(classifieds[i]);
            }

            bulk.execute(function(err){
                if (err){
                    callback(err);
                    return;
                }

            callback();
            });
        },
        function(callback) {
            var contacts = require('./sampleData/contacts').contacts;

            var bulk = Contact.collection.initializeUnorderedBulkOp();
            var count = contacts.length;
            for (var i = 0; i < count; i++) {
                bulk.insert(contacts[i]);
            }

            bulk.execute(function(err){
                if (err){
                    callback(err);
                    return;
                }

            callback();
            });
        },
        function(callback) {
            var polls = require('./sampleData/polls').polls;

            var bulk = Poll.collection.initializeUnorderedBulkOp();
            var count = polls.length;
            for (var i = 0; i < count; i++) {
                bulk.insert(polls[i]);
            }

            bulk.execute(function(err){
                if (err){
                    callback(err);
                    return;
                }

            callback();
            });
        }
    ],
    function(err, results) {
        if(err) {
            console.log('Error in init\'ing database');
        } else {
            console.log('Database init\'ed');
            callback();
        }
    });        
}

/***********************************  END  ***********************************/