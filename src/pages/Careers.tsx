
import React, { useEffect, useState } from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { useLanguage } from "@/lib/i18n";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, MapPin, Building, Calendar, ArrowRight, AlertCircle } from "lucide-react";
import { storageService } from "@/lib/storage";
import { JobOpening } from "@/lib/types";
import { Link } from "react-router-dom";

const Careers: React.FC = () => {
  const { t } = useLanguage();
  const [jobOpenings, setJobOpenings] = useState<JobOpening[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  
  useEffect(() => {
    // Fetch job openings
    const fetchJobs = () => {
      const jobs = storageService.getAllJobOpenings ? 
        storageService.getAllJobOpenings().filter(job => job.published) : 
        [];
      setJobOpenings(jobs);
    };
    
    fetchJobs();
    
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
  }, []);
  
  const departments = Array.from(new Set(jobOpenings.map(job => job.department)));
  
  const filteredJobs = selectedDepartment ? 
    jobOpenings.filter(job => job.department === selectedDepartment) : 
    jobOpenings;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-background to-secondary/20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center should-animate">
              <h1 className="text-3xl md:text-5xl font-display font-bold mb-6">
                Join Our Team
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8">
                Be part of our mission to create innovative digital solutions that transform businesses and delight users.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4">
                {departments.map((dept) => (
                  <Button
                    key={dept}
                    variant={selectedDepartment === dept ? "default" : "outline"}
                    size="lg"
                    onClick={() => 
                      setSelectedDepartment(selectedDepartment === dept ? null : dept)
                    }
                  >
                    {dept}
                  </Button>
                ))}
                
                {selectedDepartment && (
                  <Button
                    variant="ghost"
                    size="lg"
                    onClick={() => setSelectedDepartment(null)}
                  >
                    Show All
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>
        
        {/* Jobs Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto should-animate">
              <h2 className="text-2xl md:text-3xl font-display font-bold mb-2">
                Current Openings
                {selectedDepartment && (
                  <span className="ml-2 text-primary">in {selectedDepartment}</span>
                )}
              </h2>
              
              <p className="text-muted-foreground mb-8">
                Explore our job opportunities and find your perfect role
              </p>
              
              {filteredJobs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredJobs.map((job) => (
                    <Card key={job.id} className="should-animate hover:shadow-md transition-shadow duration-300">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-xl font-display">{job.title}</CardTitle>
                            <CardDescription className="flex items-center gap-1 mt-1">
                              <Building className="w-4 h-4" />
                              {job.department}
                            </CardDescription>
                          </div>
                          <Badge variant="outline" className="bg-secondary/50">
                            {job.type}
                          </Badge>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4" />
                            <span>{job.location}</span>
                          </div>
                          
                          {job.salary?.min && job.salary?.max && (
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-4 h-4" />
                              <span>
                                {job.salary.currency === 'USD' ? '$' : 
                                 job.salary.currency === 'EUR' ? '€' : 
                                 job.salary.currency === 'GBP' ? '£' : 
                                 job.salary.currency === 'JPY' ? '¥' : '$'}
                                {job.salary.min.toLocaleString()} - {job.salary.max.toLocaleString()}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        <p className="line-clamp-3">
                          {job.description}
                        </p>
                      </CardContent>
                      
                      <CardFooter>
                        <Link 
                          to={`/careers/${job.id}`}
                          className="w-full"
                        >
                          <Button className="w-full" variant="default">
                            View Details
                            <ArrowRight className="ml-2 w-4 h-4" />
                          </Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {selectedDepartment 
                      ? `No open positions found in ${selectedDepartment}. Please check other departments or come back later.`
                      : "No open positions found at the moment. Please check back later for new opportunities."}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        </section>
        
        {/* Benefits Section */}
        <section className="py-16 md:py-24 bg-card">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto text-center should-animate">
              <h2 className="text-2xl md:text-3xl font-display font-bold mb-6">
                Why Work With Us
              </h2>
              
              <p className="text-muted-foreground mb-12 max-w-3xl mx-auto">
                We offer a dynamic and supportive work environment with great opportunities for growth and development.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-background p-6 rounded-xl border border-border should-animate">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Briefcase className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Professional Growth</h3>
                  <p className="text-muted-foreground">
                    Continuous learning opportunities and career advancement paths to help you grow.
                  </p>
                </div>
                
                <div className="bg-background p-6 rounded-xl border border-border should-animate">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Briefcase className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Work-Life Balance</h3>
                  <p className="text-muted-foreground">
                    Flexible work arrangements and policies that support your personal well-being.
                  </p>
                </div>
                
                <div className="bg-background p-6 rounded-xl border border-border should-animate">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Briefcase className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Innovative Culture</h3>
                  <p className="text-muted-foreground">
                    Be part of a team that values creativity and embraces new technologies.
                  </p>
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

export default Careers;
