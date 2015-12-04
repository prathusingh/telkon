/******************************************************************************
 *
 *  user.js - Model for USER
 *
 *****************************************************************************/

var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , ObjectId = Schema.ObjectId;

var userSchema;
userSchema = mongoose.Schema({

    _id: ObjectId,
    uid: String,
    isactive: {type: Boolean, default: true},
    hasactive: {type: Boolean, default: false},
    wrongattempt: {type: Number, default: 0},   // wrong login attempt
    gcmid: String,  //  member-specific
    accesscode: String, // google oAuth2
    accesstoken: {  // google oAuth2
        access_token: String,
        token_type: String,
        id_token: String,
        refresh_token: String,
        expiry_date: Date
    },
    imagedp: String,   // dp
    socid: String,

    /* role - 
        0 - sys
        1 - guestplus
        2 - guestmember
        3 - guestadmin
        4 - member
        5 - admin
        6 - superadmin
        7 - dual (member + admin)
        8 - superdual (member + superadmin)
        9 - block
    */
    role: Number,
    category: Number,   // 1: Society, 2: College/School
    email: String,
    password: String,
    flat: String,   //  member-specific
    societyname: String,
    city: String,
    residencetype: Number,  // member-specific, 0: Owner; 1: Tenant; 2: Both
    name: String,
    phone: String,
    aboutme: String,    // member-specific
    intercom: String,   // member-specific
    position: String,   // admin-specfic
    isblocked: {type: Boolean, default: false},
    blockedby: String,
    isremoved: {type: Boolean, default: false},
    removedfrom: [ String ],
    removenum: Number,
    reported: [ String ],   // List of members whom I have reported
    isreported: {type: Boolean, default: false},    // Is reported by others?
    reportedby: [ String ],     // List of members reported me

    /*
    * 1: Club
    * 2: RWA
    * 3. Facilities Management Dept
    */
    department: String,     // admin-specfic
    subscribedclubs: [ String ],    //  member-specific
    clubscreated: [ String ],    //  member-specific
    clubsadmin: [ String ],    //  member-specific
    complaints: [ String ],
    classifiedsread: [ String ],    //  member-specific
    forumsread: [ String ],    //  member-specific
    favoriteforums: [ String ],    //  member-specific
    forumsfeeling: [  String ],  //  member-specific
    forumsfeelingemo: [ String ],    //  member-specific
    family: [   //  member-specific
        {
            uid: String,
            name: String,
            email: String,
            phone: String
        }
    ],
    myclassifieds: [ String ],  //  member-specific
    noticesread: [ String ],    //  member-specific
    savednotices: [ String ],   //  member-specific
    savedclassifieds: [ String ],   //  member-specific

    /* updates - notices, classifieds, contacts, rules, family, vereasy, verstrict */
    updates: [ Number ],
    membersince: Date,
    adminsince: Date,

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

module.exports = mongoose.model('User', userSchema);

/***********************************  END  ***********************************/