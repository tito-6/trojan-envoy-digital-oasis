import express from 'express';
import type { RequestHandler } from 'express';
import cors from 'cors';
import { executeQuery, testConnection } from '../lib/server/mysql';

const app = express();
const router = express.Router();

app.use(cors());
app.use(express.json());

// Default settings to use when database values are not found
const DEFAULT_SETTINGS = {
  header_settings: {
    id: 1,
    siteTitle: "Trojan Envoy",
    logoPath: "/logo.svg",
    contactButtonText: "Contact Us",
    contactButtonPath: "/contact",
    showLanguageSelector: true,
    showThemeToggle: true,
    enabledLanguages: ["en"],
    defaultLanguage: "en",
    mobileMenuLabel: "Menu",
    lastUpdated: new Date().toISOString()
  },
  footer_settings: {
    id: 1,
    companyName: "Trojan Envoy",
    copyrightText: "© {year} Trojan Envoy. All rights reserved.",
    sections: [],
    socialLinks: [],
    footerSections: [],
    privacyPolicyLink: "/privacy-policy",
    termsOfServiceLink: "/terms-of-service",
    companyInfo: {
      description: "Trojan Envoy is a digital agency...",
      address: "123 Main St, Anytown",
      phone: "555-123-4567",
      email: "info@trojanenvoy.com"
    },
    showSocialLinks: true,
    showBackToTop: true,
    showNewsletter: true,
    lastUpdated: new Date().toISOString()
  },
  about_settings: {
    id: 1,
    title: "About Trojan Envoy",
    subtitle: "Your Digital Transformation Partner",
    description: "We are a team of passionate digital experts dedicated to transforming businesses through innovative technology solutions.",
    mission: "To empower businesses with cutting-edge digital solutions that drive growth and success.",
    vision: "To be the leading digital transformation partner for businesses worldwide.",
    values: [
      {
        id: 1,
        title: "Innovation",
        description: "We embrace new technologies and creative solutions",
        icon: "lightbulb"
      },
      {
        id: 2,
        title: "Excellence",
        description: "We strive for the highest quality in everything we do",
        icon: "star"
      },
      {
        id: 3,
        title: "Integrity",
        description: "We maintain the highest ethical standards",
        icon: "shield"
      }
    ],
    lastUpdated: new Date().toISOString()
  },
  references_settings: {
    id: 1,
    title: "Our References",
    subtitle: "Trusted by Leading Companies",
    description: "We've helped companies across various industries achieve their digital goals.",
    partners: [],
    testimonials: [],
    stats: [
      { id: 1, label: "Happy Clients", value: "100+" },
      { id: 2, label: "Projects Completed", value: "500+" },
      { id: 3, label: "Years Experience", value: "10+" }
    ],
    lastUpdated: new Date().toISOString()
  },
  faq_settings: {
    id: 1,
    title: "Frequently Asked Questions",
    subtitle: "Get Quick Answers",
    description: "Find answers to common questions about our services and processes.",
    categories: [
      {
        id: 1,
        name: "General",
        faqs: [
          {
            id: 1,
            question: "What services do you offer?",
            answer: "We offer a comprehensive range of digital services including web development, mobile apps, digital marketing, and more."
          }
        ]
      }
    ],
    lastUpdated: new Date().toISOString()
  },
  hero_settings: {
    id: 1,
    title: "Transform Your Digital Presence",
    subtitle: "Innovative Solutions for Modern Businesses",
    description: "We help businesses achieve their digital transformation goals with cutting-edge technology solutions.",
    primaryCTA: {
      text: "Get Started",
      link: "/contact"
    },
    secondaryCTA: {
      text: "Learn More",
      link: "/about"
    },
    backgroundImage: "/hero-bg.jpg",
    stats: [
      { id: 1, label: "Projects", value: "500+" },
      { id: 2, label: "Clients", value: "100+" },
      { id: 3, label: "Success Rate", value: "98%" }
    ],
    lastUpdated: new Date().toISOString()
  },
  contact_settings: {
    id: 1,
    title: "Get in Touch",
    subtitle: "Contact Us",
    description: "Have a question or want to work together? We'd love to hear from you.",
    formFields: [
      {
        id: 1,
        type: "text",
        name: "name",
        label: "Name",
        placeholder: "Your name",
        required: true,
        order: 1
      },
      {
        id: 2,
        type: "email",
        name: "email",
        label: "Email",
        placeholder: "your.email@example.com",
        required: true,
        order: 2
      },
      {
        id: 3,
        type: "tel",
        name: "phone",
        label: "Phone",
        placeholder: "Your phone number",
        required: false,
        order: 3
      },
      {
        id: 4,
        type: "select",
        name: "subject",
        label: "Subject",
        placeholder: "Select a subject",
        required: false,
        order: 4,
        options: [
          "General Inquiry",
          "Project Discussion",
          "Support",
          "Other"
        ]
      },
      {
        id: 5,
        type: "textarea",
        name: "message",
        label: "Message",
        placeholder: "Your message",
        required: true,
        order: 5
      },
      {
        id: 6,
        type: "checkbox",
        name: "terms",
        label: "I agree to the terms and conditions",
        required: true,
        order: 6
      }
    ],
    submitButtonText: "Send Message",
    lastUpdated: new Date().toISOString()
  },
  services_settings: {
    id: 1,
    title: "Our Services",
    subtitle: "What We Do Best",
    description: "We offer a comprehensive range of digital services to help your business grow.",
    services: [
      {
        id: 1,
        title: "Web Development",
        description: "Custom web applications built with modern technologies",
        icon: "code",
        slug: "web-development",
        isActive: true
      },
      {
        id: 2,
        title: "Mobile Apps",
        description: "Native and cross-platform mobile applications",
        icon: "smartphone",
        slug: "mobile-apps",
        isActive: true
      },
      {
        id: 3,
        title: "Digital Marketing",
        description: "SEO, social media, and content marketing strategies",
        icon: "trending-up",
        slug: "digital-marketing",
        isActive: true
      }
    ],
    cta: {
      title: "Ready to Start Your Project?",
      description: "Let's discuss your requirements and create something amazing together.",
      buttonText: "Get Started",
      buttonLink: "/contact"
    },
    lastUpdated: new Date().toISOString()
  }
};

