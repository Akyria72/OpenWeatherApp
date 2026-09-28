# Open Weather Application

A university full-stack weather web application that displays current weather, a 5-day forecast, and monthly statistics for searched cities. Built with React, Node.js, Express, PostgreSQL, and the OpenWeather API.

## Project Purpose

This project demonstrates a **3-tier client-server architecture**:

- **Frontend** — React dashboard for searching cities and viewing weather
- **Backend** — Express API that talks to OpenWeather and PostgreSQL
- **Database** — PostgreSQL stores cities and historical weather records

The app shows weather for **today**, **week** (5-day forecast), and **month** (database statistics). It does **not** fake a real 30-day forecast on the free OpenWeather plan.

## Architecture

```
React + Vite (client)  →  Node.js + Express (server)  →  PostgreSQL
                                    ↓
                            OpenWeather API
```

- The **frontend never calls OpenWeather directly**
- The **OpenWeather API key lives only in `server/.env`**
- Weather readings are saved to PostgreSQL for monthly statistics

## Technologies Used

| Layer    | Stack |
|----------|-------|
| Frontend | React, Vite, TypeScript, Tailwind CSS, shadcn/ui, lucide-react |
| Backend  | Node.js, Express, axios, pg, dotenv, cors, nodemon |
| Database | PostgreSQL |
| External | OpenWeather API (Current Weather + 5 Day / 3 Hour Forecast) |

## Folder Structure

```
open-weather-application/
├── client/                 # React frontend
├── server/                 # Express backend
│   ├── src/
│   │   ├── index.js
│   │   ├── db.js
│   │   ├── routes/
│   │   ├── controllers/
│   │   └── services/
│   ├── .env
│   └── .env.example
├── database/
│   └── schema.sql
└── README.md
```

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [PostgreSQL](https://www.postgresql.org/) running locally on port `5432`

## PostgreSQL Setup

1. Create the database:

```sql
CREATE DATABASE weather_app;
```

2. Run the schema (creates `cities` and `weather_records` tables):

```bash
psql -U postgres -d weather_app -f database/schema.sql
```

Default credentials used in this project:

| Setting  | Value        |
|----------|--------------|
| Database | `weather_app` |
| User     | `postgres`   |
| Password | `postgres`   |
| Port     | `5432`       |

## Environment Configuration

Copy the example env file and add your OpenWeather API key:

```bash
cd server
copy .env.example .env
```

Edit `server/.env`:

```env
PORT=5000
OPENWEATHER_API_KEY=your_openweather_key_here
DATABASE_URL=postgres://postgres:postgres@localhost:5432/weather_app
ENABLE_PAID_30_DAY_FORECAST=false
```

Get a free API key at [openweathermap.org/api](https://openweathermap.org/api).

> **Important:** Do not put the API key in the React frontend or in any `client/` env file.

## Install Dependencies

**Backend:**

```bash
cd server
npm install
```

**Frontend:**

```bash
cd client
npm install
```

## Run the Application

**Terminal 1 — Backend** (http://localhost:5000):

```bash
cd server
npm run dev
```

**Terminal 2 — Frontend** (http://localhost:5173):

```bash
cd client
npm run dev
```

Open http://localhost:5173 in your browser, enter a city name, and click **Search**.

## API Routes

### `GET /api/health`

Health check.

**Response:**

```json
{
  "status": "ok",
  "message": "Open Weather API server is running"
}
```

### `GET /api/weather?city=CityName`

Main weather endpoint. Geocodes the city, fetches current weather and 5-day forecast from OpenWeather, saves data to PostgreSQL, and returns normalized JSON.

**Example:** `GET /api/weather?city=London`

Returns `city`, `today`, `week`, and `month` (monthly statistics from database).

### `GET /api/weather/monthly?city=CityName`

Returns monthly statistics from saved database records for the current calendar month. The city must have been searched at least once before.

### `GET /api/weather/forecast30?city=CityName`

Paid-ready endpoint for a real 30-day forecast.

When `ENABLE_PAID_30_DAY_FORECAST` is not `"true"`, returns **HTTP 402**:

```json
{
  "available": false,
  "message": "30-day forecast requires a paid OpenWeather plan."
}
```

## Free Plan Limitation — 30-Day Forecast

The OpenWeather **free plan** includes:

- Current Weather API
- 5 Day / 3 Hour Forecast API

It does **not** include a real 30-day forecast. This app:

1. Uses **real data** for today and the 5-day week view
2. Shows a **Monthly Statistics** fallback from PostgreSQL saved records (clearly labelled, not a forecast)
3. Exposes `/api/weather/forecast30` as a **paid-ready** stub that returns a clear message until a paid plan is enabled

To enable the paid endpoint later, set `ENABLE_PAID_30_DAY_FORECAST=true` in `server/.env` and implement the paid API call in `server/src/services/openWeatherService.js`.

## Monthly Statistics Fallback

Each time you search for a city, the current weather is saved to `weather_records`. The **Month** tab shows aggregated stats for the current month:

- Average temperature and humidity
- Min / max temperature
- Most common weather description
- Number of saved records

These are **historical averages from your searches**, not a predictive 30-day forecast.

## Error Handling

The API handles:

- Missing city parameter
- City not found
- Invalid OpenWeather API key
- OpenWeather rate limits
- PostgreSQL connection errors
- General server errors

The frontend displays friendly error messages in an alert component.

## License

MIT
