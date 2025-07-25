import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { HeaderNavigation } from "@/components/dashboard/header-navigation";
import { SidebarNavigation } from "@/components/dashboard/sidebar-navigation";
import { PriceTrendsChart } from "@/components/dashboard/price-trends-chart";
import { DistributorTrendsChart } from "@/components/dashboard/distributor-trends-chart";
import { RecentPriceChanges } from "@/components/dashboard/recent-price-changes";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { History, TrendingUp, TrendingDown } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { type PriceHistory, type Material } from "@shared/schema";

export default function PriceHistoryPage() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  const { data: allPriceHistory = [], isLoading: historyLoading } = useQuery<(PriceHistory & { material: Material })[]>({
    queryKey: ["/api/price-changes/recent"],
    select: (data) => data.slice(0, 50), // Use recent changes as price history for now
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner className="h-8 w-8 text-aurora-cyan" />
      </div>
    );
  }

  if (!user) {
    setLocation("/login");
    return null;
  }

  const formatTimeAgo = (date: string | Date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  const getChangeStyle = (changePercent?: string) => {
    if (!changePercent) return { color: "text-gray-400", icon: null };
    const change = parseFloat(changePercent);
    if (change > 0) return { 
      color: "text-aurora-green", 
      icon: <TrendingUp className="h-4 w-4" /> 
    };
    if (change < 0) return { 
      color: "text-aurora-red", 
      icon: <TrendingDown className="h-4 w-4" /> 
    };
    return { color: "text-gray-400", icon: null };
  };

  return (
    <div className="min-h-screen">
      <HeaderNavigation />
      
      <div className="flex min-h-screen">
        <SidebarNavigation />
        
        <main className="flex-1 p-6 overflow-auto custom-scrollbar">
          <Card className="glass rounded-xl border-aurora-green/20 mb-6">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-white flex items-center">
                <History className="mr-3 text-aurora-purple" />
                Price History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Track all price changes and trends across materials and locations.
              </p>
            </CardContent>
          </Card>

          {/* Distributor Trends Chart - New chart showing distributor price change rates */}
          <div className="mb-6">
            <DistributorTrendsChart />
          </div>

          {/* Material Price Trends Chart - Moved down as requested */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
            <div className="xl:col-span-2">
              <PriceTrendsChart />
            </div>
            <RecentPriceChanges />
          </div>

          <Card className="glass rounded-xl border-aurora-purple/20">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-white">
                Complete Price History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {historyLoading ? (
                <div className="flex items-center justify-center py-8">
                  <LoadingSpinner className="h-6 w-6 text-aurora-cyan" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-aurora-navy/20">
                      <TableHead className="text-gray-300 font-semibold">Material</TableHead>
                      <TableHead className="text-gray-300 font-semibold">Price Change</TableHead>
                      <TableHead className="text-gray-300 font-semibold text-right">% Change</TableHead>
                      <TableHead className="text-gray-300 font-semibold">Status</TableHead>
                      <TableHead className="text-gray-300 font-semibold text-right">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allPriceHistory.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-gray-400">
                          No price history found
                        </TableCell>
                      </TableRow>
                    ) : (
                      allPriceHistory.map((record) => {
                        const changeStyle = getChangeStyle(record.changePercent || undefined);
                        return (
                          <TableRow
                            key={record.id}
                            className="border-b border-aurora-navy/20 hover:bg-aurora-purple/5"
                          >
                            <TableCell>
                              <div>
                                <div className="font-medium text-white">{record.material.name}</div>
                                <div className="text-xs text-gray-400">
                                  {record.material.distributor} • {record.material.location}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-white">
                                {record.oldPrice && (
                                  <span className="text-gray-400">${parseFloat(record.oldPrice).toFixed(2)} → </span>
                                )}
                                <span className="font-semibold">${parseFloat(record.newPrice).toFixed(2)}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              {record.changePercent && (
                                <div className={`flex items-center justify-end gap-1 ${changeStyle.color}`}>
                                  {changeStyle.icon}
                                  <span className="font-semibold">
                                    {parseFloat(record.changePercent) > 0 ? '+' : ''}
                                    {parseFloat(record.changePercent).toFixed(1)}%
                                  </span>
                                </div>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant="outline"
                                className={`${
                                  record.status === 'approved' 
                                    ? 'text-aurora-green border-aurora-green' 
                                    : record.status === 'rejected'
                                    ? 'text-aurora-red border-aurora-red'
                                    : 'text-aurora-yellow border-aurora-yellow'
                                }`}
                              >
                                {record.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right text-gray-400 text-xs">
                              {formatTimeAgo(record.submittedAt)}
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}