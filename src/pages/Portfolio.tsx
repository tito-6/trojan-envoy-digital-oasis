
import React, { useState, useEffect } from "react";
import { Header } from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import PortfolioHero from "@/components/portfolio/PortfolioHero";
import PortfolioFilters from "@/components/portfolio/PortfolioFilters";
import PortfolioGallery from "@/components/portfolio/PortfolioGallery";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ContentItem } from "@/lib/types";
import { storageService } from "@/lib/storage";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel
} from "@/components/ui/alert-dialog";

const Portfolio: React.FC = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(
    localStorage.getItem("theme") === "dark" || 
    (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches)
  );
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
    
    // Handle theme
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setIsDarkTheme(true);
    } else if (savedTheme === "light") {
      document.documentElement.classList.remove("dark");
      setIsDarkTheme(false);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.classList.add("dark");
      setIsDarkTheme(true);
    }
  }, []);

  const toggleTheme = () => {
    if (document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDarkTheme(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDarkTheme(true);
    }
  };

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

  return (
    <div className="min-h-screen">
      <Header isDarkTheme={isDarkTheme} toggleTheme={toggleTheme} />
      
      <main className="container mx-auto py-10">
        <PortfolioHero />
        <PortfolioFilters />
        <PortfolioGallery />
        
        <div className="mt-4 flex justify-end space-x-2">
          <Button variant="secondary" onClick={onAddMockPortfolioItem}>Add Mock Portfolio Item</Button>
        </div>
      </main>
      
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
      
      <Footer />
    </div>
  );
};

export default Portfolio;
