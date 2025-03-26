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
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { storageService } from "@/lib/storage";

const contactSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(6, { message: "Phone number is required" }),
  subject: z.string().min(2, { message: "Subject is required" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
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
      phone: "",
      subject: "",
      message: "",
    },
  });
  
  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    
    try {
      // Save to our storage service with required fields
      storageService.addContactRequest({
        name: data.name,
        email: data.email,
        phone: data.phone,
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
              <form onSubmit={form.handleSubmit(onSubmit)} className="bg-card border border-border rounded-xl p-6 md:p-8 space-y-6 card-hover">
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
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field: { onChange, value } }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <PhoneInput
                          country={'us'}
                          value={value}
                          onChange={onChange}
                          inputClass="w-full p-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                          containerClass="w-full"
                          buttonClass="border border-input rounded-l-md"
                          dropdownClass="bg-background text-foreground"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
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
