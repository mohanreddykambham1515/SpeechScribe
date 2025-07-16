import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const shortcuts = [
  { action: "Start/Stop Recording", key: "Space" },
  { action: "Copy Text", key: "Ctrl+C" },
  { action: "Clear All", key: "Ctrl+Del" },
  { action: "Download", key: "Ctrl+S" },
];

export function KeyboardShortcuts() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Keyboard Shortcuts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {shortcuts.map((shortcut, index) => (
          <div key={index} className="flex justify-between items-center text-sm">
            <span className="text-gray-600">{shortcut.action}</span>
            <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">
              {shortcut.key}
            </kbd>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
