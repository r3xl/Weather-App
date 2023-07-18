const apiKey = '27172db6ea0f363c822861831a47a45a';

// Function to fetch weather data and store it in localStorage
async function fetchWeatherDataAndStore(cityName) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.cod === '404') {
      alert(`Invalid City name.`);
      return;
    }

    localStorage.setItem(cityName, JSON.stringify(data));
    populateInterface(cityName);
  } catch (error) {
    console.log(error);
    alert(`Error fetching weather data for ${cityName}`);
  }
}

// Function to populate the interface with data
function populateInterface(city) {
  const localdata = localStorage.getItem(city);

  // Check if the data is available
  if (!localdata) {
    alert(`Data not found for ${city}`);
    return;
  }

  const localStorageValue = JSON.parse(localdata);

  const locationElement = document.getElementById('location');
  const weatherIconElement = document.querySelector('.weather-icon');
  const temperatureElement = document.getElementById('temperature');
  const forecastDayElement = document.querySelector('.forecast-day');

  locationElement.innerHTML = localStorageValue.name;
  weatherIconElement.src = `http://openweathermap.org/img/w/${localStorageValue.weather[0].icon}.png`;
  temperatureElement.innerHTML = `${Math.round(localStorageValue.main.temp - 273.15)}°C`;

  forecastDayElement.innerHTML = '';

  const dateElement = document.createElement('p');
  const maxTempElement = document.createElement('p');
  const minTempElement = document.createElement('p');
  const conditionElement = document.createElement('p');

  const date = new Date();
  const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
  dateElement.textContent = dayOfWeek;
  maxTempElement.textContent = `Max: ${Math.round(localStorageValue.main.temp_max - 273.15)}°C`;
  minTempElement.textContent = `Min: ${Math.round(localStorageValue.main.temp_min - 273.15)}°C`;
  conditionElement.textContent = localStorageValue.weather[0].description;

  forecastDayElement.appendChild(dateElement);
  forecastDayElement.appendChild(maxTempElement);
  forecastDayElement.appendChild(minTempElement);
  forecastDayElement.appendChild(conditionElement);
}

// Function to handle the search event
function handleSearch() {
  const cityInput = document.getElementById('cityInput');
  const city = cityInput.value;

  fetchWeatherDataAndStore(city)
    .catch((error) => console.log(error));

  cityInput.value = '';
}

const defaultCity = 'Sylacauga';
fetchWeatherDataAndStore(defaultCity)
  .catch((error) => console.log(error));

document.getElementById('cityInput').addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    handleSearch();
  }
});

document.querySelector('.press').addEventListener('click', handleSearch);