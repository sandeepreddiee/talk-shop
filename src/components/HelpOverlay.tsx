import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { voiceCommandParser } from '@/services/voiceCommands';

interface HelpOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpOverlay = ({ isOpen, onClose }: HelpOverlayProps) => {
  const commandList = voiceCommandParser.getCommandList();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Voice Commands and Keyboard Shortcuts</DialogTitle>
          <DialogDescription>
            Use these commands to navigate and control AccessShop
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <section>
            <h3 className="font-semibold text-lg mb-3">Keyboard Shortcuts</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="font-mono bg-muted px-2 py-1 rounded">Ctrl+V</dt>
                <dd className="text-muted-foreground">Toggle voice input (except in text fields)</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-mono bg-muted px-2 py-1 rounded">Ctrl+Shift+V</dt>
                <dd className="text-muted-foreground">Force toggle voice input</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-mono bg-muted px-2 py-1 rounded">?</dt>
                <dd className="text-muted-foreground">Show this help dialog</dd>
              </div>
            </dl>
          </section>

          <section>
            <h3 className="font-semibold text-lg mb-3">Voice Commands</h3>
            {commandList.map((group) => (
              <div key={group.intent} className="mb-4">
                <h4 className="font-medium mb-2">{group.intent}</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {group.examples.map((example, idx) => (
                    <li key={idx} className="pl-4">
                      &ldquo;{example}&rdquo;
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>

          <section>
            <h3 className="font-semibold text-lg mb-3">Tips</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Voice commands work on any page</li>
              <li>• Use natural language - the system understands variations</li>
              <li>• Say &ldquo;Read page&rdquo; to hear a summary of current content</li>
              <li>• All features are fully keyboard accessible</li>
            </ul>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
};
