import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { storageService } from '@/lib/storage';
import { Calendar, Tag, ArrowLeft, ExternalLink } from 'lucide-react';
import { formatDate } from '@/lib/utils';

const PortfolioItem: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [portfolioItem, setPortfolioItem] = useState<any>(null);
  const [isDarkTheme, setIsDarkTheme] = useState(
    localStorage.getItem("theme") === "dark" || 
    (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches)
  );

  useEffect(() => {
    // Fetch portfolio item based on slug
    if (slug) {
      const storedContent = storageService.getAllContent();
      const item = storedContent.find((item) => item.slug === slug);
      setPortfolioItem(item);
    }

    // Handle theme
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

  if (!portfolioItem) {
    return (
      <div className="min-h-screen">
        <Header isDarkTheme={isDarkTheme} toggleTheme={toggleTheme} />
        <div className="container mx-auto py-10">
          <p>Portfolio item not found.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header isDarkTheme={isDarkTheme} toggleTheme={toggleTheme} />

      <main className="container mx-auto py-10">
        <div className="mb-8">
          <Link to="/portfolio" className="inline-flex items-center gap-2 hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Portfolio
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">{portfolioItem.title}</h1>
          <div className="flex items-center gap-2 mb-2">
            <Badge>{portfolioItem.category}</Badge>
          </div>
          <p className="text-muted-foreground">{portfolioItem.description}</p>
        </div>

        {portfolioItem.images && portfolioItem.images.length > 0 && (
          <div className="mb-8">
            <AspectRatio ratio={16 / 9}>
              <img
                src={portfolioItem.images[0]}
                alt={portfolioItem.title}
                className="object-cover rounded-md"
              />
            </AspectRatio>
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">About This Project</h2>
          <div dangerouslySetInnerHTML={{ __html: portfolioItem.content }} />
        </div>

        <div className="mb-8">
          <div className="flex items-center space-x-4">
            <div>
              <h3 className="text-lg font-semibold">Project Details</h3>
              <div className="text-muted-foreground flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Published on {formatDate(portfolioItem.publishDate || portfolioItem.lastUpdated)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-2">Tags</h3>
          <div className="flex items-center gap-2">
            {portfolioItem.seoKeywords && portfolioItem.seoKeywords.map((keyword: string) => (
              <Badge key={keyword}>{keyword}</Badge>
            ))}
          </div>
        </div>

        <div>
          <Button asChild>
            <Link to="/" className="inline-flex items-center gap-2">
              Visit Website
              <ExternalLink className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PortfolioItem;
