
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Code, Smartphone, Paintbrush, BarChart, Globe, ShoppingCart, FileText, Edit, Trash, Plus } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/lib/i18n";
import { storageService } from "@/lib/storage";
import { ContentItem } from "@/lib/types";
import draftToHtml from 'draftjs-to-html';
import { useUserRole } from "@/hooks/use-auth"; // Assuming you have this hook for auth checking

interface ServiceCardProps {
  title: string;
  description: string;
  formattedDescription?: {
    blocks: any[];
    entityMap: Record<string, any>;
  };
  icon: React.ReactNode;
  features: string[];
  link: string;
  delay: number;
  images?: string[];
  isAdmin?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  id: number;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ 
  title, 
  description, 
  formattedDescription,
  icon, 
  features, 
  link, 
  delay,
  images,
  isAdmin,
  onEdit,
  onDelete,
  id
}) => {
  const { t } = useLanguage();
  
  const renderDescription = () => {
    if (formattedDescription) {
      try {
        const htmlContent = draftToHtml(formattedDescription);
        return (
          <div className="prose prose-sm max-w-none">
            <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
          </div>
        );
      } catch (error) {
        console.error("Error rendering formatted description:", error);
        return <CardDescription>{description}</CardDescription>;
      }
    }
    
    return <CardDescription>{description}</CardDescription>;
  };
  
  return (
    <Card className={`overflow-hidden group hover:border-primary/50 hover:shadow-lg transition-all duration-300 should-animate delay-${delay}`}>
      <CardHeader className="pb-4">
        <div className="mb-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          {icon}
        </div>
        <CardTitle className="text-xl font-display">{title}</CardTitle>
        {renderDescription()}
      </CardHeader>
      
      {images && images.length > 0 && (
        <div className="px-6 mb-4">
          <img 
            src={images[0]} 
            alt={title} 
            className="w-full h-40 object-cover rounded-md"
          />
        </div>
      )}
      
      <CardContent>
        <ul className="space-y-2 mb-6">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2 text-sm">
              <div className="w-5 h-5 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
              </div>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        
        <Link
          to={link}
          className="inline-flex items-center gap-1.5 text-sm font-medium"
        >
          {t('learn.more')}
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </CardContent>
      
      {isAdmin && (
        <CardFooter className="pt-4 border-t flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </Button>
          <Button variant="destructive" size="sm" onClick={onDelete}>
            <Trash className="w-4 h-4 mr-1" />
            Delete
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

const getIconForService = (title: string) => {
  const normalizedTitle = title.toLowerCase();
  if (normalizedTitle.includes('web')) return <Code className="w-5 h-5 text-primary" />;
  if (normalizedTitle.includes('mobile')) return <Smartphone className="w-5 h-5 text-primary" />;
  if (normalizedTitle.includes('ui') || normalizedTitle.includes('ux') || normalizedTitle.includes('design')) return <Paintbrush className="w-5 h-5 text-primary" />;
  if (normalizedTitle.includes('market')) return <BarChart className="w-5 h-5 text-primary" />;
  if (normalizedTitle.includes('seo')) return <Globe className="w-5 h-5 text-primary" />;
  if (normalizedTitle.includes('commerce')) return <ShoppingCart className="w-5 h-5 text-primary" />;
  if (normalizedTitle.includes('content')) return <FileText className="w-5 h-5 text-primary" />;
  return <Code className="w-5 h-5 text-primary" />;
};

const ServicesList: React.FC = () => {
  const { t } = useLanguage();
  const [services, setServices] = useState<ContentItem[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Get user role to determine if they are an admin
  // Replace this with your actual auth logic or hook
  const userRole = 'admin'; // Simplified for this example, normally would use useUserRole() hook
  const isAdmin = userRole === 'admin';
  
  useEffect(() => {
    const loadServices = () => {
      const allContent = storageService.getAllContent();
      const serviceItems = allContent.filter(item => 
        item.type === "Service" && item.published === true
      );
      
      const sortedServices = [...serviceItems].sort((a, b) => {
        if (a.order !== undefined && b.order !== undefined) {
          return a.order - b.order;
        }
        return a.title.localeCompare(b.title);
      });
      
      setServices(sortedServices);
    };
    
    loadServices();
    
    const unsubscribe = storageService.addEventListener('content-updated', loadServices);
    const unsubscribeAdded = storageService.addEventListener('content-added', loadServices);
    const unsubscribeDeleted = storageService.addEventListener('content-deleted', loadServices);
    const unsubscribeSettings = storageService.addEventListener('services-settings-updated', loadServices);
    
    return () => {
      unsubscribe();
      unsubscribeAdded();
      unsubscribeDeleted();
      unsubscribeSettings();
    };
  }, []);
  
  const parseFeatures = (content?: string): string[] => {
    if (!content) return [];
    
    if (content.includes('- ') || content.includes('• ')) {
      return content
        .split(/\n/)
        .map(line => line.replace(/^[-•]\s*/, '').trim())
        .filter(Boolean);
    }
    
    return content
      .split(/\n/)
      .map(line => line.trim())
      .filter(Boolean)
      .slice(0, 5);
  };
  
  const handleEditService = (serviceId: number) => {
    navigate(`/admin/content?id=${serviceId}&type=Service&action=edit`);
  };
  
  const handleDeleteService = (serviceId: number) => {
    setSelectedServiceId(serviceId);
    setDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    if (selectedServiceId) {
      const success = storageService.deleteContent(selectedServiceId);
      if (success) {
        toast({
          title: "Service deleted",
          description: "The service has been successfully deleted.",
        });
      } else {
        toast({
          title: "Delete failed",
          description: "There was an error deleting the service.",
          variant: "destructive",
        });
      }
      setDeleteDialogOpen(false);
      setSelectedServiceId(null);
    }
  };
  
  const handleAddNewService = () => {
    navigate('/admin/content?type=Service&action=new');
  };
  
  if (services.length === 0) {
    return (
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground mb-6">
            No services found. Add some from the Content Management System.
          </p>
          {isAdmin && (
            <Button onClick={handleAddNewService}>
              <Plus className="w-4 h-4 mr-2" />
              Add Service
            </Button>
          )}
        </div>
      </section>
    );
  }
  
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="flex justify-between mb-8">
          <h2 className="text-3xl font-bold">{t('nav.services')}</h2>
          {isAdmin && (
            <Button onClick={handleAddNewService}>
              <Plus className="w-4 h-4 mr-2" />
              Add Service
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const features = parseFeatures(service.content);
            
            return (
              <ServiceCard
                key={service.id}
                id={service.id}
                title={service.title}
                description={service.description}
                formattedDescription={service.formattedContent}
                icon={getIconForService(service.title)}
                features={features.length > 0 ? features : [t('service.details')]}
                link={`/services/${service.slug || service.title.toLowerCase().replace(/\s+/g, '-')}`}
                delay={index * 100}
                images={service.images}
                isAdmin={isAdmin}
                onEdit={() => handleEditService(service.id)}
                onDelete={() => handleDeleteService(service.id)}
              />
            );
          })}
        </div>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Service</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this service? This action cannot be undone.</p>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default ServicesList;
