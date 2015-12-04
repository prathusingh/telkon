/* Write here your custom javascript codes */

$(document).ready(function() {

    //turn to inline mode
    $.fn.editable.defaults.mode = 'inline';

    //make Profile Fields editable
    $('#profile_name').editable({
        type: 'text',
        pk: 1,
        url: '#',
        title: 'Enter your name',
        display: function(value){
            if(!value) {
                $(this).empty();
                return;
            }
            $(this).html(value.capitalize());
        },
        validate: function(value){
            if(value == '') return 'name is required!'
        }
    });

    $('#profile_phone').editable({
        type: 'text',
        pk: 1,
        url: '#',
        title: 'Enter your phone number',
        value: "9886455438",
        display: function(value) {
            if(!value) {
                $(this).empty();
                return;
            }
            var html = '+91 ' + $('<div>').text(value.substring(0,4)).html() + ' ' +
                                $('<div>').text(value.substring(4,7)).html() + ' ' +
                                $('<div>').text(value.substring(7)).html();
            $(this).html(html);
        },
        validate: function(value){
            if(value == '') {
                return 'phone number is required!';
            }
            else if(value.length != 10) {
                return 'not a valid number!';
            }
            else if(isNaN(value)) {
                return 'not a valid number!';
            }
            else if( !(value.charAt(0) == 9 || value.charAt(0) == 8 || value.charAt(0) == 7)) {
                return 'not a valid number';
            }
        }
    });

    $('#status').editable({
        type: 'select',
        title: 'Select status',
        placement: 'right',
        value: 2,
        source: [
            {value: 1, text: 'status 1'},
            {value: 2, text: 'status 2'},
            {value: 3, text: 'status 3'}
        ]
        /*
        //uncomment these lines to send data on server
        ,pk: 1
        ,url: '/post'
        */
    });

    

});

String.prototype.capitalize = function() {
    return this.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
};
