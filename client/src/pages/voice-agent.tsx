import { useState, useEffect, useCallback } from "react";
import { useVoiceAgent } from "@/hooks/use-voice-agent";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { PermissionModal } from "@/components/permission-modal";
import { UnsupportedModal } from "@/components/unsupported-modal";
import { 
  Mic, 
  MicOff, 
  Globe, 
  History, 
  Settings, 
  Send, 
  Loader2,
  ExternalLink,
  CheckCircle,
  XCircle
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Navigation } from "@/components/navigation";
import { useBrowserAutomation } from "@/hooks/use-browser-automation";
import { AutomationInstructions } from "@/components/automation-instructions";
import { InformationDisplay } from "@/components/information-display";

interface VoiceAgentSettings {
  language: string;
  continuous: boolean;
  interimResults: boolean;
  autoExecute: boolean;
}

interface VoiceCommand {
  id: number;
  command: string;
  action: string;
  target: string;
  success: boolean;
  executedAt: string;
}

export default function VoiceAgent() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<VoiceAgentSettings>({
    language: "en-US",
    continuous: false,
    interimResults: true,
    autoExecute: true,
  });

  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [showUnsupportedModal, setShowUnsupportedModal] = useState(false);
  const [manualCommand, setManualCommand] = useState("");
  const [automationSteps, setAutomationSteps] = useState<any[]>([]);
  const [showInstructions, setShowInstructions] = useState(false);
  const [currentInformation, setCurrentInformation] = useState("");
  const [showInformation, setShowInformation] = useState(false);

  const agent = useVoiceAgent(settings);
  const automation = useBrowserAutomation();

  // Fetch command history
  const { data: commandHistory, refetch: refetchHistory } = useQuery({
    queryKey: ['/api/voice-commands'],
    queryFn: async () => {
      const response = await fetch('/api/voice-commands');
      return response.json() as Promise<VoiceCommand[]>;
    },
    refetchInterval: 5000,
  });

  // Fetch supported websites
  const { data: supportedWebsites } = useQuery({
    queryKey: ['/api/supported-websites'],
    queryFn: async () => {
      const response = await fetch('/api/supported-websites');
      return response.json() as Promise<string[]>;
    },
  });

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem("voiceAgentSettings");
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error("Failed to load settings:", error);
      }
    }
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem("voiceAgentSettings", JSON.stringify(settings));
  }, [settings]);

  // Check browser support
  useEffect(() => {
    if (!agent.isSupported) {
      setShowUnsupportedModal(true);
    }
  }, [agent.isSupported]);

  // Handle permission request
  const handlePermissionRequest = useCallback(async () => {
    setShowPermissionModal(false);
    await agent.requestPermission();
  }, [agent]);

  // Handle start listening
  const handleStartListening = useCallback(async () => {
    if (!agent.hasPermission) {
      setShowPermissionModal(true);
      return;
    }
    await agent.startListening();
  }, [agent]);

  // Handle manual command
  const handleManualCommand = useCallback(async () => {
    if (!manualCommand.trim()) return;
    
    await agent.executeCommand(manualCommand);
    setManualCommand("");
    refetchHistory();
  }, [manualCommand, agent, refetchHistory]);

  // Handle settings change
  const updateSetting = (key: keyof VoiceAgentSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const languages = [
    { code: "en-US", name: "English (US)" },
    { code: "en-GB", name: "English (UK)" },
    { code: "es-ES", name: "Spanish" },
    { code: "fr-FR", name: "French" },
    { code: "de-DE", name: "German" },
    { code: "it-IT", name: "Italian" },
    { code: "pt-BR", name: "Portuguese" },
    { code: "ru-RU", name: "Russian" },
    { code: "ja-JP", name: "Japanese" },
    { code: "ko-KR", name: "Korean" },
    { code: "zh-CN", name: "Chinese" },
    { code: "hi-IN", name: "Hindi" },
    { code: "te-IN", name: "Telugu" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Voice Web Agent</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {agent.isSupported ? "Voice-controlled web navigation" : "Manual web navigation"}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${agent.isSupported ? "bg-green-500" : "bg-red-500"}`} />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {agent.isSupported ? "Voice API Ready" : "Manual Only"}
                </span>
              </div>
              <Navigation />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Information Display */}
        <InformationDisplay
          information={agent.informationResponse}
          isVisible={agent.informationResponse.length > 0}
          onClose={agent.clearInformationResponse}
          onSearchMore={(query) => {
            agent.executeCommand(query);
            agent.clearInformationResponse();
          }}
        />
        
        {/* Automation Instructions */}
        <AutomationInstructions
          steps={agent.automationSteps}
          isVisible={agent.automationSteps.length > 0}
          onClose={agent.clearAutomationSteps}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Voice Control Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Voice Recognition */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Mic className="w-5 h-5" />
                  <span>Voice Control</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-center space-x-4">
                  <Button
                    onClick={agent.isListening ? agent.stopListening : handleStartListening}
                    disabled={!agent.isSupported || agent.isProcessing}
                    className={`group relative w-20 h-20 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${
                      agent.isListening
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-blue-500 hover:bg-blue-600"
                    }`}
                  >
                    {agent.isListening ? (
                      <MicOff className="w-6 h-6 text-white" />
                    ) : (
                      <Mic className="w-6 h-6 text-white" />
                    )}
                    {agent.isListening && (
                      <div className="absolute inset-0 rounded-full bg-current opacity-20 animate-pulse" />
                    )}
                  </Button>
                </div>

                <div className="text-center">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {agent.isListening ? "Listening..." : "Click to start voice control"}
                  </div>
                  {agent.isProcessing && (
                    <div className="flex items-center justify-center space-x-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Processing command...</span>
                    </div>
                  )}
                </div>

                {/* Current transcript */}
                {(agent.transcript || agent.interimTranscript) && (
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Voice Input:</div>
                    <div className="font-mono text-sm">
                      <span className="text-gray-900 dark:text-white">{agent.transcript}</span>
                      {agent.interimTranscript && (
                        <span className="text-gray-500 italic"> {agent.interimTranscript}</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Manual command input */}
                <div className="flex space-x-2">
                  <Input
                    placeholder="Type a command manually (e.g., 'open google')"
                    value={manualCommand}
                    onChange={(e) => setManualCommand(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleManualCommand()}
                    className="flex-1"
                  />
                  <Button onClick={handleManualCommand} disabled={!manualCommand.trim() || agent.isProcessing}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Command History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <History className="w-5 h-5" />
                  <span>Command History</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {commandHistory?.map((command) => (
                    <div key={command.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-sm">{command.command}</span>
                          {command.success ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-500" />
                          )}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {formatTimestamp(command.executedAt)}
                        </div>
                      </div>
                      {command.success && command.action === 'open_website' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(command.target, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  {!commandHistory || commandHistory.length === 0 && (
                    <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                      No commands yet. Try saying "open google" or "go to youtube"
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={settings.language}
                    onValueChange={(value) => updateSetting("language", value)}
                  >
                    <SelectTrigger className="w-full mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="continuous">Continuous Listening</Label>
                  <Switch
                    id="continuous"
                    checked={settings.continuous}
                    onCheckedChange={(checked) => updateSetting("continuous", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="interim">Show Interim Results</Label>
                  <Switch
                    id="interim"
                    checked={settings.interimResults}
                    onCheckedChange={(checked) => updateSetting("interimResults", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="autoExecute">Auto-execute Commands</Label>
                  <Switch
                    id="autoExecute"
                    checked={settings.autoExecute}
                    onCheckedChange={(checked) => updateSetting("autoExecute", checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Supported Websites */}
            <Card>
              <CardHeader>
                <CardTitle>Supported Websites</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-h-48 overflow-y-auto">
                  <div className="flex flex-wrap gap-2">
                    {supportedWebsites?.map((website) => (
                      <Badge key={website} variant="secondary" className="text-xs">
                        {website}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <p className="mb-2">Try commands like:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li><strong>Questions:</strong> "What is artificial intelligence?", "Tell me about India"</li>
                    <li><strong>Simple:</strong> "Open Google", "Go to YouTube"</li>
                    <li><strong>Complex:</strong> "Open YouTube and play Telugu music"</li>
                    <li><strong>Search:</strong> "Search Google for best restaurants"</li>
                    <li><strong>Shopping:</strong> "Find on Amazon wireless headphones"</li>
                    <li><strong>Email:</strong> "Compose email in Gmail"</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
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