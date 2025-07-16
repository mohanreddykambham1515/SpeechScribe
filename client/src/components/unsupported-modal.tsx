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
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <DialogTitle className="text-center">Browser Not Supported</DialogTitle>
          <DialogDescription className="text-center">
            Your browser doesn't support the Web Speech API. Please use Chrome, Edge, or Safari for the best experience.
          </DialogDescription>
        </DialogHeader>
        <Button
          onClick={onClose}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          Got it
        </Button>
      </DialogContent>
    </Dialog>
  );
}
