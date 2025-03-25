
import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";

// This is a wrapper component that will redirect to the admin login or dashboard
const Admin: React.FC = () => {
  // Check if user is logged in - in a real app, this would check authentication
  const isLoggedIn = false; // This would be a real auth check
  
  // Redirect to the appropriate page
  if (isLoggedIn) {
    return <Navigate to="/admin/dashboard" replace />;
  } else {
    return <Navigate to="/admin/login" replace />;
  }
};

export default Admin;
