import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Facebook,
  Twitter,
  Linkedin,
  Link as LinkIcon,
  Share as ShareIcon,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ShareDialogProps {
  title: string;
  description: string;
  url: string;
}

export function ShareDialog({ title, description, url }: ShareDialogProps) {
  const { toast } = useToast();

  const platforms = [
    {
      name: "Twitter",
      icon: Twitter,
      shareUrl: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      color: "bg-[#1DA1F2] hover:bg-[#1a8cd8]",
    },
    {
      name: "Facebook",
      icon: Facebook,
      shareUrl: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      color: "bg-[#4267B2] hover:bg-[#365899]",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      shareUrl: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(description)}`,
      color: "bg-[#0077b5] hover:bg-[#006399]",
    },
  ];

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast({
        description: "Link copied to clipboard!",
        duration: 2000,
      });
    } catch (err) {
      toast({
        description: "Failed to copy link.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <ShareIcon className="h-4 w-4" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share this article</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <div className="grid grid-cols-3 gap-4">
            {platforms.map((platform) => (
              <a
                key={platform.name}
                href={platform.shareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-white transition-colors ${platform.color}`}
              >
                <platform.icon className="h-4 w-4" />
                {platform.name}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                readOnly
                value={url}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
            </div>
            <Button
              type="button"
              variant="secondary"
              className="shrink-0"
              onClick={copyToClipboard}
            >
              <LinkIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}