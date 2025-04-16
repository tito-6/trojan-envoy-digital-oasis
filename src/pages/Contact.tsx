import React, { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { 
  Send, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MessageSquare, 
  Briefcase,
  Clock,
  CheckCircle2,
  ArrowRight,
  AlertCircle
} from "lucide-react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import ContactHero from "@/components/contact/ContactHero";
import ContactInfo from "@/components/contact/ContactInfo";
import { Button } from "@/components/ui/button";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { storageService } from "@/lib/storage";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Form validator schema with improved error messages
const contactSchema = z.object({
  name: z.string().min(2, { message: "Please enter your full name" }),
  email: z.string().email({ message: "Please provide a valid email address" }),
  phone: z.string().min(5, { message: "Please enter a valid phone number" }),
  subject: z.string().min(2, { message: "Please select or enter a subject" }),
  message: z.string().min(10, { message: "Please provide details about your inquiry (min. 10 characters)" }),
  appointment: z.date().optional(),
  preferredContact: z.enum(["email", "phone", "any"]).default("any"),
  urgency: z.enum(["low", "medium", "high"]).default("medium"),
});

type ContactFormData = z.infer<typeof contactSchema>;

// Floating label input component for enhanced UI
const FloatingLabelInput = ({ 
  label, 
  icon: Icon,
  error,
  ...props 
}: { 
  label: string; 
  icon: React.ElementType;
  error?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>) => {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  return (
    <div 
      className={`relative h-14 w-full border rounded-lg transition-all duration-200 group
        ${error ? 'border-destructive' : focused ? 'border-primary' : 'border-input'}`}
      onClick={() => inputRef.current?.focus()}
    >
      <Icon className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-all duration-200
        ${focused ? 'text-primary' : 'text-muted-foreground'}`} 
      />
      <input
        ref={inputRef}
        className="peer h-full w-full border-0 bg-transparent px-10 pt-5 pb-1 text-foreground focus:outline-none focus:ring-0"
        onFocus={() => setFocused(true)}
        onBlur={(e) => setFocused(!!e.target.value)}
        {...props}
      />
      <label 
        className={`absolute left-10 transition-all duration-200
          ${(focused || (inputRef.current && inputRef.current.value)) ? 
            'top-1.5 text-xs' : 'top-1/2 -translate-y-1/2 text-sm'}
          ${focused ? 'text-primary' : 'text-muted-foreground'}`}
      >
        {label}
      </label>
    </div>
  );
};

// Step indicator component for multi-step form
const StepIndicator = ({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) => {
  return (
    <div className="flex items-center justify-center my-6 space-x-2">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div key={index} className="flex items-center">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: currentStep === index + 1 ? 1.1 : 1 }}
            className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300
              ${currentStep === index + 1 ? 
                'border-primary bg-primary text-primary-foreground font-bold' : 
                currentStep > index + 1 ? 
                  'border-primary bg-primary/10 text-primary' : 
                  'border-muted bg-muted/20 text-muted-foreground'}`}
          >
            {currentStep > index + 1 ? <CheckCircle2 className="w-4 h-4" /> : index + 1}
          </motion.div>
          {index < totalSteps - 1 && (
            <div className={`h-1 w-10 rounded-full mx-1 transition-colors duration-300
              ${currentStep > index + 1 ? 'bg-primary' : 'bg-muted'}`} 
            />
          )}
        </div>
      ))}
    </div>
  );
};

