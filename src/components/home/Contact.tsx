
import React, { useState, useEffect } from "react";
import { useLanguage } from "@/lib/i18n";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { storageService } from "@/lib/storage";
import { LucideIcon, MapPin, Phone, Mail, Clock } from "lucide-react";
import { ContactFormField } from "@/lib/types";

// Define the country codes for the dropdown
const countryCodes = [
  { code: "+1", country: "US", label: "United States (+1)", flag: "🇺🇸" },
  { code: "+44", country: "UK", label: "United Kingdom (+44)", flag: "🇬🇧" },
  { code: "+91", country: "IN", label: "India (+91)", flag: "🇮🇳" },
  { code: "+61", country: "AU", label: "Australia (+61)", flag: "🇦🇺" },
  { code: "+33", country: "FR", label: "France (+33)", flag: "🇫🇷" },
  { code: "+49", country: "DE", label: "Germany (+49)", flag: "🇩🇪" },
  { code: "+86", country: "CN", label: "China (+86)", flag: "🇨🇳" },
  { code: "+81", country: "JP", label: "Japan (+81)", flag: "🇯🇵" },
  { code: "+82", country: "KR", label: "South Korea (+82)", flag: "🇰🇷" },
  { code: "+55", country: "BR", label: "Brazil (+55)", flag: "🇧🇷" },
  { code: "+52", country: "MX", label: "Mexico (+52)", flag: "🇲🇽" },
  { code: "+34", country: "ES", label: "Spain (+34)", flag: "🇪🇸" },
  { code: "+39", country: "IT", label: "Italy (+39)", flag: "🇮🇹" },
  { code: "+7", country: "RU", label: "Russia (+7)", flag: "🇷🇺" },
  { code: "+27", country: "ZA", label: "South Africa (+27)", flag: "🇿🇦" }
];

// Define the phone number regex for different countries
const phoneRegexMap: Record<string, RegExp> = {
  US: /^\d{10}$/, // US: 10 digits
  UK: /^\d{10,11}$/, // UK: 10-11 digits
  IN: /^\d{10}$/, // India: 10 digits
  AU: /^\d{9,10}$/, // Australia: 9-10 digits
  FR: /^\d{9}$/, // France: 9 digits
  DE: /^\d{10,11}$/, // Germany: 10-11 digits
  CN: /^\d{11}$/, // China: 11 digits
  JP: /^\d{10,11}$/, // Japan: 10-11 digits
  KR: /^\d{9,10}$/, // South Korea: 9-10 digits
  BR: /^\d{10,11}$/, // Brazil: 10-11 digits
  MX: /^\d{10}$/, // Mexico: 10 digits
  ES: /^\d{9}$/, // Spain: 9 digits
  IT: /^\d{10}$/, // Italy: 10 digits
  RU: /^\d{10}$/, // Russia: 10 digits
  ZA: /^\d{9}$/, // South Africa: 9 digits
  DEFAULT: /^\d{7,15}$/, // Generic: 7-15 digits
};

