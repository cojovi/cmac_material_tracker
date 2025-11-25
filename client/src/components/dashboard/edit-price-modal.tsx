import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { DollarSign, Save, TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { type Material } from "@shared/schema";
import { z } from "zod";

const editPriceSchema = z.object({
  materialId: z.string().min(1, "Please select a material"),
  newPrice: z.string().min(1, "New price is required").refine(
    (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
    "Price must be a positive number"
  ),
});

type EditPriceFormData = z.infer<typeof editPriceSchema>;

export function EditPriceModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: materials = [], isLoading: materialsLoading } = useQuery<Material[]>({
    queryKey: ["/api/materials"],
  });

  const form = useForm<EditPriceFormData>({
    resolver: zodResolver(editPriceSchema),
    defaultValues: {
      materialId: "",
      newPrice: "",
    },
  });

  const selectedMaterialId = form.watch("materialId");
  
  useEffect(() => {
    if (selectedMaterialId) {
      const material = materials.find(m => m.id.toString() === selectedMaterialId);
      setSelectedMaterial(material || null);
    } else {
      setSelectedMaterial(null);
    }
  }, [selectedMaterialId, materials]);

  const updatePriceMutation = useMutation({
    mutationFn: async (data: EditPriceFormData) => {
      const response = await apiRequest("PATCH", `/api/materials/${data.materialId}`, {
        currentPrice: data.newPrice,
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update price");
      }
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Price Updated Successfully",
        description: `${data.name} price has been updated to $${parseFloat(data.currentPrice).toFixed(2)}`,
      });
      form.reset();
      setSelectedMaterial(null);
      setIsOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/materials"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/price-changes/recent"] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Update Price",
        description: error.message || "An error occurred while updating the price",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: EditPriceFormData) => {
    updatePriceMutation.mutate(data);
  };

  useEffect(() => {
    const handleOpenModal = () => {
      if (isAdmin) {
        setIsOpen(true);
        form.reset();
        setSelectedMaterial(null);
      } else {
        toast({
          title: "Access Denied",
          description: "Admin access required to update prices.",
          variant: "destructive",
        });
      }
    };

    document.addEventListener('openEditPriceModal', handleOpenModal);
    
    return () => {
      document.removeEventListener('openEditPriceModal', handleOpenModal);
    };
  }, [isAdmin, toast, form]);

  if (!isAdmin) {
    return null;
  }

  const newPrice = form.watch("newPrice");
  const currentPrice = selectedMaterial ? parseFloat(selectedMaterial.currentPrice) : 0;
  const newPriceNum = parseFloat(newPrice) || 0;
  const priceChange = newPriceNum - currentPrice;
  const priceChangePercent = currentPrice > 0 ? ((priceChange / currentPrice) * 100) : 0;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="glass rounded-xl border-aurora-coral/30 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-white flex items-center">
            <DollarSign className="mr-3 text-aurora-coral" />
            Update Material Price
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Select an existing material to update its price
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="materialId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Select Material</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger 
                        className="bg-aurora-navy/50 border-aurora-purple/30 text-white focus:border-aurora-cyan focus:ring-aurora-cyan/20"
                        data-testid="select-material-to-edit"
                      >
                        <SelectValue placeholder="Choose a material to update..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-aurora-navy border-aurora-purple/30 max-h-[300px]">
                      {materialsLoading ? (
                        <div className="flex items-center justify-center p-4">
                          <LoadingSpinner className="h-4 w-4 text-aurora-cyan" />
                        </div>
                      ) : materials.length === 0 ? (
                        <div className="p-4 text-center text-gray-400">
                          No materials found. Add materials first.
                        </div>
                      ) : (
                        materials.map((material) => (
                          <SelectItem 
                            key={material.id} 
                            value={material.id.toString()}
                            className="text-white hover:bg-aurora-purple/20 focus:bg-aurora-purple/20"
                          >
                            <div className="flex flex-col">
                              <span className="font-medium">{material.name}</span>
                              <span className="text-xs text-gray-400">
                                {material.distributor} • {material.location} • ${parseFloat(material.currentPrice).toFixed(2)}
                              </span>
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-aurora-red" />
                </FormItem>
              )}
            />

            {selectedMaterial && (
              <div className="p-4 bg-aurora-navy/30 rounded-lg border border-aurora-purple/20 space-y-3">
                <h4 className="text-white font-medium">Selected Material</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Name:</span>
                    <span className="ml-2 text-white">{selectedMaterial.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Location:</span>
                    <span className="ml-2 text-aurora-cyan">{selectedMaterial.location}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Distributor:</span>
                    <span className="ml-2 text-white">{selectedMaterial.distributor}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Current Price:</span>
                    <span className="ml-2 text-aurora-yellow font-mono text-lg">
                      ${parseFloat(selectedMaterial.currentPrice).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <FormField
              control={form.control}
              name="newPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">New Price</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                      <Input
                        className="bg-aurora-navy/50 border-aurora-purple/30 text-white placeholder-gray-400 focus:border-aurora-cyan focus:ring-aurora-cyan/20 pl-8 text-lg"
                        placeholder="0.00"
                        data-testid="input-new-price"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-aurora-red" />
                </FormItem>
              )}
            />

            {selectedMaterial && newPrice && !isNaN(parseFloat(newPrice)) && (
              <div className="p-4 bg-aurora-navy/30 rounded-lg border border-aurora-purple/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-lg">
                    <span className="text-gray-400">${currentPrice.toFixed(2)}</span>
                    <ArrowRight className="h-5 w-5 text-gray-500" />
                    <span className="text-white font-medium">${newPriceNum.toFixed(2)}</span>
                  </div>
                  <div className={`flex items-center gap-2 text-lg font-medium ${
                    priceChange > 0 ? 'text-aurora-green' : priceChange < 0 ? 'text-aurora-red' : 'text-gray-400'
                  }`}>
                    {priceChange > 0 ? (
                      <TrendingUp className="h-5 w-5" />
                    ) : priceChange < 0 ? (
                      <TrendingDown className="h-5 w-5" />
                    ) : null}
                    <span>
                      {priceChange > 0 ? '+' : ''}{priceChange.toFixed(2)} 
                      ({priceChange > 0 ? '+' : ''}{priceChangePercent.toFixed(1)}%)
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                className="border-gray-500 hover:bg-gray-700 text-gray-300 hover:text-white"
                onClick={() => setIsOpen(false)}
                data-testid="button-cancel-edit"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-aurora-coral hover:bg-aurora-red text-white font-semibold"
                disabled={updatePriceMutation.isPending || !selectedMaterial}
                data-testid="button-update-price"
              >
                {updatePriceMutation.isPending ? (
                  <>
                    <LoadingSpinner className="mr-2 h-4 w-4" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Update Price
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
