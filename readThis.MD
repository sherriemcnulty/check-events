//============== TESTS ======================
        // This function serves as a text logger for our results array. I make it wait 10 seconds before console logging so that it has ample time to collect the data after all of the ajax calls...
        setTimeout(function(){
            console.log('=== Array of Objects ===');
            console.log(results);
            console.log('========================');
        }, 5000);
        // tests logs that we can grab each date...
        setTimeout(function(){
            console.log('======RESULT DATES=====');
            for (let i = 0; i < results.length; i++) {
                console.log(results[i].date);
            }
            console.log('========================');
        }, 5000);
        // tests logs that we can sort the objects by date...
        setTimeout(function(){
            console.log('======SORTED BY DATES=====');
            console.log(sortByClosestDate(results, 'date'));
            console.log('========================');
        }, 5000);
        // tests logs that we can sort options for user...
        setTimeout(function(){
            console.log('====== OPTIONS =====');
            console.log(sortByClosestDate(results, 'date'));
            console.log('========================');
        }, 5000);

        let options = [];
        setTimeout(function(){
            
            function arrCheck(arr, val) {
                return arr.some(function(arrVal) {
                    return val === arrVal;
                }); 
            }
            for (let i = 0; i < 12; i++) {
                let refObj = results[i].name;
                if (arrCheck(options, refObj)) {
                    console.log('already in arr');
                    return
                } else {
                    console.log(refObj + 'wasn\'t in array!');
                    options.push(results[i]);
                }
            }
            console.log('====== OPTIONS ARR =====');
            console.log(options);
            console.log('========================');
        }, 6000);
        //================ END TESTS ==============