import { ChartArea, Box, History, TrendingUp, Package, Layers, Building2, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { type MaterialWithHistory } from "@shared/schema";

export function SidebarNavigation() {
  const { data: materials = [] } = useQuery<MaterialWithHistory[]>({
    queryKey: ["/api/materials"],
  });

  // Count materials by category
  const categoryCounts = materials.reduce((acc, material) => {
    acc[material.productCategory] = (acc[material.productCategory] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const navItems = [
    { 
      icon: ChartArea, 
      label: "Dashboard", 
      active: true,
      href: "#"
    },
    { 
      icon: Box, 
      label: "Materials", 
      href: "#"
    },
    { 
      icon: History, 
      label: "Price History", 
      href: "#"
    },
    { 
      icon: TrendingUp, 
      label: "Analytics", 
      href: "#"
    },
  ];

  const categoryItems = [
    { label: "Shingles", icon: Layers, count: categoryCounts["Shingle"] || 0 },
    { label: "Accessories", icon: Package, count: categoryCounts["Accessory"] || 0 },
    { label: "Decking", icon: Building2, count: categoryCounts["Decking"] || 0 },
    { label: "Underlayment", icon: Layers, count: categoryCounts["Underlayment"] || 0 },
    { label: "Ventilation", icon: Wrench, count: categoryCounts["Ventilation"] || 0 },
    { label: "Flashing", icon: Package, count: categoryCounts["Flashing"] || 0 },
    { label: "Garage Door", icon: Building2, count: categoryCounts["Garage Door"] || 0 },
    { label: "Door Motor", icon: Wrench, count: categoryCounts["Door Motor"] || 0 },
  ];

  return (
    <aside className="w-64 glass border-r border-aurora-purple/30 p-6 hidden lg:block">
      <nav className="space-y-2">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
          Navigation
        </div>
        
        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
              item.active
                ? "bg-aurora-purple/20 text-aurora-cyan border border-aurora-cyan/30"
                : "text-gray-300 hover:bg-aurora-purple/10 hover:text-white"
            }`}
          >
            <item.icon className="mr-3 h-4 w-4" />
            {item.label}
          </a>
        ))}
        
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 mt-8">
          Categories
        </div>
        
        <div className="space-y-1 text-sm">
          {categoryItems.map((category) => (
            <div key={category.label} className="flex items-center justify-between px-3 py-1 hover:bg-aurora-purple/5 rounded transition-colors">
              <div className="flex items-center space-x-2">
                <category.icon className="h-3 w-3 text-gray-500" />
                <span className="text-gray-400">{category.label}</span>
              </div>
              <Badge 
                variant="outline" 
                className="text-aurora-cyan border-aurora-cyan/30 text-xs"
              >
                {category.count}
              </Badge>
            </div>
          ))}
        </div>
      </nav>
    </aside>
  );
}
