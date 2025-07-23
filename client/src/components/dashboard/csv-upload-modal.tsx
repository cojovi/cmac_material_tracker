import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileText, CheckCircle, AlertCircle, Download } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface CSVUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CSVUploadModal({ isOpen, onClose }: CSVUploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploadResults, setUploadResults] = useState<{
    success: number;
    errors: { row: number; error: string }[];
    total: number;
  } | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
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
      setUploadResults(data);
      queryClient.invalidateQueries({ queryKey: ["/api/materials"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      
      if (data.errors.length === 0) {
        toast({
          title: "Upload Successful",
          description: `Successfully imported ${data.success} materials`,
        });
      } else {
        toast({
          title: "Upload Completed with Errors",
          description: `${data.success} materials imported, ${data.errors.length} errors`,
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload CSV file",
        variant: "destructive",
      });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
      setUploadResults(null);
    } else {
      toast({
        title: "Invalid File",
        description: "Please select a valid CSV file",
        variant: "destructive",
      });
    }
  };

  const handleUpload = () => {
    if (!file) return;
    uploadMutation.mutate(file);
  };

  const handleClose = () => {
    setFile(null);
    setUploadResults(null);
    onClose();
  };

  const downloadTemplate = () => {
    const template = [
      'name,location,manufacturer,productCategory,distributor,currentPrice',
      'Example Shingle,DFW,Atlas,Shingle,ABCSupply,125.50',
      'Example Underlayment,ATX,Malarky,Underlayment,Beacon,89.99'
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

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="glass rounded-xl border-aurora-purple/30 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-white flex items-center">
            <Upload className="mr-3 text-aurora-purple" />
            Bulk Material Import
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* CSV Template Download */}
          <div className="p-4 bg-aurora-navy/20 rounded-lg border border-aurora-cyan/20">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-medium">CSV Template</h3>
                <p className="text-gray-300 text-sm">
                  Download the template to ensure proper formatting
                </p>
              </div>
              <Button
                onClick={downloadTemplate}
                variant="outline"
                className="border-aurora-cyan text-aurora-cyan hover:bg-aurora-cyan/10"
              >
                <Download className="mr-2 h-4 w-4" />
                Download Template
              </Button>
            </div>
          </div>

          {/* Required Format Info */}
          <Alert className="border-aurora-yellow/30 bg-aurora-yellow/5">
            <AlertCircle className="h-4 w-4 text-aurora-yellow" />
            <AlertDescription className="text-gray-300">
              <strong>Required CSV columns:</strong> name, location, manufacturer, productCategory, distributor, currentPrice
              <br />
              <strong>Valid locations:</strong> DFW, ATX, HOU, OKC, ATL, ARK, NSH
              <br />
              <strong>Valid distributors:</strong> ABCSupply, Beacon, SRSProducts, CommercialDistributors, Other
            </AlertDescription>
          </Alert>

          {/* File Upload */}
          <div className="space-y-4">
            <Label htmlFor="csv-file" className="text-white">
              Select CSV File
            </Label>
            <div className="flex items-center gap-4">
              <Input
                id="csv-file"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="bg-aurora-navy/50 border-aurora-purple/30 text-white"
              />
              {file && (
                <div className="flex items-center text-aurora-green">
                  <FileText className="mr-2 h-4 w-4" />
                  <span className="text-sm">{file.name}</span>
                </div>
              )}
            </div>
          </div>

          {/* Upload Results */}
          {uploadResults && (
            <div className="space-y-4">
              <div className="p-4 bg-aurora-navy/20 rounded-lg border border-aurora-green/20">
                <div className="flex items-center text-aurora-green mb-2">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  <span className="font-medium">Upload Results</span>
                </div>
                <div className="text-gray-300 text-sm">
                  <p>Total records processed: {uploadResults.total}</p>
                  <p>Successfully imported: {uploadResults.success}</p>
                  <p>Errors: {uploadResults.errors.length}</p>
                </div>
              </div>

              {uploadResults.errors.length > 0 && (
                <div className="p-4 bg-aurora-red/10 rounded-lg border border-aurora-red/20 max-h-48 overflow-y-auto">
                  <h4 className="text-aurora-red font-medium mb-2">Errors:</h4>
                  <div className="space-y-1 text-sm">
                    {uploadResults.errors.map((error, index) => (
                      <div key={index} className="text-gray-300">
                        Row {error.row}: {error.error}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={handleClose}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Close
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!file || uploadMutation.isPending}
              className="bg-aurora-purple hover:bg-aurora-purple/80 text-white"
            >
              {uploadMutation.isPending ? (
                <>
                  <LoadingSpinner className="mr-2 h-4 w-4" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload CSV
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}