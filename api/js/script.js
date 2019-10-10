
$("#show-weather-data").on("click", function() {

    showWeatherData()

});


function showWeatherData() {

    axios.get("https://api.data.gov.sg/v1/environment/air-temperature")
        .then(function(response) {
            // let result = response.data.metadata
            console.log(response)

            let stations = response.data.metadata.stations
            let readings = response.data.items[0].readings

            console.log(readings)
            console.log(stations)
            
            // Initialising the new data array
            let newDataArray = []
            
            for (var i = 0; i < stations.length; i++) {
                
                 let num = i + 1;

            $("#display-weather-results").append("<tr><td>" + num + "</td>" + "<td>" + stations[i].name + "</td>" + "<td>" + readings[i].value + "</td></tr>");
                
                
                $("#weather-chart").append("Station Name: " + stations[i].name + "Temperature: " + readings[i].value +"<br />")
                
                // Creating an object to add into the new data array
                let addData = {
                    "name": stations[i].name,
                    "value": readings[i].value,
                };
                
                console.log(addData)
                
                // Pushing the onjects into the array
                newDataArray.push(addData);
                // newDataArray = newDataArray.push({"name": stations[i].name, "value": readings[i].value})
                // newDataArray = newDataArray.push(readings[i].value)
                // console.log("This is the new array: ")
                // console.log(newDataArray)
            }
            
            console.log("This is the new array: ")
            console.log(newDataArray)

            // D3 chart plotting
            var ndx = crossfilter(newDataArray);
            var name_dim = ndx.dimension(dc.pluck('name'));
            var temperature_dim = name_dim.group().reduceSum(dc.pluck('value'))
            
            // Bar Chart
            dc.barChart('#weather-chart')
                .width(1500)
                .height(500)
                .margins({ top: 10, right: 50, bottom: 30, left: 50 })
                .dimension(name_dim)
                .group(temperature_dim)
                .transitionDuration(500)
                .x(d3.scale.ordinal())
                .xUnits(dc.units.ordinal)
                .xAxisLabel("Station Name")
                .yAxisLabel("Temperature")
                .yAxis().ticks(4);
                
                // Pie Chart
            dc.pieChart('#weather-pie-chart')
                .height(600)
                .radius(600)
                .transitionDuration(1500)
                .dimension(name_dim)
                .group(temperature_dim);

            dc.renderAll();


        });

};
