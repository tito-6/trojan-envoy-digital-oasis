import { storageService } from './storage';
import { ContentItem } from './types';

export const generateRSSFeed = () => {
  const blogPosts = storageService.getAllContent()
    .filter(item => item.type === "Blog Post" && item.published)
    .sort((a, b) => {
      const dateA = a.publishDate || a.lastUpdated;
      const dateB = b.publishDate || b.lastUpdated;
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });

  const websiteUrl = window.location.origin;
  const lastBuildDate = new Date().toUTCString();
  
  const rssItems = blogPosts.map(post => {
    const pubDate = new Date(post.publishDate || post.lastUpdated).toUTCString();
    const categories = post.seoKeywords?.map(keyword => 
      `<category>${keyword}</category>`
    ).join('') || '';
    
    return `
      <item>
        <title><![CDATA[${post.title}]]></title>
        <description><![CDATA[${post.description}]]></description>
        <link>${websiteUrl}/blog/${post.slug}</link>
        <guid>${websiteUrl}/blog/${post.slug}</guid>
        <pubDate>${pubDate}</pubDate>
        ${categories}
        ${post.author ? `<author>${post.author}</author>` : ''}
        ${post.images?.[0] ? `<enclosure url="${post.images[0]}" type="image/jpeg" />` : ''}
      </item>
    `;
  }).join('');

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Trojan Envoy Blog</title>
    <link>${websiteUrl}/blog</link>
    <description>Expert insights on technology, development, and industry trends</description>
    <language>en</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    ${rssItems}
  </channel>
</rss>`;

  return rss;
};