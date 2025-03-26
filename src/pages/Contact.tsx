
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import ContactHero from "@/components/contact/ContactHero";
import ContactInfo from "@/components/contact/ContactInfo";
import { useLanguage } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
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
        status: 'New',
        dateSubmitted: new Date().toISOString(),
      });
      
      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you as soon as possible.",
        variant: "default",
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

  useEffect(() => {
    // Add fade-in animation to elements
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("fade-in-element");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    const elements = document.querySelectorAll(".should-animate");
    elements.forEach((el) => observer.observe(el));

    // Scroll to top on page load
    window.scrollTo(0, 0);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        <ContactHero />
        
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="should-animate">
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                  {t('contact.title')}
                </h2>
                <p className="text-muted-foreground mb-8 max-w-md">
                  Have a project in mind? Fill out the form and our team will get back to you within 24 hours.
                </p>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                      className="w-full md:w-auto card-hover"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>Processing</>
                      ) : (
                        <>
                          {t('contact.submit')}
                          <Send className="ml-2 w-4 h-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </div>
              
              <ContactInfo />
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;
