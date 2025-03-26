
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, MapPin, Clock, Calendar, ArrowLeft } from "lucide-react";
import { storageService } from "@/lib/storage";
import { JobOpening } from "@/lib/types";
import { useLanguage } from "@/lib/i18n";
import JobApplicationForm from "@/components/careers/JobApplicationForm";
import { Badge } from "@/components/ui/badge";

const CareerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [job, setJob] = useState<JobOpening | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchJob = () => {
      if (!id) {
        navigate('/careers');
        return;
      }
      
      setIsLoading(true);
      const jobData = storageService.getJobOpeningById(parseInt(id));
      
      if (!jobData || !jobData.published) {
        navigate('/careers');
        return;
      }
      
      setJob(jobData);
      setIsLoading(false);
    };
    
    fetchJob();
    
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
  }, [id, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-pulse">Loading...</div>
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
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">{t('careers.notFound')}</h1>
            <p className="mb-6">{t('careers.notFoundDescription')}</p>
            <Link to="/careers">
              <Button>{t('careers.backToJobs')}</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <section className="bg-gradient-to-b from-background to-secondary/10 py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="should-animate">
              <Link to="/careers" className="inline-flex items-center text-primary hover:text-primary/80 mb-6">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('careers.backToJobs')}
              </Link>
              
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
                    {job.title}
                  </h1>
                  
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    <div className="flex items-center text-muted-foreground">
                      <Briefcase className="mr-1.5 h-4 w-4" />
                      <span>{job.department}</span>
                    </div>
                    
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="mr-1.5 h-4 w-4" />
                      <span>{job.location}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <Clock className="mr-1.5 h-4 w-4" />
                      <Badge variant="outline">{job.type}</Badge>
                    </div>
                    
                    {job.createdAt && (
                      <div className="flex items-center text-muted-foreground">
                        <Calendar className="mr-1.5 h-4 w-4" />
                        <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <JobApplicationForm job={job} />
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 gap-8">
                <Card className="should-animate">
                  <CardContent className="pt-6">
                    <h2 className="text-xl font-semibold mb-4">{t('careers.overview')}</h2>
                    <div className="prose max-w-none">
                      <p>{job.description}</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="should-animate">
                  <CardContent className="pt-6">
                    <h2 className="text-xl font-semibold mb-4">{t('careers.responsibilities')}</h2>
                    <ul className="list-disc pl-5 space-y-2">
                      {job.responsibilities.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                
                <Card className="should-animate">
                  <CardContent className="pt-6">
                    <h2 className="text-xl font-semibold mb-4">{t('careers.requirements')}</h2>
                    <ul className="list-disc pl-5 space-y-2">
                      {job.requirements.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                
                {job.benefits && job.benefits.length > 0 && (
                  <Card className="should-animate">
                    <CardContent className="pt-6">
                      <h2 className="text-xl font-semibold mb-4">{t('careers.benefits')}</h2>
                      <ul className="list-disc pl-5 space-y-2">
                        {job.benefits.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
                
                <div className="flex justify-center mt-8 should-animate">
                  <JobApplicationForm job={job} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default CareerDetail;
