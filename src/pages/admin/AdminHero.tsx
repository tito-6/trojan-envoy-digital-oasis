import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Edit, Plus, Save, Trash2, Eye } from 'lucide-react';
import { storageService } from '@/lib/storage';
import { ContentItem, PartnerLogo, TechIcon } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ColorPicker } from '@/components/admin/ColorPicker';

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

  const availableIcons = [
    'FaGoogle', 'FaFacebook', 'SiSemrush', 'FaAws', 'FaShopify', 'FaWordpress', 'FaAward',
    'FaReact', 'SiTypescript', 'FaVuejs', 'FaAngular', 'SiJavascript', 'FaNode', 'FaPython',
    'FaJava', 'FaPhp', 'SiKotlin', 'FaSwift', 'SiFlutter', 'SiFirebase', 'SiMongodb',
    'FaDatabase', 'SiGraphql', 'SiTailwindcss', 'FaDocker', 'FaAwsLogo', 'FaGithub',
    'SiNextdotjs', 'SiExpress', 'SiDjango', 'SiSpring', 'SiLaravel', 'SiRuby', 
    'SiDotnet', 'SiGo', 'SiRust', 'SiElixir', 'SiPostgresql', 'SiMysql', 'SiRedis', 
    'SiElasticsearch', 'SiKubernetes', 'SiTerraform', 'SiAmazon', 'SiGooglecloud', 
    'SiAzure', 'SiVercel', 'SiNetlify', 'SiHeroku', 'SiDigitalocean'
  ];

  const animationOptions = [
    { label: 'Float', value: 'animate-float' },
    { label: 'Pulse', value: 'animate-pulse-soft' },
    { label: 'Fade', value: 'animate-fade-in' },
    { label: 'Scale', value: 'animate-scale-in' },
    { label: 'None', value: '' }
  ];

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

  const handleSwitchChange = (checked: boolean, name: string) => {
    if (name === 'certified') {
      setCurrentPartnerLogo({ ...currentPartnerLogo, certified: checked });
    }
  };

  const handlePartnerLogoChange = (field: keyof PartnerLogo, value: string | boolean) => {
    setCurrentPartnerLogo({ ...currentPartnerLogo, [field]: value });
  };

  const handleTechIconChange = (field: keyof TechIcon, value: string) => {
    setCurrentTechIcon({ ...currentTechIcon, [field]: value });
  };

  const addPartnerLogo = () => {
    if (!currentPartnerLogo.name || !currentPartnerLogo.icon) {
      toast({
        title: "Missing information",
        description: "Please provide a name and select an icon for the partner logo.",
        variant: "destructive",
      });
      return;
    }

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
    if (!currentTechIcon.name || !currentTechIcon.icon) {
      toast({
        title: "Missing information",
        description: "Please provide a name and select an icon for the tech stack.",
        variant: "destructive",
      });
      return;
    }

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
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          name="title"
                          value={formData.title || ''}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="subtitle">Subtitle</Label>
                        <Input
                          id="subtitle"
                          name="subtitle"
                          value={formData.subtitle || ''}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={formData.description || ''}
                        onChange={handleInputChange}
                        rows={4}
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="ctaLabel">Primary Button Text</Label>
                        <Input
                          id="ctaLabel"
                          name="ctaLabel"
                          value={formData.ctaLabel || ''}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="ctaUrl">Primary Button URL</Label>
                        <Input
                          id="ctaUrl"
                          name="ctaUrl"
                          value={formData.ctaUrl || ''}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="secondaryCtaLabel">Secondary Button Text</Label>
                        <Input
                          id="secondaryCtaLabel"
                          name="secondaryCtaLabel"
                          value={formData.secondaryCtaLabel || ''}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="secondaryCtaUrl">Secondary Button URL</Label>
                        <Input
                          id="secondaryCtaUrl"
                          name="secondaryCtaUrl"
                          value={formData.secondaryCtaUrl || ''}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                  </div>
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
                    <div className="bg-secondary/20 p-4 rounded-lg mb-6">
                      <h3 className="text-lg font-medium mb-4">Add New Partner Logo</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <Label htmlFor="partnerName">Partner Name</Label>
                          <Input
                            id="partnerName"
                            value={currentPartnerLogo.name}
                            onChange={(e) => handlePartnerLogoChange('name', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="partnerIcon">Partner Icon</Label>
                          <Select 
                            value={currentPartnerLogo.icon} 
                            onValueChange={(value) => handlePartnerLogoChange('icon', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select an icon" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableIcons.map((icon) => (
                                <SelectItem key={icon} value={icon}>
                                  {icon}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <Label htmlFor="partnerColor">Icon Color</Label>
                          <Input
                            id="partnerColor"
                            type="color"
                            value={currentPartnerLogo.color}
                            onChange={(e) => handlePartnerLogoChange('color', e.target.value)}
                            className="h-10"
                          />
                        </div>
                        <div>
                          <Label htmlFor="partnerBgColor">Background Color</Label>
                          <Select 
                            value={currentPartnerLogo.bgColor} 
                            onValueChange={(value) => handlePartnerLogoChange('bgColor', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select background color" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="bg-blue-100">Blue</SelectItem>
                              <SelectItem value="bg-green-100">Green</SelectItem>
                              <SelectItem value="bg-yellow-100">Yellow</SelectItem>
                              <SelectItem value="bg-orange-100">Orange</SelectItem>
                              <SelectItem value="bg-red-100">Red</SelectItem>
                              <SelectItem value="bg-purple-100">Purple</SelectItem>
                              <SelectItem value="bg-pink-100">Pink</SelectItem>
                              <SelectItem value="bg-indigo-100">Indigo</SelectItem>
                              <SelectItem value="bg-gray-100">Gray</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 mb-4">
                        <Switch
                          id="certified"
                          checked={currentPartnerLogo.certified}
                          onCheckedChange={(checked) => handleSwitchChange(checked, 'certified')}
                        />
                        <Label htmlFor="certified">Certified Partner</Label>
                      </div>

                      <Button onClick={addPartnerLogo}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Partner Logo
                      </Button>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {partnerLogos.map((logo, index) => (
                      <Card key={index} className="overflow-hidden">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium">{logo.name}</h3>
                            {isEditing && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removePartnerLogo(index)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            )}
                          </div>
                          <div className="flex flex-col items-center justify-center p-4">
                            <div className={`w-12 h-12 rounded-full ${logo.bgColor} flex items-center justify-center mb-2`}>
                              <div style={{ color: logo.color }}>
                                {logo.icon}
                              </div>
                            </div>
                            {logo.certified && (
                              <div className="flex items-center text-green-600 mt-1">
                                <span className="text-xs uppercase font-bold">Certified</span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
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
                    <div className="bg-secondary/20 p-4 rounded-lg mb-6">
                      <h3 className="text-lg font-medium mb-4">Add New Tech Icon</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <Label htmlFor="techName">Technology Name</Label>
                          <Input
                            id="techName"
                            value={currentTechIcon.name}
                            onChange={(e) => handleTechIconChange('name', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="techIcon">Icon</Label>
                          <Select 
                            value={currentTechIcon.icon} 
                            onValueChange={(value) => handleTechIconChange('icon', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select an icon" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableIcons.map((icon) => (
                                <SelectItem key={icon} value={icon}>
                                  {icon}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <Label htmlFor="techColor">Icon Color</Label>
                          <Input
                            id="techColor"
                            type="color"
                            value={currentTechIcon.color}
                            onChange={(e) => handleTechIconChange('color', e.target.value)}
                            className="h-10"
                          />
                        </div>
                        <div>
                          <Label htmlFor="techAnimation">Animation</Label>
                          <Select 
                            value={currentTechIcon.animate} 
                            onValueChange={(value) => handleTechIconChange('animate', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select animation" />
                            </SelectTrigger>
                            <SelectContent>
                              {animationOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <Button onClick={addTechIcon}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Tech Icon
                      </Button>
                    </div>
                  )}

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {techIcons.map((tech, index) => (
                      <Card key={index} className="overflow-hidden">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium">{tech.name}</h3>
                            {isEditing && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeTechIcon(index)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            )}
                          </div>
                          <div className="flex flex-col items-center justify-center p-2">
                            <div className={`w-12 h-12 rounded-full bg-secondary/30 flex items-center justify-center mb-2`}>
                              <div style={{ color: tech.color }}>
                                {tech.icon}
                              </div>
                            </div>
                            <span className="text-xs animate">{tech.animate}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preview">
              <Card>
                <CardHeader>
                  <CardTitle>Hero Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center">
                    <Button onClick={() => window.open('/', '_blank')}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Live Hero
                    </Button>
                  </div>
                  <div className="mt-6 p-4 border rounded-lg bg-secondary/10">
                    <h2 className="text-2xl font-bold">{formData.title}</h2>
                    <p className="text-sm font-medium text-secondary-foreground mt-2">{formData.subtitle}</p>
                    <p className="mt-4 text-muted-foreground">{formData.description}</p>
                    
                    <div className="flex gap-4 mt-6">
                      {formData.ctaLabel && (
                        <Button>{formData.ctaLabel}</Button>
                      )}
                      {formData.secondaryCtaLabel && (
                        <Button variant="outline">{formData.secondaryCtaLabel}</Button>
                      )}
                    </div>
                    
                    <div className="mt-8">
                      <h3 className="text-sm font-medium mb-4">Partners ({partnerLogos.length})</h3>
                      <div className="flex flex-wrap gap-4">
                        {partnerLogos.map((logo, i) => (
                          <div key={i} className="text-center">
                            <div className={`w-10 h-10 rounded-full ${logo.bgColor} flex items-center justify-center`}>
                              <div style={{ color: logo.color }}>{logo.icon}</div>
                            </div>
                            <span className="text-xs block mt-1">{logo.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-8">
                      <h3 className="text-sm font-medium mb-4">Tech Stack ({techIcons.length})</h3>
                      <div className="flex flex-wrap gap-4">
                        {techIcons.map((tech, i) => (
                          <div key={i} className="text-center">
                            <div className="w-10 h-12 rounded-full bg-secondary/30 flex items-center justify-center">
                              <div style={{ color: tech.color }}>{tech.icon}</div>
                            </div>
                            <span className="text-xs block mt-1">{tech.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
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
