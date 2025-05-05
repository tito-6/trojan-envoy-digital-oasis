-- Create settings table if not exists
CREATE TABLE IF NOT EXISTS settings (
  name VARCHAR(50) PRIMARY KEY,
  value LONGTEXT NOT NULL
);

-- Insert or update default settings
INSERT INTO settings (name, value) VALUES 
('header_settings', '{"id":1,"siteTitle":"Trojan Envoy","logoPath":"/logo.svg","contactButtonText":"Contact Us","contactButtonPath":"/contact","showLanguageSelector":true,"showThemeToggle":true,"enabledLanguages":["en"],"defaultLanguage":"en","mobileMenuLabel":"Menu","lastUpdated":"2023-01-01T00:00:00.000Z"}')
ON DUPLICATE KEY UPDATE value = VALUES(value);

INSERT INTO settings (name, value) VALUES
('footer_settings', '{"id":1,"companyName":"Trojan Envoy","copyrightText":"© {year} Trojan Envoy. All rights reserved.","sections":[],"socialLinks":[],"footerSections":[],"privacyPolicyLink":"/privacy-policy","termsOfServiceLink":"/terms-of-service","companyInfo":{"description":"Trojan Envoy is a digital agency...","address":"123 Main St, Anytown","phone":"555-123-4567","email":"info@trojanenvoy.com"},"showSocialLinks":true,"showBackToTop":true,"showNewsletter":true,"lastUpdated":"2023-01-01T00:00:00.000Z"}')
ON DUPLICATE KEY UPDATE value = VALUES(value);

-- Add services settings
INSERT INTO settings (name, value) VALUES
('services_settings', '{
  "id": 1,
  "title": "Our Services",
  "subtitle": "What We Do",
  "description": "We provide comprehensive digital solutions to help businesses succeed in the digital age.",
  "viewAllText": "View All Services",
  "viewAllUrl": "/services",
  "services": [
    {
      "id": 1,
      "title": "Web Development",
      "description": "Custom websites and web applications built with modern technologies to meet your business needs.",
      "iconName": "Code",
      "link": "/services/web-development",
      "order": 1,
      "color": "text-blue-600",
      "bgColor": "bg-blue-100"
    },
    {
      "id": 2,
      "title": "Mobile Development",
      "description": "Native and cross-platform mobile applications for iOS and Android devices.",
      "iconName": "Smartphone",
      "link": "/services/mobile-development",
      "order": 2,
      "color": "text-green-600",
      "bgColor": "bg-green-100"
    },
    {
      "id": 3,
      "title": "UI/UX Design",
      "description": "User-centered design that enhances the user experience and increases conversion rates.",
      "iconName": "Paintbrush",
      "link": "/services/ui-ux-design",
      "order": 3,
      "color": "text-purple-600",
      "bgColor": "bg-purple-100"
    },
    {
      "id": 4,
      "title": "Digital Marketing",
      "description": "Data-driven marketing strategies to increase your online presence and drive results.",
      "iconName": "BarChart",
      "link": "/services/digital-marketing",
      "order": 4,
      "color": "text-orange-600",
      "bgColor": "bg-orange-100"
    }
  ],
  "lastUpdated": "2024-04-03T00:00:00.000Z"
}')
ON DUPLICATE KEY UPDATE value = VALUES(value);

-- Create navigation table if not exists
CREATE TABLE IF NOT EXISTS navigation (
  id INT AUTO_INCREMENT PRIMARY KEY,
  label VARCHAR(50) NOT NULL,
  path VARCHAR(255) NOT NULL,
  `order` INT NOT NULL DEFAULT 0
);

-- Insert or update default navigation items
INSERT INTO navigation (label, path, `order`) VALUES
('Home', '/', 1),
('About', '/about', 2),
('Services', '/services', 3),
('Contact', '/contact', 4)
ON DUPLICATE KEY UPDATE label = VALUES(label), path = VALUES(path), `order` = VALUES(`order`);