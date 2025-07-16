import { useState, useEffect, useCallback } from "react";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { SpeechRecorder } from "@/components/speech-recorder";
import { TranscriptionDisplay } from "@/components/transcription-display";
import { SettingsPanel } from "@/components/settings-panel";
import { ActionsPanel } from "@/components/actions-panel";
import { StatisticsPanel } from "@/components/statistics-panel";
import { KeyboardShortcuts } from "@/components/keyboard-shortcuts";
import { PermissionModal } from "@/components/permission-modal";
import { UnsupportedModal } from "@/components/unsupported-modal";
import { Navigation } from "@/components/navigation";
import { Mic, Settings } from "lucide-react";

interface SpeechRecognitionSettings {
  language: string;
  continuous: boolean;
  interimResults: boolean;
  autoSave: boolean;
}

export default function SpeechToText() {
  const [settings, setSettings] = useState<SpeechRecognitionSettings>({
    language: "en-US",
    continuous: true,
    interimResults: true,
    autoSave: true,
  });

  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [showUnsupportedModal, setShowUnsupportedModal] = useState(false);

  const speech = useSpeechRecognition(settings);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("speechToTextSettings");
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error("Failed to load settings:", error);
      }
    }
  }, []);

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem("speechToTextSettings", JSON.stringify(settings));
  }, [settings]);

  // Check browser support and show modal if needed
  useEffect(() => {
    if (!speech.isSupported) {
      setShowUnsupportedModal(true);
    }
  }, [speech.isSupported]);

  // Handle permission modal
  const handlePermissionRequest = useCallback(async () => {
    setShowPermissionModal(false);
    await speech.requestPermission();
  }, [speech]);

  // Handle start recording with permission check
  const handleStartRecording = useCallback(async () => {
    if (!speech.hasPermission) {
      setShowPermissionModal(true);
      return;
    }
    await speech.startRecording();
  }, [speech]);

  // Handle pause recording
  const handlePauseRecording = useCallback(() => {
    // For now, just stop and restart - proper pause would need more complex state management
    if (speech.isRecording) {
      speech.stopRecording();
    }
  }, [speech]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid interfering with form inputs
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.code === "Space" && !e.repeat) {
        e.preventDefault();
        if (speech.isRecording) {
          speech.stopRecording();
        } else {
          handleStartRecording();
        }
      }

      if (e.ctrlKey && e.key === "c") {
        e.preventDefault();
        if (speech.transcript) {
          navigator.clipboard.writeText(speech.transcript);
        }
      }

      if (e.ctrlKey && e.key === "Delete") {
        e.preventDefault();
        speech.clearTranscript();
      }

      if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        // Trigger download
        if (speech.transcript.trim()) {
          const blob = new Blob([speech.transcript], { type: "text/plain" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `transcription_${new Date().toISOString().slice(0, 19).replace(/:/g, "-")}.txt`;
          a.click();
          URL.revokeObjectURL(url);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [speech, handleStartRecording]);

  const getBrowserStatusColor = () => {
    return speech.isSupported ? "bg-green-500" : "bg-red-500";
  };

  const getBrowserStatusText = () => {
    return speech.isSupported ? "Speech API Supported" : "Manual Input Only";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Mic className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Speech to Text</h1>
                <p className="text-sm text-gray-500">
                  {speech.isSupported ? "Real-time transcription" : "Text editor with save/export"}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${getBrowserStatusColor()}`} />
                <span className="text-sm text-gray-600">{getBrowserStatusText()}</span>
              </div>
              <Navigation />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recording and Transcription */}
          <div className="lg:col-span-2">
            <SpeechRecorder
              isRecording={speech.isRecording}
              isPaused={speech.isPaused}
              elapsedTime={speech.elapsedTime}
              onStartRecording={handleStartRecording}
              onStopRecording={speech.stopRecording}
              onPauseRecording={handlePauseRecording}
              disabled={!speech.isSupported}
            />
            
            <TranscriptionDisplay
              transcript={speech.transcript}
              interimTranscript={speech.interimTranscript}
              isRecording={speech.isRecording}
              onClear={speech.clearTranscript}
              onTranscriptChange={speech.setTranscript}
              isSupported={speech.isSupported}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <SettingsPanel
              settings={settings}
              onSettingsChange={setSettings}
            />
            
            <ActionsPanel
              transcript={speech.transcript}
              settings={settings}
            />
            
            <StatisticsPanel />
            
            <KeyboardShortcuts />
          </div>
        </div>
      </main>

      {/* Modals */}
      <PermissionModal
        isOpen={showPermissionModal}
        onClose={() => setShowPermissionModal(false)}
        onAllow={handlePermissionRequest}
      />
      
      <UnsupportedModal
        isOpen={showUnsupportedModal}
        onClose={() => setShowUnsupportedModal(false)}
      />
    </div>
  );
}
