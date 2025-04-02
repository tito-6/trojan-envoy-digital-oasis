import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { storageService } from "@/lib/storage";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FAQSettings, FAQItem } from "@/lib/types";

const AdminFAQSettings: React.FC = () => {
  const [settings, setSettings] = useState<FAQSettings | null>(null);
  const [isAddingFAQ, setAddingFAQ] = useState(false);
  const [newFAQQuestion, setNewFAQQuestion] = useState("");
  const [newFAQAnswer, setNewFAQAnswer] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = () => {
    const storedSettings = storageService.getFAQSettings();
    setSettings(storedSettings);
  };

  const handleAddFAQItem = () => {
    storageService.addFAQItem({
      question: newFAQQuestion,
      answer: newFAQAnswer
    });
    
    setNewFAQQuestion("");
    setNewFAQAnswer("");
    fetchSettings();
    setAddingFAQ(false);
  };

  const handleUpdateSettings = (updatedSettings: FAQSettings) => {
    storageService.updateFAQSettings(updatedSettings);
    setSettings(updatedSettings);
    toast({
      title: "Settings updated",
      description: "FAQ settings have been successfully updated.",
    });
  };

  if (!settings) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>FAQ Settings</CardTitle>
          <CardDescription>Manage frequently asked questions on your website.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={settings.title}
                onChange={(e) => handleUpdateSettings({ ...settings, title: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input
                id="subtitle"
                value={settings.subtitle}
                onChange={(e) => handleUpdateSettings({ ...settings, subtitle: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={settings.description}
                onChange={(e) => handleUpdateSettings({ ...settings, description: e.target.value })}
              />
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>FAQ Items</CardTitle>
              <CardDescription>Manage individual FAQ items.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-none space-y-2">
                {settings.faqItems.map((item) => (
                  <li key={item.id} className="border rounded-md p-4">
                    <p className="font-semibold">{item.question}</p>
                    <p className="text-sm text-muted-foreground">{item.answer}</p>
                  </li>
                ))}
              </ul>

              <Button onClick={() => setAddingFAQ(true)} className="mt-4">
                Add FAQ Item
              </Button>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      <Dialog open={isAddingFAQ} onOpenChange={setAddingFAQ}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New FAQ Item</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="question">Question</Label>
              <Input
                id="question"
                value={newFAQQuestion}
                onChange={(e) => setNewFAQQuestion(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="answer">Answer</Label>
              <Textarea
                id="answer"
                value={newFAQAnswer}
                onChange={(e) => setNewFAQAnswer(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" onClick={handleAddFAQItem}>
              Add Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminFAQSettings;
