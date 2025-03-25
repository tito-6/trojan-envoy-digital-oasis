
import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  Mail, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Trash2, 
  MessageSquare
} from "lucide-react";

// Sample contact request data
const contactRequests = [
  { 
    id: 1, 
    name: "John Smith", 
    email: "john.smith@example.com", 
    subject: "Website Development Project", 
    date: "2023-11-05", 
    status: "New" 
  },
  { 
    id: 2, 
    name: "Emily Johnson", 
    email: "emily.j@example.com", 
    subject: "Digital Marketing Inquiry", 
    date: "2023-11-04", 
    status: "Replied" 
  },
  { 
    id: 3, 
    name: "Michael Brown", 
    email: "michael.brown@example.com", 
    subject: "Mobile App Development", 
    date: "2023-11-02", 
    status: "Pending" 
  },
  { 
    id: 4, 
    name: "Sarah Williams", 
    email: "sarah.w@example.com", 
    subject: "SEO Services", 
    date: "2023-10-29", 
    status: "Replied" 
  },
  { 
    id: 5, 
    name: "David Miller", 
    email: "david.miller@example.com", 
    subject: "Custom Software Development", 
    date: "2023-10-25", 
    status: "New" 
  },
  { 
    id: 6, 
    name: "Jennifer Lee", 
    email: "jennifer.lee@example.com", 
    subject: "E-commerce Website", 
    date: "2023-10-22", 
    status: "Replied" 
  },
  { 
    id: 7, 
    name: "Robert Wilson", 
    email: "robert.w@example.com", 
    subject: "Consultation Request", 
    date: "2023-10-18", 
    status: "Pending" 
  },
  { 
    id: 8, 
    name: "Lisa Anderson", 
    email: "lisa.anderson@example.com", 
    subject: "WordPress Development", 
    date: "2023-10-15", 
    status: "New" 
  },
];

const AdminContacts: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  
  // Filter contacts based on search and status filter
  const filteredContacts = contactRequests.filter(contact => {
    const matchesSearch = 
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus ? contact.status === selectedStatus : true;
    return matchesSearch && matchesStatus;
  });
  
  // Get unique statuses for filter dropdown
  const statuses = Array.from(new Set(contactRequests.map(contact => contact.status)));
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'New':
        return <AlertCircle className="w-4 h-4 text-blue-500" />;
      case 'Replied':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'Pending':
        return <Clock className="w-4 h-4 text-amber-500" />;
      default:
        return null;
    }
  };
  
  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-display font-bold">Contact Requests</h1>
          
          <div className="flex items-center justify-end gap-2">
            <div className="bg-secondary text-secondary-foreground rounded-md px-3 py-1 text-sm flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span>New: {contactRequests.filter(c => c.status === 'New').length}</span>
            </div>
            
            <div className="bg-secondary text-secondary-foreground rounded-md px-3 py-1 text-sm flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-amber-500"></div>
              <span>Pending: {contactRequests.filter(c => c.status === 'Pending').length}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-lg shadow-sm">
          <div className="p-4 border-b border-border">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search contacts..."
                  className="w-full pl-10 pr-4 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="relative">
                <select
                  className="w-full md:w-48 px-4 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none pl-4 pr-10"
                  value={selectedStatus || ""}
                  onChange={(e) => setSelectedStatus(e.target.value || null)}
                >
                  <option value="">All Statuses</option>
                  {statuses.map(status => (
                    <option key={status} value={status}>{status}</option>
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
                      <span>NAME</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">
                    <div className="flex items-center gap-1 cursor-pointer">
                      <span>EMAIL</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">
                    <div className="flex items-center gap-1 cursor-pointer">
                      <span>SUBJECT</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">
                    <div className="flex items-center gap-1 cursor-pointer">
                      <span>DATE</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">
                    <div className="flex items-center gap-1 cursor-pointer">
                      <span>STATUS</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredContacts.length > 0 ? (
                  filteredContacts.map((contact) => (
                    <tr key={contact.id} className="border-b border-border last:border-0 hover:bg-secondary/20">
                      <td className="py-3 px-4 text-sm">{contact.id}</td>
                      <td className="py-3 px-4 font-medium">{contact.name}</td>
                      <td className="py-3 px-4 text-sm">{contact.email}</td>
                      <td className="py-3 px-4 text-sm">{contact.subject}</td>
                      <td className="py-3 px-4 text-sm">{contact.date}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          {getStatusIcon(contact.status)}
                          <span className="text-sm">{contact.status}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MessageSquare className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Mail className="w-4 h-4" />
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
                    <td colSpan={7} className="py-8 text-center text-muted-foreground">
                      No contacts found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="p-4 border-t border-border flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {filteredContacts.length} of {contactRequests.length} items
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

export default AdminContacts;
