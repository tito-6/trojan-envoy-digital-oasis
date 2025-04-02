import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ContentItem } from '@/lib/types';
import { storageService } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

const Portfolio: React.FC = () => {
  const [portfolioItems, setPortfolioItems] = useState<ContentItem[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [initialFormValues, setInitialFormValues] = useState<Partial<ContentItem> | undefined>(undefined);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [portfolioToDelete, setPortfolioToDelete] = useState<ContentItem | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    const storedPortfolio = storageService.getContentByType("Portfolio");
    setPortfolioItems(storedPortfolio);
  };

  const handleCreatePortfolio = () => {
    setInitialFormValues(undefined);
    setIsEditing(false);
    setIsFormOpen(true);
  };

  const handleEditPortfolio = (portfolio: ContentItem) => {
    setInitialFormValues(portfolio);
    setIsEditing(true);
    setIsFormOpen(true);
  };

  const openDeleteDialog = (portfolio: ContentItem) => {
    setPortfolioToDelete(portfolio);
    setDeleteConfirmText('');
    setIsDeleteDialogOpen(true);
  };

  const handleDeletePortfolio = () => {
    if (portfolioToDelete && deleteConfirmText === 'DELETE') {
      storageService.deleteContent(portfolioToDelete.id);
      setPortfolioItems(prev => prev.filter(item => item.id !== portfolioToDelete.id));
      toast({
        title: "Portfolio item deleted",
        description: "The portfolio item has been successfully deleted.",
      });
      setIsDeleteDialogOpen(false);
      setPortfolioToDelete(null);
      fetchData();
    }
  };

  const handleSavePortfolio = (values: ContentItem) => {
    if (isEditing && initialFormValues) {
      storageService.updateContent(initialFormValues.id!, values);
      toast({
        title: "Portfolio item updated",
        description: "The portfolio item has been successfully updated.",
      });
    } else {
      storageService.addContent(values);
      toast({
        title: "Portfolio item created",
        description: "The portfolio item has been successfully created.",
      });
    }
    setIsFormOpen(false);
    fetchData();
  };

  const handleCancelPortfolioForm = () => {
    setIsFormOpen(false);
  };

  const onAddMockPortfolioItem = () => {
    const mockPortfolio: Omit<ContentItem, "id"> = {
      title: "E-commerce Website Redesign",
      type: "Portfolio",
      description: "Complete redesign of an e-commerce platform focusing on user experience and conversion optimization.",
      content: "<p>This project involved a comprehensive redesign...</p>",
      seoKeywords: ["e-commerce", "web design", "UI/UX"],
      category: "Web Design",
      published: true,
      lastUpdated: new Date().toISOString()
    };
    
    storageService.addContent(mockPortfolio);
    fetchData();
  };

  const onAddAnotherMockPortfolioItem = () => {
    const mockPortfolio: Omit<ContentItem, "id"> = {
      title: "Mobile Banking App",
      type: "Portfolio",
      description: "A modern mobile banking application with focus on security and ease of use.",
      content: "<p>We developed a state-of-the-art mobile banking solution...</p>",
      seoKeywords: ["mobile app", "banking", "fintech"],
      category: "Mobile Development",
      published: true,
      lastUpdated: new Date().toISOString()
    };
    
    storageService.addContent(mockPortfolio);
    fetchData();
  };

  const onAddThirdMockPortfolioItem = () => {
    const mockPortfolio: Omit<ContentItem, "id"> = {
      title: "Corporate Brand Identity",
      type: "Portfolio",
      description: "Complete brand identity redesign for a Fortune 500 company.",
      content: "<p>This comprehensive branding project included...</p>",
      seoKeywords: ["branding", "identity", "corporate design"],
      category: "Branding",
      published: true,
      lastUpdated: new Date().toISOString()
    };
    
    storageService.addContent(mockPortfolio);
    fetchData();
  };

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Portfolio Management</h1>
        <Button onClick={handleCreatePortfolio}>
          <Plus className="h-4 w-4 mr-2" />
          Create Portfolio
        </Button>
      </div>

      <Tabs defaultValue="list" className="w-full">
        <TabsList>
          <TabsTrigger value="list">Portfolio List</TabsTrigger>
          <TabsTrigger value="types">Portfolio Types</TabsTrigger>
        </TabsList>
        <TabsContent value="list" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {portfolioItems.map(portfolio => (
              <Card key={portfolio.id}>
                <CardHeader>
                  <CardTitle>{portfolio.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{portfolio.description?.substring(0, 100)}...</p>
                </CardContent>
                <div className="p-2 flex justify-end">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-more-vertical h-4 w-4"><circle cx="12" cy="2" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="22" r="1"/></svg>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditPortfolio(portfolio)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openDeleteDialog(portfolio)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </Card>
            ))}
            {portfolioItems.length === 0 && (
              <div className="col-span-full text-center py-6">
                <p className="text-lg text-muted-foreground">No portfolio items found.</p>
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="types" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Web Design</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Web design projects.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Mobile App Development</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Mobile app development projects.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Branding</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Branding projects.</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-4 flex justify-end space-x-2">
        <Button variant="secondary" onClick={onAddMockPortfolioItem}>Add Mock Portfolio Item</Button>
        <Button variant="secondary" onClick={onAddAnotherMockPortfolioItem}>Add Another Mock Portfolio Item</Button>
        <Button variant="secondary" onClick={onAddThirdMockPortfolioItem}>Add Third Mock Portfolio Item</Button>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-background/80 z-50 overflow-y-auto">
          <div className="container mx-auto max-w-3xl mt-10 p-8 bg-card rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold mb-6">{isEditing ? 'Edit Portfolio' : 'Create Portfolio'}</h2>
            {/*<PortfolioForm 
              initialValues={initialFormValues}
              onSave={handleSavePortfolio}
              onCancel={handleCancelPortfolioForm}
              isEditing={isEditing}
            />*/}
          </div>
        </div>
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this portfolio item?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{portfolioToDelete?.title}". 
              <div className="mt-4">
                <p className="font-semibold mb-2">Type "DELETE" to confirm:</p>
                <Input 
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  className="mt-1"
                  placeholder="Type DELETE here"
                />
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeletePortfolio}
              disabled={deleteConfirmText !== 'DELETE'}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Portfolio;