const DEFAULT_NAVIGATION = [
  { id: 1, label: 'Home', path: '/', order: 1 },
  { id: 2, label: 'About', path: '/about', order: 2 },
  { id: 3, label: 'Services', path: '/services', order: 3 },
  { id: 4, label: 'Contact', path: '/contact', order: 4 }
];

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Global error handler:', err);
  res.status(500).json({ error: 'Internal server error', details: err.message });
});

// Health check with detailed diagnostics
const healthCheck: RequestHandler = async (_req, res) => {
  try {
    const dbConnected = await testConnection();
    const health = {
      status: dbConnected ? 'ok' : 'error',
      database: dbConnected ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString()
    };
    
    if (!dbConnected) {
      res.status(503).json(health);
    } else {
      res.json(health);
    }
  } catch (error: any) {
    console.error('Health check failed:', error);
    res.status(503).json({ 
      status: 'error', 
      database: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

// Content endpoints with better error handling
const getContent: RequestHandler = async (req, res) => {
  const { type, slug } = req.query;
  console.log(`Fetching content with type: ${type}, slug: ${slug}`);
  
  try {
    let query = 'SELECT * FROM content';
    const values: any[] = [];
    
    if (type || slug) {
      query += ' WHERE';
      if (type) {
        query += ' type = ?';
        values.push(type);
      }
      if (slug) {
        query += type ? ' AND slug = ?' : ' slug = ?';
        values.push(slug);
      }
    }
    
    const results = await executeQuery({ query, values });
    console.log(`Found ${Array.isArray(results) ? results.length : 0} content items`);
    res.json(results || []);
  } catch (error: any) {
    console.error('Content fetch error:', error);
    res.status(500).json({ error: 'Database error', details: error.message });
  }
};

// Navigation endpoints with validation
const getNavigation: RequestHandler = async (_req, res) => {
  console.log('Fetching navigation items');
  try {
    const results = await executeQuery({
      query: 'SELECT * FROM navigation ORDER BY `order`'
    });
    
    if (!Array.isArray(results) || results.length === 0) {
      console.log('No navigation items found, returning defaults');
      return res.json(DEFAULT_NAVIGATION);
    }
    
    console.log(`Found ${results.length} navigation items`);
    res.json(results);
  } catch (error: any) {
    console.error('Navigation fetch error:', error);
    console.log('Returning default navigation due to error');
    res.json(DEFAULT_NAVIGATION);
  }
};

// Settings endpoints with JSON validation
const getSettings: RequestHandler = async (req, res) => {
  const settingName = req.params.name;
  console.log(`Fetching settings for: ${settingName}`);
  
  try {
    const results = await executeQuery({
      query: 'SELECT value FROM settings WHERE name = ?',
      values: [settingName]
    });
    
    console.log('Query results:', results);
    
    if (!Array.isArray(results) || results.length === 0) {
      console.log(`No settings found for ${settingName}, returning defaults`);
      const defaultValue = DEFAULT_SETTINGS[settingName];
      if (defaultValue) {
        return res.json(defaultValue);
      }
      return res.status(404).json({ 
        error: `Settings not found: ${settingName}`,
        availableSettings: Object.keys(DEFAULT_SETTINGS)
      });
    }
    
    try {
      const parsed = JSON.parse(results[0].value);
      res.json(parsed);
    } catch (parseError: any) {
      console.error('Settings parse error:', parseError);
      console.error('Raw value:', results[0].value);
      const defaultValue = DEFAULT_SETTINGS[settingName];
      if (defaultValue) {
        console.log(`Using default settings for ${settingName} due to parse error`);
        return res.json(defaultValue);
      }
      res.status(500).json({ 
        error: 'Invalid settings format',
        details: parseError.message
      });
    }
  } catch (error: any) {
    console.error(`Settings fetch error for ${settingName}:`, error);
    const defaultValue = DEFAULT_SETTINGS[settingName];
    if (defaultValue) {
      console.log(`Using default settings for ${settingName} due to database error`);
      return res.json(defaultValue);
    }
    res.status(500).json({ 
      error: 'Database error',
      details: error.message
    });
  }
};

// User endpoints
const getUser: RequestHandler = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email || typeof email !== 'string') {
      res.status(400).json({ error: 'Email parameter required' });
      return;
    }
    
    const results = await executeQuery({
      query: 'SELECT * FROM users WHERE email = ?',
      values: [email]
    });
    res.json(results[0] || null);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
};

// Register routes
router.get('/health', healthCheck);
router.get('/content', getContent);
router.get('/content/:id', getContent);
router.get('/navigation', getNavigation);
router.get('/settings/:name', getSettings);
router.get('/users', getUser);

// Mount all routes under /api
app.use('/api', router);

// Database initialization function
async function initializeDatabase() {
  try {
    console.log('Checking and initializing database...');
    
    // Create settings table
    await executeQuery({
      query: `CREATE TABLE IF NOT EXISTS settings (
        name VARCHAR(50) PRIMARY KEY,
        value LONGTEXT NOT NULL
      )`
    });

    // Create navigation table
    await executeQuery({
      query: `CREATE TABLE IF NOT EXISTS navigation (
        id INT AUTO_INCREMENT PRIMARY KEY,
        label VARCHAR(50) NOT NULL,
        path VARCHAR(255) NOT NULL,
        \`order\` INT NOT NULL DEFAULT 0
      )`
    });

    // Insert all default settings if they don't exist
    for (const [settingName, settingValue] of Object.entries(DEFAULT_SETTINGS)) {
      const settingExists = await executeQuery({
        query: 'SELECT 1 FROM settings WHERE name = ?',
        values: [settingName]
      });

      if (!Array.isArray(settingExists) || settingExists.length === 0) {
        await executeQuery({
          query: 'INSERT INTO settings (name, value) VALUES (?, ?)',
          values: [settingName, JSON.stringify(settingValue)]
        });
        console.log(`Inserted default ${settingName}`);
      }
    }

    // Insert default navigation items if none exist
    const navigationExists = await executeQuery({
      query: 'SELECT 1 FROM navigation LIMIT 1'
    });

    if (!Array.isArray(navigationExists) || navigationExists.length === 0) {
      for (const item of DEFAULT_NAVIGATION) {
        await executeQuery({
          query: 'INSERT INTO navigation (label, path, `order`) VALUES (?, ?, ?)', 
          values: [item.label, item.path, item.order]
        });
      }
      console.log('Inserted default navigation items');
    }

    console.log('Database initialization completed successfully');
    return true;
  } catch (error) {
    console.error('Database initialization failed:', error);
    return false;
  }
}

// Start server with database initialization
const PORT = process.env.API_PORT || 3001;
app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
  console.log('Testing database connection...');
  
  testConnection()
    .then(async connected => {
      if (connected) {
        console.log('Successfully connected to database');
        // Initialize database after connection test
        const initialized = await initializeDatabase();
        if (initialized) {
          console.log('Server is ready to handle requests');
        } else {
          console.error('Server started but database initialization failed');
        }
      } else {
        console.error('Failed to connect to database');
      }
    })
    .catch(error => {
      console.error('Database connection test failed:', error);
    });
});