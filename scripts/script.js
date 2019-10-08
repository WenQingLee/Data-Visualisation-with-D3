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
            let testName =
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
            
            let newDataArray = []
            
            for (var i = 0; i < stations.length; i++) {
                $("#weather-chart").append("Station Name: " + stations[i].name + "Temperature: " + readings[i].value)
                
                let addData = {
                    "name": stations[i].name,
                    "value": readings[i].value,
                };
                
                console.log(addData)
                
                newDataArray.push(addData);
                // newDataArray = newDataArray.push({"name": stations[i].name, "value": readings[i].value})
                // newDataArray = newDataArray.push(readings[i].value)
                // console.log("This is the new array: ")
                // console.log(newDataArray)
            }
            alert("Weather works!")
            
            console.log("This is the new array: ")
            console.log(newDataArray)

            // D3 chart plotting
            var ndx = crossfilter(newDataArray);
            var name_dim = ndx.dimension(dc.pluck('name'));
            var temperature_dim = name_dim.group().reduceSum(dc.pluck('value'))

            dc.barChart('#weather-chart')
                .width(300)
                .height(150)
                .margins({ top: 10, right: 50, bottom: 30, left: 50 })
                .dimension(name_dim)
                .group(temperature_dim)
                .transitionDuration(500)
                .x(d3.scale.ordinal())
                .xUnits(dc.units.ordinal)
                .xAxisLabel("Person")
                .yAxis().ticks(4);

            dc.renderAll();


        });

};
