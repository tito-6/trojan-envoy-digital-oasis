
import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  category: string;
}

const videosData: Video[] = [
  {
    id: "vid1",
    title: "Digital Transformation Strategy",
    description: "Learn how businesses are adapting to the digital age with innovative strategies.",
    thumbnail: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81",
    videoUrl: "https://www.youtube.com/watch?v=mz1alBZBdTU",
    category: "business"
  },
  {
    id: "vid2",
    title: "Creative Video Production",
    description: "Explore our creative process for producing engaging video content.",
    thumbnail: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    videoUrl: "https://www.youtube.com/watch?v=XgNpc-KTQnA",
    category: "creative"
  },
  {
    id: "vid3",
    title: "Marketing Technology Insights",
    description: "Discover the latest technology trends driving marketing success.",
    thumbnail: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    videoUrl: "https://www.youtube.com/watch?v=IClwy-P1rOw",
    category: "marketing"
  }
];

// Helper function to get YouTube video ID from URL
const getYoutubeVideoId = (url: string) => {
  const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : "";
};

// Custom YouTube player component with controls
const VideoPlayer: React.FC<{ video: Video }> = ({ video }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(75);
  const [isHovering, setIsHovering] = useState(false);
  const videoId = getYoutubeVideoId(video.videoUrl);
  const playerRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let progressInterval: NodeJS.Timeout;
    
    if (isPlaying) {
      progressInterval = setInterval(() => {
        setProgress((prev) => (prev < 100 ? prev + 0.5 : 0));
      }, 1000);
    }
    
    return () => clearInterval(progressInterval);
  }, [isPlaying]);

  const handlePlay = () => {
    if (playerRef.current) {
      const iframe = playerRef.current;
      const message = isPlaying
        ? JSON.stringify({ event: "command", func: "pauseVideo" })
        : JSON.stringify({ event: "command", func: "playVideo" });
      
      iframe.contentWindow?.postMessage(message, "*");
      setIsPlaying(!isPlaying);
    }
  };

  const handleMute = () => {
    if (playerRef.current) {
      const iframe = playerRef.current;
      const message = isMuted
        ? JSON.stringify({ event: "command", func: "unMute" })
        : JSON.stringify({ event: "command", func: "mute" });
      
      iframe.contentWindow?.postMessage(message, "*");
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    if (playerRef.current) {
      const iframe = playerRef.current;
      const message = JSON.stringify({ 
        event: "command", 
        func: "setVolume", 
        args: [value[0]] 
      });
      
      iframe.contentWindow?.postMessage(message, "*");
    }
  };

  const handleFullscreen = () => {
    if (containerRef.current) {
      if (!isFullscreen) {
        if (containerRef.current.requestFullscreen) {
          containerRef.current.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
      setIsFullscreen(!isFullscreen);
    }
  };

  return (
    <motion.div 
      ref={containerRef}
      className="relative overflow-hidden rounded-xl border border-border shadow-xl bg-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="aspect-video relative">
        <iframe
          ref={playerRef}
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&controls=0&modestbranding=1&rel=0&showinfo=0`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          className="absolute inset-0"
        />
        
        <motion.div 
          className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity duration-300"
          animate={{ opacity: isHovering ? 1 : 0 }}
        >
          {/* Custom video controls */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3">
            {/* Play/Pause button */}
            <motion.button
              className="rounded-full bg-white/20 p-2 backdrop-blur-md hover:bg-white/30 transition-colors"
              onClick={handlePlay}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {isPlaying ? (
                <Pause className="h-5 w-5 text-white" />
              ) : (
                <Play className="h-5 w-5 text-white" />
              )}
            </motion.button>
            
            {/* Progress bar */}
            <div className="flex-1 h-1 rounded-full bg-white/30 overflow-hidden">
              <div 
                className="h-full bg-primary" 
                style={{ width: `${progress}%` }}
              />
            </div>
            
            {/* Volume control */}
            <div className="relative group">
              <motion.button
                className="rounded-full bg-white/20 p-2 backdrop-blur-md hover:bg-white/30 transition-colors"
                onClick={handleMute}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {isMuted ? (
                  <VolumeX className="h-5 w-5 text-white" />
                ) : (
                  <Volume2 className="h-5 w-5 text-white" />
                )}
              </motion.button>
              
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity w-24 bg-black/80 p-2 rounded-lg">
                <Slider
                  value={[volume]}
                  min={0}
                  max={100}
                  step={1}
                  className="h-2"
                  onValueChange={handleVolumeChange}
                />
              </div>
            </div>
            
            {/* Fullscreen button */}
            <motion.button
              className="rounded-full bg-white/20 p-2 backdrop-blur-md hover:bg-white/30 transition-colors"
              onClick={handleFullscreen}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {isFullscreen ? (
                <Minimize className="h-5 w-5 text-white" />
              ) : (
                <Maximize className="h-5 w-5 text-white" />
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>
      
      <div className="p-5">
        <h3 className="text-xl font-display font-bold mb-2">{video.title}</h3>
        <p className="text-muted-foreground text-sm">{video.description}</p>
      </div>
    </motion.div>
  );
};

const PortfolioVideoSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  
  const filteredVideos = activeCategory === "all" 
    ? videosData 
    : videosData.filter(video => video.category === activeCategory);

  return (
    <section className="py-24 bg-gradient-to-b from-background to-secondary/10">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
              Video Production
            </span>
            <span className="relative">
              <span className="absolute -bottom-2 left-0 w-full h-1 bg-primary/30 rounded-full"></span>
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Compelling storytelling through professional video production. 
            Browse our showcase of high-quality video work for various industries and purposes.
          </p>
        </motion.div>

        <Tabs defaultValue="all" className="w-full mb-10">
          <TabsList className="w-full max-w-md mx-auto flex justify-between bg-background/50 backdrop-blur border border-border p-1 rounded-full">
            <TabsTrigger 
              value="all" 
              className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full"
              onClick={() => setActiveCategory("all")}
            >
              All Videos
            </TabsTrigger>
            <TabsTrigger 
              value="business" 
              className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full"
              onClick={() => setActiveCategory("business")}
            >
              Business
            </TabsTrigger>
            <TabsTrigger 
              value="creative" 
              className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full"
              onClick={() => setActiveCategory("creative")}
            >
              Creative
            </TabsTrigger>
            <TabsTrigger 
              value="marketing" 
              className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full"
              onClick={() => setActiveCategory("marketing")}
            >
              Marketing
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredVideos.map((video, index) => (
                <VideoPlayer key={video.id} video={video} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="business" className="mt-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredVideos.map((video, index) => (
                <VideoPlayer key={video.id} video={video} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="creative" className="mt-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredVideos.map((video, index) => (
                <VideoPlayer key={video.id} video={video} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="marketing" className="mt-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredVideos.map((video, index) => (
                <VideoPlayer key={video.id} video={video} />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="text-center mt-12">
          <Button size="lg" className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 transition-opacity">
            Request Custom Video Production
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PortfolioVideoSection;
