import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { 
  LayoutDashboard, 
  TrendingUp, 
  TrendingDown, 
  Building2, 
  MapPin, 
  DollarSign,
  Warehouse,
  Activity,
  Target
} from "lucide-react";
import { type Material, type PriceHistory, type DashboardStats, type LocationPerformance, type DistributorPerformance } from "@shared/schema";

interface WallDisplayViewProps {
  onExitDisplayView: () => void;
}

type RecentChange = PriceHistory & { material: Material };

export function WallDisplayView({ onExitDisplayView }: WallDisplayViewProps) {
  const [currentSection, setCurrentSection] = useState(0);
  const [progress, setProgress] = useState(0);

  // Auto-advance sections every 10 seconds
  const SECTION_DURATION = 10000;
  const sections = ['overview', 'distributors', 'locations', 'materials', 'recent-changes', 'trends'];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSection(prev => (prev + 1) % sections.length);
      setProgress(0);
    }, SECTION_DURATION);

    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + 1, 100));
    }, SECTION_DURATION / 100);

    return () => {
      clearInterval(interval);
      clearInterval(progressInterval);
    };
  }, [sections.length]);

  // Data queries
  const { data: stats } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: materials = [] } = useQuery<Material[]>({
    queryKey: ["/api/materials"],
  });

  const { data: recentChanges = [] } = useQuery<RecentChange[]>({
    queryKey: ["/api/price-changes/recent"],
    select: (data) => data.slice(0, 10),
  });

  const { data: locationPerformance = [] } = useQuery<LocationPerformance[]>({
    queryKey: ["/api/dashboard/location-performance"],
  });

  const { data: distributorPerformance = [] } = useQuery<DistributorPerformance[]>({
    queryKey: ["/api/dashboard/distributor-performance"],
  });

  // Wall Display Sections
  const OverviewSection = () => (
    <div className="grid grid-cols-2 gap-12 h-full">
      {/* Left side - Key Stats */}
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-8xl font-bold text-white mb-4">CMAC</h1>
          <h2 className="text-4xl text-aurora-cyan font-medium">Material Pricing Dashboard</h2>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <Card className="glass border-aurora-green/30 bg-aurora-navy/40">
            <CardContent className="p-8 text-center">
              <Warehouse className="h-16 w-16 text-aurora-green mx-auto mb-4" />
              <div className="text-5xl font-bold text-white mb-2">{stats?.totalMaterials || 0}</div>
              <div className="text-2xl text-aurora-green">Total Materials</div>
            </CardContent>
          </Card>

          <Card className="glass border-aurora-purple/30 bg-aurora-navy/40">
            <CardContent className="p-8 text-center">
              <Activity className="h-16 w-16 text-aurora-purple mx-auto mb-4" />
              <div className="text-5xl font-bold text-white mb-2">
                {stats?.avgPriceChange ? `${stats.avgPriceChange > 0 ? '+' : ''}${stats.avgPriceChange.toFixed(1)}%` : '0%'}
              </div>
              <div className="text-2xl text-aurora-purple">Avg Price Change</div>
            </CardContent>
          </Card>

          <Card className="glass border-aurora-cyan/30 bg-aurora-navy/40">
            <CardContent className="p-8 text-center">
              <Target className="h-16 w-16 text-aurora-cyan mx-auto mb-4" />
              <div className="text-5xl font-bold text-white mb-2">{recentChanges.length}</div>
              <div className="text-2xl text-aurora-cyan">Recent Changes</div>
            </CardContent>
          </Card>

          <Card className="glass border-aurora-yellow/30 bg-aurora-navy/40">
            <CardContent className="p-8 text-center">
              <Building2 className="h-16 w-16 text-aurora-yellow mx-auto mb-4" />
              <div className="text-5xl font-bold text-white mb-2">{locationPerformance.length}</div>
              <div className="text-2xl text-aurora-yellow">Active Locations</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right side - Live Data */}
      <div className="space-y-8">
        <Card className="glass border-aurora-green/30 bg-aurora-navy/20">
          <CardHeader>
            <CardTitle className="text-3xl text-white flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-aurora-green" />
              Recent Price Changes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {recentChanges.slice(0, 6).map((change) => (
              <div key={change.id} className="flex items-center justify-between p-4 bg-aurora-navy/30 rounded-lg">
                <div>
                  <div className="text-2xl font-medium text-white">{change.material.name}</div>
                  <div className="text-xl text-gray-300">{change.material.distributor}</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">${parseFloat(change.newPrice).toFixed(2)}</div>
                  {change.changePercent && (
                    <div className={`text-xl font-semibold ${
                      parseFloat(change.changePercent) > 0 ? 'text-aurora-green' : 'text-aurora-red'
                    }`}>
                      {parseFloat(change.changePercent) > 0 ? '+' : ''}
                      {parseFloat(change.changePercent).toFixed(1)}%
                    </div>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const DistributorSection = () => (
    <div className="h-full flex flex-col">
      <div className="text-center mb-8">
        <h2 className="text-6xl font-bold text-white mb-4">Distributor Performance</h2>
        <p className="text-2xl text-aurora-cyan">Price change trends by distributor</p>
      </div>

      <div className="flex-1 grid grid-cols-3 gap-8">
        {distributorPerformance.slice(0, 6).map((dist, index) => (
          <Card key={dist.distributor} className="glass border-aurora-purple/30 bg-aurora-navy/20">
            <CardContent className="p-8 text-center">
              <Building2 className="h-16 w-16 text-aurora-purple mx-auto mb-6" />
              <div className="text-3xl font-bold text-white mb-4">{dist.distributor}</div>
              <div className="text-6xl font-bold mb-4" style={{
                color: dist.changePercent > 0 ? '#10b981' : 
                       dist.changePercent < 0 ? '#ef4444' : '#6b7280'
              }}>
                {dist.changePercent > 0 ? '+' : ''}{dist.changePercent.toFixed(1)}%
              </div>
              <div className="text-2xl text-gray-300">Avg Change</div>
              <div className="text-xl text-gray-400 mt-2">{dist.materialCount} materials</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const LocationSection = () => (
    <div className="h-full flex flex-col">
      <div className="text-center mb-8">
        <h2 className="text-6xl font-bold text-white mb-4">Location Performance</h2>
        <p className="text-2xl text-aurora-cyan">Regional price trends and activity</p>
      </div>

      <div className="flex-1 grid grid-cols-3 gap-8">
        {locationPerformance.slice(0, 6).map((loc, index) => (
          <Card key={loc.location} className="glass border-aurora-green/30 bg-aurora-navy/20">
            <CardContent className="p-8 text-center">
              <MapPin className="h-16 w-16 text-aurora-green mx-auto mb-6" />
              <div className="text-4xl font-bold text-white mb-4">{loc.location}</div>
              <div className="text-6xl font-bold mb-4" style={{
                color: loc.changePercent > 0 ? '#10b981' : 
                       loc.changePercent < 0 ? '#ef4444' : '#6b7280'
              }}>
                {loc.changePercent > 0 ? '+' : ''}{loc.changePercent.toFixed(1)}%
              </div>
              <div className="text-2xl text-gray-300">Avg Change</div>
              <div className="text-xl text-gray-400 mt-2">{loc.materialCount} materials</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const MaterialsSection = () => (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="text-center mb-6">
        <h2 className="text-5xl font-bold text-white mb-3">Top Materials by Value</h2>
        <p className="text-xl text-aurora-cyan">Highest value materials and recent changes</p>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-4 overflow-hidden">
        {materials
          .sort((a, b) => parseFloat(b.currentPrice) - parseFloat(a.currentPrice))
          .slice(0, 6)
          .map((material) => (
          <div key={material.id} className="flex items-center justify-between p-4 bg-aurora-navy/20 rounded-lg glass border-aurora-cyan/20 min-h-0">
            <div className="flex items-center space-x-4 flex-1 min-w-0">
              <Warehouse className="h-10 w-10 text-aurora-cyan flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="text-2xl font-medium text-white truncate">{material.name}</div>
                <div className="text-lg text-gray-300 truncate">{material.distributor} • {material.location}</div>
                <div className="text-base text-gray-400 truncate">{material.productCategory}</div>
              </div>
            </div>
            <div className="text-right flex-shrink-0 ml-4">
              <div className="text-3xl font-bold text-white">${parseFloat(material.currentPrice).toFixed(2)}</div>
              <div className="text-lg text-aurora-cyan">{material.tickerSymbol}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const RecentChangesSection = () => (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="text-center mb-6">
        <h2 className="text-5xl font-bold text-white mb-3">Most Recent Price Changes</h2>
        <p className="text-xl text-aurora-cyan">Latest price updates and market movements</p>
      </div>

      <div className="flex-1 space-y-4 overflow-hidden">
        {recentChanges.slice(0, 8).map((change, index) => (
          <div key={change.id} className="flex items-center justify-between p-5 bg-aurora-navy/20 rounded-lg glass border-aurora-green/20">
            <div className="flex items-center space-x-6 flex-1 min-w-0">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-aurora-cyan/20 flex items-center justify-center">
                  <span className="text-2xl font-bold text-aurora-cyan">#{index + 1}</span>
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-2xl font-medium text-white truncate">{change.material.name}</div>
                <div className="text-lg text-gray-300 truncate">{change.material.distributor} • {change.material.location}</div>
                <div className="text-base text-gray-400">
                  {new Date(change.submittedAt || '').toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>
            <div className="text-right flex-shrink-0 ml-6">
              <div className="text-3xl font-bold text-white">${parseFloat(change.newPrice).toFixed(2)}</div>
              {change.changePercent && (
                <div className={`text-2xl font-semibold flex items-center justify-end gap-2 ${
                  parseFloat(change.changePercent) > 0 ? 'text-aurora-green' : 'text-aurora-red'
                }`}>
                  {parseFloat(change.changePercent) > 0 ? <TrendingUp className="h-6 w-6" /> : <TrendingDown className="h-6 w-6" />}
                  {parseFloat(change.changePercent) > 0 ? '+' : ''}
                  {parseFloat(change.changePercent).toFixed(1)}%
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const TrendsSection = () => {
    // Generate trend data for display
    const trendData = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        materials: Math.floor(Math.random() * 20) + 80,
        avgChange: (Math.random() * 4 - 2).toFixed(1),
      };
    });

    return (
      <div className="h-full flex flex-col overflow-hidden">
        <div className="text-center mb-6">
          <h2 className="text-5xl font-bold text-white mb-3">Market Trends</h2>
          <p className="text-xl text-aurora-cyan">30-day material pricing trends</p>
        </div>

        <div className="flex-1 min-h-0">
          <Card className="glass border-aurora-purple/30 bg-aurora-navy/10 h-full">
            <CardContent className="p-6 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#9CA3AF" 
                    fontSize={14}
                    tick={{ fontSize: 14 }}
                  />
                  <YAxis 
                    stroke="#9CA3AF" 
                    fontSize={14}
                    tick={{ fontSize: 14 }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #6366f1',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="materials" 
                    stroke="#06b6d4" 
                    strokeWidth={3}
                    dot={{ fill: '#06b6d4', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const renderSection = () => {
    switch (sections[currentSection]) {
      case 'overview': return <OverviewSection />;
      case 'distributors': return <DistributorSection />;
      case 'locations': return <LocationSection />;
      case 'materials': return <MaterialsSection />;
      case 'recent-changes': return <RecentChangesSection />;
      case 'trends': return <TrendsSection />;
      default: return <OverviewSection />;
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-aurora-navy via-aurora-purple to-aurora-violet overflow-hidden">
      {/* Exit Button */}
      <Button
        onClick={onExitDisplayView}
        className="absolute top-6 right-6 z-50 bg-aurora-red hover:bg-aurora-bright-red text-white font-medium px-6 py-3 text-xl"
        data-testid="button-exit-display-view"
      >
        <LayoutDashboard className="h-6 w-6 mr-2" />
        Exit Display View
      </Button>

      {/* Progress Bar */}
      <div className="absolute top-0 left-0 w-full h-2 bg-aurora-navy/50 z-40">
        <div 
          className="h-full bg-aurora-cyan transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Section Indicator */}
      <div className="absolute top-6 left-6 z-50">
        <div className="flex space-x-3">
          {sections.map((section, index) => (
            <div
              key={section}
              className={`w-4 h-4 rounded-full transition-all duration-300 ${
                index === currentSection 
                  ? 'bg-aurora-cyan scale-125' 
                  : index < currentSection 
                    ? 'bg-aurora-green' 
                    : 'bg-aurora-navy/50'
              }`}
            />
          ))}
        </div>
        <div className="text-xl text-white mt-2 capitalize font-medium">
          {sections[currentSection]} Section
        </div>
      </div>

      {/* Main Content */}
      <div className="h-full w-full p-8 pt-16 pb-16 overflow-hidden">
        <div className="h-full max-h-full">
          {renderSection()}
        </div>
      </div>

      {/* Company Branding */}
      <div className="absolute bottom-6 left-6 text-aurora-cyan">
        <div className="text-2xl font-bold">CMAC Material Tracker</div>
        <div className="text-xl">Real-time Construction Material Pricing</div>
      </div>

      {/* Timestamp */}
      <div className="absolute bottom-6 right-6 text-aurora-cyan">
        <div className="text-xl">Last Updated: {new Date().toLocaleString()}</div>
      </div>
    </div>
  );
}