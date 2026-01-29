'use client';

import { useState } from 'react';
import { Insight } from '@/lib/types';
import { getInsightId } from '@/lib/insight-state';
import InsightActionCard from './InsightActionCard';

interface InsightFeedProps {
  initialInsights: Insight[];
}

export default function InsightFeed({ initialInsights }: InsightFeedProps) {
  const [insights, setInsights] = useState<Insight[]>(initialInsights);

  const handleAction = (insightId: string) => {
    setInsights(prev =>
      prev.filter(i => getInsightId(i) !== insightId)
    );
  };

  if (insights.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        No new insights 🎉
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {insights.map(insight => (
        <InsightActionCard
          key={getInsightId(insight)}
          insight={insight}
          onAction={handleAction}
        />
      ))}
    </div>
  );
}
