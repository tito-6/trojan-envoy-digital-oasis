
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { useLanguage } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Briefcase, 
  MapPin, 
  Building, 
  CalendarDays, 
  ListChecks, 
  ClipboardList, 
  Award, 
  ArrowLeft,
  Share2,
  Bookmark,
  Send
} from "lucide-react";
import { storageService } from "@/lib/storage";
import { JobOpening } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

const CareerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [job, setJob] = useState<JobOpening | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadJob = () => {
      if (!id) return;
      
      try {
        if (storageService.getJobOpeningById) {
          const jobData = storageService.getJobOpeningById(Number(id));
          if (jobData && jobData.published) {
            setJob(jobData);
          }
        }
      } catch (error) {
        console.error("Error loading job:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadJob();
    
    // Add animation on scroll
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
  }, [id]);
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: job?.title,
        text: `Check out this job opening for ${job?.title} at our company!`,
        url: window.location.href,
      })
      .catch((error) => console.log('Error sharing', error));
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied to clipboard",
        description: "You can now share this job opening with others",
      });
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-pulse text-center">
            <p className="text-muted-foreground">Loading job details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!job) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <h1 className="text-2xl font-bold mb-4">Job Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The job opening you're looking for doesn't exist or is no longer available.
            </p>
            <Link to="/careers">
              <Button>
                <ArrowLeft className="mr-2 w-4 h-4" />
                Back to Careers
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  const formatSalary = () => {
    if (!job.salary?.min && !job.salary?.max) return null;
    
    const currency = job.salary.currency === 'USD' ? '$' : 
                     job.salary.currency === 'EUR' ? '€' : 
                     job.salary.currency === 'GBP' ? '£' : 
                     job.salary.currency === 'JPY' ? '¥' : '$';
                     
    if (job.salary.min && job.salary.max) {
      return `${currency}${job.salary.min.toLocaleString()} - ${currency}${job.salary.max.toLocaleString()}`;
    } else if (job.salary.min) {
      return `From ${currency}${job.salary.min.toLocaleString()}`;
    } else if (job.salary.max) {
      return `Up to ${currency}${job.salary.max.toLocaleString()}`;
    }
    
    return null;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <Link to="/careers" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="mr-2 w-4 h-4" />
                Back to All Openings
              </Link>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-6 md:p-8 mb-8 should-animate">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <Badge variant="outline" className="mb-2">{job.type}</Badge>
                  <h1 className="text-2xl md:text-3xl font-bold">{job.title}</h1>
                  <div className="flex flex-wrap gap-4 mt-3">
                    <div className="flex items-center text-muted-foreground">
                      <Building className="mr-2 w-4 h-4" />
                      <span>{job.department}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="mr-2 w-4 h-4" />
                      <span>{job.location}</span>
                    </div>
                    {formatSalary() && (
                      <div className="flex items-center text-muted-foreground">
                        <CalendarDays className="mr-2 w-4 h-4" />
                        <span>{formatSalary()}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={handleShare}>
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => {
                    toast({
                      title: "Job saved",
                      description: "This job has been saved to your bookmarks",
                    });
                  }}>
                    <Bookmark className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-6">
                <Button size="lg" className="md:w-auto w-full">
                  Apply Now
                  <Send className="ml-2 w-4 h-4" />
                </Button>
                
                {job.applicationUrl && (
                  <a href={job.applicationUrl} target="_blank" rel="noopener noreferrer" className="w-full md:w-auto">
                    <Button variant="outline" size="lg" className="w-full">
                      Apply on Company Site
                      <ArrowLeft className="ml-2 w-4 h-4 rotate-[135deg]" />
                    </Button>
                  </a>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-8 should-animate">
                <section>
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <Briefcase className="mr-2 w-5 h-5 text-primary" />
                    Job Description
                  </h2>
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <p>{job.description}</p>
                  </div>
                </section>
                
                <Separator />
                
                <section>
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <ListChecks className="mr-2 w-5 h-5 text-primary" />
                    Responsibilities
                  </h2>
                  <ul className="space-y-2">
                    {job.responsibilities.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>
                
                <Separator />
                
                <section>
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <ClipboardList className="mr-2 w-5 h-5 text-primary" />
                    Requirements
                  </h2>
                  <ul className="space-y-2">
                    {job.requirements.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>
                
                {job.benefits && job.benefits.length > 0 && (
                  <>
                    <Separator />
                    
                    <section>
                      <h2 className="text-xl font-semibold mb-4 flex items-center">
                        <Award className="mr-2 w-5 h-5 text-primary" />
                        Benefits
                      </h2>
                      <ul className="space-y-2">
                        {job.benefits.map((item, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </section>
                  </>
                )}
              </div>
              
              <div className="should-animate">
                <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
                  <h3 className="text-lg font-semibold mb-4">Application Process</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-medium">1</span>
                      </div>
                      <div>
                        <p className="font-medium">Apply</p>
                        <p className="text-sm text-muted-foreground">Submit your application online</p>
                      </div>
                    </li>
                    
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-medium">2</span>
                      </div>
                      <div>
                        <p className="font-medium">Interview</p>
                        <p className="text-sm text-muted-foreground">Initial screening call with HR</p>
                      </div>
                    </li>
                    
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-medium">3</span>
                      </div>
                      <div>
                        <p className="font-medium">Technical Assessment</p>
                        <p className="text-sm text-muted-foreground">Complete a skills assessment</p>
                      </div>
                    </li>
                    
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-medium">4</span>
                      </div>
                      <div>
                        <p className="font-medium">Final Interview</p>
                        <p className="text-sm text-muted-foreground">Meet with the team and managers</p>
                      </div>
                    </li>
                    
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-medium">5</span>
                      </div>
                      <div>
                        <p className="font-medium">Offer</p>
                        <p className="text-sm text-muted-foreground">Receive and review job offer</p>
                      </div>
                    </li>
                  </ul>
                  
                  <div className="mt-6">
                    <Button className="w-full">
                      Apply Now
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CareerDetail;
