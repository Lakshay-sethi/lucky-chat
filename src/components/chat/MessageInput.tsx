
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Paperclip, Send, Image, FileVideo, FileAudio, FileText, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "@/components/ui/use-toast";

interface MessageInputProps {
  onSendMessage: (content: string, file?: File) => Promise<void>;
}

export const MessageInput = ({ onSendMessage }: MessageInputProps) => {
  const [newMessage, setNewMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fileTypeButtons = [
    { type: 'image/*', icon: Image, label: 'Image' },
    { type: 'video/*', icon: FileVideo, label: 'Video' },
    { type: 'audio/*', icon: FileAudio, label: 'Audio' },
    { type: 'application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain', icon: FileText, label: 'Document' }
  ];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent empty message with no file
    if (!newMessage.trim() && !selectedFile) return;

    try {
      await onSendMessage(newMessage, selectedFile || undefined);
      setNewMessage("");
      clearSelectedFile();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      {/* Selected file preview */}
      {selectedFile && (
        <div className="px-4 pt-2">
          <div className="flex items-center gap-2 py-2 px-3 bg-primary/10 rounded-md">
            <Paperclip className="h-4 w-4" />
            <span className="text-sm truncate flex-1">{selectedFile.name}</span>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0 rounded-full"
              onClick={clearSelectedFile}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="p-4">
        <div className="glass rounded-full p-2 flex items-center gap-2">
          {/* File upload button */}
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                className="h-9 w-9 p-0 rounded-full hover:bg-white/10"
              >
                <Paperclip className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start" alignOffset={8}>
              <div className="flex p-1 gap-1">
                {fileTypeButtons.map((btn, index) => (
                  <Button
                    key={index}
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="flex flex-col items-center h-auto py-2 px-3 gap-1"
                    onClick={() => {
                      if (fileInputRef.current) {
                        fileInputRef.current.accept = btn.type;
                        fileInputRef.current.click();
                      }
                    }}
                  >
                    <btn.icon className="h-5 w-5" />
                    <span className="text-xs">{btn.label}</span>
                  </Button>
                ))}
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </div>
            </PopoverContent>
          </Popover>

          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 bg-transparent outline-none px-2"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <Button 
            type="submit"
            variant="ghost"
            size="sm"
            className="h-9 w-9 p-0 rounded-full hover:bg-white/10"
            disabled={!newMessage.trim() && !selectedFile}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </form>
    </>
  );
};
