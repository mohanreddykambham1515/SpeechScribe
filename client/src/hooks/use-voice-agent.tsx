import { useState, useEffect, useCallback, useRef } from "react";
import { useToast } from "@/hooks/use-toast";

interface VoiceAgentSettings {
  language: string;
  continuous: boolean;
  interimResults: boolean;
  autoExecute: boolean;
}

interface VoiceAgentState {
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  isSupported: boolean;
  hasPermission: boolean;
  error: string | null;
  lastCommand: string | null;
  isProcessing: boolean;
  automationSteps: any[];
}

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

export function useVoiceAgent(settings: VoiceAgentSettings) {
  const { toast } = useToast();
  const recognition = useRef<any>(null);
  
  const [state, setState] = useState<VoiceAgentState>({
    isListening: false,
    transcript: "",
    interimTranscript: "",
    isSupported: false,
    hasPermission: false,
    error: null,
    lastCommand: null,
    isProcessing: false,
    automationSteps: [],
  });

  // Check browser support
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setState(prev => ({ ...prev, isSupported: true }));
      recognition.current = new SpeechRecognition();
      setupRecognition();
    } else {
      setState(prev => ({ ...prev, isSupported: false }));
    }
  }, []);

  // Setup recognition properties
  const setupRecognition = useCallback(() => {
    if (!recognition.current) return;

    recognition.current.continuous = settings.continuous;
    recognition.current.interimResults = settings.interimResults;
    recognition.current.lang = settings.language;

    recognition.current.onstart = () => {
      setState(prev => ({ ...prev, isListening: true, error: null }));
    };

    recognition.current.onend = () => {
      setState(prev => ({ ...prev, isListening: false }));
    };

    recognition.current.onerror = (event: any) => {
      let errorMessage = "Voice recognition error occurred";
      
      switch (event.error) {
        case "no-speech":
          errorMessage = "No speech detected. Please try again.";
          break;
        case "audio-capture":
          errorMessage = "Audio capture failed. Check your microphone.";
          break;
        case "not-allowed":
          errorMessage = "Microphone access denied. Please allow access.";
          setState(prev => ({ ...prev, hasPermission: false }));
          break;
        case "network":
          errorMessage = "Network error occurred. Check your connection.";
          break;
      }

      setState(prev => ({ ...prev, error: errorMessage, isListening: false }));
      toast({
        title: "Voice Recognition Error",
        description: errorMessage,
        variant: "destructive",
      });
    };

    recognition.current.onresult = (event: any) => {
      let finalTranscript = "";
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      setState(prev => ({
        ...prev,
        transcript: finalTranscript,
        interimTranscript: interimTranscript,
      }));

      // Process command if final transcript is available
      if (finalTranscript && settings.autoExecute) {
        processCommand(finalTranscript);
      }
    };
  }, [settings, toast]);

  // Process voice commands
  const processCommand = useCallback(async (command: string) => {
    setState(prev => ({ ...prev, isProcessing: true, lastCommand: command }));

    try {
      // Send command to backend for processing
      const response = await fetch('/api/voice-commands', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ command: command.toLowerCase() }),
      });

      const result = await response.json();
      
      if (result.success) {
        toast({
          title: "Command Executed",
          description: result.message,
        });
        
        // Execute different types of actions
        if (result.action === 'open_website' && result.url) {
          window.open(result.url, '_blank');
        } else if (result.action === 'complex_action') {
          // For complex actions, open the website and show instructions
          if (result.url) {
            window.open(result.url, '_blank');
          }
          
          // Set automation steps for display
          if (result.steps && result.steps.length > 0) {
            setState(prev => ({ ...prev, automationSteps: result.steps }));
          }
        }
      } else {
        toast({
          title: "Command Not Recognized",
          description: result.message || "I didn't understand that command",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Processing Error",
        description: "Failed to process your command",
        variant: "destructive",
      });
    } finally {
      setState(prev => ({ ...prev, isProcessing: false }));
    }
  }, [toast]);

  // Request microphone permission
  const requestPermission = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      setState(prev => ({ ...prev, hasPermission: true }));
      return true;
    } catch (error) {
      setState(prev => ({ ...prev, hasPermission: false }));
      return false;
    }
  }, []);

  // Start listening
  const startListening = useCallback(async () => {
    if (!state.isSupported) {
      toast({
        title: "Not Supported",
        description: "Voice recognition is not supported in this browser",
        variant: "destructive",
      });
      return;
    }

    if (!state.hasPermission) {
      const granted = await requestPermission();
      if (!granted) return;
    }

    try {
      recognition.current?.start();
    } catch (error) {
      toast({
        title: "Start Error",
        description: "Failed to start voice recognition",
        variant: "destructive",
      });
    }
  }, [state.isSupported, state.hasPermission, requestPermission, toast]);

  // Stop listening
  const stopListening = useCallback(() => {
    recognition.current?.stop();
  }, []);

  // Manual command processing
  const executeCommand = useCallback((command: string) => {
    processCommand(command);
  }, [processCommand]);

  const clearAutomationSteps = useCallback(() => {
    setState(prev => ({ ...prev, automationSteps: [] }));
  }, []);

  // Update recognition settings when they change
  useEffect(() => {
    if (recognition.current) {
      recognition.current.continuous = settings.continuous;
      recognition.current.interimResults = settings.interimResults;
      recognition.current.lang = settings.language;
    }
  }, [settings]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (recognition.current) {
        recognition.current.stop();
      }
    };
  }, []);

  return {
    ...state,
    startListening,
    stopListening,
    executeCommand,
    requestPermission,
    clearAutomationSteps,
  };
}