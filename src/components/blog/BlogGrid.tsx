
import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface BlogPostProps {
  title: string;
  category: string;
  excerpt: string;
  date: string;
  author: string;
  slug: string;
  featured?: boolean;
  delay: number;
}

const BlogPost: React.FC<BlogPostProps> = ({ 
  title, category, excerpt, date, author, slug, featured = false, delay 
}) => {
  return (
    <Card className={`overflow-hidden hover:shadow-lg transition-all duration-300 should-animate ${featured ? 'border-primary/50' : ''} delay-${delay}`}>
      <div className="relative aspect-video overflow-hidden bg-secondary">
        <div className="absolute inset-0 flex items-center justify-center bg-muted-foreground/10">
          <span className="text-muted-foreground">Blog Image</span>
        </div>
        
        {featured && (
          <div className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded">
            Featured
          </div>
        )}
      </div>
      
      <CardContent className="p-6">
        <div className="flex flex-col h-full">
          <span className="text-sm text-primary font-medium mb-2">{category}</span>
          <h3 className="text-xl font-display font-bold mb-3">{title}</h3>
          <p className="text-muted-foreground text-sm mb-4">{excerpt}</p>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground mt-4 pt-4 border-t border-border">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {date}
              </span>
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5" />
                {author}
              </span>
            </div>
            
            <Link 
              to={`/blog/${slug}`}
              className="inline-flex items-center gap-1 text-primary hover:underline font-medium"
            >
              Read
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const BlogGrid: React.FC = () => {
  // Sample blog posts
  const blogPosts = [
    {
      title: "10 SEO Strategies for 2023",
      category: "SEO",
      excerpt: "Learn the most effective SEO strategies to boost your website's visibility and traffic in 2023.",
      date: "Nov 5, 2023",
      author: "John Smith",
      slug: "seo-strategies-2023",
      featured: true,
    },
    {
      title: "The Future of Mobile App Development",
      category: "Development",
      excerpt: "Explore the emerging trends and technologies shaping the future of mobile application development.",
      date: "Oct 28, 2023",
      author: "Emily Johnson",
      slug: "future-mobile-app-development",
    },
    {
      title: "Why User Experience Matters",
      category: "UX/UI",
      excerpt: "Discover why prioritizing user experience is crucial for digital product success and customer retention.",
      date: "Oct 15, 2023",
      author: "Michael Brown",
      slug: "why-user-experience-matters",
    },
    {
      title: "Effective Social Media Marketing",
      category: "Marketing",
      excerpt: "A comprehensive guide to creating effective social media marketing campaigns that drive engagement.",
      date: "Oct 10, 2023",
      author: "Sarah Williams",
      slug: "effective-social-media-marketing",
    },
    {
      title: "E-commerce Optimization Tips",
      category: "E-commerce",
      excerpt: "Practical tips to optimize your e-commerce store for better conversions and customer satisfaction.",
      date: "Sep 30, 2023",
      author: "David Miller",
      slug: "ecommerce-optimization-tips",
    },
    {
      title: "Cybersecurity Best Practices",
      category: "Security",
      excerpt: "Essential cybersecurity best practices to protect your business and customers in the digital age.",
      date: "Sep 22, 2023",
      author: "Jennifer Lee",
      slug: "cybersecurity-best-practices",
    },
  ];
  
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-8">
        {blogPosts.map((post, index) => (
          <BlogPost
            key={post.slug}
            {...post}
            delay={index * 100}
          />
        ))}
      </div>
      
      <div className="flex justify-center mt-12 pt-8 border-t border-border">
        <div className="flex gap-2">
          <button className="w-10 h-10 rounded-md flex items-center justify-center bg-primary text-primary-foreground">
            1
          </button>
          <button className="w-10 h-10 rounded-md flex items-center justify-center hover:bg-secondary transition-colors">
            2
          </button>
          <button className="w-10 h-10 rounded-md flex items-center justify-center hover:bg-secondary transition-colors">
            3
          </button>
          <button className="w-10 h-10 rounded-md flex items-center justify-center hover:bg-secondary transition-colors">
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogGrid;
