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
import { ReferencesSettings, ClientLogo } from "@/lib/types";

const AdminReferencesSettings: React.FC = () => {
  const [settings, setSettings] = useState<ReferencesSettings | null>(null);
  const [isAddingLogo, setAddingLogo] = useState(false);
  const [newLogoName, setNewLogoName] = useState("");
  const [newLogoUrl, setNewLogoUrl] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = () => {
    const storedSettings = storageService.getReferencesSettings();
    setSettings(storedSettings);
  };

  const handleAddLogo = () => {
    storageService.addClientLogo({
      name: newLogoName,
      imageUrl: newLogoUrl
    });
    
    setNewLogoName("");
    setNewLogoUrl("");
    fetchSettings();
    setAddingLogo(false);
  };

  if (!settings) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">References Settings</h1>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>Manage the main settings for the references section.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                type="text"
                id="title"
                value={settings.title}
                disabled
              />
            </div>
            <div>
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input
                type="text"
                id="subtitle"
                value={settings.subtitle}
                disabled
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Client Logos</CardTitle>
          <CardDescription>Manage the client logos displayed in the references section.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {settings.clientLogos.map((logo) => (
              <div key={logo.id} className="flex items-center justify-between">
                <img src={logo.imageUrl} alt={logo.name} className="h-8 w-auto" />
                <span>{logo.name}</span>
              </div>
            ))}
          </div>

          <Button onClick={() => setAddingLogo(true)} className="mt-4">Add Logo</Button>

          <Dialog open={isAddingLogo} onOpenChange={setAddingLogo}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Client Logo</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input id="name" value={newLogoName} onChange={(e) => setNewLogoName(e.target.value)} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="imageUrl" className="text-right">
                    Image URL
                  </Label>
                  <Input id="imageUrl" value={newLogoUrl} onChange={(e) => setNewLogoUrl(e.target.value)} className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" onClick={handleAddLogo}>
                  Add Logo
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminReferencesSettings;
