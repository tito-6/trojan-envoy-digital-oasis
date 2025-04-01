
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Award, Edit, GripVertical, Plus, Save, Trash, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { storageService } from "@/lib/storage";
import { PartnerLogo } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  FaGoogle,
  FaFacebook,
  FaSearchengin,
  FaAws,
  FaShopify,
  FaWordpress,
  FaAward
} from "react-icons/fa";

import { SiSemrush } from "react-icons/si";

const logoFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  iconName: z.string().min(1, "Icon is required"),
  color: z.string().min(1, "Color is required").regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Must be a valid hex color"),
  bgColor: z.string().min(1, "Background color is required"),
});

type LogoFormValues = z.infer<typeof logoFormSchema>;

// Icon map to render the actual icons
const iconMap: Record<string, React.ComponentType<any>> = {
  FaGoogle,
  FaFacebook,
  FaAws,
  FaShopify,
  FaWordpress,
  FaAward,
  SiSemrush
};

// Background color options
const bgColorOptions = [
  { value: "bg-blue-100", label: "Light Blue" },
  { value: "bg-green-100", label: "Light Green" },
  { value: "bg-red-100", label: "Light Red" },
  { value: "bg-yellow-100", label: "Light Yellow" },
  { value: "bg-purple-100", label: "Light Purple" },
  { value: "bg-pink-100", label: "Light Pink" },
  { value: "bg-orange-100", label: "Light Orange" },
  { value: "bg-indigo-100", label: "Light Indigo" },
  { value: "bg-teal-100", label: "Light Teal" },
  { value: "bg-gray-100", label: "Light Gray" },
];

