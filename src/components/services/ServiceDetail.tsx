
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ExternalLink, FileText, Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/lib/i18n";
import { ContentItem } from "@/lib/types";
import { getIconComponentByName } from "@/lib/iconUtils";
import draftToHtml from 'draftjs-to-html';

// Custom hook for getting YouTube video ID
const useYouTubeVideoId = (url: string): string | null => {
  const [videoId, setVideoId] = useState<string | null>(null);
  
  React.useEffect(() => {
    if (!url) return;
    
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(youtubeRegex);
    
    if (match && match[1]) {
      setVideoId(match[1]);
    } else {
      setVideoId(null);
    }
  }, [url]);
  
  return videoId;
};

// Custom hook for getting Vimeo video ID
const useVimeoVideoId = (url: string): string | null => {
  const [videoId, setVideoId] = useState<string | null>(null);
  
  React.useEffect(() => {
    if (!url) return;
    
    const vimeoRegex = /vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|)(\d+)(?:$|\/|\?)/;
    const match = url.match(vimeoRegex);
    
    if (match && match[1]) {
      setVideoId(match[1]);
    } else {
      setVideoId(null);
    }
  }, [url]);
  
  return videoId;
};

interface ServiceDetailProps {
  service: ContentItem;
}

const ServiceDetail: React.FC<ServiceDetailProps> = ({ service }) => {
  const { t } = useLanguage();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState("");
  
  const IconComponent = service.iconName ? getIconComponentByName(service.iconName) : null;
  
  const renderContent = () => {
    // If there's formatted content, render it as HTML
    if (service.formattedContent) {
      try {
        const htmlContent = draftToHtml(service.formattedContent);
        return (
          <div className="prose prose-lg max-w-none">
            <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
          </div>
        );
      } catch (error) {
        console.error("Error rendering formatted content:", error);
      }
    }
    
    // Fallback to regular content with formatting
    if (service.content) {
      const paragraphs = service.content
        .split('\n')
        .filter(p => p.trim().length > 0);
      
      return (
        <div className="space-y-4">
          {paragraphs.map((paragraph, index) => {
            if (paragraph.startsWith('- ')) {
              // It's a list item
              return (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center mt-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  </div>
                  <span>{paragraph.substring(2)}</span>
                </div>
              );
            } else if (paragraph.startsWith('# ')) {
              // It's a heading
              return <h3 key={index} className="text-xl font-bold mt-6">{paragraph.substring(2)}</h3>;
            } else {
              // Regular paragraph
              return <p key={index}>{paragraph}</p>;
            }
          })}
        </div>
      );
    }
    
    // Fallback to just the description
    return <p>{service.description}</p>;
  };
  
  const openLightbox = (imageUrl: string) => {
    setLightboxImage(imageUrl);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };
  
  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = 'auto';
  };
  
  // SEO heading structure
  const renderHeadings = () => {
    if (!service.seoHeadingStructure) return null;
    
    return (
      <div className="mb-12 space-y-8">
        {service.seoHeadingStructure.h1 && (
          <h1 className="text-4xl font-bold">{service.seoHeadingStructure.h1}</h1>
        )}
        
        {service.seoHeadingStructure.h2 && service.seoHeadingStructure.h2.length > 0 && (
          <div className="space-y-4">
            {service.seoHeadingStructure.h2.map((heading, index) => (
              <h2 key={index} className="text-2xl font-semibold">{heading}</h2>
            ))}
          </div>
        )}
        
        {service.seoHeadingStructure.h3 && service.seoHeadingStructure.h3.length > 0 && (
          <div className="space-y-3">
            {service.seoHeadingStructure.h3.map((heading, index) => (
              <h3 key={index} className="text-xl font-medium">{heading}</h3>
            ))}
          </div>
        )}
      </div>
    );
  };
  
  const hasMedia = (service.images && service.images.length > 0) || 
                  (service.videos && service.videos.length > 0) || 
                  (service.documents && service.documents.length > 0);
                  
  return (
    <>
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-start max-w-4xl mx-auto">
            <Link to="/services" className="inline-flex items-center text-sm mb-8 hover:text-primary transition-colors">
              <ArrowLeft className="w-4 h-4 mr-1" />
              {t('back.to.services')}
            </Link>
            
            <div className="flex items-center mb-6 gap-4">
              {IconComponent && (
                <div 
                  className="w-16 h-16 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: service.bgColor || "#eff6ff", color: service.color || "#3b82f6" }}
                >
                  <IconComponent className="w-8 h-8" />
                </div>
              )}
              <h1 className="text-3xl md:text-4xl font-bold">{service.title}</h1>
            </div>
            
            {service.seoKeywords && service.seoKeywords.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {service.seoKeywords.map((keyword, index) => (
                  <Badge key={index} variant="secondary">{keyword}</Badge>
                ))}
              </div>
            )}
            
            <p className="text-lg text-muted-foreground mb-8">{service.description}</p>
          </div>
        </div>
      </section>
      
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className={`grid ${hasMedia ? 'grid-cols-1 lg:grid-cols-3 gap-12' : ''} max-w-6xl mx-auto`}>
            <div className={`${hasMedia ? 'lg:col-span-2' : 'max-w-4xl mx-auto w-full'} space-y-8`}>
              {renderHeadings()}
              
              <div className="prose-lg max-w-none">
                {renderContent()}
              </div>
            </div>
            
            {hasMedia && (
              <div className="space-y-8">
                {service.images && service.images.length > 0 && (
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-4">Gallery</h3>
                      
                      {/* Main image */}
                      <div className="mb-4 overflow-hidden rounded-lg cursor-pointer" onClick={() => service.images && openLightbox(service.images[activeImageIndex])}>
                        <img 
                          src={service.images[activeImageIndex]} 
                          alt={service.title} 
                          className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      
                      {/* Thumbnails */}
                      {service.images.length > 1 && (
                        <div className="grid grid-cols-4 gap-2">
                          {service.images.map((image, index) => (
                            <div 
                              key={index}
                              className={`rounded-md overflow-hidden cursor-pointer ${index === activeImageIndex ? 'ring-2 ring-primary' : ''}`}
                              onClick={() => setActiveImageIndex(index)}
                            >
                              <img 
                                src={image} 
                                alt={`${service.title} ${index + 1}`} 
                                className="w-full h-14 object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
                
                {service.videos && service.videos.length > 0 && (
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-4">Videos</h3>
                      
                      <div className="space-y-4">
                        {service.videos.map((video, index) => {
                          const youtubeId = useYouTubeVideoId(video);
                          const vimeoId = useVimeoVideoId(video);
                          
                          if (youtubeId) {
                            return (
                              <div key={index} className="rounded-lg overflow-hidden">
                                <iframe
                                  width="100%"
                                  height="200"
                                  src={`https://www.youtube.com/embed/${youtubeId}`}
                                  title={`YouTube video player ${index}`}
                                  frameBorder="0"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                ></iframe>
                              </div>
                            );
                          } else if (vimeoId) {
                            return (
                              <div key={index} className="rounded-lg overflow-hidden">
                                <iframe
                                  width="100%"
                                  height="200"
                                  src={`https://player.vimeo.com/video/${vimeoId}`}
                                  title={`Vimeo video player ${index}`}
                                  frameBorder="0"
                                  allow="autoplay; fullscreen; picture-in-picture"
                                  allowFullScreen
                                ></iframe>
                              </div>
                            );
                          }
                          
                          return (
                            <div key={index} className="flex items-center">
                              <a 
                                href={video} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 flex items-center"
                              >
                                <ExternalLink className="w-4 h-4 mr-2" />
                                {`Video ${index + 1}`}
                              </a>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                {service.documents && service.documents.length > 0 && (
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-4">Documents</h3>
                      
                      <div className="space-y-3">
                        {service.documents.map((doc, index) => {
                          const fileName = doc.split('/').pop() || `Document ${index + 1}`;
                          
                          return (
                            <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                              <div className="flex items-center">
                                <FileText className="w-5 h-5 mr-2 text-blue-500" />
                                <span className="text-sm font-medium">{fileName}</span>
                              </div>
                              <div className="flex space-x-2">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => window.open(doc, '_blank')}
                                >
                                  <ExternalLink className="w-4 h-4 mr-1.5" />
                                  View
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => {
                                    const link = document.createElement('a');
                                    link.href = doc;
                                    link.download = fileName;
                                    link.click();
                                  }}
                                >
                                  <Download className="w-4 h-4 mr-1.5" />
                                  Download
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Lightbox */}
      {lightboxOpen && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <div className="relative max-w-4xl max-h-[90vh] p-4">
            <img 
              src={lightboxImage} 
              alt="Enlarged view" 
              className="max-w-full max-h-[80vh] object-contain"
            />
            <button 
              className="absolute top-4 right-4 bg-black/50 text-white w-10 h-10 rounded-full flex items-center justify-center"
              onClick={closeLightbox}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ServiceDetail;
