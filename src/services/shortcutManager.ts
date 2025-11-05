type ShortcutHandler = (event: KeyboardEvent) => void;

interface Shortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  handler: ShortcutHandler;
  description: string;
}

class ShortcutManager {
  private shortcuts: Map<string, Shortcut> = new Map();
  private isEnabled: boolean = true;

  constructor() {
    this.handleKeyDown = this.handleKeyDown.bind(this);
    window.addEventListener('keydown', this.handleKeyDown);
  }

  private getShortcutKey(shortcut: Omit<Shortcut, 'handler' | 'description'>): string {
    const parts = [];
    if (shortcut.ctrl) parts.push('ctrl');
    if (shortcut.shift) parts.push('shift');
    if (shortcut.alt) parts.push('alt');
    parts.push(shortcut.key.toLowerCase());
    return parts.join('+');
  }

  register(shortcut: Shortcut): void {
    const key = this.getShortcutKey(shortcut);
    this.shortcuts.set(key, shortcut);
  }

  unregister(shortcut: Omit<Shortcut, 'handler' | 'description'>): void {
    const key = this.getShortcutKey(shortcut);
    this.shortcuts.delete(key);
  }

  private handleKeyDown(event: KeyboardEvent): void {
    if (!this.isEnabled) return;

    const target = event.target as HTMLElement;
    const isEditable = target.tagName === 'INPUT' || 
                      target.tagName === 'TEXTAREA' || 
                      target.isContentEditable;

    const parts = [];
    if (event.ctrlKey || event.metaKey) parts.push('ctrl');
    if (event.shiftKey) parts.push('shift');
    if (event.altKey) parts.push('alt');
    parts.push(event.key.toLowerCase());
    
    const key = parts.join('+');
    const shortcut = this.shortcuts.get(key);

    if (shortcut) {
      // Special handling for Ctrl+V: only intercept when not in editable field
      if (event.key.toLowerCase() === 'v' && event.ctrlKey && !event.shiftKey) {
        if (isEditable) {
          return; // Let browser handle paste
        }
      }

      event.preventDefault();
      shortcut.handler(event);
    }
  }

  enable(): void {
    this.isEnabled = true;
  }

  disable(): void {
    this.isEnabled = false;
  }

  getShortcuts(): Array<{ key: string; description: string }> {
    return Array.from(this.shortcuts.values()).map(s => ({
      key: this.getShortcutKey(s),
      description: s.description
    }));
  }

  destroy(): void {
    window.removeEventListener('keydown', this.handleKeyDown);
    this.shortcuts.clear();
  }
}

export const shortcutManager = new ShortcutManager();
