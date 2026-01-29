import { Transaction, Insight } from './types';
import { detectSubscriptionPriceIncreases, detectSpendingSpikes, detectFrequencyIncreases, detectCategoryShifts } from './detectors';
import { filterVisibleInsights, getInsightId } from './insight-state';

export function generateRealInsights(transactions: Transaction[]): Insight[] {
  const insights: Insight[] = [];
  
  const priceIncreases = detectSubscriptionPriceIncreases(transactions);
  const spikes = detectSpendingSpikes(transactions);
  const frequencyIncreases = detectFrequencyIncreases(transactions);
  const shifts = detectCategoryShifts(transactions);
  
  priceIncreases.forEach(d => {
    const insight: Insight = {
      type: 'SUBSCRIPTION_PRICE_INCREASE',
      severity: d.severity,
      message: `${d.merchant} increased from $${d.data.oldValue.toFixed(2)} to $${d.data.newValue.toFixed(2)}`,
      detail: `That's $${d.data.yearlyImpact.toFixed(0)} more per year`,
      data: { merchant: d.merchant, ...d.data },
    };
    insights.push(insight);
  });
  
  spikes.slice(0, 5).forEach(d => {
    const insight: Insight = {
      type: 'SPENDING_SPIKE',
      severity: d.severity,
      message: `Unusual charge at ${d.merchant}: $${d.data.current.toFixed(2)}`,
      detail: `Your typical amount is $${d.data.baseline.toFixed(2)} (${d.data.multiplier.toFixed(1)}× higher)`,
      data: { merchant: d.merchant, ...d.data },
    };
    insights.push(insight);
  });
  
  frequencyIncreases.forEach(d => {
    const insight: Insight = {
      type: 'FREQUENCY_INCREASE',
      severity: d.severity,
      message: `${d.merchant}: ${d.data.frequency} visits recently`,
      detail: `Previously ${d.data.previousFrequency} visits. Total: $${d.data.total.toFixed(2)}`,
      data: { merchant: d.merchant, ...d.data },
    };
    insights.push(insight);
  });
  
  shifts.slice(0, 1).forEach(d => {
    const insight: Insight = {
      type: 'CATEGORY_SHIFT',
      severity: 'medium',
      message: `Spending shifted from ${d.data.fromCategory} to ${d.data.toCategory}`,
      detail: `${d.data.fromCategory} down $${d.data.decreaseAmount.toFixed(0)}, ${d.data.toCategory} up $${d.data.increaseAmount.toFixed(0)}`,
      data: d.data,
    };
    insights.push(insight);
  });
  
  // Sort by severity
  const sorted = insights.sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.severity] - order[b.severity];
  });
  
  // Filter out hidden/acknowledged insights
  return filterVisibleInsights(sorted);
}
