import { supabase } from '@/integrations/supabase/client';

export const activityService = {
  logActivity: async (actionType: string, actionDetails?: any): Promise<void> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from('activity_log')
      .insert({
        user_id: user.id,
        action_type: actionType,
        action_details: actionDetails || {}
      });
  },

  getActivityStats: async (): Promise<{
    totalActions: number;
    voiceCommands: number;
    keyboardShortcuts: number;
    recentActions: Array<{ type: string; count: number }>;
  }> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { totalActions: 0, voiceCommands: 0, keyboardShortcuts: 0, recentActions: [] };
    }

    const { data: activities } = await supabase
      .from('activity_log')
      .select('action_type')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1000);

    if (!activities) {
      return { totalActions: 0, voiceCommands: 0, keyboardShortcuts: 0, recentActions: [] };
    }

    const voiceCommands = activities.filter(a => a.action_type.includes('voice')).length;
    const keyboardShortcuts = activities.filter(a => a.action_type.includes('keyboard')).length;

    // Count action types
    const actionCounts: Record<string, number> = {};
    activities.forEach(a => {
      actionCounts[a.action_type] = (actionCounts[a.action_type] || 0) + 1;
    });

    const recentActions = Object.entries(actionCounts)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalActions: activities.length,
      voiceCommands,
      keyboardShortcuts,
      recentActions
    };
  }
};
