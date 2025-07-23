import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { type DistributorPerformance } from "@shared/schema";

export function PerformanceMetrics() {
  const { data: performance = [], isLoading } = useQuery<DistributorPerformance[]>({
    queryKey: ["/api/dashboard/distributor-performance"],
  });

  const getPerformanceColor = (changePercent: number) => {
    if (changePercent > 0) return "text-aurora-green";
    if (changePercent < 0) return "text-aurora-red";
    return "text-gray-300";
  };

  const getDistributorColor = (distributor: string) => {
    const colors = {
      "ABCSupply": "bg-aurora-cyan",
      "Beacon": "bg-aurora-teal", 
      "SRSProducts": "bg-aurora-purple",
      "CommercialDistributors": "bg-aurora-blue",
      "Other": "bg-aurora-magenta"
    };
    return colors[distributor as keyof typeof colors] || "bg-gray-500";
  };

  return (
    <Card className="glass rounded-xl border-aurora-blue/20">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-white">
          Performance by Distributor
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <LoadingSpinner className="h-6 w-6 text-aurora-cyan" />
          </div>
        ) : (
          <div className="space-y-4">
            {performance.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                No performance data available
              </div>
            ) : (
              performance.map((dist) => (
                <div
                  key={dist.distributor}
                  className="flex items-center justify-between p-3 bg-aurora-navy/30 rounded-lg hover:bg-aurora-navy/50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 ${getDistributorColor(dist.distributor)} rounded-full`} />
                    <div>
                      <span className="font-medium text-white">{dist.distributor}</span>
                      <Badge 
                        variant="outline" 
                        className="ml-2 text-xs border-aurora-cyan/30 text-aurora-cyan"
                      >
                        {dist.tickerSymbol}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-semibold ${getPerformanceColor(dist.changePercent)}`}>
                      {dist.changePercent > 0 ? '+' : ''}{dist.changePercent.toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-400">
                      {dist.materialCount} items
                    </div>
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
