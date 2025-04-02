import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
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
import Admin from "./pages/admin/Admin";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminContent from "./pages/admin/AdminContent";
import AdminContacts from "./pages/admin/AdminContacts";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminHeader from "./pages/admin/AdminHeader";
import AdminHero from "./pages/admin/AdminHero";
import { TooltipProvider } from "@/components/ui/tooltip";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CaseStudies from "./pages/CaseStudies";
import CaseStudyDetail from "./pages/CaseStudyDetail";
import FAQ from "./pages/FAQ";
import Careers from "./pages/Careers";
import AdminServicesSettings from "./pages/admin/AdminServicesSettings";
import AdminAboutSettings from "./pages/admin/AdminAboutSettings";
import AdminReferencesSettings from "./pages/admin/AdminReferencesSettings";
import AdminFAQSettings from "./pages/admin/AdminFAQSettings";
import { LanguageCode, availableLanguages } from "./lib/i18n";

const queryClient = new QueryClient();

function App() {
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
            
            {/* Admin Routes (No language prefix) */}
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/content" element={<AdminContent />} />
            <Route path="/admin/header" element={<AdminHeader />} />
            <Route path="/admin/hero" element={<AdminHero />} />
            <Route path="/admin/about-settings" element={<AdminAboutSettings />} />
            <Route path="/admin/services-settings" element={<AdminServicesSettings />} />
            <Route path="/admin/references-settings" element={<AdminReferencesSettings />} />
            <Route path="/admin/faq-settings" element={<AdminFAQSettings />} />
            <Route path="/admin/contacts" element={<AdminContacts />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            
            {/* Not Found Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
