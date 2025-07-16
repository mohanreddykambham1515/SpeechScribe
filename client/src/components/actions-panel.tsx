import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Save, FolderOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ActionsPanelProps {
  transcript: string;
  settings: any;
}

export function ActionsPanel({ transcript, settings }: ActionsPanelProps) {
  const { toast } = useToast();

  const handleDownload = () => {
    if (!transcript.trim()) {
      toast({
        title: "No content",
        description: "There's no transcription to download",
        variant: "destructive",
      });
      return;
    }

    const blob = new Blob([transcript], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transcription_${new Date().toISOString().slice(0, 19).replace(/:/g, "-")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download started",
      description: "Your transcription is being downloaded",
    });
  };

  const handleSave = () => {
    if (!transcript.trim()) {
      toast({
        title: "No content",
        description: "There's no transcription to save",
        variant: "destructive",
      });
      return;
    }

    const data = {
      text: transcript,
      timestamp: new Date().toISOString(),
      settings,
      wordCount: transcript.trim().split(/\s+/).filter(word => word.length > 0).length,
      charCount: transcript.length,
    };

    const key = `speechToText_${Date.now()}`;
    localStorage.setItem(key, JSON.stringify(data));
    
    toast({
      title: "Saved successfully",
      description: "Your transcription has been saved to local storage",
    });
  };

  const handleLoad = () => {
    const keys = Object.keys(localStorage).filter(key => key.startsWith('speechToText_'));
    if (keys.length === 0) {
      toast({
        title: "No saved transcriptions",
        description: "You haven't saved any transcriptions yet",
        variant: "destructive",
      });
      return;
    }

    // For now, just show info about available saves
    toast({
      title: "Saved transcriptions found",
      description: `Found ${keys.length} saved transcription(s)`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button
          onClick={handleDownload}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          <Download className="w-4 h-4 mr-2" />
          Download as TXT
        </Button>
        
        <Button
          onClick={handleSave}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          <Save className="w-4 h-4 mr-2" />
          Save to Local Storage
        </Button>
        
        <Button
          onClick={handleLoad}
          className="w-full bg-gray-600 hover:bg-gray-700"
        >
          <FolderOpen className="w-4 h-4 mr-2" />
          Load from Storage
        </Button>
      </CardContent>
    </Card>
  );
}
