
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/lib/i18n";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
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

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(6, { message: "Phone number is required" }),
  service: z.string().min(1, { message: "Please select a service" }),
});

type FormData = z.infer<typeof formSchema>;

const ServicesCTA: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      service: "",
    },
  });
  
  const features = [
    t('services.cta.features.title1'),
    t('services.cta.features.title2'),
    t('services.cta.features.title3'),
    t('services.cta.features.title4'),
    t('services.cta.features.title5'),
    t('services.cta.features.title6')
  ];
  
  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Form submitted successfully!",
        description: "We'll get back to you as soon as possible.",
      });
      
      form.reset();
    } catch (error) {
      toast({
        title: "Error submitting form",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <section className="py-16 md:py-24 bg-card">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-6 should-animate">
            <h2 className="text-3xl md:text-4xl font-display font-bold">
              {t('services.cta.title')}
            </h2>
            
            <p className="text-muted-foreground">
              {t('services.cta.description')}
            </p>
            
            <ul className="space-y-3 pt-4">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                to="/contact"
                className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2"
              >
                {t('services.cta.button.primary')}
                <ArrowRight className="w-4 h-4" />
              </Link>
              
              <Link
                to="/portfolio"
                className="bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-medium hover:bg-secondary/80 transition-colors inline-flex items-center justify-center"
              >
                {t('services.cta.button.secondary')}
              </Link>
            </div>
          </div>
          
          <div className="bg-background border border-border rounded-xl p-6 lg:p-8 should-animate delay-200">
            <h3 className="text-xl font-semibold mb-6">
              {t('services.form.title')}
            </h3>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('services.form.name')}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t('services.form.name.placeholder')}
                          {...field}
                        />
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
                      <FormLabel>{t('services.form.email')}</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder={t('services.form.email.placeholder')}
                          {...field}
                        />
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
                          inputProps={{
                            name: 'phone',
                            required: true,
                          }}
                          inputClass="w-full p-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                          containerClass="w-full"
                          buttonClass="border border-input rounded-l-md"
                          dropdownClass="bg-background text-foreground"
                          enableSearch={true}
                          searchPlaceholder="Search countries..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="service"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('services.form.service')}</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('services.form.service.placeholder')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="web">{t('services.web.title')}</SelectItem>
                          <SelectItem value="mobile">{t('services.mobile.title')}</SelectItem>
                          <SelectItem value="ui">{t('services.ui.title')}</SelectItem>
                          <SelectItem value="digital">{t('services.digital.title')}</SelectItem>
                          <SelectItem value="seo">{t('services.seo.title')}</SelectItem>
                          <SelectItem value="ecommerce">{t('services.ecommerce.title')}</SelectItem>
                          <SelectItem value="content">{t('services.content.title')}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full mt-2 bg-primary text-primary-foreground hover:opacity-90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : t('services.form.submit')}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesCTA;
