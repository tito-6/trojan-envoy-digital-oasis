import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, MessageCircle, Heart, Download, ZoomIn, ArrowRight, Instagram } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Photo {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  likes: number;
  comments: number;
  views: number;
  instagramUrl: string;
}

// Sample Instagram photos with more relevant images for each category
const photosData: Photo[] = [
  {
    id: "photo1",
    title: "Product Lifestyle Photography",
    description: "Professional product photography showcasing lifestyle context",
    imageUrl: "https://images.unsplash.com/photo-1583394838336-acd977736f90",
    category: "product",
    likes: 245,
    comments: 32,
    views: 1890,
    instagramUrl: "https://www.instagram.com/p/C30-qBZIu-0/"
  },
  {
    id: "photo2",
    title: "Fashion Editorial",
    description: "High-end fashion photography for magazine editorial",
    imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f",
    category: "fashion",
    likes: 534,
    comments: 47,
    views: 3210,
    instagramUrl: "https://www.instagram.com/p/C2drjzAIz0d/"
  },
  {
    id: "photo3",
    title: "Corporate Portrait",
    description: "Professional headshots and portraits for corporate clients",
    imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a",
    category: "corporate",
    likes: 187,
    comments: 21,
    views: 1450,
    instagramUrl: "https://www.instagram.com/p/Cxv3UxJIQZU/"
  },
  {
    id: "photo4",
    title: "Food Photography",
    description: "Appetizing food photography for restaurants and menus",
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
    category: "food",
    likes: 321,
    comments: 38,
    views: 2680,
    instagramUrl: "https://www.instagram.com/p/C5srsLNI5MY/"
  },
  {
    id: "photo5",
    title: "Real Estate Photography",
    description: "Professional real estate photography for property listings",
    imageUrl: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
    category: "real-estate",
    likes: 156,
    comments: 14,
    views: 1230,
    instagramUrl: "https://www.instagram.com/p/C5KbQXPsYjH/"
  },
  {
    id: "photo6",
    title: "Event Coverage",
    description: "Dynamic event photography capturing key moments",
    imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87",
    category: "event",
    likes: 287,
    comments: 29,
    views: 2140,
    instagramUrl: "https://www.instagram.com/p/CzNT0iEoLfR/"
  }
];

const PhotoCard: React.FC<{ photo: Photo; index: number }> = ({ photo, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card 
        className="overflow-hidden group relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardContent className="p-0">
          <div className="relative aspect-[4/3]">
            <img
              src={photo.imageUrl}
              alt={photo.title}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            />
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-4 space-y-4"
                >
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="secondary" size="sm" className="flex items-center gap-2">
                        <ZoomIn className="w-4 h-4" />
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <DialogHeader>
                        <DialogTitle>{photo.title}</DialogTitle>
                        <DialogDescription>{photo.description}</DialogDescription>
                      </DialogHeader>
                      <div className="aspect-[16/9] relative mt-4">
                        <img
                          src={photo.imageUrl}
                          alt={photo.title}
                          className="object-cover w-full h-full rounded-lg"
                        />
                      </div>
                      <div className="flex justify-between items-center mt-4">
                        <div className="flex gap-4">
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <Heart className="w-3 h-3" /> {photo.likes}
                          </Badge>
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <MessageCircle className="w-3 h-3" /> {photo.comments}
                          </Badge>
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <Eye className="w-3 h-3" /> {photo.views}
                          </Badge>
                        </div>
                        <a
                          href={photo.instagramUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          <Instagram className="w-4 h-4" />
                          View on Instagram
                        </a>
                      </div>
                    </DialogContent>
                  </Dialog>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="p-4">
            <h3 className="font-medium mb-1">{photo.title}</h3>
            <p className="text-sm text-muted-foreground">{photo.description}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const PortfolioPhotoSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  
  const filteredPhotos = activeCategory === "all"
    ? photosData
    : photosData.filter(photo => photo.category === activeCategory);

  return (
    <section className="py-24 bg-gradient-to-b from-secondary/10 to-background/80">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-primary">
              Photo Shooting
            </span>
            <span className="relative">
              <span className="absolute -bottom-2 left-0 w-full h-1 bg-primary/30 rounded-full"></span>
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Professional photography services that capture your vision perfectly.
            From product shoots to corporate portraits, we deliver stunning visuals.
          </p>
          
          <div className="flex items-center justify-center mt-6">
            <a 
              href="https://www.instagram.com/ibrahim_shrbatgii/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-2 text-sm bg-gradient-to-r from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white px-4 py-2 rounded-full hover:opacity-90 transition-opacity"
            >
              <Instagram size={16} className="fill-white" />
              Follow us on Instagram
            </a>
          </div>
        </motion.div>

        <Tabs defaultValue="all" className="w-full mb-10">
          <TabsList className="w-full max-w-3xl mx-auto flex flex-wrap justify-between bg-background/50 backdrop-blur border border-border p-1 rounded-full">
            <TabsTrigger 
              value="all" 
              className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full"
              onClick={() => setActiveCategory("all")}
            >
              All Photos
            </TabsTrigger>
            <TabsTrigger 
              value="product" 
              className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full"
              onClick={() => setActiveCategory("product")}
            >
              Product
            </TabsTrigger>
            <TabsTrigger 
              value="fashion" 
              className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full"
              onClick={() => setActiveCategory("fashion")}
            >
              Fashion
            </TabsTrigger>
            <TabsTrigger 
              value="corporate" 
              className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full"
              onClick={() => setActiveCategory("corporate")}
            >
              Corporate
            </TabsTrigger>
            <TabsTrigger 
              value="food" 
              className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full"
              onClick={() => setActiveCategory("food")}
            >
              Food
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="mt-10"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPhotos.map((photo, index) => (
                  <PhotoCard key={photo.id} photo={photo} index={index} />
                ))}
              </div>

              {filteredPhotos.length === 0 && (
                <div className="text-center py-20">
                  <p className="text-muted-foreground">No photos found in this category.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </Tabs>

        <motion.div 
          className="text-center mt-16 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="text-2xl font-display font-bold mb-4">Ready to enhance your visual content?</h3>
          <p className="text-muted-foreground mb-8">
            Our professional photography services transform your brand's visual identity with 
            high-quality images that tell your unique story and connect with your audience.
          </p>
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-purple-600 to-primary hover:opacity-90 transition-opacity group"
          >
            Book a Photo Session
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <ArrowRight className="ml-1 h-4 w-4" />
            </motion.span>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default PortfolioPhotoSection;
