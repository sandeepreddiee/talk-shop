import { useEffect, useState } from 'react';
import { Card } from './ui/card';
import { activityService } from '@/services/activityService';
import { Activity, Mic, Keyboard, BarChart3 } from 'lucide-react';

export const AccessibilityDashboard = () => {
  const [stats, setStats] = useState({
    totalActions: 0,
    voiceCommands: 0,
    keyboardShortcuts: 0,
    recentActions: [] as Array<{ type: string; count: number }>
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      const data = await activityService.getActivityStats();
      setStats(data);
      setLoading(false);
    };
    loadStats();
  }, []);

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-muted rounded w-1/3"></div>
          <div className="h-24 bg-muted rounded"></div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Accessibility Metrics</h2>
        <p className="text-muted-foreground">
          Track how you interact with the platform
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Activity className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Actions</p>
              <p className="text-3xl font-bold">{stats.totalActions}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Mic className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Voice Commands</p>
              <p className="text-3xl font-bold">{stats.voiceCommands}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Keyboard className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Keyboard Shortcuts</p>
              <p className="text-3xl font-bold">{stats.keyboardShortcuts}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Most Used Features</h3>
        </div>
        <div className="space-y-3">
          {stats.recentActions.length > 0 ? (
            stats.recentActions.map((action, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm capitalize">
                  {action.type.replace(/_/g, ' ')}
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary"
                      style={{ 
                        width: `${(action.count / stats.totalActions) * 100}%` 
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium">{action.count}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              No activity data yet. Start using the platform to see your metrics!
            </p>
          )}
        </div>
      </Card>

      <Card className="p-6 bg-primary/5 border-primary/20">
        <h3 className="text-lg font-semibold mb-2">Accessibility Impact</h3>
        <p className="text-muted-foreground">
          Your usage demonstrates the effectiveness of voice-first and keyboard-accessible design. 
          These metrics show how assistive technologies enable independent shopping experiences.
        </p>
      </Card>
    </div>
  );
};
