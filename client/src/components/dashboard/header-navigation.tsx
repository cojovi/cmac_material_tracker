import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { ChartLine, RefreshCw, Edit, LogOut, User } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function HeaderNavigation() {
  const { user, logout, isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const refreshMutation = useMutation({
    mutationFn: async () => {
      // Refresh all dashboard data
      await queryClient.invalidateQueries();
      setLastUpdate(new Date());
    },
  });

  const openPriceChangeModal = () => {
    const event = new CustomEvent('openEditPriceModal');
    document.dispatchEvent(event);
  };

  return (
    <header className="glass border-b border-aurora-purple/30 sticky top-0 z-50">
      <div className="max-w-full px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-2xl font-bold text-aurora-cyan flex items-center">
              <ChartLine className="mr-2" />
              CMACMaterialTracker
            </div>
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-300">
              <span>Last Update:</span>
              <span className="text-aurora-yellow">
                {lastUpdate.toLocaleTimeString('en-US', { 
                  hour: 'numeric', 
                  minute: '2-digit',
                  hour12: true 
                })} CST
              </span>
              <Button
                size="sm"
                variant="outline"
                className="ml-2 border-aurora-blue/50 hover:bg-aurora-blue/20 text-aurora-blue hover:text-white"
                onClick={() => refreshMutation.mutate()}
                disabled={refreshMutation.isPending}
              >
                <RefreshCw className={`mr-1 h-3 w-3 ${refreshMutation.isPending ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 text-sm">
              <div className="w-2 h-2 bg-aurora-green rounded-full animate-pulse-slow"></div>
              <span className="text-gray-300">Live Data</span>
            </div>
            
            {isAdmin && (
              <Button
                className="bg-aurora-coral hover:bg-aurora-red text-white font-semibold"
                onClick={openPriceChangeModal}
              >
                <Edit className="mr-2 h-4 w-4" />
                Price Change
              </Button>
            )}
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-aurora-purple rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="hidden sm:block">
                  <span className="text-sm text-white">{user?.name}</span>
                  <Badge 
                    variant="outline" 
                    className="ml-2 text-xs border-aurora-cyan text-aurora-cyan"
                  >
                    {user?.role}
                  </Badge>
                </div>
              </div>
              
              <Button
                size="sm"
                variant="outline"
                className="border-gray-500 hover:bg-gray-700 text-gray-300 hover:text-white"
                onClick={logout}
              >
                <LogOut className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
