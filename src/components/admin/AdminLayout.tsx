import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  FileText, 
  MessageSquare, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  ChevronDown,
  Users,
  Shield,
  MonitorSmartphone,
  Info,
  Building,
  HelpCircle,
  Mail,
  FootprintsIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { useToast } from "@/hooks/use-toast";

interface SidebarItemProps {
  icon: React.ReactNode;
  title: string;
  active?: boolean;
  href: string;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ 
  icon, title, active, href, onClick 
}) => {
  return (
    <Link
      to={href}
      className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
        active 
          ? "bg-primary text-primary-foreground font-medium" 
          : "hover:bg-secondary"
      }`}
      onClick={onClick}
    >
      {icon}
      <span>{title}</span>
    </Link>
  );
};

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  
  const handleLogout = () => {
    // In a real app, this would handle the logout logic
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
      variant: "default",
    });
    
    // Navigate to login page
    setTimeout(() => {
      navigate("/admin/login");
    }, 1000);
  };
  
  const navigationItems = [
    { 
      title: "Dashboard", 
      icon: <LayoutDashboard className="w-4 h-4" />, 
      href: "/admin/dashboard" 
    },
    { 
      title: "Content Management", 
      icon: <FileText className="w-4 h-4" />, 
      href: "/admin/content" 
    },
    { 
      title: "Header Management", 
      icon: <MonitorSmartphone className="w-4 h-4" />, 
      href: "/admin/header" 
    },
    { 
      title: "Hero Management", 
      icon: <Shield className="w-4 h-4" />, 
      href: "/admin/hero" 
    },
    { 
      title: "About Management", 
      icon: <Info className="w-4 h-4" />, 
      href: "/admin/about-settings" 
    },
    { 
      title: "Services Management", 
      icon: <FileText className="w-4 h-4" />, 
      href: "/admin/services-settings" 
    },
    { 
      title: "References Management", 
      icon: <Building className="w-4 h-4" />, 
      href: "/admin/references-settings" 
    },
    { 
      title: "FAQ Management", 
      icon: <HelpCircle className="w-4 h-4" />, 
      href: "/admin/faq-settings" 
    },
    { 
      title: "Contact Management", 
      icon: <Mail className="w-4 h-4" />, 
      href: "/admin/contact-settings" 
    },
    { 
      title: "Footer Management", 
      icon: <FootprintsIcon className="w-4 h-4" />, 
      href: "/admin/footer-settings" 
    },
    { 
      title: "Contact Requests", 
      icon: <MessageSquare className="w-4 h-4" />, 
      href: "/admin/contacts" 
    },
    { 
      title: "User Management", 
      icon: <Users className="w-4 h-4" />, 
      href: "/admin/users" 
    },
    { 
      title: "Settings", 
      icon: <Settings className="w-4 h-4" />, 
      href: "/admin/settings" 
    },
  ];
  
  const closeSidebar = () => {
    setOpen(false);
  };
  
  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-border bg-card">
        <div className="p-4 border-b border-border flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          <h1 className="font-display font-bold">Admin Panel</h1>
        </div>
        
        <div className="flex flex-col p-3 gap-1 flex-grow overflow-y-auto">
          {navigationItems.map((item) => (
            <SidebarItem
              key={item.title}
              {...item}
              active={location.pathname === item.href}
            />
          ))}
        </div>
        
        <div className="mt-auto p-3 border-t border-border">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>
      
      {/* Main Content */}
      <div className="flex-grow flex flex-col">
        {/* Top Bar */}
        <header className="h-14 border-b border-border flex items-center justify-between px-4">
          <div className="flex items-center md:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0">
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    <h1 className="font-display font-bold">Admin Panel</h1>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                
                <div className="flex flex-col p-3 gap-1 overflow-y-auto max-h-[calc(100vh-80px)]">
                  {navigationItems.map((item) => (
                    <SidebarItem
                      key={item.title}
                      {...item}
                      active={location.pathname === item.href}
                      onClick={closeSidebar}
                    />
                  ))}
                </div>
                
                <div className="mt-auto p-3 border-t border-border">
                  <button
                    onClick={() => {
                      handleLogout();
                      closeSidebar();
                    }}
                    className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          
          <div className="md:hidden flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <span className="font-display font-bold">Admin</span>
          </div>
          
          <div className="flex items-center ml-auto gap-2">
            <ThemeToggle />
            
            <div className="relative">
              <Button variant="ghost" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                  <span className="text-xs font-medium">A</span>
                </div>
                <span className="hidden md:inline-block">Admin User</span>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="flex-grow bg-background overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
