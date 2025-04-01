
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Upload, FileText, Youtube, Image, X, ExternalLink } from 'lucide-react';

interface ServiceMediaTabProps {
  images: (File | string)[];
  documents: (File | string)[];
  videos: string[];
  videoInput: string;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDocumentChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
  onRemoveDocument: (index: number) => void;
  onVideoInputChange: (value: string) => void;
  onAddVideo: () => void;
  onRemoveVideo: (video: string) => void;
}

const ServiceMediaTab: React.FC<ServiceMediaTabProps> = ({
  images,
  documents,
  videos,
  videoInput,
  onImageChange,
  onDocumentChange,
  onRemoveImage,
  onRemoveDocument,
  onVideoInputChange,
  onAddVideo,
  onRemoveVideo,
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-medium mb-2">Images</h3>
          <div className="border border-dashed border-border rounded-lg p-6 text-center mb-4">
            <div className="flex flex-col items-center">
              <Image className="h-8 w-8 text-muted-foreground mb-2" />
              <h4 className="text-sm font-medium mb-1">Drag images here or click to upload</h4>
              <p className="text-xs text-muted-foreground mb-4">Upload images to include in your service description</p>
              <label className="cursor-pointer">
                <Button variant="outline" type="button" className="relative">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Images
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={onImageChange}
                  />
                </Button>
              </label>
            </div>
          </div>
          
          {images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {images.map((image, index) => (
                <div 
                  key={index} 
                  className="relative group border rounded-md overflow-hidden aspect-square bg-muted"
                >
                  <img 
                    src={typeof image === 'string' ? image : URL.createObjectURL(image)}
                    alt={`Uploaded ${index}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      variant="destructive"
                      size="sm"
                      className="w-8 h-8 p-0 rounded-full"
                      onClick={() => onRemoveImage(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-medium mb-2">Documents</h3>
          <div className="border border-dashed border-border rounded-lg p-6 text-center mb-4">
            <div className="flex flex-col items-center">
              <FileText className="h-8 w-8 text-muted-foreground mb-2" />
              <h4 className="text-sm font-medium mb-1">Drag documents here or click to upload</h4>
              <p className="text-xs text-muted-foreground mb-4">Upload PDFs, Word documents, or other files</p>
              <label className="cursor-pointer">
                <Button variant="outline" type="button" className="relative">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Documents
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={onDocumentChange}
                  />
                </Button>
              </label>
            </div>
          </div>
          
          {documents.length > 0 && (
            <div className="space-y-2 mb-6">
              {documents.map((doc, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between border rounded-md p-3"
                >
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-blue-500" />
                    <span className="text-sm truncate max-w-[300px]">
                      {typeof doc === 'string' ? doc.split('/').pop() : doc.name}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-8 h-8 p-0 rounded-full"
                      onClick={() => window.open(typeof doc === 'string' ? doc : URL.createObjectURL(doc), '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-8 h-8 p-0 rounded-full"
                      onClick={() => onRemoveDocument(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-medium mb-2">Videos</h3>
          <div className="space-y-4 mb-4">
            <div className="flex gap-2">
              <Input
                placeholder="Paste YouTube or Vimeo URL"
                value={videoInput}
                onChange={(e) => onVideoInputChange(e.target.value)}
                className="flex-grow"
              />
              <Button 
                type="button" 
                onClick={onAddVideo}
                variant="secondary"
              >
                <Youtube className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              YouTube and Vimeo videos are supported. Paste the full video URL.
            </p>
          </div>
          
          {videos.length > 0 && (
            <div className="space-y-4 mb-6">
              {videos.map((video, index) => (
                <div 
                  key={index} 
                  className="border rounded-md overflow-hidden"
                >
                  <div className="p-3 flex items-center justify-between bg-muted/50">
                    <div className="flex items-center space-x-3">
                      <Youtube className="h-5 w-5 text-red-500" />
                      <span className="text-sm truncate max-w-[300px]">{video}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-8 h-8 p-0 rounded-full"
                      onClick={() => onRemoveVideo(video)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="aspect-video bg-black">
                    <iframe
                      src={getEmbedUrl(video)}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Helper function to convert YouTube/Vimeo URLs to embed URLs
const getEmbedUrl = (url: string): string => {
  // YouTube
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(youtubeRegex);
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
  }
  
  // Vimeo
  if (url.includes('vimeo.com')) {
    const vimeoRegex = /vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|)(\d+)(?:$|\/|\?)/;
    const match = url.match(vimeoRegex);
    if (match && match[1]) {
      return `https://player.vimeo.com/video/${match[1]}`;
    }
  }
  
  return url;
};

export default ServiceMediaTab;
