
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

// This is a wrapper component that will redirect to the admin login or dashboard
const Admin: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();
  
  useEffect(() => {
    // Check if user is logged in using localStorage
    const checkAuth = () => {
      const adminToken = localStorage.getItem("admin-token");
      const adminUser = localStorage.getItem("admin-user");
      
      if (adminToken && adminUser) {
        try {
          // Verify the token is valid (in a real app, you'd verify this with the backend)
          const userData = JSON.parse(adminUser);
          if (userData.email) {
            setIsLoggedIn(true);
            toast({
              title: "Authentication Restored",
              description: `Welcome back, ${userData.name || userData.email}.`,
            });
          }
        } catch (error) {
          // Handle invalid stored data
          localStorage.removeItem("admin-token");
          localStorage.removeItem("admin-user");
        }
      }
      setIsLoading(false);
    };
    
    checkAuth();
  }, [toast]);
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // Redirect to the appropriate page
  if (isLoggedIn) {
    return <Navigate to="/admin/dashboard" replace />;
  } else {
    return <Navigate to="/admin/login" replace />;
  }
};

export default Admin;
