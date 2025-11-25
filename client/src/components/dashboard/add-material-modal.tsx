import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Plus, PackagePlus } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { 
  insertMaterialSchema, 
  LOCATIONS, 
  MANUFACTURERS, 
  PRODUCT_CATEGORIES, 
  DISTRIBUTOR_NAMES,
  DISTRIBUTORS,
  type InsertMaterial,
  type Material
} from "@shared/schema";
import { z } from "zod";

const addMaterialSchema = insertMaterialSchema.extend({
  currentPrice: z.string().min(1, "Price is required").refine(
    (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
    "Price must be a positive number"
  ),
});

type AddMaterialFormData = z.infer<typeof addMaterialSchema>;

export function AddMaterialModal() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: existingMaterials = [] } = useQuery<Material[]>({
    queryKey: ["/api/materials"],
  });

  const form = useForm<AddMaterialFormData>({
    resolver: zodResolver(addMaterialSchema),
    defaultValues: {
      name: "",
      location: undefined,
      manufacturer: undefined,
      productCategory: undefined,
      distributor: undefined,
      currentPrice: "",
      tickerSymbol: "",
    },
  });

  const selectedDistributor = form.watch("distributor");
  
  useEffect(() => {
    if (selectedDistributor) {
      const tickerSymbol = DISTRIBUTORS[selectedDistributor as keyof typeof DISTRIBUTORS] || "OTH";
      form.setValue("tickerSymbol", tickerSymbol);
    }
  }, [selectedDistributor, form]);

  const createMaterialMutation = useMutation({
    mutationFn: async (data: AddMaterialFormData) => {
      const response = await apiRequest("POST", "/api/materials", data);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add material");
      }
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Material Added Successfully",
        description: `${data.name} has been added to the materials list.`,
      });
      form.reset();
      setIsOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/materials"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/price-changes/recent"] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Add Material",
        description: error.message || "An error occurred while adding the material",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: AddMaterialFormData) => {
    const materialName = data.name.trim().toLowerCase();
    const materialLocation = data.location;
    const materialDistributor = data.distributor;
    
    const duplicateExists = existingMaterials.some(
      (m) => 
        m.name.toLowerCase() === materialName && 
        m.location === materialLocation &&
        m.distributor === materialDistributor
    );

    if (duplicateExists) {
      toast({
        title: "Material Already Exists",
        description: "A material with this name, location, and distributor already exists. Use 'Price Change' to update its price.",
        variant: "destructive",
      });
      return;
    }

    createMaterialMutation.mutate(data);
  };

  useEffect(() => {
    const handleOpenModal = () => {
      if (isAdmin) {
        setIsOpen(true);
      } else {
        toast({
          title: "Access Denied",
          description: "Admin access required to add materials.",
          variant: "destructive",
        });
      }
    };

    document.addEventListener('openAddMaterialModal', handleOpenModal);
    
    return () => {
      document.removeEventListener('openAddMaterialModal', handleOpenModal);
    };
  }, [isAdmin, toast]);

  if (!isAdmin) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="glass rounded-xl border-aurora-green/30 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-white flex items-center">
            <PackagePlus className="mr-3 text-aurora-green" />
            Add New Material
          </DialogTitle>
        </DialogHeader>

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
                        data-testid="input-material-name"
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
                        <SelectTrigger 
                          className="bg-aurora-navy/50 border-aurora-purple/30 text-white focus:border-aurora-cyan focus:ring-aurora-cyan/20"
                          data-testid="select-location"
                        >
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
                        <SelectTrigger 
                          className="bg-aurora-navy/50 border-aurora-purple/30 text-white focus:border-aurora-cyan focus:ring-aurora-cyan/20"
                          data-testid="select-manufacturer"
                        >
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
                        <SelectTrigger 
                          className="bg-aurora-navy/50 border-aurora-purple/30 text-white focus:border-aurora-cyan focus:ring-aurora-cyan/20"
                          data-testid="select-category"
                        >
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
                        <SelectTrigger 
                          className="bg-aurora-navy/50 border-aurora-purple/30 text-white focus:border-aurora-cyan focus:ring-aurora-cyan/20"
                          data-testid="select-distributor"
                        >
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
                    <FormLabel className="text-gray-300">Price</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                        <Input
                          className="bg-aurora-navy/50 border-aurora-purple/30 text-white placeholder-gray-400 focus:border-aurora-cyan focus:ring-aurora-cyan/20 pl-8"
                          placeholder="0.00"
                          data-testid="input-price"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-aurora-red" />
                  </FormItem>
                )}
              />
            </div>

            {form.watch("tickerSymbol") && (
              <div className="text-sm text-gray-400">
                Ticker Symbol: <span className="text-aurora-cyan font-mono">{form.watch("tickerSymbol")}</span>
                <span className="ml-2 text-gray-500">(auto-generated from distributor)</span>
              </div>
            )}

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                className="border-gray-500 hover:bg-gray-700 text-gray-300 hover:text-white"
                onClick={() => setIsOpen(false)}
                data-testid="button-cancel"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-aurora-green hover:bg-aurora-green/80 text-white font-semibold"
                disabled={createMaterialMutation.isPending}
                data-testid="button-add-material"
              >
                {createMaterialMutation.isPending ? (
                  <>
                    <LoadingSpinner className="mr-2 h-4 w-4" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Material
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
