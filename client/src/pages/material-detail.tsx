import { useState } from "react";
import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Building2, MapPin, Calendar, TrendingUp, TrendingDown } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import type { Material, PriceHistory } from "@shared/schema";

const timeRangeOptions = [
  { label: "7D", value: "7d" },
  { label: "1M", value: "1m" },
  { label: "3M", value: "3m" },
  { label: "1Y", value: "1y" },
] as const;

type TimeRange = (typeof timeRangeOptions)[number]["value"];

export default function MaterialDetail() {
  const [, params] = useRoute("/material/:id");
  const materialId = params?.id;
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>("3m");

  const { data: material, isLoading: materialLoading } = useQuery<Material>({
    queryKey: ["/api/materials", materialId],
    enabled: !!materialId,
  });

  const { data: priceHistory, isLoading: historyLoading } = useQuery<PriceHistory[]>({
    queryKey: ["/api/price-history", materialId, selectedTimeRange],
    enabled: !!materialId,
  });

  if (materialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner className="h-8 w-8" />
      </div>
    );
  }

  if (!material) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="glass border-aurora-purple/30 p-8">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-white mb-2">Material Not Found</h2>
            <p className="text-gray-300 mb-4">The requested material could not be found.</p>
            <Link href="/materials">
              <Button className="bg-aurora-cyan hover:bg-aurora-bright-cyan text-aurora-navy">
                Back to Materials
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  const currentPrice = parseFloat(material.currentPrice);
  const previousPrice = material.previousPrice ? parseFloat(material.previousPrice) : currentPrice;
  const priceChange = currentPrice - previousPrice;
  const priceChangePercent = previousPrice > 0 ? ((priceChange / previousPrice) * 100) : 0;
  const isPositiveChange = priceChange >= 0;

  // Prepare chart data
  const chartData = priceHistory?.map(history => ({
    date: new Date(history.submittedAt || '').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    price: parseFloat(history.newPrice || '0'),
    timestamp: history.submittedAt
  })) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-aurora-navy via-aurora-purple to-aurora-violet p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/materials">
            <Button variant="ghost" size="sm" className="text-aurora-cyan hover:text-aurora-bright-cyan hover:bg-aurora-purple/20">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">{material.name}</h1>
            <p className="text-aurora-cyan font-medium">{material.distributor} • {material.tickerSymbol}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Current Price Card */}
          <Card className="glass border-aurora-purple/30">
            <CardHeader>
              <CardTitle className="text-aurora-cyan flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Current Price
              </CardTitle>
              <div className="text-sm text-gray-300">Per unit pricing</div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white mb-2">
                ${currentPrice.toFixed(2)}
              </div>
              <div className="text-sm text-gray-300">
                Last updated: {new Date(material.lastUpdated || '').toLocaleDateString()}
              </div>
            </CardContent>
          </Card>

          {/* Material Details Card */}
          <Card className="glass border-aurora-purple/30">
            <CardHeader>
              <CardTitle className="text-aurora-cyan">Material Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-aurora-green"></div>
                <span className="text-gray-300">Category</span>
              </div>
              <Badge variant="secondary" className="bg-aurora-purple/20 text-white border-aurora-purple/30">
                {material.productCategory}
              </Badge>

              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-aurora-cyan" />
                <span className="text-gray-300">Manufacturer</span>
              </div>
              <div className="text-white font-medium">{material.manufacturer}</div>

              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-aurora-cyan" />
                <span className="text-gray-300">Available Locations</span>
              </div>
              <Badge variant="outline" className="border-aurora-teal text-aurora-teal">
                {material.location}
              </Badge>

              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-aurora-cyan" />
                <span className="text-gray-300">Added</span>
              </div>
              <div className="text-white font-medium">
                {new Date(material.lastUpdated || '').toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </CardContent>
          </Card>

          {/* Price Change Summary */}
          <Card className="glass border-aurora-purple/30">
            <CardHeader>
              <CardTitle className="text-aurora-cyan flex items-center gap-2">
                {isPositiveChange ? (
                  <TrendingUp className="h-5 w-5 text-aurora-green" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-aurora-red" />
                )}
                Price Change
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold mb-2 ${isPositiveChange ? 'text-aurora-green' : 'text-aurora-red'}`}>
                {isPositiveChange ? '+' : ''}${priceChange.toFixed(2)}
              </div>
              <div className={`text-sm ${isPositiveChange ? 'text-aurora-green' : 'text-aurora-red'}`}>
                {isPositiveChange ? '▲' : '▼'} {Math.abs(priceChangePercent).toFixed(2)}%
              </div>
              <div className="text-xs text-gray-400 mt-2">
                Since last update
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Price History Chart */}
        <Card className="glass border-aurora-purple/30 mt-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-aurora-cyan flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                {material.name} - Price History
              </CardTitle>
              <div className="flex gap-2">
                {timeRangeOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={selectedTimeRange === option.value ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setSelectedTimeRange(option.value)}
                    className={selectedTimeRange === option.value 
                      ? "bg-aurora-cyan text-aurora-navy font-medium" 
                      : "text-aurora-cyan hover:text-aurora-bright-cyan hover:bg-aurora-purple/20"
                    }
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
            <div className="text-sm text-gray-300">Price History - {selectedTimeRange.toUpperCase()}</div>
          </CardHeader>
          <CardContent>
            {historyLoading ? (
              <div className="h-64 flex items-center justify-center">
                <LoadingSpinner className="h-6 w-6" />
              </div>
            ) : chartData.length > 0 ? (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis 
                      dataKey="date" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(37, 22, 84, 0.9)',
                        borderColor: 'rgba(71, 255, 191, 0.3)',
                        borderRadius: '8px',
                        color: 'white'
                      }}
                      formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="price" 
                      stroke="hsl(162, 100%, 64%)"
                      strokeWidth={3}
                      dot={{ fill: 'hsl(162, 100%, 64%)', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, fill: 'hsl(162, 100%, 64%)' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 text-aurora-purple mx-auto mb-4" />
                  <p className="text-gray-300">No price history available for this time period</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}