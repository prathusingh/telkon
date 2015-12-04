/******************************************************************************
 *
 *  enquire.js - Model for ENQUIRE
 *
 *****************************************************************************/

var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , ObjectId = Schema.ObjectId;

var enquireSchema;
enquireSchema = mongoose.Schema({

    _id: ObjectId,
    byname: String,
    byemail: String,
    message: String,

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

module.exports = mongoose.model('Enquire', enquireSchema);

/***********************************  END  ***********************************/
