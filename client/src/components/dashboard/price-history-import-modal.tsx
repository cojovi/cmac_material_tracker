import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { History, Upload, Download, X, Check, AlertTriangle } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface ImportResult {
  success: number;
  errors: Array<{ row: number; error: string }>;
}

interface PriceHistoryImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PriceHistoryImportModal({ isOpen, onClose }: PriceHistoryImportModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [results, setResults] = useState<ImportResult | null>(null);
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/price-history/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage;
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.error || errorJson.message || `Upload failed with status ${response.status}`;
        } catch {
          errorMessage = `Upload failed: ${errorText}`;
        }
        throw new Error(errorMessage);
      }

      return response.json();
    },
    onSuccess: (data: ImportResult) => {
      setResults(data);
      if (data.success > 0) {
        toast({
          title: "Price History Import Completed",
          description: `Successfully imported ${data.success} price history records.`,
        });
        // Invalidate relevant queries
        queryClient.invalidateQueries({ queryKey: ['/api/materials'] });
        queryClient.invalidateQueries({ queryKey: ['/api/price-changes/recent'] });
        queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
        queryClient.invalidateQueries({ queryKey: ['/api/price-history'] });
      }
      if (data.errors.length > 0) {
        toast({
          title: "Import Warnings",
          description: `${data.errors.length} records had errors. Check the results below.`,
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload price history file",
        variant: "destructive",
      });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.name.toLowerCase().endsWith('.csv')) {
        toast({
          title: "Invalid File Type",
          description: "Please select a CSV file.",
          variant: "destructive",
        });
        return;
      }
      setFile(selectedFile);
      setResults(null);
      setUploadProgress(0);
    }
  };

  const handleUpload = () => {
    if (!file) return;
    uploadMutation.mutate(file);
  };

  const handleClose = () => {
    setFile(null);
    setResults(null);
    setUploadProgress(0);
    onClose();
  };

  const downloadPriceHistoryTemplate = () => {
    const template = [
      'materialName,distributor,location,oldPrice,newPrice,changeDate,changeReason',
      'Atlas Lifetime Pro 30-Year Architectural Shingle Charcoal,ABCSupply,DFW,79.00,84.00,2025-01-05,Market adjustment',
      'Example Material Name,ABCSupply,ATL,150.00,165.00,2025-01-15,Supply chain costs',
      'Sample Roofing Product,SRSProducts,HOU,89.50,95.25,2025-02-01,Material cost increase'
    ].join('\n');

    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'price_history_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="glass rounded-xl border-aurora-purple/30 max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-white flex items-center">
            <History className="mr-3 text-aurora-cyan" />
            Import Price History
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Instructions */}
          <div className="bg-aurora-navy/30 border border-aurora-purple/20 rounded-lg p-4">
            <h3 className="text-lg font-medium text-white mb-2">Import Instructions</h3>
            <ul className="text-gray-300 space-y-1 text-sm">
              <li>• Upload a CSV file with historical price data</li>
              <li>• Materials must already exist in the system to import their history</li>
              <li>• Required columns: materialName, distributor, location, oldPrice, newPrice, changeDate, changeReason</li>
              <li>• Date format should be YYYY-MM-DD (e.g., 2025-01-05)</li>
              <li>• Material names, distributors, and locations must match existing records exactly</li>
            </ul>
          </div>

          {/* Template Download */}
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium text-white">Download Template</h3>
              <p className="text-gray-400 text-sm">Get the correct CSV format for price history import</p>
            </div>
            <Button
              onClick={downloadPriceHistoryTemplate}
              variant="outline"
              className="border-aurora-cyan text-aurora-cyan hover:bg-aurora-cyan hover:text-white"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Template
            </Button>
          </div>

          {/* File Upload */}
          <div className="space-y-4">
            <div>
              <label htmlFor="price-history-file" className="block text-sm font-medium text-gray-300 mb-2">
                Select Price History CSV File
              </label>
              <Input
                id="price-history-file"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="bg-aurora-navy/50 border-aurora-purple/30 text-white file:border-0 file:bg-aurora-purple file:text-white file:rounded-md file:px-3 file:py-1 file:mr-3"
              />
            </div>

            {file && (
              <div className="flex items-center justify-between bg-aurora-navy/30 border border-aurora-green/20 rounded-lg p-3">
                <div className="flex items-center text-gray-300">
                  <Upload className="mr-2 h-4 w-4 text-aurora-green" />
                  <span className="text-sm">{file.name}</span>
                  <span className="ml-2 text-xs text-gray-400">
                    ({(file.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
                <Button
                  onClick={handleUpload}
                  disabled={uploadMutation.isPending}
                  className="bg-aurora-green hover:bg-aurora-green/80 text-white"
                >
                  {uploadMutation.isPending ? (
                    <>
                      <LoadingSpinner className="mr-2 h-4 w-4" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Import History
                    </>
                  )}
                </Button>
              </div>
            )}

            {uploadMutation.isPending && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-300">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}
          </div>

          {/* Results */}
          {results && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">Import Results</h3>
              
              {/* Success Summary */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-aurora-green">
                  <Check className="mr-2 h-5 w-5" />
                  <span className="font-medium">{results.success} records imported successfully</span>
                </div>
                {results.errors.length > 0 && (
                  <div className="flex items-center text-aurora-red">
                    <AlertTriangle className="mr-2 h-5 w-5" />
                    <span className="font-medium">{results.errors.length} errors</span>
                  </div>
                )}
              </div>

              {/* Error Details */}
              {results.errors.length > 0 && (
                <div className="bg-aurora-navy/30 border border-aurora-red/20 rounded-lg p-4 max-h-60 overflow-y-auto">
                  <h4 className="text-sm font-medium text-aurora-red mb-2">Import Errors:</h4>
                  <div className="space-y-1">
                    {results.errors.map((error, index) => (
                      <div key={index} className="text-xs text-gray-300">
                        <span className="text-aurora-red font-medium">Row {error.row}:</span> {error.error}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-4 border-t border-aurora-purple/20">
            <Button
              variant="outline"
              onClick={handleClose}
              className="border-gray-500 hover:bg-gray-700 text-gray-300 hover:text-white"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}