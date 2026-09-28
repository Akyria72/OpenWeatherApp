import { AlertCircle, BarChart3, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MonthStatistics } from "@/lib/api";

interface MonthlyStatisticsProps {
  month: MonthStatistics;
}

export function MonthlyStatisticsSection({ month }: MonthlyStatisticsProps) {
  const hasData = month.recordsSaved > 0;

  return (
    <div className="space-y-4">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Paid 30-day forecast not available</AlertTitle>
        <AlertDescription>
          Real 30-day forecast requires a paid OpenWeather plan. The section below
          shows <strong>Monthly Statistics</strong> from saved database records — not
          a real 30-day forecast.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                {month.label}
              </CardTitle>
              <CardDescription className="mt-1">{month.message}</CardDescription>
            </div>
            <Badge variant="secondary">{month.type}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {hasData ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <StatCard
                label="Average Temperature"
                value={
                  month.averageTemperature != null
                    ? `${month.averageTemperature}°C`
                    : "—"
                }
              />
              <StatCard
                label="Average Humidity"
                value={
                  month.averageHumidity != null ? `${month.averageHumidity}%` : "—"
                }
              />
              <StatCard
                label="Min Temperature"
                value={
                  month.minTemperature != null ? `${month.minTemperature}°C` : "—"
                }
              />
              <StatCard
                label="Max Temperature"
                value={
                  month.maxTemperature != null ? `${month.maxTemperature}°C` : "—"
                }
              />
              <StatCard
                label="Most Common Condition"
                value={month.mostCommonDescription ?? "—"}
                capitalize
              />
              <StatCard
                label="Saved Records (this month)"
                value={String(month.recordsSaved)}
              />
            </div>
          ) : (
            <div className="flex items-start gap-3 rounded-lg border border-dashed p-6 text-muted-foreground">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-foreground">No saved records yet</p>
                <p className="text-sm mt-1">
                  Search for this city to save weather readings. Monthly statistics
                  will grow as you search over time.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  label,
  value,
  capitalize,
}: {
  label: string;
  value: string;
  capitalize?: boolean;
}) {
  return (
    <div className="rounded-lg border bg-muted/30 p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className={`text-xl font-semibold mt-1 ${capitalize ? "capitalize" : ""}`}>
        {value}
      </p>
    </div>
  );
}
