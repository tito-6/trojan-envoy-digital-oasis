
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Calendar, User, Tag, ArrowRight, Share } from "lucide-react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { storageService } from "@/lib/storage";
import { ContentItem } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/lib/i18n";

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { t, currentLanguage } = useLanguage();
  const [blogPost, setBlogPost] = useState<ContentItem | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo(0, 0);
    
    const loadBlogPost = () => {
      if (!slug) return;

      // Try to find by slug
      const allContent = storageService.getAllContent();
      let post = allContent.find(
        item => item.type === "Blog Post" && item.slug === slug && item.published &&
        (!item.language || item.language === currentLanguage)
      );
      
      if (post) {
        setBlogPost(post);
        
        // Find related posts with same category or keywords
        const related = allContent.filter(content => 
          content.type === "Blog Post" && 
          content.id !== post.id &&
          content.published &&
          (!content.language || content.language === currentLanguage) &&
          (
            (post.category && content.category === post.category) ||
            (post.seoKeywords && content.seoKeywords && 
             post.seoKeywords.some(kw => content.seoKeywords?.includes(kw)))
          )
        ).slice(0, 3);
        
        setRelatedPosts(related);
      } else {
        // Post not found - redirect to blog page
        toast({
          title: "Blog post not found",
          description: "The requested blog post couldn't be found.",
          variant: "destructive",
        });
        navigate('/blog');
      }
      
      setLoading(false);
    };
    
    loadBlogPost();
    
    // Subscribe to content changes
    const unsubscribe = storageService.addEventListener('content-updated', loadBlogPost);
    const unsubscribeDeleted = storageService.addEventListener('content-deleted', loadBlogPost);
    
    return () => {
      unsubscribe();
      unsubscribeDeleted();
    };
  }, [slug, navigate, toast, currentLanguage]);
  
  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-48 bg-secondary rounded"></div>
            <div className="h-12 w-2/3 bg-secondary rounded"></div>
            <div className="h-4 bg-secondary rounded"></div>
            <div className="h-4 bg-secondary rounded"></div>
            <div className="h-4 w-2/3 bg-secondary rounded"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!blogPost) {
    return null; // Redirecting in useEffect
  }
  
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-16 md:py-24">
        <article className="max-w-3xl mx-auto">
          <div className="mb-8">
            <Link to="/blog" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t("Back to all posts")}
            </Link>
            
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {blogPost.category && (
                <Badge variant="secondary">
                  {blogPost.category}
                </Badge>
              )}
              
              {blogPost.lastUpdated && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>{new Date(blogPost.publishDate || blogPost.lastUpdated).toLocaleDateString()}</span>
                </div>
              )}
              
              {blogPost.author && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <User className="w-4 h-4 mr-1" />
                  <span>{blogPost.author}</span>
                </div>
              )}
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-6">
              {blogPost.title}
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              {blogPost.description}
            </p>
          </div>
          
          {blogPost.images && blogPost.images.length > 0 && (
            <div className="mb-12 overflow-hidden rounded-lg border border-border">
              <img 
                src={blogPost.images[0]} 
                alt={blogPost.title} 
                className="w-full aspect-video object-cover"
              />
            </div>
          )}
          
          <div className="prose prose-slate dark:prose-invert max-w-none mb-12">
            {blogPost.content ? (
              <div dangerouslySetInnerHTML={{ __html: blogPost.content }} />
            ) : (
              <p className="text-muted-foreground">{t("No content available for this post.")}</p>
            )}
          </div>
          
          <div className="flex flex-wrap items-center justify-between border-t border-b border-border py-6 mb-12">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium mr-2">{t("Tags")}:</span>
              {blogPost.seoKeywords && blogPost.seoKeywords.length > 0 ? (
                blogPost.seoKeywords.map((tag, index) => (
                  <Link key={index} to={`/blog?tag=${tag}`}>
                    <Badge variant="outline">{tag}</Badge>
                  </Link>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">{t("No tags")}</span>
              )}
            </div>
            
            <Button variant="ghost" size="sm" className="hidden sm:flex">
              <Share className="w-4 h-4 mr-2" />
              {t("Share")}
            </Button>
          </div>
        </article>
        
        {relatedPosts.length > 0 && (
          <div className="max-w-5xl mx-auto mt-16">
            <h2 className="text-2xl font-display font-bold mb-8 text-center">
              {t("Related Posts")}
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedPosts.map(post => (
                <div key={post.id} className="border border-border rounded-lg overflow-hidden hover:shadow-md transition-all">
                  {post.images && post.images.length > 0 && (
                    <div className="aspect-video">
                      <img 
                        src={post.images[0]} 
                        alt={post.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="p-5">
                    <h3 className="font-display font-bold mb-2">{post.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {post.description}
                    </p>
                    
                    <Link
                      to={`/blog/${post.slug}`}
                      className="inline-flex items-center text-sm font-medium"
                    >
                      {t("Read More")}
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogPost;
