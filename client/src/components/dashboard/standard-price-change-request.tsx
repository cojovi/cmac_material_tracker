import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Zap, DollarSign } from "lucide-react";

const priceChangeRequestSchema = z.object({
  materialName: z.string().min(1, "Material name is required"),
  distributor: z.string().min(1, "Distributor is required"),
  newPrice: z.coerce.number().positive("Price must be positive"),
  reason: z.string().min(1, "Reason is required")
});

type PriceChangeRequestForm = z.infer<typeof priceChangeRequestSchema>;

interface Material {
  id: number;
  name: string;
  distributor: string;
  currentPrice: number;
}

export function StandardPriceChangeRequest() {
  const { toast } = useToast();
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);

  const form = useForm<PriceChangeRequestForm>({
    resolver: zodResolver(priceChangeRequestSchema),
    defaultValues: {
      materialName: "",
      distributor: "",
      newPrice: 0,
      reason: ""
    }
  });

  // Fetch materials for the dropdown
  const { data: materials = [] } = useQuery<Material[]>({
    queryKey: ['/api/materials']
  });

  // Submit price change request mutation
  const submitRequestMutation = useMutation({
    mutationFn: async (data: PriceChangeRequestForm) => {
      const response = await fetch('/api/price-change-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          materialName: data.materialName,
          distributor: data.distributor,
          newPrice: data.newPrice,
          reason: data.reason
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit request');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Request Submitted Successfully",
        description: "Your price change request has been sent for admin approval. You'll receive a Slack notification when it's reviewed."
      });
      form.reset();
      setSelectedMaterial(null);
      queryClient.invalidateQueries({ queryKey: ['/api/price-change-requests'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error Submitting Request",
        description: error.message || "Failed to submit price change request. Please try again.",
        variant: "destructive"
      });
    }
  });

  const onSubmit = (data: PriceChangeRequestForm) => {
    submitRequestMutation.mutate(data);
  };

  const handleMaterialSelect = (materialId: string) => {
    const material = materials.find(m => m.id.toString() === materialId);
    if (material) {
      setSelectedMaterial(material);
      form.setValue("materialName", material.name);
      form.setValue("distributor", material.distributor);
      form.setValue("newPrice", Number(material.currentPrice || 0));
    }
  };

  const uniqueDistributors = Array.from(
    new Set(materials.map(m => m.distributor))
  ).sort();

  return (
    <Card className="glass rounded-xl border-aurora-purple/30 bg-gradient-to-br from-aurora-purple/20 to-aurora-coral/10 mb-6">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-white flex items-center">
          <Zap className="mr-3 text-aurora-yellow" />
          Submit Price Change Request
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Material Name Field */}
              <FormField
                control={form.control}
                name="materialName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Material Name</FormLabel>
                    <Select onValueChange={handleMaterialSelect}>
                      <FormControl>
                        <SelectTrigger className="bg-dark-card/50 border-aurora-green/30 text-white placeholder:text-gray-400">
                          <SelectValue placeholder="Start typing to search..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-dark-card border-aurora-green/30 max-h-60">
                        {materials.map((material) => (
                          <SelectItem 
                            key={material.id} 
                            value={material.id.toString()}
                            className="text-white hover:bg-aurora-purple/20"
                          >
                            {material.name} - {material.distributor}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Distributor Field */}
              <FormField
                control={form.control}
                name="distributor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Distributor</FormLabel>
                    <Select 
                      value={field.value} 
                      onValueChange={field.onChange}
                      disabled={!selectedMaterial}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-dark-card/50 border-aurora-green/30 text-white placeholder:text-gray-400">
                          <SelectValue placeholder="Select Distributor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-dark-card border-aurora-green/30">
                        {uniqueDistributors.map((distributor) => (
                          <SelectItem 
                            key={distributor} 
                            value={distributor}
                            className="text-white hover:bg-aurora-purple/20"
                          >
                            {distributor}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Updated Price Field */}
              <FormField
                control={form.control}
                name="newPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Updated Price</FormLabel>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-aurora-green" />
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          className="pl-10 bg-dark-card/50 border-aurora-green/30 text-white placeholder:text-gray-400 focus:border-aurora-cyan"
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Reason Field */}
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="text-white">Reason for Change</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g., Supplier price increase, market adjustment..."
                        className="bg-dark-card/50 border-aurora-green/30 text-white placeholder:text-gray-400 focus:border-aurora-cyan"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <div className="flex items-end">
                <Button
                  type="submit"
                  disabled={submitRequestMutation.isPending}
                  className="w-full bg-aurora-yellow hover:bg-aurora-yellow/80 text-dark-bg font-semibold border-0"
                >
                  <Zap className="mr-2 h-4 w-4" />
                  {submitRequestMutation.isPending ? "Submitting..." : "Submit Request for Approval"}
                </Button>
              </div>
            </div>
          </form>
        </Form>

        {selectedMaterial && (
          <div className="mt-4 p-3 rounded-lg bg-aurora-purple/10 border border-aurora-purple/30">
            <p className="text-sm text-gray-300">
              <span className="text-white font-medium">Current Price:</span> ${Number(selectedMaterial.currentPrice || 0).toFixed(2)}
              {form.watch("newPrice") && (
                <span className="ml-4">
                  <span className="text-white font-medium">New Price:</span> ${Number(form.watch("newPrice") || 0).toFixed(2)}
                  <span className={`ml-2 font-medium ${
                    Number(form.watch("newPrice") || 0) > Number(selectedMaterial.currentPrice || 0)
                      ? "text-aurora-coral" 
                      : "text-aurora-green"
                  }`}>
                    ({Number(form.watch("newPrice") || 0) > Number(selectedMaterial.currentPrice || 0) ? "+" : ""}
                    ${(Number(form.watch("newPrice") || 0) - Number(selectedMaterial.currentPrice || 0)).toFixed(2)})
                  </span>
                </span>
              )}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}