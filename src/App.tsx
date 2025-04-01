
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import About from "@/pages/About";
import Services from "@/pages/Services";
import ServiceDetail from "@/pages/ServiceDetail";
import Portfolio from "@/pages/Portfolio";
import PortfolioItem from "@/pages/PortfolioItem";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import Contact from "@/pages/Contact";
import NotFound from "@/pages/NotFound";
import Admin from "@/pages/admin/Admin";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminContent from "@/pages/admin/AdminContent";
import AdminContacts from "@/pages/admin/AdminContacts";
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminHero from "@/pages/admin/AdminHero";
import AdminSettings from "@/pages/admin/AdminSettings";
import FAQ from "@/pages/FAQ";
import Careers from "@/pages/Careers";
import CaseStudies from "@/pages/CaseStudies";
import CaseStudyDetail from "@/pages/CaseStudyDetail";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfService from "@/pages/TermsOfService";
import AITools from "@/pages/AITools";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/lib/ThemeProvider";
import { Suspense } from "react";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:serviceId" element={<ServiceDetail />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/portfolio/:projectId" element={<PortfolioItem />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:postId" element={<BlogPost />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/case-studies" element={<CaseStudies />} />
            <Route path="/case-studies/:caseId" element={<CaseStudyDetail />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/ai-tools" element={<AITools />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<Admin />}>
              <Route index element={<AdminDashboard />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="content" element={<AdminContent />} />
              <Route path="hero" element={<AdminHero />} />
              <Route path="contacts" element={<AdminContacts />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
            <Route path="/admin/login" element={<AdminLogin />} />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <Toaster />
      </Router>
    </ThemeProvider>
  );
}

export default App;
