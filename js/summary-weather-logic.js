(function($, document, window){
	
	$(document).ready(function() {
        let settingsOriginal;
        // Added a submit event handler to the form
        $("#summary-form-submit").click(function (event) {
            event.preventDefault(); // Prevent the default form submission
            // Get the location value from the input field
            var locationValue = $("#summary-form-location").val();
            if (locationValue != null || locationValue != "") {
                var settings = fetchRequestSettings(locationValue)
                
                $.ajax(settings).done(function (response) {
                    updateDetails(response)
                });
            }
        });
	});

    function updateDetails(response) {
        let updatedHtml = ""
        let hoursAfterUTC = (parseFloat(response["timezone"])/3600).toFixed(1);
        let sunrise = response["sunrise"];
        let sunset = response["sunset"];
        let weatherJson = {
            currTemperature: toCelsius(response["currTemperature"]).toFixed(1),
            maxTemperature: toCelsius(response["maxTemperature"]).toFixed(1),
            minTemperature: toCelsius(response["minTemperature"]).toFixed(1),
            feelsLike: toCelsius(response["feelsLikeTemperature"]).toFixed(1),
            day: toDay(Date.now(), hoursAfterUTC),
            time: toTime(Date.now(), hoursAfterUTC),
            weatherIcon: weatherIconsMap[response["weatherIcon"]],
            windSpeed: response["windSpeed"],
            dateMonth: toDateMonth(Date.now(), hoursAfterUTC),
            location: response["location"],
            humidity: parseInt(response["humidity"]),
            sunrise: (sunrise == undefined || sunrise == null)? "5:30 Am" : toTime(response["sunrise"]*1000, hoursAfterUTC),
            sunset: (sunset == undefined || sunset == null)? "6:45 Pm" : toTime(response["sunset"]*1000, hoursAfterUTC)
        }
        updatedHtml += firstContainer(weatherJson)
        updatedHtml += maxMinFeelsLikeTemplate(weatherJson)
        updatedHtml += sunTemplate(weatherJson)

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

    function maxMinFeelsLikeTemplate(weather) {
        let template = 
        `<div class="forecast">
            <div class="forecast-header">
                <div class="day"> Temperature Stats </div>
            </div> <!-- .forecast-header -->
            <div class="forecast-content">
                <div class="forecast-icon">
                    <img src="` + weather["weatherIcon"] + `" alt="" width=48>
                </div>
                Max - <small>` + weather["maxTemperature"] + `<sup>o</sup></small> <br>
                Min - <small>` + weather["minTemperature"] + `<sup>o</sup></small> <br>
                Feels Like - <small>` + weather["feelsLike"] + `<sup>o</sup></small>
            </div>
        </div>`

        return template
    } 

    function sunTemplate(weather) {
        let template = 
        `<div class="forecast">
            <div class="forecast-header">
                <div class="day"> Sun Stats </div>
            </div> <!-- .forecast-header -->
            <div class="forecast-content">
                <div class="forecast-icon">
                    <img src="images/icons/icon-17.png" alt="" width=48>
                </div>
                Sunrise - <small>` + weather["sunrise"] + ` <br>
                Sunset - <small>` + weather["sunset"] + ` <br>
            </div>
        </div>`

        return template
    } 

    function fetchRequestSettings(locationName) {
        let jwtToken = localStorage.getItem("jwtToken")
        return {
            "url": backendURL+"/forecast-summary?city="+locationName,
            "method": "GET",
            "timeout": 0,
            "headers": {
              "Accept": "*/*",
              "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8",
              "Content-Type": "application/json",
              "Authorization": "Bearer " + jwtToken
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