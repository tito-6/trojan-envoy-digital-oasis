
import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { 
  Users, 
  MessageSquare, 
  FileText, 
  TrendingUp, 
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  MonitorSmartphone,
  Shield,
  Settings,
  Palette,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface AdminSectionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
}

const AdminSectionCard: React.FC<AdminSectionCardProps> = ({ 
  title, description, icon, href 
}) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            {icon}
          </div>
          <CardTitle>{title}</CardTitle>
        </div>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      <CardFooter className="pt-2">
        <Button
          variant="secondary"
          onClick={() => navigate(href)}
          className="w-full"
        >
          Manage {title}
        </Button>
      </CardFooter>
    </Card>
  );
};

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  const stats = [
    { 
      title: "Total Visitors", 
      value: "12,543", 
      change: "+14%", 
      trend: "up",
      icon: <Eye className="w-5 h-5" /> 
    },
    { 
      title: "Contact Requests", 
      value: "352", 
      change: "+27%", 
      trend: "up",
      icon: <MessageSquare className="w-5 h-5" /> 
    },
    { 
      title: "Blog Posts", 
      value: "48", 
      change: "+5%", 
      trend: "up",
      icon: <FileText className="w-5 h-5" /> 
    },
    { 
      title: "Portfolio Items", 
      value: "24", 
      change: "-2%", 
      trend: "down",
      icon: <TrendingUp className="w-5 h-5" /> 
    },
  ];

  const adminSections = [
    {
      title: "Content",
      description: "Manage pages, blog posts, and all website content",
      icon: <FileText className="w-5 h-5" />,
      href: "/admin/content"
    },
    {
      title: "Header",
      description: "Edit navigation, logo, and header settings",
      icon: <MonitorSmartphone className="w-5 h-5" />,
      href: "/admin/header"
    },
    {
      title: "Hero",
      description: "Update homepage hero section content and images",
      icon: <Shield className="w-5 h-5" />,
      href: "/admin/hero"
    },
    {
      title: "About",
      description: "Manage about section content and statistics",
      icon: <Info className="w-5 h-5" />,
      href: "/admin/about-settings"
    },
    {
      title: "Services",
      description: "Edit services displayed on the homepage",
      icon: <Palette className="w-5 h-5" />,
      href: "/admin/services-settings"
    },
    {
      title: "Contacts",
      description: "View and manage contact form submissions",
      icon: <MessageSquare className="w-5 h-5" />,
      href: "/admin/contacts"
    },
    {
      title: "Users",
      description: "Manage user accounts and permissions",
      icon: <Users className="w-5 h-5" />,
      href: "/admin/users"
    },
    {
      title: "Settings",
      description: "Configure global website settings",
      icon: <Settings className="w-5 h-5" />,
      href: "/admin/settings"
    }
  ];

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-display font-bold mb-6">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  {stat.icon}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className={`text-xs flex items-center mt-1 ${
                  stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                }`}>
                  {stat.trend === 'up' ? (
                    <ArrowUpRight className="w-3 h-3 mr-1" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3 mr-1" />
                  )}
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <h2 className="text-xl font-semibold mb-4">Admin Sections</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {adminSections.map((section) => (
            <AdminSectionCard
              key={section.title}
              title={section.title}
              description={section.description}
              icon={section.icon}
              href={section.href}
            />
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Contact Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center justify-between pb-4 border-b border-border last:border-0 last:pb-0">
                    <div>
                      <h3 className="font-medium">John Doe {i}</h3>
                      <p className="text-sm text-muted-foreground">Project Inquiry</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">{i} day{i !== 1 ? 's' : ''} ago</p>
                      <p className="text-xs text-muted-foreground">Via contact form</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {["New blog post created", "Contact form updated", "Portfolio item added", "About page content edited", "New user registered"].map((activity, i) => (
                  <div key={i} className="flex items-center gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
                    <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0"></div>
                    <div>
                      <h3 className="font-medium">{activity}</h3>
                      <p className="text-sm text-muted-foreground">{i + 1} day{i !== 0 ? 's' : ''} ago</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
