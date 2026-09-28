require("dotenv").config();
const express = require("express");
const cors = require("cors");
const weatherRoutes = require("./routes/weatherRoutes");
const { testConnection } = require("./db");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api", weatherRoutes);

/**
 * Central error handler for API routes.
 */
app.use((err, req, res, next) => {
  console.error("Error:", err.message);

  if (err.code === "ECONNREFUSED" || err.code === "ENOTFOUND") {
    return res.status(503).json({
      error: "Database connection error",
      message: "Unable to connect to PostgreSQL. Check DATABASE_URL and ensure PostgreSQL is running.",
    });
  }

  if (err.code === "28P01") {
    return res.status(503).json({
      error: "Database authentication error",
      message: "PostgreSQL login failed. Check DATABASE_URL username and password.",
    });
  }

  if (err.code === "3D000") {
    return res.status(503).json({
      error: "Database not found",
      message: 'Database "weather_app" does not exist. Create it and run database/schema.sql.',
    });
  }

  if (err.code === "42P01") {
    return res.status(503).json({
      error: "Database schema error",
      message: "Required database tables are missing. Run database/schema.sql first.",
    });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: err.name || "Server error",
    message: err.message || "An unexpected error occurred.",
  });
});

app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);

  try {
    await testConnection();
    console.log("PostgreSQL connection successful");
  } catch (error) {
    console.warn("PostgreSQL connection failed:", error.message);
    console.warn("The server will start, but database features may not work.");
  }
});
