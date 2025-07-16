import { useState, useEffect, useCallback, useRef } from "react";
import { useToast } from "@/hooks/use-toast";

interface SpeechRecognitionSettings {
  language: string;
  continuous: boolean;
  interimResults: boolean;
  autoSave: boolean;
}

interface SpeechRecognitionState {
  isRecording: boolean;
  isPaused: boolean;
  transcript: string;
  interimTranscript: string;
  isSupported: boolean;
  hasPermission: boolean;
  error: string | null;
  startTime: number | null;
  elapsedTime: number;
}

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

export function useSpeechRecognition(settings: SpeechRecognitionSettings) {
  const { toast } = useToast();
  const recognition = useRef<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const [state, setState] = useState<SpeechRecognitionState>({
    isRecording: false,
    isPaused: false,
    transcript: "",
    interimTranscript: "",
    isSupported: false,
    hasPermission: false,
    error: null,
    startTime: null,
    elapsedTime: 0,
  });

  // Check browser support
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    // Log browser info for debugging
    console.log("Browser:", navigator.userAgent);
    console.log("SpeechRecognition support:", !!SpeechRecognition);
    
    if (SpeechRecognition) {
      setState(prev => ({ ...prev, isSupported: true }));
      recognition.current = new SpeechRecognition();
      setupRecognition();
    } else {
      setState(prev => ({ ...prev, isSupported: false }));
      console.warn("Web Speech API not supported in this browser");
    }
  }, []);

  // Setup recognition properties
  const setupRecognition = useCallback(() => {
    if (!recognition.current) return;

    recognition.current.continuous = settings.continuous;
    recognition.current.interimResults = settings.interimResults;
    recognition.current.lang = settings.language;

    recognition.current.onstart = () => {
      setState(prev => ({ ...prev, isRecording: true, error: null }));
      toast({
        title: "Recording started",
        description: "Speak clearly into your microphone",
      });
    };

    recognition.current.onend = () => {
      setState(prev => ({ ...prev, isRecording: false, isPaused: false }));
      stopTimer();
    };

    recognition.current.onerror = (event: any) => {
      let errorMessage = "Speech recognition error occurred";
      
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
        case "language-not-supported":
          errorMessage = "Selected language is not supported.";
          break;
      }

      setState(prev => ({ ...prev, error: errorMessage, isRecording: false }));
      toast({
        title: "Recognition Error",
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
        transcript: prev.transcript + finalTranscript,
        interimTranscript: interimTranscript,
      }));

      // Auto-save if enabled
      if (settings.autoSave && finalTranscript) {
        autoSave(finalTranscript);
      }
    };
  }, [settings, toast]);

  // Update recognition settings when they change
  useEffect(() => {
    if (recognition.current) {
      recognition.current.continuous = settings.continuous;
      recognition.current.interimResults = settings.interimResults;
      recognition.current.lang = settings.language;
    }
  }, [settings]);

  // Timer functions
  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    const startTime = Date.now();
    setState(prev => ({ ...prev, startTime }));
    
    timerRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      setState(prev => ({ ...prev, elapsedTime: elapsed }));
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Auto-save function
  const autoSave = useCallback((text: string) => {
    const data = {
      text,
      timestamp: new Date().toISOString(),
      settings,
    };
    localStorage.setItem(`speechToText_${Date.now()}`, JSON.stringify(data));
  }, [settings]);

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

  // Start recording
  const startRecording = useCallback(async () => {
    if (!state.isSupported) {
      toast({
        title: "Not Supported",
        description: "Speech recognition is not supported in this browser",
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
      startTimer();
    } catch (error) {
      toast({
        title: "Start Error",
        description: "Failed to start speech recognition",
        variant: "destructive",
      });
    }
  }, [state.isSupported, state.hasPermission, requestPermission, startTimer, toast]);

  // Stop recording
  const stopRecording = useCallback(() => {
    recognition.current?.stop();
    stopTimer();
    toast({
      title: "Recording stopped",
      description: "Transcription completed",
    });
  }, [stopTimer, toast]);

  // Clear transcript
  const clearTranscript = useCallback(() => {
    setState(prev => ({ ...prev, transcript: "", interimTranscript: "" }));
  }, []);

  // Set transcript manually
  const setTranscript = useCallback((text: string) => {
    setState(prev => ({ ...prev, transcript: text }));
  }, []);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (recognition.current) {
        recognition.current.stop();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return {
    ...state,
    startRecording,
    stopRecording,
    clearTranscript,
    setTranscript,
    requestPermission,
  };
}
