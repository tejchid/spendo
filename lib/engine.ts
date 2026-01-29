// lib/engine.ts

import { Transaction, MerchantStats } from './types';

export function calculateMerchantStats(transactions: Transaction[]): Map<string, MerchantStats> {
  const statsMap = new Map<string, MerchantStats>();

  const expenses = transactions.filter(t => t.amount < 0);

  expenses.forEach(tx => {
    const merchant = tx.merchantClean;
    const amount = Math.abs(tx.amount);

    if (!statsMap.has(merchant)) {
      statsMap.set(merchant, {
        merchant,
        median: 0,
        count: 0,
        total: 0,
      });
    }

    const stats = statsMap.get(merchant)!;
    stats.count += 1;
    stats.total += amount;
  });

  // Calculate median for each merchant
  statsMap.forEach((stats, merchant) => {
    const merchantTransactions = expenses
      .filter(t => t.merchantClean === merchant)
      .map(t => Math.abs(t.amount))
      .sort((a, b) => a - b);

    const mid = Math.floor(merchantTransactions.length / 2);
    stats.median = merchantTransactions.length % 2 === 0
      ? (merchantTransactions[mid - 1] + merchantTransactions[mid]) / 2
      : merchantTransactions[mid];
  });

  return statsMap;
}

export function detectAnomalies(transactions: Transaction[], stats: Map<string, MerchantStats>): Transaction[] {
  return transactions.filter(tx => {
    if (tx.amount >= 0) return false; // Only check expenses

    const merchantStats = stats.get(tx.merchantClean);
    if (!merchantStats) return false;

    const amount = Math.abs(tx.amount);
    return amount > merchantStats.median * 2.5 && amount > 50;
  });
}