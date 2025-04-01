
import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import HeroSettingsForm from "@/components/admin/HeroSettingsForm";
import PartnerLogosManager from "@/components/admin/PartnerLogosManager";
import TechStackManager from "@/components/admin/TechStackManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminHero: React.FC = () => {
  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Hero Section Management</h1>
          <p className="text-muted-foreground mt-2">
            Customize your site's hero section, partner logos, and technology stack display.
          </p>
        </div>
        
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">General Settings</TabsTrigger>
            <TabsTrigger value="partners">Partner Logos</TabsTrigger>
            <TabsTrigger value="techstack">Technology Stack</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-4">
            <HeroSettingsForm />
          </TabsContent>
          
          <TabsContent value="partners" className="space-y-4">
            <PartnerLogosManager />
          </TabsContent>
          
          <TabsContent value="techstack" className="space-y-4">
            <TechStackManager />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminHero;
