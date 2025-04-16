import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Calendar, User, Tag, ArrowRight, Share, Clock } from "lucide-react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import BlogSEO from "@/components/blog/BlogSEO";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { storageService } from "@/lib/storage";
import { ContentType, IContent } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/lib/i18n";
import { BlogTableOfContents } from '@/components/blog/BlogTableOfContents';
import { ShareDialog } from '@/components/ui/share-dialog';
import { ProgressiveImage } from '@/components/ui/progressive-image';
import { motion } from 'framer-motion';

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { t, currentLanguage } = useLanguage();
  const [blogPost, setBlogPost] = useState<IContent | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<IContent[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [readingTime, setReadingTime] = useState<number>(0);

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
        
        // Calculate reading time
        const text = post.content?.replace(/<[^>]*>/g, '') || '';
        const wordsPerMinute = 200;
        const words = text.trim().split(/\s+/).length;
        setReadingTime(Math.ceil(words / wordsPerMinute));
        
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
        toast({
          title: t("blog.post.notFound.title"),
          description: t("blog.post.notFound.description"),
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
  }, [slug, navigate, toast, currentLanguage, t]);

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
  
  if (!blogPost) return null;

  return (
    <div className="min-h-screen">
      <BlogSEO 
        type="article"
        post={blogPost}
        path={`/blog/${slug}`}
      />
      
      <Header />
      
      <main className="container mx-auto px-4 py-16 md:py-24">
        <article 
          className="max-w-3xl mx-auto"
          itemScope 
          itemType="https://schema.org/BlogPosting"
        >
          <div className="mb-8">
            <Link 
              to="/blog" 
              className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t("blog.backToList")}
            </Link>
            
            <header className="mb-8">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                {blogPost.category && (
                  <Link to={`/blog/category/${encodeURIComponent(blogPost.category.toLowerCase())}`}>
                    <Badge variant="secondary" itemProp="articleSection">
                      {blogPost.category}
                    </Badge>
                  </Link>
                )}
                
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4 mr-1" />
                  <time 
                    dateTime={blogPost.publishDate}
                    itemProp="datePublished"
                  >
                    {new Date(blogPost.publishDate).toLocaleDateString()}
                  </time>
                </div>
                
                {blogPost.author && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <User className="w-4 h-4 mr-1" />
                    <span itemProp="author">{blogPost.author}</span>
                  </div>
                )}
                
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{readingTime} {t("blog.readingTime")}</span>
                </div>
              </div>
              
              <h1 
                className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-6"
                itemProp="headline"
              >
                {blogPost.title}
              </h1>
              
              <p 
                className="text-lg md:text-xl text-muted-foreground mb-8"
                itemProp="description"
              >
                {blogPost.description}
              </p>
            </header>

            {blogPost.images && blogPost.images.length > 0 && (
              <figure className="mb-12 overflow-hidden rounded-lg border border-border">
                <ProgressiveImage 
                  src={blogPost.images[0]} 
                  alt={blogPost.title}
                  className="w-full aspect-video object-cover"
                  itemProp="image"
                />
              </figure>
            )}
            
            <div 
              className="prose prose-slate dark:prose-invert max-w-none mb-12"
              itemProp="articleBody"
              dangerouslySetInnerHTML={{ __html: blogPost.content || t("blog.noContent") }}
            />
            
            <footer className="flex flex-wrap items-center justify-between border-t border-b border-border py-6 mb-12">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium mr-2">{t("blog.tags")}:</span>
                {blogPost.seoKeywords && blogPost.seoKeywords.length > 0 ? (
                  blogPost.seoKeywords.map((tag, index) => (
                    <Link 
                      key={index} 
                      to={`/blog/tag/${encodeURIComponent(tag)}`}
                      itemProp="keywords"
                    >
                      <Badge variant="outline">{tag}</Badge>
                    </Link>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">{t("blog.noTags")}</span>
                )}
              </div>
              
              <ShareDialog url={window.location.href} title={blogPost.title} />
            </footer>
          </div>
        </article>
        
        {relatedPosts.length > 0 && (
          <section className="max-w-5xl mx-auto mt-16">
            <h2 className="text-2xl font-display font-bold mb-8 text-center">
              {t("blog.relatedPosts")}
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedPosts.map(post => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="border border-border rounded-lg overflow-hidden hover:shadow-md transition-all"
                >
                  {post.images && post.images.length > 0 && (
                    <Link to={`/blog/${post.slug}`} className="block aspect-video">
                      <ProgressiveImage 
                        src={post.images[0]} 
                        alt={post.title} 
                        className="w-full h-full object-cover"
                      />
                    </Link>
                  )}
                  
                  <div className="p-5">
                    <h3 className="font-display font-bold mb-2">{post.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {post.description}
                    </p>
                    
                    <Link
                      to={`/blog/${post.slug}`}
                      className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                    >
                      {t("blog.readMore")}
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          </section>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogPost;
