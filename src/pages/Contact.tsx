import React, { useState, useEffect } from 'react';
import { Header } from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { useLanguage } from '@/lib/i18n';
import ContactHero from '@/components/contact/ContactHero';
import ContactInfo from '@/components/contact/ContactInfo';
import Contact from '@/components/home/Contact';
import { storageService } from '@/lib/storage';

const ContactPage: React.FC = () => {
  const { t } = useLanguage();
  const [isDarkTheme, setIsDarkTheme] = useState(
    localStorage.getItem("theme") === "dark" || 
    (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches)
  );

  useEffect(() => {
    // Set up theme toggle function
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setIsDarkTheme(true);
    } else if (savedTheme === "light") {
      document.documentElement.classList.remove("dark");
      setIsDarkTheme(false);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.classList.add("dark");
      setIsDarkTheme(true);
    }

    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

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

  const contactInfoItems = storageService.getContactSettings().contactInfoItems;

  return (
    <div className="min-h-screen">
      <Header isDarkTheme={isDarkTheme} toggleTheme={toggleTheme} />
      
      <main>
        <ContactHero />
        <ContactInfo contactInfoItems={contactInfoItems} />
        <Contact />
      </main>
      
      <Footer />
    </div>
  );
};

export default ContactPage;
