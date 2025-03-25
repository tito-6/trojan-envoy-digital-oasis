
import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Search, 
  FileText, 
  Image, 
  Trash2, 
  Edit, 
  Filter,
  ArrowUpDown
} from "lucide-react";

// Sample content data
const contentItems = [
  { id: 1, title: "Home Hero Section", type: "Page Section", lastUpdated: "2023-11-05" },
  { id: 2, title: "About Us Page", type: "Page", lastUpdated: "2023-10-28" },
  { id: 3, title: "Web Development Services", type: "Service", lastUpdated: "2023-10-15" },
  { id: 4, title: "Mobile App Development", type: "Service", lastUpdated: "2023-10-10" },
  { id: 5, title: "Digital Marketing Overview", type: "Service", lastUpdated: "2023-09-22" },
  { id: 6, title: "E-commerce Project", type: "Portfolio", lastUpdated: "2023-09-15" },
  { id: 7, title: "Healthcare Mobile App", type: "Portfolio", lastUpdated: "2023-09-10" },
  { id: 8, title: "Top 10 SEO Strategies", type: "Blog Post", lastUpdated: "2023-08-28" },
  { id: 9, title: "Contact Information", type: "Page Section", lastUpdated: "2023-08-15" },
  { id: 10, title: "Company Values", type: "Page Section", lastUpdated: "2023-08-05" },
];

const AdminContent: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  
  // Filter content based on search and type filter
  const filteredContent = contentItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType ? item.type === selectedType : true;
    return matchesSearch && matchesType;
  });
  
  // Get unique content types for filter dropdown
  const contentTypes = Array.from(new Set(contentItems.map(item => item.type)));
  
  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-display font-bold">Content Management</h1>
          
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add New Content
          </Button>
        </div>
        
        <div className="bg-card border border-border rounded-lg shadow-sm">
          <div className="p-4 border-b border-border">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search content..."
                  className="w-full pl-10 pr-4 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="relative">
                <select
                  className="w-full md:w-48 px-4 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none pl-4 pr-10"
                  value={selectedType || ""}
                  onChange={(e) => setSelectedType(e.target.value || null)}
                >
                  <option value="">All Types</option>
                  {contentTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 pointer-events-none" />
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">
                    <div className="flex items-center gap-1 cursor-pointer">
                      <span>ID</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">
                    <div className="flex items-center gap-1 cursor-pointer">
                      <span>TITLE</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">
                    <div className="flex items-center gap-1 cursor-pointer">
                      <span>TYPE</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">
                    <div className="flex items-center gap-1 cursor-pointer">
                      <span>LAST UPDATED</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredContent.length > 0 ? (
                  filteredContent.map((item) => (
                    <tr key={item.id} className="border-b border-border last:border-0 hover:bg-secondary/20">
                      <td className="py-3 px-4 text-sm">{item.id}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {item.type === "Blog Post" ? (
                            <FileText className="w-4 h-4 text-blue-500" />
                          ) : item.type === "Portfolio" ? (
                            <Image className="w-4 h-4 text-green-500" />
                          ) : (
                            <FileText className="w-4 h-4 text-gray-500" />
                          )}
                          <span className="font-medium">{item.title}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm">{item.type}</td>
                      <td className="py-3 px-4 text-sm">{item.lastUpdated}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-muted-foreground">
                      No content found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="p-4 border-t border-border flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {filteredContent.length} of {contentItems.length} items
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminContent;
