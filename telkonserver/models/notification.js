/******************************************************************************
 *
 *  notification.js - Model for NOTIFICATION
 *
 *****************************************************************************/

var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , ObjectId = Schema.ObjectId;

var notificationSchema;
notificationSchema = mongoose.Schema({

    _id: ObjectId,
    notid: String,
    uid: String,
    total: { type: Number, default: 0 },
    info:[
        {
            infoid: String,
            /*
                1: Notice
                2: Complaint
                3: Classified
                4. Contact
                5: Forum
                6: Member
                7: Club
            */
            infotype: Number,
            /*
                100: New Notice
                200: New Complaint
                201: Status changed by Member
                202: Status changed by Admin
                203: Commented by Member
                204: Commented by Admin
                205: Removed by Member
                206: Removed by Admin
                300: New Classified
                401: Service
                402: Around
                403: RWA
                404: Intercom
                500: New private forum
                501: New public forum
                502: Comment on forum
                503: Emoted on forum
                600: New Member
                601: Image dp change
                602: Name change
                603: Society change
                700: New closed club
                701: New open club
                702: New post in club
                703: Comment on clubpost
                704: New Event
                705: New Member in club
            */
            infovalue: Number,
            infodata: String,
            date: {type: Date, default: Date.now}
        }
    ],

    varstr1: String,
    varstr2: String,
    varnum1: Number,
    varnum2: Number,
    varbool1: Boolean,
    varbool2: Boolean,
    varstrarr1: [ String ],
    varnumarr1: [ Number ],

    createdat: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Notification', notificationSchema);

/***********************************  END  ***********************************/
