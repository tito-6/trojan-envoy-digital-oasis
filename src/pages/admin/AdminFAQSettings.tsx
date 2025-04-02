
import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { storageService } from "@/lib/storage";
import { FAQSettings, FAQItem } from "@/lib/types";
import { PlusCircle, Trash2, MoveUp, MoveDown, Eye, EyeOff, Save } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";

const AdminFAQSettings: React.FC = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<FAQSettings>(storageService.getFAQSettings());
  const [newFAQ, setNewFAQ] = useState<Omit<FAQItem, 'id'>>({
    question: "",
    answer: "",
    order: settings.faqItems.length + 1
  });
  
  // Handle general settings change
  const handleGeneralSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings({
      ...settings,
      [name]: value
    });
  };
  
  // Handle new FAQ field changes
  const handleNewFAQChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewFAQ({
      ...newFAQ,
      [name]: value
    });
  };
  
  // Add a new FAQ
  const handleAddFAQ = () => {
    if (!newFAQ.question.trim() || !newFAQ.answer.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both question and answer.",
        variant: "destructive"
      });
      return;
    }
    
    // Add the new FAQ
    storageService.addFAQItem(newFAQ);
    
    // Update the settings
    setSettings(storageService.getFAQSettings());
    
    // Reset the new FAQ form
    setNewFAQ({
      question: "",
      answer: "",
      order: settings.faqItems.length + 2
    });
    
    toast({
      title: "FAQ Added",
      description: "The new FAQ has been added successfully."
    });
  };
  
  // Update FAQ fields
  const handleFAQChange = (id: number, field: keyof FAQItem, value: any) => {
    const updatedFAQs = settings.faqItems.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    });
    
    setSettings({
      ...settings,
      faqItems: updatedFAQs
    });
  };
  
  // Toggle FAQ visibility
  const handleToggleActive = (id: number) => {
    const item = settings.faqItems.find(item => item.id === id);
    if (!item) return;
    
    const isActive = item.isActive === false ? true : false;
    handleFAQChange(id, 'isActive', isActive);
  };
  
  // Move FAQ up in order
  const handleMoveUp = (id: number) => {
    const index = settings.faqItems.findIndex(item => item.id === id);
    if (index <= 0) return;
    
    const updatedItems = [...settings.faqItems];
    const temp = updatedItems[index].order;
    updatedItems[index].order = updatedItems[index - 1].order;
    updatedItems[index - 1].order = temp;
    
    updatedItems.sort((a, b) => a.order - b.order);
    
    setSettings({
      ...settings,
      faqItems: updatedItems
    });
  };
  
  // Move FAQ down in order
  const handleMoveDown = (id: number) => {
    const index = settings.faqItems.findIndex(item => item.id === id);
    if (index >= settings.faqItems.length - 1) return;
    
    const updatedItems = [...settings.faqItems];
    const temp = updatedItems[index].order;
    updatedItems[index].order = updatedItems[index + 1].order;
    updatedItems[index + 1].order = temp;
    
    updatedItems.sort((a, b) => a.order - b.order);
    
    setSettings({
      ...settings,
      faqItems: updatedItems
    });
  };
  
  // Delete a FAQ
  const handleDeleteFAQ = (id: number) => {
    const updatedItems = settings.faqItems.filter(item => item.id !== id);
    
    // Update orders after deletion
    const reorderedItems = updatedItems.map((item, index) => ({
      ...item,
      order: index + 1
    }));
    
    setSettings({
      ...settings,
      faqItems: reorderedItems
    });
    
    toast({
      title: "FAQ Removed",
      description: "The FAQ has been removed successfully."
    });
  };
  
  // Save all settings
  const handleSaveSettings = () => {
    storageService.updateFAQSettings(settings);
    
    toast({
      title: "FAQ Settings Saved",
      description: "Your changes have been saved successfully."
    });
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">FAQ Section Settings</h1>
          <Button onClick={handleSaveSettings}>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
        
        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">General Settings</TabsTrigger>
            <TabsTrigger value="items">FAQ Items</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Configure the main settings for the FAQ section.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Section Title</Label>
                    <Input 
                      id="title" 
                      name="title" 
                      value={settings.title} 
                      onChange={handleGeneralSettingsChange} 
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="subtitle">Section Subtitle</Label>
                    <Textarea 
                      id="subtitle" 
                      name="subtitle" 
                      value={settings.subtitle} 
                      onChange={handleGeneralSettingsChange} 
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="viewAllText">Button Text</Label>
                      <Input 
                        id="viewAllText" 
                        name="viewAllText" 
                        value={settings.viewAllText} 
                        onChange={handleGeneralSettingsChange} 
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="viewAllUrl">Button URL</Label>
                      <Input 
                        id="viewAllUrl" 
                        name="viewAllUrl" 
                        value={settings.viewAllUrl} 
                        onChange={handleGeneralSettingsChange} 
                        placeholder="/faq or https://example.com"
                      />
                      <p className="text-xs text-muted-foreground">
                        For internal pages, start with a slash (e.g., "/faq"). 
                        For external links, include the full URL (e.g., "https://example.com").
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="items" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Add New FAQ</CardTitle>
                <CardDescription>Add a new question and answer to the FAQ section.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="question">Question</Label>
                    <Input 
                      id="question" 
                      name="question" 
                      value={newFAQ.question} 
                      onChange={handleNewFAQChange} 
                      placeholder="e.g., What services do you offer?"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="answer">Answer</Label>
                    <Textarea 
                      id="answer" 
                      name="answer" 
                      value={newFAQ.answer} 
                      onChange={handleNewFAQChange}
                      placeholder="Enter your answer here..."
                      rows={4}
                    />
                  </div>
                  
                  <Button onClick={handleAddFAQ}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add FAQ
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Manage FAQs</CardTitle>
                <CardDescription>Edit, reorder, or remove FAQ items.</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="multiple" className="w-full">
                  {settings.faqItems.sort((a, b) => a.order - b.order).map((faq) => (
                    <AccordionItem key={faq.id} value={`faq-${faq.id}`}>
                      <div className="flex items-center justify-between">
                        <AccordionTrigger className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-xs">
                              {faq.order}
                            </span>
                            <span className={faq.isActive === false ? "opacity-50" : ""}>
                              {faq.question}
                            </span>
                          </div>
                        </AccordionTrigger>
                        
                        <div className="flex items-center gap-1 mr-4">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMoveUp(faq.id);
                            }}
                            disabled={faq.order === 1}
                          >
                            <MoveUp className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMoveDown(faq.id);
                            }}
                            disabled={faq.order === settings.faqItems.length}
                          >
                            <MoveDown className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleActive(faq.id);
                            }}
                          >
                            {faq.isActive === false ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteFAQ(faq.id);
                            }}
                            className="text-destructive hover:text-destructive/90"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <AccordionContent>
                        <div className="grid gap-4 pt-4">
                          <div className="grid gap-2">
                            <Label htmlFor={`question-${faq.id}`}>Question</Label>
                            <Input 
                              id={`question-${faq.id}`}
                              value={faq.question} 
                              onChange={(e) => handleFAQChange(faq.id, 'question', e.target.value)} 
                            />
                          </div>
                          
                          <div className="grid gap-2">
                            <Label htmlFor={`answer-${faq.id}`}>Answer</Label>
                            <Textarea 
                              id={`answer-${faq.id}`}
                              value={faq.answer} 
                              onChange={(e) => handleFAQChange(faq.id, 'answer', e.target.value)} 
                              rows={4}
                            />
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Label htmlFor={`active-${faq.id}`} className="flex-1">
                              Active
                            </Label>
                            <Switch 
                              id={`active-${faq.id}`}
                              checked={faq.isActive !== false}
                              onCheckedChange={(checked) => handleFAQChange(faq.id, 'isActive', checked)}
                            />
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveSettings} className="ml-auto">
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminFAQSettings;
