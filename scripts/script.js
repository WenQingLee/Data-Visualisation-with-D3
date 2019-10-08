// axios.get("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + pos.lat + "," + pos.lng + "&key=AIzaSyDoEv5jmhi5Iw1bPJTBGAEAWUsS-BQnBro")
//             .then(function(response) {
//                 let result = response.data.results[0].formatted_address;
//                 $("#search-location").val(result);
//             });


function showData() {
//     var data = {
//         resource_id: '2e60a190-211b-4564-b722-24d92778b886', // the resource id
//         limit: 5, // get 5 results
//         q: 'jones' // query for 'jones'
//     };
//     $.ajax({
//         url: 'https://data.gov.sg/api/action/datastore_search',
//         data: data,
//         dataType: 'jsonp',
//         success: function(data) {
//             alert('Total results found: ' + data.result.total)
//         }
//     });
    
    
    // axios.get("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + pos.lat + "," + pos.lng + "&key=AIzaSyDoEv5jmhi5Iw1bPJTBGAEAWUsS-BQnBro")
    //         .then(function(response) {
    //             let result = response.data.results[0].formatted_address;
    //             $("#search-location").val(result);
    //         });
    

    axios.get("https://api.data.gov.sg/v1/transport/carpark-availability")
            .then(function(response) {
                let result = response
                console.log(response)
                alert("This works!")
            });

};



$("#show-data").on("click", function() {

    // alert("This works!")
    showData()

});
