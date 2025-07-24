import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Crown, Save, X } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { 
  insertMaterialSchema, 
  LOCATIONS, 
  MANUFACTURERS, 
  PRODUCT_CATEGORIES, 
  DISTRIBUTOR_NAMES,
  type InsertMaterial 
} from "@shared/schema";

export function AdminPriceChangeModal() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertMaterial>({
    resolver: zodResolver(insertMaterialSchema),
    defaultValues: {
      name: "",
      location: undefined,
      manufacturer: undefined,
      productCategory: undefined,
      distributor: undefined,
      currentPrice: "",
    },
  });

  const createMaterialMutation = useMutation({
    mutationFn: async (data: InsertMaterial) => {
      const response = await apiRequest("POST", "/api/materials", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Price Updated Successfully",
        description: "The material price has been updated immediately and team notified.",
      });
      form.reset();
      setIsOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/materials"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/price-changes/recent"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update material price",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertMaterial) => {
    createMaterialMutation.mutate(data);
  };

  // Global click handler to open modal
  useEffect(() => {
    const handleGlobalClick = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target?.closest('[data-event="click:openPriceChangeModal"]')) {
        if (isAdmin) {
          setIsOpen(true);
        } else {
          toast({
            title: "Access Denied",
            description: "Admin access required for direct price changes.",
            variant: "destructive",
          });
        }
      }
    };

    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
  }, [isAdmin, toast]);

  // Handle modal state via DOM manipulation for compatibility with existing code
  useEffect(() => {
    const modal = document.getElementById('admin-price-change-modal');
    if (modal) {
      if (isOpen) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
      } else {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
      }
    }
  }, [isOpen]);

  if (!isAdmin) {
    return null;
  }

  return (
    <>
      {/* Legacy DOM modal for compatibility */}
      <div 
        id="admin-price-change-modal" 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm hidden items-center justify-center z-50"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setIsOpen(false);
          }
        }}
      >
        <div className="glass rounded-xl p-8 max-w-2xl w-full mx-4 border border-aurora-purple/30">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-white flex items-center">
              <Crown className="mr-3 text-aurora-yellow" />
              Admin Price Update
            </h2>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsOpen(false);
              }}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Material Name</FormLabel>
                      <FormControl>
                        <Input
                          className="bg-aurora-navy/50 border-aurora-purple/30 text-white placeholder-gray-400 focus:border-aurora-cyan focus:ring-aurora-cyan/20"
                          placeholder="Enter material name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-aurora-red" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Location</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-aurora-navy/50 border-aurora-purple/30 text-white focus:border-aurora-cyan focus:ring-aurora-cyan/20">
                            <SelectValue placeholder="Select location" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-aurora-navy border-aurora-purple/30">
                          {LOCATIONS.map((location) => (
                            <SelectItem 
                              key={location} 
                              value={location}
                              className="text-white hover:bg-aurora-purple/20 focus:bg-aurora-purple/20"
                            >
                              {location}
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
                  name="manufacturer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Manufacturer</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-aurora-navy/50 border-aurora-purple/30 text-white focus:border-aurora-cyan focus:ring-aurora-cyan/20">
                            <SelectValue placeholder="Select manufacturer" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-aurora-navy border-aurora-purple/30">
                          {MANUFACTURERS.map((manufacturer) => (
                            <SelectItem 
                              key={manufacturer} 
                              value={manufacturer}
                              className="text-white hover:bg-aurora-purple/20 focus:bg-aurora-purple/20"
                            >
                              {manufacturer}
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
                  name="productCategory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Product Category</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-aurora-navy/50 border-aurora-purple/30 text-white focus:border-aurora-cyan focus:ring-aurora-cyan/20">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-aurora-navy border-aurora-purple/30">
                          {PRODUCT_CATEGORIES.map((category) => (
                            <SelectItem 
                              key={category} 
                              value={category}
                              className="text-white hover:bg-aurora-purple/20 focus:bg-aurora-purple/20"
                            >
                              {category}
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
                  name="distributor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Distributor</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-aurora-navy/50 border-aurora-purple/30 text-white focus:border-aurora-cyan focus:ring-aurora-cyan/20">
                            <SelectValue placeholder="Select distributor" />
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
                  name="currentPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">New Price</FormLabel>
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
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  className="border-gray-500 hover:bg-gray-700 text-gray-300 hover:text-white"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-aurora-coral hover:bg-aurora-red text-white font-semibold"
                  disabled={createMaterialMutation.isPending}
                >
                  {createMaterialMutation.isPending ? (
                    <>
                      <LoadingSpinner className="mr-2 h-4 w-4" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Update Price Immediately
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
}
