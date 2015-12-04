/******************************************************************************
 *
 *  othersociety.js - Model for OTHERSOCIETY
 *
 *****************************************************************************/

var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , ObjectId = Schema.ObjectId;

var othersocietySchema;
othersocietySchema = mongoose.Schema({

    _id: ObjectId,
    uid: String,
    byname: String,
    byemail: String,
    byphone: String,
    societyname: String,
    city: String,

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

module.exports = mongoose.model('OtherSociety', othersocietySchema);

/***********************************  END  ***********************************/
