import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mic } from "lucide-react";

interface PermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAllow: () => void;
}

export function PermissionModal({ isOpen, onClose, onAllow }: PermissionModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
            <Mic className="w-8 h-8 text-yellow-600" />
          </div>
          <DialogTitle className="text-center">Microphone Permission Required</DialogTitle>
          <DialogDescription className="text-center">
            Please allow microphone access to use speech recognition features.
          </DialogDescription>
        </DialogHeader>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={onAllow}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            Allow
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
