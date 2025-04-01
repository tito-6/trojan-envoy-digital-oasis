
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Edit, Save } from 'lucide-react';
import { storageService } from '@/lib/storage';
import { ContentItem, PartnerLogo, TechIcon } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import {
  PartnerLogoForm,
  PartnerLogoGrid,
  TechIconForm,
  TechIconGrid,
  GeneralInfoForm,
  HeroPreview,
  AVAILABLE_ICONS,
  ANIMATION_OPTIONS
} from '@/components/admin/hero';

const AdminHero: React.FC = () => {
  const { toast } = useToast();
  const [heroContent, setHeroContent] = useState<ContentItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<ContentItem>>({});
  const [activeTab, setActiveTab] = useState('general');
  const [partnerLogos, setPartnerLogos] = useState<PartnerLogo[]>([]);
  const [techIcons, setTechIcons] = useState<TechIcon[]>([]);
  const [currentPartnerLogo, setCurrentPartnerLogo] = useState<Partial<PartnerLogo>>({
    name: '',
    icon: '',
    color: '#000000',
    bgColor: 'bg-blue-100',
    certified: false
  });
  const [currentTechIcon, setCurrentTechIcon] = useState<Partial<TechIcon>>({
    name: '',
    icon: '',
    color: '#000000',
    bgColor: 'bg-blue-100',
    animate: 'animate-float'
  });
  const [previewUpdated, setPreviewUpdated] = useState(false);

  useEffect(() => {
    loadHeroContent();
  }, []);

  const loadHeroContent = () => {
    const heroItems = storageService.getContentByType('Hero');
    if (heroItems.length > 0) {
      const hero = heroItems[0];
      setHeroContent(hero);
      setFormData({
        title: hero.title,
        subtitle: hero.subtitle,
        description: hero.description,
        ctaLabel: hero.ctaLabel,
        ctaUrl: hero.ctaUrl,
        secondaryCtaLabel: hero.secondaryCtaLabel,
        secondaryCtaUrl: hero.secondaryCtaUrl
      });
      setPartnerLogos(hero.partnerLogos || []);
      setTechIcons(hero.techIcons || []);
    } else {
      createDefaultHero();
    }
  };

  const createDefaultHero = async () => {
    const defaultHero: Partial<ContentItem> = {
      title: "Navigating the Digital Frontier",
      subtitle: "AWARD-WINNING AGENCY",
      description: "Empowering businesses with cutting-edge web solutions and strategic digital marketing to help you stand out in today's competitive landscape.",
      type: "Hero",
      published: true,
      ctaLabel: "Get Started",
      ctaUrl: "/contact",
      secondaryCtaLabel: "Our Services",
      secondaryCtaUrl: "/services",
      partnerLogos: [
        { 
          name: "Google", 
          icon: "FaGoogle", 
          color: "#4285F4",
          bgColor: "bg-blue-100",
          certified: true
        },
        { 
          name: "Meta", 
          icon: "FaFacebook", 
          color: "#1877F2",
          bgColor: "bg-blue-100",
          certified: true
        },
        { 
          name: "SEMrush", 
          icon: "SiSemrush", 
          color: "#5FB246",
          bgColor: "bg-green-100",
          certified: true
        },
        { 
          name: "AWS", 
          icon: "FaAws", 
          color: "#FF9900",
          bgColor: "bg-orange-100",
          certified: true
        },
        { 
          name: "Magento", 
          icon: "FaShopify", 
          color: "#7AB55C",
          bgColor: "bg-purple-100",
          certified: true
        },
        { 
          name: "WordPress", 
          icon: "FaWordpress", 
          color: "#21759B",
          bgColor: "bg-blue-100",
          certified: true
        }
      ],
      techIcons: [
        { icon: "FaReact", name: "React", color: "#61DAFB", animate: "animate-float" },
        { icon: "SiTypescript", name: "TypeScript", color: "#3178C6", animate: "animate-pulse-soft" },
        { icon: "FaVuejs", name: "Vue.js", color: "#4FC08D", animate: "animate-float" },
        { icon: "FaAngular", name: "Angular", color: "#DD0031", animate: "animate-pulse-soft" },
        { icon: "SiJavascript", name: "JavaScript", color: "#F7DF1E", animate: "animate-float" },
        { icon: "FaNode", name: "Node.js", color: "#339933", animate: "animate-pulse-soft" },
        { icon: "FaPython", name: "Python", color: "#3776AB", animate: "animate-float" },
        { icon: "FaJava", name: "Java", color: "#007396", animate: "animate-pulse-soft" },
        { icon: "FaPhp", name: "PHP", color: "#777BB4", animate: "animate-float" },
        { icon: "SiKotlin", name: "Kotlin", color: "#7F52FF", animate: "animate-pulse-soft" },
        { icon: "FaSwift", name: "Swift", color: "#FA7343", animate: "animate-float" },
        { icon: "SiFlutter", name: "Flutter", color: "#02569B", animate: "animate-pulse-soft" },
        { icon: "SiFirebase", name: "Firebase", color: "#FFCA28", animate: "animate-float" },
        { icon: "SiMongodb", name: "MongoDB", color: "#47A248", animate: "animate-pulse-soft" },
        { icon: "FaDatabase", name: "SQL", color: "#4479A1", animate: "animate-float" },
        { icon: "SiGraphql", name: "GraphQL", color: "#E10098", animate: "animate-pulse-soft" },
        { icon: "SiTailwindcss", name: "Tailwind", color: "#06B6D4", animate: "animate-float" },
        { icon: "FaDocker", name: "Docker", color: "#2496ED", animate: "animate-pulse-soft" },
        { icon: "FaAwsLogo", name: "AWS", color: "#FF9900", animate: "animate-float" },
        { icon: "FaGithub", name: "GitHub", color: "#181717", animate: "animate-pulse-soft" }
      ]
    };

    try {
      const newHero = storageService.addContent({
        title: defaultHero.title || "Hero Title",
        type: "Hero",
        description: defaultHero.description || "Hero description",
        published: true,
        partnerLogos: defaultHero.partnerLogos,
        techIcons: defaultHero.techIcons,
        ctaLabel: defaultHero.ctaLabel,
        ctaUrl: defaultHero.ctaUrl,
        secondaryCtaLabel: defaultHero.secondaryCtaLabel,
        secondaryCtaUrl: defaultHero.secondaryCtaUrl,
        subtitle: defaultHero.subtitle
      });
      
      setHeroContent(newHero);
      setFormData({
        title: newHero.title,
        subtitle: newHero.subtitle,
        description: newHero.description,
        ctaLabel: newHero.ctaLabel,
        ctaUrl: newHero.ctaUrl,
        secondaryCtaLabel: newHero.secondaryCtaLabel,
        secondaryCtaUrl: newHero.secondaryCtaUrl
      });
      setPartnerLogos(newHero.partnerLogos || []);
      setTechIcons(newHero.techIcons || []);
      
      toast({
        title: "Hero content created",
        description: "Default hero content has been created. You can now edit it.",
      });
    } catch (error) {
      toast({
        title: "Error creating hero content",
        description: "There was an error creating the default hero content.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePartnerLogoChange = (field: keyof PartnerLogo, value: string | boolean) => {
    setCurrentPartnerLogo({ ...currentPartnerLogo, [field]: value });
  };

  const handleTechIconChange = (field: keyof TechIcon, value: string) => {
    setCurrentTechIcon({ ...currentTechIcon, [field]: value });
  };

  const addPartnerLogo = () => {
    const newPartnerLogos = [...partnerLogos, currentPartnerLogo as PartnerLogo];
    setPartnerLogos(newPartnerLogos);
    setCurrentPartnerLogo({
      name: '',
      icon: '',
      color: '#000000',
      bgColor: 'bg-blue-100',
      certified: false
    });
  };

  const removePartnerLogo = (index: number) => {
    const newPartnerLogos = [...partnerLogos];
    newPartnerLogos.splice(index, 1);
    setPartnerLogos(newPartnerLogos);
  };

  const addTechIcon = () => {
    const newTechIcons = [...techIcons, currentTechIcon as TechIcon];
    setTechIcons(newTechIcons);
    setCurrentTechIcon({
      name: '',
      icon: '',
      color: '#000000',
      bgColor: 'bg-blue-100',
      animate: 'animate-float'
    });
  };

  const removeTechIcon = (index: number) => {
    const newTechIcons = [...techIcons];
    newTechIcons.splice(index, 1);
    setTechIcons(newTechIcons);
  };

  const handleSave = () => {
    if (!heroContent) return;

    const updatedHero: ContentItem = {
      ...heroContent,
      ...formData,
      partnerLogos,
      techIcons
    };

    try {
      const result = storageService.updateContent(heroContent.id, updatedHero);
      if (result) {
        setHeroContent(result);
        setIsEditing(false);
        toast({
          title: "Success",
          description: "Hero content has been updated successfully.",
        });
        setPreviewUpdated(!previewUpdated);
        storageService.dispatchEvent('content-updated', result);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error updating the hero content.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Hero Management</h1>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Hero Content
          </Button>
        ) : (
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        )}
      </div>

      {heroContent && (
        <div className="grid grid-cols-1 gap-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="partners">Partner Logos</TabsTrigger>
              <TabsTrigger value="techstack">Tech Stack</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle>General Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <GeneralInfoForm 
                    formData={formData} 
                    isEditing={isEditing} 
                    onChange={handleInputChange} 
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="partners">
              <Card>
                <CardHeader>
                  <CardTitle>Partner Logos</CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing && (
                    <PartnerLogoForm
                      currentPartnerLogo={currentPartnerLogo}
                      onPartnerLogoChange={handlePartnerLogoChange}
                      onAddPartnerLogo={addPartnerLogo}
                      availableIcons={AVAILABLE_ICONS}
                    />
                  )}

                  <PartnerLogoGrid
                    partnerLogos={partnerLogos}
                    isEditing={isEditing}
                    onRemovePartnerLogo={removePartnerLogo}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="techstack">
              <Card>
                <CardHeader>
                  <CardTitle>Tech Stack Icons</CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing && (
                    <TechIconForm
                      currentTechIcon={currentTechIcon}
                      onTechIconChange={handleTechIconChange}
                      onAddTechIcon={addTechIcon}
                      availableIcons={AVAILABLE_ICONS}
                      animationOptions={ANIMATION_OPTIONS}
                    />
                  )}

                  <TechIconGrid
                    techIcons={techIcons}
                    isEditing={isEditing}
                    onRemoveTechIcon={removeTechIcon}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preview">
              <Card>
                <CardHeader>
                  <CardTitle>Hero Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <HeroPreview
                    formData={formData}
                    partnerLogos={partnerLogos}
                    techIcons={techIcons}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default AdminHero;
