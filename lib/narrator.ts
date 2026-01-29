// lib/narrator.ts

import { Transaction } from './types';

/**
 * Local MerchantStats definition.
 * Stops relying on a missing export from types.ts.
 */
interface MerchantStats {
  merchant: string;
  totalSpent: number;
  transactionCount: number;
  averageSpend: number;
}

/**
 * Local Insight definition for narrator output.
 * Must include `id` to stay compatible with the UI.
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

/**
 * Generate narrative-style insights from transactions + stats.
 * This file is intentionally self-contained to avoid type drift.
 */
export function generateInsights(
  transactions: Transaction[],
  merchantStats: Map<string, MerchantStats>
): Insight[] {
  const insights: Insight[] = [];

  for (const [merchant, stats] of merchantStats.entries()) {
    if (stats.transactionCount >= 10 && stats.averageSpend > 50) {
      insights.push({
        id: `narrator:${merchant}`.toLowerCase(),
        type: 'FREQUENCY_INCREASE',
        severity: 'medium',
        message: `You visit ${merchant} quite often`,
        detail: `Average spend is $${stats.averageSpend.toFixed(2)} across ${stats.transactionCount} transactions.`,
        data: stats,
      });
    }
  }

  return insights;
}
