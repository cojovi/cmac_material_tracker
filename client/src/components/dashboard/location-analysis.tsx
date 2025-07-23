import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { type LocationPerformance } from "@shared/schema";

export function LocationAnalysis() {
  const { data: locations = [], isLoading } = useQuery<LocationPerformance[]>({
    queryKey: ["/api/dashboard/location-performance"],
  });

  const getLocationColor = (location: string) => {
    const colors = {
      "DFW": "text-aurora-green",
      "ATX": "text-aurora-teal",
      "HOU": "text-aurora-blue", 
      "OKC": "text-aurora-coral",
      "ATL": "text-aurora-magenta",
      "ARK": "text-aurora-yellow",
      "NSH": "text-aurora-cyan"
    };
    return colors[location as keyof typeof colors] || "text-gray-300";
  };

  const getLocationName = (code: string) => {
    const names = {
      "DFW": "Dallas-Fort Worth",
      "ATX": "Austin",
      "HOU": "Houston",
      "OKC": "Oklahoma City", 
      "ATL": "Atlanta",
      "ARK": "Arkansas",
      "NSH": "Nashville"
    };
    return names[code as keyof typeof names] || code;
  };

  const getPerformanceColor = (changePercent: number) => {
    if (changePercent > 0) return "text-aurora-green";
    if (changePercent < 0) return "text-aurora-red";
    return "text-gray-300";
  };

  return (
    <Card className="glass rounded-xl border-aurora-magenta/20">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-white">
          Regional Performance
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <LoadingSpinner className="h-6 w-6 text-aurora-cyan" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {locations.length === 0 ? (
              <div className="col-span-2 text-center py-8 text-gray-400">
                No location data available
              </div>
            ) : (
              locations.slice(0, 8).map((location) => (
                <div
                  key={location.location}
                  className="text-center p-4 bg-aurora-navy/30 rounded-lg hover:bg-aurora-navy/50 transition-colors material-card"
                >
                  <div className={`text-2xl font-bold ${getLocationColor(location.location)}`}>
                    {location.location}
                  </div>
                  <div className="text-sm text-gray-300 mb-2">
                    {getLocationName(location.location)}
                  </div>
                  <div className={`font-semibold ${getPerformanceColor(location.changePercent)}`}>
                    {location.changePercent > 0 ? '+' : ''}{location.changePercent.toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {location.materialCount} materials
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
