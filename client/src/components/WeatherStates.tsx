import { CloudSun, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function LoadingState() {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6 space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-16 w-32" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-40 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export function EmptyState() {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="rounded-full bg-primary/10 p-4 mb-4">
          <CloudSun className="h-10 w-10 text-primary" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Search for a city</h2>
        <p className="text-muted-foreground max-w-md">
          Enter a city name above to view today&apos;s weather, the 5-day forecast,
          and monthly statistics from saved records.
        </p>
        <div className="flex items-center gap-1.5 mt-4 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          Try: London, Paris, Nicosia, New York
        </div>
      </CardContent>
    </Card>
  );
}
