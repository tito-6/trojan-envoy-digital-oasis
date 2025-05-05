
-- Drop tables if they exist
DROP TABLE IF EXISTS content;
DROP TABLE IF EXISTS contact_requests;
DROP TABLE IF EXISTS navigation;
DROP TABLE IF EXISTS settings;

-- Create content table
CREATE TABLE content (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  slug VARCHAR(255),
  description TEXT,
  content LONGTEXT,
  images JSON,
  seoKeywords JSON,
  category VARCHAR(100),
  author VARCHAR(100),
  publishDate DATETIME,
  published BOOLEAN DEFAULT FALSE,
  language VARCHAR(10) DEFAULT 'en',
  lastUpdated DATETIME,
  
  subtitle VARCHAR(255),
  seoTitle VARCHAR(255),
  seoDescription TEXT,
  showInNavigation BOOLEAN DEFAULT FALSE,
  
  role VARCHAR(100),
  company VARCHAR(100),
  rating INT,
  
  answer TEXT,
  
  technologies JSON,
  duration VARCHAR(100),
  client VARCHAR(100),
  challenge TEXT,
  solution TEXT,
  results TEXT,
  
  department VARCHAR(100),
  responsibilities JSON,
  
  location VARCHAR(255),
  requirements JSON,
  benefits JSON,
  applyUrl VARCHAR(255),
  salaryMin DECIMAL(10,2),
  salaryMax DECIMAL(10,2),
  
  iconName VARCHAR(50),
  color VARCHAR(20),
  bgColor VARCHAR(20),
  
  formattedContent JSON,
  htmlContent LONGTEXT,
  seoHeadingStructure JSON,
  
  videos JSON,
  documents JSON,
  
  `order` INT DEFAULT 0,
  
  link VARCHAR(255),
  
  INDEX idx_type (type),
  INDEX idx_slug (slug),
  INDEX idx_published (published),
  INDEX idx_language (language)
);

-- Create contact_requests table
CREATE TABLE contact_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  createdAt DATETIME NOT NULL,
  status ENUM('new', 'in-progress', 'completed') DEFAULT 'new',
  company VARCHAR(100)
);

-- Create navigation table
CREATE TABLE navigation (
  id INT AUTO_INCREMENT PRIMARY KEY,
  label VARCHAR(50) NOT NULL,
  path VARCHAR(255) NOT NULL,
  `order` INT NOT NULL DEFAULT 0
);

-- Create settings table
CREATE TABLE settings (
  name VARCHAR(50) PRIMARY KEY,
  value LONGTEXT NOT NULL
);

-- Insert default navigation items
INSERT INTO navigation (label, path, `order`) VALUES
('Home', '/', 1),
('About', '/about', 2),
('Services', '/services', 3),
('Contact', '/contact', 4);

-- Insert default settings
INSERT INTO settings (name, value) VALUES
('header_settings', '{"id":1,"siteTitle":"Trojan Envoy","logoPath":"/logo.svg","contactButtonText":"Contact Us","contactButtonPath":"/contact","showLanguageSelector":true,"showThemeToggle":true,"enabledLanguages":["en"],"defaultLanguage":"en","mobileMenuLabel":"Menu","lastUpdated":"2023-01-01T00:00:00.000Z"}'),
('footer_settings', '{"id":1,"companyName":"Trojan Envoy","copyrightText":"© 2023 Trojan Envoy. All rights reserved.","sections":[],"socialLinks":[],"footerSections":[],"privacyPolicyLink":"/privacy-policy","termsOfServiceLink":"/terms-of-service","companyInfo":{"description":"Trojan Envoy is a digital agency...","address":"123 Main St, Anytown","phone":"555-123-4567","email":"info@trojanenvoy.com"},"showSocialLinks":true,"showBackToTop":true,"showNewsletter":true,"lastUpdated":"2023-01-01T00:00:00.000Z"}'),
('hero_settings', '{"id":1,"title":"We are Trojan Envoy","subtitle":"A digital agency","description":"We help businesses grow with digital marketing","primaryButtonText":"Learn More","primaryButtonUrl":"/about","secondaryButtonText":"Contact Us","secondaryButtonUrl":"/contact","showPartnerLogos":true,"partnerSectionTitle":"Our Partners","partnerCertifiedText":"Certified Partners","showTechStack":true,"techStackTitle":"Our Tech Stack","techStackSubtitle":"We use the latest technologies","techStackDescription":"We are always learning new technologies to stay ahead of the curve","partnerLogos":[],"techIcons":[],"lastUpdated":"2023-01-01T00:00:00.000Z"}');
