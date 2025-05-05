import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { storageService } from "@/lib/storage";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Plus, X } from "lucide-react";
import { ContactInfoItem, ContactFormField } from "@/lib/types";
import type { ContactSettings as ContactSettingsType } from "@/lib/types";
import RichTextEditor from "@/components/admin/richtext/RichTextEditor";
import { Checkbox } from "@/components/ui/checkbox";

const ContactSettings: React.FC = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<ContactSettingsType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/settings/contact_settings');
        if (!response.ok) {
          throw new Error('Failed to fetch contact settings');
        }
        const data = await response.json();
        setSettings(data);
        toast({
          title: "Settings loaded",
          description: "Contact settings have been loaded successfully."
        });
      } catch (error) {
        console.error('Error fetching contact settings:', error);
        toast({
          title: "Error loading settings",
          description: "There was a problem loading your contact settings.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSettings();
  }, [toast]);

  const handleBasicInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContactInfoUpdate = (index: number, field: string, value: string) => {
    setSettings(prev => {
      const updatedItems = [...prev.contactInfoItems];
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: value
      };
      return {
        ...prev,
        contactInfoItems: updatedItems
      };
    });
  };

  const addContactInfoItem = () => {
    setSettings(prev => ({
      ...prev,
      contactInfoItems: [
        ...prev.contactInfoItems,
        {
          id: Date.now(),
          title: "New Contact Info",
          content: "Add your content here",
          icon: "MapPin",
          order: prev.contactInfoItems.length
        }
      ]
    }));
  };

  const removeContactInfoItem = (id: number) => {
    setSettings(prev => ({
      ...prev,
      contactInfoItems: prev.contactInfoItems.filter(item => item.id !== id)
    }));
  };

  const handleFormFieldUpdate = (index: number, field: string, value: any) => {
    setSettings(prev => {
      const updatedFields = [...prev.formFields];
      updatedFields[index] = {
        ...updatedFields[index],
        [field]: value
      };
      return {
        ...prev,
        formFields: updatedFields
      };
    });
  };

  const addFormField = () => {
    setSettings(prev => ({
      ...prev,
      formFields: [
        ...prev.formFields,
        {
          id: Date.now(),
          name: `field${prev.formFields.length + 1}`,
          label: "New Field",
          type: "text",
          required: false,
          placeholder: "Enter value",
          order: prev.formFields.length
        }
      ]
    }));
  };

  const removeFormField = (id: number) => {
    setSettings(prev => ({
      ...prev,
      formFields: prev.formFields.filter(field => field.id !== id)
    }));
  };

  const handleSubmit = async () => {
    if (!settings) return;
    
    setIsUpdating(true);
    try {
      const response = await fetch('/api/settings/contact_settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        throw new Error('Failed to update settings');
      }

      toast({
        title: "Contact settings updated",
        description: "Your changes have been saved successfully."
      });
    } catch (error) {
      console.error('Error updating contact settings:', error);
      toast({
        title: "Error updating settings",
        description: "There was a problem updating your contact settings.",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleToggleChange = (field: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="container mx-auto py-10">
          <div className="animate-pulse">Loading settings...</div>
        </div>
      </AdminLayout>
    );
  }

  if (!settings) {
    return (
      <AdminLayout>
        <div className="container mx-auto py-10">
          <div className="text-red-500">Failed to load settings</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Contact Settings</h1>
        
        <Tabs defaultValue="general">
          <TabsList className="mb-6">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="contact-info">Contact Info</TabsTrigger>
            <TabsTrigger value="form-fields">Form Fields</TabsTrigger>
            <TabsTrigger value="advanced">Advanced Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Configure the general settings for your contact page
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Page Title</Label>
                    <Input 
                      id="title" 
                      name="title" 
                      value={settings.title} 
                      onChange={handleBasicInfoChange} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subtitle">Subtitle</Label>
                    <Input 
                      id="subtitle" 
                      name="subtitle" 
                      value={settings.subtitle} 
                      onChange={handleBasicInfoChange} 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    name="description" 
                    value={settings.description} 
                    onChange={handleBasicInfoChange}
                    rows={4}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="submitButtonText">Submit Button Text</Label>
                  <Input 
                    id="submitButtonText" 
                    name="submitButtonText" 
                    value={settings.submitButtonText} 
                    onChange={handleBasicInfoChange} 
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="contact-info" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>
                    Add contact details that will be displayed on the contact page
                  </CardDescription>
                </div>
                <Button onClick={addContactInfoItem}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {settings.contactInfoItems.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    No contact information items added yet. Click the button above to add one.
                  </div>
                ) : (
                  settings.contactInfoItems.map((item, index) => (
                    <div key={item.id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">Contact Information Item #{index + 1}</h3>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeContactInfoItem(item.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Title</Label>
                          <Input 
                            value={item.title} 
                            onChange={(e) => handleContactInfoUpdate(index, 'title', e.target.value)} 
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Icon</Label>
                          <Input 
                            value={item.icon} 
                            onChange={(e) => handleContactInfoUpdate(index, 'icon', e.target.value)} 
                            placeholder="MapPin, Phone, Mail, etc."
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Content</Label>
                        <Textarea 
                          value={item.content} 
                          onChange={(e) => handleContactInfoUpdate(index, 'content', e.target.value)}
                          rows={3}
                        />
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="form-fields" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Form Fields</CardTitle>
                  <CardDescription>
                    Customize the fields in your contact form
                  </CardDescription>
                </div>
                <Button onClick={addFormField}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Field
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {settings.formFields.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    No form fields added yet. Click the button above to add one.
                  </div>
                ) : (
                  settings.formFields.map((field, index) => (
                    <div key={field.id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">Form Field #{index + 1}</h3>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeFormField(field.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Label</Label>
                          <Input 
                            value={field.label} 
                            onChange={(e) => handleFormFieldUpdate(index, 'label', e.target.value)} 
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Field Name</Label>
                          <Input 
                            value={field.name} 
                            onChange={(e) => handleFormFieldUpdate(index, 'name', e.target.value)} 
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Field Type</Label>
                          <select
                            className="w-full px-3 py-2 border rounded-md"
                            value={field.type}
                            onChange={(e) => handleFormFieldUpdate(index, 'type', e.target.value)}
                          >
                            <option value="text">Text</option>
                            <option value="email">Email</option>
                            <option value="tel">Telephone</option>
                            <option value="textarea">Text Area</option>
                            <option value="select">Dropdown</option>
                            <option value="checkbox">Checkbox</option>
                            <option value="radio">Radio Button</option>
                          </select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Placeholder</Label>
                          <Input 
                            value={field.placeholder || ''} 
                            onChange={(e) => handleFormFieldUpdate(index, 'placeholder', e.target.value)} 
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`required-${field.id}`}
                          checked={field.required}
                          onCheckedChange={(checked) => 
                            handleFormFieldUpdate(index, 'required', checked === true)
                          }
                        />
                        <Label htmlFor={`required-${field.id}`}>Required Field</Label>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Settings</CardTitle>
                <CardDescription>
                  Configure advanced features for your contact form
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="enableRecaptcha" className="font-medium">
                      Enable reCAPTCHA
                    </Label>
                    <Switch
                      id="enableRecaptcha"
                      checked={settings.enableRecaptcha}
                      onCheckedChange={(checked) => handleToggleChange('enableRecaptcha', checked)}
                    />
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Protect your form from spam by enabling Google reCAPTCHA v3
                  </p>
                </div>
                
                {settings.enableRecaptcha && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="recaptchaSiteKey">reCAPTCHA Site Key</Label>
                      <Input 
                        id="recaptchaSiteKey" 
                        name="recaptchaSiteKey" 
                        value={settings.recaptchaSiteKey} 
                        onChange={handleBasicInfoChange} 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="recaptchaSecretKey">reCAPTCHA Secret Key</Label>
                      <Input 
                        id="recaptchaSecretKey" 
                        name="recaptchaSecretKey" 
                        value={settings.recaptchaSecretKey} 
                        onChange={handleBasicInfoChange} 
                        type="password"
                      />
                    </div>
                  </div>
                )}
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="enableEmailNotifications" className="font-medium">
                      Email Notifications
                    </Label>
                    <Switch
                      id="enableEmailNotifications"
                      checked={settings.enableEmailNotifications}
                      onCheckedChange={(checked) => handleToggleChange('enableEmailNotifications', checked)}
                    />
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Receive email notifications when someone submits your contact form
                  </p>
                </div>
                
                {settings.enableEmailNotifications && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="emailSender">Sender Email</Label>
                        <Input 
                          id="emailSender" 
                          name="emailSender" 
                          value={settings.emailSender} 
                          onChange={handleBasicInfoChange} 
                          placeholder="noreply@example.com"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="emailRecipient">Recipient Email</Label>
                        <Input 
                          id="emailRecipient" 
                          name="emailRecipient" 
                          value={settings.emailRecipient} 
                          onChange={handleBasicInfoChange} 
                          placeholder="you@example.com"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="emailSubject">Email Subject</Label>
                      <Input 
                        id="emailSubject" 
                        name="emailSubject" 
                        value={settings.emailSubject} 
                        onChange={handleBasicInfoChange} 
                      />
                    </div>
                    
                  </div>
                )}
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="enableAppointmentScheduling" className="font-medium">
                      Appointment Scheduling
                    </Label>
                    <Switch
                      id="enableAppointmentScheduling"
                      checked={settings.enableAppointmentScheduling}
                      onCheckedChange={(checked) => handleToggleChange('enableAppointmentScheduling', checked)}
                    />
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Allow users to schedule appointments directly from your contact form
                  </p>
                </div>
                
                {settings.enableAppointmentScheduling && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="appointmentLabel">Appointment Field Label</Label>
                      <Input 
                        id="appointmentLabel" 
                        name="appointmentLabel" 
                        value={settings.appointmentLabel} 
                        onChange={handleBasicInfoChange} 
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="workingHoursStart">Working Hours Start</Label>
                        <Input 
                          id="workingHoursStart" 
                          name="workingHoursStart" 
                          type="time"
                          value={settings.workingHoursStart} 
                          onChange={handleBasicInfoChange} 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="workingHoursEnd">Working Hours End</Label>
                        <Input 
                          id="workingHoursEnd" 
                          name="workingHoursEnd" 
                          type="time"
                          value={settings.workingHoursEnd} 
                          onChange={handleBasicInfoChange} 
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Available Days</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                          <div key={day} className="flex items-center space-x-2">
                            <Checkbox
                              id={`day-${day}`}
                              checked={settings.availableDays.includes(day)}
                              onCheckedChange={(checked) => {
                                const updatedDays = checked
                                  ? [...settings.availableDays, day]
                                  : settings.availableDays.filter(d => d !== day);
                                
                                setSettings(prev => ({
                                  ...prev,
                                  availableDays: updatedDays
                                }));
                              }}
                            />
                            <Label htmlFor={`day-${day}`}>{day}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end mt-6">
          <Button 
            onClick={handleSubmit} 
            disabled={isUpdating}
            className="min-w-[150px]"
          >
            {isUpdating ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ContactSettings;
