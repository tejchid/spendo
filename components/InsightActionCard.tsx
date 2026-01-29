'use client';

import { useState } from 'react';
import { saveInsightState } from '@/lib/user-state';
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

/**
 * Local, canonical Insight shape for this component.
 * This avoids TS resolving a stale or shadowed Insight type.
 */
interface Insight {
  id: string;
  type:
    | 'SUBSCRIPTION_PRICE_INCREASE'
    | 'SPENDING_SPIKE'
    | 'FREQUENCY_INCREASE'
    | 'CATEGORY_SHIFT';
  severity: 'high' | 'medium' | 'low';
  message: string;
  detail?: string;
  data: any;
  requiresConfirmation?: boolean;
  confirmationPrompt?: string;
}

interface InsightActionCardProps {
  insight: Insight;
  onAction: () => void;
}

export default function InsightActionCard({
  insight,
  onAction,
}: InsightActionCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isActing, setIsActing] = useState(false);

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

    // id is GUARANTEED here
    saveInsightState(insight.id, action, snoozeUntil);

    setTimeout(onAction, 300);
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
                <button
                  onClick={() => handleAction('confirmed')}
                  className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-current/30 rounded-lg text-sm font-medium hover:bg-current/10"
                >
                  <Check className="w-4 h-4" /> Yes
                </button>
                <button
                  onClick={() => handleAction('snoozed')}
                  className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-current/30 rounded-lg text-sm font-medium hover:bg-current/10"
                >
                  <Clock className="w-4 h-4" /> Later
                </button>
                <button
                  onClick={() => handleAction('dismissed')}
                  className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-current/30 rounded-lg text-sm font-medium hover:bg-current/10"
                >
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
