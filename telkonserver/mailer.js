/******************************************************************************
 *
 *  mailer.js - MAILER service for Telkon
 *
 *****************************************************************************/

var nodemailer =  require('nodemailer');
var fs = require('fs');
var async = require('async');

var header = require('./header.js');
var helper = require('./helper.js');

var MAIL_TELKON_USERNAME = header.mail.telkon.username;
var MAIL_TELKON_PASSWORD = header.mail.telkon.password;

var MAIL_HELP_USERNAME = header.mail.help.username;
var MAIL_HELP_PASSWORD = header.mail.help.password;

var MAIL_CARE_USERNAME = header.mail.care.username;
var MAIL_CARE_PASSWORD = header.mail.care.password;

var MAIL_NOREPLY_USERNAME = header.mail.noreply.username;
var MAIL_NOREPLY_PASSWORD = header.mail.noreply.password;

var MAIL_INFO_USERNAME = header.mail.info.username;
var MAIL_INFO_PASSWORD = header.mail.info.password;

var MAIL_MASTER_USERNAME = header.mail.master.username;
var MAIL_MASTER_PASSWORD = header.mail.master.password;

var MAIL_FEEDBACK_USERNAME = header.mail.feedback.username;
var MAIL_FEEDBACK_PASSWORD = header.mail.feedback.password;

/* create reusable transporter object using SMTP transport */
var telkonTransporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: MAIL_TELKON_USERNAME,
        pass: MAIL_TELKON_PASSWORD
    }
});

var helpTransporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: MAIL_HELP_USERNAME,
        pass: MAIL_HELP_PASSWORD
    }
});

var careTransporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: MAIL_CARE_USERNAME,
        pass: MAIL_CARE_PASSWORD
    }
});

var noreplyTransporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: MAIL_NOREPLY_USERNAME,
        pass: MAIL_NOREPLY_PASSWORD
    }
});

var infoTransporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: MAIL_INFO_USERNAME,
        pass: MAIL_INFO_PASSWORD
    }
});

var masterTransporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: MAIL_MASTER_USERNAME,
        pass: MAIL_MASTER_PASSWORD
    }
});

var feedbackTransporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: MAIL_FEEDBACK_USERNAME,
        pass: MAIL_FEEDBACK_PASSWORD
    }
});

/* Mail Options */
var telkonMailOptions = {
  from: 'Team Telkon <telkonin@gmail.com>'
};

var helpMailOptions = {
  from: 'help@Telkon <help.telkon@gmail.com>'
};

var careMailOptions = {
  from: 'care@Telkon <care.telkon@gmail.com>'
};
var noreplyMailOptions = {
  from: 'no-reply@Telkon <noreply.telkon@gmail.com>'
};

var infoMailOptions = {
  from: 'info@Telkon <info.telkon@gmail.com>'
};

var masterMailOptions = {
  from: 'master@Telkon <master.telkon@gmail.com>'
};

var feedbackMailOptions = {
  from: 'feedback@Telkon <feedback.telkon@gmail.com>'
};

/* Mail Signature */
var telkonMailSignatureText = '\n\n' + 
                              'TEAM TELKON\n' +
                              //'Call: 9886 455 438\n' +
                              'Email: telkonin@gmail.com\n' +
                              'Website: www.telkon.in';
var telkonMailSignatureHtml = '<br/><br/><p style="color: #3d85c6;">' +
                              '<b><h2>TEAM TELKON</h2></b><br/>' + 
                              //'<img src="http://localhost:8080/logo_94x32.png">' +
                              //'<b>Call:</b> 9886 455 438<br/>' +
                              '<b>Email:</b> telkonin@gmail.com<br/>' +
                              '<b>Website:</b> www.telkon.in' +
                              '</p>';

var helpMailSignatureText = '\n\n' + 
                            'Help Telkon\n' +
                            //'Call: 9886 455 438\n' +
                            'Email: help.telkon@gmail.com\n' +
                            'Website: www.telkon.in';
