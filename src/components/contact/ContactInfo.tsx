
import React from "react";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/lib/i18n";

interface ContactInfoCardProps {
  icon: React.ReactNode;
  title: string;
  details: string[];
}

const ContactInfoCard: React.FC<ContactInfoCardProps> = ({ icon, title, details }) => {
  return (
    <Card className="hover:border-primary/50 transition-all duration-300">
      <CardContent className="p-6 flex flex-col items-center text-center">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          {icon}
        </div>
        <h3 className="text-lg font-display font-bold mb-3">{title}</h3>
        <div className="space-y-1">
          {details.map((detail, index) => (
            <p key={index} className="text-muted-foreground text-sm">
              {detail}
            </p>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const ContactInfo: React.FC = () => {
  const { t } = useLanguage();
  
  const contactItems = [
    {
      icon: <MapPin className="w-5 h-5 text-primary" />,
      title: "Our Location",
      details: [
        "123 Innovation Drive",
        "San Francisco, CA 94103",
        "United States"
      ]
    },
    {
      icon: <Mail className="w-5 h-5 text-primary" />,
      title: "Email Us",
      details: [
        "info@trojan-envoy.com",
        "support@trojan-envoy.com",
        "careers@trojan-envoy.com"
      ]
    },
    {
      icon: <Phone className="w-5 h-5 text-primary" />,
      title: "Call Us",
      details: [
        "+1 (555) 123-4567",
        "+1 (555) 987-6543"
      ]
    },
    {
      icon: <Clock className="w-5 h-5 text-primary" />,
      title: "Working Hours",
      details: [
        "Monday - Friday: 9AM - 6PM",
        "Saturday: 10AM - 4PM",
        "Sunday: Closed"
      ]
    }
  ];

  return (
    <div className="should-animate">
      <h2 className="text-2xl md:text-3xl font-display font-bold mb-8">
        Contact Information
      </h2>
      
      <div className="space-y-6">
        {contactItems.map((item) => (
          <ContactInfoCard key={item.title} {...item} />
        ))}
      </div>
      
      <Card className="mt-8 overflow-hidden">
        <div className="h-64 bg-secondary flex items-center justify-center">
          <span className="text-muted-foreground">Map will appear here</span>
        </div>
      </Card>
    </div>
  );
};

export default ContactInfo;
