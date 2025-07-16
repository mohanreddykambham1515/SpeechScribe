import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface SpeechRecognitionSettings {
  language: string;
  continuous: boolean;
  interimResults: boolean;
  autoSave: boolean;
}

interface SettingsPanelProps {
  settings: SpeechRecognitionSettings;
  onSettingsChange: (settings: SpeechRecognitionSettings) => void;
}

const languages = [
  { code: "en-US", name: "English (US)" },
  { code: "en-GB", name: "English (UK)" },
  { code: "es-ES", name: "Spanish (Spain)" },
  { code: "fr-FR", name: "French (France)" },
  { code: "de-DE", name: "German (Germany)" },
  { code: "it-IT", name: "Italian (Italy)" },
  { code: "pt-BR", name: "Portuguese (Brazil)" },
  { code: "ru-RU", name: "Russian (Russia)" },
  { code: "ja-JP", name: "Japanese (Japan)" },
  { code: "ko-KR", name: "Korean (South Korea)" },
  { code: "zh-CN", name: "Chinese (Mandarin)" },
];

export function SettingsPanel({ settings, onSettingsChange }: SettingsPanelProps) {
  const updateSetting = (key: keyof SpeechRecognitionSettings, value: any) => {
    onSettingsChange({
      ...settings,
      [key]: value,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="language" className="text-sm font-medium text-gray-700">
            Language
          </Label>
          <Select
            value={settings.language}
            onValueChange={(value) => updateSetting("language", value)}
          >
            <SelectTrigger className="w-full mt-2">
              <SelectValue placeholder="Select language" />
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
          <Label htmlFor="continuous" className="text-sm font-medium text-gray-700">
            Continuous Recognition
          </Label>
          <Switch
            id="continuous"
            checked={settings.continuous}
            onCheckedChange={(checked) => updateSetting("continuous", checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="interim" className="text-sm font-medium text-gray-700">
            Show Interim Results
          </Label>
          <Switch
            id="interim"
            checked={settings.interimResults}
            onCheckedChange={(checked) => updateSetting("interimResults", checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="autosave" className="text-sm font-medium text-gray-700">
            Auto-save
          </Label>
          <Switch
            id="autosave"
            checked={settings.autoSave}
            onCheckedChange={(checked) => updateSetting("autoSave", checked)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
