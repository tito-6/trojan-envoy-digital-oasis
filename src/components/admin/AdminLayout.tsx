import React, { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Layers, Users, Mail, Settings, Package, FileText, Home, Globe, Briefcase, MessageSquare, Image, Info } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLanguage } from '@/lib/i18n';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children: ReactNode;
}

interface NavItem {
  icon: React.ReactNode;
  label: string;
  path: string;
  badge?: number;
}

const navItems: NavItem[] = [
  { 
    icon: <Layers className="h-5 w-5" />, 
    label: "Dashboard", 
    path: "/admin" 
  },
  { 
    icon: <FileText className="h-5 w-5" />, 
    label: "Content Manager", 
    path: "/admin/content" 
  },
  { 
    icon: <Home className="h-5 w-5" />, 
    label: "Hero Settings", 
    path: "/admin/hero-settings" 
  },
  { 
    icon: <Info className="h-5 w-5" />, 
    label: "About Settings", 
    path: "/admin/about-settings" 
  },
  { 
    icon: <Package className="h-5 w-5" />, 
    label: "Services", 
    path: "/admin/services-settings" 
  },
  { 
    icon: <Globe className="h-5 w-5" />, 
    label: "Header & Navigation", 
    path: "/admin/header-settings" 
  },
  { 
    icon: <Mail className="h-5 w-5" />, 
    label: "Contact Requests", 
    path: "/admin/contacts",
    badge: 3
  },
  { 
    icon: <Users className="h-5 w-5" />, 
    label: "User Management", 
    path: "/admin/users" 
  },
  { 
    icon: <Settings className="h-5 w-5" />, 
    label: "Site Settings", 
    path: "/admin/settings" 
  }
];

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-secondary border-r border-r-border transition-transform duration-300 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 z-50`}
      >
        <div className="flex items-center justify-between p-4">
          <Link to="/" className="font-bold text-xl">
            Admin Panel
          </Link>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={toggleSidebar}>
            {isSidebarOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </Button>
        </div>
        <Separator />
        <nav className="p-4">
          <ul>
            {navItems.map((item) => (
              <li key={item.label} className="mb-2">
                <Link
                  to={item.path}
                  className={cn(
                    'flex items-center p-2 rounded-md hover:bg-secondary/50 transition-colors duration-200',
                    location.pathname === item.path ? 'bg-secondary/50 font-medium' : ''
                  )}
                  onClick={closeSidebar}
                >
                  {item.icon}
                  <span className="ml-3">{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto px-2 py-0.5 bg-primary text-primary-foreground rounded-full text-xs font-medium">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-x-hidden">
        {/* Header */}
        <header className="bg-background border-b border-b-border h-16 flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center sm:space-x-4">
            <Button variant="ghost" size="icon" className="mr-2 lg:hidden" onClick={toggleSidebar}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </Button>
            <h1 className="text-xl font-semibold">{t('admin.dashboard')}</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Button variant="outline" size="sm" onClick={() => navigate('/admin/login')}>
              Logout
            </Button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
