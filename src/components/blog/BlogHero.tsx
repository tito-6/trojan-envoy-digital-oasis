
import React from "react";
import { useLanguage } from "@/lib/i18n";

interface BlogHeroProps {
  searchTerm?: string;
  category?: string;
  tag?: string;
}

const BlogHero: React.FC<BlogHeroProps> = ({ searchTerm, category, tag }) => {
  const { t } = useLanguage();
  
  // Change the title based on filters
  let title = t("Our Blog");
  let subtitle = t("Explore our articles, guides, and insights on digital trends, technology, and business strategies.");
  
  if (searchTerm) {
    title = t(`Search Results: "${searchTerm}"`);
    subtitle = t("Browse articles matching your search query");
  } else if (category) {
    title = t(`Category: ${category.charAt(0).toUpperCase() + category.slice(1)}`);
    subtitle = t(`Browse all articles in the ${category} category`);
  } else if (tag) {
    title = t(`Tag: ${tag.charAt(0).toUpperCase() + tag.slice(1)}`);
    subtitle = t(`Browse all articles with the ${tag} tag`);
  }
  
  return (
    <section className="pt-32 pb-16 md:pt-40 md:pb-20 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/3 left-0 w-full h-1/2 bg-gradient-to-b from-primary/5 to-transparent"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:30px_30px]"></div>
      </div>
      
      <div className="container mx-auto px-4 text-center">
        <div className="inline-block px-4 py-1.5 rounded-full bg-secondary mb-4 text-sm font-medium should-animate">
          {searchTerm ? "Search Results" : category ? "Category" : tag ? "Tag" : "Blog"}
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 should-animate">
          {title}
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto should-animate">
          {subtitle}
        </p>
      </div>
    </section>
  );
};

export default BlogHero;
