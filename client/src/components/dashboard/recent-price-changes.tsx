import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Zap } from "lucide-react";
import { type PriceHistory, type Material } from "@shared/schema";

type RecentChange = PriceHistory & { material: Material };

export function RecentPriceChanges() {
  const { data: recentChanges = [], isLoading } = useQuery<RecentChange[]>({
    queryKey: ["/api/price-changes/recent"],
  });

  const getChangeStyle = (changePercent?: string) => {
    if (!changePercent) return { badge: "NEW", color: "text-aurora-yellow", bgColor: "bg-aurora-yellow/10", borderColor: "border-aurora-yellow/30" };
    
    const percent = parseFloat(changePercent);
    if (percent > 0) {
      return { 
        badge: "UP", 
        color: "text-aurora-green", 
        bgColor: "bg-aurora-green/10", 
        borderColor: "border-aurora-green/30" 
      };
    } else {
      return { 
        badge: "DOWN", 
        color: "text-aurora-red", 
        bgColor: "bg-aurora-red/10", 
        borderColor: "border-aurora-red/30" 
      };
    }
  };

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const changeDate = new Date(date);
    const diffMs = now.getTime() - changeDate.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 60) return `${diffMins} min ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  return (
    <Card className="glass rounded-xl border-aurora-green/20">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-white flex items-center">
          <Zap className="mr-2 text-aurora-yellow" />
          Recent Changes
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <LoadingSpinner className="h-6 w-6 text-aurora-cyan" />
          </div>
        ) : (
          <div className="space-y-4">
            {recentChanges.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                No recent price changes
              </div>
            ) : (
              recentChanges.map((change) => {
                const style = getChangeStyle(change.changePercent || undefined);
                return (
                  <div
                    key={change.id}
                    className={`${style.bgColor} border ${style.borderColor} rounded-lg p-4 ${
                      !change.changePercent ? 'animate-glow' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Badge 
                        variant="outline" 
                        className={`${style.color} border-current`}
                      >
                        {style.badge}
                      </Badge>
                      <span className="text-xs text-gray-400">
                        {formatTimeAgo(change.submittedAt.toString())}
                      </span>
                    </div>
                    <div className="font-medium text-white">
                      {change.material.name}
                    </div>
                    <div className="text-sm text-gray-300">
                      {change.material.distributor} • {change.material.location}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className={`font-semibold ${style.color}`}>
                        ${parseFloat(change.newPrice).toFixed(2)}
                      </span>
                      {change.changePercent && (
                        <span className={`text-sm ${style.color}`}>
                          {parseFloat(change.changePercent) > 0 ? '+' : ''}
                          {parseFloat(change.changePercent).toFixed(1)}%
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
