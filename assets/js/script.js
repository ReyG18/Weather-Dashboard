const apiKey = "b9b0a2d170281fe64680755080e4df27";
const searchBtn = document.getElementById("search-btn");
const cityInput = document.getElementById("city");

//create an event listener for the search button
searchBtn.addEventListener('click', function(event) {
  event.preventDefault();
  let city = cityInput.value.trim();

  if(city !== "") {
    const currentWeatherQueryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const forecastQueryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;
    getCurrentWeather(currentWeatherQueryURL);
    getForecast(forecastQueryURL);

    saveCity(city);
    renderCities();

  } else {
    alert("Please enter a city name");
  }
});

//using fetch to retrieve data
function getCurrentWeather(currentWeatherQueryURL) {
  fetch(currentWeatherQueryURL)
    .then(function (response) {
      console.log(response.status);
      return response.json();
    })
    .then (function (data) {
      console.log("City Name:", data.name); // Log the city name from the API response
      renderCurrentWeatherCard(data); // Pass API city name to renderCurrentWeatherCard
      console.log(data);
    });
}
//create a function to display the forecast
function renderCurrentWeatherCard(weatherDetails) {
  let cityName = weatherDetails.name;
  let tempValue = `Temp: ${((weatherDetails.main.temp - 273.15) * 9/5 + 32).toFixed(2)} °F`;
  let windValue = `Wind: ${weatherDetails.wind.speed} M/S`;
  let humidityValue = `Humidity: ${weatherDetails.main.humidity}%`;

  const cityNameEl = document.getElementById("city-name");
  const tempEl = document.getElementById("temp");
  const windEl = document.getElementById("wind");
  const humidityEl = document.getElementById("humidity");

  cityNameEl.textContent = cityName; // Use the passed cityName
  tempEl.textContent = tempValue;
  windEl.textContent = windValue;
  humidityEl.textContent = humidityValue;
}

function getForecast(forecastQueryURL) {
  fetch(forecastQueryURL)
    .then(function (response) {
      console.log(response.status);
      return response.json();
    })
    .then(function (data) {
      renderForecast(data);
      console.log(data);
    })
};

function renderForecast(forecastDetails) {
  const forecastContainer = document.getElementById("forecast-container");
  forecastContainer.innerHTML = ''; // Clear previous forecast data

  const processedDates = {}; // Use an object to track processed dates
  let processedCount = 0; // Keep track of processed forecasts

  forecastDetails.list.forEach(forecast => {
    const forecastDate = new Date(forecast.dt_txt).toLocaleDateString();

    // Check if the date has already been processed and the processed count is less than 5
    if (!(forecastDate in processedDates) && processedCount < 5) {
      const forecastTemp = `Temp: ${((forecast.main.temp - 273.15) * 9/5 + 32).toFixed(2)} °F`;
      const forecastWind = `Wind: ${forecast.wind.speed} M/S`;
      const forecastHumidity = `Humidity: ${forecast.main.humidity}%`;

      // Create a forecast card
      const card = document.createElement("div");
      card.classList.add("card", "p-3", "mb-3");

      // Populate the card with forecast data
      card.innerHTML = `
        <h3 class="forecast-date">${forecastDate}</h3>
        <p class="card-subtitle mb-2 text-body-secondary">${forecastTemp}</p>
        <p class="card-subtitle mb-2 text-body-secondary">${forecastWind}</p>
        <p class="card-subtitle mb-2 text-body-secondary">${forecastHumidity}</p>
      `;

      // Append the forecast card to the forecast container
      forecastContainer.appendChild(card);

      // Add the processed date to the object and increment the processed count
      processedDates[forecastDate] = true;
      processedCount++;
    }
  });
}

// Function to save a city to local storage
function saveCity(city) {
  // Check if cities array exists in local storage
  let cities = JSON.parse(localStorage.getItem('cities')) || [];
  
  // Add the new city to the array if it doesn't already exist
  if (!cities.includes(city)) {
    cities.push(city);
    localStorage.setItem('cities', JSON.stringify(cities));
  }
}

// Function to load cities from local storage and display as buttons
function renderCities() {
  const cities = JSON.parse(localStorage.getItem('cities')) || [];
  const citiesContainer = document.getElementById('cities-container');

  // Clear the container first
  citiesContainer.innerHTML = '';

  // Create and append buttons for each city
  cities.forEach(city => {
    const cityButton = document.createElement('button'); // Create a new button element
    cityButton.textContent = city;
    cityButton.classList.add('btn', 'btn-secondary', 'h-20', 'w-75', 'mb-3'); //bootstrap classes for styling

    //Displays the weather of the target city on click
    cityButton.addEventListener('click', () => {
      getCurrentWeather(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`);
      getForecast(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`);
    });
    citiesContainer.appendChild(cityButton); // Append the button to the container
  });
}

// Call renderCities when the page loads to display existing cities
window.addEventListener('load', renderCities);

// Click event for the search button
searchBtn.addEventListener('click', function(event) {
  event.preventDefault(); // Prevents page from refreshing on submit
  let city = cityInput.value.trim();
  if (city !== "") {
    const currentWeatherQueryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const forecastQueryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;
    getCurrentWeather(currentWeatherQueryURL);
    getForecast(forecastQueryURL);
    
    // Save the city to local storage
    saveCity(city);
    
    // Reload the list of cities
    renderCities();
  } else {
    alert("Please enter a city name"); // If the field is left blank, it will trigger this alert
  }
});