const PartnerLogoItem: React.FC<{
  logo: PartnerLogo;
  onDelete: (id: number) => void;
  onEdit: (logo: PartnerLogo) => void;
  onReorder: (id: number, direction: 'up' | 'down') => void;
}> = ({ logo, onDelete, onEdit, onReorder }) => {
  const Icon = iconMap[logo.iconName] || FaAward;
  
  return (
    <div className="flex items-center justify-between p-3 border rounded-md bg-card">
      <div className="flex items-center gap-3">
        <GripVertical className="w-5 h-5 text-muted-foreground cursor-grab" />
        <div className={`w-10 h-10 rounded-full ${logo.bgColor} flex items-center justify-center`}>
          <Icon size={20} style={{ color: logo.color }} />
        </div>
        <div>
          <p className="font-medium">{logo.name}</p>
          <div className="flex items-center text-green-600 text-xs">
            <Award className="w-3 h-3 mr-1" />
            <span className="uppercase font-bold">Certified</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button size="sm" variant="ghost" onClick={() => onEdit(logo)}>
          <Edit className="w-4 h-4" />
        </Button>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size="sm" variant="ghost" className="text-red-500">
              <Trash className="w-4 h-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will remove the partner logo from your hero section.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDelete(logo.id)} className="bg-red-500 text-white hover:bg-red-600">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

const PartnerLogosManager: React.FC = () => {
  const { toast } = useToast();
  const [logos, setLogos] = useState<PartnerLogo[]>(storageService.getHeroSettings().partnerLogos);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingLogo, setEditingLogo] = useState<PartnerLogo | null>(null);
  
  const form = useForm<LogoFormValues>({
    resolver: zodResolver(logoFormSchema),
    defaultValues: {
      name: "",
      iconName: "FaAward",
      color: "#000000",
      bgColor: "bg-blue-100",
    }
  });
  
  const handleDelete = (id: number) => {
    if (storageService.deletePartnerLogo(id)) {
      setLogos(storageService.getHeroSettings().partnerLogos);
      toast({
        title: "Partner logo deleted",
        description: "The partner logo has been removed from your hero section.",
      });
    }
  };
  
  const handleReorder = (id: number, direction: 'up' | 'down') => {
    // Implementation for drag-and-drop or up/down reordering would go here
    // This is a simplified version
    const newLogos = [...logos];
    const index = newLogos.findIndex(logo => logo.id === id);
    
    if (direction === 'up' && index > 0) {
      const temp = newLogos[index - 1].order;
      newLogos[index - 1].order = newLogos[index].order;
      newLogos[index].order = temp;
    } else if (direction === 'down' && index < newLogos.length - 1) {
      const temp = newLogos[index + 1].order;
      newLogos[index + 1].order = newLogos[index].order;
      newLogos[index].order = temp;
    }
    
    storageService.reorderPartnerLogos(
      newLogos.map(logo => ({ id: logo.id, order: logo.order }))
    );
    
    setLogos(storageService.getHeroSettings().partnerLogos);
  };
  
  const onSubmit = (values: LogoFormValues) => {
    if (editingLogo) {
      // Update existing logo
      const updatedLogo = storageService.updatePartnerLogo(editingLogo.id, {
        ...values
      });
      
      if (updatedLogo) {
        setLogos(storageService.getHeroSettings().partnerLogos);
        toast({
          title: "Partner logo updated",
          description: "The partner logo has been updated successfully.",
        });
      }
    } else {
      // Add new logo - ensure all required properties are provided
      const newLogo = storageService.addPartnerLogo({
        name: values.name,
        iconName: values.iconName,
        color: values.color,
        bgColor: values.bgColor,
        order: logos.length + 1
      });
      
      setLogos(storageService.getHeroSettings().partnerLogos);
      toast({
        title: "Partner logo added",
        description: "The new partner logo has been added to your hero section.",
      });
    }
    
    setIsAddOpen(false);
    setEditingLogo(null);
    form.reset();
  };
  
  const handleEdit = (logo: PartnerLogo) => {
    setEditingLogo(logo);
    form.reset({
      name: logo.name,
      iconName: logo.iconName,
      color: logo.color,
      bgColor: logo.bgColor,
    });
    setIsAddOpen(true);
  };

  const handleAddDialogClose = () => {
    setIsAddOpen(false);
    setEditingLogo(null);
    form.reset();
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Partner Logos</CardTitle>
          <CardDescription>
            Manage the partner logos displayed in the "Trusted By" section
          </CardDescription>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Partner Logo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingLogo ? "Edit Partner Logo" : "Add Partner Logo"}</DialogTitle>
              <DialogDescription>
                {editingLogo ? "Update the partner logo details" : "Add a new partner logo to your hero section"}
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Partner Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Google, Meta, etc." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="iconName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Icon</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an icon" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="FaGoogle">Google</SelectItem>
                          <SelectItem value="FaFacebook">Facebook</SelectItem>
                          <SelectItem value="SiSemrush">SEMrush</SelectItem>
                          <SelectItem value="FaAws">AWS</SelectItem>
                          <SelectItem value="FaShopify">Shopify</SelectItem>
                          <SelectItem value="FaWordpress">WordPress</SelectItem>
                          <SelectItem value="FaAward">Award</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="color"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Icon Color</FormLabel>
                        <FormControl>
                          <div className="flex gap-2">
                            <Input {...field} type="color" className="w-12 p-1 h-10" />
                            <Input 
                              value={field.value} 
                              onChange={field.onChange}
                              placeholder="#000000" 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="bgColor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Background Color</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a color" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {bgColorOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <DialogFooter className="mt-6">
                  <Button type="button" variant="outline" onClick={handleAddDialogClose}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingLogo ? (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Update Logo
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Logo
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {logos.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No partner logos added yet. Click the button above to add some.
            </div>
          ) : (
            logos.map((logo) => (
              <PartnerLogoItem
                key={logo.id}
                logo={logo}
                onDelete={handleDelete}
                onEdit={handleEdit}
                onReorder={handleReorder}
              />
            ))
          )}
        </div>
      </CardContent>
      <CardFooter className="justify-between border-t px-6 py-4">
        <p className="text-sm text-muted-foreground">
          {logos.length} partner logo{logos.length !== 1 ? "s" : ""} configured
        </p>
      </CardFooter>
    </Card>
  );
};

export default PartnerLogosManager;
