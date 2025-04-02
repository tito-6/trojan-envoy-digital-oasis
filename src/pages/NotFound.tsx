
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, Home } from 'lucide-react';
import { Header } from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const NotFound: React.FC = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(
    localStorage.getItem("theme") === "dark" || 
    (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches)
  );

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

  return (
    <div className="min-h-screen flex flex-col">
      <Header isDarkTheme={isDarkTheme} toggleTheme={toggleTheme} />
      
      <main className="flex-grow flex items-center justify-center py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-9xl font-display font-bold mb-4">404</h1>
          <h2 className="text-2xl md:text-3xl font-medium mb-6">Page Not Found</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-8">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFound;
