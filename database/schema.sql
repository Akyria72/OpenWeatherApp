-- Open Weather Application database schema
-- Database: weather_app

CREATE TABLE IF NOT EXISTS cities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    country VARCHAR(10) NOT NULL,
    lat DECIMAL(10, 7) NOT NULL,
    lon DECIMAL(10, 7) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (name, country)
);

CREATE TABLE IF NOT EXISTS weather_records (
    id SERIAL PRIMARY KEY,
    city_id INTEGER NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
    temperature DECIMAL(5, 2) NOT NULL,
    feels_like DECIMAL(5, 2),
    temp_min DECIMAL(5, 2),
    temp_max DECIMAL(5, 2),
    humidity INTEGER,
    pressure INTEGER,
    wind_speed DECIMAL(5, 2),
    description VARCHAR(255),
    icon VARCHAR(10),
    measured_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_weather_records_city_id ON weather_records(city_id);
CREATE INDEX IF NOT EXISTS idx_weather_records_measured_at ON weather_records(measured_at);
