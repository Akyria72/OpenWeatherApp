const openWeatherService = require("../services/openWeatherService");
const weatherRepository = require("../services/weatherRepository");

/**
 * Build the monthly statistics object for API responses.
 */
function buildMonthResponse(stats) {
  return {
    type: "statistics",
    label: "Monthly Statistics",
    message:
      "Real 30-day forecast requires a paid OpenWeather plan. These values are based on saved database records.",
    averageTemperature: stats.averageTemperature,
    averageHumidity: stats.averageHumidity,
    minTemperature: stats.minTemperature,
    maxTemperature: stats.maxTemperature,
    mostCommonDescription: stats.mostCommonDescription,
    recordsSaved: stats.recordsSaved,
  };
}

/**
 * GET /api/health
 */
function healthCheck(req, res) {
  res.json({
    status: "ok",
    message: "Open Weather API server is running",
  });
}

/**
 * GET /api/weather?city=CityName
 * Fetches current weather, weekly forecast, and monthly statistics.
 */
async function getWeather(req, res, next) {
  try {
    const cityName = req.query.city?.trim();

    if (!cityName) {
      return res.status(400).json({
        error: "Missing city",
        message: "Please provide a city name using ?city=CityName",
      });
    }

    const location = await openWeatherService.geocodeCity(cityName);
    const [currentWeather, forecastList] = await Promise.all([
      openWeatherService.getCurrentWeather(location.lat, location.lon),
      openWeatherService.getFiveDayForecast(location.lat, location.lon),
    ]);

    const savedCity = await weatherRepository.saveCityIfNotExists(location);
    await weatherRepository.saveWeatherRecord(savedCity.id, currentWeather);

    const week = openWeatherService.groupForecastByDay(forecastList);
    const stats = await weatherRepository.getMonthlyStatistics(savedCity.id);

    res.json({
      city: {
        name: savedCity.name,
        country: savedCity.country,
        lat: parseFloat(savedCity.lat),
        lon: parseFloat(savedCity.lon),
      },
      today: currentWeather,
      week,
      month: buildMonthResponse(stats),
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/weather/monthly?city=CityName
 * Returns monthly statistics from saved database records only.
 */
async function getMonthlyStats(req, res, next) {
  try {
    const cityName = req.query.city?.trim();

    if (!cityName) {
      return res.status(400).json({
        error: "Missing city",
        message: "Please provide a city name using ?city=CityName",
      });
    }

    const city = await weatherRepository.findCityByName(cityName);

    if (!city) {
      return res.status(404).json({
        error: "City not found",
        message: `No saved records found for "${cityName}". Search for the city first.`,
      });
    }

    const stats = await weatherRepository.getMonthlyStatistics(city.id);

    res.json({
      city: {
        name: city.name,
        country: city.country,
        lat: parseFloat(city.lat),
        lon: parseFloat(city.lon),
      },
      month: buildMonthResponse(stats),
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/weather/forecast30?city=CityName
 * Paid-ready endpoint for a real 30-day forecast.
 */
async function get30DayForecast(req, res, next) {
  try {
    const cityName = req.query.city?.trim();

    if (!cityName) {
      return res.status(400).json({
        error: "Missing city",
        message: "Please provide a city name using ?city=CityName",
      });
    }

    if (process.env.ENABLE_PAID_30_DAY_FORECAST !== "true") {
      return res.status(402).json({
        available: false,
        message: "30-day forecast requires a paid OpenWeather plan.",
      });
    }

    const location = await openWeatherService.geocodeCity(cityName);
    const forecast = await openWeatherService.get30DayForecast(
      location.lat,
      location.lon
    );

    res.json({
      available: true,
      city: location,
      forecast,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  healthCheck,
  getWeather,
  getMonthlyStats,
  get30DayForecast,
};
