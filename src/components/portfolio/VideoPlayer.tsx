import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, Maximize2, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoPlayerProps {
  videos: {
    id: string;
    title: string;
    description: string;
    url: string;
    thumbnail: string;
  }[];
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videos }) => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const currentVideo = videos[currentVideoIndex];

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(progress);
    }
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressBarRef.current && videoRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = (x / rect.width) * 100;
      const time = (percentage / 100) * videoRef.current.duration;
      videoRef.current.currentTime = time;
    }
  };

  const togglePlay = () => setIsPlaying(!isPlaying);
  const toggleMute = () => setIsMuted(!isMuted);
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setVolume(value);
    setIsMuted(value === 0);
  };

  const nextVideo = () => {
    setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
    setIsPlaying(false);
  };

  const prevVideo = () => {
    setCurrentVideoIndex((prev) => (prev === 0 ? videos.length - 1 : prev - 1));
    setIsPlaying(false);
  };

  return (
    <div className="relative group w-full max-w-4xl mx-auto">
      <div 
        className="relative aspect-video rounded-xl overflow-hidden bg-background/5 backdrop-blur-sm"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        {/* Video element */}
        <video
          ref={videoRef}
          src={currentVideo.url}
          className="w-full h-full object-cover"
          onTimeUpdate={handleTimeUpdate}
          onEnded={nextVideo}
          muted={isMuted}
          playsInline
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Video controls */}
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex flex-col justify-end p-4 space-y-4"
            >
              {/* Title and description */}
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">{currentVideo.title}</h3>
                <p className="text-sm text-white/80">{currentVideo.description}</p>
              </div>

              {/* Progress bar */}
              <div
                ref={progressBarRef}
                className="w-full h-1 bg-white/20 rounded-full cursor-pointer"
                onClick={handleProgressBarClick}
              >
                <div
                  className="h-full bg-primary rounded-full relative"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full transform scale-0 group-hover:scale-100 transition-transform" />
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Play/Pause button */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={togglePlay}
                    className="w-10 h-10 rounded-full bg-primary/90 flex items-center justify-center text-white"
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </motion.button>

                  {/* Volume control */}
                  <div className="flex items-center gap-2">
                    <button onClick={toggleMute}>
                      {isMuted ? (
                        <VolumeX className="w-5 h-5 text-white" />
                      ) : (
                        <Volume2 className="w-5 h-5 text-white" />
                      )}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={volume}
                      onChange={handleVolumeChange}
                      className="w-20 accent-primary"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Navigation buttons */}
                  <button
                    onClick={prevVideo}
                    className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={nextVideo}
                    className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  {/* Fullscreen button */}
                  <button
                    onClick={() => videoRef.current?.requestFullscreen()}
                    className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const videoData = [
  {
    id: "1",
    title: "Epic Product Showcase",
    description: "Cinematic product reveal with stunning visual effects",
    url: "https://www.youtube.com/watch?v=mz1alBZBdTU",
    thumbnail: "https://img.youtube.com/vi/mz1alBZBdTU/maxresdefault.jpg"
  },
  {
    id: "2",
    title: "Brand Story Documentary",
    description: "Emotional storytelling through compelling visuals",
    url: "https://www.youtube.com/watch?v=XgNpc-KTQnA",
    thumbnail: "https://img.youtube.com/vi/XgNpc-KTQnA/maxresdefault.jpg"
  },
  {
    id: "3",
    title: "Creative Commercial",
    description: "Innovative advertising that captures attention",
    url: "https://www.youtube.com/watch?v=IClwy-P1rOw",
    thumbnail: "https://img.youtube.com/vi/IClwy-P1rOw/maxresdefault.jpg"
  }
];

export { VideoPlayer, videoData };