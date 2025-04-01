
import { useState, useEffect } from 'react';
import { storageService } from '@/lib/storage';

export const useUserRole = (): string => {
  const [role, setRole] = useState<string>('guest');

  useEffect(() => {
    // Check for admin status in local storage or cookies
    const checkAdminStatus = () => {
      const isAdmin = localStorage.getItem('admin-logged-in');
      if (isAdmin === 'true') {
        setRole('admin');
      } else {
        setRole('guest');
      }
    };

    checkAdminStatus();
    
    // Listen for storage events (if user logs in from another tab)
    window.addEventListener('storage', checkAdminStatus);
    
    return () => {
      window.removeEventListener('storage', checkAdminStatus);
    };
  }, []);

  return role;
};

export const useAuth = () => {
  const role = useUserRole();
  const isAdmin = role === 'admin';
  
  const login = (username: string, password: string): boolean => {
    // In a real app, this would call an API
    // For this demo, we're just checking if username contains 'admin'
    const success = username.toLowerCase().includes('admin');
    
    if (success) {
      localStorage.setItem('admin-logged-in', 'true');
      localStorage.setItem('admin-username', username);
    }
    
    return success;
  };
  
  const logout = () => {
    localStorage.removeItem('admin-logged-in');
    localStorage.removeItem('admin-username');
  };
  
  const getUsername = (): string => {
    return localStorage.getItem('admin-username') || '';
  };
  
  return {
    isAdmin,
    role,
    login,
    logout,
    getUsername
  };
};

export default useAuth;
