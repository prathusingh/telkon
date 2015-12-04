/******************************************************************************
 *
 *  classified.js - Model for CLASSIFIED
 *
 *****************************************************************************/

var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , ObjectId = Schema.ObjectId;

var classifiedSchema;
classifiedSchema = mongoose.Schema({

    _id: ObjectId,
    cid: String,
    isactive: {type: Boolean, default: true},
    uid: String,
    socid: String,
    category: String,
    title: String,
    details: String,
    byname: String,
    byflat: String,
    byemail: String,
    byphone: String,
    bysocietyname: String,
    bycity: String,
    byimagedp: String,
    ispostedbysys: Boolean,
    
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

module.exports = mongoose.model('Classified', classifiedSchema);

/***********************************  END  ***********************************/
