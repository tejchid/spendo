'use client';

import { Insight } from '@/lib/types';
import {
  AlertCircle,
  TrendingUp,
  Repeat,
  BarChart3,
} from 'lucide-react';

interface InsightCardProps {
  insight: Insight;
  children?: React.ReactNode;
}

export default function InsightCard({ insight, children }: InsightCardProps) {
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
      default:
        return null;
    }
  };

  const getSeverityColor = () => {
    switch (insight.severity) {
      case 'high':
        return 'border-red-200 bg-red-50 text-red-900';
      case 'medium':
        return 'border-orange-200 bg-orange-50 text-orange-900';
      default:
        return 'border-blue-200 bg-blue-50 text-blue-900';
    }
  };

  return (
    <div className={`border-2 rounded-xl p-6 ${getSeverityColor()}`}>
      <div className="flex items-start gap-4">
        <div className="mt-1 flex-shrink-0">{getIcon()}</div>

        <div className="flex-1 min-w-0">
          <p className="text-base font-medium leading-relaxed">
            {insight.message}
          </p>

          {children && <div className="mt-3">{children}</div>}
        </div>
      </div>
    </div>
  );
}
