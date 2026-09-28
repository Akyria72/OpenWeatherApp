const express = require("express");
const weatherController = require("../controllers/weatherController");

const router = express.Router();

router.get("/health", weatherController.healthCheck);
router.get("/weather", weatherController.getWeather);
router.get("/weather/monthly", weatherController.getMonthlyStats);
router.get("/weather/forecast30", weatherController.get30DayForecast);

module.exports = router;
