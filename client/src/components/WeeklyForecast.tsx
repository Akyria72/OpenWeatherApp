import { Droplets } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { WeekDay, formatDate, getWeatherIconUrl } from "@/lib/api";

interface WeeklyForecastProps {
  week: WeekDay[];
}

export function WeeklyForecast({ week }: WeeklyForecastProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">5-Day Forecast</h2>
        <p className="text-sm text-muted-foreground">
          Grouped daily summary from OpenWeather 5-day / 3-hour forecast
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {week.map((day) => (
          <Card key={day.date}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{formatDate(day.date)}</CardTitle>
              <CardDescription className="capitalize">{day.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-2">
              <img
                src={getWeatherIconUrl(day.icon)}
                alt={day.description}
                className="h-12 w-12"
              />
              <div className="text-center">
                <p className="text-2xl font-bold">{Math.round(day.averageTemp)}°C</p>
                <p className="text-sm text-muted-foreground">
                  {Math.round(day.minTemp)}° / {Math.round(day.maxTemp)}°
                </p>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Droplets className="h-3.5 w-3.5" />
                {day.humidity}%
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
