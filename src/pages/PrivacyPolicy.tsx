import React, { useState } from 'react';
import { Header } from "@/components/common/Header";
import Footer from '@/components/common/Footer';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const PrivacyPolicy: React.FC = () => {
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

  return (
    <div className="min-h-screen">
      <Header isDarkTheme={isDarkTheme} toggleTheme={toggleTheme} />
      
      <main className="container mx-auto py-10">
        <section className="mb-8">
          <div className="mb-4">
            <Link to="/" className="inline-flex items-center text-sm font-medium hover:underline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </div>
          <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: October 22, 2023</p>
        </section>

        <Separator className="mb-6" />

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">1. Introduction</h2>
          <p>
            Your privacy is important to us. This privacy policy explains how we collect, use,
            disclose, and safeguard your information when you visit our website [Website URL] and use
            our services.
          </p>

          <h2 className="text-2xl font-semibold">2. Information We Collect</h2>
          <p>We may collect the following types of information:</p>
          <ul className="list-disc list-inside">
            <li>Personal Information: Name, email address, phone number, etc.</li>
            <li>Non-Personal Information: Browser type, IP address, referring website, etc.</li>
          </ul>

          <h2 className="text-2xl font-semibold">3. How We Use Your Information</h2>
          <p>We use the collected information for various purposes, including:</p>
          <ul className="list-disc list-inside">
            <li>Providing and improving our services</li>
            <li>Responding to your inquiries</li>
            <li>Sending you updates and promotional materials</li>
          </ul>

          <h2 className="text-2xl font-semibold">4. Disclosure of Your Information</h2>
          <p>We may disclose your information to:</p>
          <ul className="list-disc list-inside">
            <li>Service providers</li>
            <li>Legal authorities</li>
            <li>Business partners</li>
          </ul>

          <h2 className="text-2xl font-semibold">5. Security</h2>
          <p>
            We take reasonable measures to protect your information from unauthorized access, use, or
            disclosure.
          </p>

          <h2 className="text-2xl font-semibold">6. Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="list-disc list-inside">
            <li>Access your information</li>
            <li>Correct inaccuracies</li>
            <li>Request deletion of your information</li>
          </ul>

          <h2 className="text-2xl font-semibold">7. Changes to This Privacy Policy</h2>
          <p>
            We may update this privacy policy from time to time. We will notify you of any changes by
            posting the new policy on this page.
          </p>

          <h2 className="text-2xl font-semibold">8. Contact Us</h2>
          <p>
            If you have any questions about this privacy policy, please contact us at [Contact Email or
            Address].
          </p>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
