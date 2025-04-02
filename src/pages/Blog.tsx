import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';
import { ContentItem } from '@/lib/types';
import { storageService } from '@/lib/storage';

const Blog: React.FC = () => {
  const [blogPosts, setBlogPosts] = useState<ContentItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    const allContent = storageService.getAllContent();
    const blogContent = allContent.filter(item => item.type === "Blog Post" && item.published === true);
    setBlogPosts(blogContent);
  };

  const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredBlogPosts = React.useMemo(() => {
    if (!searchTerm) {
      return blogPosts;
    }
    return blogPosts.filter(post =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (post.description && post.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (post.content && post.content.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [blogPosts, searchTerm]);

  const onAddMockPost = () => {
    const mockPost: Omit<ContentItem, "id"> = {
      title: "Getting Started with React",
      type: "Blog Post",
      description: "In this article, we explore the basics of React and how to create your first component.",
      content: "<p>React is a JavaScript library for building user interfaces...</p>",
      seoKeywords: ["react", "javascript", "web development"],
      category: "Development",
      author: "John Doe",
      publishDate: new Date().toISOString(),
      published: true,
      lastUpdated: new Date().toISOString()
    };
    
    storageService.addContent(mockPost);
    fetchData();
  };

  const onAddAnotherMockPost = () => {
    const mockPost: Omit<ContentItem, "id"> = {
      title: "CSS Grid Layout: Complete Guide",
      type: "Blog Post",
      description: "Learn everything about CSS Grid and how to create complex layouts with ease.",
      content: "<p>CSS Grid Layout is a two-dimensional grid system...</p>",
      seoKeywords: ["css", "grid", "layout", "web design"],
      category: "Design",
      author: "Jane Smith",
      publishDate: new Date().toISOString(),
      published: true,
      lastUpdated: new Date().toISOString()
    };
    
    storageService.addContent(mockPost);
    fetchData();
  };

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Blog</h1>
        <Button onClick={onAddMockPost}>Add Mock Post</Button>
        <Button onClick={onAddAnotherMockPost}>Add Another Mock Post</Button>
      </div>

      <div className="mb-6">
        <Input
          type="text"
          placeholder="Search blog posts..."
          value={searchTerm}
          onChange={handleSearchTermChange}
          className="w-full md:w-1/2"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBlogPosts.map(post => (
          <Card key={post.id}>
            <CardHeader>
              <CardTitle>{post.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-2">
                <Badge>{post.category}</Badge>
                {post.published && <Badge variant="success">Published</Badge>}
              </div>
              <p className="text-sm text-muted-foreground">{post.description?.substring(0, 100)}...</p>
              <Link to={`/blog/${post.id}`} className="inline-block mt-4 text-blue-500 hover:underline">
                Read More
              </Link>
            </CardContent>
          </Card>
        ))}
        {filteredBlogPosts.length === 0 && (
          <div className="col-span-full text-center py-6">
            <p className="text-lg text-muted-foreground">No blog posts found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
