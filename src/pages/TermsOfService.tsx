
import React, { useEffect } from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { useLanguage } from "@/lib/i18n";

const TermsOfService: React.FC = () => {
  const { t } = useLanguage();

  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
    
    // Set page title
    document.title = "Terms of Service | Trojan Envoy";
  }, []);

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-8">Terms of Service</h1>
            
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-lg text-muted-foreground mb-8">
                Last updated: June 1, 2023
              </p>
              
              <h2>1. Acceptance of Terms</h2>
              <p>
                By accessing or using the services provided by Trojan Envoy ("we", "our", or "us"), you agree to be bound by these Terms of Service. If you do not agree to all the terms and conditions of this agreement, you may not access or use our services.
              </p>
              
              <h2>2. Changes to Terms</h2>
              <p>
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
              </p>
              
              <h2>3. Services Description</h2>
              <p>
                Trojan Envoy provides digital services including but not limited to web development, mobile application development, UI/UX design, and digital marketing. We reserve the right to modify, suspend or discontinue, temporarily or permanently, the services (or any part thereof) with or without notice.
              </p>
              
              <h2>4. User Responsibilities</h2>
              <p>
                You are responsible for maintaining the confidentiality of your account information, including your password, and for all activity that occurs under your account. You agree to notify us immediately of any unauthorized use of your account or any other breach of security.
              </p>
              
              <h2>5. Intellectual Property</h2>
              <p>
                The service and its original content, features, and functionality are and will remain the exclusive property of Trojan Envoy and its licensors. The service is protected by copyright, trademark, and other laws of both the United States and foreign countries.
              </p>
              
              <h2>6. Payment Terms</h2>
              <p>
                For services that require payment, we will explicitly communicate all fees before you incur the charge. You agree to pay all charges at the prices then in effect for your purchases. You also agree to pay all applicable taxes. If payment is not received, we may suspend or terminate your access to the services.
              </p>
              
              <h2>7. Limitation of Liability</h2>
              <p>
                In no event shall Trojan Envoy, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.
              </p>
              
              <h2>8. Governing Law</h2>
              <p>
                These Terms shall be governed and construed in accordance with the laws of New York, United States, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
              </p>
              
              <h2>9. Contact Us</h2>
              <p>
                If you have any questions about these Terms, please contact us at:
              </p>
              <p>
                Email: legal@trojanenvoy.com<br />
                Phone: +1 (555) 123-4567<br />
                Address: 1234 Tech Avenue, Innovation District, New York, NY 10001
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TermsOfService;
