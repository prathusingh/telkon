//////////////////// /* HELPER FILE */ ////////////////////

var GOOGLE_DOC_URL = 'http://docs.google.com/gview?url=';
var MOMENT_DISPLAY_DATE = 'Do MMMM YYYY';
var MOMENT_DISPLAY_DATE_TIME = "hh:mm a, Do MMMM YYYY";
var CONTENT_LENGTH_NOTICE = 50;
var TITLE_LENGTH_NOTICE = 50;
var IMAGE_MIME_TYPE = [
	'image/jpeg',
	'image/png',
	'image/gif',
];

var AWS_S3_CRED = {
	bucket: 'telkon',
	access_key: 'AKIAJKLEQS2Q7ZBHJZCQ',
	secret_key: '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'
};

var AWS_URL = {
	IMAGEDP: 'https://s3-us-west-2.amazonaws.com/telkon/imagedp/'
};

var AWS_UPLOAD_FOLDER = {
	IMAGEDP: 'imagedp'
};

var IMAGEDP_WIDTH = {
	CLUBPAGE: 300
}
//////////////////// /* Error Codes*/ ////////////////////

/* HTTP STATUS CODE */
var ERROR_400 = 'Invalid parameters';
var ERROR_401 = 'Unauthorized';
var ERROR_403 = 'Unexpected error. Please log in again';
var ERROR_404 = 'Not found. Try after sometime';
var ERROR_500 = 'Server Problem. Try after some time';
var ERROR_UNKNOWN = 'Unknown Problem. Try after some time';
var ERROR_DATA_NOT_FOUND = 'Requested data is not found';

/* USER */

var ERROR_USER_INVALID_EMAIL = 'Please enter a valid Email Id';
var ERROR_USER_NOT_REGISTERED_EMAIL = 'This Email Id is not registered';
var ERROR_USER_UNAVAILABLE_EMAIL = 'This Email Id is already registered';
var ERROR_USER_MISMATCH_PASSWORD = 'Passwords do not match';
var ERROR_USER_LENGTH_PASSWORD = 'Password must be atleast 6 characters long';
var ERROR_USER_EMPTY_PASSWORD = 'Please enter Password';
var ERROR_USER_EMPTY_PHONE = 'Invalid Phone Number';
var ERROR_USER_EMPTY_NAME = 'Please enter your Name';
var ERROR_USER_EMPTY_SOCIETY = 'Please select your Society';
var ERROR_USER_EMPTY_SOCIETY2 = 'Please enter your Society name';
var ERROR_USER_EMPTY_FLAT = 'Please enter your Flat Number';
var ERROR_USER_EMPTY_PINCODE = 'Invalid Pincode';
var ERROR_USER_EMPTY_LOCALITY = 'Please select a Locality';
var ERROR_USER_EMPTY_CITY = 'Please select a City';
var ERROR_USER_INCORRECT_CREDENTIALS = 'Incorrect Credentials';

/* NOTICE */
var ERROR_NOTICE_FILE_SIZE_LIMIT = 'Maximum file size limit is 10MB';
var ERROR_NOTICE_FILE_FORMAT = 'Invalid format. Kindly attach a PDF file';
var ERROR_NOTICE_EMPTY_TITLE = 'Please enter a Title';
var ERROR_NOTICE_EMPTY_CONTENT = 'Please enter the description';

/* COMPLAINT */
var ERROR_COMPLAINT_TYPES = 'Unable to get Complaint types. Choose \'others\'';
var ERROR_COMPLAINT_EMPTY_CATEGORY = 'Please select a Category';
var ERROR_COMPLAINT_EMPTY_SUBJECT = 'Please enter a Subject';
var ERROR_COMPLAINT_EMPTY_DESC = 'Please enter the complaint description';
var ERROR_COMPLAINT_TIMELINE_UPDATE = 'Unable to update the timeline';

/* CLASSIFIED */
var ERROR_CLASSIFIED_TYPES = 'Unable to get Classified types. Choose \'others\'';
var ERROR_COMPLAINT_EMPTY_CATEGORY = 'Please select a Category';
var ERROR_COMPLAINT_EMPTY_TITLE = 'Please enter a Title';
var ERROR_COMPLAINT_EMPTY_DETAILS = 'Please enter the details';

/* CONTACT */


/* FORUM */
var ERROR_FORUM_EMPTY_TITLE = 'Please enter a Title';
var ERROR_FORUM_EMPTY_DETAILS = 'Please enter the Details';
var ERROR_FORUM_EMPTY_NEW_COMMENT = 'Please enter some comment';


