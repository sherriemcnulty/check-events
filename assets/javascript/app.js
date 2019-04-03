// connect to database
try {
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyDCZf8gynrLPgXluYCKJji0N71TrHHSR9k",
        authDomain: "classtest-6cb54.firebaseapp.com",
        databaseURL: "https://classtest-6cb54.firebaseio.com",
        projectId: "classtest-6cb54",
        storageBucket: "classtest-6cb54.appspot.com",
        messagingSenderId: "77999444853"
    };
    firebase.initializeApp(config);

    var database = firebase.database();
} catch (err) {
    alert("Database connection failed.");
}
// ===========================================================
// locally stores user a unique id 
// localStorage.setItem('id', database.ref().child('data').push().key);

// clear local storage unique id
// localStorage.clear();
// use existing unique user_key to pull data and test returning user experience...
// localStorage.setItem('CE_app_unique_user_id', '-LbR6BxBLel84VvGrCe_');
// declare global variables
let user_key,
    user_zip;
let user_interests = [];
// if unique key is stored locally and exists... 
if (localStorage.getItem('CE_app_unique_user_id')) {
    // store it in a reusable variable...
    var uid = localStorage.getItem('CE_app_unique_user_id');
    // test to make sure this variable works...
    console.log(uid);
    // // declare global variables
    // var user_key;
    // var user_interests = [];
    // var user_zip;
    // access the database to check for a value/key...
    database.ref('data').on('value', gotData);
    // hoists a function that catched the data..
    function gotData(data) {
        // make a variable that stores the keys/url paths on database
        var keys = Object.keys(data.val());
        console.log(keys);
        // if the key in database matches the uid on local storage...
        if (keys.indexOf(uid) != -1) {
        console.log('This key exists!');
        console.log(Object.keys(data.val()));
        database.ref('data').child(uid).on('value', function(obj){
            console.log(obj.val());
            var user_obj = obj.val();
            console.log(user_obj);
            console.log(user_obj['interests'].length);
            console.log(user_obj['zip']);
            // console.log('=======================');
            // get key
            user_key = uid;
            // get interests
            for (var i = 0; i < user_obj['interests'].length; i++) {
                user_interests.push(user_obj['interests'][i]);
            }
            // console.log(user_interests);
            // get zip
            user_zip = user_obj['zip'];
            // console.log(user_zip);

        });
        // console.log('===== RESULTS =====');
        // console.log(user_key);
        // call function to check the checkboxes the user is interested in
        checkInterest(user_interests);
        // call function to load the user's last zip input
        checkZip(user_zip);
    }
    } console.log('why doesn\'t this print?');
    
} else {
    // test that it does not exist by logging it
    console.log('local storage id does not exist');
    // store the new unique id provided by the database to local storage
    localStorage.setItem('CE_app_unique_user_id', database.ref().child('data').push().key);
    // declare a global variable 'user_key' to be the same as the retrieved unique id retrieved from the database and stored to local storage...
    user_key = localStorage.getItem('CE_app_unique_user_id');
    // test that the ids are being stored correctly by logging both to the console...
    console.log('Had to create a new local storage id. It is: '+localStorage.getItem('CE_app_unique_user_id'));
    // ...
    console.log('new user key is: ' + user_key);
}

// tests to see if retrieving user data is successfully global
gatheredData(user_key, user_interests, user_zip);
function gatheredData() {
    // wait for the data to be retrieved from database
    setTimeout(function() {
        console.log('===== GATHERED DATA =====');
        console.log(user_key);
        console.log(user_interests);
        console.log(user_zip);
    }, 5000 ); // waits 900ms before test logging
}


// ===========================================================

// g-variable that stores all 24 categories used in meetup's API
var categories = ['Outdoors & Adventure', 'Tech', 'Family', 'Health & Wellness', 'Sports & Fitness', 'Learning', 'Photography', 'Food & Drink', 'Writing', 'Language & Culture', 'Music', 'Movements', 'LGBTQ', 'Film', 'Sci-Fi & Games', 'Beliefs', 'Arts', 'Book Clubs', 'Dance', 'Pets', 'Hobbies & Crafts', 'Fashion & Beauty', 'Social', 'Career & Business'];
// test log the categories variable
console.log(categories);
// use a for loop to dynamically generate check box input fields for each category
for (var i = 0; i < categories.length; i++) {
    // generate half on one side...
    if (i < categories.length / 2) {
        // generate a bootstrap checkbox...
        var form_1 = $(`
        <div class="form-check">
            <label class="form-check-label">
              <input class="form-check-input" type="checkbox" value="${categories[i]}" name="interests[]">${categories[i]}</label>
        </div>
        `);
        // spawn the generated html to the page...
        $('#interests_1').append(form_1);
    } else { // ...and the other half on the next side...
        // generate a bootstrap checkbox...
        var form_2 = $(`
        <div class="form-check">
            <label class="form-check-label">
              <input class="form-check-input" type="checkbox" value="${categories[i]}" name="interests[]">${categories[i]}</label>
        </div>
        `);
        // spawn the generated html to the page...
        $('#interests_2').append(form_2);
    }
}
// ===========================================================
// dynamically check the check boxes from grabbed stored data of user_interests
function checkInterest(interested) {
    for (var i = 0; i < interested.length; i++) {
        // test log 
        console.log('User has '+interested.length+' interests.');
        var interest = interested[i];
        // for each interest, we want to target that interest's checkbox, and check it
        $(`input[value='${interest}']`).prop('checked', true);
    }
}
function checkZip(zip) {
    $('#zip_code_input').val(zip);
}
// ===========================================================
// obtain reference to checkboxes named interests[]
var interests = $('input[name="interests[]"]');
// test 'interests' are being successfully retreived
console.log('here are the interests: '+interests);

// capture all inputs when #check_events_button is clicked
$(document).on('click', '#check_events_button', function(event) {
    // empty the array of interests to recapture the updated checkboxes...
    user_interests = [];
    console.log('Retrieved '+user_interests.length+' interests from user');
    // prevent button from self click
    event.preventDefault();
    // capture each user checked interest
    for (var i = 0; i < interests.length; i++) {
        // log each value
        // console.log(interests[i].value);
        // if that interest is checked
        if (interests[i].checked) {
            // test log
            console.log(interests[i].value + ' was checked');
            // push the checked interest into the user_interests array
            user_interests.push(interests[i].value);
        }
    }
    // test updated user_interests
    console.log('User interests has updated to '+user_interests.length+' interests...');

    // get user's zip code input
    let user_zip = $('#zip_code_input').val().trim();
    // test log captured zip input
    console.log(user_zip, user_interests);
    // call a declared function that will store captured input into the database, passing in the user's input
    storeUserData(user_zip, user_interests);

    // declare a function that will add the user's input to the database under their unique id/user_key
    function storeUserData(zip, interests) {
        // store the passed data into an object for that will be stored under the user
        let user_data = {
            // set a key relative to the data...
            zip: zip,
            interests: interests
        };
        // test log that user_data was successfully generated
        console.log(user_data);
        
        // declare an empty object variable that will be used as a cargo to pass in updated data to the database
        var updates = {};
        // create a database key/url pathway that will hold the users stored data
        updates['/data/' + user_key] = user_data;
        // test log the cargo-object and it's content
        console.log(updates);
        // inform user that their info will do stored. Could ask permission to store their info onto database by swapping the alert() function to a confirm() function
        alert('We\'ll keep your interests in mind :)');
        // uses firebases's update() function to update the unique database pathway with user_data
        return database.ref().update(updates);
    }
    //==========================================================
});
