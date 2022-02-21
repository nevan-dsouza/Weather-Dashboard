// variable declarations
let apiKey = "f5291cd751c27605768ee83f7f0b94af";
let historyButtonClasses = "btn btn-secondary border text-left text-light px-3 py-2";
let dataCityAttr = "data-cityName";

// load search history list from local storage
let cityHistory = JSON.parse(localStorage.getItem("city_history"));
if (!cityHistory) {
    cityHistory = [];
}

// function rendors the history list
function renderCityHistory() {
    // empties out the previous search history
    let searchHistory = $("#search-history").empty();
  
    // for each city in the search history array...
    cityHistory.forEach(function(cityName) {
      // creates a button and adds bootstrap classes to it
      let buttonEle = $("<button>").addClass(historyButtonClasses);
      buttonEle.attr(dataCityAttr, cityName);
      buttonEle.text(cityName);
      // appends the buttons to the search history container
      searchHistory.append(buttonEle);
    });
  }

// function adds a city to the previously searched section
function addCitytoHistory(cityName) {
    // function only adds to history if the city doesn't exist in search history
    if (!cityHistory.includes(cityName)) {
        cityHistory.push(cityName);
        localStorage.setItem("city_history", JSON.stringify(cityHistory));
        renderCityHistory();
    }
}

// This function handles the search after the necessary event occurs
function handleSubmitSearch(event) {
    // prevents the page from reloading...
    event.preventDefault();

    // gets city's name from search bar
    let cityName = $("#input-search").val().trim();

    // makes search box empty after submitting
    $("#input-search").val("");
    // Adds city to search history
    addCitytoHistory(cityName);
    // renders the city's weather
    renderCityWeather(cityName);
}

// function renders button to display weather data based on city name stored in button
function handleHistoryBtnClick(event) {
    if (event.target.matches("button")) {
      renderCityWeather($(event.target).attr(dataCityAttr));
    }
  }

// function gives the image location of the icon used in the OpenWeather API
function getIcon(code) {
    return "https://openweathermap.org/img/w/" + code + ".png";
}

// function changes styling of UV index element in HTML
function uviElementStyle(uvi) {
    if (uvi <= 2) {
        return "background-color: seagreen; color: white;";
    } else if (uvi <= 5) {
        return "background-color: yellow; color: black";
    } else if (uvi <= 7) {
        return "background-color: darkorange; color: black;";
    } else if (uvi <= 10) {
        return "background-color: red; color: white;";
    } else {
        return "background-color: orchid; color: black;";
    }
}

// function renders weather data for city that user inputs
function renderCityWeather(cityName) {
    // Hides info divs on the page since they display nothing yet
    $("#todays-weather").attr("style", "display: none;");
    $("#uv-today-element").attr("style", "display: none;");
    $("#next-weather").attr("style", "display: none;");

    let currentWeatherURL = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=" + cityName + "&appid=" + apiKey;

    // first fetch data from the Current Weather Data API
    fetch(currentWeatherURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log('Current Weather Data Fetch Response \n-------------');
            console.log(data);

            let oneCallURL = "https://api.openweathermap.org/data/2.5/onecall?units=metric&exclude=minutely,hourly&lat=" + data.coord.lat + "&lon=" + data.coord.lon + "&appid=" + apiKey;

            // Next use coordinates from Current Weather API Data to get One Call API data for all other info
            // This is because the One Call API requires coordinates (longitude and latitude values) to retrieve the data
            fetch(oneCallURL)
                .then(function (response) {
                    return response.json();
                })
                .then(function (oneCallData) {
                    console.log('One Call API Fetch Response \n-------------');
                    console.log(oneCallData);

                    // displays the necessary data onto the page, dt represents the date, given in unix, UTC format
                    // Moment.js * 1000 is used to convert the date to an understandable format 
                    $("#date-today").text("(" + moment(oneCallData.daily[0].dt * 1000).format("l") + ")");
                    $("#icon").attr("src", getIcon(oneCallData.daily[0].weather[0].icon))
                    $("#temp-today").text(oneCallData.daily[0].temp.day.toString());
                    $("#humid-today").text(oneCallData.daily[0].humidity);
                    $("#wind-today").text(oneCallData.daily[0].wind_speed);
                    $("#uv-today").text(oneCallData.daily[0].uvi);

                    // changes style of UV Index element using function uviElementStyle that was previously declared
                    $("#uv-today").attr("style", uviElementStyle(oneCallData.daily[0].uvi));

                    // makes for loop for each of five weather forecast cards
                    for (let i = 1; i <= 5; i++) {
                        let forecastCard = $("#day-" + i);

                        // displays data for each forecasted day
                        forecastCard.find("h5").text(moment(oneCallData.daily[i].dt * 1000).format("l"));
                        forecastCard.find("img").attr("src", getIcon(oneCallData.daily[i].weather[0].icon));
                        forecastCard.find(".card-temp").text(oneCallData.daily[i].temp.day.toString());
                        forecastCard.find(".card-wind").text(oneCallData.daily[i].wind_speed);
                        forecastCard.find(".card-humid").text(oneCallData.daily[i].humidity);
                    }
                })
            // Current Weather API Data is used to display city name, since One Call Data API lacks this information
            $("#current-city").text(data.name);

            // finally shows data since it is fully retrieved
            $("#todays-weather").attr("style", "display: block;");
            $("#uv-today-element").attr("style", "display: block;");
            $("#next-weather").attr("style", "display: block;");
        });
}


// Initialization of functions and event handlers
renderCityHistory();
$("#search-form").on("submit", handleSubmitSearch);
$("#search-history").on("click", handleHistoryBtnClick);
