import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileText, CheckCircle, AlertCircle, Download, Database, History } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface BulkDataImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BulkDataImportModal({ isOpen, onClose }: BulkDataImportModalProps) {
  const [materialsFile, setMaterialsFile] = useState<File | null>(null);
  const [priceHistoryFile, setPriceHistoryFile] = useState<File | null>(null);
  const [uploadResults, setUploadResults] = useState<{
    materials?: { success: number; errors: any[]; total: number };
    priceHistory?: { success: number; errors: any[]; total: number };
  } | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
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
    onSuccess: (data) => {
      setUploadResults(prev => ({ ...prev, materials: data }));
      queryClient.invalidateQueries({ queryKey: ["/api/materials"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      
      toast({
        title: "Materials Upload Complete",
        description: `${data.success} materials imported, ${data.errors.length} errors`,
        variant: data.errors.length === 0 ? "default" : "destructive",
      });
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
      formData.append('csv', csvFile);
      
      const response = await fetch('/api/price-history/bulk-upload', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      setUploadResults(prev => ({ ...prev, priceHistory: data }));
      queryClient.invalidateQueries({ queryKey: ["/api/price-history/all"] });
      queryClient.invalidateQueries({ queryKey: ["/api/price-changes/recent"] });
      
      toast({
        title: "Price History Upload Complete", 
        description: `${data.success} price records imported, ${data.errors.length} errors`,
        variant: data.errors.length === 0 ? "default" : "destructive",
      });
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
    setMaterialsFile(null);
    setPriceHistoryFile(null);
    setUploadResults(null);
    setUploadProgress(0);
    onClose();
  };

  const downloadMaterialsTemplate = () => {
    const template = [
      'name,location,manufacturer,productCategory,distributor,currentPrice,tickerSymbol',
      'Starter Strip,DFW,Atlas,Flashing,ABC Supply,345.00,ABC',
      'Chimney Flashing,ATL,Malarky,Decking,Quality Trading House,89.75,QTH',
      'Roofing Underlayment (Felt),OKC,Tri-Built,Underlayment,QXO Distribution,48.90,QXO',
      'Example Asphalt Shingles,HOU,GAF,Shingle,ABC Supply,23.45,ABC',
      'Elastomeric Roof Coating,ATX,CertainTeed,Accessory,SRS Products,156.00,SRS',
      'Gutter Guards,ARK,Owens Corning,Accessory,CDH Materials,94.60,CDH'
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
                  <div className="p-4 bg-aurora-navy/20 rounded-lg border border-aurora-green/20">
                    <div className="flex items-center text-aurora-green mb-2">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      <span className="font-medium">Materials Upload Results</span>
                    </div>
                    <div className="text-gray-300 text-sm">
                      <p>Total records: {uploadResults.materials.total}</p>
                      <p>Successfully imported: {uploadResults.materials.success}</p>
                      <p>Errors: {uploadResults.materials.errors.length}</p>
                    </div>
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
                  <div className="p-4 bg-aurora-navy/20 rounded-lg border border-aurora-purple/20">
                    <div className="flex items-center text-aurora-purple mb-2">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      <span className="font-medium">Price History Upload Results</span>
                    </div>
                    <div className="text-gray-300 text-sm">
                      <p>Total records: {uploadResults.priceHistory.total}</p>
                      <p>Successfully imported: {uploadResults.priceHistory.success}</p>
                      <p>Errors: {uploadResults.priceHistory.errors.length}</p>
                    </div>
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

        <div className="flex justify-end">
          <Button
            variant="outline"
            onClick={handleClose}
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}