import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Info, Search, X, ExternalLink, Brain } from "lucide-react";

interface InformationDisplayProps {
  information: string;
  isVisible: boolean;
  onClose: () => void;
  onSearchMore?: (query: string) => void;
}

export function InformationDisplay({ 
  information, 
  isVisible, 
  onClose, 
  onSearchMore 
}: InformationDisplayProps) {
  if (!isVisible || !information) return null;

  // Extract topic from information for search suggestion
  const extractTopic = (text: string): string => {
    const match = text.match(/asking about "([^"]+)"/);
    return match ? match[1] : 'this topic';
  };

  const topic = extractTopic(information);

  return (
    <Card className="mb-6 border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center space-x-2">
            <Brain className="w-5 h-5 text-green-600" />
            <span>Information Response</span>
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-green-700 border-green-300">
            <Info className="w-3 h-3 mr-1" />
            AI Assistant
          </Badge>
          <Badge variant="outline" className="text-blue-700 border-blue-300">
            Information Request
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64 w-full">
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <div className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200">
              {information}
            </div>
          </div>
        </ScrollArea>
        
        {/* Action buttons */}
        <div className="mt-4 flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onSearchMore && onSearchMore(`search Google for ${topic}`)}
            className="flex items-center space-x-2"
          >
            <Search className="w-4 h-4" />
            <span>Search Google</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onSearchMore && onSearchMore(`${topic} Wikipedia`)}
            className="flex items-center space-x-2"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Wikipedia</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onSearchMore && onSearchMore(`${topic} news`)}
            className="flex items-center space-x-2"
          >
            <Info className="w-4 h-4" />
            <span>Latest News</span>
          </Button>
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <Info className="w-4 h-4 inline mr-1" />
            This is an AI-generated response. For the most current and accurate information, please use the search buttons above or ask me to search for specific details.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}