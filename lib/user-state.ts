// lib/user-state.ts

export interface InsightState {
  insightId: string;
  status: 'confirmed' | 'dismissed' | 'snoozed';
  timestamp: Date;
  snoozeUntil?: Date;
}

const STATE_KEY = 'spendo_insight_state';

export function saveInsightState(insightId: string, status: 'confirmed' | 'dismissed' | 'snoozed', snoozeUntil?: Date): void {
  if (typeof window === 'undefined') return;
  
  const existing = loadInsightStates();
  const newState: InsightState = {
    insightId,
    status,
    timestamp: new Date(),
    snoozeUntil,
  };
  
  existing.set(insightId, newState);
  
  const stateArray = Array.from(existing.entries()).map(([id, state]) => ({
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
}

export function shouldShowInsight(insightId: string): boolean {
  const states = loadInsightStates();
  const state = states.get(insightId);
  
  if (!state) return true; // Never seen before
  
  if (state.status === 'dismissed') return false;
  if (state.status === 'confirmed') return false;
  
  if (state.status === 'snoozed' && state.snoozeUntil) {
    return new Date() > state.snoozeUntil;
  }
  
  return true;
}