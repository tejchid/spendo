// components/InsightCard.tsx

'use client';

import { Insight } from '@/lib/types';
import { AlertCircle, TrendingUp, Info } from 'lucide-react';
import { useState } from 'react';

export default function InsightCard({ insight }: { insight: Insight }) {
  const [showWhy, setShowWhy] = useState(false);

  const getIcon = () => {
    switch (insight.type) {
      case 'SPIKE':
        return <AlertCircle className="w-5 h-5" />;
      case 'FREQUENCY_CREEP':
        return <TrendingUp className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getSeverityColor = () => {
    switch (insight.severity) {
      case 'high':
        return 'bg-red-500/10 border-red-500/20 text-red-400';
      case 'medium':
        return 'bg-orange-500/10 border-orange-500/20 text-orange-400';
      default:
        return 'bg-blue-500/10 border-blue-500/20 text-blue-400';
    }
  };

  return (
    <div className={`border rounded-xl p-4 ${getSeverityColor()}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1">
          <div className="mt-0.5">{getIcon()}</div>
          <div className="flex-1">
            <p className="text-sm leading-relaxed">{insight.message}</p>
          </div>
        </div>
        
        <button
          onClick={() => setShowWhy(!showWhy)}
          className="text-xs opacity-60 hover:opacity-100 transition-opacity"
        >
          Why?
        </button>
      </div>

      {showWhy && (
        <div className="mt-3 pt-3 border-t border-current/20 text-xs opacity-80">
          <p className="font-mono">
            {insight.type === 'SPIKE' && insight.data.median && (
              <>Median: ${insight.data.median.toFixed(2)} | Current: ${insight.data.amount.toFixed(2)} | Threshold: 2.5x</>
            )}
            {insight.type === 'FREQUENCY_CREEP' && (
              <>Visits: {insight.data.count} | Total: ${insight.data.total.toFixed(2)}</>
            )}
          </p>
        </div>
      )}
    </div>
  );
}