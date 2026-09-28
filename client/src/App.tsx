import { useState } from "react";
import { AlertCircle, Cloud } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MonthlyStatisticsSection } from "@/components/MonthlyStatistics";
import { SearchBar } from "@/components/SearchBar";
import { TodayWeatherCard } from "@/components/TodayWeatherCard";
import { WeeklyForecast } from "@/components/WeeklyForecast";
import { EmptyState, LoadingState } from "@/components/WeatherStates";
import { fetchWeather, WeatherResponse } from "@/lib/api";

export default function App() {
  const [cityInput, setCityInput] = useState("");
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    const city = cityInput.trim();
    if (!city) return;

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const data = await fetchWeather(city);
      setWeather(data);
    } catch (err) {
      setWeather(null);
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-background">
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2">
            <Cloud className="h-7 w-7 text-primary" />
            <div>
              <h1 className="text-xl font-bold tracking-tight">Open Weather Application</h1>
              <p className="text-xs text-muted-foreground">University full-stack weather dashboard</p>
            </div>
          </div>
          <SearchBar
            value={cityInput}
            onChange={setCityInput}
            onSearch={handleSearch}
            loading={loading}
          />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading && <LoadingState />}

        {!loading && !hasSearched && <EmptyState />}

        {!loading && weather && (
          <>
            <Tabs defaultValue="today" className="w-full">
              <TabsList className="grid w-full max-w-md grid-cols-3">
                <TabsTrigger value="today">Today</TabsTrigger>
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="month">Month</TabsTrigger>
              </TabsList>

              <TabsContent value="today" className="mt-6">
                <TodayWeatherCard city={weather.city} weather={weather.today} />
              </TabsContent>

              <TabsContent value="week" className="mt-6">
                <WeeklyForecast week={weather.week} />
              </TabsContent>

              <TabsContent value="month" className="mt-6">
                <MonthlyStatisticsSection month={weather.month} />
              </TabsContent>
            </Tabs>

            <Separator />
            <p className="text-xs text-center text-muted-foreground">
              Data from OpenWeather API via backend · Monthly stats from PostgreSQL
            </p>
          </>
        )}
      </main>
    </div>
  );
}
