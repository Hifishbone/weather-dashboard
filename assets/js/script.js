var appid = "8d3d1341f499932b5f056cb82ae71b1f";
var searchHistory = []; // [citys]

function loadFromHistory() {
    var temp = JSON.parse(localStorage.getItem('search-history'));
    if (temp) {
        searchHistory = temp;
    }
}

function saveToHistory(city) {
    var i = searchHistory.indexOf(city);
    if (i !== -1) {
        searchHistory.splice(i, 1);
    }
    searchHistory.unshift(city);
    localStorage.setItem('search-history', JSON.stringify(searchHistory));
    updateSearchHistoryView();
}


function updateSearchHistoryView() {
    // <button type="button" class="btn btn-secondary my-2 w-100">Search</button>
    $('#history-buttons').html("");
    for (let i = 0; i < searchHistory.length; i++) {
        var city = searchHistory[i];
        $('#history-buttons').append(`<button type="button" class="btn btn-secondary text-capitalize my-2 w-100" id="history-btn-${i}">${city}</button>`);
        $("#history-btn-" + i).click(function () {
            getWeatherData($(this).text());
        });
    }
}


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
    }).catch(function (error) {
        alert("Unable to connect to openweathermap");
    });
};

var getWeatherDataByLatLon = function (lat, lon, city) {
    var apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${appid}`;

    // make a request to the url
    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                updateInfoView(data, city);
                saveToHistory(city);
            });
        } else {
            alert("Error: " + response.statusText);
        }
    })
        .catch(function (error) {
            alert("Unable to connect to openweathermap");
        });
};

function updateInfoView(data, city) {
    updateCurDayView(data["current"], city);
    update5DayView(data["daily"]);
}


function updateCurDayView(data, city) {
    console.log(data);
    var curDay = moment().format('l');
    $('#city-date').text(city + ' (' + curDay + ')');
    var iconUrl = `http://openweathermap.org/img/wn/${data["weather"][0]["icon"]}.png`;
    $("#weather-icon").attr("src", iconUrl).attr("alt", data["weather"][0]["description"]);

    $('#cur-temp').text(data["temp"] + "\u2109");
    $('#cur-wind').text(data["wind_speed"] + "MPH");
    $('#cur-humidity').text(data["humidity"] + "%");
    var uvi = data["uvi"];
    $('#cur-uv').text(uvi);
    if (uvi < 3) {
        $('#cur-uv').attr("style", "background-color:rgb(76,147,41)");
    } else if (uvi < 6) {
        $('#cur-uv').attr("style", "background-color:rgb(244,229,76)");
    } else if (uvi < 8) {
        $('#cur-uv').attr("style", "background-color:rgb(230,100,42)");
    } else if (uvi < 11) {
        $('#cur-uv').attr("style", "background-color:rgb(198,42,34)");
    } else {
        $('#cur-uv').attr("style", "background-color:rgb(102,74,193)");
    }
}


function update5DayView(data) {
    $("#five-days").html("");
    for (let i = 1; i < data.length && i < 6; i++) {
        var day = data[i];
        var iconUrl = `http://openweathermap.org/img/wn/${day["weather"][0]["icon"]}.png`;
        var card =
            `<div class="col"><div class="card h-100 w-100">
        <div class="card-body five-day-card">
            <h5 class="card-title">${moment().add(i, 'days').format('l')}</h5>
            <img class="" src="${iconUrl}" alt="${day["weather"][0]["description"]}">
            <div class="my-2"><span>Temp: </span><span>${day["temp"]["eve"]}\u2109</span></div>
            <div class="my-2"><span>Wind: </span><span>${day["wind_speed"]} MPH</span></div>
            <div class="my-2"><span>Humidity: </span><span>${day["humidity"]} %</span></div>
            <div>
        </div>
        </div></div>`
        $("#five-days").append(card);
    }
}


$("#city-form").submit(function (event) {
    event.preventDefault();
    var city = $("#city-name").val();
    if (city) {
        getWeatherData(city);
    }
    this.reset();
});


// initial loading
loadFromHistory();
if (searchHistory.length == 0) {
    getWeatherData("Toronto");
}
else {
    getWeatherData(searchHistory[0]);
}


