import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search } from "lucide-react";
import { type MaterialWithHistory } from "@shared/schema";

export function MaterialsDataTable() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: materials = [], isLoading } = useQuery<MaterialWithHistory[]>({
    queryKey: ["/api/materials"],
  });

  const filteredMaterials = materials.filter(material =>
    material.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    material.distributor.toLowerCase().includes(searchQuery.toLowerCase()) ||
    material.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getChangeColor = (direction?: 'up' | 'down' | 'new') => {
    switch (direction) {
      case 'up': return 'text-aurora-green';
      case 'down': return 'text-aurora-red';
      case 'new': return 'text-aurora-yellow';
      default: return 'text-gray-300';
    }
  };

  const formatChange = (changePercent?: number, direction?: 'up' | 'down' | 'new') => {
    if (direction === 'new') return 'NEW';
    if (!changePercent) return '';
    const sign = changePercent > 0 ? '+' : '';
    return `${sign}${changePercent.toFixed(1)}%`;
  };

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const updateDate = new Date(date);
    const diffMs = now.getTime() - updateDate.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 60) return `${diffMins} min ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const getTickerColor = (ticker: string) => {
    const colors = {
      "ABC": "bg-aurora-cyan/20 text-aurora-cyan",
      "QXO": "bg-aurora-teal/20 text-aurora-teal",
      "SRS": "bg-aurora-purple/20 text-aurora-purple",
      "CDH": "bg-aurora-blue/20 text-aurora-blue",
      "OTH": "bg-aurora-magenta/20 text-aurora-magenta"
    };
    return colors[ticker as keyof typeof colors] || "bg-gray-500/20 text-gray-300";
  };

  return (
    <Card className="glass rounded-xl border-aurora-purple/20 mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold text-white">
            All Materials
          </CardTitle>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Input
                type="text"
                placeholder="Search materials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 bg-aurora-navy/50 border-aurora-purple/30 text-white placeholder-gray-400 focus:border-aurora-cyan focus:ring-aurora-cyan/20"
              />
              <Button
                size="sm"
                className="bg-aurora-blue hover:bg-aurora-sky text-white"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <LoadingSpinner className="h-8 w-8 text-aurora-cyan" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-aurora-purple/30 hover:bg-transparent">
                  <TableHead className="text-gray-300 font-semibold">Material</TableHead>
                  <TableHead className="text-gray-300 font-semibold">Distributor</TableHead>
                  <TableHead className="text-gray-300 font-semibold">Location</TableHead>
                  <TableHead className="text-gray-300 font-semibold text-right">Price</TableHead>
                  <TableHead className="text-gray-300 font-semibold text-right">Change</TableHead>
                  <TableHead className="text-gray-300 font-semibold text-right">Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMaterials.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-400">
                      No materials found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMaterials.map((material) => (
                    <TableRow
                      key={material.id}
                      className="border-b border-aurora-navy/20 hover:bg-aurora-purple/5 transition-colors"
                    >
                      <TableCell>
                        <div>
                          <div className="font-medium text-white">{material.name}</div>
                          <div className="text-xs text-gray-400">{material.productCategory}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getTickerColor(material.tickerSymbol)} font-medium border-0`}>
                          {material.tickerSymbol}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-300">{material.location}</TableCell>
                      <TableCell className="text-right font-semibold text-white">
                        ${parseFloat(material.currentPrice).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={`font-semibold ${getChangeColor(material.changeDirection)}`}>
                          {formatChange(material.changePercent, material.changeDirection)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right text-gray-400 text-xs">
                        {formatTimeAgo(material.lastUpdated.toString())}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
