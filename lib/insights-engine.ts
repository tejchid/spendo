import { Transaction } from './types';
import {
  detectSubscriptionPriceIncreases,
  detectSpendingSpikes,
  detectFrequencyIncreases,
  detectCategoryShifts,
} from './detectors';
import { filterVisibleInsights } from './insight-state';

/**
 * Canonical Insight shape for generation.
 * MUST include `id`.
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

function makeInsightId(type: string, key: string) {
  return `${type}:${key}`.toLowerCase();
}

export function generateRealInsights(transactions: Transaction[]): Insight[] {
  const insights: Insight[] = [];

  const priceIncreases = detectSubscriptionPriceIncreases(transactions);
  const spikes = detectSpendingSpikes(transactions);
  const frequencyIncreases = detectFrequencyIncreases(transactions);
  const shifts = detectCategoryShifts(transactions);

  priceIncreases.forEach(d => {
    insights.push({
      id: makeInsightId(
        'SUBSCRIPTION_PRICE_INCREASE',
        `${d.merchant}-${d.data.oldValue}-${d.data.newValue}`
      ),
      type: 'SUBSCRIPTION_PRICE_INCREASE',
      severity: d.severity,
      message: `${d.merchant} increased from $${d.data.oldValue.toFixed(
        2
      )} to $${d.data.newValue.toFixed(2)}`,
      detail: `That's $${d.data.yearlyImpact.toFixed(0)} more per year`,
      data: { merchant: d.merchant, ...d.data },
    });
  });

  spikes.slice(0, 5).forEach(d => {
    insights.push({
      id: makeInsightId(
        'SPENDING_SPIKE',
        `${d.merchant}-${d.data.current}`
      ),
      type: 'SPENDING_SPIKE',
      severity: d.severity,
      message: `Unusual charge at ${d.merchant}: $${d.data.current.toFixed(
        2
      )}`,
      detail: `Your typical amount is $${d.data.baseline.toFixed(
        2
      )} (${d.data.multiplier.toFixed(1)}× higher)`,
      data: { merchant: d.merchant, ...d.data },
    });
  });

  frequencyIncreases.forEach(d => {
    insights.push({
      id: makeInsightId(
        'FREQUENCY_INCREASE',
        `${d.merchant}-${d.data.frequency}`
      ),
      type: 'FREQUENCY_INCREASE',
      severity: d.severity,
      message: `${d.merchant}: ${d.data.frequency} visits recently`,
      detail: `Previously ${d.data.previousFrequency} visits. Total: $${d.data.total.toFixed(
        2
      )}`,
      data: { merchant: d.merchant, ...d.data },
    });
  });

  shifts.slice(0, 1).forEach(d => {
    insights.push({
      id: makeInsightId(
        'CATEGORY_SHIFT',
        `${d.data.fromCategory}-${d.data.toCategory}`
      ),
      type: 'CATEGORY_SHIFT',
      severity: 'medium',
      message: `Spending shifted from ${d.data.fromCategory} to ${d.data.toCategory}`,
      detail: `${d.data.fromCategory} down $${d.data.decreaseAmount.toFixed(
        0
      )}, ${d.data.toCategory} up $${d.data.increaseAmount.toFixed(0)}`,
      data: d.data,
    });
  });

  const order = { high: 0, medium: 1, low: 2 } as const;
  insights.sort((a, b) => order[a.severity] - order[b.severity]);

  return filterVisibleInsights(insights);
}
