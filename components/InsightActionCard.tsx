'use client';

import { useState } from 'react';
import { Insight } from '@/lib/types';
import { getInsightId, saveInsightState } from '@/lib/insight-state';
import {
  AlertCircle,
  TrendingUp,
  Repeat,
  BarChart3,
  ChevronDown,
  Check,
  X,
  Clock,
} from 'lucide-react';

interface InsightActionCardProps {
  insight: Insight;
  onAction: (insightId: string) => void;
}

export default function InsightActionCard({
  insight,
  onAction,
}: InsightActionCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isActing, setIsActing] = useState(false);

  const insightId = getInsightId(insight);

  const getIcon = () => {
    switch (insight.type) {
      case 'SUBSCRIPTION_PRICE_INCREASE':
        return <AlertCircle className="w-5 h-5" />;
      case 'SPENDING_SPIKE':
        return <TrendingUp className="w-5 h-5" />;
      case 'FREQUENCY_INCREASE':
        return <Repeat className="w-5 h-5" />;
      case 'CATEGORY_SHIFT':
        return <BarChart3 className="w-5 h-5" />;
    }
  };

  const getSeverityColor = () => {
    switch (insight.severity) {
      case 'high':
        return 'bg-red-50 border-red-200 text-red-900';
      case 'medium':
        return 'bg-orange-50 border-orange-200 text-orange-900';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-900';
    }
  };

  const handleAction = (action: 'confirmed' | 'dismissed' | 'snoozed') => {
    setIsActing(true);

    const snoozeUntil =
      action === 'snoozed'
        ? new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
        : undefined;

    saveInsightState(insightId, action, snoozeUntil);
    setTimeout(() => onAction(insightId), 300);
  };

  return (
    <div
      className={`border-2 rounded-xl p-6 ${getSeverityColor()} ${
        isActing ? 'opacity-50' : ''
      } transition-all`}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 mt-1">{getIcon()}</div>

        <div className="flex-1 min-w-0">
          <p className="text-base font-medium leading-relaxed">
            {insight.message}
          </p>

          {insight.requiresConfirmation && (
            <div className="mt-4 p-4 bg-white/60 rounded-lg border border-current/20">
              <p className="text-sm font-semibold mb-3">
                {insight.confirmationPrompt}
              </p>
              <div className="flex gap-2">
                <button onClick={() => handleAction('confirmed')}>
                  <Check className="w-4 h-4" /> Yes
                </button>
                <button onClick={() => handleAction('snoozed')}>
                  <Clock className="w-4 h-4" /> Later
                </button>
                <button onClick={() => handleAction('dismissed')}>
                  <X className="w-4 h-4" /> Cancel
                </button>
              </div>
            </div>
          )}

          <button
            onClick={() => setShowDetails(!showDetails)}
            className="mt-3 flex items-center gap-1 text-sm underline"
          >
            Details
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                showDetails ? 'rotate-180' : ''
              }`}
            />
          </button>

          {showDetails && (
            <pre className="mt-3 p-3 bg-white/40 rounded text-xs overflow-x-auto">
              {JSON.stringify(insight.data, null, 2)}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
