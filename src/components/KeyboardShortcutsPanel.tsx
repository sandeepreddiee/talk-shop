import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Keyboard } from 'lucide-react';

export const KeyboardShortcutsPanel = () => {
  const shortcuts = [
    { keys: ['Ctrl', 'V'], description: 'Start voice input' },
    { keys: ['?'], description: 'Show help menu' },
    { keys: ['Ctrl', 'K'], description: 'Focus search' },
    { keys: ['Esc'], description: 'Close dialogs' },
    { keys: ['Tab'], description: 'Navigate forward' },
    { keys: ['Shift', 'Tab'], description: 'Navigate backward' },
    { keys: ['Enter'], description: 'Activate button/link' },
    { keys: ['Space'], description: 'Toggle checkboxes' }
  ];

  return (
    <Card className="fixed bottom-4 right-4 p-4 max-w-sm shadow-lg z-50 bg-background/95 backdrop-blur">
      <div className="flex items-center gap-2 mb-3">
        <Keyboard className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">Keyboard Shortcuts</h3>
      </div>
      <div className="space-y-2">
        {shortcuts.map((shortcut, idx) => (
          <div key={idx} className="flex items-center justify-between gap-4 text-sm">
            <span className="text-muted-foreground">{shortcut.description}</span>
            <div className="flex gap-1">
              {shortcut.keys.map((key, keyIdx) => (
                <Badge key={keyIdx} variant="secondary" className="font-mono text-xs">
                  {key}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
