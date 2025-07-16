import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface UnsupportedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UnsupportedModal({ isOpen, onClose }: UnsupportedModalProps) {
  const detectBrowser = () => {
    const userAgent = navigator.userAgent;
    if (userAgent.includes("Chrome")) return "Chrome";
    if (userAgent.includes("Firefox")) return "Firefox";
    if (userAgent.includes("Safari")) return "Safari";
    if (userAgent.includes("Edge")) return "Edge";
    return "Unknown";
  };

  const currentBrowser = detectBrowser();
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <DialogTitle className="text-center">Browser Not Supported</DialogTitle>
          <DialogDescription className="text-center space-y-3">
            <p>Your browser ({currentBrowser}) doesn't support the Web Speech API.</p>
            <p className="text-sm">
              <strong>Supported browsers:</strong><br />
              • Chrome (recommended)<br />
              • Microsoft Edge<br />
              • Safari (macOS/iOS)<br />
              • Chrome on Android
            </p>
            <p className="text-sm text-gray-600">
              You can still use the app to manually type and edit text, but speech recognition won't work.
            </p>
          </DialogDescription>
        </DialogHeader>
        <div className="flex space-x-3">
          <Button
            onClick={onClose}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            Continue anyway
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
