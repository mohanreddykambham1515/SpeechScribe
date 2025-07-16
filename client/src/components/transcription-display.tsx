import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Copy, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

interface TranscriptionDisplayProps {
  transcript: string;
  interimTranscript: string;
  isRecording: boolean;
  onClear: () => void;
  onTranscriptChange: (text: string) => void;
}

export function TranscriptionDisplay({
  transcript,
  interimTranscript,
  isRecording,
  onClear,
  onTranscriptChange,
}: TranscriptionDisplayProps) {
  const { toast } = useToast();
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  const fullText = transcript + interimTranscript;

  useEffect(() => {
    const words = fullText.trim().split(/\s+/).filter(word => word.length > 0).length;
    const chars = fullText.length;
    setWordCount(words);
    setCharCount(chars);
  }, [fullText]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(transcript);
      toast({
        title: "Copied to clipboard",
        description: "Transcription text has been copied",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy text to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleTextChange = (e: React.FormEvent<HTMLDivElement>) => {
    const newText = e.currentTarget.textContent || "";
    onTranscriptChange(newText);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Live Transcription</h2>
          <div className="flex space-x-2">
            <Button
              onClick={handleCopy}
              variant="default"
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Copy className="w-4 h-4 mr-1" />
              Copy
            </Button>
            <Button
              onClick={onClear}
              variant="outline"
              size="sm"
              className="bg-gray-500 text-white hover:bg-gray-600"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Clear
            </Button>
          </div>
        </div>

        <div className="relative">
          <div
            className="w-full h-64 sm:h-80 p-4 bg-gray-50 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none font-mono text-sm leading-relaxed overflow-y-auto"
            contentEditable
            onInput={handleTextChange}
            suppressContentEditableWarning
            style={{ whiteSpace: "pre-wrap" }}
          >
            {transcript && (
              <span className="text-gray-900">{transcript}</span>
            )}
            {interimTranscript && (
              <span className="text-gray-500 italic">{interimTranscript}</span>
            )}
            {!transcript && !interimTranscript && (
              <span className="text-gray-400">Your transcription will appear here...</span>
            )}
          </div>

          {isRecording && (
            <div className="absolute top-2 right-2">
              <div className="flex items-center space-x-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                <span>Live</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
          <span>Words: <span className="font-medium">{wordCount}</span></span>
          <span>Characters: <span className="font-medium">{charCount}</span></span>
        </div>
      </CardContent>
    </Card>
  );
}
