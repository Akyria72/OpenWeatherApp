const axios = require("axios");

const BASE_URL = "https://api.openweathermap.org";
const API_KEY = process.env.OPENWEATHER_API_KEY;

/**
 * Wrap axios errors from OpenWeather into readable messages.
 */
function handleOpenWeatherError(error) {
  if (error.response) {
    const status = error.response.status;
    const message = error.response.data?.message || error.message;

    if (status === 401) {
      const err = new Error("Invalid OpenWeather API key.");
      err.statusCode = 401;
      throw err;
    }

    if (status === 404) {
      const err = new Error("City not found.");
      err.statusCode = 404;
      throw err;
    }

    if (status === 429) {
      const err = new Error("OpenWeather API rate limit exceeded. Please try again later.");
      err.statusCode = 429;
      throw err;
    }

    const err = new Error(message || "OpenWeather API request failed.");
    err.statusCode = status;
    throw err;
  }

  if (error.request) {
    const err = new Error("Unable to reach OpenWeather API.");
    err.statusCode = 503;
    throw err;
  }

  throw error;
}

/**
 * Look up a city by name using the OpenWeather Geocoding API.
 * Returns the first matching result with name, country, lat, lon.
 */
async function geocodeCity(cityName) {
  try {
    const response = await axios.get(`${BASE_URL}/geo/1.0/direct`, {
      params: {
        q: cityName,
        limit: 1,
        appid: API_KEY,
      },
    });

    if (!response.data || response.data.length === 0) {
      const err = new Error(`City "${cityName}" not found.`);
      err.statusCode = 404;
      throw err;
    }

    const location = response.data[0];
    return {
      name: location.name,
      country: location.country,
      lat: location.lat,
      lon: location.lon,
    };
  } catch (error) {
    if (error.statusCode) throw error;
    handleOpenWeatherError(error);
  }
}

/**
 * Fetch current weather for coordinates using the Current Weather API.
 */
async function getCurrentWeather(lat, lon) {
  try {
    const response = await axios.get(`${BASE_URL}/data/2.5/weather`, {
      params: {
        lat,
        lon,
        appid: API_KEY,
        units: "metric",
      },
    });

    const data = response.data;
    return {
      temperature: data.main.temp,
      feelsLike: data.main.feels_like,
      tempMin: data.main.temp_min,
      tempMax: data.main.temp_max,
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      windSpeed: data.wind?.speed ?? 0,
      description: data.weather[0]?.description ?? "unknown",
      icon: data.weather[0]?.icon ?? "01d",
      measuredAt: new Date(data.dt * 1000).toISOString(),
    };
  } catch (error) {
    if (error.statusCode) throw error;
    handleOpenWeatherError(error);
  }
}

/**
 * Fetch 5-day / 3-hour forecast for coordinates.
 */
async function getFiveDayForecast(lat, lon) {
  try {
    const response = await axios.get(`${BASE_URL}/data/2.5/forecast`, {
      params: {
        lat,
        lon,
        appid: API_KEY,
        units: "metric",
      },
    });

    return response.data.list;
  } catch (error) {
    if (error.statusCode) throw error;
    handleOpenWeatherError(error);
  }
}

/**
 * Group 3-hour forecast entries by calendar day and compute daily summaries.
 */
function groupForecastByDay(forecastList) {
  const days = {};

  for (const entry of forecastList) {
    const date = entry.dt_txt.split(" ")[0];

    if (!days[date]) {
      days[date] = {
        date,
        temps: [],
        humidities: [],
        descriptions: [],
        icons: [],
      };
    }

    days[date].temps.push(entry.main.temp);
    days[date].humidities.push(entry.main.humidity);
    days[date].descriptions.push(entry.weather[0]?.description ?? "unknown");
    days[date].icons.push(entry.weather[0]?.icon ?? "01d");
  }

  return Object.values(days).map((day) => {
    const avgTemp =
      day.temps.reduce((sum, t) => sum + t, 0) / day.temps.length;

    const descriptionCounts = {};
    for (const desc of day.descriptions) {
      descriptionCounts[desc] = (descriptionCounts[desc] || 0) + 1;
    }
    const mostCommonDescription = Object.entries(descriptionCounts).sort(
      (a, b) => b[1] - a[1]
    )[0][0];

    const iconCounts = {};
    for (const icon of day.icons) {
      iconCounts[icon] = (iconCounts[icon] || 0) + 1;
    }
    const mostCommonIcon = Object.entries(iconCounts).sort(
      (a, b) => b[1] - a[1]
    )[0][0];

    return {
      date: day.date,
      averageTemp: Math.round(avgTemp * 10) / 10,
      minTemp: Math.round(Math.min(...day.temps) * 10) / 10,
      maxTemp: Math.round(Math.max(...day.temps) * 10) / 10,
      humidity: Math.round(
        day.humidities.reduce((sum, h) => sum + h, 0) / day.humidities.length
      ),
      description: mostCommonDescription,
      icon: mostCommonIcon,
    };
  });
}

/**
 * Placeholder for a future paid 30-day forecast endpoint.
 * Returns null when the paid plan is not enabled.
 */
async function get30DayForecast(lat, lon) {
  if (process.env.ENABLE_PAID_30_DAY_FORECAST !== "true") {
    return null;
  }

  // When a paid OpenWeather plan is available, implement the real API call here.
  // Example: One Call API 3.0 daily forecast endpoint.
  throw new Error("30-day forecast endpoint is not yet implemented.");
}

module.exports = {
  geocodeCity,
  getCurrentWeather,
  getFiveDayForecast,
  groupForecastByDay,
  get30DayForecast,
};
