import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Send } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { insertPriceChangeRequestSchema, DISTRIBUTOR_NAMES, type InsertPriceChangeRequest, type Material } from "@shared/schema";

export function PriceChangeRequestForm() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [materialSearch, setMaterialSearch] = useState("");

  const form = useForm<InsertPriceChangeRequest>({
    resolver: zodResolver(insertPriceChangeRequestSchema),
    defaultValues: {
      materialName: "",
      distributor: undefined,
      requestedPrice: "",
      submittedBy: user?.id,
    },
  });

  // Search materials for autocomplete
  const { data: searchResults = [] } = useQuery<Material[]>({
    queryKey: ["/api/materials/search", materialSearch],
    enabled: materialSearch.length > 2,
  });

  const submitRequestMutation = useMutation({
    mutationFn: async (data: InsertPriceChangeRequest) => {
      const response = await apiRequest("POST", "/api/price-change-requests", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Request Submitted",
        description: "Your price change request has been sent for approval.",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/price-change-requests"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit request",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertPriceChangeRequest) => {
    submitRequestMutation.mutate(data);
  };

  return (
    <Card className="glass rounded-xl border-aurora-yellow/20">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-white flex items-center">
          <Send className="mr-2 text-aurora-yellow" />
          Submit Price Change Request
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="materialName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Material Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        className="bg-aurora-navy/50 border-aurora-purple/30 text-white placeholder-gray-400 focus:border-aurora-cyan focus:ring-aurora-cyan/20"
                        placeholder="Start typing to search..."
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          setMaterialSearch(e.target.value);
                        }}
                      />
                      {searchResults.length > 0 && materialSearch.length > 2 && (
                        <div className="absolute top-full left-0 right-0 z-10 bg-aurora-navy border border-aurora-purple/30 rounded-md mt-1 max-h-48 overflow-y-auto">
                          {searchResults.map((material) => (
                            <div
                              key={material.id}
                              className="px-3 py-2 hover:bg-aurora-purple/20 cursor-pointer text-white text-sm"
                              onClick={() => {
                                field.onChange(material.name);
                                setMaterialSearch("");
                              }}
                            >
                              <div className="font-medium">{material.name}</div>
                              <div className="text-xs text-gray-400">
                                {material.distributor} • {material.location} • ${material.currentPrice}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage className="text-aurora-red" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="distributor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Distributor</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-aurora-navy/50 border-aurora-purple/30 text-white focus:border-aurora-cyan focus:ring-aurora-cyan/20">
                        <SelectValue placeholder="Select Distributor" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-aurora-navy border-aurora-purple/30">
                      {DISTRIBUTOR_NAMES.map((distributor) => (
                        <SelectItem 
                          key={distributor} 
                          value={distributor}
                          className="text-white hover:bg-aurora-purple/20 focus:bg-aurora-purple/20"
                        >
                          {distributor}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-aurora-red" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="requestedPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Updated Price</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                      <Input
                        className="bg-aurora-navy/50 border-aurora-purple/30 text-white placeholder-gray-400 focus:border-aurora-cyan focus:ring-aurora-cyan/20 pl-8"
                        placeholder="0.00"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-aurora-red" />
                </FormItem>
              )}
            />

            <div className="md:col-span-3">
              <Button
                type="submit"
                className="bg-aurora-yellow hover:bg-aurora-bright-cyan text-aurora-navy font-semibold"
                disabled={submitRequestMutation.isPending}
              >
                {submitRequestMutation.isPending ? (
                  <>
                    <LoadingSpinner className="mr-2 h-4 w-4" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Submit Request for Approval
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
