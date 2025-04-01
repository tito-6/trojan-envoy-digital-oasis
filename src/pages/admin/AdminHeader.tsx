
import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import HeaderSettingsForm from "@/components/admin/HeaderSettingsForm";
import NavigationManager from "@/components/admin/NavigationManager";

const AdminHeader: React.FC = () => {
  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Header Management</h1>
          <p className="text-muted-foreground mt-2">
            Customize your site's header, navigation, and appearance settings.
          </p>
        </div>
        
        <div className="grid gap-8">
          <HeaderSettingsForm />
          <NavigationManager />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminHeader;