var helpMailSignatureHtml = '<br/><br/><p style="color: #3d85c6;">' +
                            '<b><h2>Help Telkon</h2></b><br/>' +
                            '<img src="http://localhost:8080/logo_94x32.png">' +
                            '<img src="http://localhost:8080/logo_94x32.png">' +
                            //'<b>Call:</b> 9886 455 438<br/>' +
                            '<b>Email:</b> help.telkon@gmail.com<br/>' +
                            '<b>Website:</b> www.telkon.in' +
                            '</p>';

var careMailSignatureText = '\n\n' + 
                            'Care Telkon\n' +
                            //'Call: 9886 455 438\n' +
                            'Email: care.telkon@gmail.com\n' +
                            'Website: www.telkon.in';
var careMailSignatureHtml = '<br/><br/><p style="color: #3d85c6;">' +
                            '<b><h2>Care Telkon</h2></b><br/>' +
                            //'<img src="http://localhost:8080/logo_94x32.png">' +
                            //'<b>Call:</b> 9886 455 438<br/>' +
                            '<b>Email:</b> care.telkon@gmail.com<br/>' +
                            '<b>Website:</b> www.telkon.in' +
                            '</p>';

var noreplyMailSignatureText =  '\n\n' + 
                                'No-reply Telkon\n' +
                                //'Call: 9886 455 438\n' +
                                'Email: noreply.telkon@gmail.com\n' +
                                'Website: www.telkon.in';
var noreplyMailSignatureHtml =  '<br/><br/><p style="color: #3d85c6;">' +
                                '<b><h2>No-reply Telkon</h2></b><br/>' +
                                //'<img src="http://localhost:8080/logo_94x32.png">' +
                                //'<b>Call:</b> 9886 455 438<br/>' +
                                '<b>Email:</b> noreply.telkon@gmail.com<br/>' +
                                '<b>Website:</b> www.telkon.in' +
                                '</p>';

var infoMailSignatureText = '\n\n' + 
                              'Info Telkon\n' +
                              //'Call: 9886 455 438\n' +
                              'Email: info.telkon@gmail.com\n' +
                              'Website: www.telkon.in';
var infoMailSignatureHtml = '<br/><br/><p style="color: #3d85c6;">' +
                              '<b><h2>Info Telkon</h2></b><br/>' +
                              //'<img src="http://localhost:8080/logo_94x32.png">' +
                              //'<b>Call:</b> 9886 455 438<br/>' +
                              '<b>Email:</b> info.telkon@gmail.com<br/>' +
                              '<b>Website:</b> www.telkon.in' +
                              '</p>';

var masterMailSignatureText = '\n\n' +
                              'Master Telkon\n' +
                              //'Call: 9886 455 438\n' +
                              'Email: master.telkon@gmail.com\n' +
                              'Website: www.telkon.in';
var masterMailSignatureHtml = '<br/><br/><p style="color: #3d85c6;">' +
                              '<b><h2>Master Telkon</h2></b><br/>' +
                              '<img src="http://localhost:8080/logo_94x32.png">' +
                              '<img src="cid:logo@telkon.in">' +
                              //'<b>Call:</b> 9886 455 438<br/>' +
                              '<b>Email:</b> master.telkon@gmail.com<br/>' +
                              '<b>Website:</b> www.telkon.in' +
                              '</p>';

var feedbackMailSignatureText = '\n\n' +
                                'Feedback Telkon\n' +
                                //'Call: 9886 455 438\n' +
                                'Email: feedback.telkon@gmail.com\n' +
                                'Website: www.telkon.in';
var feedbackMailSignatureHtml = '<br/><br/><p style="color: #3d85c6;">' +
                                '<b><h2>Feedback Telkon</h2></b><br/>' +
                                //'<img src="http://localhost:8080/logo_94x32.png">' +
                                //'<b>Call:</b> 9886 455 438<br/>' +
                                '<b>Email:</b> feedback.telkon@gmail.com<br/>' +
                                '<b>Website:</b> www.telkon.in' +
                               '</p>';

module.exports = {

  telkonSendMail              : telkonSendMail,
  helpSendMail                : helpSendMail,
  careSendMail                : careSendMail,
  noreplySendMail             : noreplySendMail,
  infoSendMail                : infoSendMail,
  masterSendMail              : masterSendMail,
  feedbackSendMail            : feedbackSendMail

};


////////////////////

/* NOT IMPLEMENTED ROUTES */
function notImplemented(req, res, next) {
  next(new Error(
    'Data service method for ' + req.method + ' ' + req.url + ' is not implemented'
  ));
}