// Animated contact card component
const AnimatedContactCard = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
      className="h-full"
    >
      <Card className="h-full overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-500">
        <CardContent className="p-6">
          {children}
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Main Contact component
const Contact: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [phone, setPhone] = useState("");
  const [appointmentDate, setAppointmentDate] = useState<Date | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const formContainerRef = useRef<HTMLDivElement>(null);
  
  // Subject options for the dropdown
  const subjectOptions = [
    { value: "website_development", label: "Website Development" },
    { value: "mobile_app", label: "Mobile App Development" },
    { value: "ui_ux_design", label: "UI/UX Design" },
    { value: "digital_marketing", label: "Digital Marketing" },
    { value: "seo_optimization", label: "SEO Optimization" },
    { value: "consultation", label: "Technical Consultation" },
    { value: "other", label: "Other Inquiry" }
  ];

  // Initialize form with react-hook-form
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
      preferredContact: "any",
      urgency: "medium"
    },
  });

  // Add parallax scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (formContainerRef.current) {
        const scrollY = window.scrollY;
        const sections = formContainerRef.current.querySelectorAll('.parallax-section');
        
        sections.forEach((section, index) => {
          const speed = 0.05 * (index + 1);
          const yPos = scrollY * speed;
          (section as HTMLElement).style.transform = `translateY(${yPos}px)`;
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animation for form elements
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("fade-in-element");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    
    document.querySelectorAll(".should-animate").forEach((el) => {
      observer.observe(el);
    });
    
    // Scroll to top on mount
    window.scrollTo(0, 0);
    
    return () => observer.disconnect();
  }, []);

  // Handle form submission
  const handleSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    
    try {
      console.log("Submitting form data:", data);
      
      // First save to storage service
      storageService.addContactRequest({
        name: data.name,
        email: data.email,
        phone: data.phone,
        subject: data.subject,
        message: data.message,
        appointment: data.appointment ? data.appointment.toISOString() : undefined,
        preferredContact: data.preferredContact,
        urgency: data.urgency,
        createdAt: new Date().toISOString()
      });

      // Send to API endpoint
      const response = await axios.post("/api/contact", {
        name: data.name,
        email: data.email,
        phone: data.phone,
        subject: data.subject,
        message: data.message,
        appointment: data.appointment ? data.appointment.toISOString() : undefined,
        preferredContact: data.preferredContact,
        urgency: data.urgency
      });

      console.log("API Response:", response.data);

      if (!response.data.success) {
        throw new Error(response.data.error || "Failed to send message");
      }
      
      // Add success animation
      setSubmitStatus('success');
      
      // Show success toast
      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you within 24 hours. Please check your email for confirmation.",
      });
      
      // Reset form and redirect
      setTimeout(() => {
        form.reset();
        setPhone("");
        setAppointmentDate(null);
        setCurrentStep(1);
        
        navigate('/thank-you', { 
          state: { 
            name: data.name,
            email: data.email 
          }
        });
      }, 2000);
      
    } catch (error) {
      console.error("Error sending message:", error);
      setSubmitStatus('error');
      
      toast({
        title: "Error sending message",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Next step handler
  const handleNextStep = async () => {
    if (currentStep === 1) {
      // Validate first step fields
      const step1Valid = await form.trigger(['name', 'email', 'phone']);
      if (step1Valid) setCurrentStep(2);
    } else if (currentStep === 2) {
      // Validate second step fields
      const step2Valid = await form.trigger(['subject', 'preferredContact', 'urgency']);
      if (step2Valid) setCurrentStep(3);
    }
  };

  // Previous step handler
  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-background">
      <Header />

      <main className="relative">
        {/* Background elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(var(--color-primary),0.1),transparent_50%)]" />
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,rgba(var(--color-primary),0.05),transparent_40%)]" />
          <div className="absolute inset-y-0 right-0 w-1/3 bg-[linear-gradient(90deg,transparent,rgba(var(--color-primary),0.01)_30%)]" />
          
          {/* Grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(127,127,127,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(127,127,127,0.05)_1px,transparent_1px)] bg-[size:30px_30px]" />
          
          {/* Floating elements */}
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-primary/5 pointer-events-none"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: Math.random() * 200 + 50,
                height: Math.random() * 200 + 50,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: 15 + Math.random() * 10,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>

        <ContactHero />

        <section className="py-16 md:py-24 relative" ref={formContainerRef}>
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16 should-animate">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Badge className="px-4 py-1.5 text-sm font-medium mb-4">Get In Touch</Badge>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-6">
                  Let's Start a <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">Conversation</span>
                </h2>
                <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                  We value your input and are ready to answer any questions you may have about our services, process, or how we can help your business grow.
                </p>
              </motion.div>
            </div>
            
            {/* Main content grid */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Left side - Contact form */}
              <div className="lg:col-span-3 should-animate">
                <Tabs defaultValue="form" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-8">
                    <TabsTrigger value="form" className="text-base">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Contact Form
                    </TabsTrigger>
                    <TabsTrigger value="schedule" className="text-base">
                      <Calendar className="w-4 h-4 mr-2" />
                      Schedule Meeting
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="form" className="p-6 bg-card/30 backdrop-blur-sm rounded-xl border border-border/50 shadow-lg">
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                        {/* Step indicator */}
                        <StepIndicator currentStep={currentStep} totalSteps={3} />
                        
                        {/* Step 1: Personal Information */}
                        <AnimatePresence mode="wait">
                          {currentStep === 1 && (
                            <motion.div
                              key="step1"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -20 }}
                              transition={{ duration: 0.3 }}
                              className="space-y-6"
                            >
                              <div className="text-center mb-6">
                                <h3 className="text-xl font-semibold">Your Contact Information</h3>
                                <p className="text-muted-foreground text-sm">Please provide your details so we can get back to you</p>
                              </div>
                              
                              {/* Name field */}
                              <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <div className="space-y-2">
                                        <div className="flex items-center">
                                          <User className="mr-2 h-4 w-4 text-primary" />
                                          <FormLabel className="font-medium">Full Name</FormLabel>
                                        </div>
                                        <Input 
                                          placeholder="John Doe" 
                                          {...field} 
                                          className="bg-background/50 border-border/50 focus:border-primary"
                                        />
                                      </div>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              {/* Email field */}
                              <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <div className="space-y-2">
                                        <div className="flex items-center">
                                          <Mail className="mr-2 h-4 w-4 text-primary" />
                                          <FormLabel className="font-medium">Email Address</FormLabel>
                                        </div>
                                        <Input 
                                          placeholder="john@example.com" 
                                          {...field} 
                                          className="bg-background/50 border-border/50 focus:border-primary"
                                        />
                                      </div>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              {/* Phone field */}
                              <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <div className="space-y-2">
                                        <div className="flex items-center">
                                          <Phone className="mr-2 h-4 w-4 text-primary" />
                                          <FormLabel className="font-medium">Phone Number</FormLabel>
                                        </div>
                                        <PhoneInput
                                          country="tr"
                                          value={phone}
                                          onChange={(value) => {
                                            setPhone(value);
                                            field.onChange(value);
                                          }}
                                          containerClass="w-full"
                                          inputClass="w-full p-2.5 rounded-md !bg-background/50 border-border/50 focus:border-primary"
                                          buttonClass="!bg-background/50 border-border/50"
                                          dropdownClass="bg-background text-foreground"
                                          enableSearch={true}
                                          searchPlaceholder="Search countries..."
                                        />
                                      </div>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              {/* Preferred contact method */}
                              <FormField
                                control={form.control}
                                name="preferredContact"
                                render={({ field }) => (
                                  <FormItem>
                                    <div className="space-y-2">
                                      <div className="flex items-center">
                                        <FormLabel className="font-medium">Preferred Contact Method</FormLabel>
                                      </div>
                                      <div className="grid grid-cols-3 gap-2">
                                        {[
                                          { value: "email", label: "Email", icon: Mail },
                                          { value: "phone", label: "Phone", icon: Phone },
                                          { value: "any", label: "Either", icon: CheckCircle2 }
                                        ].map(option => (
                                          <Button
                                            key={option.value}
                                            type="button"
                                            variant={field.value === option.value ? "default" : "outline"}
                                            className={`flex items-center justify-center gap-2 ${field.value === option.value ? 'border-primary' : 'border-border/50'}`}
                                            onClick={() => field.onChange(option.value)}
                                          >
                                            <option.icon className="w-4 h-4" />
                                            {option.label}
                                          </Button>
                                        ))}
                                      </div>
                                    </div>
                                  </FormItem>
                                )}
                              />
                            </motion.div>
                          )}
                          
                          {/* Step 2: Project Information */}
                          {currentStep === 2 && (
                            <motion.div
                              key="step2"
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 20 }}
                              transition={{ duration: 0.3 }}
                              className="space-y-6"
                            >
                              <div className="text-center mb-6">
                                <h3 className="text-xl font-semibold">Project Details</h3>
                                <p className="text-muted-foreground text-sm">Tell us about your project or inquiry</p>
                              </div>
                              
                              {/* Subject field */}
                              <FormField
                                control={form.control}
                                name="subject"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <div className="space-y-2">
                                        <div className="flex items-center">
                                          <Briefcase className="mr-2 h-4 w-4 text-primary" />
                                          <FormLabel className="font-medium">Subject</FormLabel>
                                        </div>
                                        <select
                                          {...field}
                                          className="w-full p-2.5 rounded-md bg-background/50 border border-border/50 focus:border-primary"
                                        >
                                          <option value="" disabled>Select a subject</option>
                                          {subjectOptions.map(option => (
                                            <option key={option.value} value={option.value}>
                                              {option.label}
                                            </option>
                                          ))}
                                        </select>
                                      </div>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              {/* Urgency level */}
                              <FormField
                                control={form.control}
                                name="urgency"
                                render={({ field }) => (
                                  <FormItem>
                                    <div className="space-y-2">
                                      <div className="flex items-center">
                                        <Clock className="mr-2 h-4 w-4 text-primary" />
                                        <FormLabel className="font-medium">Urgency Level</FormLabel>
                                      </div>
                                      <div className="grid grid-cols-3 gap-2">
                                        {[
                                          { value: "low", label: "Low", color: "bg-green-500" },
                                          { value: "medium", label: "Medium", color: "bg-amber-500" },
                                          { value: "high", label: "High", color: "bg-rose-500" }
                                        ].map(option => (
                                          <Button
                                            key={option.value}
                                            type="button"
                                            variant={field.value === option.value ? "default" : "outline"}
                                            className={`flex items-center justify-center gap-2 ${field.value === option.value ? `border-${option.color}` : 'border-border/50'}`}
                                            onClick={() => field.onChange(option.value)}
                                          >
                                            <span className={`w-2 h-2 rounded-full ${option.color}`} />
                                            {option.label}
                                          </Button>
                                        ))}
                                      </div>
                                    </div>
                                  </FormItem>
                                )}
                              />
                              
                              {/* Appointment (optional) */}
                              <div className="space-y-2">
                                <div className="flex items-center">
                                  <Calendar className="mr-2 h-4 w-4 text-primary" />
                                  <FormLabel className="font-medium">Preferred Appointment (Optional)</FormLabel>
                                </div>
                                <DatePicker
                                  selected={appointmentDate}
                                  onChange={(date: Date | null) => {
                                    setAppointmentDate(date);
                                    form.setValue("appointment", date || undefined);
                                  }}
                                  showTimeSelect
                                  timeFormat="HH:mm"
                                  timeIntervals={30}
                                  minDate={new Date()}
                                  dateFormat="MMMM d, yyyy h:mm aa"
                                  wrapperClassName="w-full"
                                  className="w-full p-2.5 rounded-md bg-background/50 border border-border/50"
                                  placeholderText="Select date and time (optional)"
                                />
                              </div>
                            </motion.div>
                          )}
                          
                          {/* Step 3: Message */}
                          {currentStep === 3 && (
                            <motion.div
                              key="step3"
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              transition={{ duration: 0.3 }}
                              className="space-y-6"
                            >
                              <div className="text-center mb-6">
                                <h3 className="text-xl font-semibold">Your Message</h3>
                                <p className="text-muted-foreground text-sm">Provide details about your project or inquiry</p>
                              </div>
                              
                              {/* Message field */}
                              <FormField
                                control={form.control}
                                name="message"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <div className="space-y-2">
                                        <div className="flex items-center">
                                          <MessageSquare className="mr-2 h-4 w-4 text-primary" />
                                          <FormLabel className="font-medium">Message</FormLabel>
                                        </div>
                                        <Textarea
                                          placeholder="Please tell us about your project needs, timeline, budget, or any specific questions..."
                                          rows={8}
                                          {...field}
                                          className="bg-background/50 border-border/50 focus:border-primary resize-none"
                                        />
                                      </div>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              {/* Submit status animation */}
                              <AnimatePresence>
                                {submitStatus === 'success' && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="bg-green-500/10 text-green-500 rounded-lg p-4 flex items-center gap-3"
                                  >
                                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                                    <p>Your message has been sent successfully! Redirecting...</p>
                                  </motion.div>
                                )}
                                
                                {submitStatus === 'error' && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="bg-destructive/10 text-destructive rounded-lg p-4 flex items-center gap-3"
                                  >
                                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                    <p>There was an error sending your message. Please try again.</p>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </motion.div>
                          )}
                        </AnimatePresence>
                        
                        {/* Form navigation buttons */}
                        <div className="flex justify-between pt-4">
                          {currentStep > 1 ? (
                            <Button 
                              type="button" 
                              variant="outline" 
                              onClick={handlePrevStep}
                              className="border-border/50"
                            >
                              Back
                            </Button>
                          ) : <div></div>}
                          
                          {currentStep < 3 ? (
                            <Button 
                              type="button" 
                              onClick={handleNextStep}
                              className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90"
                            >
                              Next Step <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                          ) : (
                            <Button 
                              type="submit"
                              disabled={isSubmitting}
                              className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 relative overflow-hidden group"
                            >
                              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary to-purple-600 group-hover:opacity-90"></span>
                              <span className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,transparent_0%,rgba(255,255,255,0.2)_50%,transparent_100%)] translate-x-[-100%] group-hover:animate-[shimmer_1.5s_infinite]"></span>
                              <span className="relative flex items-center">
                                {isSubmitting ? "Sending..." : "Send Message"}
                                <Send className={`ml-2 w-4 h-4 ${isSubmitting ? 'animate-pulse' : 'group-hover:translate-x-1 transition-transform'}`} />
                              </span>
                            </Button>
                          )}
                        </div>
                      </form>
                    </Form>
                  </TabsContent>

                  <TabsContent value="schedule" className="p-6 bg-card/30 backdrop-blur-sm rounded-xl border border-border/50 shadow-lg">
                    <div className="text-center mb-8 mt-4">
                      <h3 className="text-xl font-semibold">Schedule a Discovery Call</h3>
                      <p className="text-muted-foreground">Book a 30-minute free consultation with our team</p>
                    </div>
                    
                    <div className="flex flex-col items-center justify-center py-8">
                      <Calendar className="w-16 h-16 text-primary mb-4" />
                      <p className="text-center max-w-md">
                        Our calendar booking system is coming soon. In the meantime, please fill out the contact form and mention your preferred time slots for a meeting.
                      </p>
                      <Button
                        className="mt-6 bg-gradient-to-r from-primary to-purple-600 hover:opacity-90"
                        onClick={() => document.querySelector('[data-value="form"]')?.dispatchEvent(new Event('click'))}
                      >
                        Go to Contact Form
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Right side - Contact info */}
              <div className="lg:col-span-2">
                <div className="space-y-6">
                  <AnimatedContactCard delay={0.1}>
                    <div className="flex flex-col h-full">
                      <h3 className="text-xl font-display font-semibold mb-6">What Happens Next?</h3>
                      <div className="space-y-4 flex-grow">
                        {[
                          { id: 1, title: "Initial Call", description: "We'll discuss your needs and how we can help." },
                          { id: 2, title: "Custom Proposal", description: "You'll receive a detailed proposal based on your requirements." },
                          { id: 3, title: "Project Kickoff", description: "Once approved, we'll schedule a kickoff meeting to start your project." }
                        ].map(step => (
                          <div key={step.id} className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-medium">
                              {step.id}
                            </div>
                            <div>
                              <h4 className="font-medium">{step.title}</h4>
                              <p className="text-sm text-muted-foreground">{step.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <Separator className="my-4" />
                      
                      <div className="bg-primary/5 p-4 rounded-lg">
                        <p className="text-sm italic">
                          "We pride ourselves on responding to all inquiries within 24 hours during business days."
                        </p>
                      </div>
                    </div>
                  </AnimatedContactCard>
                  
                  <AnimatedContactCard delay={0.2}>
                    <ContactInfo />
                  </AnimatedContactCard>
                </div>
              </div>
            </div>
            
            {/* FAQ section */}
            <div className="mt-24 max-w-3xl mx-auto text-center should-animate">
              <h3 className="text-2xl md:text-3xl font-display font-bold mb-8">Frequently Asked Questions</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                {[
                  { q: "How long does a typical project take?", a: "Timelines vary based on project scope. A standard website takes 4-6 weeks, while complex applications can take 3-6 months." },
                  { q: "What information should I prepare?", a: "Having your goals, target audience, preferred design style, and any existing branding materials ready will help expedite the process." },
                  { q: "Do you offer maintenance services?", a: "Yes, we offer various maintenance packages to keep your digital products secure, updated, and performing optimally." },
                  { q: "What happens after I submit this form?", a: "Our team will review your inquiry and contact you within 24 hours to discuss your needs and potential solutions." }
                ].map((faq, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-card/30 backdrop-blur-sm rounded-lg border border-border/50 p-5 hover:border-primary/30 hover:shadow-lg transition-all duration-300"
                  >
                    <h4 className="font-medium text-lg mb-2">{faq.q}</h4>
                    <p className="text-sm text-muted-foreground">{faq.a}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
