var airTemp, waterTemp, windSpeed, weather, weatherIconImg, precipInches, latLon, swellFeet, rating = 0;
	
$(document).ready(function() {
	$('#submit').click(getWeather);
});

function getWeather() {
	  $.ajax({
		  url : "https://api.wunderground.com/api/1dc311f1b2c9f126/geolookup/conditions/q/" + $('#state').val() + "/" + $('#city').val() + ".json",
		  dataType : "jsonp",
		  success : function(parsed_json) {
			  airTemp = parsed_json['current_observation']['temp_f'];
			  windSpeed = parsed_json['current_observation']['wind_mph'];
			  weather = parsed_json['current_observation']['weather'];
			  weatherIconImg = parsed_json['current_observation']['icon_url'];
			  precipInches = parsed_json['current_observation']['precip_today_metric'] * .03937;
			  latLon = parsed_json['location']['lat'] + "," + parsed_json['location']['lon'];
			  getWater();
		  }
	  });
}

function getWater() {
  $.ajax({
	  url : "https://api.worldweatheronline.com/free/v2/marine.ashx?format=json&tp=12&key=d6b5a813e6857feb7ffcd4d433c6a&q=" + latLon,
	  dataType : "jsonp",
	  success : function(parsed_json) {
		  waterTemp = parsed_json['data']['weather'][0]['hourly'][0]['waterTemp_F'];
		  swellFeet = parsed_json['data']['weather'][0]['hourly'][0]['swellHeight_m'] * 3.2808;
		  
		 
		  fishingGrader();
	  }
  });
	
}

function fishingGrader() {

	rating = 0;
	$('#results').empty();
	$('#airTemp').empty();
	$('#wind').empty();
	$('#weather').empty();
	$('#goodFairBad').empty();
	$('#waterTemp').empty();
	$('#precip').empty();
	$('#swell').empty();

	// Wind Speed
	if ( windSpeed <= 10 ) {
		rating = rating + 3
	} else if ( windSpeed > 10 && windSpeed < 20 ) {
		rating = rating + 2
	} else (
		rating = rating + 1
	)
	
	// Water Temperature
	if ( waterTemp > 60 ) {
		rating = rating + 3
	} else {
		rating = rating + 1
	}
	
	// Precipitation
	if ( precipInches < .5 ) {
		rating = rating + 3
	} else if ( precipInches >= .5 && precipInches < 1.5 ) {
		rating = rating + 2
	} else {
		rating = rating + 1
	}
	
	// Swell Height 
	if ( swellFeet < 2 ) {
		rating = rating + 3 
	} else if ( swellFeet >= 2 && swellFeet < 3 ) {
		rating = rating + 2
	} else {
		rating = rating + 1
	}
	
	// Final Calc
	rating = rating / 4
	
	if ( rating >= 3 ) {
		$('#results').html("Today is a Good day to go fishing");
	} else if ( rating < 3 && rating >= 2 ) {
		$('#output').append("<h1 id='results'>Today is a Fair day to go fishing</h1>");
	} else {
		$('#output').append("<h1 id='results'>Today is a Bad day to go fishing</h1>");
	}

	console.log(rating);

	$('#airTemp').append('<div class="outputData">' + airTemp + '</div>');
	$('#wind').append('<div class="outputData">' + windSpeed + '</div>');
	$('#weather').append('<div class="outputData">' + weather + '</div>');
	$('#waterTemp').append('<div class="outputData">' + waterTemp + '</div>');
	$('#precip').append('<div class="outputData">' + precipInches + '</div>');
	$('#swell').append('<div class="outputData">' + swellFeet.toFixed(2) + '</div>');


	//$('#output').append('<br><br>Here is everything you want to know:<br>Air Temp: ' + airTemp + '<br>Water Temp: ' + waterTemp + '<br>Wind Speed (mph): ' + windSpeed + '<br>Weather Summary: ' + weather + '<br>Precip (inches): ' + precipInches + '<br>Swell (ft): ' + swellFeet);
		  
	//$('#output').append('<br><img src="' + weatherIconImg +'"><br>');

}