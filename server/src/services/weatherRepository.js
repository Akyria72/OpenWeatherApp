const { query } = require("../db");

/**
 * Find a city in the database by name (case-insensitive).
 */
async function findCityByName(cityName) {
  const result = await query(
    `SELECT id, name, country, lat, lon
     FROM cities
     WHERE LOWER(name) = LOWER($1)
     LIMIT 1`,
    [cityName]
  );
  return result.rows[0] || null;
}

/**
 * Insert a city if it does not already exist; otherwise return the existing row.
 */
async function saveCityIfNotExists(city) {
  const existing = await findCityByName(city.name);
  if (existing) {
    return existing;
  }

  const result = await query(
    `INSERT INTO cities (name, country, lat, lon)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (name, country) DO UPDATE SET name = EXCLUDED.name
     RETURNING id, name, country, lat, lon`,
    [city.name, city.country, city.lat, city.lon]
  );

  return result.rows[0];
}

/**
 * Save a current weather reading linked to a city.
 * source defaults to "openweather" for OpenWeather API readings.
 */
async function saveWeatherRecord(cityId, weather, source = "openweather") {
  const sourceValue = source || "openweather";
  const rawValue =
    weather.raw != null
      ? typeof weather.raw === "string"
        ? weather.raw
        : JSON.stringify(weather.raw)
      : JSON.stringify(weather);

  const result = await query(
    `INSERT INTO weather_records
       (city_id, source, measured_at, temperature, feels_like, temp_min, temp_max,
        humidity, pressure, wind_speed, description, icon, raw)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
     ON CONFLICT (city_id, source, measured_at) DO UPDATE SET
       temperature = EXCLUDED.temperature,
       feels_like = EXCLUDED.feels_like,
       temp_min = EXCLUDED.temp_min,
       temp_max = EXCLUDED.temp_max,
       humidity = EXCLUDED.humidity,
       pressure = EXCLUDED.pressure,
       wind_speed = EXCLUDED.wind_speed,
       description = EXCLUDED.description,
       icon = EXCLUDED.icon,
       raw = EXCLUDED.raw
     RETURNING id`,
    [
      cityId,
      sourceValue,
      weather.measuredAt,
      weather.temperature,
      weather.feelsLike,
      weather.tempMin,
      weather.tempMax,
      weather.humidity,
      weather.pressure,
      weather.windSpeed,
      weather.description,
      weather.icon,
      rawValue,
    ]
  );

  return result.rows[0];
}

/**
 * Compute monthly statistics from saved weather records for the current calendar month.
 */
async function getMonthlyStatistics(cityId) {
  const result = await query(
    `SELECT
       COUNT(*)::int AS records_saved,
       ROUND(AVG(temperature)::numeric, 1) AS average_temperature,
       ROUND(AVG(humidity)::numeric, 0) AS average_humidity,
       ROUND(MIN(temperature)::numeric, 1) AS min_temperature,
       ROUND(MAX(temperature)::numeric, 1) AS max_temperature,
       MODE() WITHIN GROUP (ORDER BY description) AS most_common_description
     FROM weather_records
     WHERE city_id = $1
       AND measured_at >= date_trunc('month', CURRENT_DATE)
       AND measured_at < date_trunc('month', CURRENT_DATE) + INTERVAL '1 month'`,
    [cityId]
  );

  const row = result.rows[0];

  return {
    averageTemperature: row.average_temperature
      ? parseFloat(row.average_temperature)
      : null,
    averageHumidity: row.average_humidity
      ? parseInt(row.average_humidity, 10)
      : null,
    minTemperature: row.min_temperature
      ? parseFloat(row.min_temperature)
      : null,
    maxTemperature: row.max_temperature
      ? parseFloat(row.max_temperature)
      : null,
    mostCommonDescription: row.most_common_description || null,
    recordsSaved: row.records_saved || 0,
  };
}

module.exports = {
  findCityByName,
  saveCityIfNotExists,
  saveWeatherRecord,
  getMonthlyStatistics,
};
