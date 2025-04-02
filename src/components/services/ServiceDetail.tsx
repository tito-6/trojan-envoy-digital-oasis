
import React, { useState } from 'react';
import { ArrowRight, Check, ChevronRight, ExternalLink, FileText, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n';
import { ContentItem } from '@/lib/types';
import { iconLibrary } from '@/lib/iconUtils';

interface ServiceDetailProps {
  service: ContentItem;
}

export function ServiceDetail({ service }: ServiceDetailProps) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');

  if (!service) {
    return (
      <div className="container py-20 text-center">
        <p className="text-muted-foreground">{t('services.notFound')}</p>
      </div>
    );
  }

  // Get the icon component if it exists
  const IconComponent = service.iconName ? iconLibrary[service.iconName as keyof typeof iconLibrary] || null : null;

  // Process the document sections
  const sections = [
    { id: 'overview', label: t('services.overview'), content: service.description },
    { id: 'features', label: t('services.features'), content: service.content },
  ];

  // Check if we have videos or documents
  const hasMedia = (service.videos && service.videos.length > 0) || 
                   (service.documents && service.documents.length > 0);

  if (hasMedia) {
    sections.push({ 
      id: 'resources', 
      label: t('services.resources'), 
      content: t('services.resourcesDescription')
    });
  }

  return (
    <div className="container py-10 md:py-16">
      <div className="grid md:grid-cols-3 gap-12">
        <div className="md:col-span-2 space-y-8">
          <div>
            <div className="flex items-center space-x-2 text-muted-foreground mb-4">
              <a href="/" className="hover:text-foreground transition-colors">
                {t('nav.home')}
              </a>
              <ChevronRight className="h-4 w-4" />
              <a href="/services" className="hover:text-foreground transition-colors">
                {t('nav.services')}
              </a>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground">{service.title}</span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              {service.title}
            </h1>

            {/* Icon with title for mobile */}
            <div className="flex items-center md:hidden mb-4">
              {IconComponent && (
                <div
                  className={cn(
                    "mr-3 p-2 rounded-full",
                    service.bgColor ? `bg-[${service.bgColor}]` : "bg-primary/10",
                    service.color ? `text-[${service.color}]` : "text-primary"
                  )}
                >
                  <IconComponent className="h-6 w-6" />
                </div>
              )}
            </div>

            {/* Overview/Description */}
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-xl text-muted-foreground mb-6">
                {service.description}
              </p>
            </div>
          </div>

          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6">
              {sections.map(section => (
                <TabsTrigger key={section.id} value={section.id}>
                  {section.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {service.formattedContent ? (
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  {typeof service.formattedContent === 'string' ? (
                    <div dangerouslySetInnerHTML={{ __html: service.formattedContent }} />
                  ) : (
                    <p>{t('services.noContent')}</p>
                  )}
                </div>
              ) : service.htmlContent ? (
                <div 
                  className="prose prose-slate dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: service.htmlContent }} 
                />
              ) : service.content ? (
                <div 
                  className="prose prose-slate dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: service.content }} 
                />
              ) : (
                <p className="text-muted-foreground">{t('services.noContent')}</p>
              )}

              {/* SEO headings rendering if they exist */}
              {service.seoHeadingStructure && (
                <div className="mt-12 space-y-10">
                  {service.seoHeadingStructure.h2 && service.seoHeadingStructure.h2.length > 0 && 
                    service.seoHeadingStructure.h2.map((heading, idx) => (
                      <div key={idx} className="space-y-4">
                        <h2 className="text-2xl font-bold tracking-tight">{heading}</h2>
                        
                        {service.seoHeadingStructure && 
                         service.seoHeadingStructure.h3 && 
                         service.seoHeadingStructure.h3[heading] && (
                          <div className="space-y-3 ml-4">
                            {typeof service.seoHeadingStructure.h3[heading] === 'object' && 
                             Array.isArray(service.seoHeadingStructure.h3[heading]) && 
                             service.seoHeadingStructure.h3[heading].map((subheading, subIdx) => (
                              <div key={subIdx} className="flex items-start">
                                <Check className="h-5 w-5 text-primary mr-2 mt-1 flex-shrink-0" />
                                <p>{subheading}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="features" className="space-y-6">
              <div 
                className="prose prose-slate dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: service.content || '' }} 
              />
            </TabsContent>

            {hasMedia && (
              <TabsContent value="resources" className="space-y-10">
                {service.videos && service.videos.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4">{t('services.videoResources')}</h3>
                    <div className="grid gap-6 md:grid-cols-2">
                      {service.videos.map((video, idx) => (
                        <div key={idx} className="bg-secondary/30 rounded-lg overflow-hidden border border-border">
                          <div className="aspect-video relative">
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Button className="rounded-full" size="icon">
                                <Play className="h-6 w-6" />
                              </Button>
                            </div>
                            <div className="p-4 bg-background">
                              <h4 className="font-medium line-clamp-1">{t('services.videoTitle', { number: idx + 1 })}</h4>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {service.documents && service.documents.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4">{t('services.documentResources')}</h3>
                    <div className="space-y-3">
                      {service.documents.map((doc, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg border border-border">
                          <div className="flex items-center">
                            <FileText className="h-5 w-5 text-primary mr-3" />
                            <span>{doc.split('/').pop() || `${t('services.document')} ${idx + 1}`}</span>
                          </div>
                          <Button size="sm" variant="outline">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            {t('services.download')}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>
            )}
          </Tabs>
        </div>

        <div>
          <div className="bg-card rounded-lg border p-6 sticky top-24">
            {/* Icon with title for desktop */}
            <div className="hidden md:flex items-center mb-6">
              {IconComponent && (
                <div
                  className={cn(
                    "mr-3 p-2 rounded-full",
                    service.bgColor ? `bg-[${service.bgColor}]` : "bg-primary/10",
                    service.color ? `text-[${service.color}]` : "text-primary"
                  )}
                >
                  <IconComponent className="h-6 w-6" />
                </div>
              )}
              <h3 className="text-xl font-semibold">{service.title}</h3>
            </div>

            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                <span>{t('services.benefit1')}</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                <span>{t('services.benefit2')}</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                <span>{t('services.benefit3')}</span>
              </li>
            </ul>

            <Separator className="my-6" />
            
            <div className="mb-6">
              <Button className="w-full">
                {t('services.getStarted')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          
            <p className="text-sm text-muted-foreground">
              {t('services.updatedLabel')}: {formatDate(service.lastUpdated)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
