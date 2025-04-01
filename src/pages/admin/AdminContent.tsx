
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, MoreVertical, Edit, Trash2, Eye, ArrowDown, ArrowUp } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ContentForm } from '@/components/admin/content-form';
import { ContentItem, ContentType } from '@/lib/types';
import { storageService } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

const AdminContent: React.FC = () => {
  const [contentList, setContentList] = useState<ContentItem[]>([]);
  const [contentTypeFilter, setContentTypeFilter] = useState<ContentType | 'All'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [sortBy, setSortBy] = useState<'title' | 'type'>('title');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [initialFormValues, setInitialFormValues] = useState<Partial<ContentItem> | undefined>(undefined);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const storedContent = storageService.getAllContent();
    setContentList(storedContent);
  }, []);

  const handleContentTypeFilterChange = (value: ContentType | 'All') => {
    setContentTypeFilter(value);
  };

  const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSortOrderChange = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleSortByChange = (value: 'title' | 'type') => {
    setSortBy(value);
  };

  const filteredContent = React.useMemo(() => {
    let filtered = contentList;

    if (contentTypeFilter !== 'All') {
      filtered = filtered.filter(item => item.type === contentTypeFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (sortBy === 'title') {
      filtered.sort((a, b) => {
        const titleA = a.title.toLowerCase();
        const titleB = b.title.toLowerCase();
        if (titleA < titleB) return sortOrder === 'asc' ? -1 : 1;
        if (titleA > titleB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    } else if (sortBy === 'type') {
      filtered.sort((a, b) => {
        const typeA = a.type.toLowerCase();
        const typeB = b.type.toLowerCase();
        if (typeA < typeB) return sortOrder === 'asc' ? -1 : 1;
        if (typeA > typeB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [contentList, contentTypeFilter, searchTerm, sortOrder, sortBy]);

  const handleCreateContent = () => {
    setInitialFormValues(undefined);
    setIsEditing(false);
    setIsFormOpen(true);
  };

  const handleEditContent = (content: ContentItem) => {
    setInitialFormValues(content);
    setIsEditing(true);
    setIsFormOpen(true);
  };

  const handleViewContent = (content: ContentItem) => {
    navigate(`/content/${content.id}`);
  };

  const handleDeleteContent = (id: number) => {
    storageService.deleteContent(id);
    setContentList(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Content deleted",
      description: "The content has been successfully deleted.",
    });
  };

  const handleSaveContent = (values: ContentItem) => {
    if (isEditing && initialFormValues) {
      const updatedContent = storageService.updateContent(initialFormValues.id!, values);
      if (updatedContent) {
        setContentList(prev =>
          prev.map(item => (item.id === initialFormValues.id ? updatedContent : item))
        );
        toast({
          title: "Content updated",
          description: "The content has been successfully updated.",
        });
      }
    } else {
      const newContent = storageService.addContent(values);
      setContentList(prev => [...prev, newContent]);
      toast({
        title: "Content created",
        description: "The content has been successfully created.",
      });
    }
    setIsFormOpen(false);
  };

  const handleCancelContentForm = () => {
    setIsFormOpen(false);
  };

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Content Management</h1>
        <Button onClick={handleCreateContent}>
          <Plus className="h-4 w-4 mr-2" />
          Create Content
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Input 
          type="text" 
          placeholder="Search content..." 
          value={searchTerm}
          onChange={handleSearchTermChange}
        />

        <Select onValueChange={handleContentTypeFilterChange} defaultValue="All">
          <SelectTrigger>
            <SelectValue placeholder="Filter by Content Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Content Types</SelectItem>
            <SelectItem value="Page">Page</SelectItem>
            <SelectItem value="Page Section">Page Section</SelectItem>
            <SelectItem value="Service">Service</SelectItem>
            <SelectItem value="Portfolio">Portfolio</SelectItem>
            <SelectItem value="Blog Post">Blog Post</SelectItem>
            <SelectItem value="Testimonial">Testimonial</SelectItem>
            <SelectItem value="FAQ">FAQ</SelectItem>
            <SelectItem value="Team Member">Team Member</SelectItem>
            <SelectItem value="Case Study">Case Study</SelectItem>
            <SelectItem value="Job Posting">Job Posting</SelectItem>
            <SelectItem value="Technology Stack">Technology Stack</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center space-x-2">
          <Select onValueChange={handleSortByChange} defaultValue="title">
            <SelectTrigger>
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="type">Type</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={handleSortOrderChange}>
            {sortOrder === 'asc' ? <ArrowDown className="h-4 w-4" /> : <ArrowUp className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="list" className="w-full">
        <TabsList>
          <TabsTrigger value="list">Content List</TabsTrigger>
          <TabsTrigger value="types">Content Types</TabsTrigger>
        </TabsList>
        <TabsContent value="list" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredContent.map(content => (
              <Card key={content.id}>
                <CardHeader>
                  <CardTitle>{content.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge>{content.type}</Badge>
                    {content.published && <Badge variant="success">Published</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">{content.description?.substring(0, 100)}...</p>
                </CardContent>
                <div className="p-2 flex justify-end">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewContent(content)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEditContent(content)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteContent(content.id)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </Card>
            ))}
            {filteredContent.length === 0 && (
              <div className="col-span-full text-center py-6">
                <p className="text-lg text-muted-foreground">No content found.</p>
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="types" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Pages</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Website pages like Home, About Us, etc.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Blog Posts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Articles and news items.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Services</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Information about services offered.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Technology Stack</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Technology stack showcased on the homepage.</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {isFormOpen && (
        <div className="fixed inset-0 bg-background/80 z-50 overflow-y-auto">
          <div className="container mx-auto max-w-3xl mt-10 p-8 bg-card rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold mb-6">{isEditing ? 'Edit Content' : 'Create Content'}</h2>
            <ContentForm 
              initialValues={initialFormValues}
              onSave={handleSaveContent}
              onCancel={handleCancelContentForm}
              isEditing={isEditing}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminContent;
