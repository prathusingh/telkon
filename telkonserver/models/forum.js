/******************************************************************************
 *
 *  forum.js - Model for FORUM
 *
 *****************************************************************************/

var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , ObjectId = Schema.ObjectId;

var forumSchema;
forumSchema = mongoose.Schema({

    _id: ObjectId,
    fid: String,
    isactive: {type: Boolean, default: true},
    uid: String,
    socid: String,
    title: String,
    details: String,
    category: Number,   // 1: Society, 2: College/School
    forumtype: Number,   // 0: Private; 1: Public
    comments: [
        {
            uid: String,
            socid: String,
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
    byname: String,
    byflat: String,
    byemail: String,
    byphone: String,
    bysocietyname: String,
    bycity: String,
    byimagedp: String,
    totalcomments: {type: Number, default: 0},
    totalviews: {type: Number, default: 0},
    lastact: {type: Date, default: Date.now},

    varstr1: String,
    varstr2: String,
    varstr3: String,
    varnum1: Number,
    varnum2: Number,
    varnum3: Number,
    varbool1: Boolean,
    varbool2: Boolean,
    varbool3: Boolean,
    varstrarr1: [ String ],
    varstrarr2: [ String ],
    varnumarr1: [ Number ],
    varnumarr2: [ Number ],
    
    createdat: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Forums', forumSchema);

/***********************************  END  ***********************************/
