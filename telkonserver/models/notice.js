/******************************************************************************
 *
 *  notice.js - Model for NOTICE
 *
 *****************************************************************************/

var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , ObjectId = Schema.ObjectId;

var noticeSchema;
noticeSchema = mongoose.Schema({

    _id: ObjectId,
    nid: String,
    uid: String,
    isactive: {type: Boolean, default: true}, // 'false' when removed by ADMIN
    socid: String,
    meantfor: String,   // 0: Owner; 1: Tenant; 2: Both
    title: String,
    contentshort: String,
    desc: String,
    contenturl: String, /* URL */
    byname: String,
    byemail: String,
    byposition: String,

    /*
    * 1: Club
    * 2: RWA
    * 3. Facilities Management Dept
    */
    bydepartment: String,
    bysocietyname: String,
    validfor: {type: Number, default: 30},
    meantfor: Number,   // 0: Both; 1: Owners; 2:Tenants
    ispostedbysys: Boolean,
    createdat: {type: Date},

    varstr1: String,
    varstr2: String,
    varnum1: Number,
    varnum2: Number,
    varbool1: Boolean,
    varbool2: Boolean,
    varstrarr1: [ String ],
    varnumarr1: [ Number ],

    expiry: Date
});

module.exports = mongoose.model('Notice', noticeSchema);

/***********************************  END  ***********************************/
