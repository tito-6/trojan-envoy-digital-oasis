import React, { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import Portfolio from "./pages/Portfolio";
import PortfolioItem from "./pages/PortfolioItem";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Contact from "./pages/Contact";
import AITools from "./pages/AITools";
import { TooltipProvider } from "@/components/ui/tooltip";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CaseStudies from "./pages/CaseStudies";
import CaseStudyDetail from "./pages/CaseStudyDetail";
import FAQ from "./pages/FAQ";
import Careers from "./pages/Careers";
import { LanguageCode, availableLanguages } from "./lib/i18n";
import ThankYou from "./pages/ThankYou";
import WaitingListPage from "./pages/WaitingListPage";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (savedTheme === "light") {
      document.documentElement.classList.remove("dark");
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Create language route helper to reduce duplication
  const createLanguageRoutes = (languages: typeof availableLanguages) => {
    return languages.map(lang => (
      <Route key={lang.code} path={`/${lang.code}`} element={<Navigate to={`/${lang.code}/`} replace />} />
    ));
  };

  // Create localized routes for each page
  const createLocalizedRoutes = (path: string, Component: React.ComponentType) => {
    return availableLanguages.map(lang => (
      <Route key={`${lang.code}-${path}`} path={`/${lang.code}${path}`} element={<Component />} />
    ));
  };

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            {/* Language Root Routes */}
            {createLanguageRoutes(availableLanguages)}
            
            {/* Main Routes for all languages */}
            <Route path="/" element={<Index />} />
            {createLocalizedRoutes("/", Index)}
            
            <Route path="/services" element={<Services />} />
            {createLocalizedRoutes("/services", Services)}
            
            <Route path="/services/:slug" element={<ServiceDetail />} />
            {createLocalizedRoutes("/services/:slug", ServiceDetail)}
            
            <Route path="/about" element={<About />} />
            {createLocalizedRoutes("/about", About)}
            
            <Route path="/portfolio" element={<Portfolio />} />
            {createLocalizedRoutes("/portfolio", Portfolio)}
            
            <Route path="/portfolio/:slug" element={<PortfolioItem />} />
            {createLocalizedRoutes("/portfolio/:slug", PortfolioItem)}
            
            <Route path="/blog" element={<Blog />} />
            {createLocalizedRoutes("/blog", Blog)}
            
            <Route path="/blog/tag/:tag" element={<Blog />} />
            {createLocalizedRoutes("/blog/tag/:tag", Blog)}
            
            <Route path="/blog/:slug" element={<BlogPost />} />
            {createLocalizedRoutes("/blog/:slug", BlogPost)}
            
            <Route path="/contact" element={<Contact />} />
            {createLocalizedRoutes("/contact", Contact)}
            
            <Route path="/ai-tools" element={<AITools />} />
            {createLocalizedRoutes("/ai-tools", AITools)}
            
            {/* New Pages */}
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            {createLocalizedRoutes("/privacy-policy", PrivacyPolicy)}
            
            <Route path="/terms-of-service" element={<TermsOfService />} />
            {createLocalizedRoutes("/terms-of-service", TermsOfService)}
            
            <Route path="/case-studies" element={<CaseStudies />} />
            {createLocalizedRoutes("/case-studies", CaseStudies)}
            
            <Route path="/case-studies/:slug" element={<CaseStudyDetail />} />
            {createLocalizedRoutes("/case-studies/:slug", CaseStudyDetail)}
            
            <Route path="/careers" element={<Careers />} />
            {createLocalizedRoutes("/careers", Careers)}
            
            <Route path="/faq" element={<FAQ />} />
            {createLocalizedRoutes("/faq", FAQ)}
            
            {/* Add ThankYou page route */}
            <Route path="/thank-you" element={<ThankYou />} />
            {createLocalizedRoutes("/thank-you", ThankYou)}
            
            <Route path="/waiting-list" element={<WaitingListPage />} />
            {createLocalizedRoutes("/waiting-list", WaitingListPage)}
            
            {/* Keep this catch-all route at the end */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
