import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { HeaderNavigation } from "@/components/dashboard/header-navigation";
import { SidebarNavigation } from "@/components/dashboard/sidebar-navigation";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, Clock, AlertCircle, Eye } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface PriceChangeRequest {
  id: number;
  materialName: string;
  distributor: string;
  requestedPrice: string;
  currentPrice: string;
  submittedBy: number;
  submittedAt: string;
  status: string;
  notes?: string;
  submittedUser: {
    id: number;
    name: string;
    email: string;
  };
}

export default function PendingRequests() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  const { data: requests = [], isLoading: requestsLoading } = useQuery({
    queryKey: ['/api/price-change-requests'],
    queryFn: async () => {
      const response = await fetch('/api/price-change-requests');
      if (!response.ok) throw new Error('Failed to fetch requests');
      return response.json() as Promise<PriceChangeRequest[]>;
    }
  });

  const approveMutation = useMutation({
    mutationFn: async (requestId: number) => {
      const response = await fetch(`/api/price-change-requests/${requestId}/approve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error('Failed to approve request');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Request Approved",
        description: "Price change request has been approved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/price-change-requests'] });
      queryClient.invalidateQueries({ queryKey: ['/api/materials'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error Approving Request",
        description: error.message || "Failed to approve price change request.",
        variant: "destructive"
      });
    }
  });

  const rejectMutation = useMutation({
    mutationFn: async (requestId: number) => {
      const response = await fetch(`/api/price-change-requests/${requestId}/reject`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error('Failed to reject request');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Request Rejected",
        description: "Price change request has been rejected.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/price-change-requests'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error Rejecting Request",
        description: error.message || "Failed to reject price change request.",
        variant: "destructive"
      });
    }
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-aurora-yellow border-aurora-yellow"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="text-aurora-green border-aurora-green"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="text-aurora-red border-aurora-red"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const pendingRequests = requests.filter(req => req.status === 'pending');
  const processedRequests = requests.filter(req => req.status !== 'pending');

  return (
    <div className="min-h-screen">
      <HeaderNavigation />
      
      <div className="flex min-h-screen">
        <SidebarNavigation />
        
        <main className="flex-1 p-6 overflow-auto custom-scrollbar">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
              <AlertCircle className="mr-3 text-aurora-coral" />
              Price Change Requests
            </h1>
            <p className="text-gray-400">Review and manage price change requests from team members</p>
          </div>

          {requestsLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner className="h-8 w-8 text-aurora-cyan" />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Pending Requests */}
              <Card className="glass rounded-xl border-aurora-coral/30 bg-gradient-to-br from-aurora-coral/20 to-aurora-purple/10">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-white flex items-center justify-between">
                    <span className="flex items-center">
                      <Clock className="mr-3 text-aurora-yellow" />
                      Pending Requests ({pendingRequests.length})
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {pendingRequests.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">No pending requests</p>
                  ) : (
                    <div className="space-y-4">
                      {pendingRequests.map((request) => (
                        <div key={request.id} className="bg-dark-card/50 border border-aurora-purple/30 rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                                <div>
                                  <label className="text-xs text-gray-400 uppercase tracking-wide">Material</label>
                                  <p className="text-white font-medium">{request.materialName}</p>
                                </div>
                                <div>
                                  <label className="text-xs text-gray-400 uppercase tracking-wide">Distributor</label>
                                  <p className="text-white">{request.distributor}</p>
                                </div>
                                <div>
                                  <label className="text-xs text-gray-400 uppercase tracking-wide">Price Change</label>
                                  <p className="text-white">
                                    {request.currentPrice && (
                                      <span className="text-gray-400">${request.currentPrice} → </span>
                                    )}
                                    <span className="text-aurora-green font-medium">${request.requestedPrice}</span>
                                  </p>
                                </div>
                                <div>
                                  <label className="text-xs text-gray-400 uppercase tracking-wide">Requested By</label>
                                  <p className="text-white">{request.submittedUser.name}</p>
                                  <p className="text-xs text-gray-400">{new Date(request.submittedAt).toLocaleDateString()}</p>
                                </div>
                              </div>
                              {request.notes && (
                                <div className="mb-4">
                                  <label className="text-xs text-gray-400 uppercase tracking-wide">Notes</label>
                                  <p className="text-gray-300 text-sm">{request.notes}</p>
                                </div>
                              )}
                            </div>
                            <div className="ml-4 flex items-center space-x-2">
                              {getStatusBadge(request.status)}
                            </div>
                          </div>
                          {user.role === 'admin' && request.status === 'pending' && (
                            <div className="flex items-center space-x-3 mt-4 pt-4 border-t border-aurora-purple/20">
                              <Button
                                onClick={() => approveMutation.mutate(request.id)}
                                disabled={approveMutation.isPending}
                                className="bg-aurora-green hover:bg-aurora-green/80 text-dark-navy"
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Approve
                              </Button>
                              <Button
                                onClick={() => rejectMutation.mutate(request.id)}
                                disabled={rejectMutation.isPending}
                                variant="outline"
                                className="border-aurora-red text-aurora-red hover:bg-aurora-red hover:text-white"
                              >
                                <XCircle className="w-4 h-4 mr-2" />
                                Reject
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Processed Requests */}
              <Card className="glass rounded-xl border-aurora-purple/30 bg-gradient-to-br from-aurora-purple/20 to-aurora-cyan/10">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-white flex items-center">
                    <Eye className="mr-3 text-aurora-cyan" />
                    Recent History ({processedRequests.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {processedRequests.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">No processed requests</p>
                  ) : (
                    <div className="space-y-3">
                      {processedRequests.slice(0, 10).map((request) => (
                        <div key={request.id} className="bg-dark-card/30 border border-aurora-purple/20 rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-4">
                                <div>
                                  <p className="text-white font-medium text-sm">{request.materialName}</p>
                                  <p className="text-xs text-gray-400">{request.distributor}</p>
                                </div>
                                <div>
                                  <p className="text-white text-sm">
                                    {request.currentPrice && (
                                      <span className="text-gray-400">${request.currentPrice} → </span>
                                    )}
                                    <span className="text-aurora-green">${request.requestedPrice}</span>
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-400">{request.submittedUser.name}</p>
                                  <p className="text-xs text-gray-500">{new Date(request.submittedAt).toLocaleDateString()}</p>
                                </div>
                              </div>
                            </div>
                            <div className="ml-4">
                              {getStatusBadge(request.status)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}