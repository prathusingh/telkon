/******************************************************************************
 *
 *  contact.js - Model for CONTACT
 *
 *****************************************************************************/


var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , ObjectId = Schema.ObjectId;

var contactSchema;
contactSchema = mongoose.Schema({

    _id: ObjectId,
    contactid: String,
    isactive: {type: Boolean, default: true},
    socid: String,
    uid: String,

    /*
     1. service
     2. around
     3. rwa
     4. intercom
    */
    category: Number,
    name: String,
    email: String,
    phone: String,
    servicetype: String,       //  Service-specific
    location: String,   //  Intercom, around -specific
    position: String,   //  RWA/Association-specific
    flat: String,       //  RWA/Association-specific
    pincode: String,        //  Service-specific and Around me-specific
    updatedon: Date,

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

module.exports = mongoose.model('Contact', contactSchema);

/***********************************  END  ***********************************/