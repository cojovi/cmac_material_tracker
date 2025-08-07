import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { HeaderNavigation } from "@/components/dashboard/header-navigation";
import { ScrollingTicker } from "@/components/dashboard/scrolling-ticker";
import { SidebarNavigation } from "@/components/dashboard/sidebar-navigation";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { PriceTrendsChart } from "@/components/dashboard/price-trends-chart";
import { DistributorTrendsChart } from "@/components/dashboard/distributor-trends-chart";
import { RecentPriceChanges } from "@/components/dashboard/recent-price-changes";
import { PerformanceMetrics } from "@/components/dashboard/performance-metrics";
import { LocationAnalysis } from "@/components/dashboard/location-analysis";
import { MaterialsDataTable } from "@/components/dashboard/materials-data-table";
import { PriceChangeRequestForm } from "@/components/dashboard/price-change-request-form";
import { AdminPriceChangeModal } from "@/components/dashboard/admin-price-change-modal";
import { WallDisplayView } from "@/components/dashboard/wall-display-view";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { Monitor, LayoutDashboard } from "lucide-react";

export default function Dashboard() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [isDisplayView, setIsDisplayView] = useState(false);

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

  // Display View Mode - Full screen wall display
  if (isDisplayView) {
    return <WallDisplayView onExitDisplayView={() => setIsDisplayView(false)} />;
  }

  return (
    <div className="min-h-screen">
      <HeaderNavigation />
      <ScrollingTicker />
      
      <div className="flex min-h-screen">
        <SidebarNavigation />
        
        <main className="flex-1 p-6 overflow-auto custom-scrollbar">
          {/* Display View Toggle Button */}
          <div className="mb-6 flex justify-end">
            <Button
              onClick={() => setIsDisplayView(true)}
              className="bg-aurora-purple hover:bg-aurora-bright-purple text-white font-medium flex items-center gap-2"
              data-testid="button-display-view"
            >
              <Monitor className="h-4 w-4" />
              DisplayView
            </Button>
          </div>

          <DashboardStats />
          
          {/* Distributor Trends Chart - New chart showing distributor price change rates */}
          <div className="mb-6">
            <DistributorTrendsChart />
          </div>
          
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
            <div className="xl:col-span-2">
              <PriceTrendsChart />
            </div>
            <RecentPriceChanges />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <PerformanceMetrics />
            <LocationAnalysis />
          </div>

          <MaterialsDataTable />
          
          <div className="mt-6">
            <PriceChangeRequestForm />
          </div>
        </main>
      </div>
      
      <AdminPriceChangeModal />
    </div>
  );
}
