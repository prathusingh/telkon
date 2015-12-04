/******************************************************************************
 *
 *  issue.js - Model for ISSUE
 *
 *****************************************************************************/

var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , ObjectId = Schema.ObjectId;

var issueSchema;
issueSchema = mongoose.Schema({

    _id: ObjectId,
    uid: String,
    socid: String,
    message: String,
    byname: String,
    byemail: String,
    byphone: String,
    byrole: String,
    bysocietyname: String,
    bycity: String,
    byimagedp: String,

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

module.exports = mongoose.model('Issue', issueSchema);

/***********************************  END  ***********************************/
