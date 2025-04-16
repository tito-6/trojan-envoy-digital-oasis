// Enhanced AI Tools Page with mindblowing graphics inside the cards
import React, { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { useLanguage } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Sparkles, Bot, FileSearch, Gauge, Clock, Brain, Zap, BarChart, LineChart, 
  PieChart, ScreenShare, Code, MessageSquare, HeartHandshake, Lock, Database, 
  Star, ArrowRight, ChevronRight, ChevronDown, CheckCircle, LightbulbIcon,
  Fingerprint, Layers, Rocket, Shield, Laptop
} from "lucide-react";

// 3D Tool Card Component with Enhanced Graphics
const ToolCard = ({ 
  title, 
  description, 
  icon: Icon, 
  features = [], 
  status = "coming-soon", 
  accentColor = "from-blue-500 to-purple-600" 
}) => {
  const [ref, isVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative"
    >
      <div 
        className="absolute -inset-0.5 bg-gradient-to-r rounded-2xl blur opacity-30 group-hover:opacity-70 transition duration-300"
        style={{ backgroundImage: `linear-gradient(to right, ${accentColor.split(" ")[0].replace("from-", "")}, ${accentColor.split(" ")[1].replace("to-", "")})` }} 
      />
      
      <Card className="relative backdrop-blur-sm border border-white/20 dark:border-white/10 bg-white/80 dark:bg-black/80 overflow-hidden rounded-xl h-full flex flex-col">
        <div 
          className="absolute top-0 right-0 h-36 w-36 -mr-16 -mt-16 bg-gradient-to-br opacity-20 rounded-full blur-2xl" 
          style={{ backgroundImage: `linear-gradient(to right, ${accentColor.split(" ")[0].replace("from-", "")}, ${accentColor.split(" ")[1].replace("to-", "")})` }} 
        />
        
        <CardHeader className="pb-2">
          <div 
            className="mb-3 w-12 h-12 rounded-xl bg-gradient-to-br shadow-lg flex items-center justify-center text-white"
            style={{ backgroundImage: `linear-gradient(to right, ${accentColor.split(" ")[0].replace("from-", "")}, ${accentColor.split(" ")[1].replace("to-", "")})` }}
          >
            <Icon className="w-6 h-6" />
          </div>
          <CardTitle className="text-xl font-display">{title}</CardTitle>
          <CardDescription className="line-clamp-2">{description}</CardDescription>
        </CardHeader>
        
        <CardContent className="pt-2 flex-grow flex flex-col">
          <ul className="space-y-1 mb-5 text-sm">
            {features.map((feature, i) => (
              <li key={i} className="flex items-start">
                <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-emerald-500" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          
          <div className="h-44 relative rounded-md border border-border bg-muted/30 flex items-center justify-center overflow-hidden mt-auto">
            {status === "coming-soon" && (
              <div className="absolute inset-0 backdrop-blur-sm bg-background/70 flex flex-col items-center justify-center gap-2 z-10">
                <div className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                  Coming Soon
                </div>
                <Clock className="w-8 h-8 text-muted-foreground animate-pulse mt-2" />
              </div>
            )}
            
            <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
              {/* Enhanced Tool Preview Animation */}
              <motion.div 
                className="absolute inset-0 flex items-center justify-center"
                initial={false}
                animate={isHovered ? { opacity: 1, scale: 1.05 } : { opacity: 0.8, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                {/* Website Analyzer Visualization */}
                {title === "Website Analyzer" && (
                  <div className="w-full h-full flex items-center justify-center p-2">
                    <div className="w-full h-full relative rounded-md overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 p-2">
                      {/* Browser mockup */}
                      <div className="w-full h-6 bg-slate-700 rounded-t-md flex items-center px-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 rounded-full bg-red-500"></div>
                          <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        </div>
                        <div className="mx-auto h-4 w-1/2 bg-slate-600 rounded-full"></div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 p-2">
                        <div className="col-span-2 h-8 bg-slate-800 rounded flex items-center">
                          <div className="w-2/3 h-2 bg-emerald-500/70 rounded-full ml-2"></div>
                          <div className="ml-auto mr-2 text-xs text-white/80 font-mono">98%</div>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="h-5 bg-slate-800 rounded w-4/5"></div>
                          <div className="h-2 bg-blue-400/60 rounded"></div>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="h-5 bg-slate-800 rounded"></div>
                          <div className="h-2 bg-amber-400/60 rounded w-2/3"></div>
                        </div>
                        
                        <div className="col-span-2 flex space-x-1">
                          <div className="size-12 rounded bg-green-500/20 flex items-center justify-center">
                            <Gauge className="text-green-500 size-6" />
                          </div>
                          <div className="size-12 rounded bg-blue-500/20 flex items-center justify-center">
                            <Laptop className="text-blue-500 size-6" />
                          </div>
                          <div className="size-12 rounded bg-amber-500/20 flex items-center justify-center">
                            <Rocket className="text-amber-500 size-6" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="absolute bottom-2 right-2">
                        <motion.div 
                          animate={{ rotate: [0, 180, 360] }}
                          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                          className="size-6 opacity-60"
                        >
                          <Gauge className="text-emerald-400" />
                        </motion.div>
                      </div>
                    </div>
                  </div>
                )}

                {/* AI Chatbot Visualization */}
                {title === "AI Chatbot" && (
                  <div className="w-full h-full flex items-center justify-center relative bg-gradient-to-br from-indigo-900/80 to-purple-900/80 p-2 rounded-md">
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                      <div className="grid grid-cols-12 gap-1 opacity-20">
                        {Array(100).fill(0).map((_, i) => (
                          <div key={i} className="aspect-square">
                            {Math.random() > 0.5 ? "1" : "0"}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="relative z-10 w-full h-full flex flex-col">
                      <div className="flex items-start max-w-[80%] mb-2">
                        <div className="bg-white/20 p-2 rounded-lg rounded-bl-none text-white">
                          How can I improve my website's performance?
                        </div>
                      </div>
                      
                      <div className="flex items-end justify-end w-full mb-2">
                        <div className="bg-indigo-600/50 p-2 rounded-lg rounded-br-none text-white max-w-[80%]">
                          I recommend optimizing your images, minifying CSS/JS, and implementing lazy loading.
                        </div>
                      </div>
                      
                      <div className="flex items-start max-w-[80%] mb-2">
                        <div className="bg-white/20 p-2 rounded-lg rounded-bl-none text-white">
                          Can you explain lazy loading?
                        </div>
                      </div>
                      
                      <div className="mt-auto flex items-center gap-2 bg-white/10 p-2 rounded-md">
                        <Input className="bg-white/20 border-0 text-white" placeholder="Ask anything..." />
                        <Button size="icon" className="bg-indigo-500 hover:bg-indigo-600">
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <motion.div 
                        className="absolute bottom-10 right-2"
                        animate={{ 
                          scale: [1, 1.2, 1],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Bot className="text-indigo-300 size-6" />
                      </motion.div>
                    </div>
                  </div>
                )}

                {/* Document Analyzer Visualization */}
                {title === "Document Analyzer" && (
                  <div className="w-full h-full flex items-center justify-center p-2">
                    <div className="w-full h-full bg-gradient-to-br from-amber-900/80 to-orange-800/80 rounded-md p-2 relative">
                      {/* Document outline */}
                      <div className="bg-white/90 dark:bg-white/20 h-full w-full rounded overflow-hidden flex flex-col">
                        <div className="bg-amber-600/20 h-6 flex items-center px-2">
                          <div className="w-4 h-4 mr-1">
                            <FileSearch className="size-4 text-amber-600" />
                          </div>
                          <div className="text-xs font-mono text-amber-900 dark:text-amber-200">document.pdf</div>
                        </div>
                        
                        <div className="flex-1 p-2 relative">
                          {/* Document content */}
                          <div className="space-y-1.5 relative z-10">
                            <div className="h-2 bg-slate-300 dark:bg-white/30 rounded w-full"></div>
                            <div className="h-2 bg-amber-500/30 rounded w-4/5"></div>
                            <div className="h-2 bg-slate-300 dark:bg-white/30 rounded w-full"></div>
                            <div className="h-2 bg-slate-300 dark:bg-white/30 rounded w-2/3"></div>
                            
                            <div className="my-2 border-l-2 border-amber-500 pl-1">
                              <div className="h-2 bg-amber-500/30 rounded w-full"></div>
                              <div className="h-2 bg-amber-500/30 rounded w-4/5 mt-1"></div>
                            </div>
                            
                            <div className="h-2 bg-slate-300 dark:bg-white/30 rounded w-3/4"></div>
                            <div className="h-2 bg-green-500/30 rounded w-full"></div>
                            <div className="h-2 bg-slate-300 dark:bg-white/30 rounded w-5/6"></div>
                          </div>
                          
                          {/* Annotations */}
                          <motion.div 
                            className="absolute top-6 right-2"
                            animate={{ 
                              opacity: [0.5, 1, 0.5],
                              scale: [1, 1.05, 1]
                            }}
                            transition={{ duration: 3, repeat: Infinity }}
                          >
                            <div className="bg-amber-500/20 border border-amber-500/50 rounded px-1 text-amber-700 dark:text-amber-200 text-xs">
                              Key Insight
                            </div>
                          </motion.div>
                          
                          <motion.div 
                            className="absolute bottom-4 left-2"
                            animate={{ 
                              opacity: [0.5, 1, 0.5],
                            }}
                            transition={{ duration: 2, delay: 1, repeat: Infinity }}
                          >
                            <div className="bg-green-500/20 border border-green-500/50 rounded px-1 text-green-700 dark:text-green-200 text-xs">
                              Positive Sentiment
                            </div>
                          </motion.div>
                        </div>
                        
                        <div className="mt-auto p-1 flex justify-between items-center border-t border-slate-200 dark:border-white/10">
                          <div className="flex space-x-1">
                            <div className="size-4 bg-amber-500/20 rounded-sm flex items-center justify-center">
                              <LightbulbIcon className="size-3 text-amber-600" />
                            </div>
                            <div className="size-4 bg-blue-500/20 rounded-sm flex items-center justify-center">
                              <PieChart className="size-3 text-blue-600" />
                            </div>
                          </div>
                          
                          <div className="text-xs font-mono text-slate-500 dark:text-slate-400">3 of 12</div>
                        </div>
                      </div>
                      
                      <motion.div 
                        className="absolute top-2 right-2"
                        animate={{ rotate: [0, 10, 0, -10, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <FileSearch className="text-amber-300 size-5 opacity-70" />
                      </motion.div>
                    </div>
                  </div>
                )}
                
                {/* Social Media Analyzer */}
                {title === "Social Media Analyzer" && (
                  <div className="w-full h-full flex items-center justify-center p-2">
                    <div className="w-full h-full bg-gradient-to-br from-pink-900/80 to-purple-800/80 rounded-md p-2 relative">
                      <div className="absolute top-0 left-0 w-full h-full opacity-20">
                        <div className="grid grid-cols-8 grid-rows-8 gap-0.5">
                          {Array(64).fill(0).map((_, i) => (
                            <div key={i} className={`rounded-sm ${Math.random() > 0.7 ? 'bg-pink-300' : Math.random() > 0.5 ? 'bg-purple-300' : 'bg-blue-300'}`}></div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="relative z-10 h-full flex flex-col">
                        <div className="flex justify-between mb-2">
                          <div className="flex space-x-1">
                            <div className="size-5 rounded-full bg-pink-500/30 border border-pink-500/50"></div>
                            <div className="size-5 rounded-full bg-blue-500/30 border border-blue-500/50"></div>
                            <div className="size-5 rounded-full bg-purple-500/30 border border-purple-500/50"></div>
                          </div>
                          
                          <div className="flex space-x-1">
                            <div className="size-5 rounded-sm bg-white/10 flex items-center justify-center">
                              <BarChart className="size-3 text-white" />
                            </div>
                            <div className="size-5 rounded-sm bg-white/10 flex items-center justify-center">
                              <LineChart className="size-3 text-white" />
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex-1 flex flex-col">
                          <div className="flex-1 relative">
                            <div className="absolute bottom-0 left-0 w-full h-full flex items-end">
                              <div className="w-1/5 h-[20%] bg-pink-600/50 rounded-t"></div>
                              <div className="w-1/5 h-[80%] bg-pink-500/50 rounded-t"></div>
                              <div className="w-1/5 h-[60%] bg-pink-400/50 rounded-t"></div>
                              <div className="w-1/5 h-[30%] bg-pink-600/50 rounded-t"></div>
                              <div className="w-1/5 h-[50%] bg-pink-500/50 rounded-t"></div>
                            </div>
                            
                            <div className="absolute top-1/4 left-0 w-full border-t border-dashed border-white/30"></div>
                            <div className="absolute top-2/4 left-0 w-full border-t border-dashed border-white/30"></div>
                            <div className="absolute top-3/4 left-0 w-full border-t border-dashed border-white/30"></div>
                          </div>
                          
                          <div className="h-[40%] bg-white/10 rounded-md mt-2 p-1.5">
                            <div className="flex items-center mb-2">
                              <div className="size-3 rounded-full bg-pink-500 mr-1"></div>
                              <div className="text-xs text-white/90">Engagement Trend</div>
                            </div>
                            
                            <div className="relative h-[60%]">
                              <div className="absolute bottom-0 left-0 w-full h-full flex items-end">
                                <div className="relative w-full h-full">
                                  <motion.div 
                                    className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-pink-600/50 to-pink-500/10 rounded-md"
                                    animate={{ 
                                      height: ['40%', '70%', '50%', '80%', '60%', '40%'] 
                                    }}
                                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                  ></motion.div>
                                  
                                  <motion.div 
                                    className="absolute bottom-0 left-0 right-0 border-t border-pink-500"
                                    animate={{ 
                                      bottom: ['40%', '70%', '50%', '80%', '60%', '40%'] 
                                    }}
                                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                  ></motion.div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* AI Content Generator */}
                {title === "AI Content Generator" && (
                  <div className="w-full h-full flex items-center justify-center p-2">
                    <div className="w-full h-full bg-gradient-to-br from-violet-900/80 to-indigo-800/80 rounded-md p-2 relative">
                      <div className="h-full flex flex-col">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex space-x-1">
                            <div className="size-5 rounded-sm bg-violet-500/50 flex items-center justify-center">
                              <FileSearch className="size-3 text-white" />
                            </div>
                            <div className="text-xs text-white/90 font-mono">content_gen.ai</div>
                          </div>
                          
                          <div className="size-5 rounded-full bg-violet-500/30 flex items-center justify-center">
                            <Sparkles className="size-3 text-violet-300" />
                          </div>
                        </div>
                        
                        <div className="flex-1 bg-white/10 rounded-md p-2 mb-2 overflow-hidden">
                          <div className="space-y-1.5">
                            <div className="h-2 bg-violet-300/50 rounded w-full"></div>
                            <div className="h-2 bg-violet-300/50 rounded w-11/12"></div>
                            <div className="h-2 bg-violet-300/50 rounded w-4/5"></div>
                            <div className="h-2 bg-violet-300/50 rounded w-full"></div>
                            <div className="h-2 bg-violet-300/50 rounded w-2/3"></div>
                          </div>
                          
                          <div className="my-2 flex space-x-1">
                            <div className="px-1.5 py-0.5 bg-violet-500/30 rounded text-[0.6rem] text-violet-200">Blog</div>
                            <div className="px-1.5 py-0.5 bg-violet-500/30 rounded text-[0.6rem] text-violet-200">Social</div>
                            <div className="px-1.5 py-0.5 bg-violet-500/30 rounded text-[0.6rem] text-violet-200">SEO</div>
                          </div>
                          
                          <div className="space-y-1.5">
                            <div className="h-2 bg-violet-300/50 rounded w-full"></div>
                            <div className="h-2 bg-violet-300/50 rounded w-4/5"></div>
                            <div className="h-2 bg-violet-300/50 rounded w-11/12"></div>
                          </div>
                          
                          <motion.div 
                            className="h-4 w-1 bg-white/70 inline-block mt-1"
                            animate={{ opacity: [1, 0, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          ></motion.div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-1">
                          <div className="bg-white/10 rounded p-1 text-center">
                            <div className="text-[0.6rem] text-white/70">Words</div>
                            <div className="text-xs text-white font-mono">327</div>
                          </div>
                          <div className="bg-white/10 rounded p-1 text-center">
                            <div className="text-[0.6rem] text-white/70">Tone</div>
                            <div className="text-xs text-white font-mono">Casual</div>
                          </div>
                          <div className="bg-white/10 rounded p-1 text-center">
                            <div className="text-[0.6rem] text-white/70">SEO</div>
                            <div className="text-xs text-white font-mono">98%</div>
                          </div>
                        </div>
                      </div>
                      
                      <motion.div 
                        className="absolute bottom-2 right-2"
                        animate={{ 
                          rotate: 360,
                        }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                      >
                        <Sparkles className="text-violet-300/50 size-6" />
                      </motion.div>
                    </div>
                  </div>
                )}
                
                {/* Customer Journey Analyzer */}
                {title === "Customer Journey Analyzer" && (
                  <div className="w-full h-full flex items-center justify-center p-2">
                    <div className="w-full h-full bg-gradient-to-br from-cyan-900/80 to-blue-800/80 rounded-md p-2 relative">
                      <div className="absolute top-0 left-0 w-full h-full">
                        <svg width="100%" height="100%" viewBox="0 0 100 100" className="opacity-20">
                          <path d="M10,50 C30,20 70,80 90,50" stroke="white" strokeWidth="0.5" fill="none" />
                          <path d="M10,50 C30,80 70,20 90,50" stroke="white" strokeWidth="0.5" fill="none" />
                        </svg>
                      </div>
                      
                      <div className="relative z-10 h-full flex flex-col">
                        <div className="text-xs text-white/90 font-medium mb-2">Customer Journey Map</div>
                        
                        <div className="flex-1 flex">
                          <div className="relative w-full flex items-center justify-between">
                            <motion.div 
                              className="absolute top-1/2 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500"
                              animate={{ opacity: [0.3, 0.8, 0.3] }}
                              transition={{ duration: 3, repeat: Infinity }}
                            ></motion.div>
                            
                            <motion.div 
                              className="size-5 rounded-full bg-cyan-500/50 border border-cyan-500 relative z-10 flex-shrink-0"
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              <div className="absolute -top-5 text-[0.6rem] text-cyan-200">Discovery</div>
                            </motion.div>
                            
                            <motion.div 
                              className="size-4 rounded-full bg-blue-500/50 border border-blue-500 relative z-10 flex-shrink-0"
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 2, delay: 0.5, repeat: Infinity }}
                            >
                              <div className="absolute -top-5 text-[0.6rem] text-blue-200">Research</div>
                            </motion.div>
                            
                            <motion.div 
                              className="size-6 rounded-full bg-cyan-500/50 border-2 border-cyan-500 relative z-10 flex-shrink-0"
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 2, delay: 1, repeat: Infinity }}
                            >
                              <div className="absolute -top-5 text-[0.6rem] text-cyan-200">Decision</div>
                              <div className="absolute -bottom-5 text-[0.6rem] text-red-300">Drop-off</div>
                            </motion.div>
                            
                            <motion.div 
                              className="size-4 rounded-full bg-blue-500/50 border border-blue-500 relative z-10 flex-shrink-0"
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 2, delay: 1.5, repeat: Infinity }}
                            >
                              <div className="absolute -top-5 text-[0.6rem] text-blue-200">Purchase</div>
                            </motion.div>
                            
                            <motion.div 
                              className="size-5 rounded-full bg-cyan-500/50 border border-cyan-500 relative z-10 flex-shrink-0"
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 2, delay: 2, repeat: Infinity }}
                            >
                              <div className="absolute -top-5 text-[0.6rem] text-cyan-200">Loyalty</div>
                            </motion.div>
                          </div>
                        </div>
                        
                        <div className="h-1/3 bg-white/10 rounded-md mt-2 p-1 relative overflow-hidden">
                          <div className="absolute top-0 left-0 w-full h-full opacity-20">
                            <svg width="100%" height="100%" viewBox="0 0 100 100">
                              <path d="M0,80 C20,60 40,90 60,70 C80,50 100,60 100,40" stroke="cyan" strokeWidth="1" fill="none" />
                            </svg>
                          </div>
                          
                          <div className="flex justify-between text-[0.6rem] text-white/70">
                            <div>Engagement</div>
                            <div>47% ^</div>
                          </div>
                          
                          <div className="mt-1 w-full h-1 bg-white/20 rounded-full">
                            <motion.div 
                              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                              animate={{ width: ['20%', '60%', '40%'] }}
                              transition={{ duration: 5, repeat: Infinity }}
                            ></motion.div>
                          </div>
                          
                          <div className="mt-2 flex justify-between text-[0.6rem] text-white/70">
                            <div>Conversion</div>
                            <div>24% ^</div>
                          </div>
                          
                          <div className="mt-1 w-full h-1 bg-white/20 rounded-full">
                            <motion.div 
                              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                              animate={{ width: ['10%', '30%', '20%'] }}
                              transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
                            ></motion.div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="mt-auto">
          <Link 
            to="/waiting-list" 
            className="w-full"
          >
            <Button className="w-full" onClick={() => status === "coming-soon" && handleNotifyMe(title)}>
              {status === "coming-soon" ? "Notify Me When Available" : "Access Tool"}
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

// Main Page Component
const AITools = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const containerRef = useRef(null);
  
  // Parallax effect
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  
  useEffect(() => {
    document.title = "AI Tools | Trojan Envoy";
    window.scrollTo(0, 0);
  }, []);
  
  // Form submit handlers
  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    
    toast({
      title: "Thank you for subscribing!",
      description: "You'll be the first to know when our AI tools are available.",
      duration: 5000,
    });
    
    navigate("/waiting-list", { state: { email } });
  };
  
  const handleNotifyMe = (toolName) => {
    toast({
      title: `We'll notify you about ${toolName}`,
      description: "Please subscribe below with your email to receive updates.",
      duration: 4000,
    });
  };
  
  const tools = [
    {
      title: "Website Analyzer",
      description: "Comprehensive performance and SEO analysis for your website, similar to Google's PageSpeed Insights.",
      icon: Gauge,
      features: [
        "Page speed optimization recommendations",
        "SEO audit and suggestions",
        "Mobile responsiveness testing",
        "Competitor benchmarking"
      ],
      accentColor: "from-blue-500 to-indigo-600",
      category: "marketing"
    },
    {
      title: "AI Chatbot",
      description: "Intelligent conversational AI capable of answering a wide range of queries about digital marketing and development.",
      icon: Bot,
      features: [
        "24/7 customer support automation",
        "Lead qualification and nurturing",
        "Personalized product recommendations",
        "Multi-language support"
      ],
      accentColor: "from-emerald-500 to-teal-600",
      category: "service"
    },
    {
      title: "Document Analyzer",
      description: "AI-powered document analysis supporting PDF and various file formats with detailed insights and recommendations.",
      icon: FileSearch,
      features: [
        "Text extraction and summarization",
        "Key information highlighting",
        "Content categorization",
        "Sentiment and tone analysis"
      ],
      accentColor: "from-amber-500 to-orange-600",
      category: "productivity"
    },
    {
      title: "Social Media Analyzer",
      description: "Monitor and analyze your social media performance across all platforms with AI-driven insights.",
      icon: BarChart,
      features: [
        "Engagement metrics tracking",
        "Content performance analysis",
        "Audience sentiment analysis",
        "Competitor benchmarking"
      ],
      accentColor: "from-pink-500 to-rose-600",
      category: "marketing"
    },
    {
      title: "AI Content Generator",
      description: "Create high-quality content with AI assistance for blogs, social media, emails, and more.",
      icon: Sparkles,
      features: [
        "Blog post creation",
        "Social media content",
        "Email marketing templates",
        "SEO-optimized writing"
      ],
      accentColor: "from-violet-500 to-purple-600",
      category: "productivity"
    },
    {
      title: "Customer Journey Analyzer",
      description: "Visualize and optimize your customer journey with AI-driven insights and recommendations.",
      icon: LineChart,
      features: [
        "Touchpoint analysis",
        "Drop-off identification",
        "Behavioral patterns",
        "Conversion optimization"
      ],
      accentColor: "from-cyan-500 to-blue-600",
      category: "service"
    },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden" ref={containerRef}>
      <Header />

      {/* Decorative Background Elements */}
      <motion.div style={{ y }} className="absolute top-0 -right-1/4 w-1/2 h-1/2 bg-gradient-to-b from-primary/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      <motion.div style={{ y: useTransform(scrollYProgress, [0, 1], ["0%", "60%"]) }} className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-gradient-to-t from-purple-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="pt-32 pb-24 md:pt-40 md:pb-32 relative overflow-hidden">
          <div className="container px-4 mx-auto text-center relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary mb-8 text-sm font-medium"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              Advanced AI Tools
            </motion.div>

            <motion.h1 
              className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-8 tracking-tight max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Unleash the Power of <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
                Intelligent Automation
              </span>
            </motion.h1>

            <motion.p 
              className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Our suite of AI-powered tools designed to transform your digital presence, enhance performance, and deliver actionable insights.
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link to="/ai-tools/waiting-list">
                <Button size="lg" className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 text-white border-0 group">
                  Join Waiting List
                  <ChevronRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </motion.div>
          </div>

          {/* Floating Elements */}
          <div className="absolute top-1/4 left-[15%] w-12 h-12 rounded-full bg-blue-500/20 backdrop-blur-xl animate-float" />
          <div className="absolute top-1/3 right-[15%] w-8 h-8 rounded-full bg-purple-500/20 backdrop-blur-xl animate-float delay-300" />
          <div className="absolute bottom-1/4 left-[20%] w-6 h-6 rounded-full bg-amber-500/20 backdrop-blur-xl animate-float delay-500" />
        </section>

        {/* Tools Grid Section */}
        <section className="py-20 relative">
          <div className="container px-4 mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Cutting-Edge AI Tools</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Discover how our AI-powered solutions can transform your business operations and digital strategy.
              </p>
            </div>

            {/* Tool Category Tabs */}
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-12">
              <div className="flex justify-center">
                <TabsList className="mb-8">
                  <TabsTrigger value="all">All Tools</TabsTrigger>
                  <TabsTrigger value="productivity">Productivity</TabsTrigger>
                  <TabsTrigger value="marketing">Marketing</TabsTrigger>
                  <TabsTrigger value="service">Service</TabsTrigger>
                </TabsList>
              </div>
            </Tabs>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tools
                .filter(tool => activeTab === "all" || tool.category === activeTab)
                .map((tool, index) => (
                  <ToolCard 
                    key={tool.title}
                    {...tool}
                  />
                ))}
            </div>
          </div>
        </section>

        {/* Subscribe Section */}
        <section className="py-20 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-primary/5 dark:bg-primary/10" />
            <div className="absolute inset-0 bg-[linear-gradient(45deg,var(--primary)/0.05_1px,transparent_1px),linear-gradient(-45deg,var(--primary)/0.05_1px,transparent_1px)] bg-[size:40px_40px]" />
          </div>
          
          <div className="container px-4 mx-auto text-center max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, amount: 0.8 }}
              className="mb-8"
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                Be First in Line
              </h2>
              <p className="text-xl text-muted-foreground">
                Join our waiting list to receive exclusive early access, special pricing, and updates on our AI tools launch.
              </p>
            </motion.div>
            
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true, amount: 0.8 }}
              className="max-w-lg mx-auto"
              onSubmit={handleSubscribe}
            >
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-grow h-12"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button type="submit" className="h-12 px-8 whitespace-nowrap">
                  Subscribe
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </motion.form>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default AITools;
