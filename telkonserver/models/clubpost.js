/******************************************************************************
 *
 *  clubpost.js - Model for CLUBPOST
 *
 *****************************************************************************/

var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , ObjectId = Schema.ObjectId;

var clubpostSchema;
clubpostSchema = mongoose.Schema({

    _id: ObjectId,
    isactive: {type: Boolean, default: true},
    clubpostid: String,
    clubid: String,
    uid: String,
    socid: String,
    title: String,
    details: String,
    byname: String,
    byemail: String,
    byphone: String,
    bysocietyname: String,
    bycity: String,
    byimagedp: String,
    comments: [
        {
            uid: String,
            value: String,
            byname: String,
            bysocietyname: String,
            bycity: String,
            byimagedp: String,
            /* Feeling -
                0: neutral
                1: for
                2: against
            */
            opinion: Number,
            date: {type: Date, default: Date.now}
        }
    ],
    emo: {
        laugh: {type: Number, default: 0},  // emotype: 1
        tongue: {type: Number, default: 0},     // emotype: 2
        love: {type: Number, default: 0},   // emotype: 3
        confused: {type: Number, default: 0},   // emotype: 4
        angry: {type: Number, default: 0},  // emotype: 5
        evil: {type: Number, default: 0}    // emotype: 6
    },

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

module.exports = mongoose.model('ClubPost', clubpostSchema);

/***********************************  END  ***********************************/
