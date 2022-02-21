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

