/******************************************************************************
 *
 *  gapi.js - Google API file
 *
 *****************************************************************************/

var readline = require('readline');

var gapi = require('googleapis');
var OAuth2Client = gapi.auth.OAuth2;
var plus = gapi.plus('v1');

var CLIENT_ID = '17816415120-m5j2lv98c6gpre3j9q29env9jc100nbu.apps.googleusercontent.com';
var CLIENT_SECRET = 'sUbCvNkjwybtFrzfPgbo-EGU';
var REDIRECT_URL = 'http://localhost:3000/oauth2callback';

var oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function getAccessToken(oauth2Client, callback) {
  // generate consent page url
  var url = oauth2Client.generateAuthUrl({
    access_type: 'offline', // will return a refresh token
    scope: 'https://www.googleapis.com/auth/plus.me' // can be a space-delimited string or an array of scopes
  });

  gapi.url = url;
  
  rl.question('Enter the code here:', function(code) {
    // request access token
    oauth2Client.getToken(code, function(err, tokens) {
      // set tokens to the client
      // TODO: tokens should be set by OAuth2 client.
      oauth2Client.setCredentials(tokens);
      callback();
    });
  });
}


// retrieve an access token
getAccessToken(oauth2Client, function() {
  // retrieve user profile
  plus.people.get({ userId: 'me', auth: oauth2Client }, function(err, profile) {
    if (err) {
      console.log('An error occured', err);
      return;
    }
    console.log(profile.displayName, ':', profile.tagline);
  });
});

module.exports = gapi;

/***********************************  END  ***********************************/
