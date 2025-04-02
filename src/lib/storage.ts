class StorageService {
  private listeners: { [key: string]: ((event: CustomEvent) => void)[] } = {};

  addEventListener(event: string, callback: (event: CustomEvent) => void): () => void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);

    return () => {
      this.removeEventListener(event, callback);
    };
  }

  removeEventListener(event: string, callback: (event: CustomEvent) => void): void {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
  }

  // Get header settings
  getHeaderSettings(): any {
    const settings = localStorage.getItem('headerSettings');
    return settings ? JSON.parse(settings) : {
      id: 1,
      siteTitle: "Trojan Envoy",
      logoPath: "/logo.svg",
      contactButtonText: "Contact Us",
      contactButtonPath: "/contact",
      showLanguageSelector: true,
      showThemeToggle: true,
      enabledLanguages: ['en', 'de', 'es'],
      defaultLanguage: 'en',
      mobileMenuLabel: 'Menu',
      lastUpdated: new Date().toISOString()
    };
  }

  // Update header settings
  updateHeaderSettings(settings: any): void {
    localStorage.setItem('headerSettings', JSON.stringify(settings));
    window.dispatchEvent(new CustomEvent('header-settings-updated'));
  }

  // Get hero settings
  getHeroSettings(): any {
    const settings = localStorage.getItem('heroSettings');
    return settings ? JSON.parse(settings) : {
      id: 1,
      title: "We are a digital agency that helps businesses grow",
      subtitle: "We help you to grow your business by providing the best digital solutions",
      description: "We are a team of experienced professionals who are passionate about helping businesses grow. We offer a wide range of digital solutions to help you achieve your goals.",
      primaryButtonText: "Get Started",
      primaryButtonUrl: "/contact",
      secondaryButtonText: "Learn More",
      secondaryButtonUrl: "/about",
      showPartnerLogos: true,
      partnerSectionTitle: "Trusted by the best",
      partnerCertifiedText: "Certified Partner",
      showTechStack: true,
      techStackTitle: "Our Tech Stack",
      techStackSubtitle: "We use the latest technologies to build your dream",
      techStackDescription: "We are always learning and experimenting with new technologies to provide you with the best possible solutions.",
      partnerLogos: [],
      techIcons: [],
      lastUpdated: new Date().toISOString()
    };
  }

  // Update hero settings
  updateHeroSettings(settings: any): void {
    localStorage.setItem('heroSettings', JSON.stringify(settings));
    window.dispatchEvent(new CustomEvent('hero-settings-updated'));
  }

  // Get about settings
  getAboutSettings(): any {
    const settings = localStorage.getItem('aboutSettings');
    return settings ? JSON.parse(settings) : {
      id: 1,
      title: "About Us",
      subtitle: "We are a digital agency that helps businesses grow",
      description: "We are a team of experienced professionals who are passionate about helping businesses grow. We offer a wide range of digital solutions to help you achieve your goals.",
      missionTitle: "Our Mission",
      missionDescription: "To help businesses grow by providing the best digital solutions.",
      keyPoints: [],
      learnMoreText: "Learn More",
      learnMoreUrl: "/about",
      stats: [],
      lastUpdated: new Date().toISOString()
    };
  }

  // Update about settings
  updateAboutSettings(settings: any): void {
    localStorage.setItem('aboutSettings', JSON.stringify(settings));
    window.dispatchEvent(new CustomEvent('about-settings-updated'));
  }

  // Get services settings
  getServicesSettings(): any {
    const settings = localStorage.getItem('servicesSettings');
    return settings ? JSON.parse(settings) : {
      id: 1,
      title: "Our Services",
      subtitle: "We offer a wide range of digital solutions to help you achieve your goals.",
      description: "We are a team of experienced professionals who are passionate about helping businesses grow. We offer a wide range of digital solutions to help you achieve your goals.",
      viewAllText: "View All Services",
      viewAllUrl: "/services",
      services: [],
      lastUpdated: new Date().toISOString()
    };
  }

  // Update services settings
  updateServicesSettings(settings: any): void {
    localStorage.setItem('servicesSettings', JSON.stringify(settings));
    window.dispatchEvent(new CustomEvent('services-settings-updated'));
  }

  getReferencesSettings(): any {
    const settings = localStorage.getItem('referencesSettings');
    return settings ? JSON.parse(settings) : {
      id: 1,
      title: "Our Clients",
      subtitle: "We have worked with some of the best companies in the world",
      viewCaseStudiesText: "View Case Studies",
      viewCaseStudiesUrl: "/case-studies",
      clientLogos: [],
      lastUpdated: new Date().toISOString()
    };
  }

  updateReferencesSettings(settings: any): void {
    localStorage.setItem('referencesSettings', JSON.stringify(settings));
    window.dispatchEvent(new CustomEvent('references-settings-updated'));
  }

  getFAQSettings(): any {
    const settings = localStorage.getItem('faqSettings');
    return settings ? JSON.parse(settings) : {
      id: 1,
      title: "Frequently Asked Questions",
      subtitle: "Here are some of the most frequently asked questions about our company",
      viewAllText: "View All FAQs",
      viewAllUrl: "/faq",
      faqItems: [],
      lastUpdated: new Date().toISOString()
    };
  }

  updateFAQSettings(settings: any): void {
    localStorage.setItem('faqSettings', JSON.stringify(settings));
    window.dispatchEvent(new CustomEvent('faq-settings-updated'));
  }

  getContactSettings(): any {
    const settings = localStorage.getItem('contactSettings');
    return settings ? JSON.parse(settings) : {
      id: 1,
      title: "Contact Us",
      subtitle: "We would love to hear from you",
      description: "If you have any questions or would like to learn more about our services, please contact us.",
      submitButtonText: "Send Message",
      contactInfoItems: [],
      formFields: [],
      enableRecaptcha: false,
      recaptchaSiteKey: "",
      recaptchaSecretKey: "",
      enableFingerprinting: false,
      enableEmailNotifications: false,
      emailSender: "",
      emailRecipient: "",
      emailSubject: "New Contact Form Submission",
      enableAppointmentScheduling: false,
      appointmentLabel: "Schedule an Appointment",
      availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      workingHoursStart: "09:00",
      workingHoursEnd: "17:00",
      lastUpdated: new Date().toISOString()
    };
  }

  getFooterSettings(): any {
    const settings = localStorage.getItem('footerSettings');
    return settings ? JSON.parse(settings) : {
      id: 1,
      companyInfo: {
        description: "We are a digital agency that helps businesses grow",
        address: "123 Main Street, Anytown, CA 12345",
        phone: "123-456-7890",
        email: "info@example.com"
      },
      socialLinks: [],
      footerSections: [],
      copyrightText: "© {year} Trojan Envoy. All rights reserved.",
      privacyPolicyLink: "/privacy-policy",
      termsOfServiceLink: "/terms-of-service",
      lastUpdated: new Date().toISOString()
    };
  }

  // Update footer settings
  updateFooterSettings(settings: any): void {
    localStorage.setItem('footerSettings', JSON.stringify(settings));
    window.dispatchEvent(new CustomEvent('footer-settings-updated'));
  }

  // Update contact settings
  updateContactSettings(settings: any): void {
    localStorage.setItem('contactSettings', JSON.stringify(settings));
    window.dispatchEvent(new CustomEvent('contact-settings-updated'));
  }
}

export const storageService = new StorageService();
