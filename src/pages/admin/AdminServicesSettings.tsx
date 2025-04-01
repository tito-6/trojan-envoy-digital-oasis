
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { storageService } from "@/lib/storage";
import { ServiceItem, ServicesSettings } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Save, Trash2, MoveUp, MoveDown, X } from "lucide-react";
import IconSelector from "@/components/admin/icon-management/IconSelector";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getIconComponentByName } from "@/lib/iconUtils";

// Define the schema for the form
const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().min(1, "Subtitle is required"),
  description: z.string().min(1, "Description is required"),
  viewAllText: z.string().min(1, "Button text is required"),
  viewAllUrl: z.string().min(1, "Button URL is required"),
});

const serviceItemSchema = z.object({
  id: z.number(),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  iconName: z.string().min(1, "Icon is required"),
  link: z.string().min(1, "Link is required"),
  order: z.number(),
  color: z.string().optional(),
  bgColor: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;
type ServiceItemFormValues = z.infer<typeof serviceItemSchema>;

const defaultService: ServiceItem = {
  id: 0,
  title: "New Service",
  description: "Service description goes here",
  iconName: "Code",
  link: "/services/new-service",
  order: 0,
  color: "text-foreground",
  bgColor: "bg-secondary",
};

const AdminServicesSettings: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [settings, setSettings] = useState<ServicesSettings | null>(null);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [activeTab, setActiveTab] = useState("general");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      subtitle: "",
      description: "",
      viewAllText: "",
      viewAllUrl: "",
    },
  });

  const serviceForm = useForm<ServiceItemFormValues>({
    resolver: zodResolver(serviceItemSchema),
    defaultValues: defaultService,
  });

  // Load settings from storage
  useEffect(() => {
    const settings = storageService.getServicesSettings();
    if (settings) {
      setSettings(settings);
      setServices(settings.services);
      form.reset({
        title: settings.title,
        subtitle: settings.subtitle,
        description: settings.description,
        viewAllText: settings.viewAllText,
        viewAllUrl: settings.viewAllUrl,
      });
    } else {
      // Create default settings if none exist
      const defaultSettings: ServicesSettings = {
        id: 1,
        title: "Our Services",
        subtitle: "What We Do",
        description: "We provide comprehensive digital solutions to help businesses succeed in the digital age.",
        viewAllText: "View All Services",
        viewAllUrl: "/services",
        services: [
          {
            id: 1,
            title: "Web Development",
            description: "Custom websites and web applications built with modern technologies to meet your business needs.",
            iconName: "Code",
            link: "/services/web-development",
            order: 1,
          },
          {
            id: 2,
            title: "Mobile Development",
            description: "Native and cross-platform mobile applications for iOS and Android devices.",
            iconName: "Smartphone",
            link: "/services/mobile-development",
            order: 2,
          },
          {
            id: 3,
            title: "UI/UX Design",
            description: "User-centered design that enhances the user experience and increases conversion rates.",
            iconName: "Paintbrush",
            link: "/services/ui-ux-design",
            order: 3,
          },
          {
            id: 4,
            title: "Digital Marketing",
            description: "Data-driven marketing strategies to increase your online presence and drive results.",
            iconName: "BarChart",
            link: "/services/digital-marketing",
            order: 4,
          },
        ],
        lastUpdated: new Date().toISOString(),
      };
      storageService.setServicesSettings(defaultSettings);
      setSettings(defaultSettings);
      setServices(defaultSettings.services);
      form.reset({
        title: defaultSettings.title,
        subtitle: defaultSettings.subtitle,
        description: defaultSettings.description,
        viewAllText: defaultSettings.viewAllText,
        viewAllUrl: defaultSettings.viewAllUrl,
      });
    }
  }, [form]);

  // Handle form submission for general settings
  const onSubmit = (values: FormValues) => {
    if (!settings) return;

    const updatedSettings: ServicesSettings = {
      ...settings,
      title: values.title,
      subtitle: values.subtitle,
      description: values.description,
      viewAllText: values.viewAllText,
      viewAllUrl: values.viewAllUrl,
      lastUpdated: new Date().toISOString(),
    };

    storageService.setServicesSettings(updatedSettings);
    setSettings(updatedSettings);

    toast({
      title: "Settings saved",
      description: "The services section settings have been updated",
    });
  };

  // Start editing a service
  const handleEditService = (service: ServiceItem) => {
    setEditingService(service);
    serviceForm.reset({
      id: service.id,
      title: service.title,
      description: service.description,
      iconName: service.iconName,
      link: service.link,
      order: service.order,
      color: service.color || "text-foreground",
      bgColor: service.bgColor || "bg-secondary",
    });
    setActiveTab("edit-service");
  };

  // Add a new service
  const handleAddService = () => {
    const newService = {
      ...defaultService,
      id: Date.now(),
      order: services.length + 1,
    };
    setEditingService(newService);
    serviceForm.reset({
      id: newService.id,
      title: newService.title,
      description: newService.description,
      iconName: newService.iconName,
      link: newService.link,
      order: newService.order,
      color: newService.color,
      bgColor: newService.bgColor,
    });
    setActiveTab("edit-service");
  };

  // Save service changes
  const handleSaveService = (values: ServiceItemFormValues) => {
    if (!settings) return;

    let updatedServices = [...services];
    const index = updatedServices.findIndex(s => s.id === values.id);

    // Ensure the service item has all required fields
    const serviceItem: ServiceItem = {
      id: values.id,
      title: values.title,
      description: values.description,
      iconName: values.iconName,
      link: values.link,
      order: values.order,
      color: values.color,
      bgColor: values.bgColor,
    };

    if (index !== -1) {
      // Update existing service
      updatedServices[index] = serviceItem;
    } else {
      // Add new service
      updatedServices.push(serviceItem);
    }

    // Sort by order
    updatedServices = updatedServices.sort((a, b) => a.order - b.order);

    const updatedSettings: ServicesSettings = {
      ...settings,
      services: updatedServices,
      lastUpdated: new Date().toISOString(),
    };

    storageService.setServicesSettings(updatedSettings);
    setSettings(updatedSettings);
    setServices(updatedServices);
    setEditingService(null);
    setActiveTab("services");

    toast({
      title: index !== -1 ? "Service updated" : "Service added",
      description: `The service "${values.title}" has been ${index !== -1 ? "updated" : "added"}`,
    });
  };

  // Delete a service
  const handleDeleteService = (id: number) => {
    if (!settings) return;

    const updatedServices = services.filter(s => s.id !== id);
    
    // Reorder the remaining services
    updatedServices.forEach((service, index) => {
      service.order = index + 1;
    });

    const updatedSettings: ServicesSettings = {
      ...settings,
      services: updatedServices,
      lastUpdated: new Date().toISOString(),
    };

    storageService.setServicesSettings(updatedSettings);
    setSettings(updatedSettings);
    setServices(updatedServices);

    toast({
      title: "Service deleted",
      description: "The service has been removed",
    });
  };

  // Move a service up or down
  const handleMoveService = (id: number, direction: 'up' | 'down') => {
    if (!settings) return;

    const serviceIndex = services.findIndex(s => s.id === id);
    if (serviceIndex === -1) return;

    // Can't move up if already at the top
    if (direction === 'up' && serviceIndex === 0) return;
    // Can't move down if already at the bottom
    if (direction === 'down' && serviceIndex === services.length - 1) return;

    const updatedServices = [...services];
    const targetIndex = direction === 'up' ? serviceIndex - 1 : serviceIndex + 1;

    // Swap order values
    const tempOrder = updatedServices[serviceIndex].order;
    updatedServices[serviceIndex].order = updatedServices[targetIndex].order;
    updatedServices[targetIndex].order = tempOrder;

    // Sort by order
    const sortedServices = updatedServices.sort((a, b) => a.order - b.order);

    const updatedSettings: ServicesSettings = {
      ...settings,
      services: sortedServices,
      lastUpdated: new Date().toISOString(),
    };

    storageService.setServicesSettings(updatedSettings);
    setSettings(updatedSettings);
    setServices(sortedServices);

    toast({
      title: "Service moved",
      description: `The service has been moved ${direction}`,
    });
  };

  // Cancel service editing
  const handleCancelEdit = () => {
    setEditingService(null);
    setActiveTab("services");
  };

  if (!settings) {
    return (
      <AdminLayout>
        <div className="container mx-auto p-6">
          <p>Loading settings...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Services Section Settings</h1>
          <Button onClick={() => navigate("/admin")}>Back to Dashboard</Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="general">General Settings</TabsTrigger>
            <TabsTrigger value="services">Manage Services</TabsTrigger>
            {editingService && (
              <TabsTrigger value="edit-service">
                {editingService.id === 0 ? "Add Service" : `Edit ${editingService.title}`}
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Configure the general settings for the services section
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Section Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Our Services" {...field} />
                          </FormControl>
                          <FormDescription>
                            The main title displayed in the services section
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="subtitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Section Subtitle</FormLabel>
                          <FormControl>
                            <Input placeholder="What We Do" {...field} />
                          </FormControl>
                          <FormDescription>
                            The subtitle displayed above the main title
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Section Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="We provide comprehensive digital solutions..."
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            A brief description of your services
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Separator />

                    <FormField
                      control={form.control}
                      name="viewAllText"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>View All Button Text</FormLabel>
                          <FormControl>
                            <Input placeholder="View All Services" {...field} />
                          </FormControl>
                          <FormDescription>
                            The text for the button at the bottom of the section
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="viewAllUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>View All Button URL</FormLabel>
                          <FormControl>
                            <Input placeholder="/services" {...field} />
                          </FormControl>
                          <FormDescription>
                            The URL that the button links to
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full">
                      <Save className="mr-2 h-4 w-4" />
                      Save Settings
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services">
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Manage Services</h2>
              <Button onClick={handleAddService}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Service
              </Button>
            </div>

            {services.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center py-8 text-muted-foreground">
                    No services found. Click "Add New Service" to create one.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {services.map(service => {
                  const IconComponent = getIconComponentByName(service.iconName);
                  return (
                    <Card key={service.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            <div className={`rounded-lg w-10 h-10 flex items-center justify-center ${service.bgColor || "bg-secondary"}`}>
                              {IconComponent && (
                                <div className={service.color || "text-foreground"}>
                                  <IconComponent size={20} />
                                </div>
                              )}
                            </div>
                            <div>
                              <CardTitle className="text-lg">{service.title}</CardTitle>
                              <p className="text-sm text-muted-foreground mt-1">
                                Order: {service.order} • Link: {service.link}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleMoveService(service.id, 'up')}
                              disabled={service.order === 1}
                            >
                              <MoveUp className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleMoveService(service.id, 'down')}
                              disabled={service.order === services.length}
                            >
                              <MoveDown className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          {service.description.length > 100
                            ? `${service.description.substring(0, 100)}...`
                            : service.description}
                        </p>
                      </CardContent>
                      <CardFooter className="flex justify-end gap-2 pt-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditService(service)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteService(service.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="edit-service">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>
                    {editingService && editingService.id !== 0
                      ? `Edit Service: ${editingService.title}`
                      : "Add New Service"}
                  </CardTitle>
                  <Button variant="ghost" size="icon" onClick={handleCancelEdit}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <CardDescription>
                  {editingService && editingService.id !== 0
                    ? "Modify the service details"
                    : "Configure a new service to add to the homepage"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...serviceForm}>
                  <form onSubmit={serviceForm.handleSubmit(handleSaveService)} className="space-y-6">
                    <input
                      type="hidden"
                      {...serviceForm.register("id")}
                    />
                    <input
                      type="hidden"
                      {...serviceForm.register("order")}
                    />

                    <FormField
                      control={serviceForm.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Service Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Web Development" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={serviceForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Service Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe this service..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={serviceForm.control}
                      name="link"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Service Link</FormLabel>
                          <FormControl>
                            <Input placeholder="/services/web-development" {...field} />
                          </FormControl>
                          <FormDescription>
                            The URL that this service links to when "Learn More" is clicked
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={serviceForm.control}
                      name="iconName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Service Icon</FormLabel>
                          <FormControl>
                            <div className="border rounded-md p-4">
                              <IconSelector
                                selectedIcon={field.value}
                                onSelectIcon={(icon) => field.onChange(icon)}
                              />
                            </div>
                          </FormControl>
                          <FormDescription>
                            Select an icon for this service
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={serviceForm.control}
                        name="bgColor"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Icon Background Color</FormLabel>
                            <FormControl>
                              <div className="flex gap-2">
                                <Input {...field} />
                                <div 
                                  className={`w-10 h-10 rounded border ${field.value || "bg-secondary"}`}
                                />
                              </div>
                            </FormControl>
                            <FormDescription>
                              Tailwind class (e.g., bg-primary/10)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={serviceForm.control}
                        name="color"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Icon Color</FormLabel>
                            <FormControl>
                              <div className="flex gap-2">
                                <Input {...field} />
                                <div 
                                  className={`w-10 h-10 rounded border flex items-center justify-center ${field.value || "text-foreground"}`}
                                >
                                  <div className="w-6 h-6 bg-current" />
                                </div>
                              </div>
                            </FormControl>
                            <FormDescription>
                              Tailwind class (e.g., text-primary)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="pt-4 flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">
                        <Save className="mr-2 h-4 w-4" />
                        {editingService && editingService.id !== 0
                          ? "Update Service"
                          : "Add Service"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminServicesSettings;
