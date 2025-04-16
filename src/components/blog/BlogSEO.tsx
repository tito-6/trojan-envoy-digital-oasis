import React, { useEffect } from "react";
import { useLanguage } from "@/lib/i18n";
import { getAlternateLinks } from "@/lib/utils/seo";

interface BlogSEOProps {
  title?: string;
  description?: string;
  path?: string;
  type?: "blog" | "article";
  post?: {
    title: string;
    description: string;
    publishDate: string;
    lastUpdated?: string;
    author?: string;
    category?: string;
    seoKeywords?: string[];
    images?: string[];
    content?: string;
    slug: string;
  };
}

const BlogSEO: React.FC<BlogSEOProps> = ({ 
  title, 
  description, 
  path = "", 
  type = "blog",
  post 
}) => {
  const { t, currentLanguage } = useLanguage();
  const baseUrl = "https://trojanenvoy.com";
  const fullUrl = `${baseUrl}${path}`;

  // Default meta content
  const defaultTitle = type === "blog" ? t('blog.title') : post?.title;
  const defaultDescription = type === "blog" ? t('blog.description') : post?.description;

  // Construct meta content
  const metaTitle = title || defaultTitle;
  const metaDescription = description || defaultDescription;
  const companyName = "Trojan Envoy";

  useEffect(() => {
    // Generate schema markup for blog/article
    const schema = type === "blog" ? {
      "@context": "https://schema.org",
      "@type": "Blog",
      "name": `${companyName} Blog`,
      "description": metaDescription,
      "url": fullUrl,
      "publisher": {
        "@type": "Organization",
        "name": companyName,
        "logo": {
          "@type": "ImageObject",
          "url": `${baseUrl}/logo.png`
        }
      }
    } : {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": post?.title,
      "description": post?.description,
      "image": post?.images?.[0],
      "datePublished": post?.publishDate,
      "dateModified": post?.lastUpdated || post?.publishDate,
      "author": {
        "@type": "Person",
        "name": post?.author || "Admin"
      },
      "publisher": {
        "@type": "Organization",
        "name": companyName,
        "logo": {
          "@type": "ImageObject",
          "url": `${baseUrl}/logo.png`
        }
      },
      "keywords": post?.seoKeywords?.join(", "),
      "articleBody": post?.content?.replace(/<[^>]*>/g, ''),
      "articleSection": post?.category,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": fullUrl
      }
    };

    // Add schema markup
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.textContent = JSON.stringify(schema);
    } else {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    }

    // Add alternates for different languages
    const alternateLinks = getAlternateLinks(path);
    alternateLinks.forEach(link => {
      let altLink = document.querySelector(`link[hreflang="${link.hrefLang}"]`);
      if (!altLink) {
        altLink = document.createElement('link');
        altLink.rel = 'alternate';
        altLink.hrefLang = link.hrefLang;
        document.head.appendChild(altLink);
      }
      altLink.href = link.href;
    });

    return () => {
      // Cleanup
      document.querySelectorAll('script[type="application/ld+json"]').forEach(script => script.remove());
      document.querySelectorAll('link[hreflang]').forEach(link => link.remove());
    };
  }, [type, post, metaTitle, metaDescription, fullUrl, currentLanguage]);

  return (
    <>
      <title>{`${metaTitle} | ${companyName}`}</title>
      <meta name="description" content={metaDescription} />
      <meta name="robots" content="index, follow" />
      
      {/* Open Graph */}
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content={type === "blog" ? "website" : "article"} />
      <meta property="og:site_name" content={companyName} />
      <meta property="og:locale" content={currentLanguage} />
      {post?.images?.[0] && (
        <>
          <meta property="og:image" content={post.images[0]} />
          <meta property="og:image:alt" content={post.title} />
        </>
      )}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      {post?.images?.[0] && (
        <meta name="twitter:image" content={post.images[0]} />
      )}
      
      {/* Article specific meta tags */}
      {type === "article" && post && (
        <>
          <meta property="article:published_time" content={post.publishDate} />
          {post.lastUpdated && (
            <meta property="article:modified_time" content={post.lastUpdated} />
          )}
          {post.author && (
            <meta property="article:author" content={post.author} />
          )}
          {post.category && (
            <meta property="article:section" content={post.category} />
          )}
          {post.seoKeywords?.map((keyword, index) => (
            <meta key={index} property="article:tag" content={keyword} />
          ))}
        </>
      )}
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />
    </>
  );
};

export default BlogSEO;