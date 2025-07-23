import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useState, useMemo } from "react";
import { type MaterialWithHistory } from "@shared/schema";

export function PriceTrendsChart() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  const { data: materials = [], isLoading } = useQuery<MaterialWithHistory[]>({
    queryKey: ["/api/materials"],
  });

  const chartData = useMemo(() => {
    const filteredMaterials = selectedCategory === "all" 
      ? materials 
      : materials.filter(m => m.productCategory === selectedCategory);

    // Generate sample time series data for the last 30 days
    const days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });

    return days.map(day => {
      const dataPoint: any = { date: day };
      
      // Sample trending materials for chart
      const trendingMaterials = filteredMaterials.slice(0, 3);
      
      trendingMaterials.forEach((material, index) => {
        const basePrice = parseFloat(material.currentPrice);
        const variation = (Math.random() - 0.5) * basePrice * 0.1; // ±10% variation
        dataPoint[material.name] = Math.max(0, basePrice + variation);
      });
      
      return dataPoint;
    });
  }, [materials, selectedCategory]);

  const categories = ["all", ...Array.from(new Set(materials.map(m => m.productCategory)))];
  const trendingMaterials = materials.slice(0, 3);

  const chartColors = [
    'var(--aurora-cyan)',
    'var(--aurora-teal)', 
    'var(--aurora-blue)',
    'var(--aurora-green)',
    'var(--aurora-magenta)'
  ];

  return (
    <Card className="glass rounded-xl border-aurora-purple/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold text-white">
            Price Trends - Last 30 Days
          </CardTitle>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48 bg-aurora-navy/50 border-aurora-purple/30 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-aurora-navy border-aurora-purple/30">
              {categories.map(category => (
                <SelectItem 
                  key={category} 
                  value={category}
                  className="text-white hover:bg-aurora-purple/20 focus:bg-aurora-purple/20"
                >
                  {category === "all" ? "All Categories" : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="chart-container flex items-center justify-center">
            <LoadingSpinner className="h-8 w-8 text-aurora-cyan" />
          </div>
        ) : (
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="date" 
                  stroke="#ffffff"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#ffffff"
                  fontSize={12}
                  tickFormatter={(value) => `$${value.toFixed(0)}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--aurora-navy)',
                    border: '1px solid var(--aurora-cyan)',
                    borderRadius: '8px',
                    color: '#ffffff'
                  }}
                  formatter={(value: number) => [`$${value.toFixed(2)}`, '']}
                />
                <Legend />
                {trendingMaterials.map((material, index) => (
                  <Line
                    key={material.id}
                    type="monotone"
                    dataKey={material.name}
                    stroke={chartColors[index]}
                    strokeWidth={3}
                    dot={{ fill: chartColors[index], strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: chartColors[index], strokeWidth: 2 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
