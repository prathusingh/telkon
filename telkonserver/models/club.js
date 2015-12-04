/******************************************************************************
 *
 *  club.js - Model for CLUB
 *
 *****************************************************************************/

var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , ObjectId = Schema.ObjectId;

var clubSchema;
clubSchema = mongoose.Schema({

    _id: ObjectId,
    clubid: String,
    isactive: {type: Boolean, default: true},
    uid: String,
    socid: String,

    /* Club Type -
     *
     * 0. intra
     * 1. inter
    */
    clubtype: Number,

    /* Club Scope -
     *
     * 0. closed
     * 1. open
    */
    clubscope: Number,

    /* Category -
     *
     * 1. music
     * 2. dance
     * 3. jog
     * 4. mime
     * 5. cricket
     * 6. football
     * 7. hockey
     * 8. tabletennis
     * 9. tennis
     * 10. golf
     * 11. other
    */
    category: String,
    name: String,
    lowercasename: String,
    details: String,
    imagedp: String,
    bysocietyname: String,
    bylocality: String,
    bycity: String,
    pincode: String,
    members: [ String ],
    admins: [ String ],
    memberrequests: [ String ],
    membercount: Number,
    events: [
        {
            _id: ObjectId,
            isactive: {type: Boolean, default: true},
            eventid: String,
            uid: String,
            socid: String,
            date: Date,
            title: String,
            details: String,
            venue: String,
            image: String,
            byname: String,
            byemail: String,
            byphone: String
        }
    ],
    iscreatedbysys: Boolean,
    
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

module.exports = mongoose.model('Club', clubSchema);

/***********************************  END  ***********************************/