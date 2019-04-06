$(document).ready(function() {
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
    // =================================================
    // clear local storage unique id to test as new user
    // localStorage.clear();
    // use existing unique user_key to pull data and test returning user experience...
    // localStorage.setItem('CE_app_unique_user_id', '-LbR6BxBLel84VvGrCe_');
    // =================================================

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
        // access the database to check for a value/key...
        database.ref('data').on('value', gotData);
        // hoists a function that catched the data..
        function gotData(data) {
            // make a variable that stores the keys/url paths on database
            var keys = Object.keys(data.val());
            console.log(keys);
            // if the key in database matches the uid on local storage...
            if (keys.indexOf(uid) != -1) {
            // test log to see if statement properly works...
            console.log('This key exists!');
            // test log shoutd print database keys...
            console.log(Object.keys(data.val()));
            // acces the user's data associated with their uid...
            database.ref('data').child(uid).on('value', function(obj){
                // test log the uid's data...
                console.log(obj.val());
                // place the uid's data in a variable...
                var user_obj = obj.val();
                // another test log of the uid's data...
                console.log(user_obj);
                // test log that we can retrieve the user's interests. Since it is an array, use .length to see if we can get how many interests there are...
                console.log(user_obj['interests'].length);
                // test log that we can retieve the user's zip...
                console.log(user_obj['zip']);
                // console.log('=======================');
                // set the user_key to the uid...
                user_key = uid;
                // loop through the database's array of interests and store them into a global variable...
                for (var i = 0; i < user_obj['interests'].length; i++) {
                    // push each interest retrieved from the database into user_interests variable...
                    user_interests.push(user_obj['interests'][i]);
                }
                // test log that data grab was successful...
                console.log(user_interests);
                // grab the database's stored zip and store it globally...
                user_zip = user_obj['zip'];
                // test log zip retrieval success...
                console.log(user_zip);

            });
            
            // call function to check the checkboxes the user is interested in
            checkInterest(user_interests);
            // call function to load the user's last zip input
            checkZip(user_zip);
        }
        } console.log('why doesn\'t this print?');
        
    } else {
        // test that it does not exist by logging it...
        console.log('local storage id does not exist');
        // store the new unique id provided by the database to local storage...
        localStorage.setItem('CE_app_unique_user_id', database.ref().child('data').push().key);
        // declare a global variable 'user_key' to be the same as the retrieved unique id retrieved from the database and stored to local storage...
        user_key = localStorage.getItem('CE_app_unique_user_id');
        // test that the ids are being stored correctly by logging both to the console...
        console.log('Had to create a new local storage id. It is: '+localStorage.getItem('CE_app_unique_user_id'));
        // ...
        console.log('new user key is: ' + user_key);
    }

    // tests to see if retrieving user data is successfully global...
    gatheredData(user_key, user_interests, user_zip);
    function gatheredData() {
        // wait for the data to be retrieved from database
        setTimeout(function() {
            console.log('===== GATHERED DATA =====');
            console.log(user_key);
            console.log(user_interests);
            console.log(user_zip);
        }, 5000 ); // waits 5 seconds before test logging
    }
    // ===========================================================

    // set a global variable that stores all 24 categories used in meetup's API...
    // var categories = ['Outdoors & Adventure', 'Tech', 'Family', 'Health & Wellness', 'Sports & Fitness', 'Learning', 'Photography', 'Food & Drink', 'Writing', 'Language & Culture', 'Music', 'Movements', 'LGBTQ', 'Film', 'Sci-Fi & Games', 'Beliefs', 'Arts', 'Book Clubs', 'Dance', 'Pets', 'Hobbies & Crafts', 'Fashion & Beauty', 'Social', 'Career & Business'];
    let categories = [
        "Outdoors",
        "Cooking",
        "Arts and Crafts",
        "Academic",
        "Sports",
        "Theater",
        "Engineering",
        "STEM",
        "Art design",
        "Child Care",
        "Computer",
        "Astronomy",
        "Geology",
        "Martial Arts",
        "Fishing",
        "Running"
      ];
    // test log the categories variable...
    console.log(categories);
    // use a for loop to dynamically generate check box input fields for each category...
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
    // dynamically check the check boxes from grabbed stored data of user_interests...
    function checkInterest(interested) {
        for (var i = 0; i < interested.length; i++) {
            // test log 
            console.log('User has '+interested.length+' interests.');
            var interest = interested[i];
            // for each interest, we want to target that interest's checkbox, and check it
            $(`input[value='${interest}']`).prop('checked', true);
        }
    }
    // dynamically fill in the zipcode from grabbed stored data of zip...
    function checkZip(zip) {
        $('#zip_code_input').val(zip);
    }
    // ===========================================================
    // obtain reference to checkboxes named 'interests[]'
    var interests = $('input[name="interests[]"]');
    // test 'interests' are being successfully retreived. Should print that it is an object (array)
    console.log('here are the interests: '+interests);
    // capture all inputs when #check_events_button is clicked. Use event delegation since the check_events_button will be checking for elements that exist dynamically...
    $(document).on('click', '#check_events_button', function(event) {
        event.preventDefault();
        triggerEvent();
    });
    // trigger click if 'Enter' is pressed
    $(document).keypress(function(e) {
        // e.preventDefault();
        // if the enter key is pressed
        if (e.which === 13) {
            // trigger #check_events_button click event 
            // $(document > '#check_events_button').click();
            console.log('Enter button was pressed!');
            triggerEvent();
        }
    });

    function triggerEvent() {
        // empty the array of interests to recapture the updated checkboxes...This will prevent from doubling the interests by adding do the array...
        user_interests = [];
        // test logs that the array has been emptied. Should print 0...
        console.log('Retrieved '+user_interests.length+' interests from user');
        // prevent button from self click...
        event.preventDefault();
        // capture each user checked interest
        for (var i = 0; i < interests.length; i++) {
            // test log that each interest is being looped through...
            console.log(interests[i].value);
            // if that interest is checked
            if (interests[i].checked) {
                // test log that it was checked...
                console.log(interests[i].value + ' was checked');
                // push the checked interest into the user_interests array...
                user_interests.push(interests[i].value);
            }
        }
        // test user_interests has updated from emptied array to containing values...
        console.log('User interests has updated to '+user_interests.length+' interests...');

        // get user's zip code input...
        let user_zip = $('#zip_code_input').val().trim();
        // test log captured zip input...
        console.log(user_zip, user_interests);
        // call a declared function that will store captured input into the database, passing in the user's input...
        storeUserData(user_zip, user_interests);

        // declare a function that will add the user's input to the database under their unique id/user_key...
        function storeUserData(zip, interests) {
            // store the passed data into an object for that will be stored under the user's uid in the database...
            let user_data = {
                // set a key relative to the data...
                zip: zip,
                interests: interests
            };
            // test log that user_data was successfully generated...
            console.log(user_data);
            
            // declare an empty object variable that will be used as a cargo to pass in updated data to the database...
            var updates = {};
            // create a database key/url pathway that will hold the users stored data...
            updates['/data/' + user_key] = user_data;
            // test log the cargo-object and it's content...
            console.log(updates);
            // inform user that their info will do stored. Could ask permission to store their info onto database by swapping the alert() function to a confirm() function...
            alert('We\'ll keep your interests in mind :)');
            // uses firebases's update() function to update the unique database pathway with user_data...
            return database.ref().update(updates);
        }
        //---------------------
        // declare an empty array that will hold all of our response data...
        var results = [];

        // // make an ajax call for each interest
        for (let i = 0; i < user_interests.length; i++) {
            
            $.ajax({
                url:
                  `https://cors-anywhere.herokuapp.com/http://api.amp.active.com/v2/search/?radius=50&zip=${user_zip}&current_page=1&per_page=12&sort=date_asc&topic=${user_interests[i]}&start_date=2019-04-06..&api_key=x428fd5p5e9xmjfqwngw9fag`,
                method: "GET"
              }).then(function(data) {
                console.log(data);
                console.log(data.results[i].assetName);
                // create a variable to store all of the response's data
                var events = data.results; // will return 12 objs
                // test log events...
                console.log(events.length); // success!!
                // test log the events obj containing 12 sub-objs
                console.log(events);
                // create a for loop that will loop through the events and construct simpler objs
                for (let j = 0; j < events.length; j++) {
                    let tmpObj = {
                        name: events[j].assetName,
                        date: events[j].activityStartDate,
                        org: events[j].organization.organizationName,
                        phone: events[j].componentInUrlAdr.contactPhone,
                        stAddr: events[j].place.addressLine1Txt,
                        city: events[j].place.cityName,
                        state: events[j].place.stateProvinceCode,
                        descr: events[j].assetDescriptions[0].description,
                        lat: events[j].place.latitude,
                        lon: events[j].place.latitude
                    };
                    // push each temporary obj into the global variable
                    results.push(tmpObj);
                }

              }).then(function(){
                console.log('AJAX call #'+i+' complete. Data was stored...');
              }).then();
        } 

        // declare a function that will sort the results[] by date...
        function sortByClosestDate(arr, prop) {
            return arr.sort(function (a, b) {
                let x = a[prop],
                    y = b[prop];
                return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            });
        }
        // call that function and store the sorted arr in a new variable...
        sortByClosestDate(results);
        console.log('The results are: '+ results);
      
        // load event options dynamically...
        var event_options = $('#event_options');
        //======================================
        // needs to load after 7 milli-seconds...until more research is done for async/await, this is a solution...
        setTimeout(function(){
            if (results.length === 0) {
                alert('Sorry, there isn\'t anything happening in your area at the moment :(');
            }
            for (let i = 0; i < 12; i++) {
                let name = results[i].name,
                    date = results[i].date,
                    descr = results[i].descr,
                    city = results[i].city,
                    state = results[i].state,
                    addr = results[i].stAddr,
                    phone = results[i].phone,
                    org = results[i].org;
                    // descr = descr.substr(0, descr.length-4);
                    date = date.substr(0, date.length-9);
                    lon = results[i].lon;
                    lat = results[i].lat;

                    // fix undefined data...
                    if (name === undefined) {
                        name = 'N/A';
                    } else if (date === undefined) {
                        date = 'N/A';
                    } else if (descr === undefined) {
                        descr = 'N/A';
                    } else if (city === undefined) {
                        city = 'N/A';
                    } else if (state === undefined) {
                        state = 'N/A';
                    } else if (addr === undefined) {
                        addr = 'N/A';
                    } else if (phone === undefined) {
                        phone = 'N/A';
                    } else if (org === undefined) {
                        org = 'N/A';
                    } else return;

                    var map = $(`
                    <iframe src="" frameborder="0">${renderMap}</iframe>
                    `);
    
                event_options.append(`
                <div class="col-md-5 p-3 border m-2">
                    <div class="row text-center text-light">
                        <div class="col-md-12">
                            <h3>Name: ${name}</h3>
                        </div>
                        <div class="col-md-3"></div>
                        <div class="col-md-12">
                            <p>Date: ${date}</p>
                        </div>
                    </div>
                    <hr class="bg-light">
                    <div class="row text-light">
                        <div class="col-md-12">
                            <p>Orginization: ${org}</p>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6 text-light">
                            <p>Name: ${name}</p>
                            <p>Address: ${addr}, ${city}, ${state}</p>
                        </div>
                        <div class="col-md-2"></div>
                        <div class="col-md-3">
                            <button type="button" class="btn btn-light rounded-0" id="more_button" data-toggle="modal" data-target="#exampleModal">More</button>
    
                            <div class="modal fade text-body rounded-0 text-center" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div class="modal-dialog" role="document">
                            <div class="modal-content rounded-0">      
                            <div class="modal-body rounded-0 bg-light">
                            <div class="container">
                                <div class="row">
                                    <div class="col-md-5 m-auto">
                                        <div class="box"></div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-12">
                                        <h3>Name: ${name}</h3>
                                    </div>
                                    <div class="col-md-12" id="modal_descr">
                                        <p> Description: ${descr}</p>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-6">
                                        <p>Name: ${name}</p>
                                        <p>Phone Number: ${phone}</p>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="box"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
            </div>
            </div>
            </div>
            </div>
            </div>
                `);
            }
        }, 700);
    }
});