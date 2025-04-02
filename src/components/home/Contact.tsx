
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ContactFormField } from "@/lib/types";
import { storageService } from "@/lib/storage";
import { useLanguage } from "@/lib/i18n";

const contactFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
  terms: z.boolean().default(false),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

interface ContactProps {
  className?: string;
}

const Contact: React.FC<ContactProps> = ({ className }) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formFields, setFormFields] = useState<ContactFormField[]>([]);
  const [contactSettings, setContactSettings] = useState<any>({});
  const [formData, setFormData] = useState<Record<string, string>>({});

  useEffect(() => {
    const settings = storageService.getContactSettings();
    setContactSettings(settings);
    setFormFields(settings.formFields);

    // Initialize form data state with default values
    const initialFormData: Record<string, string> = {};
    settings.formFields.forEach((field: ContactFormField) => {
      initialFormData[field.name] = ""; // Set default value to empty string
    });
    setFormData(initialFormData);
  }, []);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
      terms: false,
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate required fields
      const requiredFields = formFields.filter(field => field.required);
      for (const field of requiredFields) {
        if (!formData[field.name]) {
          toast({
            title: "Error",
            description: `Please fill in the ${field.label} field.`,
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
      }

      // Construct contact request object
      const contactRequest = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject || "Contact form submission",
        message: formData.message,
        createdAt: new Date().toISOString(),
        status: "new" as const
      };

      storageService.addContactRequest(contactRequest);

      toast({
        title: "Success",
        description: "Your message has been sent successfully!",
      });

      // Reset form data
      const resetFormData: Record<string, string> = {};
      formFields.forEach(field => {
        resetFormData[field.name] = "";
      });
      setFormData(resetFormData);

      // Reset form fields using react-hook-form reset
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className={cn("container grid items-center gap-6 py-8 md:py-10", className)}>
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
          {contactSettings.title || t('contact.title')}
        </h2>
        <p className="max-w-[700px] text-muted-foreground">
          {contactSettings.description || t('contact.description')}
        </p>
      </div>
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>{contactSettings.subtitle || t('contact.subtitle')}</CardTitle>
          <CardDescription>
            {t('contact.formDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Form {...form}>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              {formFields.filter(field => field.type === 'text' || field.type === 'email' || field.type === 'tel').map((field) => {
                return (
                  <FormField
                    key={field.id}
                    control={form.control}
                    name={field.name as keyof ContactFormValues}
                    render={({ field: formField }) => (
                      <FormItem>
                        <FormLabel>{field.label} {field.required && <span className="text-red-500">*</span>}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={field.placeholder}
                            type={field.type}
                            required={field.required}
                            value={formData[field.name] || ""}
                            onChange={handleInputChange}
                            {...formField}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                );
              })}

              {formFields.filter(field => field.type === 'select').map((field) => {
                return (
                  <div key={field.id} className="w-full">
                    <label htmlFor={field.name} className="block text-sm font-medium mb-1">
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>
                    <select
                      id={field.name}
                      name={field.name}
                      required={field.required}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={formData[field.name] || ""}
                      onChange={handleInputChange}
                    >
                      <option value="">Select {field.label}</option>
                      {field.options && field.options.map((option, index) => (
                        <option key={index} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              })}

              {formFields.filter(field => field.type === 'textarea').map((field) => {
                return (
                  <FormField
                    key={field.id}
                    control={form.control}
                    name={field.name as keyof ContactFormValues}
                    render={({ field: formField }) => (
                      <FormItem>
                        <FormLabel>{field.label} {field.required && <span className="text-red-500">*</span>}</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={field.placeholder}
                            required={field.required}
                            className="resize-none"
                            value={formData[field.name] || ""}
                            onChange={handleInputChange}
                            {...formField}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                );
              })}

              {formFields.filter(field => field.type === 'checkbox').map((field) => {
                return (
                  <FormField
                    key={field.id}
                    control={form.control}
                    name={field.name as keyof ContactFormValues}
                    render={({ field: formField }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={formData[field.name] === "true"}
                            onCheckedChange={(checked) => {
                              setFormData(prevData => ({
                                ...prevData,
                                [field.name]: checked ? "true" : "",
                              }));
                              formField.onChange(checked);
                            }}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>{field.label}</FormLabel>
                          <FormDescription>
                            This is for testing purposes.
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                );
              })}

              <Button disabled={isLoading}>
                {isLoading && (
                  <svg
                    className="mr-2 h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                )}
                {contactSettings.submitButtonText || t('contact.submit')}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </section>
  );
};

export default Contact;
