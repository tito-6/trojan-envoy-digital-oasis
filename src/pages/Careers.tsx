import React, { useState, useEffect } from 'react';
import { Header } from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { storageService } from '@/lib/storage';
import { Briefcase, MapPin, Calendar, DollarSign } from 'lucide-react';

interface JobPosition {
  id: string;
  title: string;
  department: string;
  location: string;
  type: "Full-time" | "Part-time" | "Contract" | "Freelance";
  salary: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  postedDate: Date;
  slug: string;
}

const Careers: React.FC = () => {
  const [jobPositions, setJobPositions] = useState<JobPosition[]>([
    {
      id: "1",
      title: "Senior React Developer",
      department: "Engineering",
      location: "Remote / New York",
      type: "Full-time",
      salary: "$120,000 - $150,000",
      description: "We're looking for an experienced React developer to join our growing team and help build innovative web applications for our clients.",
      requirements: [
        "5+ years of experience with React and modern JavaScript",
        "Experience with TypeScript, Redux, and Next.js",
        "Strong understanding of web performance and optimization",
        "Experience with serverless architecture and AWS",
        "Bachelor's degree in Computer Science or related field (or equivalent experience)"
      ],
      responsibilities: [
        "Develop high-quality web applications using React and TypeScript",
        "Collaborate with designers, product managers, and other developers",
        "Implement responsive designs and ensure cross-browser compatibility",
        "Write clean, maintainable, and well-tested code",
        "Participate in code reviews and mentor junior developers"
      ],
      postedDate: new Date(2023, 9, 15),
      slug: "senior-react-developer"
    },
    {
      id: "2",
      title: "UI/UX Designer",
      department: "Design",
      location: "New York / San Francisco",
      type: "Full-time",
      salary: "$90,000 - $120,000",
      description: "We're seeking a talented UI/UX Designer who will be responsible for creating beautiful, intuitive interfaces for web and mobile applications.",
      requirements: [
        "3+ years of experience in UI/UX design for digital products",
        "Proficiency with design tools like Figma, Sketch, and Adobe Creative Suite",
        "Portfolio demonstrating strong visual design and interaction design skills",
        "Experience with design systems and component libraries",
        "Knowledge of HTML, CSS, and responsive design principles"
      ],
      responsibilities: [
        "Create wireframes, mockups, and prototypes for web and mobile applications",
        "Design intuitive user interfaces and improve user experiences",
        "Collaborate with product managers and developers to implement designs",
        "Conduct user research and usability testing",
        "Maintain and improve our design system"
      ],
      postedDate: new Date(2023, 9, 20),
      slug: "ui-ux-designer"
    },
    {
      id: "3",
      title: "Digital Marketing Specialist",
      department: "Marketing",
      location: "Remote / London",
      type: "Full-time",
      salary: "$70,000 - $90,000",
      description: "We're looking for a Digital Marketing Specialist to develop and implement effective digital marketing strategies for our clients.",
      requirements: [
        "3+ years of experience in digital marketing",
        "Experience with SEO, SEM, social media marketing, and email marketing",
        "Proficiency with Google Analytics, Google Ads, and social media platforms",
        "Strong analytical skills and data-driven approach",
        "Excellent written and verbal communication skills"
      ],
      responsibilities: [
        "Develop and implement digital marketing strategies across various channels",
        "Manage SEO/SEM campaigns and optimize website performance",
        "Create and manage content for social media and email marketing",
        "Analyze campaign performance and provide reports and recommendations",
        "Stay up-to-date with the latest digital marketing trends and best practices"
      ],
      postedDate: new Date(2023, 9, 25),
      slug: "digital-marketing-specialist"
    }
  ]);

  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
    
    // Set page title
    document.title = "Careers | Trojan Envoy";
  }, []);

  // Format the date display
  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  // Calculate time since posting
  const getTimeSincePosting = (date: Date): string => {
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">Open Positions</h1>
            <p className="text-xl text-muted-foreground">
              Join our team of talented professionals and help us build amazing digital experiences.
            </p>
          </div>
          
          {/* Job Listings */}
          <div className="grid gap-6 mb-16">
            {jobPositions.map((job) => (
              <Card key={job.id} className="card-hover overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between flex-wrap gap-4">
                    <div>
                      <CardTitle className="text-2xl">{job.title}</CardTitle>
                      <CardDescription className="text-muted-foreground mt-1">{job.department}</CardDescription>
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock className="w-4 h-4 mr-1 text-muted-foreground" />
                      <span className="text-muted-foreground">{getTimeSincePosting(job.postedDate)}</span>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pb-4">
                  <div className="flex flex-wrap gap-4 mb-4">
                    <div className="flex items-center text-sm bg-secondary/50 px-3 py-1 rounded-full">
                      <Briefcase className="w-4 h-4 mr-1 text-muted-foreground" />
                      <span>{job.type}</span>
                    </div>
                    <div className="flex items-center text-sm bg-secondary/50 px-3 py-1 rounded-full">
                      <MapPin className="w-4 h-4 mr-1 text-muted-foreground" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center text-sm bg-secondary/50 px-3 py-1 rounded-full">
                      <DollarSign className="w-4 h-4 mr-1 text-muted-foreground" />
                      <span>{job.salary}</span>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-4">{job.description}</p>
                </CardContent>
                
                <CardFooter className="flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    Posted on {formatDate(job.postedDate)}
                  </div>
                  <Link to={`/careers/${job.slug}`}>
                    <Button size="sm">
                      View Details
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {/* CTA Section */}
          <div className="text-center max-w-2xl mx-auto bg-secondary/50 rounded-2xl p-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Don't see the right position?</h2>
            <p className="text-muted-foreground mb-6">
              We're always looking for talented individuals to join our team. 
              Send us your resume and we'll keep you in mind for future opportunities.
            </p>
            <Link 
              to="/contact" 
              className="inline-flex items-center justify-center bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Careers;
