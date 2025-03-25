import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import ContentForm from "@/components/admin/ContentForm";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { 
  Plus, 
  Search, 
  FileText, 
  Image, 
  Trash2, 
  Edit, 
  Filter,
  ArrowUpDown,
  GanttChart,
  Globe,
  Menu
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { storageService } from "@/lib/storage";
import { ContentItem, NavigationItem } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { availableLanguages } from "@/lib/i18n";

const AdminContent: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [navigationItems, setNavigationItems] = useState<NavigationItem[]>([]);
  const [isNewContentDialogOpen, setIsNewContentDialogOpen] = useState(false);
  const [isEditContentDialogOpen, setIsEditContentDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isNavigationDialogOpen, setIsNavigationDialogOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<ContentItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [sortField, setSortField] = useState<keyof ContentItem>('lastUpdated');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [activeTab, setActiveTab] = useState("all");
  const [recentActions, setRecentActions] = useState<{
    item: ContentItem;
    action: 'created' | 'updated';
    timestamp: number;
  }[]>([]);
  const { toast } = useToast();
  
  useEffect(() => {
    loadContent();
    loadNavigation();
    
    const unsubscribeAdded = storageService.addEventListener('content-added', (item) => {
      loadContent();
      loadNavigation();
      
      setRecentActions(prev => [
        { item, action: 'created', timestamp: Date.now() },
        ...prev.slice(0, 4)
      ]);
    });
    
    const unsubscribeUpdated = storageService.addEventListener('content-updated', (item) => {
      loadContent();
      loadNavigation();
      
      setRecentActions(prev => [
        { item, action: 'updated', timestamp: Date.now() },
        ...prev.slice(0, 4)
      ]);
    });
    
    const unsubscribeDeleted = storageService.addEventListener('content-deleted', () => {
      loadContent();
      loadNavigation();
    });
    
    const unsubscribeNavUpdated = storageService.addEventListener('navigation-updated', () => loadNavigation());
    
    return () => {
      unsubscribeAdded();
      unsubscribeUpdated();
      unsubscribeDeleted();
      unsubscribeNavUpdated();
    };
  }, []);
  
  const loadContent = () => {
    const content = storageService.getAllContent();
    setContentItems(content);
  };
  
  const loadNavigation = () => {
    const navigation = storageService.getAllNavigationItems();
    setNavigationItems(navigation);
  };
  
  const filteredContent = contentItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType ? item.type === selectedType : true;
    const matchesLanguage = selectedLanguage ? item.language === selectedLanguage : true;
    const matchesTab = activeTab === "all" || 
                       (activeTab === "pages" && item.type === "Page") ||
                       (activeTab === "sections" && item.type === "Page Section") ||
                       (activeTab === "blog" && item.type === "Blog Post") ||
                       (activeTab === "services" && item.type === "Service") ||
                       (activeTab === "portfolio" && item.type === "Portfolio");
    
    return matchesSearch && matchesType && matchesLanguage && matchesTab;
  });
  
  const sortedContent = [...filteredContent].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue) 
        : bValue.localeCompare(aValue);
    }
    
    const aNum = aValue || 0;
    const bNum = bValue || 0;
    
    return sortDirection === 'asc' ? +aNum - +bNum : +bNum - +aNum;
  });
  
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
    const placement = values.placement && (values.placement.pageId || values.placement.sectionId || values.placement.position) 
      ? values.placement 
      : undefined;
    
    const newContent = storageService.addContent({
      title: values.title,
      type: values.type,
      subtitle: values.subtitle,
      description: values.description,
      seoTitle: values.seoTitle,
      seoDescription: values.seoDescription,
      seoKeywords: values.keywords,
      content: values.content,
      published: values.published,
      slug: values.slug,
      showInNavigation: values.showInNavigation,
      language: values.language,
      placement,
      images: values.images?.map((img: File) => URL.createObjectURL(img)) || [],
      videos: values.videos || [],
      documents: values.documents?.map((doc: File) => URL.createObjectURL(doc)) || []
    });
    
    setIsNewContentDialogOpen(false);
    
    const contentTypeLabel = values.type.toLowerCase();
    const viewableTypes = ["blog post", "page", "service", "portfolio"];
    
    if (values.published && viewableTypes.includes(contentTypeLabel)) {
      const viewPath = contentTypeLabel === "blog post" 
        ? `/blog/${values.slug}` 
        : contentTypeLabel === "page" 
          ? `/${values.slug}` 
          : `/${contentTypeLabel}/${values.slug}`;
          
      toast({
        title: `${values.title} created successfully`,
        description: (
          <div className="mt-2 flex flex-col gap-2">
            <p>This content is now published and visible on the website.</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2 text-xs"
              onClick={() => window.open(viewPath, '_blank')}
            >
              View on website
            </Button>
          </div>
        ),
        variant: "default",
      });
    } else {
      toast({
        title: "Content created successfully",
        description: values.published 
          ? `${values.title} has been added to the content library and is published.`
          : `${values.title} has been saved as a draft in the content library.`,
        variant: "default",
      });
    }
  };
  
  const handleUpdateContent = (values: any) => {
    if (!itemToEdit) return;
    
    const placement = values.placement && (values.placement.pageId || values.placement.sectionId || values.placement.position) 
      ? values.placement 
      : undefined;
    
    const updatedContent = storageService.updateContent(itemToEdit.id, {
      title: values.title,
      type: values.type,
      subtitle: values.subtitle,
      description: values.description,
      seoTitle: values.seoTitle,
      seoDescription: values.seoDescription,
      seoKeywords: values.keywords,
      content: values.content,
      slug: values.slug,
      showInNavigation: values.showInNavigation,
      language: values.language,
      placement,
      published: values.published,
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
    
    const contentTypeLabel = values.type.toLowerCase();
    const viewableTypes = ["blog post", "page", "service", "portfolio"];
    
    if (values.published && viewableTypes.includes(contentTypeLabel)) {
      const viewPath = contentTypeLabel === "blog post" 
        ? `/blog/${values.slug}` 
        : contentTypeLabel === "page" 
          ? `/${values.slug}` 
          : `/${contentTypeLabel}/${values.slug}`;
          
      toast({
        title: `${values.title} updated successfully`,
        description: (
          <div className="mt-2 flex flex-col gap-2">
            <p>The updated content is now visible on the website.</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2 text-xs"
              onClick={() => window.open(viewPath, '_blank')}
            >
              View on website
            </Button>
          </div>
        ),
        variant: "default",
      });
    } else {
      toast({
        title: "Content updated successfully",
        description: values.published 
          ? `${values.title} has been updated and is published.`
          : `${values.title} has been updated and saved as a draft.`,
        variant: "default",
      });
    }
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
      case "Page": return "outline";
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
            <Button variant="outline" onClick={() => setIsNavigationDialogOpen(true)}>
              <Menu className="w-4 h-4 mr-2" />
              Manage Navigation
            </Button>
            <Button variant="outline">
              <GanttChart className="w-4 h-4 mr-2" />
              Content Structure
            </Button>
          </div>
        </div>
        
        {recentActions.length > 0 && (
          <div className="mb-6 p-4 border border-border rounded-lg bg-muted/30">
            <h3 className="text-sm font-medium mb-2">Recent Activity</h3>
            <ul className="space-y-2">
              {recentActions.map((action, i) => (
                <li key={i} className="text-sm flex items-center justify-between">
                  <div>
                    <span className="font-medium">{action.item.title}</span>
                    <span className="text-muted-foreground"> was {action.action} </span>
                    <span className="text-xs text-muted-foreground">
                      ({new Date(action.timestamp).toLocaleTimeString()})
                    </span>
                  </div>
                  {action.item.published && 
                   (action.item.type === "Blog Post" || 
                    action.item.type === "Page" || 
                    action.item.type === "Service" || 
                    action.item.type === "Portfolio") && 
                   action.item.slug && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-xs h-7"
                      onClick={() => {
                        const path = action.item.type === "Blog Post" 
                          ? `/blog/${action.item.slug}`
                          : action.item.type === "Page"
                            ? `/${action.item.slug}`
                            : `/${action.item.type.toLowerCase()}/${action.item.slug}`;
                        window.open(path, '_blank');
                      }}
                    >
                      View
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="w-full mb-6">
            <TabsTrigger value="all" className="flex-1">All Content</TabsTrigger>
            <TabsTrigger value="pages" className="flex-1">Pages</TabsTrigger>
            <TabsTrigger value="sections" className="flex-1">Page Sections</TabsTrigger>
            <TabsTrigger value="blog" className="flex-1">Blog Posts</TabsTrigger>
            <TabsTrigger value="services" className="flex-1">Services</TabsTrigger>
            <TabsTrigger value="portfolio" className="flex-1">Portfolio</TabsTrigger>
          </TabsList>
        </Tabs>
        
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
              
              <div className="flex flex-col md:flex-row gap-4">
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
                
                {activeTab === "blog" && (
                  <div className="relative">
                    <select
                      className="w-full md:w-48 px-4 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none pl-4 pr-10"
                      value={selectedLanguage || ""}
                      onChange={(e) => setSelectedLanguage(e.target.value || null)}
                    >
                      <option value="">All Languages</option>
                      {availableLanguages.map(lang => (
                        <option key={lang.code} value={lang.code}>{lang.name}</option>
                      ))}
                    </select>
                    <Globe className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 pointer-events-none" />
                  </div>
                )}
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
                  {activeTab === "blog" && (
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">
                      <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSortChange('language')}>
                        <span>LANGUAGE</span>
                        <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </th>
                  )}
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
                          {item.type === "Page" && item.showInNavigation && (
                            <Badge variant="secondary" className="ml-2">In Navigation</Badge>
                          )}
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
                      {activeTab === "blog" && (
                        <td className="py-3 px-4 text-sm">
                          {item.language ? (
                            <Badge variant="secondary">
                              {availableLanguages.find(lang => lang.code === item.language)?.name || item.language}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">Default</span>
                          )}
                        </td>
                      )}
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
                    <td colSpan={activeTab === "blog" ? 7 : 6} className="py-8 text-center text-muted-foreground">
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

      <Dialog open={isNewContentDialogOpen} onOpenChange={setIsNewContentDialogOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Content</DialogTitle>
            <DialogDescription>
              Create new content that will be instantly available on your website
            </DialogDescription>
          </DialogHeader>
          <ContentForm 
            onSave={handleSaveContent}
            onCancel={() => setIsNewContentDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isEditContentDialogOpen} onOpenChange={setIsEditContentDialogOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Content</DialogTitle>
            <DialogDescription>
              Make changes to your content. All updates will be immediately reflected on your website.
            </DialogDescription>
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
                documents: itemToEdit.documents || [],
                published: itemToEdit.published,
                slug: itemToEdit.slug || '',
                showInNavigation: itemToEdit.showInNavigation || false,
                language: itemToEdit.language || 'en',
                placement: itemToEdit.placement
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
      
      <Dialog open={isNavigationDialogOpen} onOpenChange={setIsNavigationDialogOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Manage Navigation</DialogTitle>
            <DialogDescription>
              Organize and customize your website's main navigation menu
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-md">
              <p className="text-sm">
                The navigation menu is automatically updated when you create or edit pages with the "Show in Navigation" option enabled.
              </p>
            </div>
            
            <div className="border rounded-md">
              <div className="p-3 border-b bg-secondary/20">
                <div className="grid grid-cols-6 gap-2 text-sm font-medium">
                  <div className="col-span-1">Order</div>
                  <div className="col-span-2">Label</div>
                  <div className="col-span-2">Path</div>
                  <div className="col-span-1">Actions</div>
                </div>
              </div>
              
              <div className="divide-y">
                {navigationItems.length > 0 ? (
                  navigationItems
                    .sort((a, b) => a.order - b.order)
                    .map((item) => (
                      <div key={item.id} className="p-3 grid grid-cols-6 gap-2 items-center">
                        <div className="col-span-1 text-sm">{item.order}</div>
                        <div className="col-span-2 font-medium">{item.label}</div>
                        <div className="col-span-2 text-sm text-muted-foreground">{item.path}</div>
                        <div className="col-span-1 flex space-x-1">
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="p-6 text-center text-muted-foreground">
                    No navigation items found
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button onClick={() => setIsNavigationDialogOpen(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminContent;