/* CLUB */
var ERROR_CLUB_TYPES = 'Unable to get Club types. Choose \'others\'';
var ERROR_CLUB_EMPTY_CATEGORY = 'Please select a Category';
var ERROR_CLUB_EMPTY_NAME = 'Please enter a Name';
var ERROR_CLUB_EMPTY_DETAILS = 'Please write something about the club';
var ERROR_CLUB_EVENT_EMPTY_TITLE = 'Please enter a Title';
var ERROR_CLUB_EVENT_EMPTY_DATE = 'Please enter Event Date';
var ERROR_CLUB_EVENT_EMPTY_DETAILS = 'Please write something about the event';
var ERROR_CLUB_POST_ADD_DENIED = "Permission denied. Only members are allowed to post";
var ERROR_CLUB_EVENT_INVALID_DATE = 'Invalid date';

/* MEMBER */
var ERROR_MEMBER_DETAILS_RETRIEVAL = 'Failed to retrieve the member details';
var ERROR_MEMBER_COMPLAINTS_RETRIEVAL = 'Failed to retrieve the member complaints';
var ERROR_MEMBER_BLOCK_SELF = 'Cannot block yourself';
var ERROR_MEMBER_UNBLOCK_SELF = 'Cannot unblock yourself';
var ERROR_MEMBER_CLEAN_SELF = 'Cannot clean yourself';
var ERROR_MEMBER_REMOVE_SELF = 'Cannot remove yourself';

/* ADMIN */
var ERROR_ADMIN_ADD_PERMISSION_DENIED = 'Permission denied';
var ERROR_ADMIN_ADD_NOT_ALLOWED = 'Already an admin of other society';
var ERROR_ADMIN_ADD_REPEAT = 'Already an admin';
var ERROR_ADMIN_ADD_BLOCKED = 'User is Blocked';
var ERROR_ADMIN_REMOVE_PERMISSION_DENIED = 'Permission Denied';
var ERROR_ADMIN_REMOVE_SELF = 'Cannot Remove';
var ERROR_ADMIN_EMPTY_EMAIL = 'Please enter an email id';
var ERROR_ADMIN_INVALID_EMAIL = 'Please enter a valid email id';

/* PROFILE */
var ERROR_PROFILE_EMPTY_NAME = 'Please enter your name';
var ERROR_PROFILE_UPDATED_ABOUTME = 'Please write something about yourself';
var ERROR_PROFILE_EMPTY_PHONE = 'Please enter your phone number';
var ERROR_PROFILE_INVALID_PHONE = 'Please enter a valid phone number';
var ERROR_PROFILE_EMPTY_POSITION = 'Please enter your position';
var ERROR_PROFILE_EMPTY_DEPARTMENT = 'Please enter your department';
var ERROR_PROFILE_ABORTED_IMAGEDP = 'Aborted';
var ERROR_PROFILE_EMPTY_IMAGEDP = 'Please select an image';
var ERROR_PROFILE_INVALID_IMAGEDP = 'Invalid file selected';

/* SIDENAV */
var ERROR_COMINGSOON_FEEDBACK_EMPTY_MESSAGE = 'Please enter feedback or suggestion';


//////////////////// /* Success Codes*/ ////////////////////

/* USER */
var SUC_USER_PASSWORD_MAILED = 'New password has been sent to your Email Id';
var SUC_USER_REGISTERED = 'Congratulations! Registration is successful';

/* NOTICE */
var SUC_NOTICE_POSTED = 'Posted Successfully';
var SUC_NOTICE_UPLOADED = 'Uploaded Successfully';
var SUC_NOTICE_SAVED = 'Notice Saved!';
var SUC_NOTICE_UNSAVED = 'Notice Unsaved!';
var SUC_NOTICE_REMOVED = 'Notice Removed!';

/* COMPLAINT */
var SUC_COMPLAINT_REGISTERED = 'Complaint has been registered successfully';

/* CLASSIFIED */
var SUC_CLASSIFIED_SAVED = 'Classified saved';
var SUC_CLASSIFIED_UNSAVED = 'Classified unsaved';
var SUC_CLASSIFIED_POSTED = 'Classified posted successfully';
var SUC_CLASSIFIED_REMOVED = 'Classified removed';

/* CONTACT */
var SUC_CONTACT_ADDED = 'Contact Added';
var SUC_CONTACT_UPDATED = 'Contact Updated';
var SUC_CONTACT_REMOVED = 'Contact Deleted';

/* FORUM */
var SUC_FORUM_POSTED = 'Forum posted successfully';
var SUC_FORUM_MARKED_FAV = 'Marked Favorite';
var SUC_FORUM_MARKED_UNFAV = 'Removed Favorite';
var SUC_FORUM_EMOTED = 'Emoted';

/* CLUB */
var SUC_CLUB_CREATED = 'Club created successfully';
var SUC_CLUB_SUBSCRIBED = 'Club Subscribed';
var SUC_CLUB_UNSUBSCRIBED = 'Club Unsubscribed';
var SUC_EVENT_ADDED = 'Event added successfully';
var SUC_CLUB_POST_ADDED = 'Posted successfully';
var SUC_CLUB_PAGE_UPDATED_IMAGEDP = 'Updated successfully';

