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
            AccessShop offers two ways to use voice: Quick Commands (Ctrl+V) for specific actions, and Natural Conversations (floating mic button) for interactive assistance
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <section className="border-l-4 border-primary pl-4 bg-primary/5 p-3 rounded-r">
            <h3 className="font-semibold text-lg mb-2">🎤 Natural Conversations (Recommended)</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Click the floating microphone button (bottom-right corner) for natural conversations with the shopping assistant. Ask questions, get recommendations, or chat naturally about products!
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-lg mb-3">⚡ Quick Voice Commands (Ctrl+V)</h3>
            <p className="text-sm text-muted-foreground mb-3">
              <strong>Hold Ctrl+V</strong> and speak your command. Release to process. Perfect for quick navigation and actions.
            </p>
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
            <h3 className="font-semibold text-lg mb-3">⌨️ Keyboard Shortcuts</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="font-mono bg-muted px-2 py-1 rounded">Hold Ctrl+V</dt>
                <dd className="text-muted-foreground">Push-to-talk voice commands</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-mono bg-muted px-2 py-1 rounded">Ctrl+K</dt>
                <dd className="text-muted-foreground">Focus search</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-mono bg-muted px-2 py-1 rounded">?</dt>
                <dd className="text-muted-foreground">Show this help dialog</dd>
              </div>
            </dl>
          </section>

          <section>
            <h3 className="font-semibold text-lg mb-3">💡 Tips</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• <strong>For natural conversations:</strong> Use the floating mic button (bottom-right)</li>
              <li>• <strong>For quick actions:</strong> Hold Ctrl+V, speak, then release</li>
              <li>• Voice commands work on any page</li>
              <li>• Say &ldquo;what can I say&rdquo; for command list</li>
              <li>• All features are fully keyboard accessible</li>
              <li>• <strong>Screen readers:</strong> Click anywhere to stop speech</li>
            </ul>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
};
