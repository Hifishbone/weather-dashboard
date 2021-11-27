var appid = "8d3d1341f499932b5f056cb82ae71b1f";
var getWeatherData = function (city) {
    // format the openweathermap api url
    var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${appid}`;

    // make a request to the url
    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                getWeatherDataByLatLon(data["coord"]["lat"], data["coord"]["lon"], city);
            });
        } else {
            alert("Error: " + response.statusText);
        }
    })
        .catch(function (error) {
            alert("Unable to connect to openweathermap");
        });
};

var getWeatherDataByLatLon = function (lat, lon, city) {
     var apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${appid}`;

     // make a request to the url
     fetch(apiUrl).then(function (response) {
         if (response.ok) {
             response.json().then(function (data) {
                 updateInfo(data, city);
             });
         } else {
             alert("Error: " + response.statusText);
         }
     })
         .catch(function (error) {
             alert("Unable to connect to openweathermap");
         });
 };

 function updateInfo(data, city) {
     updateCurDay(data["current"], city);
 }


function updateCurDay(data, city) {
    var curDay = moment().format('l');
    $('#city-date').text(city + ' (' + curDay + ')');
    var iconUrl = `http://openweathermap.org/img/wn/${data["weather"][0]["icon"]}.png`;
    $("#weather-icon").attr("src",iconUrl).attr("alt", data["weather"][0]["description"]);

    $('#cur-temp').text(data["temp"] + "\u2109");
    $('#cur-wind').text(data["wind_speed"] + "MPH");
    $('#cur-humidity').text(data["humidity"] + "%");
    var uvi = data["uvi"];
    $('#cur-uv').text(uvi);
    if (uvi < 3) {
        $('#cur-uv').attr("style", "background-color:rgb(76,147,41)");
    } else if (uvi < 6){
        $('#cur-uv').attr("style", "background-color:rgb(244,229,76)");
    } else if (uvi < 8){
        $('#cur-uv').attr("style", "background-color:rgb(230,100,42)");
    } else if (uvi < 11){
        $('#cur-uv').attr("style", "background-color:rgb(198,42,34)");
    } else {
        $('#cur-uv').attr("style", "background-color:rgb(102,74,193)");
    }
}



$("#city-form").submit(function (event) {
    event.preventDefault();
    var city = $("#city-name").val();
    if (city) {
        getWeatherData(city);
    }
});
