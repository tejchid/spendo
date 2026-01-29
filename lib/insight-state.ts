// Manages insight lifecycle: new, acknowledged, snoozed, hidden

export type InsightStatus = 'new' | 'acknowledged' | 'snoozed' | 'hidden';

export interface InsightState {
  insightId: string;
  status: InsightStatus;
  timestamp: Date;
  snoozeUntil?: Date;
}

const STATE_KEY = 'spendo_insight_states';

function generateInsightId(insight: any): string {
  // Create unique ID based on type, merchant, and key data points
  const merchant = insight.data?.merchant || 'unknown';
  const type = insight.type;
  
  // Add data-specific identifiers to make ID truly unique
  let dataStr = '';
  if (insight.data) {
    if (insight.data.oldValue !== undefined) dataStr += `-${insight.data.oldValue}`;
    if (insight.data.newValue !== undefined) dataStr += `-${insight.data.newValue}`;
    if (insight.data.current !== undefined) dataStr += `-${insight.data.current}`;
    if (insight.data.date) dataStr += `-${new Date(insight.data.date).getTime()}`;
    if (insight.data.frequency !== undefined) dataStr += `-${insight.data.frequency}`;
  }
  
  const uniqueStr = `${type}-${merchant}${dataStr}`;
  
  // Create a simple hash
  let hash = 0;
  for (let i = 0; i < uniqueStr.length; i++) {
    const char = uniqueStr.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  return `${type}-${Math.abs(hash).toString(36)}`;
}

export function getInsightId(insight: { type: string; data: any }): string {
  return generateInsightId(insight);
}

export function saveInsightState(insightId: string, status: InsightStatus, snoozeUntil?: Date): void {
  if (typeof window === 'undefined') return;
  
  const existing = loadInsightStates();
  existing.set(insightId, {
    insightId,
    status,
    timestamp: new Date(),
    snoozeUntil,
  });
  
  const stateArray = Array.from(existing.values()).map(state => ({
    ...state,
    timestamp: state.timestamp.toISOString(),
    snoozeUntil: state.snoozeUntil?.toISOString(),
  }));
  
  localStorage.setItem(STATE_KEY, JSON.stringify(stateArray));
}

export function loadInsightStates(): Map<string, InsightState> {
  if (typeof window === 'undefined') return new Map();
  
  const stored = localStorage.getItem(STATE_KEY);
  if (!stored) return new Map();
  
  try {
    const parsed = JSON.parse(stored);
    const map = new Map<string, InsightState>();
    
    parsed.forEach((item: any) => {
      map.set(item.insightId, {
        ...item,
        timestamp: new Date(item.timestamp),
        snoozeUntil: item.snoozeUntil ? new Date(item.snoozeUntil) : undefined,
      });
    });
    
    return map;
  } catch {
    return new Map();
  }
}

export function shouldShowInsight(insightId: string): boolean {
  const states = loadInsightStates();
  const state = states.get(insightId);
  
  if (!state) return true;
  
  if (state.status === 'hidden') return false;
  if (state.status === 'acknowledged') return false;
  
  if (state.status === 'snoozed' && state.snoozeUntil) {
    return new Date() > state.snoozeUntil;
  }
  
  return true;
}

export function filterVisibleInsights<T extends { type: string; data: any }>(insights: T[]): T[] {
  return insights.filter(insight => {
    const id = getInsightId(insight);
    return shouldShowInsight(id);
  });
}
