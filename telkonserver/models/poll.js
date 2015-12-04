/******************************************************************************
 *
 *  poll.js - Model for POLL
 *
 *****************************************************************************/


var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , ObjectId = Schema.ObjectId;

var pollSchema;
pollSchema = mongoose.Schema({

    _id: ObjectId,
    pollid: String,
    isactive: {type: Boolean, default: true},
    socid: String,
    uid: String,
    title: String,
    desc: String,
    category: String,
    meantfor: Number,   // 0: Both; 1: Owners; 2:Tenants
    items: [
        {
            itemtype: Number,   // 0: Single Selection, 1: Multiple Selection, 2: Text
            desc: String,
            values: [ String ],
            votes: [
                {
                    uid: String,
                    option: Number
                }
            ]
        }
    ],
    iscompleted: {type: Boolean, default: false},
    validfor: {type: Number, default: 7},
    byname: String,
    byphone: String,
    byemail: String,
    byposition: String,
    bydepartment: String,
    bysocietyname: String,
    ispostedbysys: Boolean,

    varstr1: String,
    varstr2: String,
    varnum1: Number,
    varnum2: Number,
    varbool1: Boolean,
    varbool2: Boolean,
    varstrarr1: [ String ],
    varnumarr1: [ Number ],
    
    createdat: Date,
    expiry: Date
});

module.exports = mongoose.model('Poll', pollSchema);

/***********************************  END  ***********************************/