/******************************************************************************
 *
 *  society.js - Model for SOCIETY
 *
 *****************************************************************************/

var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , ObjectId = Schema.ObjectId;

var societySchema;
societySchema = mongoose.Schema({

    _id: ObjectId,
    socid: String,
    isactive: {type: Boolean, default: true},
    issupported: {type: Boolean, default: true},

    /* supprotlevel -
    *  -1: not supported
    *   0: full support
    *   1: notice only
    *   2: complaint only
    */
    supportlevel: {type: Number, default: -1},
    createdby: String, // uid of Creator Admin
    societyname: String,
    societycode: String,
    locality: String,
    city: String,
    state: String,
    pincode: String,
    email: [ String ],
    phone: [ String ],
    imagedp: String,
    layoutphase: {type: Number, default: 0},
    layouttower: {type: Number, default: 0},
    layoutblock: {type: Number, default: 0},
    layoutflats: {type: Number, default: 0},
    flatsample: String,
    totalmembers: {type: Number, default: 0},
    totalowners: {type: Number, default: 0},
    totaltenants: {type: Number, default: 0},
    societyrules: String, /* URL */

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

module.exports = mongoose.model('Society', societySchema);

/***********************************  END  ***********************************/
