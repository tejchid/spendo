// lib/narrator.ts

import { Transaction, Insight, MerchantStats } from './types';

export function generateInsights(
  transactions: Transaction[],
  stats: Map<string, MerchantStats>,
  anomalies: Transaction[]
): Insight[] {
  const insights: Insight[] = [];

  // 1. SPIKE ANOMALIES (out-of-character spending)
  anomalies.slice(0, 2).forEach(tx => {
    const merchantStats = stats.get(tx.merchantClean);
    if (!merchantStats) return;

    const amount = Math.abs(tx.amount);
    const median = merchantStats.median;
    const date = tx.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    insights.push({
      type: 'SPIKE',
      severity: 'high',
      message: `You usually spend $${median.toFixed(2)} at ${tx.merchantClean}, but on ${date} you spent $${amount.toFixed(2)}. What happened?`,
      data: { merchant: tx.merchantClean, amount, median, date: tx.date },
    });
  });

  // 2. STEALTH SUBSCRIPTION HIKES
  const subscriptionHikes = detectSubscriptionHikes(transactions);
  subscriptionHikes.forEach(hike => {
    insights.push({
      type: 'STEALTH_HIKE',
      severity: 'high',
      message: `Heads up: ${hike.merchant} quietly raised its price from $${hike.oldPrice.toFixed(2)} to $${hike.newPrice.toFixed(2)}. That's +$${hike.delta.toFixed(2)}/month.`,
      data: hike,
    });
  });

  // 3. FREQUENCY CREEP (visiting merchants more often)
  stats.forEach((merchantStats, merchant) => {
    if (merchantStats.count >= 8) {
      insights.push({
        type: 'FREQUENCY_CREEP',
        severity: 'medium',
        message: `You visited ${merchant} ${merchantStats.count} times this month. That's adding up to $${merchantStats.total.toFixed(2)}.`,
        data: { merchant, count: merchantStats.count, total: merchantStats.total },
      });
    }
  });

  // 4. NEW MERCHANTS (first-time charges)
  const newMerchants = detectNewMerchants(transactions);
  newMerchants.slice(0, 2).forEach(tx => {
    const amount = Math.abs(tx.amount);
    insights.push({
      type: 'NEW_MERCHANT',
      severity: 'medium',
      message: `New charge detected: ${tx.merchantClean} ($${amount.toFixed(2)}). First time seeing this merchant.`,
      data: { merchant: tx.merchantClean, amount, date: tx.date },
    });
  });

  // 5. CATEGORY SUBSTITUTION (spending shifted, not reduced)
  const substitutions = detectCategorySubstitution(transactions);
  substitutions.forEach(sub => {
    insights.push({
      type: 'SUBSTITUTION',
      severity: 'medium',
      message: `${sub.categoryDown} is down $${sub.deltaDown.toFixed(0)}, but ${sub.categoryUp} is up $${sub.deltaUp.toFixed(0)}. You didn't save—you just shifted spending.`,
      data: sub,
    });
  });

  // Sort by severity (high first) and limit to top 5
  return insights
    .sort((a, b) => {
      const severityOrder = { high: 0, medium: 1, low: 2 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    })
    .slice(0, 5);
}

// Helper: Detect subscription price increases
function detectSubscriptionHikes(transactions: Transaction[]): Array<{
  merchant: string;
  oldPrice: number;
  newPrice: number;
  delta: number;
}> {
  const hikes: Array<{ merchant: string; oldPrice: number; newPrice: number; delta: number }> = [];
  
  const subscriptionCategories = ['Subscriptions'];
  const subscriptions = transactions.filter(t => 
    subscriptionCategories.includes(t.category) && t.amount < 0
  );

  const merchantPrices = new Map<string, number[]>();
  subscriptions.forEach(tx => {
    const prices = merchantPrices.get(tx.merchantClean) || [];
    prices.push(Math.abs(tx.amount));
    merchantPrices.set(tx.merchantClean, prices);
  });

  merchantPrices.forEach((prices, merchant) => {
    if (prices.length < 2) return;
    
    const sorted = prices.sort((a, b) => a - b);
    const oldPrice = sorted[0];
    const newPrice = sorted[sorted.length - 1];
    const delta = newPrice - oldPrice;

    if (delta > 3 && delta / oldPrice > 0.15) {
      hikes.push({ merchant, oldPrice, newPrice, delta });
    }
  });

  return hikes;
}

// Helper: Detect new merchants (first appearance)
function detectNewMerchants(transactions: Transaction[]): Transaction[] {
  const sortedTx = [...transactions].sort((a, b) => a.date.getTime() - b.date.getTime());
  const seenMerchants = new Set<string>();
  const newMerchants: Transaction[] = [];

  sortedTx.forEach(tx => {
    if (!seenMerchants.has(tx.merchantClean) && Math.abs(tx.amount) > 30) {
      newMerchants.push(tx);
    }
    seenMerchants.add(tx.merchantClean);
  });

  return newMerchants.filter(tx => tx.date.getMonth() === new Date().getMonth());
}

// Helper: Detect category substitution
function detectCategorySubstitution(transactions: Transaction[]): Array<{
  categoryDown: string;
  categoryUp: string;
  deltaDown: number;
  deltaUp: number;
}> {
  const now = new Date();
  const currentMonth = transactions.filter(t => 
    t.date.getMonth() === now.getMonth() && t.amount < 0
  );
  const lastMonth = transactions.filter(t => 
    t.date.getMonth() === now.getMonth() - 1 && t.amount < 0
  );

  const currentByCategory = groupByCategory(currentMonth);
  const lastByCategory = groupByCategory(lastMonth);

  const substitutions: Array<{
    categoryDown: string;
    categoryUp: string;
    deltaDown: number;
    deltaUp: number;
  }> = [];

  // Find categories that went down
  lastByCategory.forEach((lastTotal, category) => {
    const currentTotal = currentByCategory.get(category) || 0;
    const delta = currentTotal - lastTotal;

    if (delta < -50) {
      // Find a category that went up by a similar amount
      currentByCategory.forEach((currentTotal2, category2) => {
        const lastTotal2 = lastByCategory.get(category2) || 0;
        const delta2 = currentTotal2 - lastTotal2;

        if (delta2 > 50 && Math.abs(Math.abs(delta) - delta2) < 100) {
          substitutions.push({
            categoryDown: category,
            categoryUp: category2,
            deltaDown: Math.abs(delta),
            deltaUp: delta2,
          });
        }
      });
    }
  });

  return substitutions.slice(0, 1);
}

function groupByCategory(transactions: Transaction[]): Map<string, number> {
  const map = new Map<string, number>();
  transactions.forEach(tx => {
    const total = map.get(tx.category) || 0;
    map.set(tx.category, total + Math.abs(tx.amount));
  });
  return map;
}
