
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Eye, Clock, Tag, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { storageService } from "@/lib/storage";
import { ContentItem } from "@/lib/types";
import { formatDate } from "@/lib/utils";

interface ServiceDetailProps {
  service?: ContentItem; // Allow passing service directly
  className?: string;
}

const ServiceDetail: React.FC<ServiceDetailProps> = ({ service: serviceProp, className }) => {
  const { slug } = useParams<{ slug: string }>();
  const [service, setService] = useState<ContentItem | null>(serviceProp || null);

  useEffect(() => {
    if (!serviceProp && slug) {
      const fetchService = async () => {
        const services = await storageService.getContentByType("Service");
        const foundService = services.find((item) => item.slug === slug);
        setService(foundService || null);
      };
      
      fetchService();
    }
  }, [slug, serviceProp]);

  const renderSeoHeadingStructure = (seoHeadingStructure: any) => {
    if (!seoHeadingStructure) return null;

    return (
      <div className="space-y-6">
        {seoHeadingStructure.h1 && (
          <div>
            <h3 className="text-lg font-medium">H1</h3>
            <p className="text-muted-foreground">{seoHeadingStructure.h1}</p>
          </div>
        )}

        {seoHeadingStructure.h2 && seoHeadingStructure.h2.length > 0 && (
          <div>
            <h3 className="text-lg font-medium">H2</h3>
            <ul className="ml-6 list-disc text-muted-foreground">
              {seoHeadingStructure.h2.map((h2: string, idx: number) => (
                <li key={idx}>{h2}</li>
              ))}
            </ul>
          </div>
        )}

        {seoHeadingStructure.h3 && Object.keys(seoHeadingStructure.h3).length > 0 && (
          <div>
            <h3 className="text-lg font-medium">H3</h3>
            <div className="ml-6 space-y-4">
              {Object.entries(seoHeadingStructure.h3).map(([parent, h3Items]) => (
                <div key={parent}>
                  <p className="font-medium">{parent}</p>
                  <ul className="ml-6 list-disc text-muted-foreground">
                    {(h3Items as string[]).map((item: string, idx: number) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  if (!service) {
    return (
      <div className="container py-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Service Not Found</h2>
          <p className="text-muted-foreground">
            Sorry, the service you are looking for could not be found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <article className="space-y-6">
        <header className="space-y-2">
          <h1 className="text-4xl font-bold">{service.title}</h1>
          <p className="text-muted-foreground">{service.description}</p>
        </header>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm">
            <Eye className="h-4 w-4" />
            <span>1234 views</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Clock className="h-4 w-4" />
            <span>Updated {formatDate(service.lastUpdated)}</span>
          </div>
          {service.category && (
            <div className="flex items-center space-x-2 text-sm">
              <Tag className="h-4 w-4" />
              <span>{service.category}</span>
            </div>
          )}
        </div>

        <Separator />

        <Card>
          <CardContent>
            <div dangerouslySetInnerHTML={{ __html: service.content || "" }} />
          </CardContent>
        </Card>

        {service.seoKeywords && service.seoKeywords.length > 0 && (
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <p className="text-sm font-medium">SEO Keywords:</p>
            <div className="flex space-x-2">
              {service.seoKeywords.map((keyword, index) => (
                <Badge key={index}>{keyword}</Badge>
              ))}
            </div>
          </div>
        )}

        {service.seoHeadingStructure && (
          <Card>
            <CardContent>
              <h4 className="text-lg font-medium mb-4">SEO Heading Structure</h4>
              {renderSeoHeadingStructure(service.seoHeadingStructure)}
            </CardContent>
          </Card>
        )}

        <div className="flex justify-end space-x-2">
          {service.documents && service.documents.length > 0 && (
            <Button variant="secondary">
              <Download className="h-4 w-4 mr-2" />
              Download Brochure
            </Button>
          )}
          <Button asChild>
            <a href="/contact">Request a Quote</a>
          </Button>
        </div>
      </article>
    </div>
  );
};

export default ServiceDetail;
