import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { HeaderNavigation } from "@/components/dashboard/header-navigation";
import { SidebarNavigation } from "@/components/dashboard/sidebar-navigation";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { PriceTrendsChart } from "@/components/dashboard/price-trends-chart";
import { PerformanceMetrics } from "@/components/dashboard/performance-metrics";
import { LocationAnalysis } from "@/components/dashboard/location-analysis";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, BarChart3, PieChart } from "lucide-react";

export default function Analytics() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

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

  return (
    <div className="min-h-screen">
      <HeaderNavigation />
      
      <div className="flex min-h-screen">
        <SidebarNavigation />
        
        <main className="flex-1 p-6 overflow-auto custom-scrollbar">
          <Card className="glass rounded-xl border-aurora-green/20 mb-6">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-white flex items-center">
                <TrendingUp className="mr-3 text-aurora-yellow" />
                Analytics Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Comprehensive analytics and insights for material pricing trends, performance metrics, and market analysis.
              </p>
            </CardContent>
          </Card>

          <DashboardStats />
          
          <div className="grid grid-cols-1 xl:grid-cols-1 gap-6 mb-6">
            <PriceTrendsChart />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card className="glass rounded-xl border-aurora-cyan/20">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-white flex items-center">
                  <BarChart3 className="mr-2 text-aurora-cyan" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PerformanceMetrics />
              </CardContent>
            </Card>

            <Card className="glass rounded-xl border-aurora-purple/20">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-white flex items-center">
                  <PieChart className="mr-2 text-aurora-purple" />
                  Location Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <LocationAnalysis />
              </CardContent>
            </Card>
          </div>

          {/* Additional Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="glass rounded-xl border-aurora-green/20">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-white">
                  Market Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Weekly Volatility</span>
                    <span className="text-aurora-green font-semibold">+2.4%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Monthly Growth</span>
                    <span className="text-aurora-cyan font-semibold">+8.7%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Quarterly Outlook</span>
                    <span className="text-aurora-yellow font-semibold">Positive</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass rounded-xl border-aurora-yellow/20">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-white">
                  Top Performers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Shingles</span>
                    <span className="text-aurora-green">+12.3%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Underlayment</span>
                    <span className="text-aurora-green">+8.9%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Accessories</span>
                    <span className="text-aurora-green">+6.1%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass rounded-xl border-aurora-red/20">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-white">
                  Risk Indicators
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Price Volatility</span>
                    <span className="text-aurora-yellow">Medium</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Supply Chain</span>
                    <span className="text-aurora-green">Stable</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Market Confidence</span>
                    <span className="text-aurora-cyan">High</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}