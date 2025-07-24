import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { HeaderNavigation } from "@/components/dashboard/header-navigation";
import { SidebarNavigation } from "@/components/dashboard/sidebar-navigation";
import { MaterialsDataTable } from "@/components/dashboard/materials-data-table";
import { AdminPriceChangeModal } from "@/components/dashboard/admin-price-change-modal";
import { CSVUploadModal } from "@/components/dashboard/csv-upload-modal";
import { BulkDataImportModal } from "@/components/dashboard/bulk-data-import-modal";
import { PriceHistoryImportModal } from "@/components/dashboard/price-history-import-modal";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Plus, Package, History } from "lucide-react";

export default function Materials() {
  const { user, isLoading, isAdmin } = useAuth();
  const [, setLocation] = useLocation();
  const [showCSVUpload, setShowCSVUpload] = useState(false);
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [showPriceHistoryImport, setShowPriceHistoryImport] = useState(false);

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
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-semibold text-white flex items-center">
                  <Package className="mr-3 text-aurora-cyan" />
                  Materials Management
                </CardTitle>
                {isAdmin && (
                  <div className="flex gap-3">
                    <Button
                      onClick={() => setShowBulkImport(true)}
                      className="bg-aurora-green hover:bg-aurora-green/80 text-white border-0"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Initial Setup Import
                    </Button>
                    <Button
                      onClick={() => setShowCSVUpload(true)}
                      className="bg-aurora-purple hover:bg-aurora-purple/80 text-white border-0"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Quick CSV Upload
                    </Button>
                    <Button
                      onClick={() => setShowPriceHistoryImport(true)}
                      className="bg-aurora-coral hover:bg-aurora-red text-white border-0"
                    >
                      <History className="mr-2 h-4 w-4" />
                      Import Price History
                    </Button>
                    <Button
                      data-event="click:openPriceChangeModal"
                      className="bg-aurora-cyan hover:bg-aurora-cyan/80 text-white border-0"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Material
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Manage all construction materials, pricing, and inventory across all locations.
              </p>
            </CardContent>
          </Card>

          <MaterialsDataTable />
        </main>
      </div>
      
      <AdminPriceChangeModal />
      {showCSVUpload && (
        <CSVUploadModal 
          isOpen={showCSVUpload}
          onClose={() => setShowCSVUpload(false)}
        />
      )}
      {showBulkImport && (
        <BulkDataImportModal
          isOpen={showBulkImport}
          onClose={() => setShowBulkImport(false)}
        />
      )}
      {showPriceHistoryImport && (
        <PriceHistoryImportModal
          isOpen={showPriceHistoryImport}
          onClose={() => setShowPriceHistoryImport(false)}
        />
      )}
    </div>
  );
}