/* SIDENAVS */
var SUC_SAVEDNOTICES_REMOVED = 'Notice removed';
var SUC_SAVEDCLASSIFIEDS_REMOVED = 'Classified removed';
var SUC_MYCLASSIFIED_REMOVED = 'Classified removed';
var SUC_MYFORUMS_REMOVED = 'Forum removed';
var SUC_COMINGSOON_FEEDBACK_SUBMITTED = 'Thanks for the Feedback/Suggestion. We will look into it closely';

/* ADMIN */
var SUC_ADMIN_ADDED = 'Added a new admin';
var SUC_ADMIN_INVITED = 'Invited to join';
var SUC_ADMIN_REMOVED = 'Admin removed';
var SUC_ADMIN_REMOVED = 'Admin added';

/* PROFILE */
var SUC_PROFILE_UPDATED_IMAGEDP = 'Updated Successfully';
var SUC_PROFILE_UPDATED_NAME = 'Name updated';
var SUC_PROFILE_UPDATED_ABOUTME = 'About Me Updated';
var SUC_PROFILE_UPDATED_PHONE = 'Phone updated';
var SUC_PROFILE_UPDATED_POSITION = 'Position updated';
var SUC_PROFILE_UPDATED_DEPARTMENT = 'Department updated';
var SUC_PROFILE_RESET_PASSWORD = 'Password reset';
var SUC_PROFILE_SUPPORT_ADDED = 'Thanks for your support';

/* RULES */
var SUC_ADMIN_UPDATED_RULES = 'Rules updated';

/* ACCOUNT */
var SUC_ACCOUNT_DELETED = 'Account deleted';
var SUC_ACCOUNT_SUSPENDED = 'Account suspended';


function getErrorVal(err) {

	var message = '';
	if(err.status == 400) {
		message = ERROR_400;
	} else if(err.status == 401) {
		message = ERROR_401;
	} else if(err.status == 403) {
		message = ERROR_403;
	} else if(err.status == 404) {
		message = ERROR_404;
	} else if(err.status == 500) {
		message = ERROR_500;
	} else {
		message = ERROR_UNKNOWN;
	} 

	return message;
}

////////////////////

/* UTILITY FUNCTIONS */

function chunk(arr, size) {
	var newArr = [];
	for (var i=0; i<arr.length; i+=size) {
		newArr.push(arr.slice(i, i+size));
	}
	return newArr;
}

function validateEmail(email) { 
   var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
   return re.test(email);
}

function validatePhone(phone) {
   
   if(isNaN(phone)) {
		return false;
	} else if(phone.length != 10) {
		return false;
	}
	return true;
}

function validatePincode(pincode) {
   
   if(isNaN(pincode)) {
		return false;
	} else if(pincode.length != 6) {
		return false;
	}
	return true;
}

function toFirstLetterCap(str) {
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1);});
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getBootboxTable(params) {

	var begin = '<table class="table">' +
					'<tbody>';

	var end = 		'</tbody>' +
				'</table>';

	var data = '';

	for (var i=0; i<params.length; i++) {

		data += '<tr class="font-size-18">' +
					'<td>' +
						params[i].field +
					'</td>' +
					'<td class="color-blue">' +
						params[i].value +
					'</td>' +
				'</tr>';

	}

	return begin + data + end;
}

/* DD/MM/YYYY*/
function testDate(str) {

	console.log(str);
	var t = str.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
	if(t===null) {
		console.log(t);
		return false;
	}

	var d=+t[1], m=+t[2], y=+t[3];
	//below should be more acurate algorithm
	console.log(d + '-' + m + '-' + y);
	if(m>=1 && m<=12 && d>=1 && d<=31) {
		return true;  
	}
	return false;
}

function base64ToFile(base64Data, tempfilename, contentType) {
    contentType = contentType || '';
    var sliceSize = 1024;
    var byteCharacters = atob(base64Data);
    var bytesLength = byteCharacters.length;
    var slicesCount = Math.ceil(bytesLength / sliceSize);
    var byteArrays = new Array(slicesCount);

    for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
        var begin = sliceIndex * sliceSize;
        var end = Math.min(begin + sliceSize, bytesLength);

        var bytes = new Array(end - begin);
        for (var offset = begin, i = 0 ; offset < end; ++i, ++offset) {
            bytes[i] = byteCharacters[offset].charCodeAt(0);
        }
        byteArrays[sliceIndex] = new Uint8Array(bytes);
    }
    var file = new File(byteArrays, tempfilename, { type: contentType });
    return file;
}

function dataURItoBlob(dataURI) {
			    
	// convert base64/URLEncoded data component to raw binary data held in a string
	var byteString;
	if (dataURI.split(',')[0].indexOf('base64') >= 0)
		byteString = atob(dataURI.split(',')[1]);
	else
		byteString = unescape(dataURI.split(',')[1]);

	// separate out the mime component
	var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

	// write the bytes of the string to a typed array
	var ia = new Uint8Array(byteString.length);
	for (var i = 0; i < byteString.length; i++) {
		ia[i] = byteString.charCodeAt(i);
	}

	return new Blob([ia], {type:mimeString});
}