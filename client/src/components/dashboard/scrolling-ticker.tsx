import { useQuery } from "@tanstack/react-query";
import { type MaterialWithHistory } from "@shared/schema";

export function ScrollingTicker() {
  const { data: materials = [] } = useQuery<MaterialWithHistory[]>({
    queryKey: ["/api/materials"],
  });

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

  return (
    <div className="ticker-container py-2 border-b border-aurora-purple/30">
      <div className="animate-ticker flex items-center space-x-8 text-sm font-medium">
        {materials.map((material, index) => (
          <div key={`${material.id}-${index}`} className="flex items-center space-x-2 whitespace-nowrap">
            <span className="text-aurora-cyan font-semibold">
              {material.tickerSymbol}
            </span>
            <span className="text-white truncate max-w-48">
              {material.name}
            </span>
            <span className="text-aurora-teal">
              ${parseFloat(material.currentPrice).toFixed(2)}
            </span>
            <span className={`text-xs ${getChangeColor(material.changeDirection)}`}>
              {formatChange(material.changePercent, material.changeDirection)}
            </span>
          </div>
        ))}
        
        {/* Duplicate items for seamless loop */}
        {materials.map((material, index) => (
          <div key={`${material.id}-dup-${index}`} className="flex items-center space-x-2 whitespace-nowrap">
            <span className="text-aurora-cyan font-semibold">
              {material.tickerSymbol}
            </span>
            <span className="text-white truncate max-w-48">
              {material.name}
            </span>
            <span className="text-aurora-teal">
              ${parseFloat(material.currentPrice).toFixed(2)}
            </span>
            <span className={`text-xs ${getChangeColor(material.changeDirection)}`}>
              {formatChange(material.changePercent, material.changeDirection)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
