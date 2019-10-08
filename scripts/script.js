// axios.get("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + pos.lat + "," + pos.lng + "&key=AIzaSyDoEv5jmhi5Iw1bPJTBGAEAWUsS-BQnBro")
//             .then(function(response) {
//                 let result = response.data.results[0].formatted_address;
//                 $("#search-location").val(result);
//             });


$("#show-carpark-data").on("click", function() {

    // alert("This works!")
    showCarparkData()

});



$("#show-weather-data").on("click", function() {

    // alert("Weather works!")
    showWeatherData()

});




function showCarparkData() {
    

    axios.get("https://api.data.gov.sg/v1/transport/carpark-availability")
            .then(function(response) {
                let result = response
                console.log(result)
                let testName=
                alert("Car works!")
            });

};


function showWeatherData() {
    

    axios.get("https://api.data.gov.sg/v1/environment/air-temperature")
            .then(function(response) {
                // let result = response.data.metadata
                console.log(response)
                
                let stations = response.data.metadata.stations
                let readings = response.data.items[0].readings
                
                console.log(readings)
                console.log(stations)
                for (var i=0; i<stations.length; i++){
                    $("#weather-chart").append("Station Name: " +  stations[i].name + "Temperature: " + readings[i].value)
                }
                alert("Weather works!")
            });

};

