
import { useState } from 'react';
import { File, Image, Video, Music, FileText, Eye, Download } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface MediaMessageProps {
  fileUrl: string;
  fileType: "image" | "video" | "audio" | "document" | null;
  fileName?: string;
}

export const MediaMessage = ({ fileUrl, fileType, fileName }: MediaMessageProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Helper to get file name from URL
  const getDisplayName = () => {
    if (fileName) return fileName;
    
    // Extract filename from URL
    const urlParts = fileUrl.split('/');
    const fullName = urlParts[urlParts.length - 1];
    
    // Decode URL-encoded characters
    const decoded = decodeURIComponent(fullName);
    
    // Remove any random prefixes
    const nameParts = decoded.split('_');
    return nameParts.length > 1 ? nameParts.slice(1).join('_') : decoded;
  };
  
  // Render based on file type
  const renderMedia = () => {
    switch (fileType) {
      case 'image':
        return (
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <div className="cursor-pointer">
                <img 
                  src={fileUrl} 
                  alt="Shared image" 
                  className="max-h-48 w-auto rounded-md object-cover"
                />
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-4xl p-0 bg-transparent border-none">
              <img 
                src={fileUrl} 
                alt="Shared image fullscreen" 
                className="max-h-[80vh] w-auto rounded-md"
              />
            </DialogContent>
          </Dialog>
        );
        
      case 'video':
        return (
          <video 
            src={fileUrl} 
            controls 
            className="max-h-48 max-w-full rounded-md" 
          />
        );
        
      case 'audio':
        return (
          <div className="flex items-center gap-2 p-2 bg-primary/10 rounded-md">
            <Music className="h-5 w-5" />
            <span className="text-sm font-medium">{getDisplayName()}</span>
            <audio controls className="max-w-full">
              <source src={fileUrl} />
              Your browser does not support the audio element.
            </audio>
          </div>
        );
        
      case 'document':
      default:
        return (
          <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-md">
            <FileText className="h-6 w-6" />
            <div className="flex-1">
              <div className="text-sm font-medium">{getDisplayName()}</div>
              <div className="text-xs text-muted-foreground">Document</div>
            </div>
            <a 
              href={fileUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="ml-2"
            >
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
                <Eye className="h-4 w-4" />
              </Button>
            </a>
            <a 
              href={fileUrl} 
              download={getDisplayName()}
              className="ml-0"
            >
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
                <Download className="h-4 w-4" />
              </Button>
            </a>
          </div>
        );
    }
  };
  
  return renderMedia();
};