const Contact: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [settings, setSettings] = useState(() => storageService.getContactSettings());
  
  useEffect(() => {
    const handleSettingsUpdate = () => {
      setSettings(storageService.getContactSettings());
    };
    
    const unsubscribe = storageService.addEventListener('contact-settings-updated', handleSettingsUpdate);
    
    return () => {
      unsubscribe();
    };
  }, []);

  // Dynamically build the validation schema based on form fields
  const createValidationSchema = () => {
    const schemaFields: Record<string, any> = {};
    
    settings.formFields.forEach(field => {
      let fieldSchema;
      
      switch (field.type) {
        case 'email':
          fieldSchema = z.string().email({ message: "Invalid email address" });
          break;
        case 'phone':
          fieldSchema = z.string();
          break;
        case 'textarea':
          fieldSchema = z.string().min(10, { message: "Must be at least 10 characters" });
          break;
        case 'checkbox':
          fieldSchema = z.array(z.string()).optional();
          break;
        case 'date':
          fieldSchema = z.string().optional();
          break;
        default:
          fieldSchema = z.string().min(1, { message: "Field is required" });
          break;
      }
      
      if (!field.required) {
        fieldSchema = fieldSchema.optional();
      }
      
      schemaFields[field.name] = fieldSchema;
    });
    
    // Special handling for phone field
    const phoneField = settings.formFields.find(f => f.type === 'phone');
    if (phoneField) {
      schemaFields.countryCode = z.string().default("+1");
    }
    
    const baseSchema = z.object(schemaFields);
    
    // Add refinement for phone validation if needed
    if (phoneField) {
      return baseSchema.refine((data) => {
        if (!data[phoneField.name] || !data.countryCode) return true;
        
        const countryObj = countryCodes.find(c => c.code === data.countryCode);
        const country = countryObj ? countryObj.country : "DEFAULT";
        const regex = phoneRegexMap[country] || phoneRegexMap.DEFAULT;
        
        return regex.test(data[phoneField.name].replace(/\D/g, ''));
      }, {
        message: "Invalid phone number for the selected country",
        path: [phoneField.name]
      });
    }
    
    return baseSchema;
  };
  
  const validationSchema = createValidationSchema();
  type ContactFormData = z.infer<typeof validationSchema>;
  
  // Create default values for the form
  const createDefaultValues = () => {
    const defaultValues: Record<string, any> = {};
    
    settings.formFields.forEach(field => {
      switch (field.type) {
        case 'checkbox':
          defaultValues[field.name] = [];
          break;
        case 'radio':
          defaultValues[field.name] = field.options?.[0]?.value || "";
          break;
        default:
          defaultValues[field.name] = "";
          break;
      }
    });
    
    const phoneField = settings.formFields.find(f => f.type === 'phone');
    if (phoneField) {
      defaultValues.countryCode = "+1";
    }
    
    return defaultValues;
  };
  
  const form = useForm<ContactFormData>({
    resolver: zodResolver(validationSchema),
    defaultValues: createDefaultValues(),
  });
  
  // Get icon component by name
  const getIconComponent = (iconName: string): React.ReactNode => {
    switch (iconName) {
      case 'MapPin':
        return <MapPin className="w-5 h-5 text-primary" />;
      case 'Phone':
        return <Phone className="w-5 h-5 text-primary" />;
      case 'Mail':
        return <Mail className="w-5 h-5 text-primary" />;
      case 'Clock':
        return <Clock className="w-5 h-5 text-primary" />;
      default:
        return <div className="w-5 h-5 text-primary">{iconName}</div>;
    }
  };
  
  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    
    try {
      // Format phone number with country code if applicable
      const phoneField = settings.formFields.find(f => f.type === 'phone');
      let formattedData = { ...data };
      
      if (phoneField && data[phoneField.name] && data.countryCode) {
        formattedData[phoneField.name] = `${data.countryCode} ${data[phoneField.name]}`;
      }
      
      // Remove countryCode from data before submission
      if (formattedData.countryCode) {
        delete formattedData.countryCode;
      }
      
      // Prepare data for storage
      const contactRequest: Partial<ContactRequest> = {
        name: formattedData.name as string,
        email: formattedData.email as string,
        subject: formattedData.subject as string,
        message: formattedData.message as string,
      };
      
      if (phoneField) {
        contactRequest.phone = formattedData[phoneField.name] as string;
      }
      
      // Save to storage service
      storageService.addContactRequest(contactRequest);
      
      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you as soon as possible.",
      });
      
      form.reset();
    } catch (error) {
      toast({
        title: "Error sending message",
        description: "Please try again later.",
        variant: "destructive",
      });
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="section-padding" id="contact">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <div>
            <div className="inline-block px-4 py-1.5 rounded-full bg-secondary mb-4 text-sm font-medium">
              Get In Touch
            </div>
            
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
              {settings.title}
              <span className="block text-gradient mt-1">{settings.subtitle}</span>
            </h2>
            
            <div className="text-muted-foreground mb-8 max-w-md"
              dangerouslySetInnerHTML={{
                __html: typeof settings.description === 'string' 
                  ? settings.description 
                  : settings.description?.blocks?.[0]?.text || ''
              }}
            />
            
            <div className="space-y-8">
              {settings.contactInfoItems.map((item) => (
                <div key={item.id} className="contact-info-item">
                  <div className="flex items-start gap-3">
                    {getIconComponent(item.icon)}
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                      <p className="text-muted-foreground whitespace-pre-line">
                        {item.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="bg-card border border-border rounded-xl p-6 md:p-8 space-y-6 card-hover">
                {settings.formFields.map((field) => (
                  <FormField
                    key={field.id}
                    control={form.control}
                    name={field.name}
                    render={({ field: formField }) => (
                      <FormItem>
                        <FormLabel>{field.label}</FormLabel>
                        <FormControl>
                          {renderFormControl(field, formField, form)}
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
                
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-70 flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <span className="animate-pulse">Sending...</span>
                  ) : (
                    settings.submitButtonText || t('contact.submit')
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
};

// Helper function to render the appropriate form control based on field type
function renderFormControl(
  field: ContactFormField, 
  formField: any, 
  form: any
) {
  switch (field.type) {
    case 'text':
    case 'email':
      return (
        <Input 
          placeholder={field.placeholder} 
          {...formField} 
        />
      );
    
    case 'phone':
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <FormField
              control={form.control}
              name="countryCode"
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countryCodes.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        <span className="mr-2">{country.flag}</span> {country.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="md:col-span-2">
            <Input 
              placeholder={field.placeholder} 
              {...formField} 
            />
          </div>
        </div>
      );
    
    case 'textarea':
      return (
        <Textarea 
          placeholder={field.placeholder} 
          rows={5}
          {...formField} 
        />
      );
    
    case 'select':
      return (
        <Select
          onValueChange={formField.onChange}
          defaultValue={formField.value}
        >
          <SelectTrigger>
            <SelectValue placeholder={field.placeholder} />
          </SelectTrigger>
          <SelectContent>
            {field.options?.map((option) => (
              <SelectItem key={option.id} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    
    case 'checkbox':
      return (
        <div className="space-y-2">
          {field.options?.map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <Checkbox
                id={`${field.name}-${option.id}`}
                value={option.value}
                onCheckedChange={(checked) => {
                  const currentValues = formField.value || [];
                  if (checked) {
                    formField.onChange([...currentValues, option.value]);
                  } else {
                    formField.onChange(
                      currentValues.filter((value: string) => value !== option.value)
                    );
                  }
                }}
              />
              <label
                htmlFor={`${field.name}-${option.id}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {option.label}
              </label>
            </div>
          ))}
        </div>
      );
    
    case 'radio':
      return (
        <RadioGroup
          onValueChange={formField.onChange}
          defaultValue={formField.value}
          className="space-y-2"
        >
          {field.options?.map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <RadioGroupItem
                value={option.value}
                id={`${field.name}-${option.id}`}
              />
              <label
                htmlFor={`${field.name}-${option.id}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {option.label}
              </label>
            </div>
          ))}
        </RadioGroup>
      );
    
    case 'date':
      return (
        <Input 
          type="date"
          {...formField} 
        />
      );
    
    default:
      return (
        <Input 
          placeholder={field.placeholder} 
          {...formField} 
        />
      );
  }
}

export default Contact;