function getMailSign(callback) {

  var htmlFile = './public/views/signature.html';
  var textFile = './public/views/signature.txt';

  var html = '';
  var text = '';

  async.parallel([
      function(callback) {
          fs.readFile(htmlFile, function read(err, data) {
              html = data;
              callback();
          });
      },
      function(callback) {
          fs.readFile(textFile, function read(err, data) {
              text = data;
              callback();
          });
      }
  ],

  function(err, results) {
      if(err) {
          callback(err, null, null);
      } else {
          callback(null, html, text);
      }
  });

  
}

function telkonSendMail(maillist, options, callback) {

    getMailSign(function(err, html, text) {

      if(err) {
          callback(err, null);
      } else {

        if(options.text) {
          options.text += text;
        } else {
          options.text = text;
        }

        if(options.html) {
          options.html += html;
        } else {
          options.html = html;
        }

        var finalOptions = helper.mergeObjects(telkonMailOptions, options);
        telkonTransporter.sendMail(finalOptions, function(error, info) {
            callback(error, info);
        });
      }
    });
}

function helpSendMail(maillist, options, callback) {

    getMailSign(function(err, html, text) {

      if(err) {
          callback(err, null);
      } else {

        if(options.text) {
          options.text += text;
        } else {
          options.text = text;
        }

        if(options.html) {
          options.html += html;
        } else {
          options.html = html;
        }

        var finalOptions = helper.mergeObjects(helpMailOptions, options);
        helpTransporter.sendMail(finalOptions, function(error, info) {
            callback(error, info);
        });
      }
    });
}

function careSendMail(maillist, options, callback) {

    getMailSign(function(err, html, text) {

      if(err) {
          callback(err, null);
      } else {

        if(options.text) {
          options.text += text;
        } else {
          options.text = text;
        }

        if(options.html) {
          options.html += html;
        } else {
          options.html = html;
        }

        var finalOptions = helper.mergeObjects(careMailOptions, options);
        careTransporter.sendMail(finalOptions, function(error, info) {
            callback(error, info);
        });
      }
    });
}

function noreplySendMail(maillist, options, callback) {

    getMailSign(function(err, html, text) {

      if(err) {
          callback(err, null);
      } else {

        if(options.text) {
          options.text += text;
        } else {
          options.text = text;
        }

        if(options.html) {
          options.html += html;
        } else {
          options.html = html;
        }

        var finalOptions = helper.mergeObjects(noreplyMailOptions, options);
        noreplyTransporter.sendMail(finalOptions, function(error, info) {
            callback(error, info);
        });
      }
    });
}

function infoSendMail(maillist, options, callback) {

    getMailSign(function(err, html, text) {

      if(err) {
          callback(err, null);
      } else {

        if(options.text) {
          options.text += text;
        } else {
          options.text = text;
        }

        if(options.html) {
          options.html += html;
        } else {
          options.html = html;
        }

        var finalOptions = helper.mergeObjects(infoMailOptions, options);
        infoTransporter.sendMail(finalOptions, function(error, info) {
            callback(error, info);
        });
      }
    });
}

function masterSendMail(maillist, options, callback) {

    getMailSign(function(err, html, text) {

      if(err) {
          callback(err, null);
      } else {

        if(options.text) {
          options.text += text;
        } else {
          options.text = text;
        }

        if(options.html) {
          options.html += html;
        } else {
          options.html = html;
        }

        var finalOptions = helper.mergeObjects(masterMailOptions, options);
        masterTransporter.sendMail(finalOptions, function(error, info) {
            callback(error, info);
        });
      } 
    });
}

function feedbackSendMail(maillist, options, callback) {

    getMailSign(function(err, html, text) {

      if(err) {
          callback(err, null);
      } else {

        if(options.text) {
          options.text += text;
        } else {
          options.text = text;
        }

        if(options.html) {
          options.html += html;
        } else {
          options.html = html;
        }

        var finalOptions = helper.mergeObjects(feedbackMailOptions, options);
        feedbackTransporter.sendMail(finalOptions, function(error, info) {
            callback(error, info);
        });
      }
    });
}

/***********************************  END  ***********************************/
