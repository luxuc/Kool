function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getWeatherInfo);
        console.log('success');
    } else {
        oP.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function getWeatherInfo(position) {
    var key = 'e1de7aab588a5e9836e5fe62aaf3da7b';
    var forecastURL = "http://api.openweathermap.org/data/2.5/forecast/daily?lat=" + position.coords.latitude + "&lon=" + position.coords.longitude + "&cnt=10&mode=json&APPID=" + key;
    var currentURL = "http://api.openweathermap.org/data/2.5/weather?lat=" + position.coords.latitude + "&lon=" + position.coords.longitude + "&APPID="+ key;
    var uvIndexURL = "http://api.owm.io/air/1.0/uvi/current?lat=" + position.coords.latitude + "&lon=" + position.coords.longitude + "&appid=" + key;
    //get current wather info
    $.ajax({
        type: "GET",
        url: currentURL,
        dataType: "json",
        success:function(responseData, status) {
            //$("#url").html(currentURL);
            //store ifo about city and country
            var cityInfo = responseData.name +", " + responseData.sys.country;
            $("#City").html(cityInfo);
            
            //get current temperature, weather condition and icon
            var temp = Math.round(responseData.main.temp-273.15)
            var wrappedTemp = "<p>" + Math.round(responseData.main.temp-273.15)
            + "\u00b0C<img class='ui tiny right floated image' src='img/icons/" + responseData.weather[0].icon + ".png' /></p>";
            

            //calculate feels like temperature
            var feelTemp = 0;
            var windSpeed = responseData.wind.speed * 3.6;
            var WindSpeedVariable = Math.pow(windSpeed, 0.16);
            var humidity = responseData.main.humidity;
            if (temp > 15) {
                feelTemp = temp - (100-humidity)/5;
            } else {
                feelTemp = Math.round(13.12 + temp * 0.6215 - 11.37 * WindSpeedVariable + 0.3965 * WindSpeedVariable);
            }
            
            //get weather description
            var situation = responseData.weather;
            var weath = "";
            $.each(situation, function(key,val) {
            weath += "<small class='sub header' style='font-size:40px;'>" + val.description + ", feels like " + feelTemp +"\u00b0C</small>";
            });
            var weatherInfo = wrappedTemp + weath;
            $("#Major").html(weatherInfo);
            
            /*
            //store today's max and min temp
            var minTemp = Math.round(responseData.main.temp_min - 273.15);
            var maxTemp = Math.round(responseData.main.temp_max - 273.15);
            var d = new Date();
            var dayNum = d.getDay();
            var myday = getDayName(dayNum);
            $("#min_max").html("<li class='list-group-item'>" + myday + " TODAY <span class='temp-info'>"
            + minTemp + "|" + maxTemp + "</span></li>");
            
            //store sunrise and sunset time
            var sunsetTime = responseData.sys.sunset;
            var sunriseTime = responseData.sys.sunrise;
            $("#sun_time").html("Sunrise at " + convertTimestamp(sunriseTime)
            + " <span class='glyphicon glyphicon-time'></span> Sunset at " + convertTimestamp(sunsetTime));
            */
        }
    });
    /*
    //get 5 forecast info
    $.ajax({
        type: "GET",
        url: forecastURL,
        dataType: "json",
        success:function(responseData,status) {
            var d = new Date();
            var dayNum = d.getDay() + 1;
            var forecastInfo = "";
            var dataCluster= responseData.list;
            $.each(dataCluster, function(key, val) {
                var currentDay = getDayName(dayNum);
                forecastInfo += "<li class='list-group-item'>" + currentDay + ": " +val.weather[0].main
                + "<img class='be-center' src='http://openweathermap.org/img/w/" + val.weather[0].icon
                + ".png' />" + "<span class='temp-info'>" + Math.round(val.temp.min - 273.15)
                + "|" + Math.round(val.temp.max - 273.15) + "</span></li>";
                dayNum++;
        });
        $("#forecast").html(forecastInfo);
      }
    });
    */

}
        
function displayTime() {
  var d = new Date();
  var year = d.getFullYear();
  var month = d.getMonth();
  var date = d.getDate();
  var hours = ("0" + d.getHours()).slice(-2);
  var minutes = ("0" + d.getMinutes()).slice(-2);
  $("#time").html("Weather info get at "+ year+ "." + (month+1) + "." + date + " " + hours + ":" + minutes);
}

function convertTimestamp(timestamp) {
    var d = new Date(timestamp * 1000),	// Convert the passed timestamp to milliseconds
		yyyy = d.getFullYear(),
		mm = ('0' + (d.getMonth() + 1)).slice(-2),	// Months are zero based. Add leading 0.
		dd = ('0' + d.getDate()).slice(-2),			// Add leading 0.
		hh = d.getHours(),
		h = hh,
		min = ('0' + d.getMinutes()).slice(-2),		// Add leading 0.
		ampm = 'AM',
		time;

	if (hh > 12) {
		h = hh - 12;
		ampm = 'PM';
	} else if (hh === 12) {
		h = 12;
		ampm = 'PM';
	} else if (hh == 0) {
		h = 12;
	}
	// ie: 2013-02-18, 8:35 AM
	time = yyyy + '-' + mm + '-' + dd + ', ' + h + ':' + min + ' ' + ampm;

	return time;
}
        
$(function(){
    var oP = document.getElementById("weather");
    displayTime();
    getLocation();
});