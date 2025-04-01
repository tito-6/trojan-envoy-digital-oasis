
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, FileText, Youtube, X } from "lucide-react";

interface MediaTabProps {
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (index: number) => void;
  handleDocumentChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeDocument: (index: number) => void;
  addVideo: () => void;
  removeVideo: (video: string) => void;
  images: (File | string)[];
  documents: (File | string)[];
  videos: string[];
  videoInput: string;
  setVideoInput: (value: string) => void;
}

export const MediaTab: React.FC<MediaTabProps> = ({
  handleImageChange,
  removeImage,
  handleDocumentChange,
  removeDocument,
  addVideo,
  removeVideo,
  images,
  documents,
  videos,
  videoInput,
  setVideoInput,
}) => {
  return (
    <TabsContent value="media" className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Images</h3>
        <div className="border border-dashed border-border rounded-lg p-6 text-center mb-4">
          <div className="flex flex-col items-center">
            <Upload className="h-8 w-8 text-muted-foreground mb-2" />
            <h4 className="text-sm font-medium mb-1">Drag images here or click to upload</h4>
            <p className="text-xs text-muted-foreground mb-4">Upload images to include in your content</p>
            <label className="cursor-pointer">
              <Button variant="outline" type="button" className="relative">
                <Upload className="h-4 w-4 mr-2" />
                Upload Images
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleImageChange}
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
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div>
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
                  onChange={handleDocumentChange}
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
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-8 h-8 p-0 rounded-full"
                  onClick={() => removeDocument(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-2">Videos</h3>
        <div className="space-y-4 mb-4">
          <div className="flex gap-2">
            <Input
              placeholder="Paste YouTube URL"
              value={videoInput}
              onChange={(e) => setVideoInput(e.target.value)}
              className="flex-grow"
            />
            <Button 
              type="button" 
              onClick={addVideo}
              variant="secondary"
            >
              <Youtube className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Only YouTube videos are supported. Paste the full video URL.
          </p>
        </div>
        
        {videos.length > 0 && (
          <div className="space-y-2 mb-6">
            {videos.map((video, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between border rounded-md p-3"
              >
                <div className="flex items-center space-x-3">
                  <Youtube className="h-5 w-5 text-red-500" />
                  <span className="text-sm truncate max-w-[300px]">{video}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-8 h-8 p-0 rounded-full"
                  onClick={() => removeVideo(video)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </TabsContent>
  );
};
