import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileText, CheckCircle, AlertCircle, Download, Database, History, XCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ImportError {
  row: number;
  error: string;
  data?: Record<string, any>;
}

interface ImportResult {
  success: number;
  errors: ImportError[];
  total: number;
}

interface BulkDataImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BulkDataImportModal({ isOpen, onClose }: BulkDataImportModalProps) {
  const [materialsFile, setMaterialsFile] = useState<File | null>(null);
  const [priceHistoryFile, setPriceHistoryFile] = useState<File | null>(null);
  const [uploadResults, setUploadResults] = useState<{
    materials?: ImportResult;
    priceHistory?: ImportResult;
  } | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [hasUnacknowledgedErrors, setHasUnacknowledgedErrors] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const materialsUploadMutation = useMutation({
    mutationFn: async (csvFile: File) => {
      const formData = new FormData();
      formData.append('csv', csvFile);
      
      const response = await fetch('/api/materials/bulk-upload', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }
      
      return response.json();
    },
    onSuccess: (data: ImportResult) => {
      setUploadResults(prev => ({ ...prev, materials: data }));
      queryClient.invalidateQueries({ queryKey: ["/api/materials"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      
      if (data.errors.length > 0) {
        setHasUnacknowledgedErrors(true);
      } else {
        toast({
          title: "Materials Upload Complete",
          description: `${data.success} materials imported successfully!`,
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Materials Upload Failed",
        description: error.message || "Failed to upload materials CSV",
        variant: "destructive",
      });
    },
  });

  const priceHistoryUploadMutation = useMutation({
    mutationFn: async (csvFile: File) => {
      const formData = new FormData();
      formData.append('file', csvFile);
      
      const response = await fetch('/api/price-history/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Upload failed: ${response.statusText}`);
      }
      
      return response.json();
    },
    onSuccess: (data: ImportResult) => {
      setUploadResults(prev => ({ ...prev, priceHistory: data }));
      queryClient.invalidateQueries({ queryKey: ["/api/price-history/all"] });
      queryClient.invalidateQueries({ queryKey: ["/api/price-changes/recent"] });
      
      if (data.errors.length > 0) {
        setHasUnacknowledgedErrors(true);
      } else {
        toast({
          title: "Price History Upload Complete", 
          description: `${data.success} price records imported successfully!`,
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Price History Upload Failed",
        description: error.message || "Failed to upload price history CSV",
        variant: "destructive",
      });
    },
  });

  const handleMaterialsFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setMaterialsFile(selectedFile);
    } else {
      toast({
        title: "Invalid File",
        description: "Please select a valid CSV file",
        variant: "destructive",
      });
    }
  };

  const handlePriceHistoryFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setPriceHistoryFile(selectedFile);
    } else {
      toast({
        title: "Invalid File", 
        description: "Please select a valid CSV file",
        variant: "destructive",
      });
    }
  };

  const handleMaterialsUpload = () => {
    if (!materialsFile) return;
    materialsUploadMutation.mutate(materialsFile);
  };

  const handlePriceHistoryUpload = () => {
    if (!priceHistoryFile) return;
    priceHistoryUploadMutation.mutate(priceHistoryFile);
  };

  const handleClose = () => {
    // Always allow closing - never lock the user in
    setMaterialsFile(null);
    setPriceHistoryFile(null);
    setUploadResults(null);
    setUploadProgress(0);
    setHasUnacknowledgedErrors(false);
    onClose();
  };

  const acknowledgeErrors = () => {
    setHasUnacknowledgedErrors(false);
  };

  const handleDismissAndClose = () => {
    setHasUnacknowledgedErrors(false);
    setMaterialsFile(null);
    setPriceHistoryFile(null);
    setUploadResults(null);
    setUploadProgress(0);
    onClose();
  };

  const downloadMaterialsTemplate = () => {
    const template = [
      'name,location,manufacturer,productCategory,distributor,currentPrice,tickerSymbol',
      'Starter Strip,DFW,Atlas,Flashing,ABCSupply,345.00,ABC',
      'Chimney Flashing,ATL,Malarky,Decking,Other,89.75,OTH',
      'Roofing Underlayment (Felt),OKC,Tri-Built,Underlayment,Beacon,48.90,QXO',
      'Example Asphalt Shingles,HOU,GAF,Shingle,ABCSupply,23.45,ABC',
      'Elastomeric Roof Coating,ATX,CertainTeed,Accessory,SRSProducts,156.00,SRS',
      'Gutter Guards,ARK,Owens Corning,Accessory,CommercialDistributors,94.60,CDH'
    ].join('\n');
    
    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'materials_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadPriceHistoryTemplate = () => {
    const template = [
      'materialName,distributor,location,oldPrice,newPrice,changeDate,changeReason',
      'Atlas Lifetime Pro 30-Year Architectural Shingle,ABCSupply,DFW,120.00,125.50,2024-08-15,Market adjustment',
      'GAF Timberline HD Charcoal,Beacon,ATX,115.25,118.75,2024-09-01,Supplier increase',
      'Malarky Windsor Storm,SRSProducts,HOU,128.00,132.25,2024-09-15,Material cost increase'
    ].join('\n');
    
    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'price_history_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="glass rounded-xl border-aurora-purple/30 max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-white flex items-center">
            <Database className="mr-3 text-aurora-cyan" />
            Bulk Data Import
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="materials" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-aurora-navy/50">
            <TabsTrigger value="materials" className="data-[state=active]:bg-aurora-purple/30">
              Initial Materials Setup
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-aurora-purple/30">
              Historical Price Data
            </TabsTrigger>
          </TabsList>
          
          {/* Materials Tab */}
          <TabsContent value="materials" className="space-y-6">
            <Card className="glass border-aurora-green/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Upload className="mr-2 text-aurora-green" />
                  Bulk Materials Import
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Upload thousands of materials at once for initial system setup
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-aurora-navy/20 rounded-lg border border-aurora-cyan/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-medium">Materials CSV Template</h3>
                      <p className="text-gray-300 text-sm">
                        Download template with required columns and format
                      </p>
                    </div>
                    <Button
                      onClick={downloadMaterialsTemplate}
                      variant="outline"
                      className="border-aurora-cyan text-aurora-cyan hover:bg-aurora-cyan/10"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download Template
                    </Button>
                  </div>
                </div>

                <Alert className="border-aurora-yellow/30 bg-aurora-yellow/5">
                  <AlertCircle className="h-4 w-4 text-aurora-yellow" />
                  <AlertDescription className="text-gray-300">
                    <strong>Required columns:</strong> name, location, manufacturer, productCategory, distributor, currentPrice, tickerSymbol
                    <br />
                    <strong>Tip:</strong> For large files (10k+ records), consider splitting into smaller batches
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <Label htmlFor="materials-file" className="text-white">
                    Select Materials CSV File
                  </Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="materials-file"
                      type="file"
                      accept=".csv"
                      onChange={handleMaterialsFileChange}
                      className="bg-aurora-navy/50 border-aurora-purple/30 text-white"
                    />
                    {materialsFile && (
                      <div className="flex items-center text-aurora-green">
                        <FileText className="mr-2 h-4 w-4" />
                        <span className="text-sm">{materialsFile.name}</span>
                      </div>
                    )}
                  </div>
                </div>

                {uploadResults?.materials && (
                  <div className={`p-4 rounded-lg border ${uploadResults.materials.errors.length > 0 ? 'bg-red-950/30 border-red-500/50' : 'bg-aurora-navy/20 border-aurora-green/20'}`}>
                    <div className={`flex items-center mb-3 ${uploadResults.materials.errors.length > 0 ? 'text-red-400' : 'text-aurora-green'}`}>
                      {uploadResults.materials.errors.length > 0 ? (
                        <XCircle className="mr-2 h-5 w-5" />
                      ) : (
                        <CheckCircle className="mr-2 h-5 w-5" />
                      )}
                      <span className="font-semibold text-lg">Materials Upload Results</span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="bg-aurora-navy/30 rounded p-3 text-center">
                        <div className="text-2xl font-bold text-white">{uploadResults.materials.total}</div>
                        <div className="text-gray-400 text-sm">Total Records</div>
                      </div>
                      <div className="bg-aurora-green/10 rounded p-3 text-center border border-aurora-green/20">
                        <div className="text-2xl font-bold text-aurora-green">{uploadResults.materials.success}</div>
                        <div className="text-gray-400 text-sm">Imported</div>
                      </div>
                      <div className={`rounded p-3 text-center border ${uploadResults.materials.errors.length > 0 ? 'bg-red-500/10 border-red-500/30' : 'bg-aurora-navy/30 border-gray-600'}`}>
                        <div className={`text-2xl font-bold ${uploadResults.materials.errors.length > 0 ? 'text-red-400' : 'text-gray-400'}`}>{uploadResults.materials.errors.length}</div>
                        <div className="text-gray-400 text-sm">Errors</div>
                      </div>
                    </div>

                    {uploadResults.materials.errors.length > 0 && (
                      <div className="mt-4">
                        <div className="flex items-center text-red-400 mb-2">
                          <AlertCircle className="mr-2 h-4 w-4" />
                          <span className="font-medium">Failed Line Items - Please review and fix:</span>
                        </div>
                        <ScrollArea className="h-48 rounded-md border border-red-500/30 bg-red-950/20 p-3">
                          <div className="space-y-2">
                            {uploadResults.materials.errors.map((error, index) => (
                              <div key={index} className="p-2 bg-red-950/40 rounded border border-red-500/20">
                                <div className="flex items-start">
                                  <span className="text-red-400 font-mono text-xs bg-red-500/20 px-2 py-0.5 rounded mr-2 shrink-0">
                                    Row {error.row}
                                  </span>
                                  <span className="text-gray-300 text-sm">{error.error}</span>
                                </div>
                                {error.data && (
                                  <div className="mt-1 text-xs text-gray-500 font-mono truncate">
                                    {JSON.stringify(error.data)}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                        <div className="mt-3 flex justify-end">
                          <Button
                            onClick={acknowledgeErrors}
                            className="bg-red-600 hover:bg-red-700 text-white"
                            data-testid="button-acknowledge-materials-errors"
                          >
                            I've Noted These Errors - Dismiss
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex justify-end">
                  <Button
                    onClick={handleMaterialsUpload}
                    disabled={!materialsFile || materialsUploadMutation.isPending}
                    className="bg-aurora-green hover:bg-aurora-green/80 text-white"
                  >
                    {materialsUploadMutation.isPending ? (
                      <>
                        <LoadingSpinner className="mr-2 h-4 w-4" />
                        Uploading Materials...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Materials
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Price History Tab */}
          <TabsContent value="history" className="space-y-6">
            <Card className="glass border-aurora-purple/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <History className="mr-2 text-aurora-purple" />
                  Historical Price Data Import
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Upload 6 months of historical pricing to establish price trends and analytics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-aurora-navy/20 rounded-lg border border-aurora-purple/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-medium">Price History CSV Template</h3>
                      <p className="text-gray-300 text-sm">
                        Format for historical price change records
                      </p>
                    </div>
                    <Button
                      onClick={downloadPriceHistoryTemplate}
                      variant="outline"
                      className="border-aurora-purple text-aurora-purple hover:bg-aurora-purple/10"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download Template
                    </Button>
                  </div>
                </div>

                <Alert className="border-aurora-yellow/30 bg-aurora-yellow/5">
                  <AlertCircle className="h-4 w-4 text-aurora-yellow" />
                  <AlertDescription className="text-gray-300">
                    <strong>Required columns:</strong> materialName, distributor, location, oldPrice, newPrice, changeDate, changeReason
                    <br />
                    <strong>Date format:</strong> YYYY-MM-DD (e.g., 2024-08-15)
                    <br />
                    <strong>Note:</strong> Materials must exist before importing price history
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <Label htmlFor="history-file" className="text-white">
                    Select Price History CSV File
                  </Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="history-file"
                      type="file"
                      accept=".csv"
                      onChange={handlePriceHistoryFileChange}
                      className="bg-aurora-navy/50 border-aurora-purple/30 text-white"
                    />
                    {priceHistoryFile && (
                      <div className="flex items-center text-aurora-purple">
                        <FileText className="mr-2 h-4 w-4" />
                        <span className="text-sm">{priceHistoryFile.name}</span>
                      </div>
                    )}
                  </div>
                </div>

                {uploadResults?.priceHistory && (
                  <div className={`p-4 rounded-lg border ${uploadResults.priceHistory.errors.length > 0 ? 'bg-red-950/30 border-red-500/50' : 'bg-aurora-navy/20 border-aurora-purple/20'}`}>
                    <div className={`flex items-center mb-3 ${uploadResults.priceHistory.errors.length > 0 ? 'text-red-400' : 'text-aurora-purple'}`}>
                      {uploadResults.priceHistory.errors.length > 0 ? (
                        <XCircle className="mr-2 h-5 w-5" />
                      ) : (
                        <CheckCircle className="mr-2 h-5 w-5" />
                      )}
                      <span className="font-semibold text-lg">Price History Upload Results</span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="bg-aurora-navy/30 rounded p-3 text-center">
                        <div className="text-2xl font-bold text-white">{uploadResults.priceHistory.total}</div>
                        <div className="text-gray-400 text-sm">Total Records</div>
                      </div>
                      <div className="bg-aurora-purple/10 rounded p-3 text-center border border-aurora-purple/20">
                        <div className="text-2xl font-bold text-aurora-purple">{uploadResults.priceHistory.success}</div>
                        <div className="text-gray-400 text-sm">Imported</div>
                      </div>
                      <div className={`rounded p-3 text-center border ${uploadResults.priceHistory.errors.length > 0 ? 'bg-red-500/10 border-red-500/30' : 'bg-aurora-navy/30 border-gray-600'}`}>
                        <div className={`text-2xl font-bold ${uploadResults.priceHistory.errors.length > 0 ? 'text-red-400' : 'text-gray-400'}`}>{uploadResults.priceHistory.errors.length}</div>
                        <div className="text-gray-400 text-sm">Errors</div>
                      </div>
                    </div>

                    {uploadResults.priceHistory.errors.length > 0 && (
                      <div className="mt-4">
                        <div className="flex items-center text-red-400 mb-2">
                          <AlertCircle className="mr-2 h-4 w-4" />
                          <span className="font-medium">Failed Line Items - Please review and fix:</span>
                        </div>
                        <ScrollArea className="h-48 rounded-md border border-red-500/30 bg-red-950/20 p-3">
                          <div className="space-y-2">
                            {uploadResults.priceHistory.errors.map((error, index) => (
                              <div key={index} className="p-2 bg-red-950/40 rounded border border-red-500/20">
                                <div className="flex items-start">
                                  <span className="text-red-400 font-mono text-xs bg-red-500/20 px-2 py-0.5 rounded mr-2 shrink-0">
                                    Row {error.row}
                                  </span>
                                  <span className="text-gray-300 text-sm">{error.error}</span>
                                </div>
                                {error.data && (
                                  <div className="mt-1 text-xs text-gray-500 font-mono truncate">
                                    {JSON.stringify(error.data)}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                        <div className="mt-3 flex justify-end">
                          <Button
                            onClick={acknowledgeErrors}
                            className="bg-red-600 hover:bg-red-700 text-white"
                            data-testid="button-acknowledge-history-errors"
                          >
                            I've Noted These Errors - Dismiss
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex justify-end">
                  <Button
                    onClick={handlePriceHistoryUpload}
                    disabled={!priceHistoryFile || priceHistoryUploadMutation.isPending}
                    className="bg-aurora-purple hover:bg-aurora-purple/80 text-white"
                  >
                    {priceHistoryUploadMutation.isPending ? (
                      <>
                        <LoadingSpinner className="mr-2 h-4 w-4" />
                        Uploading History...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Price History
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={handleClose}
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
            data-testid="button-close-import-modal"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}