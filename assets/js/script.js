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

