import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { usePreferenceStore } from '@/stores/usePreferenceStore';
import { speechService } from '@/services/speechService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const PreferencesPanel = () => {
  const {
    highContrast,
    textSize,
    voiceVerbosity,
    voiceFirstMode,
    updatePreference
  } = usePreferenceStore();

  const handlePreferenceChange = async (key: string, value: any) => {
    updatePreference(key as any, value);
    await speechService.speak(`${key.replace(/([A-Z])/g, ' $1').toLowerCase()} ${value === true ? 'enabled' : value === false ? 'disabled' : 'changed to ' + value}`);
  };

  return (
    <div className="space-y-6" role="region" aria-label="Accessibility Preferences">
      <Card>
        <CardHeader>
          <CardTitle>Display Settings</CardTitle>
          <CardDescription>Customize how content is displayed</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="high-contrast" className="flex-1">
              <div className="font-medium">High Contrast Mode</div>
              <div className="text-sm text-muted-foreground">
                Increase contrast for better visibility
              </div>
            </Label>
            <Switch
              id="high-contrast"
              checked={highContrast}
              onCheckedChange={(checked) => handlePreferenceChange('highContrast', checked)}
              aria-describedby="high-contrast-description"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="text-size">Text Size</Label>
            <Select
              value={textSize}
              onValueChange={(value) => handlePreferenceChange('textSize', value)}
            >
              <SelectTrigger id="text-size" aria-label="Select text size">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
                <SelectItem value="xl">Extra Large</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Voice Settings</CardTitle>
          <CardDescription>Configure voice assistance behavior</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="voice-first" className="flex-1">
              <div className="font-medium">Voice-First Mode</div>
              <div className="text-sm text-muted-foreground">
                Prioritize voice interactions and feedback
              </div>
            </Label>
            <Switch
              id="voice-first"
              checked={voiceFirstMode}
              onCheckedChange={(checked) => handlePreferenceChange('voiceFirstMode', checked)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="voice-verbosity">Voice Response Detail</Label>
            <Select
              value={voiceVerbosity}
              onValueChange={(value) => handlePreferenceChange('voiceVerbosity', value)}
            >
              <SelectTrigger id="voice-verbosity" aria-label="Select voice verbosity">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="short">Short - Brief confirmations</SelectItem>
                <SelectItem value="detailed">Detailed - Full descriptions</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
