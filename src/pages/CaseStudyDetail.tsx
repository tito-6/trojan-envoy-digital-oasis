import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CardContent, Card, CardDescription, CardTitle, CardHeader } from '@/components/ui/card';
import { storageService } from '@/lib/storage';
import { Separator } from '@/components/ui/separator';
import { Clock, Tag, ArrowLeft, Calendar, Zap, Check, Heart, AreaChart } from 'lucide-react';

const CaseStudyDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [caseStudy, setCaseStudy] = useState<any>(null);
  const [isDarkTheme, setIsDarkTheme] = useState(
    localStorage.getItem("theme") === "dark" || 
    (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches)
  );

  useEffect(() => {
    // Fetch case study based on slug
    if (slug) {
      const storedCaseStudies = storageService.getContentByType("Case Study");
      const foundCaseStudy = storedCaseStudies.find((item: any) => item.slug === slug);
      if (foundCaseStudy) {
        setCaseStudy(foundCaseStudy);
      } else {
        // Handle case where case study is not found
        console.log("Case study not found");
      }
    }

    // Set up theme toggle function
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setIsDarkTheme(true);
    } else if (savedTheme === "light") {
      document.documentElement.classList.remove("dark");
      setIsDarkTheme(false);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.classList.add("dark");
      setIsDarkTheme(true);
    }

    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, [slug]);

  const toggleTheme = () => {
    if (document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDarkTheme(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDarkTheme(true);
    }
  };

  if (!caseStudy) {
    return (
      <div className="min-h-screen">
        <Header isDarkTheme={isDarkTheme} toggleTheme={toggleTheme} />
        <div className="container mx-auto py-10">
          <p>Loading case study...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header isDarkTheme={isDarkTheme} toggleTheme={toggleTheme} />
      
      <main className="container mx-auto py-10">
        <Link to="/case-studies" className="inline-flex items-center mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Case Studies
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">{caseStudy.title}</CardTitle>
            <CardDescription>{caseStudy.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>{caseStudy.publishDate}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Tag className="h-4 w-4" />
              <span>{caseStudy.category}</span>
            </div>
            <Separator />
            <div dangerouslySetInnerHTML={{ __html: caseStudy.content }} />
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default CaseStudyDetail;
