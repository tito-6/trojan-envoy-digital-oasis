
import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Portfolio from "./pages/Portfolio";
import PortfolioItem from "./pages/PortfolioItem";
import CaseStudies from "./pages/CaseStudies";
import CaseStudyDetail from "./pages/CaseStudyDetail";
import Careers from "./pages/Careers";
import FAQ from "./pages/FAQ";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Admin from "./pages/admin/Admin";
import AdminContent from "./pages/admin/AdminContent";
import AdminServicesSettings from "./pages/admin/AdminServicesSettings";
import AdminHeader from "./pages/admin/AdminHeader";
import AdminHero from "./pages/admin/AdminHero";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminContacts from "./pages/admin/AdminContacts";
import AdminAboutSettings from "./pages/admin/AdminAboutSettings";
import AITools from "./pages/AITools";
import { useLanguage } from "./lib/i18n";
import { Toaster } from "@/components/ui/sonner";

function App() {
  const { setLanguage, currentLanguage } = useLanguage();
  
  useEffect(() => {
    const htmlEl = document.querySelector("html");
    if (htmlEl) {
      htmlEl.setAttribute("lang", currentLanguage);
      htmlEl.setAttribute("dir", currentLanguage === "ar" ? "rtl" : "ltr");
    }
  }, [currentLanguage]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:slug" element={<ServiceDetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/portfolio/:slug" element={<PortfolioItem />} />
        <Route path="/case-studies" element={<CaseStudies />} />
        <Route path="/case-studies/:slug" element={<CaseStudyDetail />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/ai-tools" element={<AITools />} />
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<Admin />}>
          <Route index element={<AdminDashboard />} />
          <Route path="content" element={<AdminContent />} />
          <Route path="services-settings" element={<AdminServicesSettings />} />
          <Route path="header-settings" element={<AdminHeader />} />
          <Route path="hero-settings" element={<AdminHero />} />
          <Route path="about-settings" element={<AdminAboutSettings />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="contacts" element={<AdminContacts />} />
        </Route>
        
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
