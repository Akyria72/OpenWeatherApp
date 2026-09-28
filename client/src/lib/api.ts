export interface City {
  name: string;
  country: string;
  lat: number;
  lon: number;
}

export interface TodayWeather {
  temperature: number;
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  description: string;
  icon: string;
  measuredAt: string;
}

export interface WeekDay {
  date: string;
  averageTemp: number;
  minTemp: number;
  maxTemp: number;
  humidity: number;
  description: string;
  icon: string;
}

export interface MonthStatistics {
  type: "statistics";
  label: string;
  message: string;
  averageTemperature: number | null;
  averageHumidity: number | null;
  minTemperature?: number | null;
  maxTemperature?: number | null;
  mostCommonDescription?: string | null;
  recordsSaved: number;
}

export interface WeatherResponse {
  city: City;
  today: TodayWeather;
  week: WeekDay[];
  month: MonthStatistics;
}

export interface ApiError {
  error: string;
  message: string;
}

const API_BASE = "http://localhost:5000/api";

export async function fetchWeather(city: string): Promise<WeatherResponse> {
  const response = await fetch(
    `${API_BASE}/weather?city=${encodeURIComponent(city)}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch weather data.");
  }

  return data as WeatherResponse;
}

export function getWeatherIconUrl(icon: string): string {
  return `https://openweathermap.org/img/wn/${icon}@2x.png`;
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T12:00:00");
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}
