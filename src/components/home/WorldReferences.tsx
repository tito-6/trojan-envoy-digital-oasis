import React, { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Globe, MapPin, Building } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/lib/i18n";
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

// Company reference type
interface CompanyReference {
  id: string;
  name: string;
  location: string;
  coordinates: [number, number]; // [latitude, longitude]
  description: string;
  industry: string;
  logo?: string;
}

// Company references data
const companyReferences: CompanyReference[] = [
  {
    id: "remax",
    name: "Remax Müjde - Tuba İşler",
    location: "Gürsel, Namzet Sok. No:15 K:5 D:9, 34400, 34413 Kağıthane/İstanbul",
    coordinates: [41.0719, 28.9850], // Kağıthane coordinates
    description: "Leading real estate company specializing in premium properties across Istanbul",
    industry: "Real Estate",
    logo: "/images/references/remaxmujdelogo-removebg-preview.png"
  },
  {
    id: "roshex",
    name: "Roshex UK",
    location: "London, United Kingdom",
    coordinates: [51.5074, -0.1278],
    description: "Financial services and consulting firm providing innovative solutions",
    industry: "Financial Services",
    logo: "/images/references/roshex-removebg-preview.png"
  },
  {
    id: "granad",
    name: "GRANAD PROPERTIES LLC",
    location: "Dubai, UAE",
    coordinates: [25.2048, 55.2708],
    description: "Luxury real estate development and property management in Dubai",
    industry: "Real Estate",
    logo: "/images/references/granada-removebg-preview.png"
  },
  {
    id: "hhrealty",
    name: "HH REALTY VISION",
    location: "Dubai, UAE",
    coordinates: [25.2697, 55.3047],
    description: "Premium property consultancy specializing in high-end real estate",
    industry: "Real Estate",
    logo: "/images/references/hhrealty-removebg-preview.png"
  },
  {
    id: "queen",
    name: "QUEEN TEAM PROPERTIES",
    location: "Gürsel, Namzet Sok. No:15 K:5 D:9, 34400, 34413 Kağıthane/İstanbul",
    coordinates: [41.0719, 28.9850], // Kağıthane coordinates
    description: "Boutique real estate agency offering personalized property services",
    industry: "Real Estate",
    logo: "/images/references/queenlogo-removebg-preview.png"
  },
  {
    id: "bonjour",
    name: "BONJOUR TEKSTILE",
    location: "Güngören, Istanbul, Turkey",
    coordinates: [41.0191, 28.8869], // Güngören coordinates
    description: "Premium textile manufacturer and exporter with global reach",
    industry: "Textile Manufacturing",
    logo: "/images/references/bonjour-removebg-preview.png"
  }
];

// Custom marker icon
const customIcon = new L.Icon({
  iconUrl: '/images/references/markers/marker-icon.png',
  iconRetinaUrl: '/images/references/markers/marker-icon-2x.png',
  shadowUrl: '/images/references/markers/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Reference card component
const ReferenceCard = ({ reference }: { reference: CompanyReference }) => {
  // Determine if the logo needs a light background in dark mode
  const needsLightBg = reference.id === 'hhrealty' || reference.id === 'bonjour';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="bg-card border border-border rounded-lg p-4 hover:border-primary/20 transition-colors flex-[0_0_85%] min-w-0 mx-2"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-medium text-base">{reference.name}</h3>
          <div className="flex items-center text-sm text-muted-foreground mt-1">
            <MapPin className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
            <span className="line-clamp-2">{reference.location}</span>
          </div>
        </div>
        {reference.logo ? (
          <div className={`w-16 h-16 ml-4 flex-shrink-0 flex items-center justify-center rounded-lg ${
            needsLightBg ? 'dark:bg-white/90 dark:p-2' : ''
          }`}>
            <img 
              src={reference.logo} 
              alt={`${reference.name} logo`}
              className="w-full h-full object-contain"
            />
          </div>
        ) : (
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
            <Building className="w-5 h-5" />
          </div>
        )}
      </div>
      
      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{reference.description}</p>
      
      <div className="flex items-center">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
          {reference.industry}
        </span>
      </div>
    </motion.div>
  );
};

const PartnersCarousel = () => {
  const [emblaRef] = useEmblaCarousel({ 
    loop: true,
    align: 'start',
    skipSnaps: false
  }, [
    Autoplay({ 
      delay: 4000,
      stopOnInteraction: false 
    })
  ]);

  return (
    <div className="mt-12 md:hidden">
      <h3 className="text-xl font-semibold mb-6">Our Global Partners</h3>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {companyReferences.map((reference) => (
            <ReferenceCard key={reference.id} reference={reference} />
          ))}
        </div>
      </div>
    </div>
  );
};

// Main component
const WorldReferences = () => {
  const { t } = useLanguage();
  const sectionRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section ref={sectionRef} className="py-16 md:py-24 lg:py-32 relative overflow-hidden bg-gradient-to-b from-background via-background/95 to-background">
      <motion.div
        className="absolute inset-0 -z-10"
        style={{ opacity, y: backgroundY }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      </motion.div>

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-2xl mx-auto mb-12 md:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Globe className="w-4 h-4" />
            <span>Global References</span>
          </div>
          
          <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-display font-bold mb-4">
            Trusted by <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">Companies Worldwide</span>
          </h2>
          
          <p className="text-muted-foreground text-base lg:text-lg">
            Our global network of partners and clients spans multiple industries and continents, delivering excellence at every location.
          </p>
        </motion.div>
        
        <Card className="relative h-[500px] md:h-[600px] lg:h-[700px] w-full overflow-hidden">
          <MapContainer
            center={[30, 20]}
            zoom={3}
            className="h-full w-full rounded-lg z-10"
            scrollWheelZoom={true}
            style={{ background: '#1a1a1a' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            {companyReferences.map((reference) => (
              <Marker
                key={reference.id}
                position={reference.coordinates}
                icon={customIcon}
              >
                <Popup>
                  <div className="p-3">
                    <h3 className="font-medium text-base mb-1">{reference.name}</h3>
                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                      <MapPin className="w-3.5 h-3.5 mr-1" />
                      <span>{reference.location}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{reference.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        {reference.industry}
                      </span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </Card>
        
        {/* Mobile Partners Auto-Slider */}
        <PartnersCarousel />
      </div>
    </section>
  );
};

export default WorldReferences;