import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Package, TrendingUp, Clock, AlertTriangle } from "lucide-react";
import { type DashboardStats as StatsType } from "@shared/schema";

export function DashboardStats() {
  const { data: stats, isLoading } = useQuery<StatsType>({
    queryKey: ["/api/dashboard/stats"],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="glass border-aurora-purple/20">
            <CardContent className="p-6 flex items-center justify-center">
              <LoadingSpinner className="h-6 w-6 text-aurora-cyan" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    {
      title: "Total Materials",
      value: stats.totalMaterials.toString(),
      change: "+3 this week",
      icon: Package,
      borderColor: "border-aurora-cyan/20",
      iconColor: "text-aurora-cyan",
      changeColor: "text-aurora-green"
    },
    {
      title: "Avg. Price Change",
      value: `${stats.avgPriceChange >= 0 ? '+' : ''}${stats.avgPriceChange.toFixed(1)}%`,
      change: "vs last month",
      icon: TrendingUp,
      borderColor: "border-aurora-teal/20",
      iconColor: "text-aurora-teal",
      changeColor: stats.avgPriceChange >= 0 ? "text-aurora-green" : "text-aurora-red"
    },
    {
      title: "Recent Updates",
      value: stats.recentUpdates.toString(),
      change: "last 24 hours",
      icon: Clock,
      borderColor: "border-aurora-yellow/20",
      iconColor: "text-aurora-yellow",
      changeColor: "text-aurora-yellow"
    },
    {
      title: "Pending Requests",
      value: stats.pendingRequests.toString(),
      change: "requires approval",
      icon: AlertTriangle,
      borderColor: "border-aurora-coral/20",
      iconColor: "text-aurora-coral",
      changeColor: "text-aurora-coral"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {statCards.map((stat) => (
        <Card 
          key={stat.title} 
          className={`glass rounded-xl border ${stat.borderColor} hover-glow material-card`}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-300">{stat.title}</h3>
              <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
            </div>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <div className={`text-xs ${stat.changeColor}`}>{stat.change}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
