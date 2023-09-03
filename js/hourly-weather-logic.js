(function($, document, window){
	
	$(document).ready(function(){
        $("#hourly-form-submit").click(function (event) {
            event.preventDefault(); // Prevent the default form submission
            // Get the location value from the input field
            var locationValue = $("#hourly-form-location").val();
            if (locationValue != null && locationValue != "") {
                var settings = fetchRequestSettings(locationValue, "hourly-forecast")
              
                $.ajax(settings).done(function (response) {
                    updateDetails(response);
                });
            }
        });
	});

    function updateDetails(response) { 
        let data = response["data"];
        let updatedHtml = ""
        let hoursAfterUTC = (parseFloat(response["timezone"])/3600).toFixed(1)
        for (let i=0; i<Math.min(data.length, 6); i++) {
            let weatherJson = {
                currTemperature: toCelsius(data[i]["currTemperature"]).toFixed(1),
                maxTemperature: toCelsius(data[i]["maxTemperature"]).toFixed(1),
                minTemperature: toCelsius(data[i]["minTemperature"]).toFixed(1),
                day: toDay(data[i]["time"] *1000, hoursAfterUTC),
                time: toTime(data[i]["time"]*1000, hoursAfterUTC),
                weatherIcon: weatherIconsMap[data[i]["weatherIcon"]],
                windSpeed: data[i]["windSpeed"],
                dateMonth: toDateMonth(data[i]["time"]*1000, hoursAfterUTC),
                location: response["location"],
                humidity: parseInt(data[i]["humidity"])
            }

            if (i == 0) {
                updatedHtml += firstContainer(weatherJson)
            } else {
                updatedHtml += commonContainers(weatherJson)
            }
        }

        $(".forecast-container").html(updatedHtml);
    }

    function firstContainer(weather) {
        let template = 
        `<div class="today forecast">
            <div class="forecast-header">
                <div class="day">` + weather["day"] + `</div>
                <div class="date">` + weather["dateMonth"] + " " + weather["time"] + `</div>
            </div> <!-- .forecast-header -->
            <div class="forecast-content">
                <div class="location">` + weather["location"] + `</div>
                <div class="degree">
                    <div class="num">` + weather["currTemperature"] + `<sup>o</sup>C</div>
                    <div class="forecast-icon">
                        <img src="`+ weather["weatherIcon"] + `" alt="" width=90>
                    </div>	
                </div>
                <span><img src="images/icon-compass.png" alt="">` + weather["humidity"] + `%</span>
                <span><img src="images/icon-wind.png" alt="">` + weather["windSpeed"] + `m/s</span>
            </div>
        </div>`
        return template;
    }

    function commonContainers(weather) {
        let template = 
        `<div class="forecast">
            <div class="forecast-header">
                <div class="day">` + weather["day"] + ": " +  weather["dateMonth"] + " " + weather["time"] + `</div>
            </div> <!-- .forecast-header -->
            <div class="forecast-content">
                <div class="forecast-icon">
                    <img src="` + weather["weatherIcon"] + `" alt="" width=48>
                </div>
                <div class="degree">` + weather["currTemperature"] + `<sup>o</sup>C</div>
                Max - <small>` + weather["maxTemperature"] + `<sup>o</sup></small> <br>
                Min - <small>` + weather["minTemperature"] + `<sup>o</sup></small>
            </div>
        </div>`

        return template
    }

    function fetchRequestSettings(locationName) {
        let clientId = localStorage.getItem("clientId")
        let clientSecret = localStorage.getItem("clientSecret")
        return {
            "url": backendURL+"/hourly-forecast?city="+locationName,
            "method": "GET",
            "timeout": 0,
            "headers": {
              "Accept": "*/*",
              "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8",
              "Content-Type": "application/json",
              "clientId": clientId,
              "clientSecret": clientSecret
            }
          };
    }

    function initializeWeatherStats(locationName) {
        var settings = fetchRequestSettings(locationName)
            
        $.ajax(settings).done(function (response) {
            updateDetails(response)
        });
    }

    initializeWeatherStats("Pune")

	$(window).load(function(){});

})(jQuery, document, window);