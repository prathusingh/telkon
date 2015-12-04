/******************************************************************************
 *
 *  complaint.js - Model for COMPLAINT
 *
 *****************************************************************************/

var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , ObjectId = Schema.ObjectId;

var complaintSchema;
complaintSchema = mongoose.Schema({

    _id: ObjectId,
    compid: String,
    isactive: {type: Boolean, default: true},
    uid: String,
    socid: String,
    category: String,
    subject: String,
    desc: String,

    /* Current Status -
     *
     * Registered
     * Processing
     * Escalated
     * Resolved
     * Escalation
     * Requested
     * Removed by Member
     * Removed by Admin
     */
    currentstatus: String,
    byname: String,
    byflat: String,
    byemail: String,
    byphone: String,
    byresidencetype: Number,
    byimagedp: String,
    societyname: String,
    timeline: [
        {
            date: {type: Date, default: Date.now},
            day: String,
            complaintstatus: String,
            comments: String
        }
    ],

    isescalationreq: {type: Boolean, default: false},
    escalationreqby: String,

    isescalated: {type: Boolean, default: false},
    escalatedby: String,

    isremovedbymember: {type: Boolean, default: false},
    removedbymember: String,
    
    isremovedbyadmin: {type: Boolean, default: false},
    removedbyadmin: String,
    
    isresolved: {type: Boolean, default: false},

    varstr1: String,
    varstr2: String,
    varstr3: String,
    varnum1: Number,
    varnum2: Number,
    varnum3: Number,
    varbool1: Boolean,
    varbool2: Boolean,
    varbool3: Boolean,
    varstrarr1: [ String ],
    varstrarr2: [ String ],
    varnumarr1: [ Number ],
    varnumarr2: [ Number ],
    
    createdat: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Complaint', complaintSchema);

/***********************************  END  ***********************************/