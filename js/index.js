const searchInput = document.getElementById("search");
const weatherContainer = document.getElementById("weather");

let currentCity = "Cairo";

searchInput.addEventListener("input", () => {
  const city = searchInput.value.trim();
  if (city.length > 2) {
    currentCity = city;
    fetchWeather(city);
  }
});

function resetWeatherInfo(message = "Unable to fetch weather data.") {
  weatherContainer.innerHTML = `<p>${message}</p>`;
}

async function fetchWeather(city) {
  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=cb893b1e47d24bc399374536240812&q=${city}&days=3&aqi=no&alerts=no`
    );
    const data = await response.json();

    if (data.error || !data.forecast || !data.forecast.forecastday) {
      resetWeatherInfo("No forecast found for this city.");
      return;
    }

    updateWeatherInfo(data);
  } catch (error) {
    resetWeatherInfo(
      "Failed to fetch weather data. Please check your connection."
    );
  }
}

function updateDayInfo(selector, forecast) {
  document.querySelector(`${selector} .day1`).textContent = new Date(
    forecast.date
  ).toLocaleDateString("en", { weekday: "long" });

  document.querySelector(
    `${selector} .num`
  ).innerHTML = `${forecast.day.maxtemp_c}<sup>o</sup>C`;

  document.querySelector(
    `${selector} .humidity`
  ).textContent = `${forecast.day.mintemp_c}°`;

  document.querySelector(
    `${selector} .cloud img`
  ).src = `https:${forecast.day.condition.icon}`;

  document.querySelector(`${selector} .text`).textContent =
    forecast.day.condition.text;
}

function updateWeatherInfo(data) {
  document.querySelector(".par1 .date").textContent =
    new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long" });

  document.querySelector(".par1 .location1").textContent = data.location.name;
  document.querySelector(
    ".par1 .num"
  ).innerHTML = `${data.current.temp_c}<sup>o</sup>C`;

  document.querySelector(
    ".par1 .sun img"
  ).src = `https:${data.current.condition.icon}`;
  document.querySelector(".par1 .custom").textContent =
    data.current.condition.text;

  const forecastDays = data.forecast.forecastday;
  updateDayInfo(".par2", forecastDays[1]);
  updateDayInfo(".par3", forecastDays[2]);
}

document.addEventListener("DOMContentLoaded", () => {
  fetchWeather(currentCity);
});

setInterval(() => {
  fetchWeather(currentCity);
}, 3600000);
