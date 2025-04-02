import React, { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { storageService } from "@/lib/storage";
import { NavigationItem } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Trash, Edit, ArrowUp, ArrowDown } from "lucide-react";

const NavigationManager: React.FC = () => {
  const { toast } = useToast();
  const [navItems, setNavItems] = useState<NavigationItem[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState({ label: "", path: "" });
  const [currentItem, setCurrentItem] = useState<NavigationItem | null>(null);

  useEffect(() => {
    // Load navigation items
    const items = storageService.getAllNavigationItems();
    setNavItems([...items].sort((a, b) => a.order - b.order));
    
    // Subscribe to changes
    const handleNavigationUpdated = (updatedItems: NavigationItem[]) => {
      setNavItems([...updatedItems].sort((a, b) => a.order - b.order));
    };
    
    window.addEventListener('navigation-updated', () => {
      setNavItems([...storageService.getAllNavigationItems()].sort((a, b) => a.order - b.order));
    });
    
    storageService.addEventListener('navigation-updated', handleNavigationUpdated);
    
    return () => {
      storageService.addEventListener('navigation-updated', handleNavigationUpdated);
      window.removeEventListener('navigation-updated', () => {});
    };
  }, []);

  const handleAddItem = () => {
    if (!newItem.label.trim() || !newItem.path.trim()) {
      toast({
        title: "Validation Error",
        description: "Label and path are required.",
        variant: "destructive",
      });
      return;
    }

    try {
      storageService.addNavigationItem({
        label: newItem.label,
        path: newItem.path.startsWith("/") ? newItem.path : `/${newItem.path}`,
        order: navItems.length + 1,
      });
      
      setNewItem({ label: "", path: "" });
      setIsAddDialogOpen(false);
      
      toast({
        title: "Navigation Item Added",
        description: `"${newItem.label}" has been added to navigation.`,
      });
    } catch (error) {
      console.error("Error adding navigation item:", error);
      toast({
        title: "Error",
        description: "Failed to add navigation item. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditItem = () => {
    if (!currentItem || !currentItem.label.trim() || !currentItem.path.trim()) {
      toast({
        title: "Validation Error",
        description: "Label and path are required.",
        variant: "destructive",
      });
      return;
    }

    try {
      storageService.updateNavigationItem(currentItem.id, {
        label: currentItem.label,
        path: currentItem.path.startsWith("/") ? currentItem.path : `/${currentItem.path}`,
      });
      
      setIsEditDialogOpen(false);
      
      toast({
        title: "Navigation Item Updated",
        description: `"${currentItem.label}" has been updated.`,
      });
    } catch (error) {
      console.error("Error updating navigation item:", error);
      toast({
        title: "Error",
        description: "Failed to update navigation item. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteItem = (id: number, label: string) => {
    if (window.confirm(`Are you sure you want to delete "${label}" from navigation?`)) {
      try {
        storageService.deleteNavigationItem(id);
        
        toast({
          title: "Navigation Item Deleted",
          description: `"${label}" has been removed from navigation.`,
        });
        
        // Reorder remaining items
        const remainingItems = navItems.filter(item => item.id !== id);
        const reorderedItems = remainingItems.map((item, index) => ({
          id: item.id,
          order: index + 1
        }));
        
        if (reorderedItems.length > 0) {
          storageService.reorderNavigationItems(reorderedItems);
        }
      } catch (error) {
        console.error("Error deleting navigation item:", error);
        toast({
          title: "Error",
          description: "Failed to delete navigation item. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleMoveItem = (id: number, direction: "up" | "down") => {
    const index = navItems.findIndex(item => item.id === id);
    if (index === -1) return;
    
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= navItems.length) return;
    
    // Swap order values
    const updatedItems = [...navItems];
    const temp = updatedItems[index].order;
    updatedItems[index].order = updatedItems[newIndex].order;
    updatedItems[newIndex].order = temp;
    
    try {
      storageService.reorderNavigationItems(
        updatedItems.map(item => ({ id: item.id, order: item.order }))
      );
      
      toast({
        title: "Navigation Order Updated",
        description: "The navigation order has been updated.",
      });
    } catch (error) {
      console.error("Error reordering navigation items:", error);
      toast({
        title: "Error",
        description: "Failed to reorder navigation items. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Navigation Menu</CardTitle>
          <CardDescription>
            Manage the navigation links that appear in the header.
          </CardDescription>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Link
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Navigation Link</DialogTitle>
              <DialogDescription>
                Add a new link to your site's navigation menu.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="label">Label</Label>
                <Input
                  id="label"
                  value={newItem.label}
                  onChange={(e) => setNewItem({ ...newItem, label: e.target.value })}
                  placeholder="About Us"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="path">Path</Label>
                <Input
                  id="path"
                  value={newItem.path}
                  onChange={(e) => setNewItem({ ...newItem, path: e.target.value })}
                  placeholder="/about"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddItem}>Add Link</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          {navItems.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No navigation items found. Click "Add Link" to create one.
            </div>
          ) : (
            <ul className="divide-y">
              {navItems.map((item) => (
                <li key={item.id} className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-medium">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.path}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleMoveItem(item.id, "up")}
                      disabled={item.order <= 1}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleMoveItem(item.id, "down")}
                      disabled={item.order >= navItems.length}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setCurrentItem(item);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDeleteItem(item.id, item.label)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </CardContent>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Navigation Link</DialogTitle>
            <DialogDescription>
              Update this navigation menu item.
            </DialogDescription>
          </DialogHeader>
          {currentItem && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-label">Label</Label>
                <Input
                  id="edit-label"
                  value={currentItem.label}
                  onChange={(e) =>
                    setCurrentItem({ ...currentItem, label: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-path">Path</Label>
                <Input
                  id="edit-path"
                  value={currentItem.path}
                  onChange={(e) =>
                    setCurrentItem({ ...currentItem, path: e.target.value })
                  }
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditItem}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default NavigationManager;
