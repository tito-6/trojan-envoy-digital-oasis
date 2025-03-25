
import React, { useState } from "react";
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
import { storageService } from "@/lib/storage";

// Define the country codes for the dropdown
const countryCodes = [
  { code: "+1", country: "US", label: "United States (+1)" },
  { code: "+44", country: "UK", label: "United Kingdom (+44)" },
  { code: "+91", country: "IN", label: "India (+91)" },
  { code: "+61", country: "AU", label: "Australia (+61)" },
  { code: "+33", country: "FR", label: "France (+33)" },
  { code: "+49", country: "DE", label: "Germany (+49)" },
  { code: "+86", country: "CN", label: "China (+86)" },
  { code: "+81", country: "JP", label: "Japan (+81)" },
  { code: "+82", country: "KR", label: "South Korea (+82)" },
  { code: "+55", country: "BR", label: "Brazil (+55)" },
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
  DEFAULT: /^\d{7,15}$/, // Generic: 7-15 digits
};

const contactSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  countryCode: z.string().default("+1"),
  phoneNumber: z.string().refine((val) => {
    // This will be validated with the selected country code
    return true;
  }, { message: "Invalid phone number format" }),
  subject: z.string().min(2, { message: "Subject is required" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
})
.refine((data) => {
  // Get the country from the country code
  const countryObj = countryCodes.find(c => c.code === data.countryCode);
  const country = countryObj ? countryObj.country : "DEFAULT";
  
  // Get the regex for that country
  const regex = phoneRegexMap[country] || phoneRegexMap.DEFAULT;
  
  // Test the phone number against the regex
  return regex.test(data.phoneNumber.replace(/\D/g, ''));
}, {
  message: "Invalid phone number for the selected country",
  path: ["phoneNumber"]
});

type ContactFormData = z.infer<typeof contactSchema>;

const Contact: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      countryCode: "+1",
      phoneNumber: "",
      subject: "",
      message: "",
    },
  });
  
  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    
    // Format the phone number with country code
    const fullPhoneNumber = `${data.countryCode} ${data.phoneNumber}`;
    
    try {
      // Save to our storage service
      storageService.addContactRequest({
        name: data.name,
        email: data.email,
        phone: fullPhoneNumber,
        subject: data.subject,
        message: data.message,
      });
      
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
              {t('contact.title')}
              <span className="block text-gradient mt-1">{t('contact.subtitle')}</span>
            </h2>
            
            <p className="text-muted-foreground mb-8 max-w-md">
              Have a project in mind? Let's talk about how we can help your business grow through innovative digital solutions.
            </p>
            
            <div className="space-y-8">
              <div className="contact-info-item">
                <h3 className="text-lg font-semibold mb-2">Office Address</h3>
                <p className="text-muted-foreground">
                  1234 Tech Avenue, Innovation District<br />
                  New York, NY 10001, USA
                </p>
              </div>
              
              <div className="contact-info-item">
                <h3 className="text-lg font-semibold mb-2">Contact Information</h3>
                <p className="text-muted-foreground">
                  Email: contact@trojanenvoy.com<br />
                  Phone: +1 (555) 123-4567
                </p>
              </div>
              
              <div className="contact-info-item">
                <h3 className="text-lg font-semibold mb-2">Working Hours</h3>
                <p className="text-muted-foreground">
                  Monday - Friday: 9:00 AM - 6:00 PM<br />
                  Saturday & Sunday: Closed
                </p>
              </div>
            </div>
          </div>
          
          <div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="bg-card border border-border rounded-xl p-6 md:p-8 space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('contact.name')}</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('contact.email')}</FormLabel>
                      <FormControl>
                        <Input placeholder="john@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="countryCode"
                    render={({ field }) => (
                      <FormItem className="md:col-span-1">
                        <FormLabel>Country Code</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select country" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {countryCodes.map((country) => (
                              <SelectItem key={country.code} value={country.code}>
                                {country.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="(555) 123-4567" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('contact.subject')}</FormLabel>
                      <FormControl>
                        <Input placeholder="Project Inquiry" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('contact.message')}</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Tell us about your project..." 
                          rows={5}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-70 flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <span className="animate-pulse">Sending...</span>
                  ) : (
                    t('contact.submit')
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

export default Contact;
