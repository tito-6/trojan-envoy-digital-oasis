
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
import { ContactSettings, ContactInfoItem, ContactFormField } from "@/lib/types";
import RichTextEditor from "@/components/admin/richtext/RichTextEditor";

const AdminContactSettings: React.FC = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<ContactSettings>(() => storageService.getContactSettings());
  const [isUpdating, setIsUpdating] = useState(false);

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
          required: true,
          placeholder: "Enter value",
          order: prev.formFields.length,
          options: []
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

  const addFieldOption = (fieldIndex: number) => {
    setSettings(prev => {
      const updatedFields = [...prev.formFields];
      const currentOptions = updatedFields[fieldIndex].options || [];
      updatedFields[fieldIndex].options = [
        ...currentOptions,
        {
          id: Date.now(),
          label: "New Option",
          value: `option${currentOptions.length + 1}`
        }
      ];
      return {
        ...prev,
        formFields: updatedFields
      };
    });
  };

  const updateFieldOption = (fieldIndex: number, optionIndex: number, field: string, value: string) => {
    setSettings(prev => {
      const updatedFields = [...prev.formFields];
      const updatedOptions = [...(updatedFields[fieldIndex].options || [])];
      updatedOptions[optionIndex] = {
        ...updatedOptions[optionIndex],
        [field]: value
      };
      updatedFields[fieldIndex].options = updatedOptions;
      return {
        ...prev,
        formFields: updatedFields
      };
    });
  };

  const removeFieldOption = (fieldIndex: number, optionId: number) => {
    setSettings(prev => {
      const updatedFields = [...prev.formFields];
      updatedFields[fieldIndex].options = updatedFields[fieldIndex].options?.filter(
        option => option.id !== optionId
      );
      return {
        ...prev,
        formFields: updatedFields
      };
    });
  };

  const handleDescriptionChange = (value: any) => {
    setSettings(prev => ({
      ...prev,
      description: value
    }));
  };

  const saveSettings = async () => {
    setIsUpdating(true);
    try {
      storageService.updateContactSettings(settings);
      toast({
        title: "Settings saved",
        description: "Contact section settings have been updated successfully."
      });
    } catch (error) {
      toast({
        title: "Error saving settings",
        description: "An error occurred while saving the settings.",
        variant: "destructive"
      });
      console.error("Error saving contact settings:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <AdminLayout>
      <div className="container py-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Contact Section Settings</h1>
          <Button onClick={saveSettings} disabled={isUpdating}>
            {isUpdating ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        <Tabs defaultValue="general">
          <TabsList className="mb-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="contact-info">Contact Information</TabsTrigger>
            <TabsTrigger value="form-fields">Form Fields</TabsTrigger>
            <TabsTrigger value="advanced">Advanced Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Configure the main settings for the contact section.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Section Title</Label>
                    <Input 
                      id="title" 
                      name="title" 
                      value={settings.title} 
                      onChange={handleBasicInfoChange} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subtitle">Section Subtitle</Label>
                    <Input 
                      id="subtitle" 
                      name="subtitle" 
                      value={settings.subtitle} 
                      onChange={handleBasicInfoChange} 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Section Description</Label>
                  <RichTextEditor
                    value={settings.description}
                    onChange={handleDescriptionChange}
                    height="150px"
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

          <TabsContent value="contact-info" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information Items</CardTitle>
                <CardDescription>
                  Manage the contact information displayed in the contact section.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={addContactInfoItem}
                  className="mb-4"
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Contact Info Item
                </Button>
                
                {settings.contactInfoItems.map((item, index) => (
                  <div key={item.id} className="p-4 border rounded-md space-y-3 relative">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute right-2 top-2" 
                      onClick={() => removeContactInfoItem(item.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    
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
                          placeholder="Lucide icon name (e.g. MapPin, Phone, Mail)"
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
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="form-fields" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Form Fields Configuration</CardTitle>
                <CardDescription>
                  Customize the form fields that will be displayed in the contact form.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={addFormField}
                  className="mb-4"
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Form Field
                </Button>

                {settings.formFields.map((field, index) => (
                  <div key={field.id} className="p-4 border rounded-md space-y-3 relative">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute right-2 top-2" 
                      onClick={() => removeFormField(field.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Field Label</Label>
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
                      <div className="space-y-2">
                        <Label>Field Type</Label>
                        <select 
                          className="w-full h-10 px-3 rounded-md border border-input bg-background" 
                          value={field.type} 
                          onChange={(e) => handleFormFieldUpdate(index, 'type', e.target.value)}
                        >
                          <option value="text">Text</option>
                          <option value="email">Email</option>
                          <option value="phone">Phone</option>
                          <option value="textarea">Textarea</option>
                          <option value="select">Select</option>
                          <option value="checkbox">Checkbox</option>
                          <option value="radio">Radio</option>
                          <option value="date">Date</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Placeholder</Label>
                        <Input 
                          value={field.placeholder} 
                          onChange={(e) => handleFormFieldUpdate(index, 'placeholder', e.target.value)} 
                        />
                      </div>
                      <div className="flex items-center space-x-2 h-full pt-8">
                        <Switch 
                          checked={field.required} 
                          onCheckedChange={(checked) => handleFormFieldUpdate(index, 'required', checked)} 
                        />
                        <Label>Required field</Label>
                      </div>
                    </div>

                    {(field.type === 'select' || field.type === 'radio' || field.type === 'checkbox') && (
                      <div className="mt-4 border-t pt-4">
                        <div className="flex justify-between items-center mb-2">
                          <Label>Options</Label>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => addFieldOption(index)}
                          >
                            <Plus className="h-3 w-3 mr-1" /> Add Option
                          </Button>
                        </div>
                        <div className="space-y-2">
                          {field.options?.map((option, optionIndex) => (
                            <div key={option.id} className="flex gap-2 items-center">
                              <Input 
                                className="flex-1"
                                value={option.label} 
                                onChange={(e) => updateFieldOption(index, optionIndex, 'label', e.target.value)} 
                                placeholder="Option label"
                              />
                              <Input 
                                className="flex-1"
                                value={option.value} 
                                onChange={(e) => updateFieldOption(index, optionIndex, 'value', e.target.value)} 
                                placeholder="Option value"
                              />
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => removeFieldOption(index, option.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Settings</CardTitle>
                <CardDescription>
                  Configure advanced features for the contact form.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch 
                    checked={settings.enableRecaptcha} 
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableRecaptcha: checked }))} 
                  />
                  <Label>Enable reCAPTCHA</Label>
                </div>
                
                {settings.enableRecaptcha && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6 mt-2">
                    <div className="space-y-2">
                      <Label htmlFor="recaptchaSiteKey">reCAPTCHA Site Key</Label>
                      <Input 
                        id="recaptchaSiteKey" 
                        name="recaptchaSiteKey" 
                        value={settings.recaptchaSiteKey} 
                        onChange={handleBasicInfoChange} 
                        placeholder="Enter your reCAPTCHA site key"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="recaptchaSecretKey">reCAPTCHA Secret Key</Label>
                      <Input 
                        id="recaptchaSecretKey" 
                        name="recaptchaSecretKey" 
                        value={settings.recaptchaSecretKey} 
                        onChange={handleBasicInfoChange} 
                        placeholder="Enter your reCAPTCHA secret key"
                        type="password"
                      />
                    </div>
                  </div>
                )}

                <Separator className="my-4" />

                <div className="flex items-center space-x-2">
                  <Switch 
                    checked={settings.enableFingerprinting} 
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableFingerprinting: checked }))} 
                  />
                  <Label>Enable User Fingerprinting</Label>
                </div>

                <Separator className="my-4" />

                <div className="flex items-center space-x-2">
                  <Switch 
                    checked={settings.enableEmailNotifications} 
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableEmailNotifications: checked }))} 
                  />
                  <Label>Enable Email Notifications</Label>
                </div>
                
                {settings.enableEmailNotifications && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6 mt-2">
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
                        placeholder="contact@example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emailSubject">Email Subject Template</Label>
                      <Input 
                        id="emailSubject" 
                        name="emailSubject" 
                        value={settings.emailSubject} 
                        onChange={handleBasicInfoChange} 
                        placeholder="New contact form submission: {subject}"
                      />
                    </div>
                  </div>
                )}

                <Separator className="my-4" />

                <div className="flex items-center space-x-2">
                  <Switch 
                    checked={settings.enableAppointmentScheduling} 
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableAppointmentScheduling: checked }))} 
                  />
                  <Label>Enable Appointment Scheduling</Label>
                </div>
                
                {settings.enableAppointmentScheduling && (
                  <div className="grid grid-cols-1 gap-4 pl-6 mt-2">
                    <div className="space-y-2">
                      <Label htmlFor="appointmentLabel">Appointment Field Label</Label>
                      <Input 
                        id="appointmentLabel" 
                        name="appointmentLabel" 
                        value={settings.appointmentLabel} 
                        onChange={handleBasicInfoChange} 
                        placeholder="Schedule an Appointment"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Available Days</Label>
                      <div className="flex flex-wrap gap-2">
                        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                          <div key={day} className="flex items-center space-x-2">
                            <Switch 
                              checked={settings.availableDays?.includes(day)} 
                              onCheckedChange={(checked) => {
                                setSettings(prev => {
                                  const currentDays = prev.availableDays || [];
                                  return {
                                    ...prev, 
                                    availableDays: checked
                                      ? [...currentDays, day]
                                      : currentDays.filter(d => d !== day)
                                  };
                                });
                              }} 
                            />
                            <Label>{day}</Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="workingHoursStart">Working Hours Start</Label>
                        <Input 
                          id="workingHoursStart" 
                          name="workingHoursStart" 
                          value={settings.workingHoursStart} 
                          onChange={handleBasicInfoChange} 
                          placeholder="09:00"
                          type="time"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="workingHoursEnd">Working Hours End</Label>
                        <Input 
                          id="workingHoursEnd" 
                          name="workingHoursEnd" 
                          value={settings.workingHoursEnd} 
                          onChange={handleBasicInfoChange} 
                          placeholder="17:00"
                          type="time"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminContactSettings;
