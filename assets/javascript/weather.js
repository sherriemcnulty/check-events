"use strict";

function kelvinToFarenheit(K) {

   var F = parseInt((K - 273.15) * 1.8) + 32;
   return (F);
}

function weather(lon, lat) {

   var baseURL = "http://api.openweathermap.org/data/2.5/";
   var criteria = `find?lat=${lat}&lon=${lon}&cnt=1`;
   var apiKey = '&appid=7dd80956166c4357b5ea44219fa85c6c';
   var queryURL = baseURL + criteria + apiKey;
   $.ajax({
      url: queryURL,
      method: 'GET'
   }).then(function (response) {

      var weather = response.list[0];
      var city = weather.name;
      var description = weather.weather[0].description;
      var temp = kelvinToFarenheit(weather.main.temp);
      var tempMax = kelvinToFarenheit(weather.main.temp_max);
      var tempMin = kelvinToFarenheit(weather.main.temp_min);

      alert(
         `City = ${city}\nDescription: ${description}\nCurrent Temperature: ${temp}\nMaximum Temperature:
      ${tempMax}\nMinimum Temperature: ${tempMin}`
      );
   });
}