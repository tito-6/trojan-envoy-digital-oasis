import React from "react";
import { useLanguage } from "@/lib/i18n";

interface SEOProps {
  title?: string;
  description?: string;
  path?: string;
  type?: string;
}

const SEO: React.FC<SEOProps> = ({ title, description, path = "", type = "website" }) => {
  const { t, currentLanguage } = useLanguage();

  // Get base URL from environment or default
  const baseUrl = "https://trojanenvoy.com";
  const fullUrl = `${baseUrl}${path}`;

  // Default meta content
  const defaultTitle = t('hero.title');
  const defaultDescription = t('hero.description');
  const companyName = "Trojan Envoy";

  // Construct meta content - improved format for better CTR
  const metaTitle = title 
    ? `${title} | ${companyName} - ${t('hero.subtitle')}`
    : `${defaultTitle} | ${companyName} - ${t('hero.subtitle')}`;
  const metaDescription = description || defaultDescription;

  // Structured data for organization with enhanced content
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: companyName,
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description: metaDescription,
    sameAs: [
      "https://www.linkedin.com/company/trojan-envoy",
      "https://twitter.com/trojanenvoy",
      "https://www.facebook.com/trojanenvoy"
    ],
    address: {
      "@type": "PostalAddress",
      addressCountry: "Turkey",
      addressLocality: "Istanbul"
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+1-555-123-4567",
      contactType: "customer service",
      availableLanguage: ["English", "Spanish", "French", "German", "Chinese", "Arabic", "Turkish"],
      areaServed: "Worldwide"
    }
  };

  // Enhanced structured data for services
  const servicesSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    provider: {
      "@type": "Organization",
      name: companyName
    },
    areaServed: {
      "@type": "GeoCircle",
      geoMidpoint: {
        "@type": "GeoCoordinates",
        latitude: "41.0082",
        longitude: "28.9784"
      },
      geoRadius: "40075000"
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Digital Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: t('services.web.title'),
            description: t('services.web.description')
          },
          priceSpecification: {
            "@type": "PriceSpecification",
            priceCurrency: "USD",
            price: "Contact for pricing"
          }
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: t('services.mobile.title'),
            description: t('services.mobile.description')
          },
          priceSpecification: {
            "@type": "PriceSpecification",
            priceCurrency: "USD",
            price: "Contact for pricing"
          }
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: t('services.digital.title'),
            description: t('services.digital.description')
          },
          priceSpecification: {
            "@type": "PriceSpecification",
            priceCurrency: "USD",
            price: "Contact for pricing"
          }
        }
      ]
    }
  };

  return (
    <>
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      
      {/* Open Graph */}
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={companyName} />
      <meta property="og:locale" content={currentLanguage} />
      <meta property="og:image" content={`${baseUrl}/og-image.jpg`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@trojanenvoy" />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={`${baseUrl}/twitter-card.jpg`} />
      
      {/* Language alternates */}
      <link rel="canonical" href={fullUrl} />
      <link rel="alternate" hrefLang={currentLanguage} href={fullUrl} />
      <link rel="alternate" hrefLang="x-default" href={baseUrl} />
      
      {/* Keywords */}
      <meta name="keywords" content={t('seo.keywords')} />
      
      {/* Author and copyright */}
      <meta name="author" content={companyName} />
      <meta name="copyright" content={`© ${new Date().getFullYear()} ${companyName}`} />
      
      {/* Structured data */}
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(servicesSchema)}
      </script>
    </>
  );
}

export default SEO;