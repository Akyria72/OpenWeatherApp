import {
  Droplets,
  Gauge,
  Thermometer,
  Wind,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { City, TodayWeather, getWeatherIconUrl } from "@/lib/api";

interface TodayWeatherCardProps {
  city: City;
  weather: TodayWeather;
}

export function TodayWeatherCard({ city, weather }: TodayWeatherCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-3xl">
              {city.name}, {city.country}
            </CardTitle>
            <CardDescription className="capitalize text-base mt-1">
              {weather.description}
            </CardDescription>
          </div>
          <img
            src={getWeatherIconUrl(weather.icon)}
            alt={weather.description}
            className="h-20 w-20"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-2 mb-6">
          <span className="text-6xl font-bold tracking-tight">
            {Math.round(weather.temperature)}°
          </span>
          <span className="text-muted-foreground mb-2">C</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatItem
            icon={<Thermometer className="h-4 w-4" />}
            label="Feels like"
            value={`${Math.round(weather.feelsLike)}°C`}
          />
          <StatItem
            icon={<Gauge className="h-4 w-4" />}
            label="Min / Max"
            value={`${Math.round(weather.tempMin)}° / ${Math.round(weather.tempMax)}°`}
          />
          <StatItem
            icon={<Droplets className="h-4 w-4" />}
            label="Humidity"
            value={`${weather.humidity}%`}
          />
          <StatItem
            icon={<Wind className="h-4 w-4" />}
            label="Wind"
            value={`${weather.windSpeed} m/s`}
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Badge variant="secondary">Pressure: {weather.pressure} hPa</Badge>
          <Badge variant="outline">
            Updated: {new Date(weather.measuredAt).toLocaleString("en-US")}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

function StatItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg bg-muted/50 p-3">
      <div className="flex items-center gap-1.5 text-muted-foreground text-xs mb-1">
        {icon}
        {label}
      </div>
      <p className="font-semibold">{value}</p>
    </div>
  );
}
