
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { JobOpening } from '@/lib/types';
import { useLanguage } from '@/lib/i18n';

interface JobApplicationFormProps {
  job: JobOpening;
}

// Create application schema
const applicationSchema = z.object({
  firstName: z.string().min(2, { message: "First name is required" }),
  lastName: z.string().min(2, { message: "Last name is required" }),
  email: z.string().email({ message: "Valid email is required" }),
  phone: z.string().min(6, { message: "Phone number is required" }),
  resume: z.any().optional(),
  coverLetter: z.string().min(10, { message: "Cover letter is required" }).max(2000, { message: "Cover letter is too long" }),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

const JobApplicationForm: React.FC<JobApplicationFormProps> = ({ job }) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      coverLetter: '',
    },
  });
  
  const handleSubmit = async (data: ApplicationFormData) => {
    setIsSubmitting(true);
    
    try {
      // Here you would typically send the application to a backend API
      // For now, we'll just simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Application Submitted!",
        description: "Thank you for your application. We'll be in touch soon.",
      });
      
      form.reset();
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem submitting your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="w-full md:w-auto">
          {t('careers.apply')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {t('careers.applyForPosition')} {job.title}
          </DialogTitle>
          <DialogDescription>
            {t('careers.fillOutForm')}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('careers.firstName')}</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('careers.lastName')}</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('careers.email')}</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="you@example.com" 
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
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('careers.phone')}</FormLabel>
                    <FormControl>
                      <div className="phone-input-container">
                        <PhoneInput
                          international
                          defaultCountry="US"
                          value={field.value}
                          onChange={(value) => field.onChange(value || '')}
                          inputComponent={Input}
                          className="PhoneInput"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="resume"
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>{t('careers.resume')}</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        onChange(file);
                      }}
                      {...fieldProps}
                    />
                  </FormControl>
                  <FormDescription>
                    {t('careers.resumeFormats')}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="coverLetter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('careers.coverLetter')}</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder={t('careers.coverLetterPlaceholder')}
                      rows={6}
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    {t('careers.coverLetterDescription')}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
              >
                {t('common.cancel')}
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
              >
                {isSubmitting ? 
                  <span className="animate-pulse">{t('common.submitting')}</span> : 
                  t('careers.submitApplication')
                }
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default JobApplicationForm;
