
import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import ContentForm from "@/components/admin/ContentForm";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Plus, 
  Search, 
  FileText, 
  Image, 
  Trash2, 
  Edit, 
  Filter,
  ArrowUpDown,
  GanttChart
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { storageService } from "@/lib/storage";
import { ContentItem } from "@/lib/types";

const AdminContent: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [isNewContentDialogOpen, setIsNewContentDialogOpen] = useState(false);
  const [isEditContentDialogOpen, setIsEditContentDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<ContentItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [sortField, setSortField] = useState<keyof ContentItem>('lastUpdated');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const { toast } = useToast();
  
  // Load content from storage service
  useEffect(() => {
    loadContent();
    
    // Subscribe to content changes
    const unsubscribeAdded = storageService.addEventListener('content-added', () => loadContent());
    const unsubscribeUpdated = storageService.addEventListener('content-updated', () => loadContent());
    const unsubscribeDeleted = storageService.addEventListener('content-deleted', () => loadContent());
    
    return () => {
      unsubscribeAdded();
      unsubscribeUpdated();
      unsubscribeDeleted();
    };
  }, []);
  
  const loadContent = () => {
    const content = storageService.getAllContent();
    setContentItems(content);
  };
  
  // Filter content based on search and type filter
  const filteredContent = contentItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType ? item.type === selectedType : true;
    return matchesSearch && matchesType;
  });
  
  // Sort content
  const sortedContent = [...filteredContent].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue) 
        : bValue.localeCompare(aValue);
    }
    
    // Handle numbers or default to 0
    const aNum = aValue || 0;
    const bNum = bValue || 0;
    
    return sortDirection === 'asc' ? +aNum - +bNum : +bNum - +aNum;
  });
  
  // Get unique content types for filter dropdown
  const contentTypes = Array.from(new Set(contentItems.map(item => item.type)));
  
  const handleSortChange = (field: keyof ContentItem) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  const handleSaveContent = (values: any) => {
    // In a real application, this would send the data to a backend API
    const newContent = storageService.addContent({
      title: values.title,
      type: values.type,
      subtitle: values.subtitle,
      description: values.description,
      seoTitle: values.seoTitle,
      seoDescription: values.seoDescription,
      seoKeywords: values.keywords,
      content: values.content,
      published: true,
      slug: values.title.toLowerCase().replace(/\s+/g, '-'),
      images: values.images?.map((img: File) => URL.createObjectURL(img)) || [],
      videos: values.videos || [],
      documents: values.documents?.map((doc: File) => URL.createObjectURL(doc)) || []
    });
    
    setIsNewContentDialogOpen(false);
    
    toast({
      title: "Content created successfully",
      description: `${values.title} has been added to the content library.`,
      variant: "default",
    });
  };
  
  const handleUpdateContent = (values: any) => {
    if (!itemToEdit) return;
    
    const updatedContent = storageService.updateContent(itemToEdit.id, {
      title: values.title,
      type: values.type,
      subtitle: values.subtitle,
      description: values.description,
      seoTitle: values.seoTitle,
      seoDescription: values.seoDescription,
      seoKeywords: values.keywords,
      content: values.content,
      slug: values.title.toLowerCase().replace(/\s+/g, '-'),
      // Handle file uploads properly in a real application
      images: values.images?.map((img: File | string) => 
        typeof img === 'string' ? img : URL.createObjectURL(img)
      ) || itemToEdit.images,
      videos: values.videos || itemToEdit.videos,
      documents: values.documents?.map((doc: File | string) => 
        typeof doc === 'string' ? doc : URL.createObjectURL(doc)
      ) || itemToEdit.documents
    });
    
    setIsEditContentDialogOpen(false);
    setItemToEdit(null);
    
    toast({
      title: "Content updated successfully",
      description: `${values.title} has been updated.`,
      variant: "default",
    });
  };
  
  const handleEdit = (item: ContentItem) => {
    setItemToEdit(item);
    setIsEditContentDialogOpen(true);
  };
  
  const confirmDelete = (id: number) => {
    setItemToDelete(id);
    setIsDeleteDialogOpen(true);
  };
  
  const handleDelete = () => {
    if (itemToDelete) {
      const deletedItem = contentItems.find(item => item.id === itemToDelete);
      const success = storageService.deleteContent(itemToDelete);
      
      if (success) {
        toast({
          title: "Content deleted",
          description: `"${deletedItem?.title}" has been removed.`,
          variant: "default",
        });
      }
      
      setIsDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };
  
  const getTypeVariant = (type: string) => {
    switch (type) {
      case "Blog Post": return "default";
      case "Portfolio": return "success";
      case "Service": return "secondary";
      case "Page": return "blue";
      default: return "outline";
    }
  };
  
  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-display font-bold">Content Management</h1>
          
          <div className="flex space-x-2">
            <Button onClick={() => setIsNewContentDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add New Content
            </Button>
            <Button variant="outline">
              <GanttChart className="w-4 h-4 mr-2" />
              Content Structure
            </Button>
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-lg shadow-sm">
          <div className="p-4 border-b border-border">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search content..."
                  className="w-full pl-10"
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
                    <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSortChange('id')}>
                      <span>ID</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">
                    <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSortChange('title')}>
                      <span>TITLE</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">
                    <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSortChange('type')}>
                      <span>TYPE</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">
                    <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSortChange('published')}>
                      <span>STATUS</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">
                    <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSortChange('lastUpdated')}>
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
                {sortedContent.length > 0 ? (
                  sortedContent.map((item) => (
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
                      <td className="py-3 px-4 text-sm">
                        <Badge variant={getTypeVariant(item.type)}>
                          {item.type}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <Badge variant={item.published ? "success" : "outline"}>
                          {item.published ? "Published" : "Draft"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm">{item.lastUpdated}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0"
                            onClick={() => handleEdit(item)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 text-destructive"
                            onClick={() => confirmDelete(item.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-muted-foreground">
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
              <Button variant="outline" size="sm" disabled={filteredContent.length === contentItems.length}>
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* New Content Dialog */}
      <Dialog open={isNewContentDialogOpen} onOpenChange={setIsNewContentDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Content</DialogTitle>
          </DialogHeader>
          <ContentForm 
            onSave={handleSaveContent}
            onCancel={() => setIsNewContentDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Content Dialog */}
      <Dialog open={isEditContentDialogOpen} onOpenChange={setIsEditContentDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Content</DialogTitle>
          </DialogHeader>
          {itemToEdit && (
            <ContentForm 
              initialValues={{
                title: itemToEdit.title,
                type: itemToEdit.type,
                subtitle: itemToEdit.subtitle || '',
                description: itemToEdit.description,
                seoTitle: itemToEdit.seoTitle || '',
                seoDescription: itemToEdit.seoDescription || '',
                seoKeywords: itemToEdit.seoKeywords?.join(', ') || '',
                content: itemToEdit.content || '',
                keywords: itemToEdit.seoKeywords || [],
                images: itemToEdit.images || [],
                videos: itemToEdit.videos || [],
                documents: itemToEdit.documents || []
              }}
              onSave={handleUpdateContent}
              onCancel={() => {
                setIsEditContentDialogOpen(false);
                setItemToEdit(null);
              }}
              isEditing={true}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this content? This action cannot be undone.</p>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminContent;
