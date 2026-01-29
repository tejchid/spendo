// components/InsightFeed.tsx

'use client';

import { useState } from 'react';
import { Insight } from '@/lib/types';
import InsightActionCard from './InsightActionCard';
import { Sparkles } from 'lucide-react';

interface InsightFeedProps {
  insights: Insight[];
}

export default function InsightFeed({ insights: initialInsights }: InsightFeedProps) {
  const [insights, setInsights] = useState(initialInsights);

  const handleAction = (insightId?: string) => {
    setInsights(prev => prev.filter(i => i.id !== insightId));
  };

  if (insights.length === 0) {
    return (
      <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-12 text-center">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-8 h-8 text-emerald-600" />
        </div>
        <h3 className="text-xl font-bold text-emerald-900 mb-2">All clear!</h3>
        <p className="text-emerald-700">
          No unusual patterns detected. Upload more data to see insights.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {insights.map((insight) => (
        <InsightActionCard
          key={insight.id}
          insight={insight}
          onAction={() => handleAction(insight.id)}
        />
      ))}
    </div>
  );
}